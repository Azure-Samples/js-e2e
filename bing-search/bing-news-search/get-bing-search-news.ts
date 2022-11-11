require('dotenv').config()

const NewsSearchAPIClient = require('azure-cognitiveservices-newssearch');
const { AzureKeyCredential } = require('@azure/core-auth');

const bingSearchKey = process.env.BING_SEARCH_KEY
if(!bingSearchKey) throw Error("BING_SEARCH_KEY is not set")

const bingSearchUrl = "https://api.bing.microsoft.com/v7.0/news/search";

const azureCredential = new AzureKeyCredential(bingSearchKey);
const client = new NewsSearchAPIClient(azureCredential, {endpoint: bingSearchUrl});

const search_term = 'Winter Olympics'

const options = {
    count: 10, 
    market: "en-us",
    filters: []
}

async function main():Promise<void> {
    const results = await client.newsOperations.search(search_term, options)

    for await (const result of results) {
        console.log(result.name)
        console.log(result.url)
        console.log(result.description)
        console.log('-----------------')
    }
}
main().then(() => {
    console.log("done");
}).catch((err:any) => {
    throw err;
});