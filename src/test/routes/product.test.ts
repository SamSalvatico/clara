'use strict'

import { FastifyInstance } from 'fastify/types/instance';
import { test } from 'tap'
import app from '../../app';
import server from '../../server';

test('Products', async (t: any) => {
  const ser: FastifyInstance = app()

  let res = await ser.inject({
    method: 'GET',
    url: '/products/unprodottochenonesiste'
  })
  t.equal(res.statusCode, 404)

  res = await ser.inject({
    method: 'POST',
    url: '/products',
    payload: { sku: 'unprodottochenonesiste', price: 1000 }
  });
  console.log(JSON.stringify(res.payload));
  t.equal(res.statusCode, 201);
  let parsedPayload = JSON.parse(res.payload);
  t.same(Object.keys(parsedPayload), ['_id', 'sku', 'price']);

  res = await ser.inject({
    method: 'PUT',
    url: '/products/' + parsedPayload._id,
    payload: { sku: 'unprodottochenonesistemaorasi', price: 1000 }
  });
  t.equal(res.statusCode, 200);
  console.log(JSON.stringify(res.payload));
  parsedPayload = JSON.parse(res.payload);
  t.same(Object.keys(parsedPayload), ['_id', 'sku', 'price']);

  res = await ser.inject({
    method: 'DELETE',
    url: '/products/' + parsedPayload._id
  });

  t.equal(res.statusCode, 200)

  t.end();

  ser.close();
})