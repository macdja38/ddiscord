const shardManager = require('./lib/shard-manager');

const START_SHARD = parseInt(process.env.START_SHARD, 10);
const END_SHARD = parseInt(process.env.END_SHARD, 10);
const MAX_SHARDS = parseInt(process.env.MAX_SHARDS, 10);

if (Number.isNaN(START_SHARD) || Number.isNaN(END_SHARD)) {
  throw new Error(
    `Please supply a valid START_SHARD and END_SHARD, we got ${START_SHARD} and ${END_SHARD}`,
  );
}

if (START_SHARD > END_SHARD) {
  throw new Error('START_SHARD must be <= END_SHARD');
}

if (Number.isNaN(MAX_SHARDS)) {
  throw new Error(
    `Please supply a valid MAX_SHARDS, we got ${MAX_SHARDS}`,
  );
}

shardManager(START_SHARD, END_SHARD, MAX_SHARDS);
