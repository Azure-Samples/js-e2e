// Prereq: data already exists in container

// Get environment variables from .env
import * as path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));


/*

Data like

{
    "id": "794ACC61-01E9-49BF-B150-1D02EE01DABC",
    "categoryId": "3E4CEACD-D007-46EB-82D7-31F6141752B2",
    "categoryName": "Components, Road Frames",
    "sku": "FR-R38B-38",
    "name": "LL Road Frame - Blue, 38",
    "description": "The product called \"LL Road Frame - Blue, 38\"",
    "price": 337.22000000000003,
    "tags": [
        {
            "_id": "A2443B36-76AE-4963-9E21-368868F9C514",
            "name": "Tag-6"
        },
        {
            "_id": "F07885AF-BD6C-4B71-88B1-F04295992176",
            "name": "Tag-149"
        }
    ]
}

*/


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
const containerName = `products_1663344094228`;
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

async function executeSql(property, value) {

  // value example string: "%value%"
  const querySpec = {
    query: `select * from products p where p.${property} LIKE @propertyValue`,
    parameters: [
      {
        name: "@propertyValue",
        value: `${value}`,
      },
    ],
  };

  console.log(querySpec);

  const { resources } = await container.items.query(querySpec).fetchAll();

  let i=0;

  for (const item of resources) {
    console.log(`${++i}: ${item.id}: ${item.name}, ${item.sku}`);
  }
}

executeSql('name', '%Blue%');
