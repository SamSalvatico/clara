/* eslint-disable camelcase */
import BaseModel from '../base/base-model';
import ModelInterface from '../base/model-interface';
import ProductAndQuantity from '../product/product-quantity-model';

export default class Cart extends BaseModel implements ModelInterface {
    public products: ProductAndQuantity[] = [];

    public products_amount!: number | null;

    public taxes_amount!: number | null;

    public total_amount!: number | null;
}
