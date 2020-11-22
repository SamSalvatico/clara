/* eslint-disable no-underscore-dangle */

import ModelInterface from "./model-interface";

export default class BaseModel implements ModelInterface {
  public _id!: string;

  get id(): string {
    return this._id;
  }
  
}
