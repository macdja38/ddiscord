const Eris = require('eris');

function shard(token, firstShardID, lastShardID) {
  const bot = new Eris(token, {
    firstShardID,
    lastShardID,
  });

  bot.on('ready', () => { // When the bot is ready
    console.log('Ready!'); // Log 'Ready!'
  });

  bot.on('rawWS', (packet, shardId) => {
    // send to solice here
  });

  bot.connect(); // Get the bot to connect to Discord
}

module.exports = shard;
