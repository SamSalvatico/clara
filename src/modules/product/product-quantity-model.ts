/* eslint-disable camelcase */
import ModelInterface from '../base/model-interface';
import Product from './product-model';

export default class ProductAndQuantity extends Product implements ModelInterface {
    public product_quantity!: number;

    public amount_with_tax?: number;
}
