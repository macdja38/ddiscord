const shard = require('./lib/shard');

const { TOKEN } = process.env;
const START_SHARD = parseInt(process.env.START_SHARD, 10);
const END_SHARD = parseInt(process.env.END_SHARD, 10);
const MAX_SHARDS = parseInt(process.env.MAX_SHARDS, 10);

if (typeof TOKEN !== 'string' || TOKEN.length < 1) {
  throw new Error('Please supply a discord token to login with');
}

if (Number.isNaN(START_SHARD) || Number.isNaN(END_SHARD)) {
  throw new Error(
    `Please supply a valid START_SHARD and END_SHARD, we got ${START_SHARD} and ${END_SHARD}`,
  );
}


if (Number.isNaN(MAX_SHARDS)) {
  throw new Error(
    `Please supply a valid MAX_SHARDS, we got ${MAX_SHARDS}`,
  );
}

shard(TOKEN, START_SHARD, END_SHARD, MAX_SHARDS);
