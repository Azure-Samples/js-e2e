# Storage samples

## copy-from-files-to-blobs.js

### Create resources

While this sample should work with two separate Azure Storage resources, it was tested with the same, single resource. 

1. Create an Azure Storage resource. 
1. Create a file share and directory, then upload at least 5 files to the directory.
1. Create a container directory. It can be the same name as the file directory. 

### Set up environment variables

1. Copy the following from the Azure portal for your Azure Storage resource, then set in the corresponding environment variables:

    |Object Type|Storage setting|Environment variable|
    |--|--|--|
    |Files| Storage Account Name|AzureStorageResourceNameForFiles|
    |Files| Storage Account Key|AzureStorageResourceKeyForFiles|
    |Files| Storage Account Share Name|AzureStorageResourceShareNameForFiles|
    |Files| Storage Account Directory Name (under the share)|AzureStorageResourceDirectoryNameForFiles|
    |Blobs| Storage Account Connection String|AzureStorageResourceConnectionString|
    |Blobs| Storage Account Directory Name|AzureStorageResourceDirectoryNameForBlobs| 

### Run code

1. Install and run code:

    ```javascript
    npm install && node copy-from-files-to-blobs.js
    ```