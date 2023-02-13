const {
  ClientSecretCredential,
  DefaultAzureCredential,
} = require("@azure/identity");
const { ComputeManagementClient } = require("@azure/arm-compute");

// Azure authentication in environment variables for DefaultAzureCredential
let credentials = null;
const tenantId =
  process.env["AZURE_TENANT_ID"] || "REPLACE-WITH-YOUR-TENANT-ID";
const clientId =
  process.env["AZURE_CLIENT_ID"] || "REPLACE-WITH-YOUR-CLIENT-ID";
const secret =
  process.env["AZURE_CLIENT_SECRET"] || "REPLACE-WITH-YOUR-CLIENT-SECRET";
const subscriptionId =
  process.env["AZURE_SUBSCRIPTION_ID"] || "REPLACE-WITH-YOUR-SUBSCRIPTION_ID";

if (process.env.production) {
  // production
  credentials = new DefaultAzureCredential();
} else {
  // development
  credentials = new ClientSecretCredential(tenantId, clientId, secret);
}

const listVMsStatus = async () => {

  // Set params to only ask for status
  const virtualMachinesListAllOptionalParams = {
    statusOnly: "true",
  };

  const computeClient = new ComputeManagementClient(
    credentials,
    subscriptionId
  );
  const result = await computeClient.virtualMachines.listAll(
    virtualMachinesListAllOptionalParams
  );
  result.map((vm) => {
    console.log(`${vm.name}`);
    vm.instanceView.statuses.map((status) => {
      console.log(
        `---${status.displayStatus}${status.time && status.time.length > 0 ? status.time : ""}`
      );
    });
  });
};

listVMsStatus()
  .then((result) => {
    console.log(result);
  })
  .catch((ex) => {
    console.log(ex);
  });

/*
    Result is an array of VMs with only status. Each item looks something like:

    {
        id: "/subscriptions/123456/resourceGroups/JohnSmith-TESTRG3215/providers/Microsoft.Compute/virtualMachines/JohnSmithvm6859",
        name: "JohnSmithvm6859",
        type: "Microsoft.Compute/virtualMachines",
        location: "eastus",
        hardwareProfile: {},
        provisioningState: "Succeeded",
        instanceView: {
          statuses: [
            {
              code: "ProvisioningState/succeeded",
              level: "Info",
              displayStatus: "Provisioning succeeded",
              time: "2021-10-28T17:41:03.453Z",
            },
            {
              code: "PowerState/running",
              level: "Info",
              displayStatus: "VM running",
            },
          ],
        },
        vmId: "987654",
      }

*/
