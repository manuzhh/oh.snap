"use strict"
/**
 * @Author: Jan Dieckhoff
 * ToDo: Create User module.
 *
 *
 */

const userLogin = require('./userLogin')
const userRegistration = require('./userRegistration')
const userStorage = require('./userStorage')
const userConnection = require('./userConnection')

require('./userSetup') // Setup test-data

/**
 * Tries to login a user with loginDate.userName and loginData.password
 * and returns a json web token on success.
 * @param loginData
 * @param callback
 */
function login(loginData, callback) {
    userLogin.login(loginData,callback)
}

/**
 * registers a user with the given user data
 * inserts a mongodb user entry if the given user data
 * is valid. If not, a error response will be performed
 * @param userData
 * @param callback
 *
 */
function register(userData, callback = () => {
    console.error("Usermodule: no callback for register function")
}) {
    userRegistration.register(userData, callback)
}

/**
 * Get Users from db with the given attr
 * @param data
 * @param attr
 * @param auth authentification required (true/false)
 * @param callback
 */
function getUsers(data, attr, auth, callback) {
    console.log('spec user called: ' + JSON.stringify(data))
    userStorage.getUsers(data,attr,auth,callback);
}

/**
 * Connects to users in how specified in the config-file
 * @param data
 * @param callback
 */
function connectUsers(data, callback) {
    userConnection.connectUsers(data,callback)
}

function disconnectUsers(connData,callback) {
    userConnection.disconnectUsers(connData,callback)
}

function logout(data, callback) {
    userLogin.logout(data, callback)
}

function getConnections(type, data, callback) {
    userConnection.getConnections(type, data, callback)
}

module.exports = {
    login, register,
    getUsers, connectUsers,
    logout, disconnectUsers,
    getConnections: getConnections
}
