const { DefaultAzureCredential } = require("@azure/identity");
const { AuthorizationManagementClient } = require("@azure/arm-authorization");
const subscriptionId = process.env["AZURE_SUBSCRIPTION_ID"];

// Use `DefaultAzureCredential` or any other credential of your choice based on https://aka.ms/azsdk/js/identity/examples
// Please note that you can also use credentials from the `@azure/ms-rest-nodeauth` package instead.
const creds = new DefaultAzureCredential();
const client = new AuthorizationManagementClient(creds, subscriptionId);

async function main(){
  const ListResult = new Array();
  for await (const item of client.classicAdministrators.list()){
    ListResult.push(item);
  }
  console.log(JSON.stringify(ListResult));
}

main();