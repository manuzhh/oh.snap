"use strict"
/**
 * @Author: Jan Dieckhoff
 * Diese Submodul enthält einige Hilfsfunktionen um beispielsweise übergebene Eingabedaten
 * auf Ihre Integrität zu testen.
 **/

/**
 * Prüft ob die übergebenen User-Datan valide sind.
 * Leerzeichen und leere String in Username und Passwort sind nicht erlaubt
 * @param {Object} inputData Besteht mindestens aus inputData.userName und inputData.password
 * @returns {boolean} inputData valide oder nicht
 */
function inputValid(inputData) {

    let valid = false;

    if(inputData.hasOwnProperty('userName')
        && inputData.hasOwnProperty('password')) {

        valid = inputData['userName'].length > 0 && !inputData['userName'].includes(' ')
                    && inputData['password'].length > 0 && !inputData['password'].includes(' ')
    }
    return valid
}

module.exports = {inputValid}
