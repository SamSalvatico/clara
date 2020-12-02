/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import { FastifyReply } from 'fastify';
import taxes from '../../configs/taxes';
import BaseService from '../base/base-service';
import ServiceInterface from '../base/service-interface';
import Product from '../product/product-model';
import ProductAndQuantity from '../product/product-quantity-model';
import ProductSchema from '../product/product-schema';
import ProductService from '../product/product-service';
import Cart from './cart-model';

export default class CartService extends BaseService implements ServiceInterface {
  _collection = 'carts';

  public async addProduct(
    id: string,
    productId: string,
    body: { product_quantity: number },
    reply: FastifyReply
  ): Promise<Cart | null> {
    const cart: Cart | null = await this.show(id, reply) as Cart | null;
    if (cart == null) {
      return cart;
    }
    cart.products = await this.addProductAndGetUpdatedProducts(
      cart, productId, body.product_quantity, reply
    );
    this.updateAmountsInCart(cart);
    return this.update(id, cart) as Promise<Cart>;
  }

  public async removeProduct(
    id: string,
    productId: string,
    reply: FastifyReply
  ): Promise<Cart | null> {
    const cart: Cart | null = await this.show(id, reply) as Cart | null;
    if (cart == null) {
      return cart;
    }
    cart.products = await this.removeProductAndGetUpdatedProducts(
      cart, productId, reply
    );
    this.updateAmountsInCart(cart);
    return this.update(id, cart) as Promise<Cart>;
  }

  private updateAmountsInCart(cart: Cart) {
    let productsAmount = 0;
    let taxesAmount = 0;
    cart.products = cart.products == null ? [] : cart.products;
    cart.products.forEach((p: ProductAndQuantity) => {
      productsAmount += (p.price * p.product_quantity);
      if (p.amount_with_tax != null) {
        taxesAmount += (p.amount_with_tax - (p.price * p.product_quantity));
      }
    });
    cart.products_amount = this.roundTwoDecimals(productsAmount);
    cart.taxes_amount = this.roundTax(taxesAmount);
    cart.total_amount = this.roundTwoDecimals(taxesAmount + productsAmount);
  }

  private getTaxAmountForProduct(
    product: Product,
    quantity: number
  ) {
    let outputVal = 0;
    // We get taxes from the config/taxes file
    Object.values(taxes).forEach((taxValues) => {
      outputVal += this.getTaxAmountForSingleTaxTypeForProduct(taxValues, product, quantity);
    });
    return this.roundTax(outputVal);
  }

  private getTaxAmountForSingleTaxTypeForProduct(
    taxType: {
      except_categories: string[],
      percentage: number,
      only_imported: boolean
    },
    product: Product,
    quantity: number
  ) {
    if (taxType.except_categories.includes(product.category)
      || (taxType.only_imported && !product.is_imported)) {
      return 0;
    }
    return (
      ((product.price * quantity) / 100)
      * taxType.percentage
    );
  }

  private async addProductAndGetUpdatedProducts(
    cart: Cart,
    productId: string,
    productQuantity: number,
    reply: FastifyReply
  ) {
    const product = await this.getProductById(productId);
    if (product == null) {
      reply.status(400);
      throw new Error('This product does not exist!');
    }
    const curTaxAmount = this.getTaxAmountForProduct(product, productQuantity);
    const curPriceWithTax = this.roundTwoDecimals(product.price * productQuantity + curTaxAmount);
    const currentProd = Object.assign(
      new ProductAndQuantity(),
      {
        ...product,
        product_quantity: productQuantity,
        amount_with_tax: curPriceWithTax
      }
    );
    const outpProds = cart.products == null ? [] : cart.products;
    const prodIndex = outpProds
      .findIndex((x) => (x._id.toString() === productId.toString()));
    if (prodIndex > -1) {
      outpProds[prodIndex] = currentProd;
    } else {
      outpProds.push(currentProd);
    }
    return outpProds;
  }

  private async removeProductAndGetUpdatedProducts(
    cart: Cart,
    productId: string,
    reply: FastifyReply
  ) {
    const cartProds = cart.products == null ? [] : cart.products;
    const prodIndex = cartProds
      .findIndex((x) => (x._id.toString() === productId.toString()));
    const outpProds = cart.products;
    if (prodIndex > -1) {
      outpProds.splice(prodIndex, 1);
    }
    return outpProds;
  }

  /**
   *
   * @param productId
   */
  private async getProductById(productId: string) {
    const prodService = ProductService.Instance(
      Product,
      this.fastifyInstance,
      new ProductSchema()
    );
    return prodService.show(productId) as Promise<Product | null>;
  }

  /**
   * Round the input to two decimals
   * @param input
   */
  private roundTwoDecimals(input: number): number {
    return (Math.round((input + Number.EPSILON) * 100) / 100);
  }

  /**
   * Round the input to the nearest 0.05
   * @param input
   */
  private roundTax(input: number): number {
    input = this.roundTwoDecimals(input);
    const decimal = Math.round((input - Math.trunc(input)) * 100);
    const diff = decimal % 5;
    if (diff === 0) { return input; }
    let output = input;
    if (diff <= 2) {
      output = input - (diff / 100);
    } else {
      output = (input + ((5 - diff) / 100));
    }
    return this.roundTwoDecimals(output);
  }
}
