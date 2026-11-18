import { THEME_KEY } from "./theme-script";

// Bouton de thème pour les interfaces sans React (Bar Manager, Food) : tout élément [data-mm-theme-toggle]
// fait tourner auto → clair → sombre au clic, avec l'icône et le titre du choix en cours.
// À placer dans le <head> après THEME_SCRIPT : <script dangerouslySetInnerHTML={{ __html: THEME_TOGGLE_SCRIPT }} />
const ICONS = {
  auto: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
  light: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>',
  dark: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
};
const LABELS = { auto: "Thème : auto", light: "Thème : clair", dark: "Thème : sombre" };

// paint() ne redessine un bouton que si son choix a changé (data-mm-theme-painted) : sinon son propre innerHTML
// relancerait le MutationObserver sans fin et figerait la page.
export const THEME_TOGGLE_SCRIPT = `(function(){var K="${THEME_KEY}",I=${JSON.stringify(ICONS)},L=${JSON.stringify(LABELS)},N={auto:"light",light:"dark",dark:"auto"};
function get(){try{var v=localStorage.getItem(K);return v==="light"||v==="dark"?v:"auto"}catch(e){return"auto"}}
function apply(c){var d=c==="dark"||(c==="auto"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.setAttribute("data-theme",d?"dark":"light")}
function paint(){var c=get();document.querySelectorAll("[data-mm-theme-toggle]").forEach(function(b){if(b.getAttribute("data-mm-theme-painted")===c)return;b.setAttribute("data-mm-theme-painted",c);b.innerHTML=I[c];b.title=L[c];b.setAttribute("aria-label",L[c]+" (changer)")})}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-mm-theme-toggle]");if(!b)return;var n=N[get()];try{n==="auto"?localStorage.removeItem(K):localStorage.setItem(K,n)}catch(x){}apply(n);paint()});
new MutationObserver(paint).observe(document.documentElement,{childList:true,subtree:true});
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",paint):paint()})();`;
