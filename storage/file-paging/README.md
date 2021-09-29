# Storage samples

## page-through-files

### Create resource

1. Create an Azure Storage resource. 
1. Create a file share and directory, then upload at least 5 files to the directory.

### Set up environment variables

1. Copy the following from the Azure portal for your Azure Storage resource, then set in the corresponding environment variables:

    |Object Type|Storage setting|Environment variable|
    |--|--|--|
    |Files| Storage Account Name|AzureStorageResourceNameForFiles|
    |Files| Storage Account Key|AzureStorageResourceKeyForFiles|
    |Files| Storage Account Share Name|AzureStorageResourceShareNameForFiles|
    |Files| Storage Account Directory Name (under the share)|AzureStorageResourceDirectoryNameForFiles|


### Run code

1. Install and run code:

    ```javascript
    npm install && node page-through-files.js
    ```