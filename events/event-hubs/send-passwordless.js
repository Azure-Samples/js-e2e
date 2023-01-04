const { EventHubProducerClient } = require("@azure/event-hubs");
const { DefaultAzureCredential } = require("@azure/identity");

// Event hubs 
const eventHubsResourceName = "YOUR EVENT HUBS RESOURCE NAME";
const fullyQualifiedNamespace = `${eventHubsResourceName}.servicebus.windows.net`; 
const eventHubName = "YOUR EVENT HUB NAME";

// Azure Identity - passwordless authentication
const credential = new DefaultAzureCredential();

async function main() {

  // Create a producer client to send messages to the event hub.
  const producer = new EventHubProducerClient(fullyQualifiedNamespace, eventHubName, credential);

  // Prepare a batch of three events.
  const batch = await producer.createBatch();
  batch.tryAdd({ body: "passwordless First event" });
  batch.tryAdd({ body: "passwordless Second event" });
  batch.tryAdd({ body: "passwordless Third event" });    

  // Send the batch to the event hub.
  await producer.sendBatch(batch);

  // Close the producer client.
  await producer.close();

  console.log("A batch of three events have been sent to the event hub");
}

main().catch((err) => {
  console.log("Error occurred: ", err);
});