import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Shield, Sword, HeartPulse, ExternalLink, AlertTriangle, CheckCircle2, CircleDot, Map, BookOpen } from 'lucide-react';
import './styles.css';

const wowhead = (slug) => `https://www.wowhead.com/guide/midnight/raids/venomous-abyss-${slug}-boss-strategy-abilities`;

const bosses = [
  {
    id: 'nekzali', order: 1, name: "Nek'zali the Soulcoiler", room: 'Soulcoil Well', type: '2 Phasen + Intermission',
    summary: 'Der Brunnen in der Mitte ist der zentrale Raumanker. Spieler dürfen dort nicht sterben und beschworene Amani dürfen ihn nicht erreichen.',
    firstPull: ['Brunnen in der Mitte immer meiden.', 'Adds sofort vom Brunnen weg kontrollieren und töten.', 'Bei 50 % die Echoes of Jawae fokussieren.', 'Nach der Intermission auf steigenden Endphasen-Druck vorbereiten.'],
    phases: [
      ['Phase 1', 'Soulcoil Well kontrollieren, Adds stoppen und Soulcoil Rite nicht unnötig verstärken.'],
      ['50 % Intermission', 'Ritual of Awakening: Echoes of Jawae töten und Tethers of Awakening entfernen.'],
      ['Phase 2', 'Uncoiling: dauerhaft steigender Raidschaden und deutlich höherer Zeitdruck.']
    ],
    abilities: [
      ['Soulcoil Well', 'Zentrale Gefahrenzone. Ein Geist oder ein dort sterbender Spieler verstärkt das Ritual.'],
      ['Soulcoil Rite', 'Wird ausgelöst, wenn der Brunnen einen Geist aufnimmt; verursacht Raid-Schaden und erhöht Nek’zalis Energie.'],
      ['Restless Amani', 'Adds, die in Richtung Soulcoil Well drängen und vorher gestoppt werden müssen.'],
      ['Ritual of Awakening', 'Intermission bei 50 % Bossleben.'],
      ['Echoes of Jawae', 'Prioritätsziele der Intermission.'],
      ['Tethers of Awakening', 'Bindungen, die durch das Töten der Echoes entfernt werden.'],
      ['Uncoiling', 'Finale Phase nach voller Energie; anhaltender Raid-Schaden bis zum Kill.'],
      ['Invoke', 'Ruft Latent Cultists und setzt weitere Soulcoil-Interaktionen in Gang.'],
      ['Ritual Burn', 'Heroisch/Mythisch: erhöht den Schaden weiterer Soulcoil-Rite-Treffer und stapelt.']
    ],
    roles: {
      tank: ['Boss und Adds konsequent vom Brunnen weg halten.', 'Add-Aufnahmen früh planen; kein Add darf unkontrolliert durch die Mitte laufen.', 'Defensives für die eskalierende Endphase einplanen.'],
      healer: ['Tode in Brunnennähe unbedingt verhindern.', 'Raid-CDs für Intermission und Uncoiling staffeln.', 'Heroisch/Mythisch Ritual-Burn-Stapel bei der Heilplanung berücksichtigen.'],
      dps: ['Adds vor Boss-DPS priorisieren, sobald sie den Brunnen bedrohen.', 'Intermission: Echoes of Jawae sofort fokussieren.', 'Burst für die Endphase aufheben, wenn dadurch Uncoiling verkürzt wird.']
    },
    difficulty: {
      heroic: 'Ritual Burn macht wiederholte Soulcoil-Rite-Auslösungen zunehmend gefährlich. Fehler am Brunnen skalieren dadurch stark.',
      mythic: 'Invoke kann Interrupts zusätzlich bestrafen; feste Add-, Interrupt- und Positionszuweisungen werden wichtiger.'
    },
    arena: { boss: [50, 26], tank: [50, 18], melee: [50, 34], ranged: [76, 62], danger: [50, 54], label: 'Soulcoil Well' },
    sources: [['Wowhead', wowhead('nekzali-the-soulcoiler')], ['Blizzard', 'https://worldofwarcraft.blizzard.com/en-gb/news/24294062/curse-of-ulatek-the-venomous-abyss-raid-goes-live-19-august']]
  },
  {
    id: 'sentinels', order: 2, name: 'Entombed Sentinels', room: 'Sentinel Chamber', type: '2 Ziele + Intermission',
    summary: 'Breath of Ula’tek und Blood of Ula’tek müssen getrennt gespielt werden. Zu dicht beieinander erhalten sie Ula’tek’s Dominance und nehmen 99 % weniger Schaden.',
    firstPull: ['Raid in zwei stabile Gruppen teilen.', 'Bosse mindestens 25 m auseinander halten; sinnvoll ist deutlich mehr Abstand.', 'Eigene Sentinel-Mechaniken sauber lösen.', 'Bei 100 Energie Helical Toxins exakt auf 4 Anwendungen zusammenführen.'],
    phases: [['Geteilte Phase', 'Zwei Gruppen spielen unterschiedliche Mechanikpakete.'], ['100 Energie', 'Vitriolic Stasis: Bosse laufen zusammen, gleichen Leben an und verteilen Helical Toxins.']],
    abilities: [
      ["Ula'tek's Dominance", 'Sentinels in Reichweite voneinander erleiden 99 % weniger Schaden.'],
      ['Mark of Acid', 'Breath-Seite: stapelnder Natur-Schaden auf Spielern in Reichweite.'],
      ['Mark of Blood', 'Blood-Seite: stapelnder Schatten-Schaden auf Spielern in Reichweite.'],
      ['Venom Coagulation', 'Erzeugt einen großen Slime, der Contaminate wirkt.'],
      ['Contaminate', 'Starker wiederkehrender Raid-Schaden, solange der Slime lebt.'],
      ['Toxic Droplets', 'Droplets rechtzeitig kontrollieren, bevor Noxious Blast auslöst.'],
      ['Empowering Slam', 'Tankhit der Breath-Seite; wiederholte Treffer auf denselben Tank werden stärker.'],
      ['Blighted Blood', 'Dispellbarer Debuff der Blood-Seite.'],
      ['Bloodvenom Injection', 'Tankhit der Blood-Seite mit stapelnder Folgewirkung.'],
      ['Vitriolic Stasis', 'Intermission bei 100 Energie; geringerer Sentinel wird hochgeheilt.'],
      ['Helical Toxins', 'Spieler kombinieren Anwendungen durch Zusammenlaufen; exakt 4 neutralisieren den Effekt.']
    ],
    roles: {
      tank: ['Sentinels dauerhaft weit trennen.', 'Empowering Slam und Bloodvenom Injection erzwingen Tankwechsel bzw. wechselnde Zielzuordnung.', 'Vor Vitriolic Stasis Bosse kontrolliert zusammenlaufen lassen.'],
      healer: ['Blighted Blood gezielt dispellen.', 'Contaminate als hohe Raid-Schadensphase behandeln.', 'Helical-Toxins-Gruppen nicht durch unnötige Bewegung stören.'],
      dps: ['Venom Coagulation sofort priorisieren.', 'Eigene Gruppenseite nicht verlassen, bis die Intermission beginnt.', 'Helical Toxins nach festem 4er-Plan neutralisieren.']
    },
    difficulty: { heroic: 'Living Venom und Blood Venom erhöhen die Raum- und Bewegungsanforderungen.', mythic: 'Zusätzliche Protovenom-Interaktionen verlangen feste Paarungen und saubere Kollisionswege.' },
    arena: { boss: [26, 34], boss2: [74, 34], tank: [18, 34], melee: [34, 34], ranged: [50, 72], danger: [50, 50], label: 'Trennlinie' },
    sources: [['Wowhead', wowhead('entombed-sentinels')]]
  },
  {
    id: 'vashnik', order: 3, name: 'Vashnik the Malignant', room: 'Chamber of Virulence', type: '1 Phase / Fountain-Rotation',
    summary: 'Drei Fountains – Blood, Shadow und Flame – bestimmen Vashniks aktives Mechanikpaket. Bei 100 Energie trinkt er mit Imbibe aus den zwei nächsten Fountains.',
    firstPull: ['Bossposition bestimmt die nächsten zwei Fountains.', 'Imbibe verursacht hohen Raidschaden.', 'Living Venoms töten, bevor sie die Malignant Cavity erreichen.', 'Nicht dieselbe Infusion unnötig oft verstärken.'],
    phases: [['Wiederholende Rotation', 'Boss bewegen → Imbibe bei 100 Energie → Living Venoms töten → neue Fountain-Kombination vorbereiten.']],
    abilities: [['Imbibe', 'Zieht Energie aus den zwei nächstgelegenen Fountains und erzeugt Living Venoms.'], ['Infusion', 'Lang anhaltende Verstärkung der zugehörigen Venom-Mechaniken.'], ['Malignant Burst', 'Auslösung, wenn ein Living Venom die zentrale Cavity erreicht.'], ['Sanguineous Fortitude', 'Schützt den initialen Clotting Venom.']],
    roles: {
      tank: ['Boss vor 100 Energie exakt an die geplante Fountain-Kombination stellen.', 'Position früh bewegen, nicht erst beim Cast.', 'Tankmechaniken der aktuellen Infusion antizipieren.'],
      healer: ['Imbibe als planbaren Raid-Schadenspeak behandeln.', 'Heil-CDs an schwierige Fountain-Kombinationen koppeln.', 'Fehlerhafte Living Venoms führen zu Malignant Burst – dafür Notfall-CDs bereithalten.'],
      dps: ['Living Venoms vor Boss-DPS priorisieren.', 'Nicht in den Weg der Venoms bzw. Fountain-Effekte stellen.', 'Burstfenster so planen, dass Addkontrolle nicht leidet.']
    },
    difficulty: { heroic: 'Mehr Mechaniküberlappung und weniger Raum für schlechte Fountain-Rotationen.', mythic: 'Fountain-Reihenfolge und Add-Zielzuweisung sollten vor Pull vollständig feststehen.' },
    arena: { boss: [50, 50], tank: [50, 42], melee: [50, 57], ranged: [50, 78], danger: [50, 18], label: 'Malignant Cavity' },
    sources: [['Wowhead', wowhead('vashnik-the-malignant')]]
  },
  {
    id: 'lost-explorers', order: 4, name: 'The Lost Explorers', room: "Mor'zahi's Tomb", type: '3 Ziele / Ressourcenmechanik',
    summary: 'Drei besessene Tortollaner werden von Mor’zahi kontrolliert. Disgusting Fish brechen seine Konzentration; jeder Tortollaner kann nur einmal gefüttert werden.',
    firstPull: ['Fisch-Ressource nicht verschwenden.', 'Scrollsage Iku, First Mate Nama und Trader Gebbo haben unterschiedliche Mechaniken.', 'Frost- und Feuer-Effekte können sich gegenseitig neutralisieren.', 'Bossreihenfolge und Fisch-Zeitpunkte vorher festlegen.'],
    phases: [['Besessenheitszyklus', 'Mor’zahi kontrolliert einen Explorer; Kontrolle mit Disgusting Fish brechen und Ziel nach Plan töten.'], ['Nach einem Kill', 'Verbleibende Explorer erhalten gefährliche Eskalationsmechaniken.']],
    abilities: [['Dark Whispers', 'Mor’zahi übernimmt einen Explorer.'], ['Binding Anguish', 'Mor’zahi übernimmt ein Ziel erneut und erweitert dessen Fähigkeiten.'], ['Empowered Ascension', 'Wipe-Druck, wenn Mor’zahi volle Energie erreicht.'], ['Disgusting Fish', 'Begrenzte Ressource zum Brechen von Mor’zahis Konzentration.'], ['Frostfire Volley', 'Feuer- und Frosteffekte können einander neutralisieren.'], ['Blink Nova', 'Raid-Schaden; Entfernung vom Ziel reduziert den Treffer.'], ['Mighty Thud', 'Mehrere Sprünge; Schaden muss in den markierten Bereichen geteilt werden.'], ['Aura of Unity', 'Heroisch/Mythisch: nahe Explorer erhalten United Defense und 99 % Schadensreduktion.'], ['Explosive Surprise', 'Bombe mit Concussive Blast; Knockback bewusst nutzen bzw. vermeiden.'], ['Fungal Burst', 'Pilzexplosion; mit Knockbacks besonders gefährlich.']],
    roles: {
      tank: ['First Mate Nama und Scrollsage Iku kontrolliert positionieren.', 'Shredding Shards erhöht Magieschaden auf dem Tank stark.', 'Heroisch/Mythisch Explorer so trennen, dass Aura of Unity nicht aktiviert wird.'],
      healer: ['Blink Nova nach Distanzmechanik vorbereiten.', 'Icebound Flames kann dispellbare Folgeeffekte erzeugen.', 'Elemental Explosion vermeiden – sie entsteht durch falsches Kreuzen von Frost/Feuer.'],
      dps: ['Fisch-Träger und Kill-Reihenfolge strikt einhalten.', 'Mighty Thud korrekt soaken.', 'Frostfire-Effekte gezielt gegeneinander ausspielen statt zusätzliche Explosionen auszulösen.']
    },
    difficulty: { heroic: 'Aura of Unity / United Defense erzwingen deutlich sauberere Bosspositionen.', mythic: 'Relic-Rupture- und Rauminteraktionen bestrafen unkontrolliertes Öffnen von Gebbos Kisten stärker.' },
    arena: { boss: [50, 32], boss2: [30, 56], boss3: [70, 56], tank: [50, 20], ranged: [50, 82], danger: [50, 58], label: 'Fisch-/Kistenbereich' },
    sources: [['Wowhead', wowhead('lost-explorers')]]
  },
  {
    id: 'sszorak', order: 5, name: 'Sszorak', room: 'Serpent Warren', type: '1 Phase / Knockbacks',
    summary: 'Ein Bewegungsfight mit vielen Push- und Knockback-Effekten. Während Dig In nimmt Sszorak deutlich erhöhten Schaden – das ist das zentrale Burstfenster.',
    firstPull: ['Immer wissen, wohin der nächste Knockback führt.', 'Viscous Cysts nicht versehentlich berühren.', 'Für Howling Maelstrom freie Laufwege halten.', 'DPS-Cooldowns möglichst in Dig In legen.'],
    phases: [['Wiederholender Zyklus', 'Apex Predator → Venomous Surge → Crosswinds/Knockbacks → Dig In als Burstfenster.']],
    abilities: [['Apex Predator', 'Kombination gefährlicher Angriffe.'], ['Venomous Surge', 'Erzeugt instabile Globs und Viscous Cysts.'], ['Viscous Cyst', 'Kontakt stößt Spieler weg.'], ['Raging Crosswinds', 'Windmechanik verändert sichere Positionen.'], ['Howling Maelstrom', 'Starker Wind schiebt Spieler in Windrichtung.'], ['Dig In', 'Langes Schadensfenster mit erhöhter Schadensaufnahme des Bosses.']],
    roles: { tank: ['Boss so stellen, dass Knockbacks nicht in gefährliche Flächen oder Kanten führen.', 'Vor Howling Maelstrom und Dig In Position stabilisieren.'], healer: ['Bewegungsphasen mit Heil-CDs abdecken.', 'Spieler nach ungeplanten Knockbacks schnell stabilisieren.'], dps: ['Offensive CDs für Dig In aufheben.', 'Cysts und Windrichtung permanent mitdenken.', 'Mechanik vor Uptime – falscher Knockback ist meist tödlicher als verlorene GCDs.'] },
    difficulty: { heroic: 'Mehr überlappende Raumgefahren machen schlechte Landepositionen tödlicher.', mythic: 'Persönliche Bewegungswege und defensive Zuordnungen sollten fix geplant sein.' },
    arena: { boss: [50, 44], tank: [50, 34], melee: [50, 54], ranged: [72, 72], danger: [25, 50], label: 'Knockback-Zone' }, sources: [['Wowhead', wowhead('sszorak')]]
  },
  {
    id: 'twin-fangs', order: 6, name: 'The Twin Fangs', room: 'Pit of Fangs', type: '2 Ziele / Stack-Management',
    summary: 'Vexhul und Ithraz bauen Eternal Venom auf Spielern auf. Bei 9 Stapeln stirbt der Spieler; Ravenous Feast kann bis zu 3 Stapel entfernen.',
    firstPull: ['Eigene Eternal-Venom-Stapel permanent beobachten.', 'Ravenous Feast gezielt zum Abbauen nutzen.', 'Caustic Deluge nicht unnötig berühren.', 'Spawns of Vexhul schnell kontrollieren.'],
    phases: [['Wiederholender Zyklus', 'Vexhul und Ithraz rotieren Fähigkeiten bis 100 Energie.'], ['100 Energie', 'Vile Flood und Sanguine Storm erzeugen hohen Raum- und Raid-Druck.']],
    abilities: [['Eternal Venom', 'Persönlicher Stapel; 9 Anwendungen töten den Spieler.'], ['Ravenous Feast', 'Großer Soak, der bis zu 3 Eternal-Venom-Anwendungen entfernt.'], ['Caustic Deluge', 'Globules erhöhen bei Kontakt Eternal Venom.'], ['Venomous Emergence', 'Beschwört Spawns of Vexhul.'], ['Corrosive Spit', 'Adds greifen wiederholt Spieler an.'], ['Stone Breaker', 'Ithraz bedroht die Plattform.'], ['Vile Flood', 'Vexhuls 100-Energie-Fähigkeit.'], ['Sanguine Storm', 'Ithraz’ 100-Energie-Fähigkeit.']],
    roles: { tank: ['Beide Bosse kontrolliert stellen und Soak-Raum freihalten.', 'Tankmechaniken zusammen mit Eternal-Venom-Stapeln planen.'], healer: ['Hohe Stack-Spieler besonders beobachten.', 'Ravenous Feast als planbaren Gruppenschaden vorbereiten.', '100-Energie-Überlappungen mit Raid-CDs absichern.'], dps: ['Stacks aktiv managen statt erst bei 8 zu reagieren.', 'Adds aus Venomous Emergence priorisieren.', 'Ravenous Feast nur nach geplantem Stackbedarf soaken.'] },
    difficulty: { heroic: 'Stack- und Raumfehler werden deutlich schwerer zu kompensieren.', mythic: 'Feste Soakgruppen und ein klarer Eternal-Venom-Plan werden praktisch Pflicht.' },
    arena: { boss: [35, 40], boss2: [65, 40], tank: [50, 26], melee: [50, 50], ranged: [50, 78], danger: [50, 62], label: 'Ravenous Feast Soak' }, sources: [['Wowhead', wowhead('twin-fangs')]]
  },
  {
    id: 'coiled-altar', order: 7, name: 'The Coiled Altar', room: 'The Coiled Altar', type: '3 Phasen',
    summary: 'Phase 1 gegen Zul’jan, Phase 2 gegen Hex Lord Malacrass; im Finale werden beide über ihre Seelenmechanik gemeinsam relevant.',
    firstPull: ['Coalesced Venom kontrolliert beseitigen.', 'Tankhits können gezielt Raumobjekte zerstören.', 'Heil-CDs über drei Phasen verteilen.', 'Finalphase als eigentlichen Ausführungscheck behandeln.'],
    phases: [['Phase 1', 'Zul’jan: Fangs of the Crucible, Toxic Deluge und Coalesced Venom.'], ['Phase 2', 'Malacrass übernimmt mit Schatten-/Seelenmechaniken.'], ['Finale', 'Beide Gegner sind über die Seelenmechanik miteinander verbunden.']],
    abilities: [['Fangs of the Crucible', 'Hoher Raid-Schaden; verstärkt Zul’jans Nahkampfangriffe.'], ['Twinfang Toxin', 'Verstärkter Tanktreffer.'], ['Noxious Ground', 'Giftflächen aus den Schlangenstatuen.'], ['Toxic Deluge', 'Erzeugt Coalesced Venom.'], ['Coalesced Venom', 'Giftglobule; beim Zerstören entsteht Venom Rupture.'], ['Venom Rupture', 'Raid-DoT nach dem Zerstören einer Globule; kann stapeln.'], ['Sever', 'Tankmechanik, die Coalesced Venom zerstören kann.'], ['Soul Sever', 'Spätere Tankmechanik mit Gravebound-/Add-Interaktion.'], ['Corrupted Toxin', 'Stapelnder Tankdruck.']],
    roles: { tank: ['Sever/Soul Sever bewusst zum Bereinigen von Raumobjekten einsetzen.', 'Bosswechsel und Tankdebuffs phasenweise planen.'], healer: ['Fangs/Defilement als große Raid-Schadensfenster behandeln.', 'Venom Ruptures nicht unkontrolliert stapeln lassen.'], dps: ['Coalesced Venom nicht planlos zerstören.', 'Phasen-Burst nach Raidplan timen.', 'Im Finale Zielverteilung nicht eigenmächtig ändern.'] },
    difficulty: { heroic: 'Toxic-Deluge-/Globule-Management wird strenger.', mythic: 'Raumobjekte, Tankhits und finale Zielkontrolle müssen exakt ineinandergreifen.' },
    arena: { boss: [50, 36], tank: [50, 24], melee: [50, 46], ranged: [50, 78], danger: [26, 62], label: 'Coalesced Venom' }, sources: [['Wowhead', wowhead('coiled-altar')]]
  },
  {
    id: 'ulatek', order: 8, name: "Ula'tek", room: "Ula'tek's Prison", type: '3 Phasen + Intermission',
    summary: 'Endboss mit Area-Denial, Eiern/Adds und zunehmend zerstörter Arena. Venom-Kontakt kann Devourer’s Spawn ausbrüten und den Raid dauerhaft belasten.',
    firstPull: ['Caustic Waves so spielen, dass Eier nicht unnötig ausbrüten.', 'Adds priorisieren – falsches Padding kostet später Raum.', 'Spectral Coils gemeinsam korrekt soaken.', 'Im Finale sichere Flächen gegen Demolish maximal lange erhalten.'],
    phases: [['Phase 1', 'Caustic Waves, Eier/Spawn, Spectral Coils.'], ['Übergang', 'Rage of the Shackled öffnet das Venomous Heart als Schadensfenster.'], ['Intermission', 'Doomscale Wardens und Eier kontrollieren.'], ['Finale', 'Call of the Serpent + Demolish reduzieren verbleibenden sicheren Raum.']],
    abilities: [['Caustic Waves', 'Venomwellen verändern sichere Flächen und können Eier ausbrüten.'], ["Devourer's Spawn", 'Eier, die bei Venomkontakt gefährliche Adds hervorbringen.'], ['Putrid Membrane', 'Raidweiter anhaltender Effekt, wenn Eier vollständig ausbrüten.'], ['Spectral Coils', 'Raidtreffer, dessen Schaden durch korrektes Besetzen der Einschlagstelle reduziert wird.'], ['Rage of the Shackled', 'Großer Übergang mit starkem Raid-Schaden.'], ['Venomous Heart', 'Temporäres Schadensfenster während Rage of the Shackled.'], ['Call of the Serpent', 'Bringt weitere Adds in späteren Phasen.'], ['Demolish', 'Zerstört im Finale sichere Arenabereiche.'], ['Poisonous Bite', 'Heroisch: Venomous Birthlings verursachen stapelnden Gift-DoT.'], ['Hardened', 'Mythisch: Eier absorbieren zunächst Schaden und können in diesem Zustand nicht bewegt werden.'], ['Noxious Shell', 'Mythisch: Träger dürfen sich nicht gegenseitig zu nahe kommen.']],
    roles: { tank: ['Ula’tek bzw. Adds immer in Nahkampfreichweite halten, um Ersatzfähigkeiten zu vermeiden.', 'Adds schnell aufnehmen und von wichtigen Eiern/Flächen wegführen.', 'Finale Bossposition mit verbleibendem sicheren Raum planen.'], healer: ['Putrid-Membrane-Stapel möglichst gering halten.', 'Rage of the Shackled und späte Raumknappheit mit festen Raid-CDs abdecken.', 'Heroisch Poisonous Bite und Mythic Noxious-Shell-Fehler schnell erkennen.'], dps: ['Eier/Adds nach Priorität statt nach DPS-Meter spielen.', 'Venomkontakt mit Eiern vermeiden, sofern er nicht geplant ist.', 'Venomous Heart als Burstfenster nutzen.', 'Finale: Demolish-Raumverlust überlebt man nur mit sauberer Positionierung.'] },
    difficulty: { heroic: 'Venomous Birthlings erhalten Poisonous Bite; ungeplante Hatchings erhöhen den Heilbedarf dauerhaft.', mythic: 'Hardened und Noxious Shell machen Eierbewegung und persönliche Abstände zu festen Assignments.' },
    arena: { boss: [50, 28], tank: [50, 18], melee: [50, 38], ranged: [50, 72], danger: [50, 54], label: 'Venom / Eier' }, sources: [['Wowhead', wowhead('ulatek')], ['Blizzard', 'https://worldofwarcraft.blizzard.com/en-gb/news/24294062/curse-of-ulatek-the-venomous-abyss-raid-goes-live-19-august']]
  }
];

