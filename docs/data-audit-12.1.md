# The Venomous Abyss — Patch 12.1 data audit

Status: active verification pass, 2026-08-19.

## Rules
- Never treat PTR numbers as difficulty-independent when the spell data contains per-difficulty values.
- English ability names remain canonical.
- German localization is only published after exact live localization is verified.
- Spell IDs are only attached after matching boss + mechanic + Patch 12.1 context.
- Mythic Trap remains a required second/final QA pass once The Venomous Abyss is publicly covered there.

## Verified spell records
| Encounter | Ability | Verified spell ID | Notes |
|---|---|---:|---|
| Nek'zali | Uncoiling | 1290003 | 5 sec cast; final pressure phase. |
| Entombed Sentinels | Helical Toxins | 1284590 | Exactly 4 applications neutralize the toxin. |
| Twin Fangs | Eternal Venom | 1290336 | Kill threshold is difficulty-dependent: 9 Normal, 8 Heroic, 7 Mythic, 10 LFR in current PTR spell data. |
| Twin Fangs | Ravenous Feast | 1290516 | Three successive hits; each hit consumes one Eternal Venom application from players struck. |
| Ula'tek | Caustic Waves | 1292403 | Waves damage players and instantly hatch eggs they touch. |
| Ula'tek | Rage of the Shackled | 1286860 | 6.5 sec cast; raid damage over 20 sec and exposes Venomous Heart. |

## Immediate correction required
The UI must not state that Eternal Venom always kills at 9 stacks. Heroic is 8 and Mythic is 7 in the current Patch 12.1 spell data. This is now treated as a blocking correctness issue for the Twin Fangs page.
