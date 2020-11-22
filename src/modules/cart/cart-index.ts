import { FastifyRequest, FastifyReply } from "fastify";
import BaseIndex from "../base/base-index";
import IndexInterface from "../base/index-interface";
import ProductSchema from "../product/product-schema";

export default class CartIndex extends BaseIndex implements IndexInterface {
    public register(): void {
        this.fastifyInstance.get(
            `${this.prefix}/me`,
            { schema: this.meSchema() },
            async (request: FastifyRequest, reply: FastifyReply) => this.me(request, reply),
        );
        this.fastifyInstance.delete(
            `${this.prefix}/me`,
            {},
            async (request: FastifyRequest, reply: FastifyReply) => this.deleteMe(request, reply),
        );
        this.registerChildrenCrudRoutes();
    }
    protected registerChildrenCrudRoutes() {
        this.fastifyInstance.post(
            `${this.prefix}/skus/:sku`,
            { schema: this.skuSchema() },
            async (request: FastifyRequest, reply: FastifyReply) => this.addSku(request, reply),
        );
        this.fastifyInstance.delete(
            `${this.prefix}/skus/:sku`,
            { schema: this.skuSchema() },
            async (request: FastifyRequest, reply: FastifyReply) => this.removeSku(request, reply),
        );
    }

    public async me(request: FastifyRequest, reply: FastifyReply) {
        const resp = await this.service.getMe();
        return reply.code(200).send(resp);
    }

    public async deleteMe(request: FastifyRequest, reply: FastifyReply) {
        const resp = await this.service.deleteMe();
        return reply.code(200).send(resp);
    }

    public async addSku(request: any, reply: FastifyReply) {
        const resp = await this.service.addSku(request.params.sku, reply);
        // console.log(resp);
        return reply.code(200).send(resp);
    }

    public async removeSku(request: any, reply: FastifyReply) {
        const resp = await this.service.removeSkuAndGetUpdatedCart(request.params.sku, reply);
        // console.log(resp);
        return reply.code(200).send(resp);
    }

    private skuSchema() {
        return {
            tags: [this.constructor.name],
            params:
            {
                type: 'object',
                properties: {
                    sku: { type: 'string', nullable: false },
                },
                required: ['sku']
            },
            response: {
                200: {
                    type: 'object',
                    properties: this.schema.properties
                    ,
                },
                404: {
                    type: 'object',
                    properties: this.schema.errorProperties,
                },
                500: {
                    type: 'object',
                    properties: this.schema.errorProperties,
                },
            },
        };
    }

    private meSchema() {
        return {
            tags: [this.constructor.name],
            response: {
                200: {
                    type: 'object',
                    properties: this.schema.properties
                    ,
                },
                500: {
                    type: 'object',
                    properties: this.schema.errorProperties,
                },
            },
        };
    }

    private insertProductSchema() {
        const prodSchema = new ProductSchema();
        return {
            tags: [this.constructor.name],
            body: {
                type: 'object',
                required: prodSchema.required,
                properties:
                    prodSchema.properties,
            },
            response: {
                200: {
                    type: 'object',
                    properties: this.schema.properties,
                },
                404: {
                    type: 'object',
                    properties: this.schema.errorProperties,
                },
                500: {
                    type: 'object',
                    properties: this.schema.errorProperties,
                },
            },
        };
    }
}