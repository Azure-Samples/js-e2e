const { ClientSecretCredential, DefaultAzureCredential } = require("@azure/identity");
const { ComputeManagementClient }  = require('@azure/arm-compute');

// Azure authentication in environment variables for DefaultAzureCredential
let credentials = null;
const tenantId = process.env["AZURE_TENANT_ID"] || "REPLACE-WITH-YOUR-TENANT-ID"; 
const clientId = process.env["AZURE_CLIENT_ID"] || "REPLACE-WITH-YOUR-CLIENT-ID"; 
const secret = process.env["AZURE_CLIENT_SECRET"] || "REPLACE-WITH-YOUR-CLIENT-SECRET";
const subscriptionId = process.env["AZURE_SUBSCRIPTION_ID"] || "REPLACE-WITH-YOUR-SUBSCRIPTION_ID";

const resourceGroupName = "REPLACE-WITHYOUR-RESOURCE_GROUP-NAME";
const vmResourceName = "REPLACE-WITHYOUR-RESOURCE-NAME";

if(process.env.production){

  // production
  credentials = new DefaultAzureCredential();

}else{

  // development
  credentials = new ClientSecretCredential(tenantId, clientId, secret);
  console.log("development");
}

async function stopVM(){
  const computeClient = new ComputeManagementClient(credentials, subscriptionId);
  const result = await computeClient.virtualMachines.powerOff(resourceGroupName, vmResourceName);
  return result;
}

stopVM().then(result => {
  console.log(JSON.stringify(result));
}).catch(err=> {
  console.log(err);
})
/*

Stop operation results:

{
  "startTime":"2021-10-27T16:35:59.6006484+00:00",
  "endTime":"2021-10-27T16:35:59.850632+00:00",
  "status":"Succeeded",
  "name":"1773c5e7-d904-4f98-b2a6-6e2f2465407f"
}

*/