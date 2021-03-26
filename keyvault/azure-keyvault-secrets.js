const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

const getSecret = async (secretName, keyVaultName) => {

    if (!secretName || !keyVaultName) {
        throw Error("getSecret: Required params missing")
    }
    
    /* 
    * 
    * 1. Create a resource group for all Azure resources in app
    *    or project - skip if you have already completed for 
    *    this sample app
    * 
    * 2. Create an Azure Key Vault resource in Azure CLI
    * 
    *        az keyvault create \
    *        --subscription REPLACE-WITH-YOUR-SUBSCRIPTION-NAME-OR-ID \
    *        --resource-group REPLACE-WITH-YOUR-RESOURCE-GROUP-NAME \
    *        --name REPLACE-WITH-YOUR-KEY-VAULT-NAME
    * 
    * 3. Create Service Principal (LOGICAL-APP-NAME) for new App 
    *    registration with the following Azure CLI command 
    *    in a bash terminal: 
    * 
    *        az ad sp create-for-rbac \
    *       --name REPLACE-WITH-YOUR-NEW-APP-LOGICAL-NAME
    *       --skip-assignment 
    * 
    *       ServicePrincipalOutput = 
    * 
    *       {
    *           "appId": "123456",
    *           "displayName": "REPLACE-WITH-YOUR-NEW-APP-LOGICAL-NAME",
    *           "name": "http://REPLACE-WITH-YOUR-NEW-APP-LOGICAL-NAME",
    *           "password": "!@#$%",
    *           "tenant": "987654"
    *       }
    * 
    * 4. Set these environment variables to create the REQUIRED 
    *    context to use DefaultAzureCredential.
    * 
    *    AZURE_TENANT_ID: The `tenant` in the JSON response above.
    *    AZURE_CLIENT_ID: The `appId` in the JSON response above.
    *    AZURE_CLIENT_SECRET: The `password` in the JSON response above.
    * 
    * 5. Give Service Principal (LOGICAL-APP-NAME) access to 
    *   Key Vault with Azure CLI command. The value for --spn is
    *   your `appId`.
    * 
    *       az keyvault set-policy \
    *      --subscription REPLACE-WITH-YOUR-SUBSCRIPTION-NAME-OR-ID \
    *      --name "REPLACE-WITH-YOUR-KEY-VAULT-NAME" \
    *      --spn REPLACE-WITH-YOUR-SERVICE-PRINCIPAL-APP-ID \
    *      --secret-permissions get list
    * 
    * 6. Add database connection string as secret named `DATABASEURL`.
    * 
    *      az keyvault secret set \
    *      --subscription REPLACE-WITH-YOUR-SUBSCRIPTION-NAME-OR-ID \
    *      --vault-name "REPLACE-WITH-YOUR-KEY-VAULT-NAME" \
    *      --name "DATABASEURL" \
    *      --value "mongodb://my-cosmos-mongodb"
    * 
    * 7. Call the getSecret function as
    * 
    *      const { getSecret } = require("./azure/azure-keyvault");
    *      const KEY_VAULT_CONNECTION_STRING_SECRET_NAME = "DATABASEURL";
    *      const KEY_VAULT_NAME = "my-keyvault";
    *      let DATABASE_URL = await getSecret(KEY_VAULT_CONNECTION_STRING_SECRET_NAME, KEY_VAULT_NAME);
    */
    
    if (!process.env.AZURE_TENANT_ID ||
        !process.env.AZURE_CLIENT_ID ||
        !process.env.AZURE_CLIENT_SECRET) {
        throw Error("KeyVault can't use DefaultAzureCredential");
    }
    
    const credential = new DefaultAzureCredential();
     
    // Build the URL to reach your key vault
    const url = `https://${keyVaultName}.vault.azure.net`;
     
    try {
        // Create client to connect to service
        const client = new SecretClient(url, credential);
        
        // Get secret Obj
        const latestSecret = await client.getSecret(secretName);
        
        // Return value
        return latestSecret.value;
    } catch (ex) {
        console.log(ex)
        throw ex;
    }
}

module.exports = {
    getSecret
};

