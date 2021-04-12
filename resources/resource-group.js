/*

Create an Azure Cognitive Services resource group. 

Requires:

Azure subscription already exists. Value is equired in the code:
* "REPLACE-WITH-YOUR-SUBSCRIPTION-ID"

Add your email alias, the part before the `@` symbol, to your naming convention:
* "REPLACE-WITH-YOUR-EMAIL-ALIAS"
* "REPLACE-WITH-YOUR-APP-NAME"

References: 
* [Azure SDK Ref Docs for Resources](https://docs.microsoft.com/en-us/javascript/api/overview/azure/resources)

*/

const msRestNodeAuth = require ("@azure/ms-rest-nodeauth");
const { ResourceManagementClient } = require("@azure/arm-resources");

const myEmailAlias = process.env["EMAIL-ALIAS"] || "REPLACE-WITH-YOUR-EMAIL-ALIAS";
const myAppName = process.env["APP-NAME"] || "REPLACE-WITH-YOUR-APP-NAME";

const subscriptionId = process.env["SUBSCRIPTION-ID"] || "REPLACE-WITH-YOUR-SUBSCRIPTION-ID";

const resourceCreatedDate = new Date().toISOString();
const resourceGroupName = `${myAppName}-resource-group`;
const resourceGroupLocation = "eastus";
const resourceGroupFilter = `tagName eq 'owner' and tagValue eq '${myEmailAlias}'`;
const resourceGroupTop = 10;

const resourceGroupActions = async (credentials) => {

    try {

        let resourceManagement = new ResourceManagementClient(credentials, subscriptionId);
        
        // Create
        const parameters = {
            location: resourceGroupLocation,
            tags: {
                owner: myEmailAlias,
                created: resourceCreatedDate
            },
        };
        console.log("Creating...");
        const createResult = await resourceManagement.resourceGroups.createOrUpdate(resourceGroupName, parameters);
        console.log(JSON.stringify(createResult));
        
        // Check existence - returns boolean
        console.log("Exists...");
        const checkExistenceResult = await resourceManagement.resourceGroups.checkExistence(resourceGroupName);
        console.log(JSON.stringify(checkExistenceResult)); 
        
        // List filtered by tag name and value
        const properties = {
            filter: resourceGroupFilter,
            top: resourceGroupTop
        };
        console.log("Filtered...");
        const filteredListReturn = await resourceManagement.resourceGroups.list(properties);
        console.log(JSON.stringify(filteredListReturn));
        
        // List all
        console.log("All...");
        const allListResult = await resourceManagement.resourceGroups.list();
        console.log(JSON.stringify(allListResult));
        
        // Delete - HTTP status 200 on success, no body
        console.log("Deleting...");
        const deleteResult = await resourceManagement.resourceGroups.deleteMethod(resourceGroupName);
        console.log(JSON.stringify(deleteResult));
        
    } catch (err) {
        console.log(err);
    }
}

msRestNodeAuth.interactiveLogin().then(async (credentials) => {
        await resourceGroupActions(credentials);
}).catch (err=> { console.log(err) });