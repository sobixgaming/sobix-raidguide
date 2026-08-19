import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Shield, Sword, HeartPulse, ExternalLink, CheckCircle2, CircleDot, Map, BookOpen } from 'lucide-react';
import './styles.css';
import './visual-polish.css';

const warcraftLogs = 'https://www.warcraftlogs.com/zone/rankings/54';
const blizzard = 'https://worldofwarcraft.blizzard.com/en-gb/news/24294062/curse-of-ulatek-the-venomous-abyss-raid-goes-live-19-august';
const mythicTrap = 'https://www.mythictrap.com/en';
const wowhead = (slug) => `https://www.wowhead.com/guide/midnight/raids/venomous-abyss-${slug}-boss-strategy-abilities`;
const updated = '19.08.2026';

const baseRoles = {
  tank: ['Boss sauber positionieren und Tankmechaniken früh planen.'],
  healer: ['Schadensspitzen antizipieren und Heil-CDs nach Mechanikfenstern planen.'],
  dps: ['Mechanik vor Uptime spielen und Prioritätsziele konsequent fokussieren.']
};

const bosses = [
  {
    id:'nekzali', order:1, name:"Nek'zali the Soulcoiler", room:'Soulcoil Well', type:'2 Phasen + Intermission',
    summary:'Der zentrale Soulcoil Well bestimmt den Kampf. Adds und Spieler-Tode in seiner Nähe verschärfen das Ritual; bei 50 % folgt eine Intermission, danach eskaliert der Raidschaden.',
    firstPull:['Brunnen in der Mitte konsequent freihalten.','Restless Amani sofort stoppen und vom Brunnen weg töten.','Bei 50 % Echoes of Jawae fokussieren.','Defensive und Heil-CDs für Uncoiling aufheben.'],
    phases:[['Phase 1','Soulcoil Well kontrollieren und Adds stoppen.'],['50 % Intermission','Ritual of Awakening: Echoes of Jawae töten.'],['Phase 2','Uncoiling: steigender Raidschaden bis zum Kill.']],
    abilities:[['Soulcoil Well','Zentrale Gefahrenzone.'],['Soulcoil Rite','Raid-Schaden und Energiegewinn, wenn der Brunnen gespeist wird.'],['Restless Amani','Adds auf dem Weg zum Brunnen.'],['Ritual of Awakening','Intermission bei 50 %.'],['Uncoiling','Finale Phase mit steigendem Druck.'],['Ritual Burn','Heroisch/Mythisch: wiederholte Treffer werden gefährlicher.']],
    roles:{tank:['Boss und Adds vom Brunnen weg halten.','Add-Wege niemals durch die Mitte führen.'],healer:['Tode in Brunnennähe verhindern.','CDs für Intermission und Uncoiling staffeln.'],dps:['Adds vor Boss-DPS priorisieren, wenn sie den Brunnen bedrohen.','Echoes sofort fokussieren.']},
    difficulty:{heroic:'Ritual Burn verschärft wiederholte Soulcoil-Rite-Auslösungen.',mythic:'Feste Add-, Interrupt- und Positionszuweisungen sind entscheidend.'},
    arena:{boss:[50,24],tank:[50,15],melee:[50,34],ranged:[76,68],danger:[50,54],label:'Soulcoil Well',path:[[78,78],[72,64],[66,52],[62,40]]},
    positioning:['Tank/Boss oben halten; Mitte für den Brunnen frei lassen.','Melee hinter/seitlich am Boss.','Ranged/Heiler breit unten/rechts verteilen.','Adds seitlich abfangen.'],
    sources:[['Blizzard',blizzard],['Wowhead',wowhead('nekzali-the-soulcoiler')],['Warcraft Logs',warcraftLogs]]
  },
  {
    id:'sentinels', order:2, name:'Entombed Sentinels', room:'Sentinel Chamber', type:'2 Ziele + Intermission',
    summary:'Breath of Ula’tek und Blood of Ula’tek müssen getrennt werden. Zu dicht beieinander erhalten sie Ula’tek’s Dominance und nehmen 99 % weniger Schaden.',
    firstPull:['Raid in zwei feste Gruppen teilen.','Sentinels deutlich voneinander trennen.','Eigene Seite halten.','Helical Toxins nach Gruppenplan zusammenführen.'],
    phases:[['Geteilte Phase','Zwei Gruppen spielen getrennte Mechanikpakete.'],['100 Energie','Vitriolic Stasis: Bosse kommen zusammen und verteilen Helical Toxins.']],
    abilities:[["Ula'tek's Dominance",'Nahe Sentinels erleiden 99 % weniger Schaden.'],['Venom Coagulation','Erzeugt einen gefährlichen Slime.'],['Contaminate','Hoher wiederkehrender Raid-Schaden.'],['Blighted Blood','Dispellbarer Debuff.'],['Vitriolic Stasis','Intermission bei 100 Energie.'],['Helical Toxins','Anwendungen nach festem Plan kombinieren.']],
    roles:{tank:['Je einen Sentinel an einer Außenkante halten.','Nur zur Stasis zusammenführen.'],healer:['Heiler fest auf beide Gruppen verteilen.','Blighted Blood gezielt dispellen.'],dps:['Eigene Seite halten.','Venom Coagulation sofort priorisieren.']},
    difficulty:{heroic:'Zusätzliche Venom-Effekte erhöhen Raum- und Bewegungsdruck.',mythic:'Protovenom-Interaktionen verlangen feste Paarungen.'},
    arena:{boss:[24,34],boss2:[76,34],tank:[15,34],melee:[35,36],ranged:[50,76],danger:[50,50],label:'Mitte nur für Stasis',path:[[30,72],[42,58],[50,50],[58,58],[70,72]]},
    positioning:['Raid auf linke/rechte Arenahälfte teilen.','Bosse maximal weit auseinander halten.','Mitte für Stasis freihalten.','Nach Stasis sofort wieder auseinander.'],
    sources:[['Wowhead',wowhead('entombed-sentinels')],['Warcraft Logs',warcraftLogs]]
  },
  {
    id:'vashnik', order:3, name:'Vashnik the Malignant', room:'Chamber of Virulence', type:'Fountain-Rotation',
    summary:'Blood-, Shadow- und Flame-Fountains bestimmen das aktive Mechanikpaket. Die Bossposition vor 100 Energie entscheidet, welche zwei Fountains durch Imbibe genutzt werden.',
    firstPull:['Fountain-Reihenfolge vorher festlegen.','Boss früh in den nächsten Sektor bewegen.','Living Venoms vor der Mitte töten.','Imbibe als Raid-Schadenspeak behandeln.'],
    phases:[['Rotationszyklus','Boss bewegen → Imbibe → Living Venoms töten → nächste Position.']],
    abilities:[['Imbibe','Nutzt die zwei nächstgelegenen Fountains.'],['Infusion','Verstärkt das aktive Venom-Paket.'],['Living Venom','Add, das die Mitte nicht erreichen darf.'],['Malignant Burst','Fehlerfolge, wenn ein Venom die Mitte erreicht.']],
    roles:{tank:['Boss vor 100 Energie an den geplanten Sektor bewegen.'],healer:['CDs an Imbibe-Fenster koppeln.'],dps:['Living Venoms sofort priorisieren.']},
    difficulty:{heroic:'Mehr Überlappungen bestrafen schlechte Fountain-Rotationen.',mythic:'Fountain-Reihenfolge und Add-Zuweisungen vor Pull festlegen.'},
    arena:{boss:[50,48],tank:[50,39],melee:[50,58],ranged:[50,78],danger:[50,18],label:'Malignant Cavity',path:[[50,75],[36,62],[30,42],[44,30],[62,36],[70,52]]},
    positioning:['Arena in drei Fountain-Sektoren denken.','Boss vor 100 Energie umstellen.','Ranged zentral genug für Add-Wechsel halten.','Venoms zwischen Spawn und Mitte abfangen.'],
    sources:[['Wowhead',wowhead('vashnik-the-malignant')],['Warcraft Logs',warcraftLogs]]
  },
  {
    id:'lost-explorers', order:4, name:'The Lost Explorers', room:"Mor'zahi's Tomb", type:'3 Ziele / Ressourcenmechanik',
    summary:'Drei besessene Tortollaner werden von Mor’zahi kontrolliert. Disgusting Fish brechen seine Konzentration; jeder Explorer kann nur einmal gefüttert werden.',
    firstPull:['Fisch-Reihenfolge festlegen.','Explorer räumlich trennen.','Mighty Thud korrekt soaken.','Frost-/Feuer-Effekte kontrolliert spielen.'],
    phases:[['Besessenheitszyklus','Mor’zahi kontrolliert einen Explorer; Disgusting Fish bricht die Kontrolle.'],['Nach einem Kill','Verbleibende Explorer eskalieren.']],
    abilities:[['Dark Whispers','Mor’zahi übernimmt einen Explorer.'],['Disgusting Fish','Begrenzte Ressource zum Brechen der Kontrolle.'],['Blink Nova','Raid-Schaden, der mit Entfernung sinkt.'],['Mighty Thud','Mehrere Soak-Sprünge.'],['Aura of Unity','Heroisch/Mythisch: nahe Explorer erhalten hohe Schadensreduktion.']],
    roles:{tank:['Explorer in getrennten Sektoren halten.'],healer:['Soaks und Fisch-Träger absichern.'],dps:['Fisch- und Kill-Reihenfolge strikt einhalten.']},
    difficulty:{heroic:'Aura of Unity erzwingt saubere Bosspositionen.',mythic:'Zusätzliche Rauminteraktionen bestrafen unkontrollierte Bewegung.'},
    arena:{boss:[50,28],boss2:[27,58],boss3:[73,58],tank:[50,17],ranged:[50,84],danger:[50,59],label:'Fisch-/Kistenkorridor',path:[[50,82],[50,67],[42,54],[34,42],[50,30]]},
    positioning:['Explorer als Dreieck stellen.','Zentralen Korridor frei halten.','Ranged hinten mittig positionieren.','Knockbacks nicht in andere Bosssektoren legen.'],
    sources:[['Wowhead',wowhead('lost-explorers')],['Warcraft Logs',warcraftLogs]]
  },
  {
    id:'sszorak', order:5, name:'Sszorak', room:'Serpent Warren', type:'Knockbacks / Burstfenster',
    summary:'Bewegungsfight mit Push- und Knockback-Effekten. Dig In ist das wichtigste Schadensfenster; falsche Landepositionen sind der häufigste vermeidbare Fehler.',
    firstPull:['Vor jedem Knockback sichere Landefläche prüfen.','Viscous Cysts meiden.','Für Howling Maelstrom freie Gegenlaufwege halten.','CDs für Dig In vorbereiten.'],
    phases:[['Zyklus','Apex Predator → Venomous Surge → Knockbacks → Dig In.']],
    abilities:[['Venomous Surge','Erzeugt Globs und Viscous Cysts.'],['Viscous Cyst','Kontakt stößt Spieler weg.'],['Howling Maelstrom','Wind schiebt Spieler.'],['Dig In','Erhöhte Schadensaufnahme des Bosses.']],
    roles:{tank:['Boss mit Blick auf sichere Knockback-Zonen positionieren.'],healer:['Bewegungsphasen vorheilen.'],dps:['Offensive CDs für Dig In bündeln.']},
    difficulty:{heroic:'Mehr Raumgefahren machen falsche Landungen tödlicher.',mythic:'Persönliche Bewegungswege werden zu festen Assignments.'},
    arena:{boss:[50,44],tank:[50,34],melee:[50,54],ranged:[72,72],danger:[25,50],label:'Knockback-Zone',path:[[72,72],[62,62],[52,52],[42,42],[34,34]]},
    positioning:['Boss leicht versetzt zentral halten.','Raid mit dem Rücken zur geplanten sicheren Fläche.','Cysts nicht in Laufwege legen.','Vor Dig In Position stabilisieren.'],
    sources:[['Wowhead',wowhead('sszorak')],['Warcraft Logs',warcraftLogs]]
  },
  {
    id:'twin-fangs', order:6, name:'The Twin Fangs', room:'Pit of Fangs', type:'2 Ziele / Stack-Management',
    summary:'Vexhul und Ithraz bauen Eternal Venom auf Spielern auf. Bei 9 Stapeln stirbt der Spieler; Ravenous Feast kann Stapel entfernen.',
    firstPull:['Eternal-Venom-Stapel beobachten.','Ravenous Feast gezielt zum Abbauen nutzen.','Caustic Deluge meiden.','Adds schnell kontrollieren.'],
    phases:[['Zyklus','Bossfähigkeiten bis 100 Energie.'],['100 Energie','Vile Flood und Sanguine Storm erhöhen Raum- und Raid-Druck.']],
    abilities:[['Eternal Venom','Persönlicher Stapel; 9 Anwendungen sind tödlich.'],['Ravenous Feast','Soak zum Abbauen von Stapeln.'],['Caustic Deluge','Globules erhöhen Eternal Venom.'],['Venomous Emergence','Beschwört Adds.']],
    roles:{tank:['Bosse kontrolliert stellen und Soak-Raum freihalten.'],healer:['Hohe Stack-Spieler beobachten.'],dps:['Stacks aktiv managen und Adds priorisieren.']},
    difficulty:{heroic:'Stack- und Raumfehler werden schwerer zu kompensieren.',mythic:'Feste Soakgruppen und ein klarer Stack-Plan sind Pflicht.'},
    arena:{boss:[35,40],boss2:[65,40],tank:[50,26],melee:[50,50],ranged:[50,78],danger:[50,62],label:'Ravenous Feast',path:[[50,80],[50,68],[42,60],[50,52],[58,60]]},
    positioning:['Bosse links/rechts mit freier Mitte stellen.','Soak-Zone zentral vorbereiten.','Ranged breit im hinteren Drittel.','Adds von außen nach innen abfangen.'],
    sources:[['Wowhead',wowhead('twin-fangs')],['Warcraft Logs',warcraftLogs]]
  },
  {
    id:'coiled-altar', order:7, name:'The Coiled Altar', room:'The Coiled Altar', type:'3 Phasen',
    summary:'Phase 1 gegen Zul’jan, Phase 2 gegen Hex Lord Malacrass; im Finale werden beide über ihre Seelenmechanik gemeinsam relevant.',
    firstPull:['Coalesced Venom kontrolliert beseitigen.','Tankhits gezielt für Raumobjekte nutzen.','Heil-CDs über drei Phasen verteilen.','Finalphase als Hauptcheck behandeln.'],
    phases:[['Phase 1','Zul’jan und Giftmechaniken.'],['Phase 2','Malacrass und Seelenmechaniken.'],['Finale','Beide Gegner werden gemeinsam relevant.']],
    abilities:[['Fangs of the Crucible','Hoher Raid-Schaden.'],['Coalesced Venom','Giftglobule mit Folgewirkung.'],['Venom Rupture','Raid-DoT nach Globule-Zerstörung.'],['Sever','Tankmechanik zum Bereinigen von Raumobjekten.'],['Soul Sever','Spätere Tank-/Seelenmechanik.']],
    roles:{tank:['Sever/Soul Sever bewusst einsetzen.'],healer:['Raid-Schadensfenster über Phasen verteilen.'],dps:['Globules nicht planlos zerstören.']},
    difficulty:{heroic:'Globule-Management wird strenger.',mythic:'Raumobjekte, Tankhits und finale Zielkontrolle müssen exakt zusammenspielen.'},
    arena:{boss:[50,36],tank:[50,24],melee:[50,46],ranged:[50,78],danger:[26,62],label:'Coalesced Venom',path:[[50,78],[40,68],[30,60],[40,50],[50,42]]},
    positioning:['Boss im oberen Drittel halten.','Globules seitlich sammeln.','Ranged mittig/hinten.','Raum schrittweise und kontrolliert bereinigen.'],
    sources:[['Wowhead',wowhead('coiled-altar')],['Warcraft Logs',warcraftLogs]]
  },
  {
    id:'ulatek', order:8, name:"Ula'tek", room:"Ula'tek's Prison", type:'3 Phasen + Intermission',
    summary:'Endboss mit Area-Denial, Eiern/Adds und zunehmend zerstörter Arena. Venom-Kontakt kann Devourer’s Spawn ausbrüten und den Raid dauerhaft belasten.',
    firstPull:['Caustic Waves von Eiern fernhalten.','Adds nach Priorität töten.','Spectral Coils korrekt soaken.','Im Finale sicheren Raum gegen Demolish erhalten.'],
    phases:[['Phase 1','Caustic Waves, Eier und Spectral Coils.'],['Übergang','Rage of the Shackled und Venomous Heart.'],['Intermission','Adds und Eier kontrollieren.'],['Finale','Call of the Serpent + Demolish reduzieren sicheren Raum.']],
    abilities:[['Caustic Waves','Venomwellen verändern sichere Flächen.'],["Devourer's Spawn",'Eier, die gefährliche Adds hervorbringen.'],['Spectral Coils','Soak-Mechanik.'],['Rage of the Shackled','Großer Übergang.'],['Venomous Heart','Burstfenster.'],['Demolish','Zerstört sichere Arenabereiche.']],
    roles:{tank:['Boss/Adds mit Blick auf verbleibenden Raum führen.'],healer:['CDs für Übergänge und späte Raumknappheit staffeln.'],dps:['Adds/Eier nach Priorität spielen und Venomous Heart bursten.']},
    difficulty:{heroic:'Ungeplante Hatchings erhöhen den Heilbedarf dauerhaft.',mythic:'Eierbewegung und persönliche Abstände werden zu festen Assignments.'},
    arena:{boss:[50,28],tank:[50,18],melee:[50,38],ranged:[50,72],danger:[50,54],label:'Venom / Eier',path:[[50,78],[60,68],[68,54],[62,42],[52,34]]},
    positioning:['Boss im oberen Drittel halten.','Eier-/Venom-Flächen kontrolliert an Außenbereichen spielen.','Ranged im sicheren hinteren Segment.','Finale Raum sektorweise aufgeben.'],
    sources:[['Blizzard',blizzard],['Wowhead',wowhead('ulatek')],['Warcraft Logs',warcraftLogs]]
  }
];

