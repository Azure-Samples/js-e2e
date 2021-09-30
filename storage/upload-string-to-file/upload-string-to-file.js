const { ShareServiceClient, StorageSharedKeyCredential } = require("@azure/storage-file-share");

// Enter your storage account name and shared key
const account = process.env["AzureStorageResourceNameForFiles"] || "";
const accountKey = process.env["AzureStorageResourceKeyForFiles"] || "";

const main = async () => {

    // Use SharedKeyCredential with storage account and account key
    // SharedKeyCredential is only avaiable in Node.js runtime, not in browsers
    const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
    const serviceClient = new ShareServiceClient(
        // When using AnonymousCredential, following url should include a valid SAS
        `https://${account}.file.core.windows.net`,
        sharedKeyCredential
    );

    // Create new share and directory
    const shareName = `newshare${new Date().getTime()}`;
    const shareClient = serviceClient.getShareClient(shareName);
    await shareClient.create();
    console.log(`Create share ${shareName} successfully`);

    const directoryName = `newdirectory${new Date().getTime()}`;
    const directoryClient = shareClient.getDirectoryClient(directoryName);
    await directoryClient.create();
    console.log(`Create directory ${directoryName} successfully`);

    // Create an azure file then upload to it
    const content = "Hello World!";
    const fileName = "newfile" + new Date().getTime();
    const fileClient = directoryClient.getFileClient(fileName);
    await fileClient.create(content.length);
    console.log(`Create file ${fileName} successfully`);

    // Upload file range
    await fileClient.uploadRange(content, 0, content.length);
    console.log(`Upload file range "${content}" to ${fileName} successfully`);

    // List files and directories under a directory
    // Use DirectoryClient.listFilesAndDirectories() to iterator over files and directories, with the new for-await-of syntax. The kind property can be used to identify whether a iterm is a directory or a file.

    let dirIter1 = directoryClient.listFilesAndDirectories();
    let i = 1;
    for await (const item of dirIter1) {
        if (item.kind === "directory") {
            console.log(`${i} - directory\t: ${item.name}`);
        } else {
            console.log(`${i} - file\t: ${item.name}`);
        }
        i++;
    }
}


main()
    .then(() =>
        console.log(`done`)
    ).catch((ex) =>
        console.log(ex)
    );
