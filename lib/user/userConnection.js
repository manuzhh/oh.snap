"use strict"
/**
 * @Author: Jan Dieckhoff
 * Hier werden Beziehungen zwischen Usern verwaltet (z. B. Follows). Das Submodul stellt Funktionen
 * bereit um Verbindungen zwischen Usern herzustellen oder zu entfernen. Diese können abstrakt betrachtet
 * werden und es liegt in der Verantwortung des Client-Programmierers, wie diese Verbindungen interpretiert werden.
 * Die Grundidee von Snap! ist, die Grundstruktur eines sozialen Netzwerkes bereitzustellen. Diese Grundstruktur muss
 * natürlich User-Verbindungen bereitstellen, um beispielsweise ein Following-System möglich zu machen.
 **/

const userAuth = require('./userAuth')
const userStorage = require('./userStorage')
const errors = require('../../config/errConfig').config

/**
 * Stellt eine abstrakte From-/To-Verbindung zwischen zwei Usern her.
 * Dafür werden die bneötigten Daten aus dem connData-Objekt und eine Callbackfunktion
 * an das userStorage-Modul übergeben und dort weiterverarbeitet.
 * Bei erfolgreicher Ausführung liegen die User-Objekte in der Datenbank
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
function connectUsers(connData, callback = () => {
    console.error("Usermodule: no callback for connectUsers function")
}) {
    let decoded = userAuth.authenticate(connData.token)

    if (decoded) {
        // TODO: checkout needed connection type in config-file (Default: Follow)
        userStorage.createConnection(connData.userIdFrom, connData.userIdTo, callback)
    } else {
        callback(errors.e501, null)
    }
}

/**
 * Löscht eine abstrakte From-/To-Verbindung zwischen zwei Usern.
 * Dafür werden die bneötigten Daten aus dem connData-Objekt und eine Callbackfunktion
 * an das userStorage-Modul übergeben und dort weiterverarbeitet.
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
function disconnectUsers(connData, callback = () => {
    console.error("Usermodule: no callback for disconnectUsers function")
}) {
    let decoded = userAuth.authenticate(connData.token)

    if (decoded) {
        console.log("disconnectUsers: " + JSON.stringify(connData));
        // TODO: checkout needed connection type in config-file (Default: Follow)
        userStorage.deleteConnection(connData.userIdFrom, connData.userIdTo, callback);
    } else {
        callback(errors.e501, null)
    }
}

module.exports = {disconnectUsers, connectUsers}
