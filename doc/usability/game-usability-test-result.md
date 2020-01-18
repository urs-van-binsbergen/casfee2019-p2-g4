# Spiel vorbereiten

## Erkennen um was es geht

-   Kein Problem

## Erkennen wie es geht

-   Kein Problem

# Gegner finden

## Erkennen um was es geht

-   Kein Problem

## Erkennen wie es geht

### Beobachtung

-   Verwirrung, dass nichts passiert, wenn keiner der herausgeforderten
    Spieler die Herausforderung annimmt.
-   «Cancel» Button wird zur Rücknahme von Herausforderungen benutzt.

### Erkenntnis

-   Identischer Ablauf beim Gegenspieler, der die Herausforderung mit
    der Checkbox annehmen müsste, wird nicht erkannt.
-   Button «Cancel» macht nur Sinn, wenn es auch das Gegenstück dazu
    gibt, z.B. «Continue» (was es hier aber by-design nicht gibt)
-   Einen Gegner finden funktioniert nur, wenn es wartende bereite
    Gegner gibt (kritische Masse).

### Massnahmen

-   Checkbox durch Button ersetzen. Text ändern zu «Please wait for Anna
    to start the battle».
-   Umbenennen von «Cancel» in «Quit game».
-   Bot-Gegner, Online-Tracking der Spieler im Warteraum

# Spiel

## Erkennen um was es geht

-   Kein Problem

## Erkennen wie es geht

### Beobachtung

-   Spieler im selben Raum rufen sich zu: «He, du bist im Fall dran!»,
    «Bin ich dran?» «Was, bin ich jetzt wieder dran?».

### Erkenntnis

-   Es ist zu wenig klar erkennbar, was abläuft. Es gibt zwar ein
    Reporting durch kurze Snackbar-Meldungen («Treffer! Du bist am
    Zug»), aber diese werden von den Testpersonen komplett ignoriert.

### Massnahmen

-   Snackbar-Meldungen entfernen. Hit und Miss-Animationen prägnanter
    machen. Unterschied aktives und inaktives Brett deutlicher machen.
    Textmeldungen direkt beim Brett.

## Sieg/Niederlage

### Beobachtung

-   Unter der Animation befindet sich ein Button «OK». Frage «Wo komme
    ich nachher hin?» Antwort: «Probiere es aus». Er drückt ihn, landet
    in der Hall of Fame. «Aha, aber ich möchte nochmals spielen».

### Erkenntnis

-   Die Beschriftung «OK» lässt nicht erkennen, was nachher passiert.
    Der Spieler könnte sich sowohl für die Hall interessieren (wie stehe
    ich?), oder ein neues Spiel starten wollen (Revanche).

### Massnahme

-   Zwei Buttons mit klarer Beschriftung: «Play again», «Hall of Fame».
