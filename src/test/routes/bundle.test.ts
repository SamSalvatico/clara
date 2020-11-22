'use strict'

import { FastifyInstance } from 'fastify';
import { test } from 'tap'
import app from '../../app';

test('Bundles', async (t: any) => {
  const ser: FastifyInstance = app()

  let res = await ser.inject({
    method: 'GET',
    url: '/bundles/unprodottochenonesiste'
  })
  t.equal(res.statusCode, 404)

  res = await ser.inject({
    method: 'POST',
    url: '/bundles',
    payload: { discount: 0.3, products: [], bundle_id: 'thatsmybundle' }
  });
  console.log(JSON.stringify(res.payload));
  t.equal(res.statusCode, 201);
  let parsedPayload = JSON.parse(res.payload);
  t.same(Object.keys(parsedPayload), ['_id', 'bundle_id', 'products', 'discount']);

  res = await ser.inject({
    method: 'PUT',
    url: '/bundles/' + parsedPayload._id,
    payload: { discount: 0.4, products: [], bundle_id: 'thatsmybundle' }
  });
  console.log(JSON.stringify(res.payload));
  t.equal(res.statusCode, 200);
  parsedPayload = JSON.parse(res.payload);
  t.same(Object.keys(parsedPayload), ['_id', 'bundle_id', 'products', 'discount']);

  res = await ser.inject({
    method: 'DELETE',
    url: '/bundles/' + parsedPayload._id
  });

  t.equal(res.statusCode, 200)

  t.end();
  ser.close();
})