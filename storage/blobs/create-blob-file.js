const { DefaultAzureCredential } = require("@azure/identity");
const { BlobServiceClient, StorageSharedKeyCredential, ContainerSASPermissions, SASProtocol } = require("@azure/storage-blob");

// Environment variables already set
const storageAccountName = process.env["AZURE_STORAGE_RESOURCE_NAME"];



const defaultAzureCredential = new DefaultAzureCredential();
const blobServiceClient = new BlobServiceClient(`https://${storageAccountName}.blob.core.windows.net`, defaultAzureCredential);

// add service principal as storage data owner in portal


const createBlob = async (containerName, fileName, fileBlob) => {

  // Create a new container client
  const containerClient = blobServiceClient.getContainerClient(containerName);

  // Get a block blob client
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);

  return await blockBlobClient.upload(fileBlob, fileBlob.length);
};

const alias = `diberry`
const existingContainerName = "jsmith-1630695238674-1630695238674";
const fileName = `${alias}-helloworld-${new Date().getTime()}.txt`;
const data = "Hello, World!";

createBlob(existingContainerName, fileName, data)
  .then((result) => {
    console.log(`Create blob successfully`, result.requestId);
  })
  .catch((err) => {
    console.log(err);
  });
