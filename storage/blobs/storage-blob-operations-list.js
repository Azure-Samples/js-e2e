const { DefaultAzureCredential } = require("@azure/identity");
const { StorageManagementClient } = require("@azure/arm-storage");
const subscriptionId = process.env["AZURE_SUBSCRIPTION_ID"];

// Use `DefaultAzureCredential` or any other credential of your choice based on https://aka.ms/azsdk/js/identity/examples
// Please note that you can also use credentials from the `@azure/ms-rest-nodeauth` package instead.
const creds = new DefaultAzureCredential();
const client = new StorageManagementClient(creds, subscriptionId);

client.operations.list().then((result) => {
  console.log("The result is:");
  console.log(result);
}).catch((err) => {
  console.log("An error occurred:");
  console.error(err);
});