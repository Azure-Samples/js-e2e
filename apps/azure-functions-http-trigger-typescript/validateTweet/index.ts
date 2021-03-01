import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const twttr = require('twitter-text');

// Call twitter's SDK to validate tweet
const validateTweetBody = (text): any => {
    const result = twttr.parseTweet(text);
    const maxChars = 280;
    if (result) {
        let textReturn = `${result.weightedLength} / ${maxChars}`;
        let isValid = result.weightedLength <= maxChars ? true : false;
        return {
            textReturn: textReturn,
            isValid: isValid
        }
    }
}

/*
To test locally:

curl -i \
    --header "Accept: application/json" \
    --request POST \
    --data '{"tweetText":"This is my tweet"}' \
    http://localhost:7071/api/validateTweet
    
To test after deployed to Azure functions:

curl -i \
    --header "Accept: application/json" \
    --header "x-functions-key: YOUR-FUNCTION-KEY" \
    --request POST \
    --data '{"tweetText":"This is my tweet"}' \
    https://YOUR-RESOURCE-NAME.azurewebsites.net/api/validateTweet
    
*/

const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<any> => {

    const tweet = req.body;
    
    if (!tweet || !tweet.tweetText) {
        context.res = {
            status: 404, 
            body: "Invalid function params - expected Post to include tweet object {tweetText}"
        };
        return;
    }
           
    const validation:any = validateTweetBody(tweet.tweetText);
    
    /*
    {
      "textReturn": "16 / 280",
      "isValid": true
    }
    */
    context.res = {
        body: validation,
        headers: {
            "Content-Type":"application/json"
        }
    };

};

export default httpTrigger;