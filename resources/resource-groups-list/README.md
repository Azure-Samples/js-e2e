# View resource groups in subscription

1. Sign in to Azure CLI in terminal. 

    ```bash
    az login     
    ```


2. Create service principal with Azure CLI, replace `YOUR-SERVICE-PRINCIPAL-NAME` with a name 
    such as `joesmith-quickstart-azure`: 

    ```bash
    az ad sp create-for-rbac --name YOUR-SERVICE-PRINCIPAL-NAME   
    ```

3. Save the output in a secure location such as Azure Key vault

    ```json
    {
        "appId": "717...",
        "displayName": "joesmith-quickstart-azure",
        "name": "http://joesmith-quickstart-azure",
        "password": "PEG...",
        "tenant": "72f..."
    }
    ```

4. Create new environment variables. These environment variables are REQUIRED for the context to use DefaultAzureCredential.

    ```
    AZURE_TENANT_ID: `tenant` from the service principal output above.
    AZURE_CLIENT_ID: `appId` from the service principal output above.
    AZURE_CLIENT_SECRET: `password` from the service principal output above.
    AZURE_SUBSCRIPTION: Your default subscription containing your resource groups.
    ```                             

5. Complete the following commands from a bash terminal to install package dependencies:

    ```bash
    npm install @azure/identity @azure/arm-resources stringify-object
    ```

    Note: `stringify-object` is only used to provide readable JSON. It is 
    not required to use Azure SDKs. 

6. Run this script from a bash terminal to see a list of resource groups in your default subscription:

    ```bash
    npm start
    ```

7. Pretty output looks like

    ```JSON
    [
        {
                id: "/subscriptions/bb8.../resourceGroups/DefaultResourceGroup-WUS2",
                name: "DefaultResourceGroup-WUS2",
                type: "Microsoft.Resources/resourceGroups",
                properties: {
                    provisioningState: "Succeeded"
                },
                location: "westus2",
                tags: {}
        },
        {
            ...
        }
    ]
    ```