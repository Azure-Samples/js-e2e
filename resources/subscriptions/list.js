const {
  ClientSecretCredential,
  DefaultAzureCredential,
} = require("@azure/identity");
const { SubscriptionClient } = require("@azure/arm-subscriptions");
require("dotenv").config();

let credentials = null;

const tenantId = process.env["AZURE_TENANT_ID"];
const clientId = process.env["AZURE_CLIENT_ID"];
const secret = process.env["AZURE_CLIENT_SECRET"];

if (process.env.NODE_ENV && process.env.NODE_ENV === "production") {
  // production
  credentials = new DefaultAzureCredential();
} else {
  // development
  if (tenantId && clientId && secret) {
    console.log("development");
    credentials = new ClientSecretCredential(tenantId, clientId, secret);
  } else {
    credentials = new DefaultAzureCredential();
  }
}

async function listSubscriptions() {
  try {
    // use credential to authenticate with Azure SDKs
    const client = new SubscriptionClient(credentials);

    // get details of each subscription
    for await (const item of client.subscriptions.list()) {
      const subscriptionDetails = await client.subscriptions.get(
        item.subscriptionId
      );
      /* 
        Each item looks like:
      
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
      console.log(subscriptionDetails);
    }
  } catch (err) {
    console.error(JSON.stringify(err));
  }
}

listSubscriptions()
  .then(() => {
    console.log("done");
  })
  .catch((ex) => {
    console.log(ex);
  });
