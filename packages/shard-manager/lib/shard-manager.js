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
  });
}

function getDeadShards(shards) {
  return shards.filter(s => s.state === STATES.DEAD);
}

function getLiveShards(shards) {
  return shards.filter(s => s.state === STATES.ACTIVE);
}


function getUpdatedShards(shards) {
  const now = Date.now();
  const newShards = shards.map(getUpdatedShardState.bind(null, now));
  const deadShards = getDeadShards(shards);
  const liveShards = getLiveShards(shards);
  console.log(`${deadShards.length}/${liveShards.length}/${newShards.length} - status`);
  console.log('dead shards', deadShards);
  return newShards;
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

  setInterval(() => {
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
    console.log(`got heartbeat from ${id}, calculated index ${index}`);

    shards[index] = getRefreshedShard(shards[index]);

    res.send({ success: true });
  });

  app.listen(3000, () => {
    console.log('listening on *:3000');
  });
}

module.exports = shardManager;
