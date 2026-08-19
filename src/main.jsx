import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Shield, Sword, HeartPulse, ExternalLink, Info, Skull, Sparkles } from 'lucide-react';
import './styles.css';

const bosses = [
  {
    id: 'nekzali',
    name: "Nek'zali the Soulcoiler",
    order: 1,
    room: 'The Soulcoil Well',
    summary: 'Zwei Phasen plus Intermission. Der Soulcoil Well in der Mitte ist die zentrale Gefahrenzone: Spieler und Adds dürfen ihn nicht erreichen.',
    mechanics: [
      { en: 'Soulcoil Well', de: 'Soulcoil-Brunnen', note: 'Zentraler Raumanker. Nicht darin sterben und Adds niemals hineinlaufen lassen.' },
      { en: 'Soulcoil Rite', de: 'Seelenwindungsritual', note: 'Treibt die Kernmechanik rund um den Brunnen an.' },
      { en: 'Ritual of Awakening', de: 'Ritual des Erwachens', note: 'Intermission bei 50 %. Echoes of Jawae beseitigen, um die Phase zu beenden.' },
      { en: 'Uncoiling', de: 'Entwindung', note: 'Finale Phase mit dauerhaft steigendem Druck.' }
    ],
    roles: {
      tank: ['Boss und Adds so führen, dass nichts den Soulcoil Well erreicht.', 'Defensives für die Eskalation in Uncoiling aufheben.'],
      healer: ['Spieler außerhalb des Brunnens stabilisieren; Tode im Zentrum sind besonders gefährlich.', 'Heil-CDs für Uncoiling staffeln.'],
      dps: ['Adds priorisieren, bevor sie den Brunnen erreichen.', 'In der Intermission Echoes of Jawae schnell fokussieren.']
    },
    difficulties: {
      heroic: 'Mehr Druck auf Fehlervermeidung und saubere Add-Kontrolle.',
      mythic: 'Mythisch verschärft die Ritual-/Seelenmechaniken; Positionierung und Zielpriorität müssen vorab feststehen.'
    },
    sources: [
      ['Blizzard', 'https://worldofwarcraft.blizzard.com/en-gb/news/24294062/curse-of-ulatek-the-venomous-abyss-raid-goes-live-19-august'],
      ['Wowhead', 'https://www.wowhead.com/guide/midnight/raids/venomous-abyss-nekzali-the-soulcoiler-boss-strategy-abilities']
    ]
  },
  {
    id: 'sentinels',
    name: 'Entombed Sentinels',
    order: 2,
    room: 'Halls of the Malignant',
    summary: 'Zwei-Boss-Encounter. Der Raid wird geteilt; beide Sentinels müssen weit voneinander stehen, sonst reduzieren sie erlittenen Schaden massiv.',
    mechanics: [
      { en: 'Entombed Sentinels', de: 'Bestattete Wächter', note: 'Zwei Ziele mit getrennten Mechanikpaketen.' },
      { en: 'Intermission', de: 'Zwischenphase', note: 'Startet bei voller Energie und verändert den Ablauf beider Gruppen.' }
    ],
    roles: {
      tank: ['Sentinels mindestens etwa 40 Meter trennen.', 'Eigene Gruppe konsequent auf der vorgesehenen Raumseite halten.'],
      healer: ['Je eine stabile Heilerverteilung pro Gruppe.', 'Raid-CDs für die Intermission koordinieren.'],
      dps: ['Zielzuweisung nicht eigenmächtig wechseln.', 'Mechaniken der eigenen Sentinel-Seite sauber spielen.']
    },
    difficulties: { heroic: 'Fehler in der Gruppenteilung werden deutlich härter bestraft.', mythic: 'Mythisch verlangt feste Gruppen, exakte Positionen und abgestimmte Intermission-CDs.' },
    sources: [['Wowhead', 'https://www.wowhead.com/guide/midnight/raids/venomous-abyss-entombed-sentinels-boss-strategy-abilities']]
  },
  {
    id: 'lost-explorers',
    name: 'The Lost Explorers',
    order: 3,
    room: "Mor'zahi's Tomb",
    summary: "Drei-Ziel-Kampf. Mor'zahis Final Ascension muss durch das Füttern von Disgusting Fish an besessene Tortollaner verhindert werden.",
    mechanics: [
      { en: 'Final Ascension', de: 'Letzter Aufstieg', note: 'Darf nicht erfolgreich durchlaufen.' },
      { en: 'Disgusting Fish', de: 'Widerlicher Fisch', note: 'Begrenzte Ressource zum Unterbrechen des Encounter-Fortschritts.' }
    ],
    roles: {
      tank: ['Tankbare Ziele sauber auseinander bzw. nach Plan positionieren.', 'Bewegung so planen, dass Fisch-Träger freie Wege haben.'],
      healer: ['Auf verteilten Schaden durch mehrere aktive Ziele vorbereitet sein.', 'Fisch-Träger während Laufwegen absichern.'],
      dps: ['Fisch-Zuweisungen strikt einhalten.', 'Besessene Tortollaner rechtzeitig töten, bevor die Ressourcen ausgehen.']
    },
    difficulties: { heroic: 'Weniger Spielraum bei Ressourcen- und Zielmanagement.', mythic: 'Mythisch erfordert feste Fisch-Reihenfolge und klare Kill-Timings.' },
    sources: [['Wowhead', 'https://www.wowhead.com/guide/midnight/raids/venomous-abyss-lost-explorers-boss-strategy-abilities']]
  },
  {
    id: 'vashnik',
    name: 'Vashnik the Malignant',
    order: 4,
    room: 'The Chamber of Virulence',
    summary: 'Einphasen-Kampf mit drei Fountains: Blood, Shadow und Flame. Imbibe zieht Kraft aus zwei nahen Fountains und bestimmt die aktiven Venom-Kombinationen.',
    mechanics: [
      { en: 'Imbibe', de: 'Trinken', note: 'Vashnik nimmt die Kraft zweier naher Fountains auf.' },
      { en: 'Infusion', de: 'Infusion', note: 'Lang anhaltender Verstärkungs-/Mechanikzustand nach Imbibe.' }
    ],
    roles: {
      tank: ['Bossposition bestimmt, welche Fountains in Imbibe einfließen.', 'Positionswechsel früh und eindeutig ansagen.'],
      healer: ['Heilprofil an die aktive Fountain-Kombination anpassen.', 'CDs nicht unnötig vor einer schwierigen Imbibe-Kombination verbrauchen.'],
      dps: ['Positionierungsplan des Tanks respektieren.', 'Mechanikwechsel nach jedem Imbibe sofort erkennen.']
    },
    difficulties: { heroic: 'Kombinationen bestrafen falsche Positionierung stärker.', mythic: 'Mythisch sollte jede Fountain-Reihenfolge im Raidplan vorgegeben sein.' },
    sources: [['Wowhead', 'https://www.wowhead.com/guide/midnight/raids/venomous-abyss-vashnik-the-malignant-boss-strategy-abilities']]
  },
  {
    id: 'sszorak',
    name: 'Sszorak',
    order: 5,
    room: 'The Serpent Warren',
    summary: 'Einphasen-Kampf mit mehreren Push-/Knockback-Mechaniken. Während Dig In erhält Sszorak ein wichtiges Schadensfenster.',
    mechanics: [
      { en: 'Dig In', de: 'Eingraben', note: 'Etwa um Minute zwei; während des Casts besteht ein starkes Schadensfenster.' }
    ],
    roles: {
      tank: ['Boss so stellen, dass Knockbacks nicht in tödliche Raumkanten führen.', 'Position vor Dig In stabilisieren.'],
      healer: ['Knockback-Folgeschaden antizipieren.', 'Heil-CDs um Bewegungsphasen herum planen.'],
      dps: ['Burst für Dig In vorbereiten.', 'Knockbacks immer mit Blick auf sichere Landeflächen spielen.']
    },
    difficulties: { heroic: 'Bewegungsfehler kosten schnell Leben.', mythic: 'Mythisch macht Raumkontrolle und persönliche Bewegung zu festen Assignments.' },
    sources: [['Wowhead', 'https://www.wowhead.com/guide/midnight/raids/venomous-abyss-sszorak-boss-strategy-abilities']]
  },
  {
    id: 'twin-fangs',
    name: 'The Twin Fangs',
    order: 6,
    room: 'Pit of Fangs',
    summary: 'Zwei-Ziel-Kampf. Eternal Venom stapelt sich auf Spielern; bei neun Stapeln stirbt der Spieler. Ravenous Feast kann bis zu drei Stapel entfernen.',
    mechanics: [
      { en: 'Eternal Venom', de: 'Ewiges Gift', note: 'Persönliche Stapel überwachen; neun Stapel sind tödlich.' },
      { en: 'Ravenous Feast', de: 'Gefräßiges Festmahl', note: 'Großer Gruppen-Soak, der Giftstapel abbauen kann.' },
      { en: 'Caustic Deluge', de: 'Ätzende Sintflut', note: 'Globules vermeiden, da sie Eternal Venom erhöhen.' },
      { en: 'Venomous Emergence', de: 'Giftiges Hervorbrechen', note: 'Beschwört Adds, die kontrolliert werden müssen.' }
    ],
    roles: {
      tank: ['Beide Fangs kontrolliert positionieren und Raum für Soaks lassen.', 'Tankmechaniken mit Giftstapeln abstimmen.'],
      healer: ['Spieler mit hohen Eternal-Venom-Stapeln besonders im Blick behalten.', 'Soak-Schaden von Ravenous Feast vorbereiten.'],
      dps: ['Eigene Giftstapel aktiv managen.', 'Ravenous Feast gezielt zum Abbauen nutzen und Adds schnell beseitigen.']
    },
    difficulties: { heroic: 'Stapelmanagement wird deutlich strenger.', mythic: 'Mythisch verlangt feste Soak-Gruppen und kaum Toleranz bei Giftfehlern.' },
    sources: [['Wowhead', 'https://www.wowhead.com/guide/midnight/raids/venomous-abyss-twin-fangs-boss-strategy-abilities']]
  },
  {
    id: 'coiled-altar',
    name: 'The Coiled Altar',
    order: 7,
    room: 'The Coiled Altar',
    summary: "Drei Phasen mit Zul'jan und Hex Lord Malacrass. Nach Zul'jan übernimmt Malacrass; im Finale werden beide Seelen verbunden und gemeinsam bekämpft.",
    mechanics: [
      { en: 'Axegrinder', de: 'Axtschleifer', note: "Zul'jans prägende Mechanik in Phase 1." },
      { en: 'Soul Link', de: 'Seelenverbindung', note: 'Finale Verbindung beider Gegner; Zielmanagement wird entscheidend.' }
    ],
    roles: {
      tank: ['Phasenwechsel vorbereiten und Bossübernahmen sauber koordinieren.', 'Im Finale beide Ziele nach Plan kontrollieren.'],
      healer: ['CDs über drei Phasen verteilen statt früh zu überziehen.', 'Finalphase als höchste Belastung behandeln.'],
      dps: ['Phasen-Burst sauber timen.', 'Im Finale Schadensverteilung nicht ohne Ansage verändern.']
    },
    difficulties: { heroic: 'Phasenübergänge verlangen deutlich sauberere Ausführung.', mythic: 'Mythisch wird vor allem die finale Ziel- und Raumkontrolle zum Progress-Check.' },
    sources: [['Wowhead', 'https://www.wowhead.com/guide/midnight/raids/venomous-abyss-coiled-altar-boss-strategy-abilities']]
  },
  {
    id: 'ulatek',
    name: "Ula'tek",
    order: 8,
    room: "The Tomb of Ula'tek",
    summary: 'Drei Phasen mit Intermission. Area-Denial, Adds und schrumpfender sicherer Raum dominieren den Kampf.',
    mechanics: [
      { en: 'Caustic Waves', de: 'Ätzende Wellen', note: 'Legt Venom-Flächen und verändert sichere Bereiche.' },
      { en: 'Circling Prey', de: 'Kreisende Beute', note: 'Raumkontroll-Mechanik; sichere Laufwege freihalten.' },
      { en: 'Spectral Coils', de: 'Spektrale Windungen', note: 'Zerstört bzw. verändert Teile des verfügbaren Raums.' },
      { en: 'Rage of the Shackled', de: 'Zorn der Gefesselten', note: 'Leitet den großen Übergang in die Zwischenphase ein.' },
      { en: 'Call of the Serpent', de: 'Ruf der Schlange', note: 'Bringt weitere Gegner in die finale Phase.' },
      { en: 'Demolish', de: 'Zerschmettern', note: 'Entfernt im Finale weitere sichere Flächen.' }
    ],
    roles: {
      tank: ['Boss und Adds so führen, dass sichere Flächen für den Raid erhalten bleiben.', 'Add-Aufnahmen vor den Übergängen klar verteilen.'],
      healer: ['Große Heil-CDs für Übergänge und schrumpfenden Raum staffeln.', 'Spieler in Area-Denial-Phasen früh stabilisieren.'],
      dps: ['Adds nach Priorität töten; falsches Padding kostet Raum.', 'Eigene Position permanent an Caustic Waves und Demolish anpassen.']
    },
    difficulties: { heroic: 'Die Raumökonomie wird zum Kern des Fights.', mythic: 'Mythisch verlangt feste Laufwege, Add-Prioritäten und Cooldown-Pläne pro Übergang.' },
    sources: [['Blizzard', 'https://worldofwarcraft.blizzard.com/en-gb/news/24294062/curse-of-ulatek-the-venomous-abyss-raid-goes-live-19-august'], ['Wowhead', 'https://www.wowhead.com/guide/midnight/raids/venomous-abyss-ulatek-boss-strategy-abilities']]
  }
];

