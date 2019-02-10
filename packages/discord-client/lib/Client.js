const SnowTransfer = require('snowtransfer');
const { init, TopicSubscriber } = require('solace');

init();

module.exports = class Client extends TopicSubscriber {
  constructor(token, options = undefined) {
    super();
    this.snowTransfer = new SnowTransfer(token, options);
  }

  get channel() {
    return this.snowTransfer.channel;
  }

  get user() {
    return this.snowTransfer.user;
  }

  get emoji() {
    return this.snowTransfer.emoji;
  }

  get webhook() {
    return this.snowTransfer.webhook;
  }

  get guild() {
    return this.snowTransfer.guild;
  }

  get invite() {
    return this.snowTransfer.invite;
  }

  get voice() {
    return this.snowTransfer.voice;
  }

  get bot() {
    return this.snowTransfer.bot;
  }

  get auditLog() {
    return this.snowTransfer.auditLog;
  }

  get raven() {
    return this.snowTransfer.raven;
  }
};
