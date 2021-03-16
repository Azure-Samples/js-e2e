const msRestNodeAuth = require("@azure/ms-rest-nodeauth");
const { WebSiteManagementClient, We } = require("@azure/arm-appservice");

// CHANGE THESE VALUES TO YOUR OWN
// Either set environment variables 
// or set your value to the string at the end
const subscriptionId = process.env["MY-SUBSCRIPTION"] || "";
const resourceGroupName = process.env["MY-RESOURCE-GROUP"] || "";
const resourceName = process.env["MY-RESOURCE-NAME"] || "";

const getSettings = async (creds) => {
    const client = new WebSiteManagementClient(creds, subscriptionId);
    const settingsList = await client.webApps.listApplicationSettings(resourceGroupName, resourceName);
    console.log(JSON.stringify(settingsList));
}
msRestNodeAuth.interactiveLogin().then((creds) => {
    return getSettings(creds);
}).catch((err) => {
  console.error(err);
});

