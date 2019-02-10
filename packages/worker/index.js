const worker = require('./lib/worker');


const {
  REDIS_HOST,
  SOULLESS_URL,
  SOULLESS_VPN_NAME,
  SOULLESS_USERNAME,
  SOULLESS_PASSWORD,
  SOULLESS_QUEUE_NAME,
} = process.env;

const requiredExistences = {
  REDIS_HOST,
  SOULLESS_URL,
  SOULLESS_VPN_NAME,
  SOULLESS_USERNAME,
  SOULLESS_PASSWORD,
  SOULLESS_QUEUE_NAME,
};

const REDIS_PORT = parseInt(process.env.REDIS_PORT, 10);

Object.entries(requiredExistences).forEach(([key, value]) => {
  if (typeof value !== 'string' || value < 1) {
    throw new Error(`Please supply ${key}, current value is ${value}`);
  }
});

if (Number.isNaN(REDIS_PORT)) {
  throw new Error(`Invalid port supplied as ${process.env.RETHINKDB_PORT}`);
}

worker(REDIS_HOST, REDIS_PORT, {
  url: SOULLESS_URL,
  vpnName: SOULLESS_VPN_NAME,
  userName: SOULLESS_USERNAME,
  password: SOULLESS_PASSWORD,
  queueName: SOULLESS_QUEUE_NAME,
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
