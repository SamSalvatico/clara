export default interface SchemaInterface {

  properties: { [k: string]: any };

  errorProperties: { [k: string]: any };

  required: string[];

  getOneSchema: {
    tags: string[],
    params: { type: string, properties: { [k: string]: any }, required: string[] },
    response: { [k: number]: { type: string, properties: { [k: string]: any } } }
  };

  getAllSchema: {
    tags: string[],
    response: {
      [k: number]: {
        type: string,
        items?: { type: string, properties: { [k: string]: any } },
        properties?: { [k: string]: any }
      }
    }
  };

  createSchema: {
    tags: string[],
    response: { [k: number]: { type: string, properties: { [k: string]: any } } },
    body: { type: string, properties: { [k: string]: any }, required: string[] }
  };

  updateSchema: {
    tags: string[],
    params: { type: string, properties: { [k: string]: any }, required: string[] },
    response: { [k: number]: { type: string, properties: { [k: string]: any } } },
    body: { type: string, properties: { [k: string]: any }, required: string[] }
  };

  deleteSchema: {
    tags: string[],
    params: { type: string, properties: { [k: string]: any }, required: string[] },
    response: { [k: number]: { type: string, properties: { [k: string]: any } } },
  };

  [x: string]: any;
  // eslint-disable-next-line semi
}

export interface SchemaInterfaceConstructor {
  new(): SchemaInterface;
}
