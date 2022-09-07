import {
    connectToDatabase,
    insert,
    find,
    remove
} from './cosmosdb-sql-api.js';

// CHANGE THESE VALUES
const cosmosDbSqlResourceName = "YOUR-RESOURCE-NAME";
const cosmosDbSqlResourceKey = "YOUR-RESOURCE-KEY";
const cosmosDbSqlResourceDatabaseName = "DemoDb";
const cosmosDbSqlResourceContainerName = "DemoContainer";


// default data
const cosmosDbSqlResourceDefaultDocs = [
    { name: "Joe", job: "banking" },
    { name: "Jack", job: "security" },
    { name: "Jill", job: "pilot" }];

// use Database
const dbProcess = async (resourceName, resourceKey, dbName, containerName, docs) => {

    const cosmosDbEndpoint = `https://${resourceName}.documents.azure.com:443/`;

    // connect to db
    // create db and container if they don't exist
    const db = await connectToDatabase({
        cosmosDbEndpoint: cosmosDbEndpoint,
        cosmosDbKey: resourceKey,
        cosmosDbDatabase: dbName,
        cosmosDbContainer: containerName
    });

    if (!db) {
        throw Error("db not working")
    } 

    // insert new docs
    const insertResult = await insert(docs);
    console.log("inserted " + insertResult.length)

    // find all
    const findAllArray = await find();
    for (const item of findAllArray) {
        console.log(`${item.id}:${item.name}`);
    }

    // find last item
    const findOneResult = await find((findAllArray[findAllArray.length-1]).id);
    console.log(`${findOneResult.id}:${findOneResult.name}`);

    // remove last item
    const removeOneResult = await remove((findAllArray[findAllArray.length-1]).id);
    console.log(`${removeOneResult}`);

    // remove remaining 2
    await remove();
    const findResult3 = await find();
    if(findResult3.length===0){
        console.log("removed all, now have " + findResult3.length);
    } else {
        throw Error(`Expected zero items but received ${findResult3.length} items`);
    }

    return;

}

dbProcess(
    cosmosDbSqlResourceName,
    cosmosDbSqlResourceKey,
    cosmosDbSqlResourceDatabaseName,
    cosmosDbSqlResourceContainerName,
    cosmosDbSqlResourceDefaultDocs
    )
    .then(() => {
        console.log("done")
    }).catch(err => {
        console.log(err)
    })