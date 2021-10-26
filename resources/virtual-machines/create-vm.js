const util = require("util");
const {
  ClientSecretCredential,
  DefaultAzureCredential,
} = require("@azure/identity");
const { ComputeManagementClient } = require("@azure/arm-compute");
const { ResourceManagementClient } = require("@azure/arm-resources");
const { StorageManagementClient } = require("@azure/arm-storage");
const { NetworkManagementClient } = require("@azure/arm-network");

// Store function output to be used elsewhere
let randomIds = {};
let subnetInfo = null;
let publicIPInfo = null;
let vmImageInfo = null;
let nicInfo = null;

// CHANGE THIS - used as prefix for naming resources
const yourAlias = "diberry";

// CHANGE THIS - used to add tags to resources
const projectName = "azure-samples-create-vm"

//Random number generator for service names and settings
const resourceGroupName = _generateRandomId(`${yourAlias}-testrg`, randomIds);
const vmName = _generateRandomId(`${yourAlias}vm`, randomIds);
const storageAccountName = _generateRandomId(`${yourAlias}ac`, randomIds);
const vnetName = _generateRandomId(`${yourAlias}vnet`, randomIds);
const subnetName = _generateRandomId(`${yourAlias}subnet`, randomIds);
const publicIPName = _generateRandomId(`${yourAlias}pip`, randomIds);
const networkInterfaceName = _generateRandomId(`${yourAlias}nic`, randomIds);
const ipConfigName = _generateRandomId(`${yourAlias}crpip`, randomIds);
const domainNameLabel = _generateRandomId(`${yourAlias}domainname`, randomIds);
const osDiskName = _generateRandomId(`${yourAlias}osdisk`, randomIds);

// Resource configs
const location = "eastus";
const accType = "Standard_LRS";

// Ubuntu config for VM
const publisher = "Canonical";
const offer = "UbuntuServer";
const sku = "14.04.3-LTS";
const adminUsername = "notadmin";
const adminPassword = "Pa$$w0rd92";

// Azure authentication in environment variables for DefaultAzureCredential
const tenantId =
  process.env["AZURE_TENANT_ID"] || "REPLACE-WITH-YOUR-TENANT-ID";
const clientId =
  process.env["AZURE_CLIENT_ID"] || "REPLACE-WITH-YOUR-CLIENT-ID";
const secret =
  process.env["AZURE_CLIENT_SECRET"] || "REPLACE-WITH-YOUR-CLIENT-SECRET";
const subscriptionId =
  process.env["AZURE_SUBSCRIPTION_ID"] || "REPLACE-WITH-YOUR-SUBSCRIPTION_ID";

let credentials = null;

if (process.env.production) {
  // production
  credentials = new DefaultAzureCredential();
} else {
  // development
  credentials = new ClientSecretCredential(tenantId, clientId, secret);
  console.log("development");
}
// Azure services
const resourceClient = new ResourceManagementClient(
  credentials,
  subscriptionId
);
const computeClient = new ComputeManagementClient(credentials, subscriptionId);
const storageClient = new StorageManagementClient(credentials, subscriptionId);
const networkClient = new NetworkManagementClient(credentials, subscriptionId);

// Create resources then manage them (on/off)
const main = async () => {
  await createResources();
};

// Create resources then manage them (on/off)
const createResources = async () => {
  try {
    result = await createResourceGroup();
    accountInfo = await createStorageAccount();
    vnetInfo = await createVnet();
    subnetInfo = await getSubnetInfo();
    publicIPInfo = await createPublicIP();
    nicInfo = await createNIC(subnetInfo, publicIPInfo);
    vmImageInfo = await findVMImage();
    nicResult = await getNICInfo();
    vmInfo = await createVirtualMachine(nicInfo.id, vmImageInfo[0].name);
    return;
  } catch (err) {
    console.log(err);
  }
};

const createResourceGroup = async () => {
  const groupParameters = {
    location: location,
    tags: { project: projectName },
  };
  console.log("\n1.Creating resource group: " + resourceGroupName);
  return await resourceClient.resourceGroups.createOrUpdate(
    resourceGroupName,
    groupParameters
  );
};

