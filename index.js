'use strict';

let contentModule = null
let userModule = null


let userReducers = {
	"default": (userObj) => {
		delete userObj.hashedPassword;
		return userObj
	}
}

let userBuilders = {
	"default": (userObj) => {
		return userObj
	},
	"addRegisterTimestamp": (userObj) => {
		userObj.registerTimestamp = Date.getTime()

		return userObj
	}
}

let contentReducers = {
	"default": (contentObj) => {
		return contentObj;
	}
}

let contentBuilders = {
	"default": (contentObj) => {
		return contentObj
	},
	"addCreationTimestamp": (contentObj) => {
        contentObj.createTimestamp = Date.getTime()

		return contentObj
	}
}

/**
 * Führt eine Menge von Funktionen, deren Identifier in einem Array übergeben wurden, aus einem übergebenem Reducer/Builder-Objekt auf einem übergebenem Objekt aus.
 * Dabei wird die default-Funktion des übergebenem Reducer/Builder-Objekt immer ausgeführt.
 * @param  {Object} obj          Objekt auf welchem die Reducer/Builder-Funktionen ausgeführt werden sollen.
 * @param  {Object} functions    Reducer/Builder-Objekt.
 * @param  {Array}  [options=[]] Liste von Identifiern, der auszuführenden Reducer/Builder-Funktionen.
 * @return {Object}              Das von den Reducer/Builder-Funktionen verarbeitete Objekt.
 */
let runFunctionList = (obj, functions, options=[]) => {
	if (options instanceof Array) {
		options.unshift("default")
	} else if (options instanceof String) {
		options = ["default", options]
	}

	for (let option of options) {
		if (functions[option] instanceof Function) {
			obj = functions[option](obj)
		}
	}

	return obj
}

/**
 * Init-Funktion des Pakets, an die die alle notwendigen Konfigurationsdaten übergeben werden, welche dann ein Objekt zurückgibt, welches alle API-Funktionen beinhaltet.
 * Die Konfigurationsdaten müssen folgende Eigenschaften aufweisen:
 * {type: "mongodb|neo4j",
 * host: "HOSTADDRESS",
 * dataStore: "USE DATABASE NAME",
 * login: "LOGIN NAME FOR DATABASE",
 * password: "PASSWORD FOR DATABASE"
 * }
 *
 * Der Aufruf der API funktioniert folgendermaßen:
 * Zuerst wird die Init-Funktion aufgerufen und ihr werden die Konfigurationsdaten übergeben.
 * let snap = require("oh.snap").init({CONFIG})
 * Der return-Wert der Init-Funktion enthält dann alle API Funktionen, ein Aufruf dieser Funktionen könnte wie folgt aussehen:
 * snap.users.get(...)
 * snap.content.create(...)
 *
 * @param  {Object} config Konfigurationsdaten, wie oben beschrieben.
 * @return {Object}        Ein Objekt welches alle API-Funktionen beinhaltet.
 */
let init = (config) => {

	//dataStore config
	require('snap-datastore').init(config)

	contentModule = require('./lib/content/content')
	userModule = require('./lib/user/user')

	return {
		"users": {
			"reducers": {
				"register": (identifer, func) => {
					if (identifer instanceof String && func instanceof Function) {
						userReducers[identifer] = func
					}
				},
				"keys": () => {
					return Object.keys(userReducers);
				}
			},
			"builders": {
				"register": (identifer, func) => {
					if (identifer instanceof String && func instanceof Function) {
						userBuilders[identifer] = func
					}
				},
				"keys": () => {
					return Object.keys(userBuilders);
				}
			},

			"login": (loginData, callback) => {
				userModule.login(loginData, callback)
			},
			"register": (newUserObj, builders = ["default"], callback) => {
				newUserObj = runFunctionList(newUserObj, userBuilders, builders)
				userModule.register(newUserObj, callback)
			},
			"authenticate":(authToken, reducers = ["default"]) => {
				return userModule.authenticate(authToken)
			},
			"get": (authToken, options, reducers = ["default"], callback) => {
				userModule.getUsers({"token": authToken}, options, true, (err, users) => {
					if (!err && users) {

						if (users instanceof Array) {
							for (let index in users) {
								users[index] = runFunctionList(users[index], userReducers, reducers)
							}
						} else {
							users = runFunctionList(users, userReducers, reducers)
						}

					}

					callback(err, users)
				})
			},
			"connect": (token, userTo, callback) => {
				userModule.connectUsers({
					token,
					payload: userTo
				}, callback)
			},
			"disconnect": (token, userTo, callback) => {
				userModule.disconnectUsers({
					token,
					payload: userTo
				}, callback)
			},
			"logout": (token, callback) => {
				userModule.logout({
					token
				}, callback)
			}

		},
		"content": {
			"reducers": {
				"register": (identifer, func) => {
					if (identifer instanceof String && func instanceof Function) {
						contentReducers[identifer] = func
					}
				},
				"keys": () => {
					return Object.keys(contentReducers);
				}
			},
			"builders": {
				"register": (identifer, func) => {
					if (identifer instanceof String && func instanceof Function) {
						contentBuilders[identifer] = func
					}
				},
				"keys": () => {
					return Object.keys(contentBuilders);
				}
			},
			"create": (token, newContentObj, builders = ["default"], callback) => {
				//if client only provides a string as content
				if (typeof newContentObj === 'string') {
					newContentObj = {
						"contentString": newContentObj
					}
				}

				newContentObj = runFunctionList(newContentObj, contentBuilders, builders)

				contentModule.create(token, newContentObj, callback)
			},
			"get": (authToken, options, reducers = ["default"], callback) => {
				contentModule.getContent(authToken, options, true, (err, content) => {
					if (!err && content) {

						if (content instanceof Array) {
							for (let index in content) {
								content[index] = runFunctionList(content[index], contentReducers, reducers)
							}
						} else {
							content = runFunctionList(content, contentReducers, reducers)
						}

					}

					callback(err, content)
				})
			},
			"update": (token, updatedContentObj, builders = ["default"], callback) => {

				updatedContentObj = runFunctionList(updatedContentObj, contentBuilders, builder)

				contentModule.create(token, updatedContentObj, callback)
			}
		}
	}
}

module.exports = {
	init
};
