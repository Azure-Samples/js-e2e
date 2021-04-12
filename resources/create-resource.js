/*

Create an Azure Cognitive Services Face resource. 

Requires:

Azure subscription and Azure resource group already exists. Both are required in the code:
* "REPLACE-WITH-YOUR-SUBSCRIPTION-ID"
* "REPLACE-WITH-YOUR-RESOURCE-GROUP-NAME"

Add your email alias, the part before the `@` symbol, to your naming convention:
* "REPLACE-WITH-YOUR-EMAIL-ALIAS"
* "REPLACE-WITH-YOUR-APP-NAME"

References: 
* [Azure SDK Ref Docs for resource creation](https://docs.microsoft.com/en-us/javascript/api/@azure/arm-resources/resources?view=azure-node-latest)
* [Resource provider names](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/azure-services-resource-providers)
* [Get versions](https://github.com/Azure/azure-rest-api-specs) - versions are used as subfolders in the REST API repo


*/

const msRest = require("@azure/ms-rest-js");
const msRestAzure = require("@azure/ms-rest-azure-js");
const msRestNodeAuth = require("@azure/ms-rest-nodeauth");
const { ResourceManagementClientContext, Resources } = require("@azure/arm-resources");

const createAzureFaceResource = async (credentials) => {

  // Use Azure SDK
  const resourceManagementClientContext = new ResourceManagementClientContext(credentials, subscriptionId);
  const resources = new Resources(resourceManagementClientContext);

  // REPLACE WITH YOUR VALUES
  const subscriptionId = "REPLACE-WITH-YOUR-SUBSCRIPTION-ID";
  const resourceGroupName = "REPLACE-WITH-YOUR-RESOURCE-GROUP-NAME";

  // These are specific to the Azure Cognitive Services Face API
  const resourceProviderNamespace = "Microsoft.CognitiveServices";
  const parentResourcePath = "";
  const apiVersion = "2017-04-18";

  // REPLACE WITH YOUR VALUES
  let parameters = {
    type: "Microsoft.CognitiveServices/accounts",
    location: "eastus",
    tags: {
      alias: process.env["EMAIL-ALIAS"] || "REPLACE-WITH-YOUR-EMAIL-ALIAS",
      app: process.env["APP-NAME"] || "REPLACE-WITH-YOUR-APP-NAME"
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

  longRunningOperationResult = resources.beginCreateOrUpdate(resourceGroupName, resourceProviderNamespace, parentResourcePath, resourceType, resourceName, apiVersion, parameters);

  console.log(longRunningOperation)

}

msRestNodeAuth.interactiveLogin().then(async (credentials) => {
  await createAzureFaceResource(credentials)
}).catch((err) => {
  console.error(err);
});