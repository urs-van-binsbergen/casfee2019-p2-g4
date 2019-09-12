# CAS FEE 2019 Projekt 2 Gruppe 4

## Lokale Installation und Start

```sh
npm install
ng serve
```

http://localhost:4200

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

