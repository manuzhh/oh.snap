"use strict"
/**
 * @Author: Jan Dieckhoff
 * Der User-Storage stellt die Schnittstelle zum Datastore-Modul bereit und ermöglicht das Ermittelten
 * und Speichern von Userobjekten und/oder User-Connections. Es können nur Speicherzugriffe die User
 * oder User-Connections betreffen bearbeitet werden. Dadurch erhält das User-Hauptmodul nur für dieses
 * relevante Speicherzugriffsmöglichkeiten. Es können ein oder mehrere Userobjekte erstellt oder abgerufen
 * werden und User-Connections gespeichert und gelöscht werden. Die dafür nötigen Informationen werden über
 * die Api und andere Submodule angegeben genommen und die entsprechenden CRUD-Funktionen des Datastore-Moduls
 * aufgerufen. Bei Fehlern, wird dies dem Client über entsprechend gesendete Fehlerobjekte mitgeteilt.
 */

const userHelper = require('./userHelper')
const userAuth = require('./userAuth')
const ds = require('snap-datastore')
const errors = require('../../config/errConfig').config
const collections = require('../../config/collectionsConfig').config


/**
 * Löscht eine abstrakte From-/To-Verbindung zwischen zwei Usern.
 * Dafür werden die bneötigten user-IDs (userIdFrom, userIdTo) und eine Callbackfunktion
 * an das Datastore-Modul übergeben und dort weiterverarbeitet.
 * Bei erfolgreicher Ausführung liegen die User-Objekte in der Datenbank
 * danach wie folgt vor: Die Referenz in der follow-Liste des Aufrufers (die To-Verbindung) ist gelöscht.
 * Die Referenz in der followed-Liste des Users, zu dem die To-Verbindung hergestellt wurde (die From-Verbindung),
 * ist gelöscht. Diese Referenzen sind die jeweiligen User-IDs.
 * @param {String} userIdFrom Die User-ID des Aufrufers
 * @param {String} userIdTo Die User-ID zu dem die To-Verbindung gelöscht werden soll
 * @param {Function} callback Eine Callbackfunktion die die Parameter (error, response) verarbeiten kann.
 * Sie übernimmt gewöhnlich das Senden eines Responses zur Anfrage.
 * In diesem Fall ist der Response das User-Objekt, von dem eine To-Verbindung gelöscht wurde.
 * Bei einem Fehler wird ein passendes error-Objekt zurückgesendet und die Verarbeitung abgebrochen.
 */
function deleteConnection(userIdFrom, userIdTo, callback = () => {
    console.error("Usermodule: no callback for createConnection function")
}) {

    console.log('delete from: ' + userIdFrom)
    console.log('delete To: ' + userIdTo)
    ds.deleteConnection(collections.userDataCollectionName, userIdFrom, userIdTo, callback)
}

/**
 * Stellt eine abstrakte From-/To-Verbindung zwischen zwei Usern her.
 * Dafür werden die bneötigten user-IDs (userIdFrom, userIdTo) und eine Callbackfunktion
 * an das Datastore-Modul übergeben und dort weiterverarbeitet.
 * Bei erfolgreicher Ausführung liegen die User-Objekte in der Datenbank
 * danach wie folgt vor: Der Aufrufer hat eine neue Referenz in der follow-Liste (die To-Verbindung).
 * Der User zu dem die Verbindung hergestellt wurde hat eine neue Referenz in der followed-Liste
 * (die From-Verbindung). Diese Referenzen sind die jeweiligen User-IDs.
 * @param {String} userIdFrom Die User-ID des Aufrufers
 * @param {String } userIdTon Die User-ID zu dem die To-Verbindung hergestellt werden soll
 * @param {Function} callback Eine Callbackfunktion die die Parameter (error, response) verarbeiten kann.
 * Sie übernimmt gewöhnlich das Senden eines Responses zur Anfrage.
 * In diesem Fall ist der Response das User-Objekt, zu dem eine To-Verbindung hergestellt wurde.
 * Bei einem Fehler wird ein passendes error-Objekt zurückgesendet und die Verarbeitung abgebrochen.
 */
