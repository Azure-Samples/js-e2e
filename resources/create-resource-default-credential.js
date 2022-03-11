/*

Create an Azure Cognitive Services Face resource. 

Requires:

1. Create .env file with key/value:
  * AZURE_SUBSCRIPTION_ID
  * AZURE-RESOURCE-GROUP-NAME
  * EMAIL-ALIAS
  * APP-NAME

2. Install npm packages.

  ```
  npm install dotenv @azure/identity @azure/arm-resources
  ```

3. Run code.  

  ```
  node create-resource-default-credential.js
  ```
  
References: 
* [Azure SDK Ref Docs for resource creation](https://docs.microsoft.com/en-us/javascript/api/@azure/arm-resources/resources?view=azure-node-latest)
* [Resource provider names](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/azure-services-resource-providers)
* [Get versions](https://github.com/Azure/azure-rest-api-specs) - versions are used as subfolders in the REST API repo


*/
require('dotenv').config();
const subscriptionId = process.env["AZURE_SUBSCRIPTION_ID"];
const resourceGroupName = process.env["AZURE-RESOURCE-GROUP-NAME"];
const emailAlias = process.env["EMAIL-ALIAS"];
const appName = process.env["APP-NAME"];

const { DefaultAzureCredential } = require("@azure/identity");
const { ResourceManagementClient } = require("@azure/arm-resources");

// Use Azure Identity Default Credential
const credentials = new DefaultAzureCredential();

async function createAzureFaceResource(credentials){

  try {
    // Use Azure SDK for Resource Management
    const resourceManagementClientContext = new ResourceManagementClient(credentials, subscriptionId);
    const resources = resourceManagementClientContext.resources;

    // These are specific to the Azure Cognitive Services Face API
    const resourceProviderNamespace = "Microsoft.CognitiveServices";
    const parentResourcePath = "";
    const apiVersion = "2017-04-18";

    let parameters = {
      type: "Microsoft.CognitiveServices/accounts",
      location: "eastus",
      tags: {
        alias: emailAlias,
        app: appName
      },
      sku: {
        name: "F0"
      },
      kind: "Face",
      properties: {
        networkAcls: {
          defaultAction: "Allow",
          virtualNetworkRules: [],
          ipRules: []
        },
        privateEndpointConnections: [],
        publicNetworkAccess: "Enabled"
      }
    }

    // Use Date as part of the resource name convention
    const date = new Date();
    const createdDate = date.toJSON().slice(0, 10)

    const resourceType = "accounts";
    const resourceName = `${parameters.tags.alias}-${resourceGroupName}-${resourceType}-${parameters.sku.name}-${createdDate}`;
    const longRunningOperationResult = await resources.beginCreateOrUpdate(resourceGroupName, resourceProviderNamespace, parentResourcePath, resourceType, resourceName, apiVersion, parameters);
    console.log(longRunningOperationResult)
    return longRunningOperationResult;
  } catch (err) {
    console.log(err);
  }
}

createAzureFaceResource().then(() => {
  console.log("done");
}).catch((err) => {
  console.error(err);
});