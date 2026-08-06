/**
 * Boots an in-memory MongoDB and exposes its URI so the API can run without a local mongod.
 * Usage: ts-node scripts/dev-memory-server.ts
 */
import { MongoMemoryServer } from 'mongodb-memory-server';

const run = async (): Promise<void> => {
  const server = await MongoMemoryServer.create({ instance: { port: 27017, dbName: 'sovereign_gold_livestock' } });
  console.info(`In-memory MongoDB ready at ${server.getUri()}`);
  process.on('SIGINT', () => void server.stop().then(() => process.exit(0)));
  process.on('SIGTERM', () => void server.stop().then(() => process.exit(0)));
};

void run();
