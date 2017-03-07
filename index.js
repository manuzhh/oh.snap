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
 * Registriert eine neue Reducer-Funktion für User-Objekte. Diese kann dann von allen User-Funktionen, User-Objekte schreiben verwendet werden indem der identifer in den jeweiligen reducers-Parameter übernommen wird.
 * @param  {String} identifer Name der Funktion für spätere Verwendung. Darf nicht "default" sein.
 * @param  {Function} func    Funktion die ein User-Objekt als Parameter akzeptiert und dieses verändert wieder zurückgibt.
 */
let userReducersRegister = (identifer, func) => {
	if (identifer instanceof String && func instanceof Function) {
		userReducers[identifer] = func
	}
}

/**
 * Liefert eine Liste mit den Identifern aller registrierten Reducer-Funktion für User-Objekte.
 * @return {Array} Liste der Identifer.
 */
let usersReducersKeys =  () => {
	return Object.keys(userReducers);
}

/**
 * Registriert eine neue Builder-Funktion für User-Objekte. Diese kann dann von allen User-Funktionen, User-Objekte lesen verwendet werden indem der identifer in den jeweiligen builders-Parameter übernommen wird.
 * @param  {String} identifer Name der Funktion für spätere Verwendung. Darf nicht "default" sein.
 * @param  {Function} func    Funktion die ein User-Objekt als Parameter akzeptiert und dieses verändert wieder zurückgibt.
 */
let usersBuildersRegister = (identifer, func) => {
	if (identifer instanceof String && func instanceof Function) {
		userBuilders[identifer] = func
	}
}

/**
 * Liefert eine Liste mit den Identifern aller registrierten Builder-Funktion für User-Objekte.
 * @return {Array} Liste der Identifer.
 */
let usersBuildersKeys = () => {
	return Object.keys(userBuilders);
}

/**
 * Login-Funktion für User. Erwartet ein Objekt mit den Logindaten und eine callback-Funktion, die aufgerufen wird sobald der Loginvorgang abgeschlossen wurde.
 * Diese Funktion wird über users.login in die API eingebunden.
 * @param  {Object}   loginData Objekt welches die Elemente userName und password beinhaltet.
 * @param  {Function} callback  Eine Funktion die Aufgerufen werden soll, sobald der Login-Prozess abgeschlossen wurde. Diese erhält zwei Parameter (error, response).
 * Der erste Parameter enthält einen Errorcode, falls der Login fehlgeschlagen ist, ansonsten null.
 * Der zweite Parameter enthält das User-Objekt für den Fall, dass der Login erfolgreich war, ansonsten null.
 */
let usersLogin = (loginData, callback) => {
	userModule.login(loginData, callback)
}

/**
 * Funktion die einen neuen User registriert. Dazu wird ein User-Objekt übegerben, welches alle Daten des neu anzulegenden Users enthält, eine Liste von Builder-Funktion um
 * dem User-Objekt weitere Eigenschaften hinzuzufügen, sowie eine callback-Funktion die aufgerufen wird sobald der Vorgan abgeschlossen ist.
 * Das übergebene User-Objekt muss die Elemente userName, password und passwordConf enthalten. der Inhalt der von password und passwordConf muss identisch sein.
 * Das übergbene User-Objekt darf keine Elemente enhalten mit dem Bezeichnern:
 * 	hashedPassword
 * 	online
 * 	followl
 * 	followedl
 * 	content
 *
 * Diese Funktion wird über users.register in die API eingebunden.
 *
 * @param  {Object}   newUserObj             Neues User-Objekt mit den oben beschriebenen Eigenschaften.
 * @param  {Array}    [builders=["default"]] Liste mit Bezeichnern von Builder-Funktion, die auf das User-Objekt angewendet werden sollen.
 * @param  {Function} callback               Eine Funktion die Aufgerufen werden soll, sobald der Registrierungs-Prozess abgeschlossen wurde. Diese erhält zwei Parameter (error, response).
 * Der erste Parameter enthält einen Errorcode, falls die Registrierung fehlgeschlagen ist, ansonsten null.
 * Der zweite Parameter enthält das User-Objekt für den Fall, dass die Registrierung erfolgreich war, ansonsten null.
 */
let usersRegister = (newUserObj, builders = ["default"], callback) => {
	newUserObj = runFunctionList(newUserObj, userBuilders, builders)
	userModule.register(newUserObj, callback)
}

