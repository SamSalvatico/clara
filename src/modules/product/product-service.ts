import { FastifyInstance, FastifyReply } from "fastify";
import BaseService from "../base/base-service";
import ServiceInterface from "../base/service-interface";
import Product from "./product-model";

export default class ProductService extends BaseService implements ServiceInterface {
    _collection = 'products';

    public async getProductFromSku(
        sku: string,
        reply: FastifyReply | null = null,
    ) {
        console.log(sku);
        const resp = await this.fastifyInstance.mongo.db?.collection(this.collectionName)
            .findOne({ sku: { $regex: new RegExp('^' + sku.trim() + '$', 'i') } });
        if (resp == null || resp === undefined) {
            reply?.status(404);
            throw new Error('Cannot find this product');
        }
        return Object.assign(new Product(), resp);
    }
}