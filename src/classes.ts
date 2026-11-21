// Classes Tailwind partagées par les formulaires, boutons, pastilles et onglets des applications (refonte 2026 :
// boutons violet profond, coins de 6 px, bouton secondaire à contour foncé).

export const inputClass =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base sm:text-sm font-normal outline-none transition focus:border-slate-900 focus:ring-3 focus:ring-accent/15 disabled:bg-slate-100 disabled:text-slate-500";

export const labelClass = "flex flex-col gap-1 text-sm font-medium";

/** Action principale : une seule par écran. */
export const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover disabled:opacity-50";

/** Action secondaire : contour foncé. */
export const secondaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-md border border-slate-900 bg-transparent px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100 disabled:opacity-50";

/** Action discrète (réglages, filtres, flèches) : gris plein. */
export const quietButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-200 disabled:opacity-50";

/** Gardé pour les applications qui l'utilisent : identique au bouton principal. */
export const accentButtonClass = buttonClass;

export const dangerButtonClass =
  "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50";

export const cardClass = "card p-5";

export const badgeClass = "inline-flex items-center gap-1 whitespace-nowrap rounded px-2 py-0.5 text-xs font-medium";

/** Lien violet (« Afficher tout », établissement sous le titre). */
export const linkClass = "font-medium text-accent underline-offset-4 hover:underline";

/** Filtres en pilules (« Tous les pôles », « Salle »…). */
export const pillClass = "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition";
export const pillActiveClass = "border-slate-900 bg-slate-900 text-white dark:text-slate-50";
export const pillIdleClass = "border-slate-300 text-slate-900 hover:border-slate-400";

/** Onglets en pastilles (accueil, tableau de bord, salariés) : la sélection en lavande. */
export const tabClass = "inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition";
export const tabActiveClass = "bg-accent-soft text-slate-900";
export const tabIdleClass = "text-slate-500 hover:text-slate-900";

/** Onglets soulignés (« Brouillon / En attente / Terminées »). */
export const underlineTabClass = "-mb-px inline-flex h-9 items-center gap-1.5 border-b-2 px-1 text-sm font-medium transition";
export const underlineTabActiveClass = "border-slate-900 text-slate-900";
export const underlineTabIdleClass = "border-transparent text-slate-500 hover:text-slate-900";
