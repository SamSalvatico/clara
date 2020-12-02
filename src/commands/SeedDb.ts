/* eslint-disable no-unreachable */
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable comma-dangle */
/* eslint-disable prefer-const */
/* eslint-disable prefer-template */
/* eslint-disable @typescript-eslint/no-use-before-define */
import dotenv from 'dotenv';
import mongodb, { MongoClient } from 'mongodb';

const productsToSeed = [
  {
    name: 'book',
    price: 12.49,
    category: 'book',
    is_imported: false,
  },
  {
    name: 'music CD',
    price: 14.99,
    category: 'other',
    is_imported: false,
  },
  {
    name: 'chocolate bar',
    price: 0.85,
    category: 'food',
    is_imported: false,
  },
  {
    name: 'imported box of chocolates',
    price: 10,
    category: 'food',
    is_imported: true,
  },
  {
    name: 'imported bottle of perfume',
    price: 47.50,
    category: 'other',
    is_imported: true,
  },
  {
    name: 'bottle of perfume',
    price: 18.99,
    category: 'other',
    is_imported: false,
  },
  {
    name: 'packet of headache pills',
    price: 9.75,
    category: 'medical',
    is_imported: false,
  },
  {
    name: 'imported packet of sorethroat pills',
    price: 20,
    category: 'medical',
    is_imported: true,
  },
];
async function seedProducts(client: MongoClient) {
  // await client.db().collection('products').deleteMany({});
  const docCount = await client.db().collection('products').countDocuments({}, {});
  if (docCount < 1) {
    await client.db().collection('products').insertMany(productsToSeed);
  }
}

function main() {
  console.log('Started...');
  dotenv.config();
  try {
    if (process.env.MONGO_CONNECTION_STRING == null) {
      throw new Error('Mongo connection string is not set!');
    }
    const mClient = new mongodb.MongoClient(
      process.env.MONGO_CONNECTION_STRING || '',
      { useUnifiedTopology: true }
    );
    mClient.connect(async (err, client) => {
      if (err) {
        throw err;
      }
      await seedProducts(client);
      await mClient.close();
    });
  } catch (err) {
    console.error(err);
  }
}

main();
