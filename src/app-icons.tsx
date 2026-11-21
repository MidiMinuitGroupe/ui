// Logos des applications du groupe : un symbole au trait dans un rond pastel de la couleur du pôle (RH, F&B, Com, Ops),
// comme dans le menu du portail. Une seule source pour le logo du menu, le favicon et l'icône de l'application installée.
//
// - <AppIcon slug="planning" size={28} /> : dans une page (suit le mode sombre par les variables du thème).
// - appIconSvg("planning") : SVG autonome aux couleurs fixes (fichier icon.svg, applications sans React).
// - appIconDataUri("planning", { shape: "square" }) : pour <img> dans ImageResponse (apple-icon, icônes du manifeste).

export type Pole = "RH" | "FNB" | "COMMUNICATION" | "OPERATIONS";

/** Couleur de chaque pôle (palette « Prisme » du thème). */
export const POLE_HEX: Record<Pole, string> = {
  RH: "#e0703a",
  FNB: "#c7a20c",
  COMMUNICATION: "#23a26b",
  OPERATIONS: "#7c5cfa",
};

/** Variable CSS de chaque pôle (redéfinie en mode sombre par theme.css / tokens.css). */
export const POLE_VARS: Record<Pole, string> = {
  RH: "var(--color-pole-rh)",
  FNB: "var(--color-pole-fnb)",
  COMMUNICATION: "var(--color-pole-com)",
  OPERATIONS: "var(--color-pole-ops)",
};

const dot = (cx: number, cy: number) => `<circle cx="${cx}" cy="${cy}" r="3.2" fill="currentColor" stroke="none"/>`;

/** Symboles dessinés sur une grille de 48 (trait, `currentColor`). */
const LOGOS: Record<string, string> = {
  booking: `<circle cx="24" cy="24" r="9"/>${dot(24, 6.5)}${dot(24, 41.5)}${dot(6.5, 24)}${dot(41.5, 24)}`,
  planning: `<rect x="6" y="9" width="36" height="33" rx="5"/><path d="M6 19h36M16 4v9M32 4v9"/><rect x="27" y="25" width="9" height="9" rx="1.5" fill="currentColor" stroke="none"/>`,
  food: `<path d="M24 6c3.8 0 7 2.7 7.8 6.3a8 8 0 0 1 4.2 15.4l0 14.3h-24v-14.3a8 8 0 1 1 4.2 -15.4a8 8 0 0 1 7.8 -6.3zM12.3 34h23.7"/>`,
  "bar-manager": `<path d="M8 8h32l-16 18zM24 26v15M15 41h18"/>`,
  contest: `<rect x="6" y="16" width="36" height="8" rx="2"/><path d="M24 16v26M38 24v14a4 4 0 0 1 -4 4h-20a4 4 0 0 1 -4 -4v-14M15 16a5 5 0 0 1 0 -10a9.6 16 0 0 1 9 10a9.6 16 0 0 1 9 -10a5 5 0 0 1 0 10"/>`,
  scanner: `<path d="M7 15v-4a4 4 0 0 1 4 -4h4M33 7h4a4 4 0 0 1 4 4v4M41 33v4a4 4 0 0 1 -4 4h-4M15 41h-4a4 4 0 0 1 -4 -4v-4M10 24h28"/>`,
  fixit: `<path d="M14 20h6v-6l-7 -7a12 12 0 0 1 16 16l12 12a4 4 0 0 1 -6 6l-12 -12a12 12 0 0 1 -16 -16l7 7"/>`,
  ecrans: `<rect x="5" y="8" width="38" height="26" rx="4"/><path d="M24 34v7M15 41h18"/><path d="M20 15.5l9.5 5.5l-9.5 5.5z" fill="currentColor"/>`,
};

/** Pôle de chaque application (celui choisi dans le portail, /admin/applications). */
export const APP_POLES: Record<string, Pole> = {
  planning: "RH",
  food: "FNB",
  "bar-manager": "FNB",
  booking: "FNB",
  fixit: "OPERATIONS",
  scanner: "OPERATIONS",
  contest: "COMMUNICATION",
  ecrans: "COMMUNICATION",
};

export function hasAppLogo(slug: string) {
  return slug in LOGOS;
}

const hex = (value: string) => [1, 3, 5].map((i) => parseInt(value.slice(i, i + 2), 16));
const toHex = (rgb: number[]) => `#${rgb.map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`;
const mix = (a: string, b: string, weightA: number) => {
  const [x, y] = [hex(a), hex(b)];
  return toHex(x.map((c, i) => c * weightA + y[i] * (1 - weightA)));
};

/** Fond pastel et encre du symbole, en couleurs fixes (fichiers d'icône). */
export function poleColors(pole: Pole) {
  return { background: mix(POLE_HEX[pole], "#ffffff", 0.18), ink: mix(POLE_HEX[pole], "#16161d", 0.82) };
}

/** Taille du symbole dans le rond : plus grand et plus épais en petit, comme dans le menu du portail. */
const glyph = (size: number, shape: "circle" | "square") =>
  shape === "square" ? { scale: 0.56, stroke: 3.4 } : size < 30 ? { scale: 0.5, stroke: 4.4 } : { scale: 0.5, stroke: 3.6 };

/**
 * SVG autonome. `circle` = rond pastel sur fond transparent (favicon, logo) ; `square` = carré plein pastel
 * (icône d'application installée : le téléphone arrondit lui-même les coins).
 */
export function appIconSvg(slug: string, { shape = "circle", size = 48 }: { shape?: "circle" | "square"; size?: number } = {}) {
  const pole = APP_POLES[slug] ?? "OPERATIONS";
  const { background, ink } = poleColors(pole);
  const { scale, stroke } = glyph(size, shape);
  const offset = 24 * (1 - scale);
  const logo = (LOGOS[slug] ?? "").replaceAll("currentColor", ink);
  const back = shape === "square" ? `<rect width="48" height="48" fill="${background}"/>` : `<circle cx="24" cy="24" r="24" fill="${background}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="${size}" height="${size}">${back}<g transform="translate(${offset} ${offset}) scale(${scale})" fill="none" stroke="${ink}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">${logo}</g></svg>`;
}

export function appIconDataUri(slug: string, options?: { shape?: "circle" | "square"; size?: number }) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(appIconSvg(slug, options))}`;
}

const tinted = (tone: string) => `color-mix(in oklab, ${tone} 18%, var(--color-white, #fff))`;
const inked = (tone: string) => `color-mix(in oklab, ${tone} 82%, var(--foreground, #16161d))`;

/** Logo d'une application dans une page : rond pastel, symbole de la couleur du pôle, suit le mode sombre. */
export function AppIcon({ slug, size = 28, pole, className }: { slug: string; size?: number; pole?: Pole; className?: string }) {
  const tone = POLE_VARS[pole ?? APP_POLES[slug] ?? "OPERATIONS"];
  const { scale, stroke } = glyph(size, "circle");
  const offset = 24 * (1 - scale);
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden className={`inline-block shrink-0 ${className ?? ""}`}>
      <circle cx="24" cy="24" r="24" fill={tinted(tone)} />
      <g
        transform={`translate(${offset} ${offset}) scale(${scale})`}
        fill="none"
        stroke="currentColor"
        style={{ color: inked(tone) }}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        dangerouslySetInnerHTML={{ __html: LOGOS[slug] ?? "" }}
      />
    </svg>
  );
}
