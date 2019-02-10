const Client = require('discord-client');

const code = (content, type = '') => `\`\`\`${type}\n${content}\`\`\``;

const state = { events: 0, start: Date.now() };
async function eventBot({ token, topicName, ...options }) {
  const client = new Client(token);

  client.on('*', () => {
    state.events += 1;
  });

  client.on('MESSAGE_CREATE', ({ d: { content, channel_id: channelId } }) => {
    if (!content.startsWith('?event-bot')) {
      return;
    }
    const command = content.substring(0, '?event-bot '.length);

    switch (command) {
      case 'total':
        client.channel.createMessage(channelId, code(`Total events to date: ${state.events}`));
        break;
      case 'per second': {
        const average = state.events / (Date.now() - state.start) * 1000;
        client.channel.createMessage(channelId, code(`Average events per second: ${average}`));
        break;
      }
      default:
        break;
    }
  });

  await client.connect(options);
  client.subscribe(topicName);
}

module.exports = eventBot;
