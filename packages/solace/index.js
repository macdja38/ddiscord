const {
  LogLevel,
  SDTField,
  SDTFieldType,
  SolclientFactory,
  SolclientFactoryProperties,
  SolclientFactoryProfiles,
} = require('solclientjs').debug;

const QueueConsumer = require('./lib/QueueConsumer');
const TopicSubscriber = require('./lib/TopicSubscriber');

function init(logLevel = LogLevel.INFO) {
  const properties = new SolclientFactoryProperties();
  properties.profile = SolclientFactoryProfiles.version10;
  SolclientFactory.init(properties);
  SolclientFactory.setLogLevel(logLevel);
}

function createMessage(content) {
  const message = SolclientFactory.createMessage();
  const sdtContainer = SDTField.create(SDTFieldType.STRING, content);
  message.setSdtContainer(sdtContainer);
  return message;
}

module.exports = {
  createMessage,
  init,
  QueueConsumer,
  TopicSubscriber,
};
