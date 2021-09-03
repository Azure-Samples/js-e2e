# Create resource group in subscription with Azure SDK for JavaScript

1. Sign in to Azure CLI in terminal. 

    ```bash
    az login     
    ```


1. Create service principal with Azure CLI, replace `YOUR-SERVICE-PRINCIPAL-NAME` with a name 
    such as `jsmith-quickstart-azure`: 

    ```bash
    az ad sp create-for-rbac --name YOUR-SERVICE-PRINCIPAL-NAME   
    ```

1. Save the output in a secure location such as Azure Key vault

    ```json
    {
        "appId": "717...",
        "displayName": "jsmith-quickstart-azure",
        "name": "http://jsmith-quickstart-azure",
        "password": "PEG...",
        "tenant": "72f..."
    }
    ```

1. Create new environment variables. These environment variables are REQUIRED for the context to use DefaultAzureCredential.

    ```
    AZURE_TENANT_ID: `tenant` from the service principal output above.
    AZURE_CLIENT_ID: `appId` from the service principal output above.
    AZURE_CLIENT_SECRET: `password` from the service principal output above.
    AZURE_SUBSCRIPTION_ID: Your default subscription containing your resource groups.
    ```                             

1. Complete the following commands from a bash terminal to install package dependencies:

    ```bash
    npm install @azure/identity @azure/arm-resources  --save
    ```

1. Run this script from a bash terminal to see a list of resource groups in your default subscription:

    ```bash
    npm start
    ```

1. Output looks like

    ```JSON
    {
        'id': '/subscriptions/12345/resourceGroups/jsmith-ResourceGroup',
        'name': 'jsmith-ResourceGroup',
        'type': 'Microsoft.Resources/resourceGroups',
        'properties': { 'provisioningState': 'Succeeded' },
        'location': 'westus',
        'tags': { 'createdBy': 'jsmith' }
    } 
    ```