# Azure Functions with TypeScript

## Visual Studio Code extensions

* Azure Functions - ms-azuretools.vscode-azurefunctions
* Remote - Containers - ms-vscode-remote.remote-containers

## Azure resources

* Run this app locally in the container provided:
    * all environment and JS dependencies are installed
    * there isn't a problem with the version of Node.js you have locally installed. This allows you to use the same version of Node.js as the Azure Function runtime environment. 

## Azure Functions

* 200 - Post with valid body value
* 404 - Post without body or without body.tweetText

## HTTP Request

Function is configured to use HTTP Post and expects the POST Body to look like: 

```JSON
{ tweetText: "This is my tweet" }
```

You can see this used in the test. 

## HTTP Response

```JSON
{
  "textReturn": "16 / 280",
  "isValid": true
}
```
## Local Function runtime

Use [Azure Function core tools](https://www.npmjs.com/package/azure-functions-core-tools) to run local function environment. If you run the project in the Docker container, core tools is already installed with the `./devcontainer.json/DockerFile`.

## Test local functions

The boilerplate for the project was created with the Azure Functions VSCode extension. It didn't include the Jest integration, which was added afterward. 

```bash
curl -i \
    --header "Content-Type: application/json" \
    --request POST \
    --data '{"tweetText":"This is my tweet"}' \
    http://localhost:7071/api/validateTweet
```

## Test remote functions

### validateTweet function

```bash
curl -i \
    --header "Content-Type: application/json" \
    --header "x-functions-key: SEE-VALUE-IN-AZURE-PORTAL-FOR-FUNCTION" \
    --request POST \
    --data '{"tweetText":"This is my tweet"}' \
    https://twitterfunctionjs.azurewebsites.net/api/validateTweet
```

