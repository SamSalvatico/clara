import BaseModel from "../base/base-model";
import ModelInterface from "../base/model-interface";
import Product from "../product/product-model";

export default class Cart extends BaseModel implements ModelInterface {
    public products: Product[] = [];
    public skus: string[] = [];
    public price!: number;
    public discount!: number;
}