function createConnection(userIdFrom, userIdTo, callback = () => {
    console.error("Usermodule: no callback for createConnection function")
}) {

    ds.createConnection(collections.userDataCollectionName, userIdFrom, userIdTo, {}, (err, result) => {
        if (err) {
            let e = errors.e600
            e.detail = err
            callback(e, null)
            console.log(JSON.stringify('Error createConnection Result: ' + JSON.stringify(err)))
        } else {
            // TODO: Discuss Feedback Objects
            callback(null, result)
            console.log(JSON.stringify('createConnection Result: ' + JSON.stringify(result)))
        }
    })
}


/**
 * Legt ein Userobjekt in der Datenbank an.
 * Dafür werden die übergebenen User-Daten eine Usernode erzeugt, die dann zusammen mit einer
 * Callbackfunktion an das Datastore-Modul übergeben und dort weiterverarbeitet wird.
 * @param {Object} userData Besteht mindestens aus userData.userName und userData.password
 * weitere Userattribute können über Builder hinzugefügt werden.
 * @param {Function} callback Eine Callbackfunktion die die Parameter (error, response) verarbeiten kann.
 * Sie übernimmt gewöhnlich das Senden eines Responses zur Anfrage.
 * In diesem Fall ist der Response das angelegte Userobject.
 * Bei einem Fehler ein passendes error-Objekt zurückgesendet und die Verarbeitung angebrochen.
 */
function createUserNode(userData, callback = () => {
    console.log("userModule: user created without callback function.");
}) {

    userAuth.buildHashAsync(userData.password, (err, hash) => {

        if (err) {
            return callback(err, null)
        } else {
            let userNode = userData;
            userNode.hashedPassword = hash;
            userNode.followl = [];
            userNode.followedl = [];
            userNode.content = [];

            ds.createNode(collections.userDataCollectionName, userNode, (err, result) => {
                if (err) {
                    let e = errors.e600
                    e.detail = err
                    callback(e, null)
                } else {
                    delete result.hashedPassword
                    callback(null, result)
                }
            })
        }
    })
}

/**
 * Ermittelt eine Menge von Usern, die dem übergebenen attr-Objekt entsprechen.
 * Dafür wird das JSON-Webtoken dekodiert und damit auf seine Gültigkeit überprüft.
 * Wenn das Token gültig ist oder das auth-Flag 'false' hat. Wird die Anfrage über
 * das Datastore-Modul gestellt. Das attr-Objekt stellt dabei einen Filter da, um nur eine
 * bestimmte Menge von Usern, nämlich die, die den Informationen in diesem Objekt entsprechen,
 * zu finden.
 * @param {Object} data Besteht aus dem data.token, also das JSON-Webtoken, welches zur Authentifizierung des
 * Aufrufers verwendet wird.
 * @param {Object} attr Stellt den Filter da, der die Menge der zu ermittelnden User spezifiziert
 * z. B. könnte das Objekt folgendermaßen aussehen: {online: true}. In diesem Fall würden
 * nur User ermittelt, die derzeit auf einem Testclient eingeloggt sind.
 * @param {Object} auth Flag das anzeigt, ob eine Authentifizierung des Tokens nötig ist.
 * Eine Authentifizierung ist nur der Fall, wenn die Funktion über die API, also von extern
 * aufgerufen wird. Da diese Funktion auch intern aufgerufen wird, ist dabei nicht immer
 * eine Authentifizierung notwendig.
 * @param {Function} callback Eine Callbackfunktion die die Parameter (error, response) verarbeiten kann.
 * Sie übernimmt gewöhnlich das Senden eines Responses zur Anfrage.
 * In diesem Fall ist der Response die Menge (Array) der anhand des attr-Objekt ermittelten User.
 * Bei einem Fehler wird ein passendes error-Objekt zurückgesendet und die Verarbeitung abgebrochen.
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
                    userdata.push(user)
                })
                callback(null, userdata);
            }
        });
    } else {
        callback(errors.e501, null)
    }
}


module.exports = {getUsers, createUserNode, createConnection, deleteConnection}
