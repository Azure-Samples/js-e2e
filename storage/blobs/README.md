# Create Storage Blob container in subscription with Azure SDK for JavaScript

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
    AZURE_STORAGE_RESOURCE_NAME: Your Storage account name.
    AZURE_RESOURCE_GROUP_NAME: Your location-specific resource group in your subscription.
    AZURE_RESOURCE_GROUP_LOCATION: Your location, such as `westus`.
    ```                             

    These values are used in the Azure CLI commands that follow and the JavaScript code in `./create-blob-containter.js`.


1. Create Azure Resource group with Azure CLI, with [az group create](https://docs.microsoft.com/cli/azure/group?view=azure-cli-latest#az_group_create), in your subscription and location. 

    ```bash
    az group create \
        --name ${AZURE_RESOURCE_GROUP_NAME} \
        --location ${AZURE_RESOURCE_GROUP_LOCATION} \
        --subscription ${AZURE_SUBSCRIPTION_ID} \
        --tags alias=jsmith
    ```

    Use tags to identify the owner, and purpose. These tags are used to search and filter your resources.

1. Response from that Azure CLI command is:

    ```json
    {
      "id": "/subscriptions/12345/resourceGroups/jsmith-quickstart-azure-resource-group",
      "location": "westus",
      "managedBy": null,
      "name": "jsmith-quickstart-azure-resource-group",
      "properties": {
        "provisioningState": "Succeeded"
      },
      "tags": {
        "alias": "jsmith"
      },
      "type": "Microsoft.Resources/resourceGroups"
    }
    ```

1. Create Azure Storage resource with Azure CLI with [az storage account create](https://docs.microsoft.com/cli/azure/storage/account?view=azure-cli-latest#az_storage_account_create) command:

    ```bash
    az storage account create \
	    --name ${AZURE_STORAGE_RESOURCE_NAME} \
        --resource-group ${AZURE_RESOURCE_GROUP_NAME} \
        --subscription ${AZURE_SUBSCRIPTION_ID} \
        --sku Standard_LRS \
        --tags alias=jsmith
    ```

    The name needs to be numbers and letters only. No other characters are allowed.



1. Complete the following commands from a bash terminal to install package dependencies:

    ```bash
    npm install @azure/identity @azure/arm-storage @azure/storage-blob  --save
    ```

1. Run this script from a bash terminal to create a container in your subscription:

    ```bash
    npm start
    ```

1. Output looks like

    ```JSON
    {
        "id": "/subscriptions/12345/resourceGroups/jsmith-ResourceGroup",
        "name": "jsmith-ResourceGroup",
        "type": "Microsoft.Resources/resourceGroups",
        "properties": { "provisioningState": "Succeeded" },
        "location": "westus",
        "tags": { "createdBy": "jsmith" }
    } 
    ```

## Azure SDK for JavaScript

Azure SDK libraries used in these scripts:

* @azure/identity: [npm package](https://www.npmjs.com/package/@azure/identity), [reference documentation](https://docs.microsoft.com/en-us/javascript/api/@azure/identity/?view=azure-node-latest)
* @azure/storage-blob: [npm package](https://www.npmjs.com/package/@azure/storage-blob), [reference documentation](https://docs.microsoft.com/en-us/javascript/api/@azure/storage-blob/?view=azure-node-latest) 
* @azure/arm-storage: [npm package](https://www.npmjs.com/package/@azure/arm-storage), [reference documentation](https://docs.microsoft.com/en-us/javascript/api/@azure/arm-storage/?view=azure-node-latest)

