# oh.snap

oh.snap ist ein Framework welches ein generisches soziales Netzwerk aufbaut.

## Installation:
```console
npm install oh.snap --save
```

## HOWTO

### Oh.Snap einbinden:
```JavaScript
const snap = require('oh.snap').init({
    "type": DATABASETYPE, // Beispiel: "mongodb"
    "host": HOST, // Beispiel: "mongodb://127.0.0.1:27017/"
    "dataStore": DATENBANK-NAME, // Beipiel: "test"
    "login": DATENBANK-LOGIN,
    "password": DATENBANK-PASSWORT
})
```

### Benutzer registrieren 
```JavaScript
snap.users.register(
  let userName = "ein User"
  let password = "myPassword"
  {userName, password, passwordConf: password, publicKey}, 
  ["myBuilder"], 
  (err, data) => {
            client.emit("register", data)
            if (!!err) {
                console.log(err)
            }

        })
})
```
