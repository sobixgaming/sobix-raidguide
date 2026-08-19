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

### Verifikationsregeln

Jede spielrelevante Aussage muss vor der Kennzeichnung als verifiziert mindestens diese Prüfungen bestehen:

1. Abgleich mit Blizzard / Adventure Guide bzw. belastbaren Live-Daten, soweit öffentlich verfügbar.
2. Abgleich mit mindestens einer zusätzlichen etablierten Guide-Quelle wie Wowhead oder Icy Veins.
3. **Zweifacher Gegencheck mit Mythic Trap (`mythictrap.com`)**: einmal während der Datenerfassung und ein zweites Mal als finaler QA-Schritt unmittelbar bevor ein Boss als vollständig verifiziert gilt.

Geprüft werden dabei insbesondere:

- exakte Ability-Namen und Schreibweisen
- Heroisch-/Mythisch-Unterschiede
- Phasen und Übergänge
- Rollenaufgaben für Tank, Heiler und DPS
- Soaks, Debuffs, Dispel-/Interrupt-Anforderungen und Add-Prioritäten
- Positions- und Raumregeln
- tödliche Grenzwerte, Stapel, Distanzen und relevante Timings

Wenn Mythic Trap und eine andere Quelle voneinander abweichen, wird die Aussage **nicht** als verifiziert markiert. Der Konflikt muss über weitere Quellen oder Live-Daten geklärt werden. Bei fehlender Mythic-Trap-Abdeckung wird dies ausdrücklich als noch nicht zweifach gegengeprüft gekennzeichnet.

Quellenbasis: Blizzard / Adventure Guide, Wowhead, Icy Veins, Mythic Trap und weitere aktuelle Progress-/Guild-Quellen. Inhalte werden zusammengefasst und nicht aus fremden Guides kopiert.

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

Der erste Stand hält UI und Encounter-Daten kompakt in `src/main.jsx`. Als nächster sinnvoller Schritt werden Encounter-Daten in ein eigenes Schema ausgelagert, inklusive Spell-IDs, Locale-Werten, Difficulty-Deltas, Quellenzeitstempeln, Verifikationsstatus je Aussage und verifizierten Positionsdiagrammen.
