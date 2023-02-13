// Message queue messages are strings. All data must eventuall
// turn into a string. These functions are meant to move JSON
// data into and out of base 64 format.

function jsonToBase64(jsonObj) {
    const jsonString = JSON.stringify(jsonObj)
    return  Buffer.from(jsonString).toString('base64')
}
function encodeBase64ToJson(base64String) {
    const jsonString = Buffer.from(base64String,'base64').toString()
    return JSON.parse(jsonString)
}
