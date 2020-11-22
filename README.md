# william-mirta

## Index

- [Start](#start)
- [The code](#the-code)
- [Classic run](#classic-run)
- [Docker run](#docker-run)
- [Endpoints and docs](#endpoints-and-docs)
- [Tests](#tests)
- [Optional config](#optional-config)
- [Example](#example)
- [Missing](#missing)

## Start

This project was developed using Ubuntu 20.04.

To start you need to have on your machine:

- [Node.js](https://nodejs.org/it/) ^12;
- [npm](https://www.npmjs.com/) ^6;
- [docker](https://docker.com), if you want to run it as image (tested with docker v19.03.8);
- An internet connection!

The database is hosted on [MongoAtlas](https://www.mongodb.com/cloud/atlas), it contains the bundles and the products collections filled with example jsons.

## The code

This project was developed on top of fastify.js framework.

The main entry point is the _server.ts_ file in the source folder.\
The server starts and register the needed routes.\
In the _modules_ folder you can find the modules where I define all the classes we need to work with that model.
The _-index_ class is the one where I manage the routing, the _-schema_ class is used to serialize and validate the request and the reply, the _-model_ class defines the fields we will find in a Product, the _-service_ class contains our logics.\
In the _test_ folder you can find the test I wrote.

## Classic run

To start the application using npm you have to run in the root folder

```
npm install && \
npm run start
```

Et voilà! You're ready to work at port 3000 of your localhost.

## Docker run

To start the application using docker you have to run in the root folder

```
docker build -t "mirta:latest" . && \
docker run --publish 3000:3000 mirta
```

Et voilà! You're ready to work at port 3000 of your localhost.

## Endpoints and docs

If you want to see the docs and test the APIs you can browse

```
{{baseUrl}}/documentation
```

## Tests

To run tests you must run

```
npm install
```

(if you already didn't) and

```
npm run test
```

## Optional config

If you want to run thee project with different configurations you have to copy the _.env.example_ file into a _.env_ file and edit your configurations.
Remember: to run in docker the host must be the 0.0.0.0.

## Example

This is the workflow you can follow to test the assignment case.

To add a product to the cart

```
POST {baseUrl}/carts/skus/{theSku}
```

E.g.

```
POST http://localhost:3000/carts/skus/UGSXO-1999
```

To remove it

```
DELETE {baseUrl}/carts/skus/{theSku}
```

To remove all products from the cart

```
DELETE {baseUrl}/carts/me
```

## Missing

The following parts are missing:

- an high number of interfaces implementation;
- script and docker compose to create and seed a mongo instance;
- persistence checks (remove a product from the cart if deleted from collection, ...)
