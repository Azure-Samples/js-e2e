const { DefaultAzureCredential } = require("@azure/identity");
const { BillingManagementClient } = require("@azure/arm-billing");

const subscriptionId = process.env["AZURE_SUBSCRIPTION_ID"];
const creds = new DefaultAzureCredential();

// Use `DefaultAzureCredential` or any other credential of your choice based on https://aka.ms/azsdk/js/identity/examples
// Please note that you can also use credentials from the `@azure/ms-rest-nodeauth` package instead.
try{
  const client = new BillingManagementClient(creds, subscriptionId);
  const result = new Array();
  const expand = "testexpand";
  for await (const item of client.billingAccounts.list(expand)){
    result.push(item);
  }
  console.log("The result is:");
  console.log(JSON.stringify(result));
}catch(error) {
  console.log("An error occurred:");
  console.error(JSON.stringify(err));
}

 