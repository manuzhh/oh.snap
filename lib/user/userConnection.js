"use strict"
/**
 * @Author: Jan Dieckhoff
 **/

const userAuth = require('./userAuth')
const userStorage = require('./userStorage')
const errors = require('../../config/errConfig').config

/**
 * Connects to users in how specified in the config-file
 * @param data
 * @param callback
 */
function connectUsers(data, callback = () => {
    console.error("Usermodule: no callback for connectUsers function")
}) {

    let userFrom = userAuth.authenticate(data.token)
    let userTo = data.payload

    if (userFrom) {
        // TODO: checkout needed connection type in config-file (Default: Follow)
        userStorage.createConnection(userFrom, userTo, callback)
    } else {
        callback(errors.e501, null)
    }
}

function disconnectUsers(connData, callback = () => {
    console.error("Usermodule: no callback for disconnectUsers function")
}) {

    let userFrom = userAuth.authenticate(connData.token)
    let userTo = connData.payload

    if (userFrom) {
        console.log("disconnectUsers: " + JSON.stringify(connData));
        // TODO: checkout needed connection type in config-file (Default: Follow)
        userStorage.deleteConnection(userFrom, userTo, callback);
    } else {
        callback(errors.e501, null)
    }
}

module.exports = {disconnectUsers, connectUsers}