/**
 * Funktion zum authetifizieren eines Users.
 * Dazu wird der Funktion das JSON-Webtoken des Users übergeben. Ist das Token valide wird das User-Objekt des Users zurückgegeben.
 *
 * Diese Funktion wird über users.authenticate in die API eingebunden.
 * @param  {String} authToken              JSON-Webtoken des zu authetifizierenden Users.
 * @param  {Array}  [reducers=["default"]] Liste mit Bezeichnern von Reducer-Funktion, die auf das User-Objekt angewendet werden sollen bevor es zurückgegeben wird.
 * @return {Object}                        User-Objekt des zu authetifizierenden benutzers oder null.
 */
let usersAuthenticate = (authToken, reducers = ["default"]) => {
	return userModule.authenticate(authToken)
}

/**
 * Funktion zum Abfragen von User-Objekten.
 *
 * Diese Funktion wird über users.get in die API eingebunden.
 * @param  {String}   authToken              JSON-Webtoken des anfragenden Users.
 * @param  {Object}   options                Stellt den Filter da, der die Menge der zu ermittelnden User spezifiziert.
 * z. B. könnte das Objekt folgendermaßen aussehen: {online: true}. In diesem Fall würden
 * nur User ermittelt, die derzeit auf eingeloggt sind.
 * @param  {Array}    [reducers=["default"]] Liste mit Bezeichnern von Reducer-Funktion, die auf die User-Objekte angewendet werden sollen bevor sie zurückgegeben wird.
 * @param  {Function} callback               Eine Funktion die Aufgerufen werden soll, sobald der Such-Prozess abgeschlossen wurde. Diese erhält zwei Parameter (error, response).
 * Der erste Parameter enthält einen Errorcode, falls die Suche fehlgeschlagen ist, ansonsten null.
 * Der zweite Parameter enthält ein Array von User-Objekten oder null.
 */
let usersGet = (authToken, options, reducers = ["default"], callback) => {
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
}

let usersConnect = (token, userIdFrom, userIdTo, callback) => {
	userModule.connectUsers({
		token,
		userIdFrom,
		userIdTo,
	}, callback)
}

let usersDisconnect = (token, userIdFrom, userIdTo, callback) => {
	userModule.disconnectUsers({
		token,
		userIdFrom,
		userIdTo
	}, callback)
}

let usersLogout =  (token, callback) => {
	userModule.logout({
		token
	}, callback)
}

let users = {
	"reducers": {
		"register": userReducersRegister,
		"keys": usersReducersKeys
	},
	"builders": {
		"register": usersBuildersRegister,
		"keys": usersBuildersKeys
	},
	"login": usersLogin,
	"register": usersRegister,
	"authenticate": usersAuthenticate,
	"get": usersGet,
	"connect": usersConnect,
	"disconnect": usersDisconnect,
	"logout": usersLogout
}

let contentReducersRegister = (identifer, func) => {
	if (identifer instanceof String && func instanceof Function) {
		contentReducers[identifer] = func
	}
}

let contentReducersKeys = () => {
	return Object.keys(contentReducers);
}

let contentBuildersRegister = (identifer, func) => {
	if (identifer instanceof String && func instanceof Function) {
		contentBuilders[identifer] = func
	}
}

let contentBuildersKeys = () => {
	return Object.keys(contentBuilders);
}

let contentCreate = (token, newContentObj, builders = ["default"], callback) => {
	//if client only provides a string as content
	if (typeof newContentObj === 'string') {
		newContentObj = {
			"contentString": newContentObj
		}
	}

	newContentObj = runFunctionList(newContentObj, contentBuilders, builders)

	contentModule.create(token, newContentObj, callback)
}

let contentGet = (authToken, options, reducers = ["default"], callback) => {
	contentModule.getContent(authToken, options, true, (err, content) => {
		if (content) {
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
}

let contentUpdate = (token, updatedContentObj, builders = ["default"], callback) => {
	updatedContentObj = runFunctionList(updatedContentObj, contentBuilders, builder)
	contentModule.create(token, updatedContentObj, callback)
}

let content = {
	"reducers": {
		"register": contentReducersRegister,
		"keys": contentReducersKeys
	},
	"builders": {
		"register": contentBuildersRegister,
		"keys": contentBuildersKeys
	},
	"create": contentCreate,
	"get": contentGet,
	"update": contentUpdate
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
		users,
		content
	}
}

module.exports = {
	init
};
