const Eris = require('eris');
const { init, QueueConsumer } = require('solace');

init();

async function shard(token, firstShardID, lastShardID, maxShards) {
  const queueConsumer = new QueueConsumer();
  await queueConsumer.connect({
    url: process.env.SOULLESS_URL,
    vpnName: process.env.SOULLESS_VPN_NAME,
    userName: process.env.SOULLESS_USERNAME,
    password: process.env.SOULLESS_PASSWORD,
  });

  const bot = new Eris(token, {
    firstShardID,
    lastShardID,
    maxShards,
  });

  bot.on('ready', () => { // When the bot is ready
    console.log('Ready!'); // Log 'Ready!'
  });

  bot.on('rawWS', (packet, shardId) => {
    console.log(`shard ${shardId}: Received message of type ${packet.t}`);

    queueConsumer.send(
      process.env.SOULLESS_QUEUE_NAME,
      JSON.stringify({ ...packet, shardId }),
    );
  });

  bot.connect(); // Get the bot to connect to Discord
}

module.exports = shard;
