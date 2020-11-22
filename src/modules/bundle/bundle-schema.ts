import BaseSchema from "../base/base-schema";
import SchemaInterface from "../base/schema-interface";

export default class BundleSchema extends BaseSchema implements SchemaInterface {
    public properties = {
        _id: {
            type: 'string',
            nullable: false
        },
        bundle_id: {
            type: 'string',
            nullable: false
        },
        products:
        {
            type: 'array',
            items: {
                type: 'string',
            },
            nullable: false
        },
        discount:
        {
            type: 'number',
            nullable: false
        }
    };

    public required: string[] = ['discount', 'products', 'bundle_id'];

}