const roles = { tank: ['Tank', Shield], healer: ['Heiler', HeartPulse], dps: ['DPS', Sword] };

function Ability({ item }) {
  const [name, note] = item;
  return <div className="ability" title={`Deutsch: Live-Lokalisierung noch nicht verifiziert\n${note}`}><div><strong>{name}</strong><span className="lang">EN · DE Mouseover ausstehend</span></div><p>{note}</p></div>;
}

function Arena({ data }) {
  const point = (xy, cls, text) => xy ? <div className={`arena-point ${cls}`} style={{left:`${xy[0]}%`, top:`${xy[1]}%`}}><span>{text}</span></div> : null;
  return <div className="arena"><div className="arena-ring"/><div className="arena-danger" style={{left:`${data.danger[0]}%`,top:`${data.danger[1]}%`}}><span>{data.label}</span></div>{point(data.boss,'boss','Boss')}{point(data.boss2,'boss second','Boss 2')}{point(data.boss3,'boss third','Boss 3')}{point(data.tank,'tank','T')}{point(data.melee,'melee','M')}{point(data.ranged,'ranged','R')}</div>;
}

function App() {
  const [selected, setSelected] = useState('nekzali');
  const [difficulty, setDifficulty] = useState('heroic');
  const [role, setRole] = useState('dps');
  const boss = useMemo(() => bosses.find(b => b.id === selected), [selected]);
  const [roleLabel, RoleIcon] = roles[role];

  return <div className="app">
    <header className="topbar">
      <div><span className="eyebrow">MIDNIGHT · PATCH 12.1</span><h1>The Venomous Abyss</h1><p>Raidguide für den ersten Pull: kurz genug zum Nachschlagen, detailliert genug für Assignments.</p></div>
      <div className="status"><CheckCircle2 size={17}/> Live-Datenstruktur · EN-Namen geprüft</div>
    </header>

    <div className="layout">
      <aside className="sidebar">
        <div className="side-title">Bosses</div>
        {bosses.map(b => <button key={b.id} className={selected===b.id?'boss-btn active':'boss-btn'} onClick={()=>setSelected(b.id)}><span>{b.order}</span><div><strong>{b.name}</strong><small>{b.type}</small></div></button>)}
      </aside>

      <main className="content">
        <section className="hero">
          <div><div className="crumb">Boss {boss.order} / 8 · {boss.room}</div><h2>{boss.name}</h2><p>{boss.summary}</p></div>
          <div className="controls"><div className="segmented"><button className={difficulty==='heroic'?'active':''} onClick={()=>setDifficulty('heroic')}>Heroisch</button><button className={difficulty==='mythic'?'active':''} onClick={()=>setDifficulty('mythic')}>Mythisch</button></div></div>
        </section>

        <section className="callout warning"><AlertTriangle/><div><strong>Lokalisierungsstatus</strong><p>Englische Ability-Namen werden aus aktuellen 12.1-Quellen übernommen. Deutsche Namen werden erst angezeigt, sobald die Live-DE-Lokalisierung eindeutig verifiziert ist – keine geratenen Übersetzungen.</p></div></section>

        <div className="grid two">
          <section className="card"><h3><BookOpen/> Erster Pull: Das musst du wissen</h3><ol className="steps">{boss.firstPull.map((x,i)=><li key={x}><span>{i+1}</span>{x}</li>)}</ol></section>
          <section className="card"><h3><CircleDot/> Kampfablauf</h3><div className="timeline">{boss.phases.map(([p,t])=><div key={p}><strong>{p}</strong><p>{t}</p></div>)}</div></section>
        </div>

        <section className="card role-card"><div className="role-head"><h3><RoleIcon/> Deine Aufgabe: {roleLabel}</h3><div className="role-tabs">{Object.entries(roles).map(([key,[label,Icon]])=><button key={key} className={role===key?'active':''} onClick={()=>setRole(key)}><Icon size={16}/>{label}</button>)}</div></div><ul className="role-list">{boss.roles[role].map(x=><li key={x}>{x}</li>)}</ul></section>

        <section className="difficulty"><span>{difficulty==='heroic'?'Heroisch':'Mythisch'}</span><p>{boss.difficulty[difficulty]}</p></section>

        <section className="card"><h3>Fähigkeiten</h3><div className="abilities">{boss.abilities.map((x)=><Ability key={x[0]} item={x}/>)}</div></section>

        <div className="grid two bottom-grid">
          <section className="card"><h3><Map/> Raum & Positionierung</h3><p className="muted">Schematische Orientierung, nicht maßstabsgetreu. T = Tank, M = Melee, R = Ranged.</p><Arena data={boss.arena}/></section>
          <section className="card sources"><h3>Quellen</h3><p className="muted">Mechaniken werden quellenbasiert gepflegt; Strategieformulierungen sind für schnelle Raid-Nutzung verdichtet.</p>{boss.sources.map(([name,url])=><a href={url} key={url} target="_blank" rel="noreferrer"><ExternalLink size={15}/>{name}</a>)}</section>
        </div>
      </main>
    </div>
  </div>;
}

createRoot(document.getElementById('root')).render(<App/>);
