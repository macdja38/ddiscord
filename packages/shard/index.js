const shard = require('./lib/shard');

const {
  TOKEN,
  SOULLESS_URL,
  SOULLESS_VPN_NAME,
  SOULLESS_USERNAME,
  SOULLESS_PASSWORD,
  SOULLESS_QUEUE_NAME,
} = process.env;

const START_SHARD = parseInt(process.env.START_SHARD, 10);
const END_SHARD = parseInt(process.env.END_SHARD, 10);
const MAX_SHARDS = parseInt(process.env.MAX_SHARDS, 10);

const requiredExistences = {
  TOKEN,
  SOULLESS_URL,
  SOULLESS_VPN_NAME,
  SOULLESS_USERNAME,
  SOULLESS_PASSWORD,
  SOULLESS_QUEUE_NAME,
};

Object.entries(requiredExistences).forEach(([key, value]) => {
  if (typeof value !== 'string' || value < 1) {
    throw new Error(`Please supply ${key}, current value is ${value}`);
  }
});

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

shard({
  token: TOKEN,
  startShardID: START_SHARD,
  endShardID: END_SHARD,
  maxShards: MAX_SHARDS,
}, {
  url: SOULLESS_URL,
  vpnName: SOULLESS_VPN_NAME,
  userName: SOULLESS_USERNAME,
  password: SOULLESS_PASSWORD,
  queueName: SOULLESS_QUEUE_NAME,
})
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
