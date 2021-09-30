const { BlobServiceClient } = require("@azure/storage-blob");

const blobAccountConnectionString = "";
const blobAccountDirectoryName = "";

const pageSize = 2;

const list = async () => {

  console.log(`List`);

  let continuationToken = "";
  let currentPage = 1;
  let containerClient=null;
  let currentItem = 1;

  // Get Blob Container - need to have items in container before running this code
  const blobServiceClient = BlobServiceClient.fromConnectionString(blobAccountConnectionString);
  containerClient = blobServiceClient.getContainerClient(blobAccountDirectoryName);

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

list(() => {
  console.log("done");
}).catch((ex) =>
  console.log(ex)
);