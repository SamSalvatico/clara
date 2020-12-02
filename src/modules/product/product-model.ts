/* eslint-disable camelcase */
import BaseModel from '../base/base-model';
import ModelInterface from '../base/model-interface';

export default class Product extends BaseModel implements ModelInterface {
    public name!: string;

    public price!: number;

    public category!: string;

    public is_imported!: boolean;
}
