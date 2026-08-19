const BLIZZARD_RAID = 'https://worldofwarcraft.blizzard.com/de-de/news/24294062/fluch-von-ulatek-der-giftige-abgrund-schlachtzug-geht-am-19-august-live';
const MYTHIC_TRAP = 'https://www.mythictrap.com/';
const WARCRAFT_LOGS = 'https://www.warcraftlogs.com/';

const positionHints = {
  "Nek'zali the Soulcoiler": 'Soulcoil Well als Sperrzone behandeln. Boss und Adds außen führen; Ranged so verteilen, dass einlaufende Adds früh erkannt werden.',
  'Entombed Sentinels': 'Zwei feste Raumhälften spielen und die Sentinels klar getrennt halten. Nur zur vorgesehenen Intermission kontrolliert zusammenführen.',
  'Vashnik the Malignant': 'Tankposition steuert die nächsten Fountains. Die Mitte für Living-Venom-Laufwege und schnelle Zielwechsel freihalten.',
  'The Lost Explorers': 'Drei Ziele mit klaren Abständen spielen. Mitte als Transit- und Ressourcenraum frei halten; Fisch-Assignments nicht kreuzen.',
  'Sszorak': 'Immer mit sicherer Landefläche im Rücken stehen. Vor Wind- und Knockback-Mechaniken den eigenen Rückstoßweg prüfen.',
  'The Twin Fangs': 'Bosse kontrolliert positionieren und einen klaren Soak-Korridor für Ravenous Feast freihalten. Hohe Venom-Stapel früh in die Bewegung einplanen.',
  'The Coiled Altar': 'Coalesced Venom auf einer geplanten Raumseite sammeln. Tanklinie so wählen, dass Sever/Soul Sever kontrolliert Raum bereinigen kann.',
  "Ula'tek": 'Sicheren Raum wie eine Ressource behandeln. Eier, Venom und Demolish so spielen, dass die finale Arena möglichst lange nutzbar bleibt.'
};

function initials(name = '') {
  return name
    .replace(/^The\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase();
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
  const pull = cards.find(card => card.querySelector('h3')?.textContent?.includes('Erster Pull'));
  if (pull) {
    pull.classList.add('pull-card');
    const heading = pull.querySelector('h3');
    if (heading) {
      const svg = heading.querySelector('svg')?.outerHTML || '';
      heading.innerHTML = `${svg}<span>Vor dem Pull wichtig:</span>`;
    }
  }

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
  if (roomCard && bossName) {
    roomCard.classList.add('arena-card');
    const heading = roomCard.querySelector('h3');
    if (heading && !roomCard.querySelector('.wcl-badge')) {
      const badge = document.createElement('span');
      badge.className = 'wcl-badge';
      badge.textContent = 'Warcraft Logs Abgleich';
      heading.after(badge);
    }
    let hint = roomCard.querySelector('.arena-hint');
    if (!hint) {
      hint = document.createElement('p');
      hint.className = 'arena-hint';
      roomCard.append(hint);
    }
    hint.textContent = positionHints[bossName] || 'Positionsschema wird mit aktuellen Logs und Guidequellen abgeglichen.';
  }

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
