const { ComputeManagementClient}  = require('@azure/arm-compute');
const { AzureCliCredential } = require("@azure/identity");
require('dotenv').config()

const tenantId = process.env["AZURE_TENANT_ID"];
if (!tenantId)
  throw Error("AZURE_TENANT_ID is missing from environment variables.");
const clientId = process.env["AZURE_CLIENT_ID"];
if (!clientId)
  throw Error("AZURE_CLIENT_ID is missing from environment variables.");
const secret = process.env["AZURE_CLIENT_SECRET"];
if (!secret)
  throw Error("AZURE_CLIENT_SECRET is missing from environment variables.");

const credentials = new DefaultAzureCredential();

const getVmInfo = async (subscriptionId, resourceGroupName, vmName) => {
    try {
        const computeClient = new ComputeManagementClient(credentials, subscriptionId);
        const result = await computeClient.virtualMachines.get(resourceGroupName, vmName);

    } catch (err) {
        throw err;
    }

}
const powerOffVM = async (subscriptionId, resourceGroupName, vmName) => {
    try {
        const computeClient = new ComputeManagementClient(credentials, subscriptionId);
        const result = await computeClient.virtualMachines.powerOff(resourceGroupName, vmName);

    } catch (err) {
        throw err;

    }
}

const startVM = async (subscriptionId, resourceGroupName, vmName) => {
    try {
        const computeClient = new ComputeManagementClient(credentials, subscriptionId);
        const result = await computeClient.virtualMachines.start(resourceGroupName, vmName);
        return result;
    } catch (err) {
        throw err;

    }
}

const listVMs = async (subscriptionId) => {
    try {
        const computeClient = new ComputeManagementClient(credentials, subscriptionId);
        const result = await computeClient.virtualMachines.listAll();

    } catch (err) {
        throw(err);

    }
}
const listVmImagesWithFilter = async (subscriptionId,location=null, publisher=null, offer=null, sku=null, top=1) => {
    try {
        const computeClient = new ComputeManagementClient(credentials, subscriptionId);
        return await computeClient.virtualMachineImages.list(location, publisher, offer, sku, { top });
    } catch (err) {
        throw(err);

    }
}
const createVirtualMachine = async(subscriptionId, resourceGroupName, vmName, vmCreationJson)=> {
    const computeClient = new ComputeManagementClient(credentials, subscriptionId);
    return await computeClient.virtualMachines.createOrUpdate(resourceGroupName, vmName, vmCreationJson);
}

const main = async () => {
    const args = require('yargs/yargs')(process.argv.slice(2))
    .argv;

    const subscription = args.s;
    const resourceGroup = args.g;
    const vmName = args.v;

    switch(args.o){
        case 'start':
            console.log("start");
            return await startVM(subscription, resourceGroup, vmName);
            break;
        default: 
            console.log("default");
    }
}
main().then((result)=>{
    console.log(result);
}).catch(ex => {
    console.log(ex);
});