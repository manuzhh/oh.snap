"use strict"
/**
 * @Author: JakobB
 */
const ds = require("snap-datastore")
const errors = require('../../config/errConfig').config
const collections = require('../../config/collectionsConfig').config
const userAuth = require('../user/userAuth')

/**
 * Creates a content entry in the database with the specified data.
 * @param {String} token        Who creates the content.
 * @param {object} contentData  The content payload.
 * @param {function} callback   Returns null as error and the created content entry on success or an error code and null as the content entry on failure.
 */
let create = (token, contentData, callback = () => {
    console.error("Usermodule: no callback for create content function")
}) => {

    let userData = userAuth.authenticate(token)
    if(userData != null){

        //@todo Strings in Settings
        ds.createContent("content", "user", userData._id, contentData, (err, response) =>{
          if(!err){
            callback(null, response)
          }
          else{
            let e = errors.e600
            e.detail = err
            callback(err, null)
            console.log("create content: error: " + err + " - response: " + response);
          }
        })

    }

}

/**
 * Queries a list of content objects which attributes match the passed attributes.
 * @param {String}  token       Who queried the content.
 * @param {object}  attr        Search filters.
 * @param {boolean} auth        true = checks if token is valid, false = doesn't check token's validity.
 * @param {function} callback   Returns null as error and the queried content list on success or an error code and null as the queried content list on failure.
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
 * Updates a content entry in the database with the passed content data which id matches the id from the passed contentData parameter.
 * @param {String} token        Who updates the content.
 * @param {object} contentData  Includes the id of the content entry to be updated. Includes the data with which the entry is about to be updated.
 * @param {boolean} auth        true = checks if token is valid, false = doesn't check token's validity.
 * @param {function} callback   Returns null as error and the updated content entry on success or an error code and null as the updated content entry on failure.
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
