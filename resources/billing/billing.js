const { DefaultAzureCredential } = require("@azure/identity");
const { BillingManagementClient } = require("@azure/arm-billing");
const subscriptionId = process.env["AZURE_SUBSCRIPTION_ID"];

console.log(process.env);

// Use `DefaultAzureCredential` or any other credential of your choice based on https://aka.ms/azsdk/js/identity/examples
// Please note that you can also use credentials from the `@azure/ms-rest-nodeauth` package instead.
try {
    const creds = new DefaultAzureCredential();
    const client = new BillingManagementClient(creds, subscriptionId);
    const expand = "testexpand";
    client.billingAccounts.list(expand).then((result) => {
        console.log("The result is:");
        console.log(JSON.stringify(result));
    }).catch((err) => {
        console.log("An error occurred:");
        console.error(JSON.stringify(err));
    });
} catch (err) {
    console.error(JSON.stringify(err));
}