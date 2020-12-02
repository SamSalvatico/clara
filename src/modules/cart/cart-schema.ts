import BaseSchema from '../base/base-schema';
import SchemaInterface from '../base/schema-interface';
import ProductSchema from '../product/product-schema';

export default class CartSchema extends BaseSchema implements SchemaInterface {
  public properties = {
    _id: {
      type: 'string',
      nullable: false,
    },
    products: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          ...new ProductSchema().properties,
          product_quantity: { type: 'integer', default: 1, minimum: 1 },
          amount_with_tax: { type: 'number' }
        },
      },
      default: [],
    },
    products_amount:
    {
      type: 'number',
      nullable: true,
      default: null,
    },
    taxes_amount:
    {
      type: 'number',
      nullable: true,
      default: null,
    },
    total_amount:
    {
      type: 'number',
      nullable: true,
      default: null,
    },
  };

  get addProductSchema() {
    return {
      tags: [this.constructor.name],
      params:
      {
        type: 'object',
        properties: {
          id: { type: 'string', nullable: false },
          product_id: { type: 'string', nullable: false },
        },
        required: ['id', 'product_id'],
      },
      body: {
        type: 'object',
        required: ['product_quantity'],
        properties: {
          product_quantity: { type: 'integer', default: 1, minimum: 1 }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: this.properties
          ,
        },
        404: {
          type: 'object',
          properties: this.errorProperties,
        },
        500: {
          type: 'object',
          properties: this.errorProperties,
        },
      },
    };
  }

  get removeProductSchema() {
    return {
      tags: [this.constructor.name],
      params:
      {
        type: 'object',
        properties: {
          id: { type: 'string', nullable: false },
          product_id: { type: 'string', nullable: false },
        },
        required: ['id', 'product_id'],
      },
      response: {
        200: {
          type: 'object',
          properties: this.properties
          ,
        },
        404: {
          type: 'object',
          properties: this.errorProperties,
        },
        500: {
          type: 'object',
          properties: this.errorProperties,
        },
      },
    };
  }

  get createSchema() {
    return {
      tags: [this.constructor.name],
      body: {
        type: 'object',
        required: [],
        properties: {},
        additionalProperties: false,
      },
      response: {
        201: {
          type: 'object',
          properties: this.properties,
        },
        400: {
          type: 'object',
          properties: this.errorProperties,
        },
        500: {
          type: 'object',
          properties: this.errorProperties,
        },
      },
    };
  }
}
