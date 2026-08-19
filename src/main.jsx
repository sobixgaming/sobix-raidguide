import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Shield, Sword, HeartPulse, ExternalLink, CheckCircle2, CircleDot, Map, BookOpen, Radar, Clock3 } from 'lucide-react';
import './styles.css';
import './visual-polish.css';

const wowhead = (slug) => `https://www.wowhead.com/guide/midnight/raids/venomous-abyss-${slug}-boss-strategy-abilities`;
const warcraftLogs = 'https://www.warcraftlogs.com/zone/rankings/54';
const blizzard = 'https://worldofwarcraft.blizzard.com/en-gb/news/24294062/curse-of-ulatek-the-venomous-abyss-raid-goes-live-19-august';
const mythicTrap = 'https://www.mythictrap.com/en';
const updated = '19.08.2026';

const bosses = [
  {
    id:'nekzali', order:1, name:"Nek'zali the Soulcoiler", room:'Soulcoil Well', type:'2 Phasen + Intermission',
    summary:'Der zentrale Soulcoil Well bestimmt den gesamten Kampf. Adds und Spieler-Tode in seiner Nähe verschärfen das Ritual; bei 50 % folgt eine Intermission, danach eskaliert der Raidschaden.',
    firstPull:['Brunnen in der Mitte konsequent freihalten.','Restless Amani sofort stoppen und vom Brunnen weg töten.','Bei 50 % Echoes of Jawae als absolute Priorität spielen.','Defensive und Heil-CDs für Uncoiling aufheben.'],
    phases:[['Phase 1','Soulcoil Well kontrollieren, Adds stoppen und Soulcoil Rite nicht unnötig verstärken.'],['50 % Intermission','Ritual of Awakening: Echoes of Jawae töten und Tethers of Awakening entfernen.'],['Phase 2','Uncoiling: dauerhaft steigender Raidschaden; Mechaniken weiter sauber spielen und Kill beschleunigen.']],
    abilities:[['Soulcoil Well','Zentrale Gefahrenzone. Geister oder Spieler-Tode am Brunnen verschärfen das Ritual.'],['Soulcoil Rite','Raid-Schaden und Energiegewinn für Nek’zali, wenn der Brunnen gespeist wird.'],['Restless Amani','Adds, die in Richtung Soulcoil Well drängen.'],['Ritual of Awakening','Intermission bei 50 % Bossleben.'],['Echoes of Jawae','Prioritätsziele der Intermission.'],['Tethers of Awakening','Bindungen der Intermission, die über die Echoes entfernt werden.'],['Uncoiling','Finale Phase mit stetig steigendem Druck.'],['Invoke','Ruft weitere Kultisten-/Soulcoil-Interaktionen hervor.'],['Ritual Burn','Heroisch/Mythisch: wiederholte Soulcoil-Rite-Treffer werden gefährlicher.']],
    roles:{tank:['Boss an der oberen Arenahälfte halten und die Mitte frei lassen.','Adds so aufnehmen, dass ihre Laufwege niemals durch den Brunnen führen.','Defensives für die Endphase staffeln.'],healer:['Spieler in Brunnennähe priorisieren – ein Tod dort ist doppelt teuer.','Raid-CDs für Intermission und Uncoiling fest zuweisen.','Ritual-Burn-Eskalation in Heroisch/Mythisch einplanen.'],dps:['Adds vor Boss-Uptime priorisieren, sobald sie den Brunnen bedrohen.','Echoes in der Intermission sofort fokussieren.','Burst in Uncoiling nutzen, um die gefährliche Endphase zu verkürzen.']},
    difficulty:{heroic:'Ritual Burn macht wiederholte Soulcoil-Rite-Auslösungen zunehmend gefährlich.',mythic:'Feste Add-, Interrupt- und Positionszuweisungen werden wichtiger; Fehler am Brunnen sind kaum noch kompensierbar.'},
    arena:{boss:[50,24],tank:[50,15],melee:[50,34],ranged:[76,68],danger:[50,54],label:'Soulcoil Well',path:[[78,78],[72,64],[66,52],[62,40]]},
    positioning:['Tank/Boss oben halten; die Mitte gehört ausschließlich der Brunnenmechanik.','Melee direkt hinter/seitlich am Boss, ohne Laufweg durch den Brunnen.','Ranged/Heiler breit in einer Halbkreiszone unten/rechts verteilen.','Add-Laufwege früh abfangen und seitlich vom Brunnen wegziehen.'],
    sources:[['Blizzard',blizzard],['Wowhead',wowhead('nekzali-the-soulcoiler')],['Warcraft Logs',warcraftLogs]]
  },
  {
    id:'sentinels',order:2,name:'Entombed Sentinels',room:'Sentinel Chamber',type:'2 Ziele + Intermission',
    summary:'Breath of Ula’tek und Blood of Ula’tek müssen räumlich getrennt werden. Zu dicht beieinander erhalten sie Ula’tek’s Dominance und nehmen 99 % weniger Schaden.',
    firstPull:['Raid vor Pull in zwei feste Gruppen teilen.','Sentinels deutlich voneinander trennen.','Eigene Seite nicht für unnötige Uptime wechseln.','Helical Toxins in der Intermission exakt nach Gruppenplan zusammenführen.'],
    phases:[['Geteilte Phase','Zwei Gruppen spielen getrennte Sentinel-Mechanikpakete.'],['100 Energie','Vitriolic Stasis: Bosse kommen zusammen, gleichen Leben an und verteilen Helical Toxins.']],
    abilities:[["Ula'tek's Dominance",'Nahe Sentinels erleiden 99 % weniger Schaden.'],['Mark of Acid','Breath-Seite: stapelnder Natur-Schaden.'],['Mark of Blood','Blood-Seite: stapelnder Schatten-Schaden.'],['Venom Coagulation','Erzeugt einen Slime mit Contaminate.'],['Contaminate','Hoher wiederkehrender Raid-Schaden, solange der Slime lebt.'],['Toxic Droplets','Droplets kontrollieren, bevor Noxious Blast auslöst.'],['Empowering Slam','Tankhit der Breath-Seite.'],['Blighted Blood','Dispellbarer Debuff der Blood-Seite.'],['Bloodvenom Injection','Tankhit der Blood-Seite.'],['Vitriolic Stasis','Intermission bei 100 Energie.'],['Helical Toxins','Anwendungen durch geplantes Zusammenlaufen neutralisieren.']],
    roles:{tank:['Je einen Sentinel an der linken/rechten Außenkante halten.','Bosse nie versehentlich zusammenziehen, außer für die geplante Stasis.','Tankwechsel/-zuweisung je Sentinel getrennt führen.'],healer:['Heiler fest auf beide Gruppen verteilen.','Blighted Blood gezielt dispellen und Contaminate vorbereiten.','Während Stasis zentral zusammenkommen, danach sofort wieder aufteilen.'],dps:['Eigene Seite halten und Add-Prioritäten dort spielen.','Venom Coagulation sofort töten.','Helical Toxins nur nach dem festgelegten Gruppenplan kombinieren.']},
    difficulty:{heroic:'Zusätzliche Venom-Effekte erhöhen Raum- und Bewegungsdruck.',mythic:'Protovenom-Interaktionen verlangen feste Paarungen und exakte Kollisionswege.'},
    arena:{boss:[24,34],boss2:[76,34],tank:[15,34],melee:[35,36],ranged:[50,76],danger:[50,50],label:'Mitte nur für Stasis',path:[[30,72],[42,58],[50,50],[58,58],[70,72]]},
    positioning:['Linke und rechte Raidgruppe bleiben auf getrennten Arenahälften.','Beide Sentinels maximal weit auseinander halten, ohne die eigene Gruppe zu zerreißen.','Mitte bleibt frei und wird erst zur Vitriolic Stasis als Treffpunkt genutzt.','Nach der Intermission sofort wieder auf die ursprünglichen Seiten zurück.'],
    sources:[['Wowhead',wowhead('entombed-sentinels')],['Warcraft Logs',warcraftLogs]]
  },
  {
    id:'vashnik',order:3,name:'Vashnik the Malignant',room:'Chamber of Virulence',type:'1 Phase / Fountain-Rotation',
    summary:'Drei Fountains – Blood, Shadow und Flame – bestimmen das aktive Mechanikpaket. Die Bossposition vor 100 Energie entscheidet, aus welchen zwei Fountains Imbibe Kraft zieht.',
    firstPull:['Fountain-Reihenfolge vor Pull festlegen.','Boss früh zur nächsten geplanten Kombination bewegen.','Living Venoms töten, bevor sie die Malignant Cavity erreichen.','Imbibe als planbaren Raid-Schadenspeak behandeln.'],
    phases:[['Rotationszyklus','Boss bewegen → Imbibe bei 100 Energie → Living Venoms töten → nächste Fountain-Kombination vorbereiten.']],
    abilities:[['Imbibe','Zieht Energie aus den zwei nächstgelegenen Fountains.'],['Infusion','Lang anhaltende Verstärkung der zugehörigen Venom-Mechaniken.'],['Living Venom','Add aus der Fountain-Phase; darf die Mitte nicht erreichen.'],['Malignant Burst','Auslösung, wenn ein Living Venom die zentrale Cavity erreicht.'],['Sanguineous Fortitude','Schutzwirkung auf den initialen Clotting Venom.']],
    roles:{tank:['Boss vor 100 Energie an die geplante Arena-Seite bewegen.','Nie erst während Imbibe umpositionieren.','Boss so drehen, dass Ranged freie Add-Linien zur Mitte haben.'],healer:['Imbibe-CDs an der geplanten Fountain-Rotation ausrichten.','Ranged-Spieler beim Wechsel zwischen Sektoren stabilisieren.','Malignant Burst ist ein Fehlerfall – Notfall-CD bereithalten.'],dps:['Living Venoms sofort priorisieren.','Fountain-Sektoren klar respektieren und keine unnötigen Wege kreuzen.','Burst so planen, dass Addkontrolle nie leidet.']},
    difficulty:{heroic:'Mehr Überlappung und weniger Raum für schlechte Fountain-Rotationen.',mythic:'Fountain-Reihenfolge und Add-Zielzuweisung sollten komplett vor dem Pull feststehen.'},
    arena:{boss:[50,48],tank:[50,39],melee:[50,58],ranged:[50,78],danger:[50,18],label:'Malignant Cavity',path:[[50,75],[36,62],[30,42],[44,30],[62,36],[70,52]]},
    positioning:['Arena gedanklich in drei Fountain-Sektoren teilen.','Tank bewegt den Boss vor 100 Energie in den vorgesehenen Sektor.','Ranged bleiben möglichst zentral genug für Add-Wechsel, aber außerhalb gefährlicher Linien.','Living Venoms immer zwischen Spawn und Cavity abfangen – nicht hinter dem Boss.'],
    sources:[['Wowhead',wowhead('vashnik-the-malignant')],['Warcraft Logs',warcraftLogs]]
  },
  {
    id:'lost-explorers',order:4,name:'The Lost Explorers',room:"Mor'zahi's Tomb",type:'3 Ziele / Ressourcenmechanik',
    summary:'Drei besessene Tortollaner werden von Mor’zahi kontrolliert. Disgusting Fish brechen seine Konzentration; jeder Explorer kann nur einmal gefüttert werden.',
    firstPull:['Fisch-Reihenfolge und Kill-Ziel vor Pull festlegen.','Explorer auf Heroisch/Mythisch räumlich trennen.','Mighty Thud kontrolliert soaken.','Frost-/Feuer-Effekte bewusst gegeneinander ausspielen.'],
    phases:[['Besessenheitszyklus','Mor’zahi kontrolliert einen Explorer; Disgusting Fish bricht die Kontrolle.'],['Nach einem Kill','Verbleibende Explorer erhalten gefährlichere Mechaniken.']],
    abilities:[['Dark Whispers','Mor’zahi übernimmt einen Explorer.'],['Binding Anguish','Erweitert die Fähigkeiten eines erneut übernommenen Ziels.'],['Empowered Ascension','Wipe-Druck bei voller Energie.'],['Disgusting Fish','Begrenzte Ressource zum Brechen der Kontrolle.'],['Frostfire Volley','Frost- und Feuer-Effekte können sich neutralisieren.'],['Blink Nova','Raid-Schaden, der mit Entfernung sinkt.'],['Mighty Thud','Mehrere Soak-Sprünge.'],['Aura of Unity','Heroisch/Mythisch: nahe Explorer erhalten hohe Schadensreduktion.'],['Explosive Surprise','Bombe mit Knockback.'],['Fungal Burst','Pilzexplosion; in Kombination mit Knockbacks gefährlich.']],
    roles:{tank:['Tankbare Explorer in getrennten Sektoren halten.','Bosswege so legen, dass Fisch-Träger eine freie Route haben.','Heroisch/Mythisch Aura of Unity konsequent verhindern.'],healer:['Blink Nova mit Distanz spielen und Raid stabilisieren.','Fisch-Träger und Soak-Gruppen besonders absichern.','Frost/Feuer-Fehler früh erkennen.'],dps:['Fisch- und Kill-Reihenfolge strikt einhalten.','Mighty Thud korrekt soaken.','Keine eigenmächtigen Zielwechsel, die den Ressourcenplan zerstören.']},
    difficulty:{heroic:'Aura of Unity / United Defense erzwingen sauberere Bosspositionen.',mythic:'Relic-/Rauminteraktionen bestrafen unkontrollierte Bewegung stärker.'},
    arena:{boss:[50,28],boss2:[27,58],boss3:[73,58],tank:[50,17],ranged:[50,84],danger:[50,59],label:'Fisch-/Kistenkorridor',path:[[50,82],[50,67],[42,54],[34,42],[50,30]]},
    positioning:['Explorer als Dreieck stellen; zwischen ihnen genügend Abstand halten.','Zentralen Korridor für Fisch-Träger und Soak-Bewegung offen lassen.','Ranged hinten mittig, damit alle drei Ziele erreichbar bleiben.','Knockbacks niemals so platzieren, dass sie Spieler in einen anderen Explorer-Sektor drücken.'],
    sources:[['Wowhead',wowhead('lost-explorers')],['Warcraft Logs',warcraftLogs]]
  },
  {
    id:'sszorak',order:5,name:'Sszorak',room:'Serpent Warren',type:'1 Phase / Knockbacks',
    summary:'Ein Bewegungsfight mit Push- und Knockback-Effekten. Während Dig In entsteht das wichtigste Burstfenster; schlechte Landepositionen sind der häufigste vermeidbare Fehler.',
    firstPull:['Vor jedem Knockback die sichere Landefläche prüfen.','Viscous Cysts nicht versehentlich berühren.','Für Howling Maelstrom freie Gegenlaufwege halten.','Offensive CDs möglichst für Dig In vorbereiten.'],
    phases:[['Wiederholender Zyklus','Apex Predator → Venomous Surge → Crosswinds/Knockbacks → Dig In als Burstfenster.']],
    abilities:[['Apex Predator','Kombination gefährlicher Angriffe.'],['Venomous Surge','Erzeugt instabile Globs und Viscous Cysts.'],['Viscous Cyst','Kontakt stößt Spieler weg.'],['Raging Crosswinds','Windmechanik verändert sichere Positionen.'],['Howling Maelstrom','Starker Wind schiebt Spieler in Windrichtung.'],['Dig In','Langes Schadensfenster mit erhöhter Schadensaufnahme des Bosses.']],
    roles:{tank:['Boss eher zentral stellen, aber leicht entgegen der erwarteten Knockback-Richtung.','Vor Dig In Position stabilisieren.','Nie mit dem Boss die sichere Landefläche der Gruppe blockieren.'],healer:['Bewegungsphasen vorheilen und Defensives koordinieren.','Spieler nach ungeplanten Knockbacks schnell stabilisieren.'],dps:['CDs für Dig In bündeln.','Immer mit dem Rücken zur sicheren Fläche stehen, bevor ein Push kommt.','Mechanik vor Uptime – falscher Knockback kostet den Pull.']},
    difficulty:{heroic:'Mehr überlappende Raumgefahren machen falsche Landepositionen tödlicher.',mythic:'Persönliche Bewegungswege und Defensivzuordnungen sollten fix geplant sein.'},
    arena:{boss:[50,43],tank:[50,33],melee:[50,54],ranged:[68,72],danger:[23,50],label:'Cyst-/Knockback-Zone',path:[[74,76],[66,65],[58,55],[52,45],[48,34]]},
    positioning:['Boss nahe Mitte halten, damit jede Knockback-Richtung korrigierbar bleibt.','Cysts als dauerhaft gesperrte Zonen behandeln und nicht zwischen Gruppe und sichere Seite legen.','Ranged leicht versetzt stapeln, damit Windkorrekturen in dieselbe Richtung möglich sind.','Vor Howling Maelstrom früh auf die Gegenwindseite rotieren.'],
    sources:[['Wowhead',wowhead('sszorak')],['Warcraft Logs',warcraftLogs]]
  },
  {
    id:'twin-fangs',order:6,name:'The Twin Fangs',room:'Pit of Fangs',type:'2 Ziele / Stack-Management',
    summary:'Vexhul und Ithraz bauen Eternal Venom auf Spielern auf. Bei 9 Stapeln stirbt der Spieler; Ravenous Feast dient gezielt zum Abbauen von Stapeln.',
    firstPull:['Eigene Eternal-Venom-Stapel permanent beobachten.','Ravenous Feast nur nach Plan zum Abbauen nutzen.','Caustic Deluge sauber ausweichen.','Spawns of Vexhul schnell kontrollieren.'],
    phases:[['Wiederholender Zyklus','Beide Fangs rotieren Fähigkeiten bis 100 Energie.'],['100 Energie','Vile Flood und Sanguine Storm erhöhen Raum- und Raid-Druck.']],
    abilities:[['Eternal Venom','Persönlicher Stapel; 9 Anwendungen töten den Spieler.'],['Ravenous Feast','Gruppen-Soak, der bis zu 3 Stapel entfernt.'],['Caustic Deluge','Globules erhöhen bei Kontakt Eternal Venom.'],['Venomous Emergence','Beschwört Spawns of Vexhul.'],['Corrosive Spit','Adds greifen Spieler wiederholt an.'],['Stone Breaker','Ithraz bedroht die Plattform.'],['Vile Flood','Vexhuls 100-Energie-Fähigkeit.'],['Sanguine Storm','Ithraz’ 100-Energie-Fähigkeit.']],
    roles:{tank:['Bosse mit genügend Abstand zum zentralen Soak-Bereich positionieren.','Tankmechaniken mit den eigenen Eternal-Venom-Stapeln abstimmen.'],healer:['Hohe Stack-Spieler und geplante Feast-Gruppen im Blick behalten.','100-Energie-Überlappungen mit Raid-CDs absichern.'],dps:['Stacks nicht erst bei 8 beachten.','Adds priorisieren.','Ravenous Feast nur entsprechend der festgelegten Stack-Gruppen betreten.']},
    difficulty:{heroic:'Stack- und Raumfehler werden deutlich schwerer zu kompensieren.',mythic:'Feste Soakgruppen und ein klarer Eternal-Venom-Plan sind praktisch Pflicht.'},
    arena:{boss:[34,38],boss2:[66,38],tank:[50,24],melee:[50,49],ranged:[50,79],danger:[50,62],label:'Ravenous Feast',path:[[50,82],[50,72],[50,62],[50,51]]},
    positioning:['Bosse links/rechts oberhalb der Mitte spielen; zentralen Soak-Bereich freihalten.','Ranged unten mittig, damit beide Bosse und Adds erreichbar sind.','Feast-Soaker laufen auf einer klaren zentralen Linie hinein und danach wieder heraus.','Caustic-Deluge-Flächen nach außen ablegen, nicht in den Soak-Korridor.'],
    sources:[['Wowhead',wowhead('twin-fangs')],['Warcraft Logs',warcraftLogs]]
  },
  {
    id:'coiled-altar',order:7,name:'The Coiled Altar',room:'The Coiled Altar',type:'3 Phasen',
    summary:'Phase 1 gegen Zul’jan, Phase 2 gegen Hex Lord Malacrass; im Finale werden Raumkontrolle, Seelenmechanik und Tankpositionierung zusammengeführt.',
    firstPull:['Coalesced Venom kontrolliert und geplant beseitigen.','Tankhits gezielt zum Bereinigen von Raumobjekten nutzen.','Heil-CDs über drei Phasen verteilen.','Finalphase als eigentlichen Ausführungscheck behandeln.'],
    phases:[['Phase 1','Zul’jan: Fangs of the Crucible, Toxic Deluge und Coalesced Venom.'],['Phase 2','Malacrass übernimmt mit Schatten-/Seelenmechaniken.'],['Finale','Beide Gegner werden über die Seelenmechanik gemeinsam relevant.']],
    abilities:[['Fangs of the Crucible','Hoher Raid-Schaden und verstärkte Nahkampfangriffe.'],['Twinfang Toxin','Verstärkter Tanktreffer.'],['Noxious Ground','Giftflächen aus Schlangenstatuen.'],['Toxic Deluge','Erzeugt Coalesced Venom.'],['Coalesced Venom','Giftglobule; beim Zerstören entsteht Venom Rupture.'],['Venom Rupture','Raid-DoT nach dem Zerstören einer Globule.'],['Sever','Tankmechanik, die Raumobjekte zerstören kann.'],['Soul Sever','Spätere Tankmechanik mit Add-/Seeleninteraktion.'],['Corrupted Toxin','Stapelnder Tankdruck.']],
    roles:{tank:['Boss auf einer sauberen Raumkante beginnen und kontrolliert rotieren.','Sever/Soul Sever zum gezielten Bereinigen verwenden.','Nicht ungeplant mehrere Venom-Objekte gleichzeitig auslösen.'],healer:['Fangs/Defilement als große Raidfenster behandeln.','Venom Ruptures nicht unkontrolliert stapeln lassen.'],dps:['Coalesced Venom nur nach Plan zerstören.','Phasen-Burst abstimmen.','Im Finale Zielverteilung und Raumroute beibehalten.']},
    difficulty:{heroic:'Globule- und Raummanagement wird strenger.',mythic:'Raumobjekte, Tankhits und finale Zielkontrolle müssen exakt ineinandergreifen.'},
    arena:{boss:[50,34],tank:[50,23],melee:[50,45],ranged:[66,77],danger:[25,62],label:'Coalesced Venom',path:[[68,78],[62,65],[55,53],[48,43],[40,35]]},
    positioning:['Mit einem sauberen Arena-Sektor starten und im Uhrzeigersinn/gegen Uhrzeigersinn kontrolliert weiterziehen.','Coalesced Venom nach außen legen, damit die Mitte als Ausweich-/Übergangsraum erhalten bleibt.','Ranged folgen der Rotation versetzt hinter der Melee-Gruppe.','Tank nutzt Sever/Soul Sever nur auf markierte Raumobjekte.'],
    sources:[['Wowhead',wowhead('coiled-altar')],['Warcraft Logs',warcraftLogs]]
  },
  {
    id:'ulatek',order:8,name:"Ula'tek",room:"Ula'tek's Prison",type:'3 Phasen + Intermission',
    summary:'Endboss mit Area-Denial, Eiern/Adds und zunehmend zerstörter Arena. Der sichere Raum ist eine Ressource: schlechte Ablagen oder ungeplante Hatchings rächen sich später.',
    firstPull:['Caustic Waves so spielen, dass Eier nicht unnötig ausbrüten.','Adds nach Priorität töten – kein Padding auf Kosten von Raum.','Spectral Coils gemeinsam korrekt soaken.','Im Finale sichere Flächen gegen Demolish maximal lange erhalten.'],
    phases:[['Phase 1','Caustic Waves, Eier/Spawn, Spectral Coils.'],['Übergang','Rage of the Shackled öffnet das Venomous Heart als Schadensfenster.'],['Intermission','Doomscale Wardens und Eier kontrollieren.'],['Finale','Call of the Serpent + Demolish reduzieren verbleibenden sicheren Raum.']],
    abilities:[['Caustic Waves','Venomwellen verändern sichere Flächen und können Eier ausbrüten.'],["Devourer's Spawn",'Eier, die bei Venomkontakt gefährliche Adds hervorbringen.'],['Putrid Membrane','Raidweiter anhaltender Effekt nach vollständigem Ausbrüten.'],['Spectral Coils','Soak-/Einschlagmechanik.'],['Rage of the Shackled','Großer Übergang mit starkem Raid-Schaden.'],['Venomous Heart','Temporäres Schadensfenster.'],['Call of the Serpent','Bringt weitere Adds in späteren Phasen.'],['Demolish','Zerstört im Finale sichere Arenabereiche.'],['Poisonous Bite','Heroisch: stapelnder Gift-DoT der Birthlings.'],['Hardened','Mythisch: Eier absorbieren zunächst Schaden und können nicht bewegt werden.'],['Noxious Shell','Mythisch: Träger brauchen Abstand zueinander.']],
    roles:{tank:['Boss und Adds immer so führen, dass die nächste sichere Fläche erhalten bleibt.','Adds sofort aufnehmen und von wichtigen Eiern wegziehen.','Finale Bossposition mit der Demolish-Reihenfolge planen.'],healer:['Putrid-Membrane-Stapel möglichst gering halten.','Rage of the Shackled und späte Raumknappheit mit festen Raid-CDs abdecken.','Poisonous Bite/Noxious-Shell-Fehler schnell erkennen.'],dps:['Eier/Adds nach Priorität statt DPS-Meter spielen.','Venomkontakt mit Eiern nur geplant zulassen.','Venomous Heart als Burstfenster nutzen.','Im Finale immer der vorgesehenen Raumrotation folgen.']},
    difficulty:{heroic:'Venomous Birthlings erhalten Poisonous Bite; ungeplante Hatchings erhöhen den Heilbedarf dauerhaft.',mythic:'Hardened und Noxious Shell machen Eierbewegung und persönliche Abstände zu festen Assignments.'},
    arena:{boss:[50,26],tank:[50,16],melee:[50,37],ranged:[50,74],danger:[50,54],label:'Venom / Eier',path:[[50,82],[65,70],[72,55],[68,40],[55,30]]},
    positioning:['Start möglichst weit oben, damit später viel sauberer Raum übrig bleibt.','Caustic Waves und Hatchings nach außen/entlang einer festen Rotationsrichtung spielen.','Ranged zentral genug für Adds, aber nicht auf zukünftigen Demolish-Flächen stapeln.','Im Finale gemeinsam entlang der letzten sicheren Arenakante rotieren – keine individuellen Abkürzungen.'],
    sources:[['Blizzard',blizzard],['Wowhead',wowhead('ulatek')],['Warcraft Logs',warcraftLogs]]
  }
];

