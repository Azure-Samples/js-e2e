const { BlobServiceClient } = require("@azure/storage-blob");

const blobAccountConnectionString = process.env["AzureStorageResourceConnectionString"] || "";
const blobAccountDirectoryName = process.env["AzureStorageResourceDirectoryNameForBlobs"] || `test-${Date.now().toString()}`;

const pageSize = 2;

let containerClient=null;
let currentItem = 1;

// publicly accessible files
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

const awaitTimeout = delay => new Promise(resolve => setTimeout(resolve, delay));

const init = async() =>{
  
  // get container client
  const blobServiceClient = BlobServiceClient.fromConnectionString(blobAccountConnectionString);

  // get container's directory client
  containerClient = blobServiceClient.getContainerClient(blobAccountDirectoryName);

  // create container if it doesn't already exist
  await containerClient.createIfNotExists();

}
const upload = async () => {

  console.log(`Upload to ${blobAccountDirectoryName}`);

  files.forEach(async (file) => {

    console.log(`\t\t${currentItem++} - ${file.fileName}`);
    
    await (

      await containerClient
        .getBlobClient(file.fileName)
        .beginCopyFromURL(file.url)

    ).pollUntilDone();
  })
}

const list = async () => {

  console.log(`List`);

  let continuationToken = "";

  let currentPage = 1;

  do {

    // Get Page of Blobs
    iterator = (continuationToken != "") ? containerClient.listBlobsFlat().byPage({ maxPageSize: pageSize, continuationToken }) : containerClient.listBlobsFlat().byPage({ maxPageSize: pageSize });
    page = (await iterator.next()).value;

    // Display list
    if (page.segment?.blobItems) {
      console.log(`\tPage [${currentPage}] `);
      for (const blob of page.segment.blobItems) {
        console.log(`\t\tItem [${currentItem++}] ${blob.name}`);
      }
    };

    // Move to next page
    continuationToken = page.continuationToken;
    if (continuationToken) {
      currentPage++;
    }

  } while (continuationToken != "")

}

const main = async () =>{

  await init();
  await upload();

  currentItem=1;

  //awaitTimeout(5000).then(async() =>{
    await list();
  //});

}

main(() => {
  console.log("done");
}).catch((ex) =>
  console.log(ex)
);

