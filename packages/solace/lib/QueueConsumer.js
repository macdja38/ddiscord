const solace = require('solclientjs').debug;

const SolaceConnection = require('./SolaceConnection');

const {
  MessageConsumerAcknowledgeMode: AckMode,
  MessageConsumerEventName: ConsumerEvent,
  QueueType,
  SolclientFactory,
} = solace;

module.exports = class QueueConsumer extends SolaceConnection {
  constructor() {
    super();
    this.consumers = new Map();
  }

  /**
   * Start listening for and consuming messages from a queue
   *
   * @param {string} queueName The name of the queue to consume events from
   * @returns {Promise<void>}
   */
  consume(queueName) {
    if (this.session === null) {
      throw new Error('Session not started');
    }

    let consumerObj = this.consumers.get(queueName);
    if (consumerObj && consumerObj.consuming) {
      throw new Error('Already consuming');
    }

    return new Promise((resolve, reject) => {
      consumerObj = {
        consuming: false,
        consumer: this.session.createMessageConsumer({
          queueDescriptor: {
            name: queueName,
            type: QueueType.QUEUE,
          },
          acknowledgeMode: AckMode.CLIENT,
        }),
      };
      const { consumer } = consumerObj;

      consumer.on(ConsumerEvent.UP, () => {
        consumerObj.consuming = true;
        console.debug('Up');
        resolve();
      });
      consumer.on(ConsumerEvent.CONNECT_FAILED_ERROR, (e) => {
        consumerObj.consuming = false;
        reject(e);
      });
      consumer.on(ConsumerEvent.DOWN, () => {
        consumerObj.consuming = false;
        console.debug('Down');
      });
      consumer.on(ConsumerEvent.DOWN_ERROR, (message) => {
        consumerObj.consuming = false;
        this.emit('error', message);
      });
      consumer.on(ConsumerEvent.MESSAGE, (m) => {
        const content = JSON.parse(m.getSdtContainer().getValue());
        content.queueName = queueName;
        content.message = m;
        this.emit(content.t, content);
        this.emit('*', content);
        m.acknowledge();
      });

      consumer.connect();
      this.consumers.set(queueName, consumerObj);
    });
  }

  send(queueName, content) {
    super.send(
      QueueConsumer.getDestination(queueName),
      content,
    );
  }

  static getDestination(queueName) {
    return SolclientFactory.createDurableQueueDestination(queueName);
  }
};
