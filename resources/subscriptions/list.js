const { ClientSecretCredential, DefaultAzureCredential } = require("@azure/identity");
const { SubscriptionClient } = require("@azure/arm-subscriptions");

let credentials = null;

const tenantId = process.env["AZURE_TENANT_ID"] || "REPLACE-WITH-YOUR-TENANT-ID"; 
const clientId = process.env["AZURE_CLIENT_ID"] || "REPLACE-WITH-YOUR-CLIENT-ID"; 
const secret = process.env["AZURE_CLIENT_SECRET"] || "REPLACE-WITH-YOUR-CLIENT-SECRET";

if(process.env.NODE_ENV && process.env.NODE_ENV==='production'){

  // production
  credentials = new DefaultAzureCredential();

}else{

  // development
  if(tenantId && clientId && secret){
    credentials = new ClientSecretCredential(tenantId, clientId, secret);
  } else {
    credentials = new DefaultAzureCredential();
  }
}

// use credential to authenticate with Azure SDKs
let client = new SubscriptionClient(credentials);

const subscriptions = async() =>{

  // get list of Azure subscriptions
  const listOfSubscriptions = await client.subscriptions.list();
  
  // get details of each subscription
  for (const item of listOfSubscriptions) {
  
      const subscriptionDetails = await client.subscriptions.get(item.subscriptionId);
  
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
  
      console.log(subscriptionDetails)
  }
}

subscriptions()
.then(()=>console.log("done"))
.catch(ex=>console.log(ex))


