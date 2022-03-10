const { InteractiveBrowserCredential } = require("@azure/identity");
const { WebSiteManagementClient } = require("@azure/arm-appservice");

// CHANGE THESE VALUES TO YOUR OWN
// Either set environment variables 
// or set your value to the string at the end
const subscriptionId = process.env["MY-SUBSCRIPTION"] || "";
const resourceGroupName = process.env["MY-RESOURCE-GROUP"] || "";
const resourceName = process.env["MY-RESOURCE-NAME"] || "";

async function getSettings(credential){ 
  const client = new WebSiteManagementClient(credential, subscriptionId);
  const ApplicationSettingsList = new Array();
  for await (const item of client.webApps.listApplicationSettings(resourceGroupName, resourceName)){
    ApplicationSettingsList.push(item);
  }
  return ApplicationSettingsList;
}

getSettings().then((creds) => {
  return getSettings(creds);
}).catch((err) => {
  console.error(err);
});