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
