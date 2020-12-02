import BaseSchema from '../base/base-schema';
import SchemaInterface from '../base/schema-interface';

export default class ProductSchema extends BaseSchema implements SchemaInterface {
  public properties = {
    _id: {
      type: 'string',
      nullable: false,
    },
    name: {
      type: 'string',
      nullable: false,
    },
    price:
    {
      type: 'number',
      nullable: false,
    },
    category:
    {
      type: 'string',
      enum: ['book', 'food', 'medical', 'other'],
      default: 'other',
    },
    is_imported: {
      type: 'boolean',
      default: false,
      nullable: false
    }
  };

  public required: string[] = ['name', 'price'];
}
