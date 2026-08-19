const BLIZZARD_RAID = 'https://worldofwarcraft.blizzard.com/de-de/news/24294062/fluch-von-ulatek-der-giftige-abgrund-schlachtzug-geht-am-19-august-live';
const MYTHIC_TRAP = 'https://www.mythictrap.com/';
const WARCRAFT_LOGS = 'https://www.warcraftlogs.com/zone/rankings/54';
const WOWHEAD_RAID_MAPS = 'https://www.wowhead.com/news/updated-raid-maps-for-the-venomous-abyss-on-patch-12-1-ptr-382066';

const bossSources = {
  "Nek'zali the Soulcoiler": {
    image: 'https://wow.zamimg.com/images/wow/journal/ui-ej-boss-priestess.png',
    wowhead: 'https://www.wowhead.com/ptr/guide/midnight/raids/venomous-abyss-nekzali-the-soulcoiler-boss-strategy-abilities'
  },
  'Entombed Sentinels': {
    image: 'https://wow.zamimg.com/images/wow/journal/ui-ej-boss-golems.png',
    wowhead: 'https://www.wowhead.com/ptr/guide/midnight/raids/venomous-abyss-entombed-sentinels-boss-strategy-abilities'
  },
  'Vashnik the Malignant': {
    image: 'https://wow.zamimg.com/images/wow/journal/ui-ej-boss-alchemist.png',
    wowhead: 'https://www.wowhead.com/ptr/guide/midnight/raids/venomous-abyss-vashnik-the-malignant-boss-strategy-abilities'
  },
  'The Lost Explorers': {
    image: 'https://wow.zamimg.com/images/wow/journal/ui-ej-boss-tortollans.png',
    wowhead: 'https://www.wowhead.com/ptr/guide/midnight/raids/venomous-abyss-lost-explorers-boss-strategy-abilities'
  },
  'Sszorak': {
    image: 'https://wow.zamimg.com/images/wow/journal/ui-ej-boss-brute.png',
    wowhead: 'https://www.wowhead.com/ptr/guide/midnight/raids/venomous-abyss-sszorak-boss-strategy-abilities'
  },
  'The Twin Fangs': {
    image: 'https://wow.zamimg.com/images/wow/journal/ui-ej-boss-twins.png',
    wowhead: 'https://www.wowhead.com/ptr/guide/midnight/raids/venomous-abyss-twin-fangs-boss-strategy-abilities'
  },
  'The Coiled Altar': {
    image: 'https://wow.zamimg.com/images/wow/journal/ui-ej-boss-zuljanmalacrass.png',
    wowhead: 'https://www.wowhead.com/ptr/guide/midnight/raids/venomous-abyss-coiled-altar-boss-strategy-abilities'
  },
  "Ula'tek": {
    image: 'https://wow.zamimg.com/images/wow/journal/ui-ej-boss-ulatek.png',
    wowhead: 'https://www.wowhead.com/ptr/guide/midnight/raids/venomous-abyss-ulatek-boss-strategy-abilities'
  }
};

function initials(name = '') {
  return name.replace(/^The\s+/i, '').split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase();
}

function ensurePortrait(heroCopy, bossName) {
  let portrait = heroCopy.querySelector('.elite-portrait');
  if (!portrait) {
    portrait = document.createElement('a');
    portrait.className = 'elite-portrait';
    portrait.href = BLIZZARD_RAID;
    portrait.target = '_blank';
    portrait.rel = 'noreferrer';
    portrait.innerHTML = `
      <span class="elite-crown">◆</span>
      <span class="portrait-inner"><span class="portrait-skull">☠</span><b></b></span>
      <small>Offizieller Boss-Eintrag</small>
    `;
    heroCopy.prepend(portrait);
  }
  const badge = portrait.querySelector('b');
  if (badge) badge.textContent = initials(bossName);
  portrait.setAttribute('aria-label', `${bossName} – offizielle Raidseite`);
}

function ensureSourceLink(container, href, label) {
  if (!container || container.querySelector(`a[href="${href}"]`)) return;
  const link = document.createElement('a');
  link.href = href;
  link.target = '_blank';
  link.rel = 'noreferrer';
  link.innerHTML = `↗ ${label}`;
  container.append(link);
}

