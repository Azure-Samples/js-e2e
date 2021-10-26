const { ClientSecretCredential, DefaultAzureCredential } = require("@azure/identity");
const { ComputeManagementClient }  = require('@azure/arm-compute');

// Azure authentication in environment variables for DefaultAzureCredential
let credentials = null;
const tenantId = process.env["AZURE_TENANT_ID"] || "REPLACE-WITH-YOUR-TENANT-ID"; 
const clientId = process.env["AZURE_CLIENT_ID"] || "REPLACE-WITH-YOUR-CLIENT-ID"; 
const secret = process.env["AZURE_CLIENT_SECRET"] || "REPLACE-WITH-YOUR-CLIENT-SECRET";
const subscriptionId = process.env["AZURE_SUBSCRIPTION_ID"] || "REPLACE-WITH-YOUR-SUBSCRIPTION_ID";

if(process.env.production){

  // production
  credentials = new DefaultAzureCredential();

}else{

  // development
  credentials = new ClientSecretCredential(tenantId, clientId, secret);
  console.log("development");
}

const listVMs = async () => {

    const computeClient = new ComputeManagementClient(credentials, subscriptionId);
    const result = await computeClient.virtualMachines.listAll();
    console.log(JSON.stringify(result));
}

listVMs().then((result)=>{
    console.log(result);
}).catch(ex => {
    console.log(ex);
});