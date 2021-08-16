// used to prettify the JSON
const stringifyObject = require('stringify-object');

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

// import Azure npm dependency for Identity credential method
const { DefaultAzureCredential } = require("@azure/identity");
const credentials = new DefaultAzureCredential();

const { ResourceManagementClient } = require("@azure/arm-resources");
const resourceManagement = new ResourceManagementClient(credentials, subscriptionId);

resourceManagement.resourceGroups.list()
.then(result=>{

    const prettyJsonResult = stringifyObject(result, {
        indent: '  ',
        singleQuotes: false
    });

    console.log(prettyJsonResult);

}).catch(err=>{console.log(err)});