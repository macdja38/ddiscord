const EventEmitter = require('events');
const solace = require('solclientjs').debug;

const SolaceConnection = require('./SolaceConnection');

const SolclientFactory = solace.SolclientFactory;
const SessionEvent = solace.SessionEventCode;
const AckMode = solace.MessageConsumerAcknowledgeMode;
const QueueType = solace.QueueType;

module.exports = class QueueConsumer extends SolaceConnection {
  constructor() {
    super();
    this.subscriptions = new Set();
  }

  connect(...args) {
    super.connect(...args);

    this.session.on(SessionEvent.MESSAGE, (message) => {
      const content = JSON.parse(message.getSdtContainer().getValue());
      const topic = message.getDestination().getName();
      content.topicName = topic;
      content.message = message;
      this.emit(content.t, content);
    });
  }

  subscribe(topic) {
    if (this.session === null) {
      throw new Error('Session not started');
    }

    if (this.subscriptions.has(topic)) {
      throw new Error('Already subscribed');
    }

    this.session.subscribe(
      SolclientFactory.createTopicDestination(topic),
      true, // generate confirmation when subscription is added successfully
      topic, // use topic name as correlation key
      10000, // timeout in 10 sec
    );
    this.subscriptions.add(topic);
  }

  unsubscribe(topic) {
    if (this.session === null) {
      throw new Error('Session not started');
    }

    if (!this.subscriptions.has(topic)) {
      throw new Error('Not subscribed');
    }

    this.session.unsubscribe(
      SolclientFactory.createTopicDestination(topic),
      true,
      topic,
      10000,
    );
    this.subscriptions.delete(topic);
  }
};
