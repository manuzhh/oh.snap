"use strict"
/**
 * @Author: Jan Dieckhoff
 * @type {{type: string, host: string, dataStore: string, login: string, password: string}}
 */

exports.config = {
    // code: error type code, msg: error message, detail: e. g. error stack
    "e101": {code: 101, msg: "error_username_or_password_wrong", detail: {}},
    "e102": {code: 102, msg: "error_data_input_invalid", detail: {}},
    "e301": {code: 301, msg: "error_user_already_exists", detail: {}},
    "e302": {code: 302, msg: "error_passwords_not_equal", detail: {}},
    "e303": {code: 303, msg: "error_no_such_user", detail: {}},
    "e400": {code: 400, msg: "illegal_argmument_passed", detail: {}},
    "e501": {code: 501, msg: "error_invalid_token_or_no_token_transmitted",detail: {}},
    "e600": {code: 600, msg: "data_base_error", detail: {}},
    "e900": {code: 900, msg: "not_implemented yet", detail: {}}
}
