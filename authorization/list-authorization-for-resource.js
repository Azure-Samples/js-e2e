const { DefaultAzureCredential } = require("@azure/identity");
const { AuthorizationManagementClient } = require("@azure/arm-authorization");
const subscriptionId = process.env["AZURE_SUBSCRIPTION_ID"];

// Use `DefaultAzureCredential` or any other credential of your choice based on https://aka.ms/azsdk/js/identity/examples
// Please note that you can also use credentials from the `@azure/ms-rest-nodeauth` package instead.
const creds = new DefaultAzureCredential();
const client = new AuthorizationManagementClient(creds, subscriptionId);

client.classicAdministrators
  .list()
  .then((result) => {
    const roleAssignments = new RoleAssignments(client);

    const subscriptionId = process.env["AZURE_SUBSCRIPTION_ID"];
    const resourceGroupName = process.env["AZURE_RESOURCE_GROUP_NAME"];
    const resourceProviderNamespace = null;
    const parentResourcePath = null;
    const resourceType = null;
    const resourceName = null;

    const options = {};

    roleAssignments
      .listForResource(
        resourceGroupName,
        resourceProviderNamespace,
        parentResourcePath,
        resourceType,
        resourceName,
        options
      )
      .then((result) => {})
      .catch((err) => {
        console.log("An error occurred:");
        console.error(err);
      });

    console.log("The result is:");
    console.log(result);
  })
  .catch((err) => {
    console.log("An error occurred:");
    console.error(err);
  });
