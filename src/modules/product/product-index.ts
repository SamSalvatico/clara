import { FastifyInstance } from 'fastify';
import BaseIndex from '../base/base-index';
import IndexInterface from '../base/index-interface';
import Product from './product-model';
import ProductSchema from './product-schema';
import ProductService from './product-service';

export default class ProductIndex extends BaseIndex implements IndexInterface {
  protected initialize(fastifyInstance: FastifyInstance) {
    this.fastifyInstance = fastifyInstance;
    this.schema = new ProductSchema();
    this.service = ProductService.Instance(Product, fastifyInstance, this.schema);
    this.prefixValue = 'products';
  }
}
