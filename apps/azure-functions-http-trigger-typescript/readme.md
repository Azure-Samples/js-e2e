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

## Test local functions

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

