import BaseModel from "../base/base-model";
import ModelInterface from "../base/model-interface";

export default class Product extends BaseModel implements ModelInterface {
    public sku!: string;

    public price!: number;
}