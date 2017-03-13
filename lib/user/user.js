"use strict"
/**
 * @Author: Jan Dieckhoff
 * Das User-Modul übernimmt die allgemeine Verwaltung der User und deren Beziehung zueinander.
 * Dafür werden entsprechende Aufrufe aus der Snap-API entgegengenommen und die an die zuständigen
 * Submodule weitergereicht
 */

const userLogin = require('./userLogin')
const userRegistration = require('./userRegistration')
const userStorage = require('./userStorage')
const userConnection = require('./userConnection')
const userAuth = require('./userAuth')


/**
 * Versucht einen User mit den übergebenen Login-Daten einzuloggen.
 * Dafür werden die übergebenen Login-Daten und die Callback-Funktion an das
 * userLogin-Modul weitergeleitet und dort verarbeitet.
 * @param {Object} loginData Besteht aus loginData.userName und loginData.password
 * @param {Function} callback Eine Callbackfunktion die die Parameter (error, response) verarbeiten kann.
 * Sie übernimmt gewöhnlich das Senden eines Responses zur Anfrage.
 * In diesem Fall ist der Response ein JSON-Webtoken.
 * Bei einem Fehler ein passendes error-Objekt zurückgesendet und die Verarbeitung abgebrochen.
 */
function login(loginData, callback) {
    userLogin.login(loginData, callback)
}

/**
 * Legt einen Benutzeraccount an.
 * Dafür werden die übergebenen User-Daten und die Callback-Funktion an das
 * userRegistration-Modul weitergeleitet und dort verarbeitet.
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
    userRegistration.register(userData, callback)
}

/**
 * Ermittelt eine Menge von Usern, die dem übergebenen attr-Objekt entsprechen.
 * Dafür wird das JSON-Webtoken, das attr-Objekt, das auth-Flag und eine Callbackfunktion
 * an das userStorage-Modul übergeben und dort weiterverarbeitet.
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
function getUsers(data, attr, auth, callback) {
    console.log('spec user called: ' + JSON.stringify(data))
    userStorage.getUsers(data,attr,auth,callback);
}

/**
 * Stellt eine abstrakte From-/To-Verbindung zwischen zwei Usern her.
 * Dafür wird das connData-Objekt und eine Callbackfunktion
 * an das userConnection-Modul übergeben und dort weiterverarbeitet.
 * Bei erfolgreicher Ausführung liegen die User-Objekte in der DAtenbank
 * danach wie folgt vor: Der Aufrufer hat eine neue Referenz in der follow-Liste (die To-Verbindung).
 * Der User zu dem die Verbindung hergestellt wurde hat eine neue Referenz in der followed-Liste
 * (die From-Verbindung). Diese Referenzen sind die jeweiligen User-IDs.
 * @param {Object} connData Besteht aus connData.token (Authentifizierung des Aufrufers), connData.userIdFrom (die User-ID
 * des Aufrufers), connData.userIdTo (die User-ID des Users, zu dem die Verbindung hergestellt werden soll
 * @param {Function} callback Eine Callbackfunktion die die Parameter (error, response) verarbeiten kann.
 * Sie übernimmt gewöhnlich das Senden eines Responses zur Anfrage.
 * In diesem Fall ist der Response das User-Objekt, zu dem eine To-Verbindung hergestellt wurde.
 * Bei einem Fehler wird ein passendes error-Objekt zurückgesendet und die Verarbeitung abgebrochen.
 */
 function connectUsers(connData, callback) {
     userConnection.connectUsers(connData,callback)
 }

/**
 * Löscht eine abstrakte From-/To-Verbindung zwischen zwei Usern.
 * Dafür wird das connData-Objekt und eine Callbackfunktion
 * an das userConnection-Modul übergeben und dort weiterverarbeitet.
 * Bei erfolgreicher Ausführung liegen die User-Objekte in der Datenbank
 * danach wie folgt vor: Die Referenz in der follow-Liste des Aufrufers (die To-Verbindung) ist gelöscht.
 * Die Referenz in der followed-Liste des Users, zu dem die To-Verbindung hergestellt wurde (die From-Verbindung), is gelöscht.
 * Diese Referenzen sind die jeweiligen User-IDs.
 * @param {Object} connData Besteht aus connData.token (Authentifizierung des Aufrufers), connData.userIdFrom (die User-ID
 * des Aufrufers), connData.userIdTo (die User-ID des Users, von dem die Verbindung gelöscht werden soll
 * @param {Function} callback Eine Callbackfunktion die die Parameter (error, response) verarbeiten kann.
 * Sie übernimmt gewöhnlich das Senden eines Responses zur Anfrage.
 * In diesem Fall ist der Response das User-Objekt, von dem eine To-Verbindung gelöscht wurde.
 * Bei einem Fehler wird ein passendes error-Objekt zurückgesendet und die Verarbeitung abgebrochen.
 */
function disconnectUsers(connData,callback) {
    userConnection.disconnectUsers(connData,callback)
}

/**
 * Versucht einen User auszuloggen. Dafür wird das data-Objekt und eine Callbackfunktion
 * an das userStorage-Modul übergeben und dort weiterverarbeitet. Bei erfolgreicher Ausführung
 * ist die Eigenschaft des in der Datenbank gefundenen Userobjekts von {online: true} auf {online: false} gesetzt.
 * @param {Object} data Enthält das data.token welches zur Authentifizierung des Aufrufers dient
 * @param {Function} callback Eine Callbackfunktion die die Parameter (error, response) verarbeiten kann.
 * Sie übernimmt gewöhnlich das Senden eines Responses zur Anfrage.
 * In diesem Fall ist der Response das User-Objekt, das zu dem User gehört, der ausgeloggt wurde.
 * Bei einem Fehler wird ein passendes error-Objekt zurückgesendet und die Verarbeitung abgebrochen.
 */
function logout(data, callback) {
    userLogin.logout(data, callback)
}

function getConnections(type, data, callback) {
    userConnection.getConnections(type, data, callback)
}

/**
 * Authentifiert den Aufrufer anhand des übergebenen Tokens.
 * Das Token wird an das userAuth-Submodul weitergereicht und dort verarbeitet.
 * @param {String} token Das vom Aufrufer übergebene JSON-Webtoken
 * @returns {Object} Das Userobjekt, falls gültig. Sonst null.
 */
function authenticate(token) {
    return userAuth.authenticate(token)
}



module.exports = {
    login, register,
    getUsers, connectUsers,
    logout, disconnectUsers,
    getConnections: getConnections,
    authenticate: authenticate
}
