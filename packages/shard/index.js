const shard = require('./lib/shard');

const { token } = process.env;
const startShard = parseInt(process.env.startShard, 10);
const endShard = parseInt(process.env.endShard, 10);

if (typeof token !== 'string' || token.length < 1) {
  throw new Error('Please supply a discord token to login with');
}

if (Number.isNaN(startShard) || Number.isNaN(endShard)) {
  throw new Error(`Please supply a valid stand and end shard, we got ${startShard} and ${endShard}`);
}

shard(token, startShard, endShard);
