import { FastifyInstance } from 'fastify';
import app from './app';

const server: FastifyInstance = app();

// let's start the server
const port = Number.parseInt(
  process.env.PORT == null || process.env.PORT == ''
    ? '3000' : process.env.PORT, 10
);
const host = process.env.HOST == null || process.env.HOST == ''
  ? '0.0.0.0' : process.env.HOST;

server.listen(port, host, (err: Error, address: string) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  server.swagger();
  console.debug(`Server listening at ${address}`);
});

export default server;