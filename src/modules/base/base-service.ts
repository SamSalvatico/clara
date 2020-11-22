import { ObjectId } from 'mongodb';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import dotenv from 'dotenv';

import BaseModel from './base-model';
import ModelInterface, { ModelInterfaceConstructor } from './model-interface';
import SchemaInterface from './schema-interface';
import ServiceInterface from './service-interface';

export default class BaseService implements ServiceInterface {
  protected modelType: ModelInterfaceConstructor;

  protected fastifyInstance: FastifyInstance;

  protected _collection = '';

  protected schema: SchemaInterface;

  constructor(
    modelType: ModelInterfaceConstructor,
    fastifyInstance: FastifyInstance,
    schema: SchemaInterface) {
    dotenv.config();
    this.modelType = modelType;
    this.fastifyInstance = fastifyInstance;
    this.schema = schema;
  }

  get collectionName(): string {
    return this._collection;
  }

  get pathPrefix(): string {
    return `/${this._collection}`;
  }

  public async create(body: any, reply: FastifyReply | null = null): Promise<ModelInterface> {
    try {
      delete body._id;
      const resp = await this.fastifyInstance.mongo.db?.collection(this.collectionName).insertOne(body);
      if (resp == null || resp === undefined || resp.ops.length < 1) {
        // throw new Error("Insert didn't work");
        throw new Error("C'è stato un problema durante la creazione dell'elemento.");
      } else {
        return Object.assign<ModelInterface, any>(new this.modelType(), resp.ops[0]);
      }
    } catch (e) {
      console.error(e);
      throw new Error(e);
    }
  }

  public async show(id: string, reply: FastifyReply | null = null): Promise<ModelInterface | null> {
    try {
      const checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');
      if (checkForHexRegExp.test(id)) {
        const resp = await this.fastifyInstance.mongo.db?.collection(this.collectionName)
          .findOne({ _id: new ObjectId(id) });
        return resp;
      } else {
        return null;
      }
    } catch (e) {
      console.error(e);
      throw new Error(e);
    }
  }

  public async delete(id: string, reply: FastifyReply | null = null): Promise<{ _id: string } | null> {
    try {
      const resp = await this.fastifyInstance.mongo.db?.collection(this.collectionName)
        .deleteOne({ _id: new ObjectId(id) });
      if (
        resp == null
        || resp === undefined
        || resp.deletedCount === undefined
        || resp.deletedCount == null
        || resp.deletedCount === 0
      ) {
        return null;
      }
      return { _id: id };
    } catch (e) {
      console.error(e);
      throw new Error(e);
    }
  }

  public async index(request: FastifyRequest, reply: FastifyReply | null = null): Promise<ModelInterface[]> {
    try {
      const response = await this.fastifyInstance.mongo.db?.collection(this.collectionName)
        .find({});
      const output = response?.toArray();
      // console.log(output);
      return output == undefined ? [] : output;
    } catch (e) {
      console.error(e);
      throw new Error(e);
    }
  }

  public async update(id: string, body: any, reply: FastifyReply | null = null): Promise<ModelInterface | null> {
    try {
      delete body._id;
      const resp = await this.fastifyInstance.mongo.db?.collection(this.collectionName)
        .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: body }, { returnOriginal: false });
      if (resp != null && resp !== undefined && resp.value != null && resp.value !== undefined) {
        return resp.value;
      }
      return null;
    } catch (e) {
      console.error(e);
      throw new Error(e);
    }
  }
}
