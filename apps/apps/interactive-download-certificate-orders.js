const { InteractiveBrowserCredential } = require("@azure/identity");
const { WebSiteManagementClient } = require("@azure/arm-appservice");

// CHANGE THESE VALUES TO YOUR OWN
// Either set environment variables 
// or set your value to the string at the end
const subscriptionId = process.env["MY-SUBSCRIPTION"] || "";
const resourceGroupName = process.env["MY-RESOURCE-GROUP"] || "";
const resourceName = process.env["MY-RESOURCE-NAME"] || "";

async function getCertificates(){
  const credential = new InteractiveBrowserCredential(); 
  const client = new WebSiteManagementClient(credential, subscriptionId);
  const certificateOrdersList = new Array();
  for await (const item of client.appServiceCertificateOrders.list()){
    certificateOrdersList.push(item);
  }
  console.log(JSON.stringify(certificateOrdersList));
}

getCertificates().catch(err => {
  console.log(err);
});