const roles = { tank:['Tank',Shield], healer:['Heiler',HeartPulse], dps:['DPS',Sword] };
const safeArray = (value) => Array.isArray(value) ? value : [];

function Ability({item}) {
  const name = item?.[0] || 'Unbekannte Fähigkeit';
  const note = item?.[1] || '';
  return <div className="ability" title={`Deutsch: Live-Lokalisierung noch nicht final verifiziert\n${note}`}><div><strong>{name}</strong><span className="lang">BOSS-FÄHIGKEIT</span></div><p>{note}</p></div>;
}

function Arena({data={}}) {
  const point = (xy, cls, text) => Array.isArray(xy) ? <div className={`arena-point ${cls}`} style={{left:`${xy[0]}%`,top:`${xy[1]}%`}}><span>{text}</span></div> : null;
  const danger = Array.isArray(data.danger) ? data.danger : [50,50];
  const path = safeArray(data.path);
  return <div className="arena">
    <div className="arena-ring"/><div className="arena-gridlines"/>
    <div className="arena-danger" style={{left:`${danger[0]}%`,top:`${danger[1]}%`}}><span>{data.label || 'Mechanikzone'}</span></div>
    {path.slice(0,-1).map((p,i)=>{const n=path[i+1]; if(!Array.isArray(p)||!Array.isArray(n)) return null; const dx=n[0]-p[0],dy=n[1]-p[1],len=Math.hypot(dx,dy),angle=Math.atan2(dy,dx)*180/Math.PI; return <span key={`line-${i}`} className="route-line" style={{left:`${p[0]}%`,top:`${p[1]}%`,width:`${len}%`,transform:`rotate(${angle}deg)`}}/>;})}
    {path.map((p,i)=>Array.isArray(p)?<span key={`dot-${i}`} className="route-dot" style={{left:`${p[0]}%`,top:`${p[1]}%`}}>{i+1}</span>:null)}
    {point(data.boss,'boss','Boss')}{point(data.boss2,'boss second','Boss 2')}{point(data.boss3,'boss third','Boss 3')}{point(data.tank,'tank','T')}{point(data.melee,'melee','M')}{point(data.ranged,'ranged','R')}
  </div>;
}

