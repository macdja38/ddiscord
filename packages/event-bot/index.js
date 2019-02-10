const Client = require('discord-client');

const client = new Client(process.env.TOKEN);

client.on('*', (m) => {
  client.channel.createMessage(
    '233647266957623297',
    `\`\`\`\n${JSON.stringify(m).slice(0, 1500)}\`\`\``,
  );
});
