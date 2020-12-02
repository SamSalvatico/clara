/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
import { FastifyInstance } from 'fastify';
import { test } from 'tap';
import app from '../../app';

test('Products', async (t: any) => {
  const theConnString = 'mongodb+srv://clara:CgYG3kvqCfd7oL6i@samcluster.z5siq.gcp.mongodb.net/clara?retryWrites=true&w=majority';
  const ser: FastifyInstance = app(theConnString);

  await getOneNoExist(ser, t);
  await createBadRequest(ser, t);
  const initialCount = await getAllAndCount(ser, t);
  const prodId = await createValidOne(ser, t);
  await getOneMustExist(ser, t, prodId);
  const afterCreate = await getAllAndCount(ser, t);
  await updateOne(ser, t, prodId);
  await deleteOne(ser, t, prodId);
  const lastCount = await getAllAndCount(ser, t);
  await getOneNoExist(ser, t, prodId);
  t.equal(initialCount, afterCreate - 1);
  t.equal(initialCount, lastCount);
  t.end();
  ser.close();
});

async function getOneNoExist(
  server: FastifyInstance,
  t: any,
  idToSearchFor: string = 'unprodottochenonesisteoalmenosispera'
) {
  const res = await server.inject({
    method: 'GET',
    url: `/products/${idToSearchFor}`,
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
    url: `/products/${idToSearchFor}`,
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
    url: '/products',
  });
  t.equal(res.statusCode, 200);
  const pay = JSON.parse(res.payload);
  return pay.length;
}

async function createBadRequest(server: FastifyInstance, t: any) {
  // The name is missing
  const res = await server.inject({
    method: 'POST',
    url: '/products',
    payload: { price: 1000 },
  });
  // console.log(JSON.stringify(res.payload));
  t.equal(res.statusCode, 400);
}

async function createValidOne(server: FastifyInstance, t: any) {
  const res = await server.inject({
    method: 'POST',
    url: '/products',
    payload: { name: 'unprodottochenonesisteancora', price: 1000 },
  });
  console.log(JSON.stringify(res.payload));
  t.equal(res.statusCode, 201);
  const parsedPayload = JSON.parse(res.payload);
  t.same(Object.keys(parsedPayload), ['_id', 'name', 'price', 'category', 'is_imported']);
  t.equal(parsedPayload.category, 'other');
  return parsedPayload._id;
}

async function updateOne(server: FastifyInstance, t: any, id: string) {
  const res = await server.inject({
    method: 'PUT',
    url: `/products/${id}`,
    payload: { name: 'unprodottochenonesistemaorasi', price: 1000 },
  });
  t.equal(res.statusCode, 200);
  const parsedPayload = JSON.parse(res.payload);
  t.equal(parsedPayload.name, 'unprodottochenonesistemaorasi');
}

async function deleteOne(server: FastifyInstance, t: any, id: string) {
  const res = await server.inject({
    method: 'DELETE',
    url: `/products/${id}`,
  });
  t.equal(res.statusCode, 200);
}
