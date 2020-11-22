import dotenv from 'dotenv';
import swaggerOptions from './configs/swagger';
import fastify, { FastifyInstance } from 'fastify';
import ProductIndex from './modules/product/product-index';
import ProductService from './modules/product/product-service';
import Product from './modules/product/product-model';
import ProductSchema from './modules/product/product-schema';
import BundleSchema from './modules/bundle/bundle-schema';
import BundleIndex from './modules/bundle/bundle-index';
import BundleService from './modules/bundle/bundle-service';
import Bundle from './modules/bundle/bundle-model';
import CartSchema from './modules/cart/cart-schema';
import CartIndex from './modules/cart/cart-index';
import CartService from './modules/cart/cart-service';
import Cart from './modules/cart/cart-model';
// import fastify, { FastifyInstance } from 'fastify';

function app(): FastifyInstance {
  try {
    console.log('Initializing server...');
    //initialize .env file management
    dotenv.config();
    //const server: FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({})
    const server: FastifyInstance = fastify({})
    if (server == null) {
      throw new Error("Server is undefined");
    }
    if (swaggerOptions.swagger != null) {
      swaggerOptions.swagger.host = process.env.HOST == null || process.env.HOST == ''
        ? '0.0.0.0' : process.env.HOST;
      swaggerOptions.swagger.host += (':' + (process.env.PORT == null || process.env.PORT == ''
        ? '3000' : process.env.PORT));
    }
    // Docs
    server.register(require('fastify-swagger'), swaggerOptions);
    server.register(require('fastify-mongodb'), {
      // force to close the mongodb connection when app stopped
      // the default value is false
      forceClose: false,
      url: process.env.MONGO_CONNECTION_STRING,
    });
    //register our routes and initialize modules
    initializeRoutes(server);
    return server;
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
}


function initializeRoutes(server: FastifyInstance) {
  const prodSchemaInstance = new ProductSchema();
  const productIndex = new ProductIndex(
    server,
    new ProductService(Product, server, prodSchemaInstance),
    prodSchemaInstance,
    'products'
  );
  productIndex.register();

  const bundleSchemaInstance = new BundleSchema();
  const bundleIndex = new BundleIndex(
    server,
    new BundleService(Bundle, server, bundleSchemaInstance),
    bundleSchemaInstance,
    'bundles'
  );
  bundleIndex.register();

  const cartSchemaInstance = new CartSchema();
  const cartIndex = new CartIndex(
    server,
    new CartService(Cart, server, cartSchemaInstance),
    cartSchemaInstance,
    'carts'
  );
  cartIndex.register();
}

export default app;