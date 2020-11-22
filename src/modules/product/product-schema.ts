import BaseSchema from "../base/base-schema";
import SchemaInterface from "../base/schema-interface";

export default class ProductSchema extends BaseSchema implements SchemaInterface {
    public properties = {
        _id: {
            type: 'string',
            nullable: false
        },
        sku: {
            type: 'string',
            nullable: false
        },
        price:
        {
            type: 'number',
            nullable: false
        }
    };

    public required: string[] = ['sku', 'price'];

}