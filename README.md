# oh.snap

oh.snap ist ein Framework welches ein generisches soziales Netzwerk aufbaut.

## Installation
```console
npm install oh.snap --save
```

## API

### Oh.Snap einbinden
Um die API zu verwenden muss das Paket geladen werden und die Konfiguration für die zu verwendende Datenbank muss übergeben werden.
Derzeit wird MongoDB als Datenbank voll unterstützt, an einer vollen Unterstützung für Neo4J wird derzeit noch gearbeitet.
```JavaScript
const snap = require('oh.snap').init({
    "type": DATABASETYPE, // Beispiel: "mongodb"
    "host": HOST, // Beispiel: "mongodb://127.0.0.1:27017/"
    "dataStore": DATENBANK-NAME, // Beipiel: "test"
    "login": DATENBANK-LOGIN,
    "password": DATENBANK-PASSWORT
})
```

### API verwenden
Die API umfasst folgede Funktionen

#### users
```JavaScript
snap.users.reducers.register(identifer, func)
snap.users.reducers.keys()
snap.users.builders.register(identifer, func)
snap.users.builders.keys()
snap.users.login(loginData, callback)
snap.users.register(newUserObj, builders, callback)
snap.users.authenticate(authToken, reducers)
snap.users.get(authToken, options, reducers, callback)
snap.users.connect(token, userIdFrom, userIdTo, callback)
snap.users.disconnect(token, userIdFrom, userIdTo, callback)
snap.users.logout(token, callback)
```

#### content
```JavaScript
snap.content.reducers.register(identifer, func)
snap.content.reducers.keys()
snap.content.builders.register(identifer, func)
snap.content.builders.keys()
snap.content.create(authToken, newContentObj, builders, callback)
snap.content.get(authToken, options, reducers, callback)
snap.content.update(authToken, updatedContentObj, builders, callback)
```

### Benutzer registrieren
```JavaScript
let userName = "ein User"
let password = "myPassword"
snap.users.register(
  {userName, password, passwordConf: password, publicKey},
  ["myBuilder"], // siehe Builder und Reducer
  (err, data) => {
        if (!!err) {
            console.log(err)
         }
         else {
            console.log(data)
         }

  })
})
```
