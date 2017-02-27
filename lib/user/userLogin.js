"use strict"
/**
 * @Author: Jan Dieckhoff
 */

const collections = require('../../config/collectionsConfig').config
const errors = require('../../config/errConfig').config
const userHelper = require('./userHelper')
const userAuth = require('./userAuth')
const userStorage = require('./userStorage')
const ds = require('snap-datastore')
/**
 * Tries to login a user with loginDate.userName and loginData.password
 * and returns a json web token on success.
 * @param loginData
 * @param callback
 */
function login(loginData, callback = () => {
    console.error("Usermodule: no callback for login function")
}) {
    console.log('login: ' + JSON.stringify(loginData))
    if (userHelper.inputValid(loginData)) {
        userStorage.getUsers(loginData, {"userName": loginData.userName}, false, (err, result) => {
            if(err) {
                callback(err, null)
            } else if (!err &&  result.length > 0 && userAuth.compareSync(loginData.password, result[0].hashedPassword)) {
                let signedToken = userAuth.sign(result[0])
                ds.updateNode(collections.userDataCollectionName, result[0]._id, {"online": true})
                callback(null, {_id: result[0]._id, userName: result[0].userName, token: signedToken})
            } else {
                callback(errors.e101, null)
            }
        })
    } else {
        callback(errors.e102, null)
    }
}


function logout(data, callback = () => {
    console.error("Usermodule: no callback for logout function")
}) {

    let decoded = userAuth.authenticate(data.token)
    if(decoded) {
        ds.findNode(collections.userDataCollectionName, {"_id": decoded._id}, function (err, result) {

            if(err) {
                let e = errors.e600
                e.detail = err
                callback(e, null)
            }
            if (result.length > 0) {
                let user = result[0]
                ds.updateNode(collections.userDataCollectionName, user._id, {"online": false})
                callback(null, {_id: user._id, userName: user.userName, online: false})
            } else {
                callback(errors.e303, null)
            }
        })
    } else {
        callback(errors.e501, null)
    }
}

module.exports = {login, logout}
