const worker = require('./lib/worker');

const { RETHINKDB_ADDRESS } = process.env;

const RETHINKDB_PORT = parseInt(process.env.RETHINKDB_PORT, 10);

if (Number.isNaN(RETHINKDB_PORT)) {
  throw new Error(`Invalid port supplied as ${process.env.RETHINKDB_PORT}`);
}

worker(RETHINKDB_ADDRESS, RETHINKDB_PORT);
