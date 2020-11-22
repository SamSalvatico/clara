import BaseModel from "../base/base-model";
import ModelInterface from "../base/model-interface";

export default class Bundle extends BaseModel implements ModelInterface {
    public bundle_id!: string;

    public products!: string[];

    public discount!:number;
}