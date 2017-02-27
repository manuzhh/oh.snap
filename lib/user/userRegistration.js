"use strict"
/**
 * @Author: Jan Dieckhoff
 */
const errors = require('../../config/errConfig').config
const userHelper = require('./userHelper')
const userStorage = require('./userStorage')

/**
 * registers a user with the given user data
 * inserts a mongodb user entry if the given user data
 * is valid. If not, a error response will be performed
 * @param userData
 * @param callback
 */
function register(userData, callback = () => {
    console.error("Usermodule: no callback for register function")
}) {

    console.log('register: ' + JSON.stringify(userData))

    if (userHelper.inputValid(userData)) {
        if (userData.password == userData.passwordConf) {
            userStorage.getUsers(userData, {"userName": userData.userName}, false, (err, result) => {
                if(err) {
                    callback(err, null)
                } else if (result.length == 0) {
                    userData.online = false;
                    userStorage.createUserNode(userData, callback);
                } else {
                    callback(errors.e301, null)
                }
            })
        } else {
            callback(errors.e302, null)
        }
    } else {
        callback(errors.e102, null)
    }
}

module.exports = {register}
