// Get environment variables from .env
import * as path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import * as dotenv from "dotenv";
dotenv.config();

// Get Cosmos Client
import { CosmosClient } from "@azure/cosmos";


// Provide required connection from environment variables
const key = process.env.COSMOS_KEY;
// Endpoint format: https://YOUR-RESOURCE-NAME.documents.azure.com:443/
const endpoint = process.env.COSMOS_ENDPOINT;
// Authenticate to Azure Cosmos DB
const cosmosClient = new CosmosClient({ endpoint, key });

// Set Database name and container name
const databaseName = `contoso_1663344094228`;
const containerName = `products_upsert-3`;
const partitionKeyPath = ["/categoryName"];

const { database } = await cosmosClient.databases.createIfNotExists({
  id: databaseName,
});
const { container } = await database.containers.createIfNotExists({
  id: containerName,
  partitionKey: {
    paths: partitionKeyPath,
  },
});

/*

    Rules: 
    If item with same "id" is present, update
    If item with same "id" is not present, insert


*/
async function upsert(fileAndPathToJson, encoding='utf-8') {

    console.log(fileAndPathToJson);
  
    const data = JSON.parse(await fs.readFile(path.join(__dirname, fileAndPathToJson), encoding));
    console.log(data);
  
    const { resource } = await container.items.upsert(data);
    console.log(`'${resource.name}' inserted`);
  }

await upsert('./new_item.json');
await upsert('./update_item.json');
await upsert('./update_partition_key.json');

const { resources } = await container.items.readAll().fetchAll();

for (const item of resources) {
    console.log(`${item.id}: ${item.name}, ${item.sku}`);
}
