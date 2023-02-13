const { DefaultAzureCredential } = require("@azure/identity");
const { EventHubConsumerClient, earliestEventPosition  } = require("@azure/event-hubs");
const { ContainerClient } = require("@azure/storage-blob");    
const { BlobCheckpointStore } = require("@azure/eventhubs-checkpointstore-blob");

// Event hubs 
const eventHubsResourceName = "YOUR EVENT HUBS RESOURCE NAME";
const fullyQualifiedNamespace = `${eventHubsResourceName}.servicebus.windows.net`; 
const eventHubName = "YOUR EVENT HUB NAME";
const consumerGroup = "$Default"; // name of the default consumer group

// Azure Storage 
const storageAccountName = "YOUR STORAGE ACCOUNT NAME";
const storageContainerName = "YOUR BLOB CONTAINER NAME";
const baseUrl = `https://${storageAccountName}.blob.core.windows.net`;

// Azure Identity - passwordless authentication
const credential = new DefaultAzureCredential();

async function main() {

  // Create a blob container client and a blob checkpoint store using the client.
  const containerClient = new ContainerClient(
    `${baseUrl}/${storageContainerName}`,
    credential
  );  
  const checkpointStore = new BlobCheckpointStore(containerClient);

  // Create a consumer client for the event hub by specifying the checkpoint store.
  const consumerClient = new EventHubConsumerClient(consumerGroup, fullyQualifiedNamespace, eventHubName, credential, checkpointStore);

  // Subscribe to the events, and specify handlers for processing the events and errors.
  const subscription = consumerClient.subscribe({
      processEvents: async (events, context) => {
        if (events.length === 0) {
          console.log(`No events received within wait time. Waiting for next interval`);
          return;
        }

        for (const event of events) {
          console.log(`Received event: '${event.body}' from partition: '${context.partitionId}' and consumer group: '${context.consumerGroup}'`);
        }
        // Update the checkpoint.
        await context.updateCheckpoint(events[events.length - 1]);
      },

      processError: async (err, context) => {
        console.log(`Error : ${err}`);
      }
    },
    { startPosition: earliestEventPosition }
  );

  // After 30 seconds, stop processing.
  await new Promise((resolve) => {
    setTimeout(async () => {
      await subscription.close();
      await consumerClient.close();
      resolve();
    }, 30000);
  });
}

main().catch((err) => {
  console.log("Error occurred: ", err);
});