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

async function main(){
  // use credential to authenticate with Azure SDKs
  const client = new ComputeManagementClient(credentials,subscriptionId);

  // get details of each subscription
  const listResult = new Array();
  for await (const item of client.virtualMachines.listAll()){
    listResult.push(item);
  }
  console.log(JSON.stringify(listResult));

  /*
    Result is an array of items. Each item looks something like:

    {
      "id": "/subscriptions/123456/resourceGroups/johnsmith-TESTRG3215/providers/Microsoft.Compute/virtualMachines/johnsmithvm6859",
      "name": "johnsmithvm6859",
      "type": "Microsoft.Compute/virtualMachines",
      "location": "eastus",
      "hardwareProfile": { "vmSize": "Standard_B1ls" },
      "storageProfile": {
        "imageReference": {
          "publisher": "Canonical",
          "offer": "UbuntuServer",
          "sku": "14.04.3-LTS",
          "version": "14.04.201805220",
          "exactVersion": "14.04.201805220"
        },
        "osDisk": {
          "osType": "Linux",
          "name": "johnsmithosdisk9293",
          "vhd": {
            "uri": "https://johnsmithac1195.blob.core.windows.net/nodejscontainer/osnodejslinux.vhd"
          },
          "caching": "None",
          "createOption": "FromImage",
          "diskSizeGB": 30,
          "deleteOption": "Detach"
        },
        "dataDisks": []
      },
      "osProfile": {
        "computerName": "johnsmithvm6859",
        "adminUsername": "notadmin",
        "linuxConfiguration": {
          "disablePasswordAuthentication": false,
          "provisionVMAgent": true,
          "patchSettings": {
            "patchMode": "ImageDefault",
            "assessmentMode": "ImageDefault"
          }
        },
        "secrets": [],
        "allowExtensionOperations": true,
        "requireGuestProvisionSignal": true
      },
      "networkProfile": {
        "networkInterfaces": [
          {
            "id": "/subscriptions/123456/resourceGroups/johnsmith-testrg3215/providers/Microsoft.Network/networkInterfaces/johnsmithnic7962",
            "primary": true
          }
        ]
      },
      "provisioningState": "Succeeded",
      "vmId": "987654"
    }

    */
}

main().catch(err => {
  console.log(err);
});