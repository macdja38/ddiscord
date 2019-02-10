const fetch = require('node-fetch');
const shard = require('./lib/shard');

function getShardInstructions() {
  const options = { method: 'GET' };

  return fetch('http://10.0.22.102:3000/id/', options)
    .then(async (response) => {
      if (response.ok !== true) {
        throw new Error(response.statusText);
      }
      return response.json();
    });
}

const {
  TOKEN,
  SOULLESS_URL,
  SOULLESS_VPN_NAME,
  SOULLESS_USERNAME,
  SOULLESS_PASSWORD,
  SOULLESS_QUEUE_NAME,
} = process.env;

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

console.log('Environment validation passed');

function startHeartbeat(id, interval) {
  let retries = 0;

  setInterval(() => {
    const options = { method: 'PATCH' };

    fetch(`http://10.0.22.102:3000/id/${id}/heartbeat`, options)
      .then(async (response) => {
        if (response.ok !== true) {
          throw new Error(response.statusText);
        }
        retries = 0;
        return response.json();
      })
      .catch((error) => {
        if (retries >= 3) {
          console.error(error);
          process.exit(2);
        }
      });
  }, interval);
}

getShardInstructions()
  .then((shardInstructions) => {
    startHeartbeat(shardInstructions.firstShardID, shardInstructions.heartbeat);

    return shard({
      token: TOKEN,
      firstShardID: shardInstructions.shardID,
      endShardID: shardInstructions.shardID,
      maxShards: shardInstructions.shardTotal,
    }, {
      url: SOULLESS_URL,
      vpnName: SOULLESS_VPN_NAME,
      userName: SOULLESS_USERNAME,
      password: SOULLESS_PASSWORD,
      queueName: SOULLESS_QUEUE_NAME,
    });
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