const roleMeta = {
  tank: { label: 'Tank', icon: Shield },
  healer: { label: 'Heiler', icon: HeartPulse },
  dps: { label: 'DPS', icon: Sword }
};

function Ability({ ability }) {
  return (
    <div className="ability" title={`${ability.de}\n${ability.note}`}>
      <span className="ability-name">{ability.en}</span>
      <span className="ability-de">Mouseover: Deutsch</span>
      <p>{ability.note}</p>
    </div>
  );
}

function App() {
  const [selected, setSelected] = useState('nekzali');
  const [difficulty, setDifficulty] = useState('heroic');
  const [role, setRole] = useState('dps');
  const boss = useMemo(() => bosses.find(b => b.id === selected), [selected]);
  const RoleIcon = roleMeta[role].icon;

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <span className="eyebrow">MIDNIGHT · PATCH 12.1 · SEASON 2</span>
          <h1>The Venomous Abyss</h1>
          <p>Raid Guide für Progress, Vorbereitung und den ersten Pull.</p>
        </div>
        <div className="status"><Sparkles size={16}/> Live · 19.08.2026 EU</div>
      </header>

      <nav className="bossnav" aria-label="Bossauswahl">
        {bosses.map(b => (
          <button key={b.id} className={selected === b.id ? 'active' : ''} onClick={() => setSelected(b.id)}>
            <span>{String(b.order).padStart(2, '0')}</span>{b.name}
          </button>
        ))}
      </nav>

      <main>
        <section className="hero-card">
          <div className="hero-copy">
            <div className="kicker"><Skull size={16}/> Boss {boss.order} · {boss.room}</div>
            <h2>{boss.name}</h2>
            <p>{boss.summary}</p>
          </div>
          <div className="controls">
            <div className="segmented" aria-label="Schwierigkeit">
              {['heroic', 'mythic'].map(d => <button key={d} onClick={() => setDifficulty(d)} className={difficulty === d ? 'selected' : ''}>{d === 'heroic' ? 'Heroisch' : 'Mythisch'}</button>)}
            </div>
            <div className="segmented" aria-label="Rolle">
              {Object.entries(roleMeta).map(([key, meta]) => <button key={key} onClick={() => setRole(key)} className={role === key ? 'selected' : ''}>{meta.label}</button>)}
            </div>
          </div>
        </section>

        <section className="grid">
          <article className="panel wide">
            <div className="panel-title"><Info size={18}/><h3>Was du für diesen Pull wissen musst</h3></div>
            <div className="difficulty-callout"><strong>{difficulty === 'heroic' ? 'Heroisch' : 'Mythisch'}:</strong> {boss.difficulties[difficulty]}</div>
            <div className="role-card">
              <div className="role-heading"><RoleIcon size={20}/><strong>{roleMeta[role].label}</strong></div>
              <ul>{boss.roles[role].map((x, i) => <li key={i}>{x}</li>)}</ul>
            </div>
          </article>

          <article className="panel">
            <h3>Fähigkeiten</h3>
            <p className="muted">Englischer Name im Vordergrund. Mouseover zeigt deutschen Namen + Kurzinfo.</p>
            <div className="abilities">{boss.mechanics.map((a, i) => <Ability key={i} ability={a}/>)}</div>
          </article>

          <article className="panel room-panel">
            <h3>Raum & Positionierung</h3>
            <div className="room-diagram">
              <div className="arena-ring"><span>{boss.room}</span><div className="boss-dot">BOSS</div><div className="raid-dot">RAID</div></div>
            </div>
            <p className="muted">Die Grafik ist bewusst schematisch. Boss-spezifische Karten werden ergänzt, sobald belastbare Live-Layouts und Mechanikpositionen verifiziert sind.</p>
          </article>

          <article className="panel sources wide">
            <h3>Quellen & Verifikation</h3>
            <p className="muted">Guide-Inhalte werden gegen offizielle Blizzard-Daten und etablierte Raid-Quellen geprüft. Lokalisierte Spell-Namen werden nicht geraten.</p>
            <div className="source-links">{boss.sources.map(([label,url]) => <a key={url} href={url} target="_blank" rel="noreferrer">{label}<ExternalLink size={14}/></a>)}</div>
          </article>
        </section>
      </main>

      <footer>sobix-raidguide · schlicht im UI, streng bei Datenqualität</footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
