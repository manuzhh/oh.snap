"use strict"
/**
 * @Author: Jan Dieckhoff
 * Dieses Submodul übernimmt die Überprüfung der Login-Daten und die Rückgabe des durch
 * die User-Authentifizierung generierten Web-Tokens.
 */

const collections = require('../../config/collectionsConfig').config
const errors = require('../../config/errConfig').config
const userHelper = require('./userHelper')
const userAuth = require('./userAuth')
const userStorage = require('./userStorage')
const ds = require('snap-datastore')


/**
 * Versucht einen User mit den übergebenen Login-Daten einzuloggen.
 * Dafür wird zunächst der User, der zu dem übergebenen Usernamen passt mit Hilfe
 * des userStorage-Modul ermittelt. Wurde ein Datensatz gefunden, wird mit Hilfe des userAuth-Modul
 * das übergebene Passwort auf seine Korrektheit überprüft. Konnte alles erfolgreich abewickelt werden, wird
 * das JSON-Webtoken aus dem ermittelten Userobjekt generiert.
 * @param {Object} loginData Besteht aus loginData.userName und loginData.password
 * @param {Function} callback Eine Callbackfunktion die die Parameter (error, response) verarbeiten kann.
 * Sie übernimmt gewöhnlich das Senden eines Responses zur Anfrage.
 * In diesem Fall ist der Response das ein bei Erfolg generiertes JSON-Webtoken.
 * Bei einem Fehler ein passendes error-Objekt zurückgesendet und die Verarbeitung abgebrochen.
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
                ds.updateNode(collections.userDataCollectionName, result[0]._id, {"online": true}, (error, user) => {
                    if(error) {
                        let err = errors.e600
                        err.detail = error
                        callback(err, null)
                    } else {
                        user['token'] = signedToken
                        callback(null, user)
                    }
                })
               // callback(null, {_id: result[0]._id, userName: result[0].userName, token: signedToken})
            } else {
                callback(errors.e101, null)
            }
        })
    } else {
        callback(errors.e102, null)
    }
}


/**
 * Versucht einen User auszuloggen.
 * Dafür wird zunächst der User, der zu dem übergebenen JSON-Webtoken (im data-Objekf) passt mit Hilfe
 * des userStorage-Modul ermittelt. Bei erfolgreicher Ausführung wird die Eigenschaft des in der Datenbank
 * gefundenen Userobjekts von {online: true} auf {online: false} gesetzt.
 * @param {Object} data Enthält das data.token welches zur Authentifizierung des Aufrufers dient
 * @param {Function} callback Eine Callbackfunktion die die Parameter (error, response) verarbeiten kann.
 * Sie übernimmt gewöhnlich das Senden eines Responses zur Anfrage.
 * In diesem Fall ist der Response das User-Objekt, das zu dem User gehört, der ausgeloggt wurde.
 * Bei einem Fehler wird ein passendes error-Objekt zurückgesendet und die Verarbeitung abgebrochen.
 */
function logout(data, callback = () => {
    console.error("Usermodule: no callback for logout function")
}) {

    let decoded = userAuth.authenticate(data.token)
    if(decoded) {
        userStorage.getUsers(null, {"_id": decoded._id}, false, function(err, result) {
            if(err) {
                let e = errors.e600
                e.detail = err
                callback(e, null)
            }
            if (result.length > 0) {
                let user = result[0]
                ds.updateNode(collections.userDataCollectionName, user._id, {"online": false}, (error, user) => {
                    if(error) {
                        let err = errors.e600
                        err.detail = error
                        callback(err, null)
                    } else {
                        callback(null, user)
                    }
                })
            } else {
                callback(errors.e303, null)
            }
        })
    } else {
        callback(errors.e501, null)
    }
}

module.exports = {login, logout}
