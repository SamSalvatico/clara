import { FastifyInstance, FastifyReply } from "fastify";
import { DeleteWriteOpResultObject } from "mongodb";
import BaseService from "../base/base-service";
import ModelInterface from "../base/model-interface";
import ServiceInterface from "../base/service-interface";
import Bundle from "../bundle/bundle-model";
import BundleSchema from "../bundle/bundle-schema";
import BundleService from "../bundle/bundle-service";
import Product from "../product/product-model";
import ProductSchema from "../product/product-schema";
import ProductService from "../product/product-service";
import Cart from "./cart-model";

export default class CartService extends BaseService implements ServiceInterface {
    _collection = 'carts';

    public async addSku(sku: string, reply: FastifyReply | null = null): Promise<Cart> {
        return this.addProductOrSkuAndGetUpdatedCart(sku, null, reply);
    }

    public async addProduct(product: Product, reply: FastifyReply | null = null): Promise<Cart> {
        return this.addProductOrSkuAndGetUpdatedCart(null, product, reply);
    }

    public async getMe(): Promise<Cart> {
        return await this.getCart();
    }

    public async deleteMe(): Promise<DeleteWriteOpResultObject | undefined> {
        return this.fastifyInstance.mongo.db?.collection(this.collectionName).deleteOne({});
    }

    private async addProductOrSkuAndGetUpdatedCart(
        sku: string | null = null,
        product: Product | null = null,
        reply: FastifyReply | null = null) {
        try {
            let cart: Cart = await this.getCart();
            this.addProductToCart(
                cart,
                await this.getProductFromDb(cart, reply, sku, product)
            );
            await this.updatePriceAndDiscount(cart);
            await this.fastifyInstance.mongo.db?.collection(this.collectionName)
                .updateOne({}, { $set: { ...cart } }, { upsert: true });

            return this.fastifyInstance.mongo.db?.collection(this.collectionName).findOne({});
        } catch (e) {
            console.error(e);
            throw new Error(e);
        }
    }

    private async updatePriceAndDiscount(cart: Cart) {
        const bundlesInstance = new BundleService(Bundle, this.fastifyInstance, new BundleSchema());
        if (cart.products == null) {
            cart.products = [];
        }
        cart.discount = await bundlesInstance.calculateDiscount(cart.products);
        cart.price = (cart.products.reduce((a, b) => a + b.price, 0));
        console.log(JSON.stringify(cart));
    }

    private async addProductToCart(cart: Cart, product: Product) {
        let alreadyIn = false;
        if (cart.products == null) {
            cart.products = [product];
        } else {
            if (cart.products.findIndex((x: Product) => x.sku == product.sku) < 0) {
                cart.products.push(product);
            } else {
                alreadyIn = true;
            }
        }
        if (cart.skus == null) {
            cart.skus = [product.sku];
        } else {
            if (!alreadyIn) {
                cart.skus.push(product.sku);
            }
        }
    }

    private async getProductFromDb(
        cart: Cart,
        reply: FastifyReply | null = null,
        sku: string | null = null,
        product: Product | null = null
    ) {
        if (sku == null) {
            if (product != null) {
                sku = product.sku;
            }
            else {
                reply?.status(400);
                throw new Error('You must pass a valid param');
            }
        }
        const prodInstance = new ProductService(Product, this.fastifyInstance, new ProductSchema());
        return prodInstance.getProductFromSku(sku, reply);
    }

    private async getCart() {
        let cart: Cart;
        const resp = await this.fastifyInstance.mongo.db?.collection(this.collectionName).findOne({});
        if (resp == null || resp === undefined) {
            cart = new Cart();
        } else {
            cart = Object.assign(new Cart(), resp);
        }
        return cart;
    }

    public async removeSkuAndGetUpdatedCart(
        sku: string | null = null,
        reply: FastifyReply | null = null) {
        try {
            let cart: Cart = await this.getCart();
            this.removeProductFromCart(
                cart,
                await this.getProductFromDb(cart, reply, sku)
            );
            this.updatePriceAndDiscount(cart);
            this.fastifyInstance.mongo.db?.collection(this.collectionName)
                .updateOne({}, { $set: { ...cart } }, { upsert: true });
            return this.fastifyInstance.mongo.db?.collection(this.collectionName).findOne({});
        } catch (e) {
            console.error(e);
            throw new Error(e);
        }
    }

    private async removeProductFromCart(cart: Cart, product: Product) {
        if (cart.products == null) {
            cart.products = [];
        } else {
            const index = cart.products.findIndex((p: Product) => p.sku == product.sku);
            if (index >= 0) {
                cart.products = cart.products
                    .splice(index, 1);
            }
        }
    }
}