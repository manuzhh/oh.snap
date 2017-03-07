"use strict"
/**
 * @Author: JakobB
 */
const ds = require("snap-datastore")
const errors = require('../../config/errConfig').config
const collections = require('../../config/collectionsConfig').config
const userAuth = require('../user/userAuth')

/**
 * Erzeugt einen Content-Eintrag in der Datenbank mit den spezifizierten Daten.
 * Der eingeloggte, mit dem Token assoziierte User wird dabei als der Content-Erzeuger in den Content-Eintrag in der Datenbank mit aufgenommen.
 * Es wird eine automatisch generierte Content-ID angelegt.
 * Beide Eigenschaften sind bei Erfolg im entsprechenden Parameter-Objekt der Callback-Funktion einsehbar.
 * @param {String} token        Wer erzeugt den Content.
 * @param {object} contentData  Die Content-Nutzdaten.
 * @param {function} callback   Gibt null als Fehler und den erzeugten Content-Eintrag zurück bei Erfolg. Gibt einen Fehler-Code und null als erzeugten Content-Eintrag zurück bei Misserfolg.
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
 * Sucht nach einer Liste mit Content-Einträgen, deren Attribute den übergebenen Attributen entsprechen.
 * Die übergebenen Attribute müssen komplett übereinstimmen mit der entsprechenden Attribut-Teilmenge des Content-Eintrags in der Datenbank, sonst wird der Content-Eintrag nicht in die zurückzugebende Content-Liste aufgenommen.
 * @param {String}  token       Wer fragt den Content ab.
 * @param {object}  attr        Such-Filter.
 * @param {boolean} auth        true = prüft, ob das Token valide ist, false = prüft nicht, ob das token valide ist.
 * @param {function} callback   Gibt null als Fehler und die abgefragte Content-Liste zurück bei Erfolg. Gibt einen Fehler-Code und null als abgefragte Content-Liste zurück bei Misserfolg.
 * Dies ist eine rein lesende Funktion und verändert keine Daten in der Datenbank.
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
 * Updatet einen Content-Eintrag in der Datenbank, dessen ID mit der ID aus dem übergebenen contentData Parameter übereinstimmt, mit den übergebenen Content-Daten.
 * Die Eigenschaften des Content-Eintrags in der Datenbank werden dabei komplett mit den übergebenen Daten überschrieben.
 * Verbindungen zu anderen Einträgen (User oder Content) werden dabei nicht geupdatet.
 * @param {String} token        Wer updatet den Content.
 * @param {object} contentData  Beinhaltet die ID des upzudatenden Content-Eintrags. Beinhaltet die Daten, mit denen der Content-Eintrag geupdatet werden soll.
 * @param {boolean} auth        true = prüft, ob das Token valide ist, false = prüft nicht, ob das token valide ist.
 * @param {function} callback   Gibt null als Fehler und den geupdateten Content-Eintrag zurück bei Erfolg. Gibt einen Fehler-Code und null als upgedateten Content-Eintrag zurück bei Misserfolg.
 * Diese Funktion prüft (bei auth = true) nur, ob das Token valide ist, nicht, ob der User, welcher den Content updatet der Content-Erzeuger ist.
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
