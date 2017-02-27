"use strict"
/**
 * @Author: Jan Dieckhoff
 */

const collections = require('../../config/collectionsConfig').config
const ds = require('snap-datastore')
const userStorage = require('./userStorage')
/**
 * setup some dummy user data for test-purposes
 * @param num
 */
function setupSomeUsers(num) {

    ds.findNode(collections.userDataCollectionName, {}, (err,users) => {
        if(err) {
            return console.log(JSON.stringify(err))
        } else {
            users.forEach((user) => {
                ds.deleteNode(collections.userDataCollectionName, user._id, () => console.log('deleted node: ' + user._id))
            })
        }

        for (let i = 0; i < num; i++) {
            let c = (i + 1)
            let firstName = "fn_user" + c
            let lastName = "ln_user" + c
            let userName = "user" + c
            let password = "111"
            let online = false;

            let user = {
                firstName, lastName, userName, password, online
            }

            userStorage.createUserNode(user, function (err, result) {
                if(err) {
                    console.log(JSON.stringify(err))
                }
            })
        }
    })
}

setupSomeUsers(100)  // do it
