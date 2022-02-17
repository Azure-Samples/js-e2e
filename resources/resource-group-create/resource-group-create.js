// Include npm dependencies
const { DefaultAzureCredential } = require("@azure/identity");
const { ResourceManagementClient } = require("@azure/arm-resources");

// Get subscription from environment variables
const subscriptionId = process.env["AZURE_SUBSCRIPTION_ID"];
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
const client = new ResourceManagementClient(credentials, subscriptionId);

async function main(){
    const ownerAlias = "jsmith";
    const location = "westus";

    // Resource group definition
    const resourceGroupName = `${ownerAlias}-ResourceGroup`;
    const resourceGroupParameters = {
        location: location,
        tags: { createdBy: ownerAlias },
    };

    // Create resource groups in subscription
    const createResult = await client.resourceGroups.createOrUpdate(resourceGroupName,resourceGroupParameters);
    console.log(createResult)

    /*
    {
    id: '/subscriptions/12345/resourceGroups/jsmith-ResourceGroup',
    name: 'jsmith-ResourceGroup',
    type: 'Microsoft.Resources/resourceGroups',
    properties: { provisioningState: 'Succeeded' },
    location: 'westus',
    tags: { createdBy: 'jsmith' }
    } 
    */
}
  
main().catch(err => {
    console.log(err);
  });