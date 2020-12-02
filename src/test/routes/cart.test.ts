/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
/* eslint-disable object-shorthand */
/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
import { FastifyInstance } from 'fastify';
import { test } from 'tap';
import app from '../../app';
import Cart from '../../modules/cart/cart-model';
import ProductAndQuantity from '../../modules/product/product-quantity-model';

test('Carts', async (t: any) => {
  const theConnString = 'mongodb+srv://clara:CgYG3kvqCfd7oL6i@samcluster.z5siq.gcp.mongodb.net/clara?retryWrites=true&w=majority';
  const ser: FastifyInstance = app(theConnString);

  await baseTest(ser, t);
  // These are the tests made with the given inputs
  await processInputOneCartCheckout(ser, t);
  await processInputTwoCartCheckout(ser, t);
  await processInputThreeCartCheckout(ser, t);

  ser.close();
  t.end();
});

async function baseTest(ser: FastifyInstance, t: any) {
  await getOneNoExist(ser, t);
  const initialCount = await getAllAndCount(ser, t);
  const cartId = await createValidOne(ser, t);
  await getOneMustExist(ser, t, cartId);
  const afterCreate = await getAllAndCount(ser, t);
  await updateOne(ser, t, cartId);
  await deleteOne(ser, t, cartId);
  const lastCount = await getAllAndCount(ser, t);
  await getOneNoExist(ser, t, cartId);
  t.equal(initialCount, afterCreate - 1);
  t.equal(initialCount, lastCount);
}
async function getOneNoExist(
  server: FastifyInstance,
  t: any,
  idToSearchFor: string = 'uncarrellochenonesisteoalmenosispera'
) {
  const res = await server.inject({
    method: 'GET',
    url: `/carts/${idToSearchFor}`,
  });
  t.equal(res.statusCode, 404);
}

async function getOneMustExist(
  server: FastifyInstance,
  t: any,
  idToSearchFor: string
) {
  const res = await server.inject({
    method: 'GET',
    url: `/carts/${idToSearchFor}`,
  });
  t.equal(res.statusCode, 200);
  const par = JSON.parse(res.payload);
  t.equal(par._id, idToSearchFor);
}

async function getAllAndCount(
  server: FastifyInstance,
  t: any
) {
  const res = await server.inject({
    method: 'GET',
    url: '/carts',
  });
  t.equal(res.statusCode, 200);
  const pay = JSON.parse(res.payload);
  return pay.length;
}

async function createValidOne(server: FastifyInstance, t: any) {
  const res = await server.inject({
    method: 'POST',
    url: '/carts',
    payload: {},
  });
  t.equal(res.statusCode, 201);
  const parsedPayload = JSON.parse(res.payload);
  return parsedPayload._id;
}

async function updateOne(server: FastifyInstance, t: any, id: string) {
  const res = await server.inject({
    method: 'PUT',
    url: `/carts/${id}`,
    payload: {},
  });
  t.equal(res.statusCode, 404);
}

async function deleteOne(server: FastifyInstance, t: any, id: string) {
  const res = await server.inject({
    method: 'DELETE',
    url: `/carts/${id}`,
  });
  t.equal(res.statusCode, 200);
}

async function processInputOneCartCheckout(server: FastifyInstance, t: any) {
  const id = await createValidOne(server, t);
  // 2 book at 12.49
  // 1 music CD at 14.99
  // 1 chocolate bar at 0.85
  const theBookObj = {
    name: 'book-test', is_imported: false, price: 12.49, category: 'book'
  };
  const theBookId = await createAProductAndGetId(
    server,
    theBookObj
  );
  const theCdObj = {
    name: 'music-cd-test', is_imported: false, price: 14.99, category: 'other'
  };
  const theCdId = await createAProductAndGetId(
    server,
    theCdObj
  );
  const theChocObj = {
    name: 'choc-test', is_imported: false, price: 0.85, category: 'food'
  };
  const theChocId = await createAProductAndGetId(
    server,
    theChocObj
  );
  let cart = await addAProductToCart(server, t, id, theBookId, 2);
  t.equal(cart.products_amount, theBookObj.price * 2);
  let currentTaxesAmount = calculateTaxesAmountByObjs(
    [
      { ...theBookObj, product_quantity: 2 }
    ]
  );
  t.equal(cart.taxes_amount, currentTaxesAmount);
  cart = await addAProductToCart(server, t, id, theCdId, 1);
  currentTaxesAmount = calculateTaxesAmountByObjs(
    [
      { ...theBookObj, product_quantity: 2 },
      { ...theCdObj, product_quantity: 1 }
    ]
  );
  t.equal(cart.taxes_amount, currentTaxesAmount);
  cart = await addAProductToCart(server, t, id, theChocId, 1);
  t.equal(cart.products_amount, theBookObj.price * 2 + theCdObj.price + theChocObj.price);
  t.equal(cart.taxes_amount, 1.50);
  t.equal(cart.total_amount, 42.32);
  cart = await removeAProductFromCart(server, t, id, theBookId);
  t.equal(cart.products.length, 2);

  await deleteOne(server, t, id);
  await deleteOneProduct(server, t, theCdId);
  await deleteOneProduct(server, t, theBookId);
  await deleteOneProduct(server, t, theChocId);
}

