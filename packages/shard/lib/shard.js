const Eris = require('eris');
const { init, QueueConsumer } = require('solace');

init();

async function shard(
  {
    token, firstShardID, lastShardID, maxShards,
  },
  {
    url, vpnName, userName, password, queueName,
  },
) {
  console.log('shard init started');
  const queueConsumer = new QueueConsumer();
  await queueConsumer.connect({
    url,
    vpnName,
    userName,
    password,
  });

  const bot = new Eris(token, {
    firstShardID,
    lastShardID,
    maxShards,
  });

  bot.on('ready', () => { // When the bot is ready
    console.log('Ready!'); // Log 'Ready!'
  });

  bot.on('error', (error) => {
    console.error(error);
  });

  bot.on('rawWS', (packet, shardId) => {
    if (packet.t !== 'PRESENCE_UPDATE') {
      console.log(`shard ${shardId}: Received message of type ${packet.t}`);
    }

    queueConsumer.send(
      queueName,
      JSON.stringify({ ...packet, shardId }),
    );
  });

  console.log('bot connection started');
  bot.connect(); // Get the bot to connect to Discord
}

module.exports = shard;
