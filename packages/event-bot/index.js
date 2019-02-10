const eventBot = require('./lib/event-bot');

const {
  TOKEN,
  SOULLESS_URL,
  SOULLESS_VPN_NAME,
  SOULLESS_USERNAME,
  SOULLESS_PASSWORD,
  SOULLESS_TOPIC_NAME,
} = process.env;

const requiredExistences = {
  TOKEN,
  SOULLESS_URL,
  SOULLESS_VPN_NAME,
  SOULLESS_USERNAME,
  SOULLESS_PASSWORD,
  SOULLESS_TOPIC_NAME,
};

Object.entries(requiredExistences).forEach(([key, value]) => {
  if (typeof value !== 'string' || value < 1) {
    throw new Error(`Please supply ${key}, current value is ${value}`);
  }
});

console.log('Environment validation passed');

eventBot({
  token: TOKEN,
  url: SOULLESS_URL,
  vpnName: SOULLESS_VPN_NAME,
  userName: SOULLESS_USERNAME,
  password: SOULLESS_PASSWORD,
  topicName: SOULLESS_TOPIC_NAME,
})
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
