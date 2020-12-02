/* eslint-disable no-console */
/* eslint-disable global-require */
import dotenv from 'dotenv';
import fastify, { FastifyInstance } from 'fastify';
import swaggerOptions from './configs/swagger';
import ProductIndex from './modules/product/product-index';
import CartIndex from './modules/cart/cart-index';
// import fastify, { FastifyInstance } from 'fastify';

function initializeRoutes(server: FastifyInstance) {
  ProductIndex.Instance(server);
  CartIndex.Instance(server);
}

function app(theDbConnString?: string): FastifyInstance {
  try {
    // server.log.log('Initializing server...');
    // initialize .env file management
    dotenv.config();
    // const server: FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({})
    const server: FastifyInstance = fastify({ logger: true });
    if (server == null) {
      throw new Error('Server is undefined');
    }
    if (swaggerOptions.swagger != null) {
      swaggerOptions.swagger.host = process.env.HOST == null || process.env.HOST === ''
        ? '0.0.0.0' : process.env.HOST;
      swaggerOptions.swagger.host += (`:${process.env.PORT == null || process.env.PORT === ''
        ? '3000' : process.env.PORT}`);
    }
    server.register(require('fastify-cors'), {
      origin: '*',
      allowedHeaders: ['Origin', 'X-Requested-With', 'Accept', 'Content-Type'],
      exposedHeaders: ['Origin', 'X-Requested-With', 'Accept', 'Content-Type'],
      methods: ['OPTIONS', 'GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
    });
    // Docs
    server.register(require('fastify-swagger'), swaggerOptions);
    server.register(require('fastify-mongodb'), {
      // force to close the mongodb connection when app stopped
      // the default value is false
      forceClose: false,
      url: theDbConnString || process.env.MONGO_CONNECTION_STRING,
    });
    // register our routes and initialize modules
    initializeRoutes(server);
    return server;
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
}

export default app;
