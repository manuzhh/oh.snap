"use strict"
/**
 * @Author: Jan Dieckhoff
 */

const err = "error_"

exports.config = {

    "login": {success: "login", error: err + "login"},
    "register": {success: "register", error: err + "register"},
    "authenticate": {success: "authenticate", error: err + "authenticate"},
    "online_users": {success: "online_users", error: err + "online_users"},
    "all_users": {success: "all_users", error: err + "all_users"},
    "spec_user": {success: "spec_user", error: err + "spec_user"},
    "users": {success: "all_users", error: err + "all_users"},
    "follow": {success: "follow", error: err + "follow"},
    "unfollow": {success: "unfollow", error: err + "unfollow"},
    "connectionsTo" : {success: "connectionsTo", error: err + "connectionsTo"},
    "connectionsFrom" : {success: "connectionsFrom", error: err + "connectionsFrom"},
    "logout": {success: "logout", error: err + "logout"},
    "user_login": {success: "user_login", error: err + "user_login"},
    "user_logout": {success: "user_logout", error: err + "user_logout"},
    "chat": {success: "chat", error: err + "chat"},
    "save_content": {success: "save_content", error: err + "save_content"},
    "load_content": {success: "load_content", error: err + "load_content"},
    "update_content": {success: "update_content", error: err + "update_content"}
}
