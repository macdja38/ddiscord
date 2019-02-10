const RainCache = require('raincache');

function worker(redisHost, redisPort, {
  url, vpnName, userName, password, queueName,
}) {
  // Load the Amqp Connector
  const { DirectConnector } = RainCache.Connectors;
  // Load the redis storage engine class
  const { RedisStorageEngine } = RainCache.Engines;
  // Use the default options and create a new connector which isn't connected yet
  const con = new DirectConnector();
  con.on('send', (object) => {
    console.log(object);
  });

  // on solace queue recieve event
  // con.recieve(object)

  // Create a new uninitialized RainCache instance, set redis as the default storage engine,
  // disable debugging mode and pass an inbound and
  // an outbound connector to receive and forward events
  const cache = new RainCache({
    storage: {
      default: new RedisStorageEngine({
        host: redisHost,
        port: redisPort,
      }),
    },
    debug: false,
  },
  con, con);

  const init = async () => {
    // initialize the cache, the connector and the database connection
    await cache.initialize();
  };
  // Declare an asynchronous init method
  init().then(() => {
    console.log('Cache initialized');
  }).catch(e => console.error(e));
  // Run the init function
}

module.exports = worker;