const createStorageAccount = async () => {
  console.log("\n2.Creating storage account: " + storageAccountName);
  const createParameters = {
    location: location,
    sku: {
      name: accType,
    },
    kind: "Storage",
    tags: {
      project: projectName
    },
  };
  return await storageClient.storageAccounts.create(
    resourceGroupName,
    storageAccountName,
    createParameters
  );
};
const createVnet = async () => {
  const vnetParameters = {
    location: location,
    addressSpace: {
      addressPrefixes: ["10.0.0.0/16"],
    },
    dhcpOptions: {
      dnsServers: ["10.1.1.1", "10.1.2.4"],
    },
    subnets: [{ name: subnetName, addressPrefix: "10.0.0.0/24" }],
  };
  console.log("\n3.Creating vnet: " + vnetName);
  return await networkClient.virtualNetworks.createOrUpdate(
    resourceGroupName,
    vnetName,
    vnetParameters
  );
};

const getSubnetInfo = async () => {
  console.log("\nGetting subnet info for: " + subnetName);
  return await networkClient.subnets.get(
    resourceGroupName,
    vnetName,
    subnetName
  );
};
const createPublicIP = async () => {
  const publicIPParameters = {
    location: location,
    publicIPAllocationMethod: "Dynamic",
    dnsSettings: {
      domainNameLabel: domainNameLabel,
    },
  };
  console.log("\n4.Creating public IP: " + publicIPName);
  return await networkClient.publicIPAddresses.createOrUpdate(
    resourceGroupName,
    publicIPName,
    publicIPParameters
  );
};

const createNIC = async (subnetInfo, publicIPInfo) => {
  const nicParameters = {
    location: location,
    ipConfigurations: [
      {
        name: ipConfigName,
        privateIPAllocationMethod: "Dynamic",
        subnet: subnetInfo,
        publicIPAddress: publicIPInfo,
      },
    ],
  };
  console.log("\n5.Creating Network Interface: " + networkInterfaceName);
  return await networkClient.networkInterfaces.createOrUpdate(
    resourceGroupName,
    networkInterfaceName,
    nicParameters
  );
};
const findVMImage = async () => {
  console.log(
    util.format(
      "\nFinding a VM Image for location %s from " +
        "publisher %s with offer %s and sku %s",
      location,
      publisher,
      offer,
      sku
    )
  );
  return await computeClient.virtualMachineImages.list(
    location,
    publisher,
    offer,
    sku,
    { top: 1 }
  );
};
const getNICInfo = async () => {
  return await networkClient.networkInterfaces.get(
    resourceGroupName,
    networkInterfaceName
  );
};

const createVirtualMachine = async (nicId, vmImageVersionNumber) => {
  const vmParameters = {
    location: location,
    osProfile: {
      computerName: vmName,
      adminUsername: adminUsername,
      adminPassword: adminPassword,
    },
    hardwareProfile: {
      vmSize: "Standard_B1ls",
    },
    storageProfile: {
      imageReference: {
        publisher: publisher,
        offer: offer,
        sku: sku,
        version: vmImageVersionNumber,
      },
      osDisk: {
        name: osDiskName,
        caching: "None",
        createOption: "fromImage",
        vhd: {
          uri:
            "https://" +
            storageAccountName +
            ".blob.core.windows.net/nodejscontainer/osnodejslinux.vhd",
        },
      },
    },
    networkProfile: {
      networkInterfaces: [
        {
          id: nicId,
          primary: true,
        },
      ],
    },
  };
  console.log("6.Creating Virtual Machine: " + vmName);
  console.log(
    " VM create parameters: " + util.inspect(vmParameters, { depth: null })
  );
  await computeClient.virtualMachines.createOrUpdate(
    resourceGroupName,
    vmName,
    vmParameters
  );
};

const _generateRandomId = (prefix, existIds) => {
  var newNumber;
  while (true) {
    newNumber = prefix + Math.floor(Math.random() * 10000);
    if (!existIds || !(newNumber in existIds)) {
      break;
    }
  }
  return newNumber;
};

main()
  .then(() => {
    console.log("success " + resourceGroupName);
  })
  .catch((err) => {
    console.log(err);
  });
