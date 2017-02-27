"use strict"
/**
 * @Author: Jan Dieckhoff
 */

const userHelper = require('./userHelper')
const userAuth = require('./userAuth')
const ds = require('snap-datastore')
const errors = require('../../config/errConfig').config
const collections = require('../../config/collectionsConfig').config


function deleteConnection(userFrom, userTo, callback = () => {
    console.error("Usermodule: no callback for createConnection function")
}) {

    let idFrom = userFrom._id
    let idTo = userTo._id
    console.log('delete from: ' + idFrom)
    console.log('delete To: ' + idTo)
    ds.deleteConnection(collections.userDataCollectionName, idFrom, idTo, null, callback)
}

function createConnection(userFrom, userTo, callback = () => {
    console.error("Usermodule: no callback for createConnection function")
}) {

    let idFrom = userFrom._id;
    let idTo = userTo._id;

    ds.createConnection(collections.userDataCollectionName, idFrom, idTo, {}, (err, result) => {
        if (err) {
            let e = errors.e600
            e.detail = err
            callback(e, null)
            console.log(JSON.stringify('Error createConnection Result: ' + JSON.stringify(err)))
        } else {
            // TODO: Discuss Feedback Objects
            callback(null, userTo)
            console.log(JSON.stringify('createConnection Result: ' + JSON.stringify(result)))
        }
    })
}

function createUserNode(userData, callback = () => {
    console.log("userModule: user created without callback function.");
}) {

    userAuth.buildHashAsync(userData.password, (err, hash) => {

        if (err) {
            return callback(err, null)
        } else {
            let userNode = {
                "userName": userData.userName,
                "firstName": userData.firstName,
                "lastName": userData.lastName,
                "online": userData.online,
                "hashedPassword": hash,
                "followl": [],
                "followedl": [],
                "content": []
            }

            ds.createNode(collections.userDataCollectionName, userNode, (err, result) => {
                if (err) {
                    let e = errors.e600
                    e.detail = err
                    callback(e, null)
                } else {
                    // TODO: Discuss Feedback Objects
                    callback(null, {userName: userNode.userName})
                }
            })
        }
    })
}

/**
 * Get Users from db with the given attr
 * @param data
 * @param attr
 * @param auth authentification required (true/false)
 * @param callback
 */
function getUsers(data, attr, auth, callback = () => {
    console.error("Usermodule: no callback for getUsersOnline function")
}) {

    let userdata = [];
    let decoded = auth ? userAuth.authenticate(data.token) : null
    console.log(collections.userDataCollectionName);
    if (decoded || !auth) {
        ds.findNode(collections.userDataCollectionName, attr, (err, users) => {
            if (err) {
                let e = errors.e600
                e.detail = err
                callback(e, null)
            } else {
                users.forEach((user) => {
                    if (decoded && user.userName == decoded.userName) {
                        return
                    } else {
                        userdata.push(user)
                    }
                })
                callback(null, userdata);
            }
        });
    } else {
        callback(errors.e501, null)
    }
}


module.exports = {getUsers, createUserNode, createConnection, deleteConnection}
