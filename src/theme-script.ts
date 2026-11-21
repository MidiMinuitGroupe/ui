import { THEME_COOKIE_JS } from "./theme-cookie";

// Script du <head> (layout racine) : pose data-theme="light" | "dark" sur <html> avant l'affichage,
// d'après le choix commun du groupe (cookie, ./theme-cookie.ts) ou, en « auto », le réglage de l'appareil.

/** Ancienne clé du choix, gardée par chaque sous-domaine dans son stockage local jusqu'à la v0.4.0. */
export const THEME_KEY = "theme";

/**
 * adoptLocal (portail seulement) : sans cookie, l'ancien choix gardé par cette application devient le choix commun.
 * Ailleurs, l'ancien choix est simplement oublié.
 */
export function themeScript({ adoptLocal = false }: { adoptLocal?: boolean } = {}) {
  const adopt = adoptLocal
    ? `if(!mmThemeRead()){var o=localStorage.getItem("${THEME_KEY}");if(o==="light"||o==="dark")mmThemeWrite(o)}`
    : "";
  return `(function(){${THEME_COOKIE_JS}
try{${adopt}localStorage.removeItem("${THEME_KEY}")}catch(e){}try{var m=window.matchMedia("(prefers-color-scheme: dark)");var a=function(){var c=mmThemeRead();var d=c==="dark"||(c!=="light"&&m.matches);document.documentElement.setAttribute("data-theme",d?"dark":"light")};a();m.addEventListener("change",a)}catch(e){}})();`;
}

export const THEME_SCRIPT = themeScript();
