// Get environment variables from .env
import * as path from "path";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
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
const containerName = `products_storedproc-16`;
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

const updatePrices = async(priceChanges)=>{
  const returnStatus = {
    success: true,
    status: {
      updated: [],
      failed: [],
    }};

  // Nothing to do
  if (!priceChanges || priceChanges.length == 0) {
    return returnStatus;
  }

  for (let priceChangeRequest of priceChanges) {
    try {
      // Get product
      const { resource } = await container.item(priceChangeRequest.id, priceChangeRequest.categoryName).read();

      if(!resource) {
        returnStatus.status.failed.push({...priceChangeRequest, status: "not found"});
        continue;
      }

      // update price
      resource.price += priceChangeRequest.priceChange;

      // update product in container
      const updateResult = await container.items.upsert(resource);

      // update status based on HTTP result code
      if ( (updateResult.statusCode > 199) && updateResult.statusCode < 300){
        returnStatus.status.updated.push(priceChangeRequest);
      } else {
        returnStatus.status.failed.push(priceChangeRequest);
      }
    } catch (err) {
      // update status
      returnStatus.status.failed.push(priceChangeRequest);
    }
  }

  return {
    success: returnStatus.status.updated.length === priceChanges.length ? true : false,
    status: returnStatus.status
  };
};



const initialData = [
  {
      "id": "027D0B9A-F9D9-4C96-8213-C8546C4AAE71",
      "categoryId": "26C74104-40BC-4541-8EF5-9892F7F03D72",
      "categoryName": "Components, Saddles",
      "sku": "SE-R581",
      "name": "LL Road Seat/Saddle",
      "description": "The product called \"LL Road Seat/Saddle\"",
      "price": 27.120000000000001,
      "tags": [
          {
              "id": "0573D684-9140-4DEE-89AF-4E4A90E65666",
              "name": "Tag-113"
          },
          {
              "id": "6C2F05C8-1E61-4912-BE1A-C67A378429BB",
              "name": "Tag-5"
          },
          {
              "id": "B48D6572-67EB-4630-A1DB-AFD4AD7041C9",
              "name": "Tag-100"
          },
          {
              "id": "D70F215D-A8AC-483A-9ABD-4A008D2B72B2",
              "name": "Tag-85"
          },
          {
              "id": "DCF66D9A-E2BF-4C70-8AC1-AD55E5988E9D",
              "name": "Tag-37"
          }
      ]
  },
  {
      "id": "08225A9E-F2B3-4FA3-AB08-8C70ADD6C3C2",
      "categoryId": "75BF1ACB-168D-469C-9AA3-1FD26BB4EA4C",
      "categoryName": "Bikes, Touring Bikes",
      "sku": "BK-T79U-50",
      "name": "Touring-1000 Blue, 50",
      "description": "The product called \"Touring-1000 Blue, 50\"",
      "price": 2384.0700000000002,
      "tags": [
          {
              "id": "27B7F8D5-1009-45B8-88F5-41008A0F0393",
              "name": "Tag-61"
          }
      ]
  },
  {
      "id": "0A7E57DA-C73F-467F-954F-17B7AFD6227E",
      "categoryId": "4F34E180-384D-42FC-AC10-FEC30227577F",
      "categoryName": "Components, Pedals",
      "sku": "PD-R563",
      "name": "ML Road Pedal",
      "description": "The product called \"ML Road Pedal\"",
      "price": 62.090000000000003,
      "tags": [
          {
              "id": "14CFF1D6-7749-4A57-85B3-783F47731F32",
              "name": "Tag-7"
          },
          {
              "id": "319E277F-6B7A-483D-81BA-1EC34CC700EB",
              "name": "Tag-163"
          }
      ]
  }
];

const priceUpdates = [
  {
      "id": "027D0B9A-F9D9-4C96-8213-C8546C4AAE71",
      "categoryName": "Components, Saddles",
      "priceChange": 3
  },
  {
      "id": "08225A9E-F2B3-4FA3-AB08-8C70ADD6C3C2",
      "categoryName": "Bikes, Touring Bikes",
      "priceChange": 616
  },
  {
      "id": "0A7E57DA-C73F-467F-954F-17B7AFD6227E",
      "categoryName": "Components, Pedals",
      "price": -32
  },
  {
      "id": "not-in-data-set",
      "categoryName": "Components, Pedals",
      "price": -32
  }
];

for (const item of initialData) {
    
  const { resource } = await container.items.create(item);
  console.log(`'${resource.name}' inserted`);
}
const updateResult = await updatePrices(priceUpdates);
console.log(JSON.stringify(updateResult));

/*

'LL Road Seat/Saddle' inserted
'Touring-1000 Blue, 50' inserted
'ML Road Pedal' inserted
{"success":false,"status":{"updated":[{"id":"027D0B9A-F9D9-4C96-8213-C8546C4AAE71","categoryName":"Components, Saddles","priceChange":3},{"id":"08225A9E-F2B3-4FA3-AB08-8C70ADD6C3C2","categoryName":"Bikes, Touring Bikes","priceChange":616},{"id":"0A7E57DA-C73F-467F-954F-17B7AFD6227E","categoryName":"Components, Pedals","price":-32}],"failed":[{"id":"not-in-data-set","categoryName":"Components, Pedals","price":-32,"status":"not found"}]}}

*/
