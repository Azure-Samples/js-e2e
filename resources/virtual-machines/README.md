# Create, manage, and delete a virtual machine

A virtual machine is a collection of Azure resources. To use these scripts:

* Create a service principal
* Add Azure authentication environment variables or change variables in the code files. 
* Install dependences

    ```bash
    npm install
    ```

* Change any variables specific to your use. For the VM creation script, the two variables are:

    ```javascript
    // CHANGE THIS - used as prefix for naming resources
    const yourAlias = "johnsmith";

    // CHANGE THIS - used to add tags to resources
    const projectName = "azure-samples-create-vm";
    ```

## Create a VM

Use the [create vm](create-vm.js) file to create resources associated with a VM. Review the file to change any preset values such as pricing tier, user name and password. 

## Manage a VM

Use the management scripts to:

* [Start a VM](start-vm.js)
* [Stop a VM](stop-vm.js)
* [Get VM information](vm-info.js)
* [List VMs in subscription](list-vms.js)

## Delete a VM

Because there are several resources associated with a VM, the easiest way to delete a VM is to delete the resource group. Use the [delete vm](delete-resources.js) file to delete the resource group.
