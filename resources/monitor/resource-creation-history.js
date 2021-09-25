const { DefaultAzureCredential } = require("@azure/identity");
const { MonitorManagementClient } = require("@azure/arm-monitor");
const dayjs = require('dayjs');

// resource group - returns all resource groups if not specified
const resourceGroupName = "";

// days needs to be less than or equal to 90
const daysAgo = 10;

// filter
// https://docs.microsoft.com/en-us/javascript/api/@azure/arm-monitor/activitylogs?view=azure-node-latest#list_string__ActivityLogsListOptionalParams__ServiceCallback_EventDataCollection__
const greaterThanIsoTime = dayjs().subtract(daysAgo, 'day').toISOString()
const lessThanIsoTime = new Date().toISOString();
let filter = `eventTimestamp ge '${greaterThanIsoTime}' and eventTimestamp le '${lessThanIsoTime}'`
filter += (resourceGroupName) ? ` and resourceGroupName eq '${resourceGroupName}'` : null;

// Azure authentication in environment variables for DefaultAzureCredential
const subscriptionId = process.env["AZURE_SUBSCRIPTION_ID"];
console.log(`tenant = ${process.env["AZURE_TENANT_ID"]}`);
console.log(`client id = ${process.env["AZURE_CLIENT_ID"]}`);
console.log(`client secret = ${process.env["AZURE_CLIENT_SECRET"]}`);
console.log(`subscription id = ${subscriptionId}`);

const creds = new DefaultAzureCredential();
const client = new MonitorManagementClient(creds, subscriptionId);

client.activityLogs.list(filter).then((result) => {
  let arrObjects = [];

  result.forEach(element => {
    arrObjects.push({
      "resourceGroupName": element?.resourceGroupName,
      "action": element?.authorization?.action,
      "user" : element?.claims?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
      "resourceProviderName": element?.resourceProviderName,
      "resourceType": element?.resourceType,
      "operationName": element.operationName,
      "status": element.status,
      "eventTimestamp": element.eventTimestamp
  })});

  console.log(arrObjects);
}).catch((err) => {
  console.log("An error occurred:");
  console.log(err);
});
/*

Example element:

  {
    resourceGroupName: 'johnsmith-temp',
    action: 'Microsoft.DocumentDB/databaseAccounts/listConnectionStrings/action',
    user: 'johnsmith@contoso.com',
    resourceProviderName: {
      value: 'Microsoft.DocumentDB',
      localizedValue: 'Microsoft.DocumentDB'
    },
    resourceType: {
      value: 'Microsoft.DocumentDB/databaseAccounts',
      localizedValue: 'Microsoft.DocumentDB/databaseAccounts'
    },
    operationName: {
      value: 'Microsoft.DocumentDB/databaseAccounts/listConnectionStrings/action',
      localizedValue: 'Get Connection Strings'
    },
    status: { value: 'Succeeded', localizedValue: 'Succeeded' },
    eventTimestamp: 2021-09-21T17:27:22.727Z
  },

*/