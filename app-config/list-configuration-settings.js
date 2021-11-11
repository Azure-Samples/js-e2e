const {
  AppConfigurationClient,
  parseSecretReference,
  parseFeatureFlag,
  isSecretReference,
  isFeatureFlag,
} = require("@azure/app-configuration");
const { SecretClient } = require("@azure/keyvault-secrets");
const { DefaultAzureCredential } = require("@azure/identity");

// Load the .env file if it exists
require("dotenv").config();

const credential = new DefaultAzureCredential();
const url = process.env["KEYVAULT_URI"] || "<keyvault-url>";
const connectionString =
  process.env["APPCONFIG_CONNECTION_STRING"] || "<connection string>";

const listSettings = async () => {
  const secretClient = new SecretClient(url, credential);
  const appConfigClient = new AppConfigurationClient(connectionString);
  const settingsIterator = appConfigClient.listConfigurationSettings();

  const settingList = [];

  for await (const setting of settingsIterator) {
    let parsed = null;

    // Feature Flat
    if (isFeatureFlag(setting)) {
      parsed = parseFeatureFlag(setting);
    } else if (isSecretReference(setting)) {
      // Secret retrieved from Key Vault
      parsed = parseSecretReference(setting);
      const secretName = parsed.value.secretId.substring(
        parsed.value.secretId.indexOf("secrets/") + 8,
        parsed.value.secretId.length
      );
      const secret = await secretClient.getSecret(secretName);
      parsed.secretValue = secret.value;
    } else {
      // Configuration Setting
      parsed = setting;
    }

    settingList.push(parsed);
  }
  return settingList;
};

listSettings()
  .then((list) => {
    console.log(list);
  })
  .catch((ex) => {
    console.log(ex);
  });