const roles={tank:['Tank',Shield],healer:['Heiler',HeartPulse],dps:['DPS',Sword]};

function Ability({item}){
  const [name,note]=item;
  return <div className="ability" title={`Deutsch: Live-Lokalisierung noch nicht final verifiziert\n${note}`}><div><strong>{name}</strong><span className="lang">BOSS-FÄHIGKEIT</span></div><p>{note}</p></div>;
}

function Arena({data}){
  const point=(xy,cls,text)=>xy?<div className={`arena-point ${cls}`} style={{left:`${xy[0]}%`,top:`${xy[1]}%`}}><span>{text}</span></div>:null;
  const path=data.path||[];
  return <div className="arena">
    <div className="arena-ring"/><div className="arena-gridlines"/>
    <div className="arena-danger" style={{left:`${data.danger[0]}%`,top:`${data.danger[1]}%`}}><span>{data.label}</span></div>
    {path.slice(0,-1).map((p,i)=>{const n=path[i+1],dx=n[0]-p[0],dy=n[1]-p[1],len=Math.hypot(dx,dy),angle=Math.atan2(dy,dx)*180/Math.PI;return <span key={i} className="route-line" style={{left:`${p[0]}%`,top:`${p[1]}%`,width:`${len}%`,transform:`rotate(${angle}deg)`}}/>})}
    {path.map((p,i)=><span key={`p${i}`} className="route-dot" style={{left:`${p[0]}%`,top:`${p[1]}%`}}>{i+1}</span>)}
    {point(data.boss,'boss','Boss')}{point(data.boss2,'boss second','Boss 2')}{point(data.boss3,'boss third','Boss 3')}{point(data.tank,'tank','T')}{point(data.melee,'melee','M')}{point(data.ranged,'ranged','R')}
  </div>;
}

