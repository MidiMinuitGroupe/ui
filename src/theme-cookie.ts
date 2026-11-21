// Choix du thème (auto, clair, sombre) commun à toutes les applications du groupe : un cookie posé sur
// midiminuitgroupe.com, lu par chaque sous-domaine (portail, planning., food.…). Le dernier choix fait n'importe où
// s'applique partout, par appareil. En local, les cookies de localhost sont partagés entre les ports.
// « auto » est écrit lui aussi : la présence du cookie veut dire qu'un choix a été fait.
export const THEME_COOKIE = "mm-theme";
export const THEME_DOMAIN = "midiminuitgroupe.com";
const MAX_AGE = 60 * 60 * 24 * 400;

export type ThemeChoice = "auto" | "light" | "dark";

/** Mêmes fonctions en JavaScript brut, pour les scripts du <head> et les interfaces sans React. */
export const THEME_COOKIE_JS = `function mmThemeRead(){var m=document.cookie.match(/(?:^|; )${THEME_COOKIE}=(auto|light|dark)(?:;|$)/);return m?m[1]:null}
function mmThemeWrite(v){var h=location.hostname,d=h==="${THEME_DOMAIN}"||h.slice(-${THEME_DOMAIN.length + 1})===".${THEME_DOMAIN}"?";domain=${THEME_DOMAIN}":"";document.cookie="${THEME_COOKIE}="+v+";path=/;max-age=${MAX_AGE};samesite=lax"+d+(location.protocol==="https:"?";secure":"")}`;

export function readThemeCookie(): ThemeChoice | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${THEME_COOKIE}=(auto|light|dark)(?:;|$)`));
  return match ? (match[1] as ThemeChoice) : null;
}

export function writeThemeCookie(choice: ThemeChoice) {
  const host = location.hostname;
  const shared = host === THEME_DOMAIN || host.endsWith(`.${THEME_DOMAIN}`);
  document.cookie =
    `${THEME_COOKIE}=${choice};path=/;max-age=${MAX_AGE};samesite=lax` +
    (shared ? `;domain=${THEME_DOMAIN}` : "") +
    (location.protocol === "https:" ? ";secure" : "");
}
