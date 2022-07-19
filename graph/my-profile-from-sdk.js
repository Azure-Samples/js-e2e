// package.json - type: "module"

import graph from '@microsoft/microsoft-graph-client';
import 'isomorphic-fetch';

const getAuthenticatedClient = (accessToken) => {
    // Initialize Graph client
    const client = graph.Client.init({
        // Use the provided access token to authenticate requests
        authProvider: (done) => {
            done(null, accessToken);
        }
    });

    return client;
}

// https://developer.microsoft.com/en-us/graph/graph-explorer
// https://jwt.ms/
// https://github.com/Azure-Samples/ms-identity-easyauth-nodejs-storage-graphapi/blob/main/2-WebApp-graphapi-on-behalf/controllers/graphController.js

const main = async (accessToken) => {


    try {
        const graphClient = getAuthenticatedClient(accessToken);

        const profile = await graphClient
        .api('/me')
        .get();

        return profile;

    } catch (err) {
        throw err;
    }
}

const accessToken = "... replace with your access token ...";

main(accessToken).then((userData)=>{
    console.log(userData);
}).catch((err)=>{
    console.log(err);
})
