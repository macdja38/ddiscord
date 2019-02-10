const Client = require('discord-client');

const code = (content, type = '') => `\`\`\`${type}\n${content}\`\`\``;

const state = { events: 0, start: Date.now() };
async function eventBot({ token, topicName, ...options }) {
  const client = new Client(token);

  client.on('*', () => {
    state.events += 1;
  });

  client.on('MESSAGE_CREATE', async ({ d: { content, channel_id: channelId }, shardId }) => {
    try {
      if (!content.startsWith('?event-bot')) {
        return;
      }
      console.log(`Handling command: ${content}`);
      const command = content.substring('?event-bot '.length);

      switch (command) {
        case 'total':
          await client.channel.createMessage(channelId, code(`(${shardId}) Total events to date: ${state.events}`));
          break;
        case 'per second': {
          const average = state.events / (Date.now() - state.start) * 1000;
          await client.channel.createMessage(channelId, code(`(${shardId}) Average events per second: ${average}`));
          break;
        }
        default:
          console.log('did not match any command');
          break;
      }
    } catch (e) {
      console.error(e);
    }
  });

  await client.connect(options);
  client.subscribe(topicName);
}

module.exports = eventBot;
