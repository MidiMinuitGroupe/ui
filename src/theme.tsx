"use client";

import { useSyncExternalStore } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { THEME_KEY } from "./theme-script";

/**
 * Thème clair ou sombre. Le choix de la personne (auto, clair, sombre) est gardé dans le navigateur ;
 * « auto » suit le réglage de l'appareil. Le thème effectif est posé en data-theme sur <html> avant l'affichage
 * par THEME_SCRIPT (./theme-script.ts, dans le <head>), pour éviter un éclair blanc.
 */
export type ThemeChoice = "auto" | "light" | "dark";
const KEY = THEME_KEY;


function readChoice(): ThemeChoice {
  try {
    const value = localStorage.getItem(KEY);
    return value === "light" || value === "dark" ? value : "auto";
  } catch {
    return "auto";
  }
}

function applyChoice(choice: ThemeChoice) {
  const dark = choice === "dark" || (choice === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
}

const CHANGE = "theme-choice";
function subscribeChoice(callback: () => void) {
  window.addEventListener(CHANGE, callback);
  return () => window.removeEventListener(CHANGE, callback);
}

const NEXT: Record<ThemeChoice, ThemeChoice> = { auto: "light", light: "dark", dark: "auto" };
const LABELS: Record<ThemeChoice, string> = { auto: "Thème : auto", light: "Thème : clair", dark: "Thème : sombre" };
const ICONS = { auto: Monitor, light: Sun, dark: Moon };

/** Bouton qui fait tourner auto → clair → sombre. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const choice = useSyncExternalStore(subscribeChoice, readChoice, () => "auto" as ThemeChoice);
  const Icon = ICONS[choice];
  return (
    <button
      type="button"
      title={LABELS[choice]}
      aria-label={`${LABELS[choice]} (changer)`}
      onClick={() => {
        const next = NEXT[choice];
        try {
          if (next === "auto") localStorage.removeItem(KEY);
          else localStorage.setItem(KEY, next);
        } catch {}
        applyChoice(next);
        window.dispatchEvent(new Event(CHANGE));
      }}
      className={className}
    >
      <Icon aria-hidden className="h-4 w-4" />
    </button>
  );
}

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

/** Thème effectif, pour les composants qui en ont besoin (éditeur BlockNote). */
export function useResolvedTheme(): "light" | "dark" {
  return useSyncExternalStore(
    subscribe,
    () => (document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light"),
    () => "light",
  );
}
