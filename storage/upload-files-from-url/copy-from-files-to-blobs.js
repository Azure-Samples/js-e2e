const { BlobServiceClient } = require("@azure/storage-blob");
const {
  ShareClient,
  generateAccountSASQueryParameters,
  StorageSharedKeyCredential,
  AccountSASResourceTypes,
  AccountSASPermissions,
  AccountSASServices,
} = require("@azure/storage-file-share");

// Page of Files
const pageSize = 2;

// COPY FROM THIS RESOURCE
const fileAccountName = process.env["AzureStorageResourceNameForFiles"] || "";
const fileAccountKey = process.env["AzureStorageResourceKeyForFiles"] || "";
const fileAccountShareName = process.env["AzureStorageResourceShareNameForFiles"] || "";
const fileAccountDirectoryName = process.env["AzureStorageResourceDirectoryNameForFiles"] || "";

// COPY TO THIS RESOURCE
const blobAccountConnectionString = process.env["AzureStorageResourceConnectionString"] || "";
const blobAccountDirectoryName = process.env["AzureStorageResourceDirectoryNameForBlobs"] || "";

// Create From client
const getFileDirectoryAccountClient = () => {

  // create account sas token for file service
  const fileCreds = new StorageSharedKeyCredential(
    fileAccountName,
    fileAccountKey
  );
  const accountSas = generateAccountSASQueryParameters(
    {
      startsOn: new Date(new Date().valueOf() - 8640),
      expiresOn: new Date(new Date().valueOf() + 86400000),
      resourceTypes: AccountSASResourceTypes.parse("sco").toString(),
      permissions: AccountSASPermissions.parse("rwdlc").toString(),
      services: AccountSASServices.parse("f").toString(),
    },
    fileCreds
  ).toString();

  console.log(`accountSas = ${accountSas}`)

  //get file share client
  const shareClient = new ShareClient(
    `https://${fileAccountName}.file.core.windows.net/${fileAccountShareName}`,
    fileCreds
  );
  const fileDirectoryClient = shareClient.getDirectoryClient(fileAccountDirectoryName);
  return { accountSas, fileDirectoryClient };
}

// Create To client
const getBlobAccountClient = async () => {
  
  // get container client
  const blobServiceClient = BlobServiceClient.fromConnectionString(blobAccountConnectionString);

  // get container's directory client
  var containerClient = blobServiceClient.getContainerClient(blobAccountDirectoryName);

  // create container if it doesn't already exist
  await containerClient.createIfNotExists();

  return containerClient;
}

const copyFileToBlob = async (blobClient, toBlobName, fromSourceUrl) => {

  try {

    
    const res = await (

      // copy file to blob from URL
      await blobClient
        .getBlobClient(toBlobName)
        .beginCopyFromURL(fromSourceUrl)

    ).pollUntilDone(); // wait until finished with pollUntilDone

    console.log(res.copyStatus);

  } catch (error) {

    // Copy into Blob failed
    throw error;
  }
}

const getFilesPage = async (directoryClient, continuationToken) => {

  let pageIterator, pageResponse;

  if (continuationToken) {

    // Get next page 
    pageIterator = directoryClient
      .listFilesAndDirectories()
      .byPage({ continuationToken, maxPageSize: pageSize });

  } else {

    // Get page
    pageIterator = directoryClient
      .listFilesAndDirectories()
      .byPage({ maxPageSize: pageSize });
  }

  pageResponse = (await pageIterator.next()).value;
  return pageResponse;
}
async function copy() {

  // Get Azure SDK Storage clients for this task
  const { accountSas, fileDirectoryClient } = getFileDirectoryAccountClient();
  const blobContainerClient = await getBlobAccountClient();

  // Keep a list of directories
  let arrFolders = [];

  // Keep continuation token for next page
  let continuationToken = null;

  // Track file count
  let i = 1;

  arrFolders.push(fileAccountShareName);
  do {

    let fileAccountDirectoryName = arrFolders.pop();

    console.log(`List directories and files under directory ${fileAccountDirectoryName}`);

    // Get 1 page of data 
    const listFilesAndDirectoriesResponse = await getFilesPage(fileDirectoryClient, continuationToken);

    // Store returned continuationToken for next Page
    continuationToken = listFilesAndDirectoriesResponse.continuationToken;

    // Add returned directories to array to process
    for (const dirItem of listFilesAndDirectoriesResponse.segment.directoryItems) {
      console.log(`${i++} - directory\t: ${dirItem.name}`);
      arrFolders.push(
        fileAccountDirectoryName == "" ? dirItem.name : fileAccountDirectoryName + "\\" + dirItem.name
      );
    }

    // Copy files to blobs
    for (const fileItem of listFilesAndDirectoriesResponse.segment.fileItems) {

      console.log(`${i++} - file\t: ${fileItem.name}`);

      const fileClient = fileDirectoryClient.getFileClient(fileItem.name);
      const sourceURL = fileClient.url + "?" + accountSas;
      await copyFileToBlob(blobContainerClient, fileItem.name, sourceURL);

    }

    // stop when there are no more directories and no more pages
  } while (arrFolders.length > 0 || continuationToken !== "");
}

copy()
  .then(() =>
    console.log(`done`)
  ).catch((ex) =>
    console.log(ex)
  );