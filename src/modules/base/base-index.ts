/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import BaseService from './base-service';
import IndexInterface from './index-interface';
import SchemaInterface from './schema-interface';
import ServiceInterface from './service-interface';
// import BaseSchema from './base-schema';

export default class BaseIndex implements IndexInterface {
  protected prefix: string;

  protected fastifyInstance: FastifyInstance;

  protected service: ServiceInterface;

  protected schema: SchemaInterface;

  constructor(
    fastifyInstance: FastifyInstance,
    serviceToUse: BaseService,
    schema: SchemaInterface,
    routesPrefix: string | null = null,
  ) {
    this.fastifyInstance = fastifyInstance;
    this.service = serviceToUse;
    this.schema = schema;
    this.prefix = routesPrefix == null ? this.service.pathPrefix : routesPrefix;
    this.prefix = this.prefix?.startsWith('/') ? this.prefix : `/${this.prefix}`;
  }

  public register(): void {
    this.registerCrudRoutes();
  }

  protected registerCrudRoutes() {
    this.fastifyInstance.post(
      this.prefix,
      { schema: this.schema.createSchema },
      async (request: FastifyRequest, reply: FastifyReply) => this.create(request, reply),
    );
    this.fastifyInstance.put(
      `${this.prefix}/:id`,
      { schema: this.schema.updateSchema },
      async (request: FastifyRequest, reply: FastifyReply) => this.update(request, reply),
    );
    this.fastifyInstance.get(
      this.prefix,
      { schema: this.schema.getAllSchema },
      async (request: FastifyRequest, reply: FastifyReply) => this.index(request, reply),
    );
    this.fastifyInstance.get(
      `${this.prefix}/:id`,
      { schema: this.schema.getOneSchema },
      async (request: FastifyRequest, reply: FastifyReply) => this.show(request, reply),
    );
    this.fastifyInstance.delete(
      `${this.prefix}/:id`,
      { schema: this.schema.deleteSchema },
      async (request: FastifyRequest, reply: FastifyReply) => this.delete(request, reply),
    );
  }

  public async create(request: FastifyRequest, reply: FastifyReply) {
    const resp = await this.service.create(request.body, reply);
    // console.log(resp);
    return reply.code(201).send(resp);
  }

  public async index(request: FastifyRequest, reply: FastifyReply) {
    const resp = await this.service.index(request, reply);
    // console.log(resp);
    return reply.send(resp);
  }

  public async show(request: any, reply: FastifyReply) {
    const resp = await this.service.show(request.params.id, reply);
    if (resp === undefined || resp == null) {
      return reply.code(404).send(new Error('Item not found'));
    }

    return reply.send(resp);
  }

  public async update(request: any, reply: FastifyReply) {
    const resp = await this.service.update(request.params.id, request.body, reply);
    if (resp === undefined || resp == null) {
      return reply.code(404).send(new Error('Item not found'));
    }
    return reply.send(resp);
  }

  public async delete(request: any, reply: FastifyReply) {
    const resp = await this.service.delete(request.params.id, reply);
    if (resp === undefined || resp == null) {
      return reply.code(404).send(new Error('Item not found'));
    }

    return reply.send(resp);
  }
}
