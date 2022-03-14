const { InteractiveBrowserCredential } = require("@azure/identity");
const { WebSiteManagementClient } = require("@azure/arm-appservice");

// CHANGE THESE VALUES TO YOUR OWN
// Either set environment variables
// or set your value to the string at the end
const subscriptionId = process.env["MY-SUBSCRIPTION"] || "";
const resourceGroupName = process.env["MY-RESOURCE-GROUP"] || "";
const resourceName = process.env["MY-RESOURCE-NAME"] || "";

const creds = new InteractiveBrowserCredential();

async function getSettings(creds) {
  const client = new WebSiteManagementClient(creds, subscriptionId);
  const ApplicationSettingsList = new Array();
  for await (const item of client.webApps.listApplicationSettings(
    resourceGroupName,
    resourceName
  )) {
    ApplicationSettingsList.push(item);
  }
  return ApplicationSettingsList;
}

getSettings(creds)
  .then((result) => {
    console.log(JSON.stringify(result));
  })
  .catch((err) => {
    console.log(err);
  });