function QAStatus(){return <section className="qa-strip">
  <div><span className="online-dot"/><strong>Daten online</strong><small>Aktualisiert {updated}</small></div>
  <div><CheckCircle2 size={16}/><strong>Blizzard / Wowhead</strong><small>Primärcheck aktiv</small></div>
  <div><Radar size={16}/><strong>Warcraft Logs</strong><small>Live-Raid verfügbar</small></div>
  <div className="pending"><Clock3 size={16}/><strong>Mythic Trap</strong><small>Venomous Abyss noch nicht veröffentlicht</small></div>
</section>}

function App(){
  const [selected,setSelected]=useState('nekzali');
  const [difficulty,setDifficulty]=useState('heroic');
  const [role,setRole]=useState('dps');
  const boss=useMemo(()=>bosses.find(b=>b.id===selected),[selected]);
  const [roleLabel,RoleIcon]=roles[role];
  return <div className="app">
    <header className="topbar"><div><span className="eyebrow">MIDNIGHT · PATCH 12.1</span><h1>The Venomous Abyss</h1><p>Raidguide für den ersten Pull. Ein schnelles und kurzes Nachschlagewerk für Raider.</p></div><div className="status"><span className="online-dot"/> Online · aktualisiert {updated}</div></header>
    <QAStatus/>
    <div className="layout">
      <aside className="sidebar"><div className="side-title">Bosse</div>{bosses.map(b=><button key={b.id} className={selected===b.id?'boss-btn active':'boss-btn'} onClick={()=>setSelected(b.id)}><span>{b.order}</span><div><strong>{b.name}</strong><small>{b.type}</small></div></button>)}</aside>
      <main className="content">
        <section className="hero"><div><div className="crumb">Boss {boss.order} / 8 · {boss.room}</div><h2>{boss.name}</h2><p className="boss-summary">{boss.summary}</p></div><div className="controls"><div className="segmented"><button className={difficulty==='heroic'?'active':''} onClick={()=>setDifficulty('heroic')}>Heroisch</button><button className={difficulty==='mythic'?'active':''} onClick={()=>setDifficulty('mythic')}>Mythisch</button></div></div></section>
        <div className="grid two">
          <section className="card pull-card"><h3><BookOpen/> Vor dem Pull wichtig:</h3><ol className="steps">{boss.firstPull.map((x,i)=><li key={x}><span>{i+1}</span>{x}</li>)}</ol></section>
          <section className="card flow-card"><h3><CircleDot/> Kampfablauf</h3><div className="timeline">{boss.phases.map(([p,t],i)=><div key={p}><span className="phase-index">{i+1}</span><strong>{p}</strong><p>{t}</p></div>)}</div></section>
        </div>
        <section className="card role-card"><div className="role-head"><h3><RoleIcon/> Deine Aufgabe: {roleLabel}</h3><div className="role-tabs">{Object.entries(roles).map(([key,[label,Icon]])=><button key={key} className={role===key?'active':''} onClick={()=>setRole(key)}><Icon size={16}/>{label}</button>)}</div></div><ul className="role-list">{boss.roles[role].map(x=><li key={x}>{x}</li>)}</ul></section>
        <section className="difficulty"><span>{difficulty==='heroic'?'Heroisch':'Mythisch'}</span><p>{boss.difficulty[difficulty]}</p></section>
        <section className="card"><h3>Fähigkeiten</h3><div className="abilities">{boss.abilities.map(x=><Ability key={x[0]} item={x}/>)}</div></section>
        <div className="grid two bottom-grid">
          <section className="card position-card"><h3><Map/> Raum & Positionierung</h3><p className="muted">Empfohlene schematische Raid-Aufstellung. T = Tank, M = Melee, R = Ranged. Nummern zeigen die grobe Bewegungs-/Rotationsrichtung.</p><Arena data={boss.arena}/><div className="position-notes">{boss.positioning.map((x,i)=><div key={x}><span>{i+1}</span><p>{x}</p></div>)}</div><p className="log-note">Warcraft Logs wird zur Plausibilitätsprüfung von Live-Pulls, Castfolgen und realen Strategien genutzt; die Grafik kopiert bewusst keinen einzelnen Gilden-Pull als universelle Wahrheit.</p></section>
          <section className="card sources"><h3>Quellen & QA</h3><p className="muted">Primärdaten werden mit aktuellen Raidquellen gegengeprüft. Mythic Trap wird zweimal geprüft, sobald deren Venomous-Abyss-Guides öffentlich verfügbar sind.</p>{boss.sources.map(([name,url])=><a href={url} key={url} target="_blank" rel="noreferrer"><ExternalLink size={15}/>{name}</a>)}<a href={mythicTrap} target="_blank" rel="noreferrer" className="pending-source"><Clock3 size={15}/>Mythic Trap · ausstehend</a></section>
        </div>
      </main>
    </div>
  </div>;
}
createRoot(document.getElementById('root')).render(<App/>);
