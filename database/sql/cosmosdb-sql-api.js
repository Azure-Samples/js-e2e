import { CosmosClient } from "@azure/cosmos";

// Unique Id = Guid
const newGuid = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`;
}

let client = null;
let db = null;
let container = null;

// insert array
export const insert = async (newItems) => {

    const results = [];
    for (const item of newItems) {

        item.id = newGuid();
        const result = await container.items.create(item);
        results.push(result.item);
    }
    return results;
};
// find all or by id
export const find = async (id) => {

    if (!id) {
        query = "SELECT * from c"
    } else {
        query = `SELECT * from c where c.id = '${id}'`
    }

    const result = await container.items
        .query(query)
        .fetchAll();

    return result && result.resources ? result.resources : [];
}
// remove all or by id
export const remove = async (id) => {

    // remove 1
    if (id) {
        await container.item(id).delete();
    } else {

        // get all items
        const items = await find();

        // remove all
        for await (const item of items) {
            await container.item(item.id).delete();
        }
    }

    return;
}
// connection with SDK
const connect = ( cosmosDbEndpoint, cosmosDbKey ) => {
    try {

        const connectToCosmosDB = {
            endpoint: cosmosDbEndpoint,
            key: cosmosDbKey
        }

        return new CosmosClient(connectToCosmosDB);

    } catch (err) {
        console.log('Cosmos DB SQL API - can\'t connected - err');
        console.log(err);
    }
}
export const connectToDatabase = async ({
    cosmosDbEndpoint,
    cosmosDbKey,
    cosmosDbDatabase,
    cosmosDbContainer }) => {

    // if not connected, connect to db
    if (!client) {
        client = connect(cosmosDbEndpoint,
            cosmosDbKey);
    }

    // get db
    if (client) {

        // get DB
        const databaseResult = await client.databases.createIfNotExists({ id: cosmosDbDatabase });
        db = databaseResult.database;

        if (db) {
            // get Container
            const containerResult = await db.containers.createIfNotExists({ id: cosmosDbContainer });
            container = containerResult.container;
            return !!db;
        }
    } else {
        throw new Error("can't connect to client");
    }

    if (!db || !container) {
        throw new Error("can't connect to db or container")
    } else {
        console.log(`Connected to ${dbName}: ${containerName}`);
    }

}
