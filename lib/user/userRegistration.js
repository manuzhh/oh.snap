"use strict"
/**
 * @Author: Jan Dieckhoff
 * Das Submodul User-Registrierung übernimmt einzig und allein die Registrierung neuer User.
 * Hier wird über einen entsprechenden API-Aufruf ein Datenobjekt übermittelt, welches alle relevanten
 * über die zu erstellende Entität enthält. Hierfür ist kein Token notwendig, da diese nur nach erfolgreichem
 * Login vergeben werden.
 */
const errors = require('../../config/errConfig').config
const userHelper = require('./userHelper')
const userStorage = require('./userStorage')


/**
 * Legt einen Benutzeraccount an.
 * Dafür werden die übergebenen User-Daten und die Callback-Funktion an das
 * userStorage-Modul weitergeleitet und dort verarbeitet. Zunächst wird das übergebene
 * Objekt auf seine Integrität überprüft (siehe userHelper.js).
 * @param {Object} userData Besteht mindestens aus userData.userName und userData.password
 * weitere Userattribute können über Builder hinzugefügt werden.
 * @param {Function} callback Eine Callbackfunktion die die Parameter (error, response) verarbeiten kann.
 * Sie übernimmt gewöhnlich das Senden eines Responses zur Anfrage.
 * In diesem Fall ist der Response das angelegte Userobject.
 * Bei einem Fehler ein passendes error-Objekt zurückgesendet und die Verarbeitung angebrochen.
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
