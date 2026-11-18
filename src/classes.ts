// Classes Tailwind partagées par les formulaires, boutons, pastilles et onglets des applications.

export const inputClass =
  "w-full rounded-[10px] border border-slate-300 bg-white px-3 py-2 text-base sm:text-sm font-normal outline-none transition focus:border-accent focus:ring-3 focus:ring-accent/15 disabled:bg-slate-100 disabled:text-slate-500";

export const labelClass = "flex flex-col gap-1 text-sm font-medium";

export const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-[10px] bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-50";

export const secondaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-[10px] border border-slate-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-slate-50 disabled:opacity-50";

export const accentButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-[10px] bg-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50 dark:text-slate-50";

export const dangerButtonClass =
  "inline-flex items-center justify-center rounded-[10px] px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50";

export const cardClass = "card p-5";

export const badgeClass = "inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium";

/** Onglets en pastilles (accueil, tableau de bord, salariés). */
export const tabClass = "inline-flex h-8 items-center gap-1.5 rounded-[9px] border px-3 text-sm font-medium transition";
export const tabActiveClass = "border-slate-200 bg-white text-slate-900 shadow-[0_1px_2px_rgb(22_22_29/0.04)]";
export const tabIdleClass = "border-transparent text-slate-500 hover:text-slate-900";
