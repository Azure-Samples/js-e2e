const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectID;
// read .env file
require('dotenv').config();

/* eslint no-return-await: 0 */

const DATABASE_URL = process.env.DATABASE_URL
    ? process.env.DATABASE_URL
    : 'mongodb://localhost:27017';
const DATABASE_NAME = process.env.DATABASE_NAME || 'my-tutorial-db';
const DATABASE_COLLECTION_NAME =
    process.env.DATABASE_COLLECTION_NAME || 'my-collection';

let mongoConnection = null;
let db = null;

/* eslint no-console: 0 */
console.log(`DB:${DATABASE_URL}`);

const insertDocuments = async (
    documents = [{ a: 1 }, { a: 2 }, { a: 3 }]
) => {
    // check params
    if (!db || !documents)
        throw Error('insertDocuments::missing required params');

    // Get the collection
    const collection = await db.collection(DATABASE_COLLECTION_NAME);

    // Insert some documents
    return await collection.insertMany(documents);
};
const findDocuments = async (
    query = { a: 3 }
) => {
    
    // check params
    if (!db)
        throw Error('findDocuments::missing required params');

    // Get the collection
    const collection = await db.collection(DATABASE_COLLECTION_NAME );

    // find documents
    return await collection.find(query).toArray();
};

const removeDocuments = async (
    docFilter = {}
) => {
    
    // check params
    if (!db )
        throw Error('removeDocuments::missing required params');

    // Get the documents collection
    const collection = await db.collection(DATABASE_COLLECTION_NAME);

    // Delete document
    return await collection.deleteMany(docFilter);
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
    insertDocuments,
    findDocuments,
    removeDocuments,
    ObjectId,
    connectToDatabase
};
