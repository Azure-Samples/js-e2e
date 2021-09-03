const { DefaultAzureCredential } = require("@azure/identity");
const { StorageManagementClient } = require('@azure/arm-storage');

// Environment variables already set 
const storageAccountName = process.env["AZURE_STORAGE_RESOURCE_NAME"];
const resourceGroupName = process.env["AZURE_RESOURCE_GROUP_NAME"];
const location = process.env["AZURE_RESOURCE_GROUP_LOCATION"];
const subscriptionId = process.env["AZURE_SUBSCRIPTION_ID"];

const defaultAzureCredential = new DefaultAzureCredential();

const storageClient = new StorageManagementClient(defaultAzureCredential, subscriptionId);

const createStorageAccount = async () => {

    const accType = "Standard_LRS";

    const createParameters = {
      location: location,
      sku: {
        name: accType,
      },
      kind: 'Storage',
      tags: {
        tag1: 'val1',
        tag2: 'val2'
      }
    };
    return storageClient.storageAccounts.create(resourceGroupName, storageAccountName, createParameters);
  }

  createStorageAccount().then(result=>{

    console.log(result);

    /*

    {
      id: '/subscriptions/12345/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}',
      name: '{storageAccountName}',
      type: 'Microsoft.Storage/storageAccounts',
      tags: { tag1: 'val1', tag2: 'val2' },
      location: 'westus',
      sku: { name: 'Standard_LRS', tier: 'Standard' },
      kind: 'Storage',
      provisioningState: 'Succeeded',
      primaryEndpoints: {
        blob: 'https://{storageAccountName}.blob.core.windows.net/',
        queue: 'https://{storageAccountName}.queue.core.windows.net/',
        table: 'https://{storageAccountName}.table.core.windows.net/',
        file: 'https://{storageAccountName}.file.core.windows.net/'
      },
      primaryLocation: 'westus',
      statusOfPrimary: 'available',
      creationTime: 2021-09-03T18:01:09.470Z,
      keyCreationTime: { key1: 2021-09-03T18:01:09.549Z, key2: 2021-09-03T18:01:09.549Z },
      encryption: {
        services: { blob: [Object], file: [Object] },
        keySource: 'Microsoft.Storage'
      },
      enableHttpsTrafficOnly: true,
      networkRuleSet: {
        bypass: 'AzureServices',
        virtualNetworkRules: [],
        ipRules: [],
        defaultAction: 'Allow'
      },
      privateEndpointConnections: []
    }

    */
  
  }).catch(err=>{console.log(err)});