async function processInputTwoCartCheckout(server: FastifyInstance, t: any) {
  const id = await createValidOne(server, t);
  // 1 imported box of chocolates at 10.00
  // 1 imported bottle of perfume at 47.50
  const theBoxObj = {
    name: 'imported box of chocolates-test', is_imported: true, price: 10, category: 'food'
  };
  const theBoxId = await createAProductAndGetId(
    server,
    theBoxObj
  );
  const thePerfObj = {
    name: 'imported-perfume-test', is_imported: true, price: 47.50, category: 'other'
  };
  const thePerfId = await createAProductAndGetId(
    server,
    thePerfObj
  );

  let cart = await addAProductToCart(server, t, id, theBoxId, 1);
  let currentTaxesAmount = calculateTaxesAmountByObjs(
    [
      { ...theBoxObj, product_quantity: 1 }
    ]
  );
  t.equal(cart.taxes_amount, currentTaxesAmount);
  cart = await addAProductToCart(server, t, id, thePerfId, 1);
  currentTaxesAmount = calculateTaxesAmountByObjs(
    [
      { ...theBoxObj, product_quantity: 1 },
      { ...thePerfObj, product_quantity: 1 }
    ]
  );
  t.equal(cart.products_amount, theBoxObj.price + thePerfObj.price);
  t.equal(cart.taxes_amount, 7.65);
  t.equal(cart.total_amount, 65.15);

  await deleteOne(server, t, id);
  await deleteOneProduct(server, t, theBoxId);
  await deleteOneProduct(server, t, thePerfId);
}

async function processInputThreeCartCheckout(server: FastifyInstance, t: any) {
  const id = await createValidOne(server, t);
  // 1 imported bottle of perfume at 27.99
  const theBotObj = {
    name: 'imported bottle', is_imported: true, price: 27.99, category: 'other'
  };
  const theBotId = await createAProductAndGetId(
    server,
    theBotObj
  );
  let cart = await addAProductToCart(server, t, id, theBotId, 1);
  // 1 bottle of perfume at 18.99
  const thePerfObj = {
    name: 'perfume-test', is_imported: false, price: 18.99, category: 'other'
  };
  const thePerfId = await createAProductAndGetId(
    server,
    thePerfObj
  );
  cart = await addAProductToCart(server, t, id, thePerfId, 1);
  // 1 packet of headache pills at 9.75
  const theHeadObj = {
    name: 'head-test', is_imported: false, price: 9.75, category: 'medical'
  };
  const theHeadId = await createAProductAndGetId(
    server,
    theHeadObj
  );
  cart = await addAProductToCart(server, t, id, theHeadId, 1);
  // 3 box of imported chocolates at 11.25
  const theChocObj = {
    name: 'choc-test', is_imported: true, price: 11.25, category: 'food'
  };
  const theChocId = await createAProductAndGetId(
    server,
    theChocObj
  );
  cart = await addAProductToCart(server, t, id, theChocId, 3);
  // ... 3 imported box of chocolates: 35.55 -> this assumption is wrong: 11.25/100*5 = 0.5625
  //  (11.25+0.5625)*3= 35,4375
  t.equal(cart.taxes_amount, 7.80);
  t.equal(cart.total_amount, 98.28);

  await deleteOne(server, t, id);
  await deleteOneProduct(server, t, theBotId);
  await deleteOneProduct(server, t, thePerfId);
  await deleteOneProduct(server, t, theChocId);
  await deleteOneProduct(server, t, theHeadId);
}

function calculateTaxesAmountByObjs(
  objs: {
    name: string, is_imported: boolean, price: number, category: string, product_quantity: number
  }[]
) {
  let output = 0;
  objs.forEach((element) => {
    if (element.is_imported) {
      output += ((element.price / 100) * 5);
    }
    if (!['book', 'food', 'medical'].includes(element.category)) {
      output += ((element.price / 100) * 10);
    }
  });
  return roundTwoDecimals(output);
}

async function createAProductAndGetId(server: FastifyInstance, payload: any) {
  const res = await server.inject({
    method: 'POST',
    url: '/products',
    payload: payload,
  });
  return JSON.parse(res.payload)._id;
}

async function addAProductToCart(
  server: FastifyInstance,
  t: any,
  cartId: string,
  productId: string,
  productQuantity: number = 1
) {
  const res = await server.inject({
    method: 'POST',
    url: `/carts/${cartId}/products/${productId}`,
    payload: { product_quantity: productQuantity },
  });
  t.equal(res.statusCode, 200);
  const cart: Cart = Object.assign(new Cart(), JSON.parse(res.payload));
  t.ok((cart.products != null && cart.products.length > 0));
  if (cart.products != null && cart.products.length > 0) {
    const loadedProd = cart.products.find((x: ProductAndQuantity) => x._id === productId);
    t.ok((loadedProd != null));
  }
  return cart;
}

async function removeAProductFromCart(
  server: FastifyInstance,
  t: any,
  cartId: string,
  productId: string,
) {
  const res = await server.inject({
    method: 'DELETE',
    url: `/carts/${cartId}/products/${productId}`,
    payload: {},
  });
  t.equal(res.statusCode, 200);
  const cart: Cart = JSON.parse(res.payload);
  if (cart.products != null && cart.products.length > 0) {
    const loadedProd = cart.products.find((x: ProductAndQuantity) => x._id === productId);
    t.ok((loadedProd == null));
  }
  return cart;
}

async function deleteOneProduct(server: FastifyInstance, t: any, id: string) {
  await server.inject({
    method: 'DELETE',
    url: `/products/${id}`,
  });
}

function roundTwoDecimals(input: number): number {
  input = (Math.round((input + Number.EPSILON) * 100) / 100);
  const decimal = Math.round((input - Math.trunc(input)) * 100);
  const diff = decimal % 5;
  if (diff === 0) { return input; }
  let output = input;
  if (diff <= 2) {
    output = input - (diff / 100);
  } else {
    output = (input + ((5 - diff) / 100));
  }
  return (Math.round((output + Number.EPSILON) * 100) / 100);
}
