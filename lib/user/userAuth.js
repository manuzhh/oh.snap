"use strict"
/**
 * @Author: Jan Dieckhoff
 */

const jwtConfig = require('../../config/jwtConfig').config
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')



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

function compareSync(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword)
}

function sign(obj) {
    return jwt.sign(obj, jwtConfig.secret)
}

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
