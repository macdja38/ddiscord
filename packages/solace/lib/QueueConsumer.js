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

  consume(queueName) {
    if (this.session === null) {
      throw new Error('Session not started');
    }

    let consumerObj = this.consumers.get(queueName);
    if (consumerObj && consumerObj.consuming) {
      throw new Error('Already consuming');
    }

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
    });
    consumer.on(ConsumerEvent.CONNECT_FAILED_ERROR, (e) => {
      consumerObj.consuming = false;
      this.emit('error', e);
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
      m.acknowledge();
    });

    consumer.connect();
    this.consumers.add(queueName, consumerObj);
  }

  send(queueName, content) {
    super.send(
      SolclientFactory.createDurableQueueDestination(queueName),
      content,
    );
  }
};
