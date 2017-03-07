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

### Benutzer registrieren 
```JavaScript
snap.users.register(
  let userName = "ein User"
  let password = "myPassword"
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
