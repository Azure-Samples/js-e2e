const { BlobServiceClient } = require("@azure/storage-blob");

const blobAccountConnectionString = "REPLACE-WITH-YOUR-STORAGE-CONNECTION-STRING";
const blobAccountDirectoryName = `test-${Date.now().toString()}`;

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

  files.forEach(async(file) =>{
    await (

      await containerClient
        .getBlobClient(file.fileName)
        .beginCopyFromURL(file.url)
  
    ).pollUntilDone();
  })
}

upload(() => {
  console.log("done");
}).catch((ex) =>
  console.log(ex)
);
