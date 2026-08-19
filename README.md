# SOBIX Raid Guide

Schneller, datengetriebener Raid-Guide für **The Venomous Abyss** in World of Warcraft: Midnight, Patch 12.1.

## Ziel

Der Guide soll einem Raider vor dem ersten Pull in wenigen Minuten beantworten:

- Was ist die Kernidee des Bosses?
- Welche Mechaniken darf ich nicht verpassen?
- Was muss ich als Tank, Heiler oder DPS konkret tun?
- Was ändert sich auf Heroisch bzw. Mythisch?
- Wie sieht der Raum-/Positionsplan aus?
- Woher stammen die Informationen?

## Aktueller Stand

- alle 8 Bosse im Navigationsmodell
- Rollenfilter für Tank / Heiler / DPS
- Heroisch-/Mythisch-Umschaltung
- englische Ability-Namen prominent
- deutsche Bezeichnung im Mouseover/Tooltip-Konzept
- Quellenlinks pro Boss
- responsive, bewusst reduzierte Oberfläche
- schematische Raumdarstellung als Platzhalter für verifizierte Bosskarten

## Datenqualität

Lokalisierte Spell-Namen werden **nicht geraten**. Vor einer endgültigen Veröffentlichung werden englische und deutsche In-Game-Namen gegen belastbare Live-Daten geprüft. Dasselbe gilt für Mythic-spezifische Änderungen und konkrete Positionsgrafiken.

Quellenbasis: Blizzard / Adventure Guide, Wowhead, Icy Veins und weitere aktuelle Progress-/Guild-Quellen. Inhalte werden zusammengefasst und nicht aus fremden Guides kopiert.

## Lokal starten

```bash
npm install
npm run dev
```

Produktionsbuild:

```bash
npm run build
```

## Architektur

Der erste Stand hält UI und Encounter-Daten kompakt in `src/main.jsx`. Als nächster sinnvoller Schritt werden Encounter-Daten in ein eigenes Schema ausgelagert, inklusive Spell-IDs, Locale-Werten, Difficulty-Deltas, Quellenzeitstempeln und verifizierten Positionsdiagrammen.
