const { DefaultAzureCredential } = require("@azure/identity");
const { AuthorizationManagementClient } = require("@azure/arm-authorization");
const subscriptionId = process.env["AZURE_SUBSCRIPTION_ID"];
const resourceGroupName = process.env["AZURE_RESOURCE_GROUP_NAME"];

// Use `DefaultAzureCredential` or any other credential of your choice based on https://aka.ms/azsdk/js/identity/examples
// Please note that you can also use credentials from the `@azure/ms-rest-nodeauth` package instead.
const creds = new DefaultAzureCredential();
const client = new AuthorizationManagementClient(creds, subscriptionId);
/*
client.classicAdministrators.list().then((result) => {
  console.log("The result is:");
  console.log(result);
}).catch((err) => {
  console.log("An error occurred:");
  console.error(err);
});
*/

// Gets all permissions the caller has for a resource group.
// https://docs.microsoft.com/en-us/javascript/api/@azure/arm-authorization/permissions?view=azure-node-latest#listForResourceGroup_string__msRest_RequestOptionsBase_

client.permissions.listForResourceGroup(resourceGroupName).then((result) => {
    console.log("The result is:");
    console.log(result);
  }).catch((err) => {
    console.log("An error occurred:");
    console.error(err);
  });

  client.permissions.listForResource(resourceGroupName).then((result) => {
    console.log("The result is:");
    console.log(result);
  }).catch((err) => {
    console.log("An error occurred:");
    console.error(err);
  });  