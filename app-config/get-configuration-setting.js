const { AppConfigurationClient } = require("@azure/app-configuration");

const connectionString =
  process.env["APPCONFIG_CONNECTION_STRING"] ||
  "Endpoint=https://YOUR-RESOURCE-NAME...";
const appConfigClient = new AppConfigurationClient(connectionString);

const getConfigurationSetting = async (key) => {
  return await appConfigClient.getConfigurationSetting({
    key,
  });
};

const settingName = "AppTitle";
getConfigurationSetting(settingName)
  .then((result) => {
    console.log(result);

    /*
{
  value: 'Text title of app - used in build pipeline',
  syncToken: '98765',
  lastModified: 2021-11-10T18:52:24.000Z,
  'access-control-allow-credentials': 'true',
  'access-control-allow-origin': '*',
  'access-control-expose-headers': 'DNT, X-CustomHeader, Keep-Alive, User-Agent, X-Requested-With, If-Modified-Since, Cache-Control, Content-Type, Authorization, x-ms-client-request-id, x-ms-useragent, x-ms-content-sha256, x-ms-date, host, Accept, Accept-Datetime, Date, If-Match, If-None-Match, Sync-Token, x-ms-return-client-request-id, ETag, Last-Modified, Link, Memento-Datetime, retry-after-ms, x-ms-request-id, x-ms-client-session-id, x-ms-effective-locale, WWW-Authenticate',       
  connection: 'close',
  'content-type': 'application/vnd.microsoft.appconfig.kv+json; charset=utf-8',
  date: 'Wed, 10 Nov 2021 19:36:17 GMT',
  server: 'openresty/1.17.8.2',
  'strict-transport-security': 'max-age=15724800; includeSubDomains',
  'transfer-encoding': 'chunked',
  'x-ms-correlation-request-id': '123456',
  'x-ms-request-id': '123456',
  key: 'AppTitle',
  label: null,
  contentType: '',
  tags: {},
  etag: 'YDxy2NHJexhh1X4LZZc9TK8mrnt',
  isReadOnly: false,
  statusCode: 200
}
*/
  })
  .catch((ex) => {
    console.log(ex);
  });
