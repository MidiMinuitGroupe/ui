// Script du <head> (layout racine) : pose data-theme="light" | "dark" sur <html> avant l'affichage,
// d'après le choix gardé dans le navigateur (src/components/theme.tsx) ou, en « auto », le réglage de l'appareil.
export const THEME_KEY = "theme";

export const THEME_SCRIPT = `(function(){try{var c=localStorage.getItem("${THEME_KEY}");var m=window.matchMedia("(prefers-color-scheme: dark)");var a=function(){var d=c==="dark"||(c!=="light"&&m.matches);document.documentElement.setAttribute("data-theme",d?"dark":"light")};a();m.addEventListener("change",function(){c=localStorage.getItem("${THEME_KEY}");a()})}catch(e){}})();`;
