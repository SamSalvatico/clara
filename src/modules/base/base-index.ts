/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import BaseModel from './base-model';
import BaseSchema from './base-schema';
import BaseService from './base-service';
import IndexInterface from './index-interface';
import SchemaInterface from './schema-interface';
import ServiceInterface from './service-interface';
// import BaseSchema from './base-schema';

export default class BaseIndex implements IndexInterface {
  private static _instance: BaseIndex;

  protected prefixValue!: string;

  protected fastifyInstance!: FastifyInstance;

  protected service!: ServiceInterface;

  protected schema!: SchemaInterface;

  constructor(fastifyInstance: FastifyInstance) {
    this.initialize(fastifyInstance);
    this.register();
  }

  public static Instance(fastifyInstance: FastifyInstance) {
    if (!this._instance) {
      this._instance = new this(fastifyInstance);
    }
    return this._instance;
  }

  protected initialize(fastifyInstance: FastifyInstance) {
    this.fastifyInstance = fastifyInstance;
    this.schema = new BaseSchema();
    this.service = BaseService.Instance(BaseModel, fastifyInstance, this.schema);
    this.prefixValue = this.service.pathPrefix;
  }

  get prefix(): string {
    return this.prefixValue?.startsWith('/')
      ? this.prefixValue : `/${this.prefixValue}`;
  }

  protected register(): void {
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
    return reply.code(201).send(resp);
  }

  public async index(request: FastifyRequest, reply: FastifyReply) {
    const resp = await this.service.index(request, reply);
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
