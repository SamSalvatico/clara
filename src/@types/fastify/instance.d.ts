/* eslint-disable no-unused-vars */
import fastifyMongodb from 'fastify-mongodb';

declare module 'fastify' {
  interface FastifyInstance {
    mongo: fastifyMongodb.FastifyMongoObject & fastifyMongodb.FastifyMongoNestedObject;
  }
}
