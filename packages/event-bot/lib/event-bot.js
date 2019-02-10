const Client = require('discord-client');

async function eventBot({ token, ...options }) {
  const client = new Client(token);

  client.on('*', (m) => {
    client.channel.createMessage(
      '233647266957623297',
      `\`\`\`\n${JSON.stringify(m).slice(0, 1500)}\`\`\``,
    );
  });

  await client.connect(options);
}

module.exports = eventBot;
