// Include npm dependencies
const { DefaultAzureCredential } = require("@azure/identity");
const { ResourceManagementClient } = require("@azure/arm-resources");

// Get subscription from environment variables
const subscriptionId = process.env["AZURE_SUBSCRIPTION"];
if (!subscriptionId) throw Error("Azure Subscription is missing from environment variables.")

// The following code is only used to check you have environment
// variables configured. The DefaultAzureCredential reads your
// environment - it doesn't read these variables. 
const tenantId = process.env["AZURE_TENANT_ID"];
if (!tenantId) throw Error("AZURE_TENANT_ID is missing from environment variables.")
const clientId = process.env["AZURE_CLIENT_ID"];
if (!clientId) throw Error("AZURE_CLIENT_ID is missing from environment variables.")
const secret = process.env["AZURE_CLIENT_SECRET"];
if (!secret) throw Error("AZURE_CLIENT_SECRET is missing from environment variables.")

// Create Azure authentication credentials
const credentials = new DefaultAzureCredential();

// Create Azure SDK client for Resource Management such as resource groups
const resourceManagement = new ResourceManagementClient(credentials, subscriptionId);

resourceManagement.resources.list(function (err, result, request, response) {
    if (err) {
      console.log(err);
    } else {
      console.log(JSON.stringify(result));
    }
  });