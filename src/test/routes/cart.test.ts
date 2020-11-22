'use strict'

import { FastifyInstance } from 'fastify/types/instance';
import { ObjectId } from 'mongodb';
import { test } from 'tap'
import app from '../../app';
import server from '../../server';

test('Carts', async (t: any) => {
  const ser: FastifyInstance = app()

  let res = await ser.inject({
    method: 'GET',
    url: '/carts/me'
  })
  t.equal(res.statusCode, 200);

  let firstSku = new ObjectId().toString();
  let secondSku = new ObjectId().toString();
  res = await ser.inject({
    method: 'POST',
    url: '/products',
    payload: { sku: firstSku, price: 1000 }
  });

  let parsedPayload = JSON.parse(res.payload);
  let firstIdInDB = parsedPayload._id;

  res = await ser.inject({
    method: 'POST',
    url: '/products',
    payload: { sku: secondSku, price: 1000 }
  });
  parsedPayload = JSON.parse(res.payload);
  let secondIdInDB = parsedPayload._id;

  res = await ser.inject({
    method: 'POST',
    url: '/bundles',
    payload: { discount: 0.1, products: [secondSku, firstSku], bundle_id: 'thatsmybundlenow' }
  });

  const bundleId = JSON.parse(res.payload)._id;

  res = await ser.inject({
    method: 'POST',
    url: '/carts/skus/' + firstSku,
  });
  parsedPayload = JSON.parse(res.payload);
  t.equal(res.statusCode, 200)
  t.same(Object.keys(parsedPayload), ['_id', 'products', 'skus', 'price', 'discount']);
  t.equal(parsedPayload.price, 1000);
  t.equal(parsedPayload.discount, 0);

  res = await ser.inject({
    method: 'POST',
    url: '/carts/skus/' + secondSku,
  });
  parsedPayload = JSON.parse(res.payload);
  t.equal(res.statusCode, 200)
  t.same(Object.keys(parsedPayload), ['_id', 'products', 'skus', 'price', 'discount']);
  t.equal(parsedPayload.price, 2000);
  t.equal(parsedPayload.discount, 200);

  res = await ser.inject({
    method: 'DELETE',
    url: '/carts/me'
  });
  t.equal(res.statusCode, 200);

  res = await ser.inject({
    method: 'DELETE',
    url: '/bundles/' + bundleId
  });
  t.equal(res.statusCode, 200);

  res = await ser.inject({
    method: 'DELETE',
    url: '/products/' + firstIdInDB
  });
  t.equal(res.statusCode, 200);

  res = await ser.inject({
    method: 'DELETE',
    url: '/products/' + secondIdInDB
  });
  t.equal(res.statusCode, 200);

  t.end();

  ser.close();
})