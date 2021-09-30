const { BlobServiceClient } = require("@azure/storage-blob");

const blobAccountConnectionString = process.env["AzureStorageResourceConnectionString"] || "";
const blobAccountDirectoryName = process.env["AzureStorageResourceDirectoryNameForBlobs"] || `test-${Date.now().toString()}`;

const files = [
  {
    "url": "https://github.com/Azure/azure-sdk-for-js/blob/main/README.md",
    "fileName": "README.md"
  },
  {
    "url": "https://github.com/Azure/azure-sdk-for-js/blob/main/gulpfile.ts",
    "fileName": "gulpfile.ts"
  },
  {
    "url": "https://github.com/Azure/azure-sdk-for-js/blob/main/rush.json",
    "fileName": "rush.json"
  },  
  {
    "url": "https://github.com/Azure/azure-sdk-for-js/blob/main/package.json",
    "fileName": "package.json"
  },
  {
    "url": "https://github.com/Azure/azure-sdk-for-js/blob/main/tsdoc.json",
    "fileName": "tsdoc.json"
  },
];

const upload = async() => {

  // get container client
  const blobServiceClient = BlobServiceClient.fromConnectionString(blobAccountConnectionString);

  // get container's directory client
  const containerClient = blobServiceClient.getContainerClient(blobAccountDirectoryName);

  // create container if it doesn't already exist
  await containerClient.createIfNotExists();

  files.forEach(async(file) =>{
    await (

      await containerClient
        .getBlobClient(file.fileName)
        .beginCopyFromURL(file.url)
  
    ).pollUntilDone();
  })
}


const main = async () =>{

  await upload();

}

main(() => {
  console.log("done");
}).catch((ex) =>
  console.log(ex)
);


