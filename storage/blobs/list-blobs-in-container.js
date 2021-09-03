const getBlobsInContainer = async (containerName) => {

    const containerClient = blobServiceClient.getContainerClient(containerName);
  
    const returnedBlobUrls = [];
  
    // get list of blobs in container
    for await (const blob of containerClient.listBlobsFlat()) {
      // assume file is public, so construct URL
      returnedBlobUrls.push(
        `https://${account}.blob.core.windows.net/${containerName}/${blob.name}`
      );
    }
  
    return returnedBlobUrls;
  }