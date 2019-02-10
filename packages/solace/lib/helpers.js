const solace = require('solclientjs').debug;

const {
  LogLevel,
  SDTField,
  SDTFieldType,
  SolclientFactory,
  SolclientFactoryProperties,
  SolclientFactoryProfiles,
} = solace;

function init(logLevel = LogLevel.INFO) {
  const properties = new SolclientFactoryProperties();
  properties.profile = SolclientFactoryProfiles.version10;
  solace.SolclientFactory.init(properties);
  SolclientFactory.setLogLevel(logLevel);
}

/**
 * Create a solace message object
 *
 * @param {string} content
 * @returns {solace.Message}
 */
function createMessage(content) {
  const message = SolclientFactory.createMessage();
  const sdtContainer = SDTField.create(SDTFieldType.STRING, content);
  message.setSdtContainer(sdtContainer);
  return message;
}

module.exports = {
  createMessage,
  init,
};
