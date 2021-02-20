const redis = require('ioredis');

const config = {
    "HOST": "YOUR-RESOURCE-NAME.redis.cache.windows.net",
    "KEY": "YOUR-RESOURCE-PASSWORD",
    "TIMEOUT": 300,
    "KEY_PREFIX": "demoExample:"
}

// Create Redis config object
const configuration = {
    host: config.HOST,
    port: 6380,
    password: config.KEY,
    timeout: config.TIMEOUT,
    tls: {
        servername: config.HOST
    },
    database: 0,
    keyPrefix: config.KEY_PREFIX
}

const connect = () => {
    return redis.createClient(configuration);
}

const set = async (client, key, expiresInSeconds=configuration.timeout, stringify=true, data) => {
    return await client.setex(key, expiresInSeconds, stringify? JSON.stringify(data): data);
}

const get = async (client, key, stringParse=true) => {
    const value = await client.get(key);
    return stringParse ? JSON.parse(value) : value;
}

const remove = async (client, key) => {
      return await client.del(key);
}

const disconnect = (client) => {
    client.disconnect();
}

const test = async () => {
    
    // connect
    const dbConnection = await connect();
    
    // set
    const setResult1 = await set(dbConnection, "r1", "1000000", false, "record 1");
    const setResult2 = await set(dbConnection, "r2", "1000000", false, "record 2");
    const setResult3 = await set(dbConnection, "r3", "1000000", false, "record 3");

    // get
    const val2 = await get(dbConnection, "r2", false);
    console.log(val2);
    
    // delete
    const remove2 = await remove(dbConnection, "r2");
    
    // get again = won't be there
    const val2Again = await get(dbConnection, "r2", false);
    console.log(val2Again);
    
    // done
    disconnect(dbConnection)
}

test()
.then(() => console.log("done"))
.catch(err => console.log(err))
