/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { FastifyReply, FastifyRequest } from 'fastify';

// import BaseSchema from './base-schema';

export default interface IndexInterface {

    register(): void;

    create(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;

    index(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;

    show(request: any, reply: FastifyReply): Promise<FastifyReply>;

    update(request: any, reply: FastifyReply): Promise<FastifyReply>;

    delete(request: any, reply: FastifyReply): Promise<FastifyReply>;
}
