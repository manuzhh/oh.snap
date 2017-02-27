"use strict"
/**
 * @Author: Jan Dieckhoff
 **/

/**
 * checks if the given user data is valid
 * empty userName, password or email
 * and whitespaces within userName or password
 * are not allowed
 * @param loginData
 * @returns {boolean}
 */
function inputValid(loginData) {
    for (let prop in loginData) {
        if (loginData.hasOwnProperty(prop)) {
            if (loginData[prop].length == 0 || loginData[prop].includes(' ')) {
                return false
            }
        }
    }
    return true
}

module.exports = {inputValid}
