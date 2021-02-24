// This code has been tested with @azure/cosmos and a Azure CosmosDB SQL API resource

const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectID;

// read .env file
require('dotenv').config();

/* eslint no-return-await: 0 */

const DATABASE_URL = process.env.COSMOSDB_MONGODB_CONNECTION_STRING
    ? process.env.COSMOSDB_MONGODB_CONNECTION_STRING
    : 'mongodb://localhost:27017';
const DATABASE_NAME = process.env.COSMOSDB_MONGODB_DATABASE_NAME || 'my-tutorial-db';
const DATABASE_COLLECTION_NAME =
    process.env.COSMOSDB_MONGODB_COLLECTION_NAME
    || 'my-collection';

let mongoConnection = null;
let db = null;

/* eslint no-console: 0 */
console.log(`DB:${DATABASE_URL}`);

const insert = async (
    documents
) => {
    // check params
    if (!db || !documents)
        throw Error('insertDocuments::missing required params');

    // Get the collection
    const collection = await db.collection(DATABASE_COLLECTION_NAME);

    // Insert array of documents
    return await collection.insertMany(documents);
};
const find = async (
    // default is find all
    query = {}
) => {
    
    // check params
    if (!db)
        throw Error('findDocuments::missing required params');

    // Get the collection
    const collection = await db.collection(DATABASE_COLLECTION_NAME );

    // find documents
    const items = await collection.find(query).toArray();
    
    return items;
};

const remove= async (
    id = null
) => {
    
    // check params
    if (!db )
        throw Error('removeDocuments::missing required params');

    // Get the documents collection
    const collection = await db.collection(DATABASE_COLLECTION_NAME);

    const docs = id ? { _id: ObjectId(id) } : {};
    
    // Delete document
    return await collection.deleteMany(docs);
};

const connect = async (url) => {
    
    // check params
    if (!url) throw Error('connect::missing required params');

    return MongoClient.connect(url, { useUnifiedTopology: true });
};
/* 
eslint consistent-return: [0, { "treatUndefinedAsUnspecified": false }]
*/
const connectToDatabase = async () => {
    try {
        if (!DATABASE_URL || !DATABASE_NAME) {
            console.log('DB required params are missing');
            console.log(`DB required params DATABASE_URL = ${DATABASE_URL}`);
            console.log(`DB required params DATABASE_NAME = ${DATABASE_NAME}`);
        }

        mongoConnection = await connect(DATABASE_URL);
        db = mongoConnection.db(DATABASE_NAME);

        console.log(`DB connected = ${!!db}`);
        
        return !!db;

    } catch (err) {
        console.log('DB not connected - err');
        console.log(err);
    }
};
module.exports = {
    insert,
    find,
    remove,
    connectToDatabase
};
