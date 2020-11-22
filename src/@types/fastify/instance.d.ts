import * as fastify from "fastify";
import fastifyMongodb from "fastify-mongodb";
import { SwaggerOptions } from "fastify-swagger";
import { Http2Server, Http2ServerRequest, Http2ServerResponse } from "http2";
import { MongoClient } from "mongodb";

declare module 'fastify' {
  interface FastifyInstance {
    mongo: fastifyMongodb.FastifyMongoObject & fastifyMongodb.FastifyMongoNestedObject;
  }
}
