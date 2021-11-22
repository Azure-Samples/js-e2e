const {
  AppConfigurationClient,
  parseSecretReference,
  parseFeatureFlag,
  isSecretReference,
  isFeatureFlag,
} = require("@azure/app-configuration");
const { SecretClient, parseKeyVaultSecretIdentifier } = require("@azure/keyvault-secrets");
const { DefaultAzureCredential } = require("@azure/identity");
const { parse } = require("dotenv");

// Load the .env file if it exists
require("dotenv").config();

const credential = new DefaultAzureCredential();
const url = process.env["KEYVAULT_URI"] || "<keyvault-url>";
console.log(url)
const connectionString =
  process.env["APPCONFIG_CONNECTION_STRING"] || "<connection string>";
console.log(connectionString)
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
      const secretInKeyVault = parseKeyVaultSecretIdentifier(parsed.value.secretId);

      try{
        parsed.secretValue = await secretClient.getSecret(secretInKeyVault.name);
      }catch(ex){
        // handle case where secret has been removed from key vault but not from app config
        parsed.secretValue = null;
        //throw(ex);
      }

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
