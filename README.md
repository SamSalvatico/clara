# clara

## Index

- [Start](#start)
- [The code](#the-code)
- [Classic run](#classic-run)
- [Docker run](#docker-run)
- [Endpoints and docs](#endpoints-and-docs)
- [Tests](#tests)
- [Optional config](#optional-config)
- [Example And Manual Tests](#example-and-manual-tests)

## Start

This project was developed using Ubuntu 20.04.

To start you need to have on your machine:

- [Node.js](https://nodejs.org/it/) ^12;
- [npm](https://www.npmjs.com/) ^6;
- [docker](https://docker.com), if you want to run it as image (tested with docker v19.03.8);
- An internet connection!

The test database is hosted on [MongoAtlas](https://www.mongodb.com/cloud/atlas), it contains the bundles and the products collections filled with example jsons.

## The code

This project was developed on top of fastify.js framework.

The main entry point is the _server.ts_ file in the source folder.\
The server starts and register the needed routes.\
In the _modules_ folder you can find the modules where I define all the classes we need to work with that model.
The _-index_ class is the one where I manage the routing, the _-schema_ class is used to serialize and validate the request and the reply, the _-model_ class defines the fields we will find in a Product, the _-service_ class contains our logics.\
In the _test_ folder you can find the test I wrote.

## Classic run

Before of all you have to copy the .env.example file into a .env file.
After that you must uncomment the "# The standalone ones" connection string key and comment the "# The Docker credentials" one.

To start the application using npm you have to run in the root folder

```
npm install && \
npm run start
```

Et voilà! You're ready to work at port 3000 of your localhost.

## Docker run

If the "# The Docker credentials" is the active one in the .env.example file or in the .env file you're okay, otherwise you have to uncomment it.

To start the application using docker you have to run in the root folder

```
docker-compose build && docker-compose up
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
You can find the tests in the *test* folder. 
In the **cart.test.ts** file you can find the methods
- processInputOneCartCheckout;
- processInputTwoCartCheckout;
- processInputThreeCartCheckout;

That test the code against the input data.

## Optional config

If you want to run thee project with different configurations you have to copy the _.env.example_ file into a _.env_ file and edit your configurations.
Remember: to run in docker the host must be the 0.0.0.0.

## Example And Manual Tests

This is the workflow you can follow to test the code.

If you go to "{{baseUrl}}/documentation" you can find a fully functional swagger-client to test the repo.

Some example data are seed during the start phase of the server.

Create a cart

```
POST {baseUrl}/carts
```
You'll get the id in the response.

Get all the available products

```
GET {baseUrl}/products
``` 

To add a product to the cart

```
POST {baseUrl}/carts/products/{theIdOfTheSelectedProduct}
```