function QAStatus(){return <section className="qa-strip">
  <div><span className="online-dot"/><strong>Daten online</strong><small>Aktualisiert {updated}</small></div>
  <div><CheckCircle2 size={16}/><strong>Blizzard / Wowhead</strong><small>Primärcheck aktiv</small></div>
  <div><CheckCircle2 size={16}/><strong>Warcraft Logs</strong><small>Live-Pulls zur Plausibilisierung</small></div>
  <div className="pending"><span className="online-dot"/><strong>Mythic Trap</strong><small>Venomous Abyss noch ausstehend</small></div>
</section>}

function App(){
  const [selected,setSelected]=useState('nekzali');
  const [difficulty,setDifficulty]=useState('heroic');
  const [role,setRole]=useState('dps');
  const boss=useMemo(()=>bosses.find(b=>b.id===selected) || bosses[0],[selected]);
  const [roleLabel,RoleIcon]=roles[role] || roles.dps;
  const roleItems=safeArray(boss.roles?.[role] || baseRoles[role]);
  return <div className="app">
    <header className="topbar"><div><span className="eyebrow">MIDNIGHT · PATCH 12.1</span><h1>The Venomous Abyss</h1><p>Raidguide für den ersten Pull. Ein schnelles und kurzes Nachschlagewerk für Raider.</p></div><div className="status"><span className="online-dot"/> Online · aktualisiert {updated}</div></header>
    <QAStatus/>
    <div className="layout">
      <aside className="sidebar"><div className="side-title">Bosse</div>{bosses.map(b=><button key={b.id} className={selected===b.id?'boss-btn active':'boss-btn'} onClick={()=>setSelected(b.id)}><span>{b.order}</span><div><strong>{b.name}</strong><small>{b.type}</small></div></button>)}</aside>
      <main className="content">
        <section className="hero"><div><div className="crumb">Boss {boss.order} / 8 · {boss.room}</div><h2>{boss.name}</h2><p className="boss-summary">{boss.summary}</p></div><div className="controls"><div className="segmented"><button className={difficulty==='heroic'?'active':''} onClick={()=>setDifficulty('heroic')}>Heroisch</button><button className={difficulty==='mythic'?'active':''} onClick={()=>setDifficulty('mythic')}>Mythisch</button></div></div></section>
        <div className="grid two">
          <section className="card pull-card"><h3><BookOpen/> Vor dem Pull wichtig:</h3><ol className="steps">{safeArray(boss.firstPull).map((x,i)=><li key={`${boss.id}-pull-${i}`}><span>{i+1}</span>{x}</li>)}</ol></section>
          <section className="card flow-card"><h3><CircleDot/> Kampfablauf</h3><div className="timeline">{safeArray(boss.phases).map(([p,t],i)=><div key={`${boss.id}-phase-${i}`}><span className="phase-index">{i+1}</span><strong>{p}</strong><p>{t}</p></div>)}</div></section>
        </div>
        <section className="card role-card"><div className="role-head"><h3><RoleIcon/> Deine Aufgabe: {roleLabel}</h3><div className="role-tabs">{Object.entries(roles).map(([key,[label,Icon]])=><button key={key} className={role===key?'active':''} onClick={()=>setRole(key)}><Icon size={16}/>{label}</button>)}</div></div><ul className="role-list">{roleItems.map((x,i)=><li key={`${boss.id}-${role}-${i}`}>{x}</li>)}</ul></section>
        <section className="difficulty"><span>{difficulty==='heroic'?'Heroisch':'Mythisch'}</span><p>{boss.difficulty?.[difficulty] || 'Keine zusätzliche Änderung dokumentiert.'}</p></section>
        <section className="card"><h3>Fähigkeiten</h3><div className="abilities">{safeArray(boss.abilities).map((x,i)=><Ability key={`${boss.id}-ability-${i}`} item={x}/>)}</div></section>
        <div className="grid two bottom-grid">
          <section className="card position-card"><h3><Map/> Raum & Positionierung</h3><p className="muted">Schematische Raid-Aufstellung. T = Tank, M = Melee, R = Ranged.</p><Arena data={boss.arena}/><div className="position-notes">{safeArray(boss.positioning).map((x,i)=><div key={`${boss.id}-pos-${i}`}><span>{i+1}</span><p>{x}</p></div>)}</div><p className="log-note">Warcraft Logs dient als Plausibilitätsprüfung für Castfolgen und reale Pulls; die Grafik ist bewusst kein 1:1-Klon einer einzelnen Gildenstrategie.</p></section>
          <section className="card sources"><h3>Quellen & QA</h3><p className="muted">Blizzard/Wowhead plus Warcraft Logs werden gegengeprüft. Mythic Trap wird zweimal geprüft, sobald Venomous-Abyss-Guides öffentlich verfügbar sind.</p>{safeArray(boss.sources).map(([name,url],i)=><a href={url} key={`${boss.id}-source-${i}`} target="_blank" rel="noreferrer"><ExternalLink size={15}/>{name}</a>)}<a href={mythicTrap} target="_blank" rel="noreferrer" className="pending-source"><ExternalLink size={15}/>Mythic Trap · ausstehend</a></section>
        </div>
      </main>
    </div>
  </div>;
}

createRoot(document.getElementById('root')).render(<App/>);
