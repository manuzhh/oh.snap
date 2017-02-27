"use strict"
/**
 * @Author: JakobB
 */
const ds = require("snap-datastore")
const errors = require('../../config/errConfig').config
const collections = require('../../config/collectionsConfig').config
const userAuth = require('../user/userAuth')

/**
 *
 * @param token        Who created the content
 * @param contentData
 * @param callback
 */
let create = (token, contentData, callback = () => {
    console.error("Usermodule: no callback for create content function")
}) => {

    let userData = userAuth.authenticate(token)
    if(userData != null){

        //@todo Strings in Settings
        ds.createContent("content", "user", userData._id, contentData, (err, response) =>{
          if(!err){
            callback(response)
          }
          else{
            //todo fehlerbehandlung
            console.log("create content: error: " + err + " - response: " + response);
          }
        })

    }

}

/**
 *
 * @param token        Who queried the content
 * @param contentId
 * @param callback
 */
let getContent = (token, attr, auth, callback = () => {
    console.error("Contentmodule: no callback for find content function")
}) => {

    let decoded = auth ? userAuth.authenticate(token) : null

    if (decoded || !auth) {
        ds.findNode(collections.content_list, attr, (err, contents) => {
            if (err) {
                let e = errors.e600
                e.detail = err
                callback(e, null)
            } else {
                callback(null, contents)
            }
        })
    } else {
        callback(errors.e501, null)
    }

}

/**
 *
 * @param token        Who updated the content
 * @param contentData
 * @param callback
 * checks only if token is valid, not if user updating the content is the content creator
 */
let update = (token, contentData, auth, callback = () => {
    console.error("Contentmodule: no callback for update content function")
}) => {

    let decoded = auth ? userAuth.authenticate(token) : null

    if (decoded || !auth) {
        ds.update(collections.content_list, contentData._id, contentData.content, (err, response) =>{
            if(err) {
                let e = errors.e600
                e.detail = err
                callback(e, null)
                console.log("update content: error: " + err + " - response: " + response);
            } else {
                callback(null, response)
            }
        })
    } else {
        callback(errors.e501, null)
    }

}

module.exports = {create, getContent, update}
