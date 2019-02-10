const RainCache = require('raincache');
const {
  init: initSolace,
  createMessage,
  QueueConsumer,
} = require('solace');

initSolace();

async function worker(redisHost, redisPort, {
  url, vpnName, userName, password, queueName, topicNameApplication,
}) {
  const queueConsumer = new QueueConsumer();
  await queueConsumer.connect({
    url, vpnName, userName, password,
  });

  // Load the Amqp Connector
  const { DirectConnector } = RainCache.Connectors;
  // Load the redis storage engine class
  const { RedisStorageEngine } = RainCache.Engines;
  // Use the default options and create a new connector which isn't connected yet
  const con = new DirectConnector();
  con.on('send', (object) => {
    if (object.t !== 'PRESENCE_UPDATE') {
      console.log(`${object.t}: ${object.d && object.d.id}`);
    }
    delete object.message;
    const message = createMessage(JSON.stringify(object));
    // message.setTimeToLive(60 * 1000);
    message.setDestination(
      QueueConsumer.solace.SolclientFactory.createTopicDestination(topicNameApplication),
    );
    message.setDeliveryMode(QueueConsumer.solace.MessageDeliveryModeType.DIRECT);
    queueConsumer.session.send(message);
  });

  // on solace queue recieve event
  queueConsumer.on('*', m => con.receive(m));

  // start consuming the queue of messages
  await queueConsumer.consume(queueName);

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
