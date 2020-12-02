import { RegisterOptions } from 'fastify';
import { FastifyDynamicSwaggerOptions } from 'fastify-swagger';

const swaggerOptions: (RegisterOptions & FastifyDynamicSwaggerOptions) = {
  routePrefix: 'documentation',
  exposeRoute: true,
  swagger: {
    info: {
      title: 'clara API',
      description: 'Searching for bundles',
      version: '1.0.0',
    },
    host: 'localhost',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
};

export default swaggerOptions;
