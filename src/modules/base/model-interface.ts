/* eslint-disable no-underscore-dangle */

export default interface ModelInterface {
  _id: string;

  readonly id: string;

  // constructor(): void;
// eslint-disable-next-line semi
}

export interface ModelInterfaceConstructor {
  new(): ModelInterface;
}
