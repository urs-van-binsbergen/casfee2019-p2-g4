# CAS FEE 2019 Projekt 2 Gruppe 4

## Dokumentation

- [Schiffeversenken Projektbeschrieb](doc/project/description.pdf)
- [Schiffeversenken Präsentation](doc/project/presentation.pdf)

## Lokale Installation und Start

```sh
npm install
ng serve
```
Danach im Browser http://localhost:4200 laden.

### Mobile Device Browser Test

IP Adresse und Port müssen den lokalen Gegebenheiten angepasst werden.

```sh
ng serve --host 192.168.1.121 --port 4200
```

Danach im Browser
http://192.168.1.121:4200/webpack-dev-server/index.html laden.

### Unit test

```sh
ng test
```

### e2e test

```sh
npm run pree2e
ng e2e --webdriver-update=false
```

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

Dann im Root der Applikation builden und deployen (dist/casfee2019-p2-g4): 

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

## Über die Lösung

### Module gemäss Projektbeschrieb

- Authentisierung
- Benutzerprofil
- Spielvorbereitung
- Herausforderung
- Schlacht
- Hall of Fame

### Spezielles

- State Management mit NGXS
- Mehrsprachigkeit mit NGX-Translate
- Angular Material, Angular Flex Layout

### Backend-Konzept

#### Constraints

- **Nicht cheatable**: Ein böswilliger Benutzer kann nicht mit Crafted Reads/Writes den Spielverlauf zu seinen Gunsten ändern
- **Nicht mass-writeable**: Ein böswilliger Benutzer kann nicht Daten ausserhalb des definierten Datenmodells schreiben (verhindert parasitäre Nutzung der Datenbank).

#### Firestore-Architektur

- Alle Collections sind für den Client read-only
- Geschrieben wird ausschliesslich über Cloud Functions
- Lese-optimierte Datenstruktur (denormalisiert). Jeder Spieler sieht nur seine eigene Kopie des Spielzustands
- Dies erlaubt triviale und dennoch sichere [Firestore-Rules](firestore.rules)

### Verbesserungsmöglichkeiten

#### Nicht realisierte Features aus der Spezifikation

- Avatar (ersetzt durch generischen Avatar)
- Admin-Modul (ist teilweise ersetzbar durch die in Firebase eingebauten Admin-Tools)
- Zeitbeschränkung pro Spielzug  
  Dies Funktion wäre im echten Produkt zwingend. Sonst kann ein Spieler seinen Gegner 
  durch Inaktivität zur Niederlage zwingen: denn dieser muss in der Folge kapitulieren, 
  um ein neues Spiel anfangen zu können.

#### Optimierungspotential der aktuellen Lösung

Usability Issues
- Platzierung der Schiffe ist speziell auf Mobilgeräten etwas hakelig
- Einen Gegner zu finden ist nicht ganz einfach - man muss sich praktisch
  ausserhalb des Games verabreden. 
    - Einerseits fehlt eine _Kritische Masse_ von Spielern, welche es erlauben würde, jederzeit
      einen Gegner finden kann.
    - Sinnvoll wäre dementsprechend die Möglichkeit, bei Abwesenheit menschlicher Gegner gegen 
      einen Bot spielen zu können. 
    - Andererseits ist das Problem, dass die Spieler im Status "Gegner finden" verbleiben, 
      auch wenn sie gar nicht mehr aktiv bzw. offline sind.
        - Lösung: implizites und/oder explizites Online-Tracking (vergleiche entsprechende
          Lösungen bei Chat/Phone-Applikationen). Ggf. auch Push-Meldungen "Dein herausgeforderter
          Gegner XY ist jetzt online".
- Error Handling: Wir haben zwar dafür gesorgt, dass etliche Fehler abgefangen und im UI kommunziert werden, 
  aber typische Zustände wie z.B. "Kein Netz", sind nur teilweise behandelt.

Technische Issues
- Modulstruktur (weniger Module, trennen zwischen Feature- und Service-Modulen, bzw. keine
  Cross-Dependencies zwischen Feature-Modulen)
- Redux/NGXS noch konsequenter einsetzen (einige Module haben parallel ein relativ aufwändiges inneres
  State Tracking, z.B. Battle)

## Usability Test

App

- [Spezifikation](doc/usability/app-usability-test-spec.md)
- [Resultate](doc/usability/app-usability-test-result.md)

User

- [Spezifikation](doc/usability/user-usability-test-spec.md)
- [Resultate](doc/usability/user-usability-test-result.md)

Spiel

- [Spezifikation](doc/usability/game-usability-test-spec.md)
- [Resultate](doc/usability/game-usability-test-result.md)
