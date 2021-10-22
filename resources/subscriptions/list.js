const { DefaultAzureCredential } = require("@azure/identity");
const { SubscriptionClient } = require("@azure/arm-subscriptions");

// Get subscription from environment variables
const subscriptionId = process.env["AZURE_SUBSCRIPTION"];
if (!subscriptionId) throw Error("Azure Subscription is missing from environment variables.")

// The following code is only used to check you have environment
// variables configured. The DefaultAzureCredential reads your
// environment - it doesn't read these variables. 
const tenantId = process.env["AZURE_TENANT_ID"];
if (!tenantId) throw Error("AZURE_TENANT_ID is missing from environment variables.")
const clientId = process.env["AZURE_CLIENT_ID"];
if (!clientId) throw Error("AZURE_CLIENT_ID is missing from environment variables.")
const secret = process.env["AZURE_CLIENT_SECRET"];
if (!secret) throw Error("AZURE_CLIENT_SECRET is missing from environment variables.")

if (!subscriptionId || !tenantId || !clientId || !secret) return;

const subscriptions = async () => {

  try {

    const credentials = new DefaultAzureCredential();
    const client = new SubscriptionClient(credentials);

    const list = await client.subscriptions.list(subscriptionId);

    for (const item of list) {
      const subscriptionDetails = await client.subscriptions.get(item.subscriptionId);

    /*
  
    Each item looks (something) like:
  
    {
      id: '/subscriptions/123456',
      subscriptionId: '123456',
      displayName: 'YOUR-SUBSCRIPTION-NAME',
      state: 'Enabled',
      subscriptionPolicies: {
        locationPlacementId: 'Internal_2014-09-01',
        quotaId: 'Internal_2014-09-01',
        spendingLimit: 'Off'
      },
      authorizationSource: 'RoleBased'
    },
  
    */

      console.log(subscriptionDetails)
    }
  } catch (err) {
    console.log("An error occurred:");
    console.error(err);
  }
}

subscriptions().then(() => console.log("done")).catch(err => { "error " + err })


