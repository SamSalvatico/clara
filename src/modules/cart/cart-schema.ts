import BaseSchema from "../base/base-schema";
import SchemaInterface from "../base/schema-interface";
import ProductSchema from "../product/product-schema";

export default class CartSchema extends BaseSchema implements SchemaInterface {
    public properties = {
        _id: {
            type: 'string',
            nullable: false
        },
        products: {
            type: 'array',
            items: {
                type: 'object',
                properties: new ProductSchema().properties
            },
            default: []
        },
        skus: {
            type: 'array',
            items: {
                type: 'string',
            },
            default: []
        },
        price:
        {
            type: 'number',
            nullable: false,
            default: 0
        },
        discount:
        {
            type: 'number',
            nullable: false,
            default: 0
        }
    };
}