function buildTrustedPositioning(roomCard, bossName) {
  const source = bossSources[bossName];
  if (!source) return;

  roomCard.classList.add('arena-card', 'trusted-positioning');
  roomCard.querySelector('.arena')?.remove();
  roomCard.querySelector('.position-notes')?.remove();
  roomCard.querySelector('.log-note')?.remove();
  roomCard.querySelector('.arena-hint')?.remove();
  roomCard.querySelector('.wcl-badge')?.remove();

  const oldMuted = roomCard.querySelector('.muted');
  if (oldMuted) oldMuted.remove();

  let panel = roomCard.querySelector('.position-source-panel');
  if (!panel) {
    panel = document.createElement('div');
    panel.className = 'position-source-panel';
    roomCard.append(panel);
  }

  panel.innerHTML = `
    <a class="position-boss-visual" href="${source.wowhead}" target="_blank" rel="noreferrer">
      <img src="${source.image}" alt="${bossName} – Wowhead Dungeon Journal" loading="lazy" />
      <span><strong>${bossName}</strong><small>Original Dungeon-Journal-Bild · Wowhead</small></span>
    </a>
    <div class="position-source-copy">
      <strong>Positionierung wird nur noch aus echten Quellen übernommen.</strong>
      <p>Keine selbstgezeichnete Arena und keine geratenen Marker mehr. Für Laufwege, Bosspositionen und reale Raidaufstellungen werden Warcraft-Logs-Pulls beziehungsweise Replays genutzt; Wowhead dient als zweiter Mechanik- und Raumabgleich.</p>
    </div>
    <div class="position-actions">
      <a href="${WARCRAFT_LOGS}" target="_blank" rel="noreferrer">Warcraft Logs · The Venomous Abyss</a>
      <a href="${source.wowhead}" target="_blank" rel="noreferrer">Wowhead · ${bossName}</a>
      <a href="${WOWHEAD_RAID_MAPS}" target="_blank" rel="noreferrer">Wowhead · echte Raidkarten</a>
    </div>
    <p class="position-source-note">Hinweis: Eine konkrete Aufstellung wird erst übernommen, wenn sie sich in realen Logs/Replays als belastbar zeigt. Einzelne Gildenstrategien werden nicht als allgemeingültig ausgegeben.</p>
  `;
}

function decorate() {
  const topCopy = document.querySelector('.topbar > div:first-child');
  if (topCopy) {
    const p = topCopy.querySelector('p');
    if (p) p.textContent = 'Raidguide für den ersten Pull. Ein schnelles und kurzes Nachschlagewerk für Raider.';
  }

  const status = document.querySelector('.status, .live-status');
  if (status) {
    status.className = 'live-status';
    status.innerHTML = `
      <span class="live-lamp" aria-hidden="true"></span>
      <span class="live-copy"><strong>Daten online</strong><small>Aktualisiert: 19.08.2026</small></span>
    `;
  }

  const hero = document.querySelector('.hero');
  const bossTitle = hero?.querySelector('h2');
  const bossName = bossTitle?.textContent?.trim();
  const heroCopy = hero?.firstElementChild;
  if (heroCopy && bossName) {
    heroCopy.classList.add('hero-main');
    ensurePortrait(heroCopy, bossName);
    bossTitle.title = 'Offizielle Raidseite öffnen';
    bossTitle.onclick = () => window.open(BLIZZARD_RAID, '_blank', 'noopener,noreferrer');
    const summary = heroCopy.querySelector('p');
    if (summary) summary.classList.add('boss-summary');
  }

  document.querySelectorAll('.segmented button.active, .role-tabs button.active, .boss-btn.active').forEach(el => el.classList.add('gold-active'));

  const cards = [...document.querySelectorAll('.card')];
  const pull = cards.find(card => card.querySelector('h3')?.textContent?.includes('Vor dem Pull') || card.querySelector('h3')?.textContent?.includes('Erster Pull'));
  if (pull) pull.classList.add('pull-card');

  const flow = cards.find(card => card.querySelector('h3')?.textContent?.includes('Kampfablauf'));
  if (flow) {
    flow.classList.add('flow-card');
    flow.querySelectorAll('.timeline > div').forEach((phase, index) => {
      phase.classList.add('phase');
      if (!phase.querySelector('.phase-index')) {
        const indexEl = document.createElement('span');
        indexEl.className = 'phase-index';
        indexEl.textContent = String(index + 1);
        phase.prepend(indexEl);
      }
    });
  }

  document.querySelectorAll('.ability').forEach(ability => {
    ability.classList.add('ability-glow');
    const strong = ability.querySelector('strong');
    if (strong && !strong.classList.contains('ability-chip')) strong.classList.add('ability-chip');
  });

  const roomCard = cards.find(card => card.querySelector('h3')?.textContent?.includes('Raum & Positionierung'));
  if (roomCard && bossName) buildTrustedPositioning(roomCard, bossName);

  const sources = document.querySelector('.sources');
  if (sources) {
    let links = sources.querySelector('.source-links');
    if (!links) {
      links = document.createElement('div');
      links.className = 'source-links';
      [...sources.querySelectorAll(':scope > a')].forEach(a => links.append(a));
      sources.append(links);
    }
    ensureSourceLink(links, MYTHIC_TRAP, 'Mythic Trap');
    ensureSourceLink(links, WARCRAFT_LOGS, 'Warcraft Logs');
  }
}

let queued = false;
const observer = new MutationObserver(() => {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    decorate();
  });
});
observer.observe(document.documentElement, { subtree: true, childList: true, characterData: true });
decorate();
