const EventEmitter = require('events');
const solace = require('solclientjs').debug;

const { createMessage } = require('./helpers');

const {
  SessionEventCode: SessionEvent,
  MessageDeliveryModeType,
} = solace;

module.exports = class SolaceConnection extends EventEmitter {
  static get solace() {
    return solace;
  }

  constructor() {
    super();
    this.session = null;
  }

  /**
   * Connect to the Solace service
   *
   * @param {Object} options
   * @param {string} options.url
   * @param {string} options.vpnName
   * @param {string} options.userName
   * @param {string} options.password
   *
   * @returns {Promise<void>}
   */
  connect(options) {
    if (this.session !== null) {
      throw new Error('Already connected');
    }

    return new Promise((resolve, reject) => {
      this.session = solace.SolclientFactory.createSession(options);

      this.session.on(SessionEvent.UP_NOTICE, () => resolve());
      this.session.on(SessionEvent.CONNECT_FAILED_ERROR, e => reject(e));
      this.session.on(SessionEvent.DISCONNECTED, () => {
        this.consuming = false;
        console.log('Disconnected');
      });
      this.session.on(SessionEvent.SUBSCRIPTION_ERROR, (e) => {
        this.emit('error', e);
      });
      this.session.on(SessionEvent.SUBSCRIPTION_OK, () => {
        if (this.subscribed) {
          this.subscribed = false;
          console.log('Unsubscribed');
        } else {
          this.subscribed = true;
          console.log('Subscribed');
        }
      });

      this.session.connect();
    });
  }

  /**
   * Reply to a message from the queue
   *
   * @param {solace.Message} message The message to reply to
   * @param {string} content The content to send
   */
  reply(message, content) {
    if (this.session === null) {
      throw new Error('Session not started');
    }

    this.session.sendReply(message, createMessage(content));
  }

  /**
   * Send a message
   *
   * @param {solace.Destination} destination The solace destination object
   * representing the target topic/queue
   * @param {string} content The content to send
   * @param {Number} [deliveryMode] The delivery mode to send with from
   * solace.MessageDeliveryModeType
   */
  send(destination, content, deliveryMode = MessageDeliveryModeType.DIRECT) {
    if (this.session === null) {
      throw new Error('Session not started');
    }

    const message = createMessage(content);
    message.setDestination(destination);
    message.setDeliveryMode(deliveryMode);

    this.session.send(message);
  }

  disconnect() {
    if (this.session === null) {
      throw new Error('Not connected');
    }

    this.session.disconnect();
  }
};
