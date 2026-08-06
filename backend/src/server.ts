import http from 'http';
import { app } from './app';
import { connectDatabase, disconnectDatabase } from './config/database';
import { env } from './config/env';

const server = http.createServer(app);

const start = async (): Promise<void> => {
  await connectDatabase();
  server.listen(env.port, () => {
    console.info(`Sovereign Gold API running on port ${env.port}`);
  });
};

const shutdown = async (signal: string): Promise<void> => {
  console.info(`${signal} received. Shutting down gracefully.`);
  server.close(async () => {
    await disconnectDatabase();
    process.exit(0);
  });
};

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));

void start().catch((error) => {
  console.error(error);
  process.exit(1);
});
