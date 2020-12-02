/* eslint-disable no-unused-vars */
import { FastifyReply, FastifyRequest } from 'fastify';
import ModelInterface from './model-interface';

export default interface ServiceInterface {

    [x: string]: any;

    readonly collectionName: string;

    readonly pathPrefix: string;

    create(body: any, reply: FastifyReply | null): Promise<ModelInterface>;

    show(id: string, reply: FastifyReply | null): Promise<ModelInterface | null>;

    delete(id: string, reply: FastifyReply | null): Promise<{ _id: string } | null>

    index(request: FastifyRequest, reply: FastifyReply | null): Promise<ModelInterface[]>;

    update(id: string, body: any, reply: FastifyReply | null): Promise<ModelInterface | null>;

// eslint-disable-next-line semi
}

export interface ServiceInterfaceConstructor {
    new(): ServiceInterface;
}
