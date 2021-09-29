const {
  ShareClient,
  StorageSharedKeyCredential
} = require("@azure/storage-file-share");

// Page of Files
const pageSize = 2;

// RESOURCE
const fileAccountName = process.env["AzureStorageResourceNameForFiles"] || "";
const fileAccountKey = process.env["AzureStorageResourceKeyForFiles"] || "";
const fileAccountShareName = process.env["AzureStorageResourceShareNameForFiles"] || "";
const fileAccountDirectoryName = process.env["AzureStorageResourceDirectoryNameForFiles"] || "";

// Create client
const getFileDirectoryAccountClient = () => {

  // create account sas token for file service
  const fileCreds = new StorageSharedKeyCredential(
    fileAccountName,
    fileAccountKey
  );

  //get file share client
  const shareClient = new ShareClient(
    `https://${fileAccountName}.file.core.windows.net/${fileAccountShareName}`,
    fileCreds
  );
  const fileDirectoryClient = shareClient.getDirectoryClient(fileAccountDirectoryName);
  return { fileDirectoryClient };
}

const getPage = async (directoryClient, continuationToken) => {

  let pageIterator, pageResponse;

  if (continuationToken) {

    // Get next page 
    pageIterator = directoryClient
      .listFilesAndDirectories()
      .byPage({ continuationToken, maxPageSize: pageSize });

  } else {

    // Get 1st page
    pageIterator = directoryClient
      .listFilesAndDirectories()
      .byPage({ maxPageSize: pageSize });
  }

  pageResponse = (await pageIterator.next()).value;
  return pageResponse;
}
const list = async () =>{

  // Get Azure SDK Storage clients for this task
  const { fileDirectoryClient } = getFileDirectoryAccountClient();

  // Keep continuation token for next page
  let continuationToken = null;

  // Track file count
  let i = 1;
  let pageCount = 1;

  do {

    // Get 1 page of data 
    const listFiles = await getPage(fileDirectoryClient, continuationToken);

    // Store returned continuationToken for next Page
    continuationToken = listFiles.continuationToken;

    console.log(`Page ${pageCount++}\t\tContinuation token:${continuationToken}`);

    // List files in Page
    for (const fileItem of listFiles.segment.fileItems) {
      console.log(`${i++} - file\t: ${fileItem.name}`);
    }

    // stop when there are no more directories and no more pages
  } while (continuationToken !== "");
}

list()
  .then(() =>
    console.log(`done`)
  ).catch((ex) =>
    console.log(ex)
  );