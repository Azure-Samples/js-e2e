const Redis = require('ioredis');
const fs = require('fs');
const parse = require('csv-parser')
const { finished } = require('stream/promises');

const config = {
    "HOST": "YOUR-RESOURCE-NAME.redis.cache.windows.net",
    "KEY": "YOUR-AZURE-REDIS-RESOURCE-KEY"
}

// Create Redis config object
const configuration = {
    host: config.HOST,
    port: 6380,
    password: config.KEY,
    tls: {
        servername: config.HOST
    },
    database: 0,
    keyPrefix: config.prefix
}
var redis = new Redis(configuration);

// insert each row into Redis
async function insertData(readable) {
    for await (const row of readable) {
        await redis.set(`bar2:${row.id}`, JSON.stringify(row))
    }
}
 
/* 
id,first_name,last_name,email,gender,ip_address
1,Rodrigo,Lock,rlock0@eventbrite.com,Agender,73.93.61.37
2,Nikos,Gutierrez,ngutierrez1@yahoo.com,Genderfluid,213.54.40.210
3,Eada,Sotham,esotham2@yellowpages.com,Bigender,28.236.183.89
4,Ana,Brazil,abrazil3@who.int,Polygender,142.30.140.225
5,Roman,Rohmer,rrohmer4@admin.ch,Genderqueer,235.197.52.85
6,Elyn,Sute,esute5@ftc.gov,Genderqueer,171.151.109.188
7,Omero,Childers,ochilders6@stanford.edu,Bigender,133.21.192.66
8,Stephana,Pipet,spipet7@parallels.com,Genderfluid,177.48.129.213
9,Anthiathia,Ulster,aulster8@weebly.com,Genderfluid,175.1.59.106
10,Yard,Pyson,ypyson9@jalbum.net,Non-binary,0.8.135.151
*/

// read file, parse CSV, each row is a chunck
const readable = fs
    .createReadStream('./MOCK_DATA_10.csv')
    .pipe(parse());

// Pipe rows to insert function
insertData(readable)
.then(() => {
    console.log('succeeded');
    redis.disconnect();
})
.catch(console.error);
