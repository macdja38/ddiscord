const Client = require('discord-client');

async function eventBot({ token, topicName, ...options }) {
  const client = new Client(token);

  client.on('*', (m) => {
    client.channel.createMessage(
      '233647266957623297',
      `\`\`\`json\n${JSON.stringify(m, null, 2).slice(0, 1500)}\`\`\``,
    );
  });

  await client.connect(options);
  client.subscribe(topicName);
}

module.exports = eventBot;
