/*

Create an Azure resource group. 

Requires:

Azure subscription already exists. Value is required in the code:
* "REPLACE-WITH-YOUR-SUBSCRIPTION-ID"

Add your email alias, the part before the `@` symbol, to your naming convention:
* "REPLACE-WITH-YOUR-EMAIL-ALIAS"
* "REPLACE-WITH-YOUR-APP-NAME"

References: 
* [Azure SDK Ref Docs for Resources](https://docs.microsoft.com/en-us/javascript/api/overview/azure/resources)

*/

require("dotenv").config();
const subscriptionId = process.env["AZURE_SUBSCRIPTION_ID"];
const myEmailAlias = process.env["EMAIL-ALIAS"];
const myAppName = process.env["APP-NAME"];

const { DefaultAzureCredential } = require("@azure/identity");
const { ResourceManagementClient } = require("@azure/arm-resources");

const resourceCreatedDate = new Date().toISOString();
const resourceGroupName = `${myAppName}-resource-group`;
const resourceGroupLocation = "eastus";

async function createResourceGroup() {
  try {
    // Use Azure Identity Default Credential
    const credentials = new DefaultAzureCredential();

    // Use Azure SDK for Resource Management
    const resourceManagement = new ResourceManagementClient(
      credentials,
      subscriptionId
    );

    // Create
    const parameters = {
      location: resourceGroupLocation,
      tags: {
        owner: myEmailAlias,
        created: resourceCreatedDate,
      },
    };
    console.log("Creating...");
    const createResult = await resourceManagement.resourceGroups.createOrUpdate(
      resourceGroupName,
      parameters
    );
    console.log(JSON.stringify(createResult));

    // Check existence - returns boolean
    console.log("Exists...");
    const checkExistenceResult = await resourceManagement.resourceGroups.checkExistence(
      resourceGroupName
    );
    console.log(JSON.stringify(checkExistenceResult));
  } catch (err) {
    console.log(err);
  }
}

createResourceGroup()
  .then(() => {
    console.log("done");
  })
  .catch((err) => {
    console.log(err);
  });
