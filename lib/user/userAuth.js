"use strict"
/**
 * @Author: Jan Dieckhoff
 * Dieses Submodul übernimmt unter anderem die Erzeugung und Prüfung von JSON Web-Tokens, um Clients,
 * die eventbasierte Aufrufe durchführen, zu identifizieren und authentifizieren. Dazu wird bei erfolgreichem
 * Login (siehe Submodul User-Login/Logout)  aus dem zu den Logindaten gehörenden ermittelten Datenobjekt
 * (Zugriff auf das Sub-Modul User-Storage) ein JSON-Web-Token generiert und an den Client zurückgesendet.
 *  Dieses ist über die gesamte Session gültig und dient für alle weiteren Aufrufe zur Authentisierung des Aufrufers
 *  und der Authentifizierung durch den Server.
 */

const jwtConfig = require('../../config/jwtConfig').config
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


/**
 * Erzeugt mit Hilfe des Packages 'bcrypt' eine gehashte Version eines übergebenen Passworts.
 * Zusätzlich wird ein Salt generiert, welches dem gehashtem Passwort angefügt wird.
 * @param {String} input Das gehashte Passwort
 * @param {Function} callback Eine Callbackfunktion die die Parameter (error, response) verarbeiten kann.
 * In diesem Fall gibt die callback-Funktion das gehashte Passwort zurück, welches an der Aufruferstelle
 * weiterverabeitet wird. Bei einem Fehler wird ein passendes error-Objekt zurückgesendet und die Verarbeitung abgebrochen.
 */
function buildHashAsync(input, callback = () => {
}) {
    bcrypt.genSalt(jwtConfig.saltRounds, function (err, salt) {
        bcrypt.hash(input, salt, function (err, hash) {
            if(err) {
                callback(err, null)
            } else {
                callback(null, hash)
            }
        });
    });
}

/**
 * Vergleicht ein übergebenes Passwort mit dem zugehörigen Hash synchron
 * @param {String} password Das Passwort in Klartext
 * @param {String} hashedPassword Das Passwort als hash
 * @returns {boolean} Klartext passt zum Hash (true/false)
 */
function compareSync(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword)
}

/**
 * Erzeugt ein JSON-Webtoken für das übergebene Objekt. Das Objekt
 * ist in der Regel ein Userobjekt, welches nach erfolgreichem Überprüfen
 * von Logindaten übergeben wird. Das Erzeugen des Webtokens stellt einen
 * abschließendem Schritt im Login-Prozess dar.
 * @param {Object} obj Das Object zu dem ein Token erzeugt werden soll
 * @returns {String} Das erzeugte JSON-Webtoken
 */
function sign(obj) {
    return jwt.sign(obj, jwtConfig.secret)
}

/**
 * Authentifiert den Aufrufer anhand des übergebenen Tokens.
 * @param {String} token Das vom Aufrufer übergebene JSON-Webtoken
 * @returns {Object} Das dekodierte Token (Das Userobjekt zum Aufrufer).
 *          {null} Falls das Token ungültig ist.
 */
function authenticate(token) {
    let decoded = null
    if (token) {
        try {
            decoded = jwt.verify(token, jwtConfig.secret)
        } catch (err) {
            return null
        }
    }

    return decoded
}

module.exports = {buildHashAsync, compareSync, sign, authenticate}
