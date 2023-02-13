require('dotenv').config()

const resourceName = process.env.AZURE_CACHE_FOR_REDIS_RESOURCE_NAME
const resourceKey = process.env.AZURE_CACHE_FOR_REDIS_RESOURCE_KEY

const config = {
    "HOST": `${resourceName}.redis.cache.windows.net`,
    "KEY": `${resourceKey}`,
    "TIMEOUT": 300,
    "KEY_PREFIX": "demoExample:"
}

module.exports = {config}