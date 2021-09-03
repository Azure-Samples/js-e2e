const { DefaultAzureCredential } = require("@azure/identity");
const { BlobServiceClient } = require("@azure/storage-blob");

// Environment variables already set 
const storageAccountName = process.env["AZURE_STORAGE_RESOURCE_NAME"];

const defaultAzureCredential = new DefaultAzureCredential();
const blobServiceClient = new BlobServiceClient(`https://${storageAccountName}.blob.core.windows.net`, defaultAzureCredential);

const createContainer = async (uniqueContainerName, keyValuePairMetadata) => {
  // Create a container
  const containerName = `${uniqueContainerName}-${new Date().getTime()}`;
  const containerClient = blobServiceClient.getContainerClient(containerName);

  const createContainerOptions = {
    access: "container", 
    metadate: keyValuePairMetadata
  };

  return await containerClient.createIfNotExists(createContainerOptions);
  
}

// Searchable metadata to attached to container
const metadata = {
  purpose: "human-resources",
  postProcess: "redact-pii"
}

createContainer(`jsmith-${new Date().getTime()}`, metadata).then(result=>{

  console.log(`Create container successfully`, result.requestId);

}).catch(err=>{console.log(err)});