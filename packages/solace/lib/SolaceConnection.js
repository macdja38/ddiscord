const EventEmitter = require('events');
const solace = require('solclientjs').debug;

const { createMessage } = require('./helpers');

const {
  SessionEventCode: SessionEvent,
  MessageDeliveryModeType,
} = solace;

module.exports = class SolaceConnection extends EventEmitter {
  constructor() {
    super();
    this.session = null;
  }

  /**
   * @param {Object} options
   * @param {string} options.url
   * @param {string} options.vpnName
   * @param {string} options.userName
   * @param {string} options.pass
   */
  connect(options) {
    if (this.session !== null) {
      throw new Error('Already connected');
    }

    this.session = solace.SolclientFactory.createSession(options);

    this.session.on(SessionEvent.UP_NOTICE, () => this.startConsume());
    this.session.on(SessionEvent.CONNECT_FAILED_ERROR, (e) => {
      this.emit('error', e);
    });
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

    this.session.on(SessionEvent.MESSAGE, (message) => {
      const content = JSON.parse(message.getSdtContainer().getValue());
      this.emit(content.t, content);
    });

    this.session.connect();
  }

  reply(message, content) {
    if (this.session === null) {
      throw new Error('Session not started');
    }

    this.session.sendReply(message, createMessage(content));
  }

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
