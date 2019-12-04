# CAS FEE 2019 Projekt 2 Gruppe 4

## Lokale Installation und Start

```sh
npm install
ng serve
```

http://localhost:4200

### Mobile Device Browser Test

IP Adresse und Port müssen den lokalen Gegebenheiten angepasst werden.

```
ng serve --host 192.168.1.121 --port 4200
```

http://192.168.1.121:4200/webpack-dev-server/index.html

## Hosting URL

URL: https://casfee2019-p2-g4.web.app/

## Deploy

### Deploy Hosting

Falls nicht bereits früher gemacht: Firebase Tools installieren und 
mit Google-Account einloggen:

```sh
npm install -g firebase-tools
firebase login
```

Dann im Root der Applikation builden und deployen (dist/pilot): 

```sh
ng build --prod
firebase deploy --only hosting
```

### Deploy allgemein

Alle Elemente deployen:
```sh
firebase deploy
```

Ein oder mehrere Elemente deployen:
```sh
firebase deploy --only firestore
firebase deploy --only firestore,functions
```

## Backend-Umgebungen (Produktiv und Staging)

Die vorhandenen Umgebungen sowie die aktuell selektierte können mit folgendem Befehl angezeigt werden:

```sh
firebase use
```

Es bestehen die Umgebungen `default` (Produktiv) und `staging`. Letztere dient primär dem Testing von Anpassungen an den Cloud Functions. 

Wechsel der Umgebung mit
```sh
firebase use staging
```
... oder aber
```sh
firebase use default
```

Folgender Befehl kann verwendet werden, um Angular mit dem Staging-Backend zu starten:

```sh
ng serve -c=dev2
```




