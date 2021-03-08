const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config();

const fs = require('fs');
const parse = require('csv-parser')
const { finished } = require('stream/promises');

const DATABASE_URL = process.env.DATABASE_URL
    ? process.env.DATABASE_URL
    : 'mongodb://localhost:27017';
const DATABASE_NAME = process.env.DATABASE_NAME || 'my-tutorial-db';
const DATABASE_COLLECTION_NAME =
    process.env.DATABASE_COLLECTION_NAME || 'my-collection';

const csvFile = './books.csv'    
    
let mongoConnection = null;
let db = null;
let collection = null;


// insert each row into MongoDB
const insertData = async (readable) =>{
    
    let i = 0;
    
    for await (const row of readable) {
        console.log(`${i++} = ${JSON.stringify(row.goodreads_book_id)}`);
        await collection.insertOne(row);
    }
}
const bulkInsert = async () => {
    
    mongoConnection = await MongoClient.connect(DATABASE_URL, { useUnifiedTopology: true });
    db = mongoConnection.db(DATABASE_NAME);
    collection = await db.collection(DATABASE_COLLECTION_NAME);
    
    // read file, parse CSV, each row is a chunk
    const readable = fs
    .createReadStream(csvFile)
    .pipe(parse());

    // Pipe rows to insert function
    await insertData(readable)
    await mongoConnection.close();
}

bulkInsert().then(() => {
    console.log('done');

}).catch(err => {
    console.log(`done +  failed ${err}`)
})