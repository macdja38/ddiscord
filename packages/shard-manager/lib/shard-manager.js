const App = require('express');

const STATES = {
  ACTIVE: 0,
  DEAD: 1,
};

Object.freeze(STATES);

const TIMEOUT = 20000;

function getUpdatedShardState(now, shard) {
  if (shard.state === STATES.ACTIVE && shard.updated < (now - TIMEOUT)) {
    return Object.assign({}, shard, {
      state: STATES.DEAD,
    });
  }
  return shard;
}

function getRefreshedShard(shard) {
  return Object.assign({}, shard, {
    state: STATES.ACTIVE,
    updated: Date.now(),
  });;
}

function getUpdatedShards(shards) {
  const now = Date.now();
  return shards.map(getUpdatedShardState.bind(null, now));
}

function shardManager(startID, endID, shardTotal) {
  let shards = new Array(endID - startID + 1).fill(0).map((value, index) => (
    {
      state: STATES.DEAD,
      id: index + startID,
      updated: Date.now(),
    }));

  function calculateIndex(id) {
    return id - startID;
  }

  setTimeout(() => {
    shards = getUpdatedShards(shards);
  }, 10000);

  const app = App();

  app.get('/id/', (req, res) => {
    shards = getUpdatedShards(shards);

    const shard = shards.find(s => s.state === STATES.DEAD);

    console.log(shard, shards);

    if (shard) {
      const index = calculateIndex(shard.id);

      shards[index] = getRefreshedShard(shard);

      res.json({
        shardID: shard.id,
        shardTotal,
        heartbeat: TIMEOUT / 3 - 200,
        success: true,
      });

      return;
    }

    res.status(409).json({
      repeat: 2000,
    });
  });

  app.patch('/id/:id/heartbeat', (req, res) => {
    const { id } = req.params;
    const index = calculateIndex(id);

    shards[index] = getRefreshedShard(shards[index]);

    res.send({ success: true });
  });

  app.listen(3000, () => {
    console.log('listening on *:3000');
  });
}

module.exports = shardManager;
