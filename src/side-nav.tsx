"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, PanelLeftClose, PanelLeftOpen, Search, X } from "lucide-react";
import { Brand, BrandMark } from "./brand";
import { ThemeToggle } from "./theme";
import { Avatar } from "./avatar";
import { CommandPalette, type PaletteSearch } from "./command-palette";
import { NAV_COOKIE } from "./nav-cookie";

/** Entrée du menu. L'icône est déjà dessinée (`<BookOpen />`) : un layout serveur ne peut pas passer le composant lui-même. */
export type NavItem = { href: string; label: string; icon: ReactNode };
export type NavSection = { label?: string; items: NavItem[] };

const iconBase = "h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900";
/** Classe des petits boutons ronds du pied de la barre (thème, déconnexion…), pour les actions passées par l'application. */
export const navIconButtonClass = `inline-flex ${iconBase}`;

/**
 * Barre latérale commune : réductible aux icônes sur ordinateur (cookie NAV_COOKIE, lu par le layout pour `initiallyCollapsed`),
 * recherche ⌘K (liens du menu + `search`, action serveur de l'application), pastilles par lien (`badges`, à charger à part
 * sous <Suspense> pour ne pas retarder le menu), bouton de thème, actions du pied (déconnexion, lien vers le portail…).
 *
 * Sur téléphone : `mobile="drawer"` (barre du haut et menu coulissant, comme le portail) ou `mobile="tabs"` (barre d'onglets
 * en bas, comme Planning : prévoir un padding bas d'environ 6 rem sur le contenu).
 */
export function SideNav({
  appName,
  brandIcon,
  subtitle,
  top,
  sections,
  badges,
  user,
  actions,
  initiallyCollapsed = false,
  search,
  searchPlaceholder = "Rechercher…",
  mobile = "drawer",
  collapsedPaths,
}: {
  appName: string;
  brandIcon?: ReactNode;
  /** Sous le nom, en petit (« Sept Lieux »). */
  subtitle?: string;
  /** Sous le nom : sélecteur d'établissement, etc. */
  top?: ReactNode;
  sections: NavSection[];
  badges?: Partial<Record<string, ReactNode>>;
  user: { name: string; detail?: string };
  actions?: ReactNode;
  initiallyCollapsed?: boolean;
  search?: PaletteSearch;
  searchPlaceholder?: string;
  mobile?: "drawer" | "tabs";
  /** Pages où la barre est réduite d'office (Service de Booking) ; on peut la déplier le temps de la visite. */
  collapsedPaths?: string[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [chosen, setChosen] = useState(initiallyCollapsed);
  const [forcedOpen, setForcedOpen] = useState(false);
  const forced = !!collapsedPaths?.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  const collapsed = forced ? !forcedOpen : chosen;
  const [searching, setSearching] = useState(false);
  const links = sections.flatMap((section) => section.items);

  // ⌘K / Ctrl+K ouvre la recherche partout.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearching((value) => !value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function toggleCollapsed() {
    if (forced) {
      setForcedOpen(collapsed);
      return;
    }
    const next = !collapsed;
    setChosen(next);
    document.cookie = `${NAV_COOKIE}=${next ? "collapsed" : "open"}; path=/; max-age=31536000; samesite=lax`;
  }

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));
  // Réduite seulement sur ordinateur : sur téléphone le panneau garde les libellés.
  const mini = collapsed ? "md:hidden" : "";
  const tabs = mobile === "tabs";

  const renderLink = ({ href, label, icon }: NavItem) => {
    const active = isActive(href);
    return (
      <Link
        key={href}
        href={href}
        onClick={() => setOpen(false)}
        title={collapsed ? label : undefined}
        aria-current={active ? "page" : undefined}
        className={`relative flex h-9 items-center gap-2.5 rounded-[9px] border px-2.5 text-sm transition ${collapsed ? "md:justify-center md:px-0" : ""} ${
          active
            ? "border-slate-200 bg-slate-100 font-medium text-slate-900 shadow-[0_1px_2px_rgb(22_22_29/0.04)]"
            : "border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        }`}
      >
        <span aria-hidden className="flex shrink-0 [&_svg]:h-4 [&_svg]:w-4">
          {icon}
        </span>
        <span className={`truncate ${mini}`}>{label}</span>
        {badges?.[href]}
      </Link>
    );
  };

  const brand = collapsed ? (
    <>
      <span className="hidden md:flex">{brandIcon ?? <BrandMark className="h-7 w-7" />}</span>
      <Brand name={appName} icon={brandIcon} className="md:hidden" />
    </>
  ) : (
    <Brand name={appName} icon={brandIcon} />
  );

  return (
    <>
      <aside
        data-collapsed={collapsed}
        className={`group relative z-30 shrink-0 border-b border-slate-200 bg-white md:sticky md:top-0 md:flex md:h-dvh md:flex-col md:gap-4 md:border-r md:border-b-0 md:px-3 md:py-4 md:transition-[width] print:hidden ${
          collapsed ? "md:w-[72px]" : "md:w-[248px]"
        }`}
      >
        {/* Barre du haut (téléphone) / en-tête de la barre latérale (ordinateur) */}
        <div className={`flex h-14 items-center justify-between gap-2 px-3 md:h-auto md:px-1.5 ${collapsed ? "md:flex-col md:gap-3" : ""}`}>
          {!tabs && (
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={open}
              className={`${navIconButtonClass} md:hidden`}
            >
              {open ? <X aria-hidden className="h-5 w-5" /> : <Menu aria-hidden className="h-5 w-5" />}
            </button>
          )}
          <Link href="/" onClick={() => setOpen(false)} className="min-w-0 shrink-0 text-slate-900" aria-label={`Accueil · ${appName}`}>
            {brand}
          </Link>
          <span className="flex shrink-0 items-center gap-1 md:hidden">
            <button type="button" onClick={() => setSearching(true)} aria-label="Rechercher" className={navIconButtonClass}>
              <Search aria-hidden className="h-5 w-5" />
            </button>
            {tabs && (
              <>
                <ThemeToggle className={navIconButtonClass} />
                {actions}
              </>
            )}
          </span>
          <button
            type="button"
            onClick={toggleCollapsed}
            title={collapsed ? "Déplier la barre" : "Réduire la barre"}
            aria-label={collapsed ? "Déplier la barre latérale" : "Réduire la barre latérale"}
            className={`${iconBase} hidden md:inline-flex`}
          >
            {collapsed ? <PanelLeftOpen aria-hidden className="h-4 w-4" /> : <PanelLeftClose aria-hidden className="h-4 w-4" />}
          </button>
        </div>

        {/* Téléphone, onglets : le sélecteur (établissement…) sur sa propre ligne, sous la barre du haut. */}
        {tabs && top && <div className="px-3 pb-2.5 md:hidden [&_select]:max-w-none">{top}</div>}

        <div
          className={`${open && !tabs ? "flex" : "hidden"} absolute inset-x-0 top-14 max-h-[calc(100dvh-3.5rem)] flex-col gap-4 overflow-y-auto border-b border-slate-200 bg-white p-3 shadow-lg md:static md:flex md:max-h-none md:flex-1 md:border-0 md:p-0 md:shadow-none`}
        >
          {(subtitle || top) && (
            <div className={`flex flex-col gap-2 px-1 ${mini}`}>
              {subtitle && <p className="truncate px-1.5 text-xs font-medium text-slate-500">{subtitle}</p>}
              {top && <div className={tabs ? "hidden md:block" : ""}>{top}</div>}
            </div>
          )}

          <button
            type="button"
            onClick={() => setSearching(true)}
            title="Rechercher (⌘K)"
            className={`hidden h-[38px] w-full items-center gap-2 rounded-[10px] border border-slate-300 bg-white px-3 text-left text-sm text-slate-400 transition hover:border-slate-400 md:flex ${collapsed ? "md:justify-center md:px-0" : ""}`}
          >
            <Search aria-hidden className="h-4 w-4 shrink-0" />
            <span className={`flex-1 truncate ${mini}`}>{searchPlaceholder}</span>
            <kbd className={`rounded-md border border-slate-200 bg-slate-100 px-1.5 text-[11px] text-slate-500 ${mini}`}>⌘K</kbd>
          </button>

          <nav className="flex flex-col gap-0.5">
            {sections.map((section, index) => (
              <div key={section.label ?? index} className="flex flex-col gap-0.5">
                {index > 0 && <div className="mx-1 my-2 h-px bg-slate-200" />}
                {section.label && <p className={`px-2.5 pb-1 text-xs text-slate-400 ${mini}`}>{section.label}</p>}
                {section.items.map(renderLink)}
              </div>
            ))}
          </nav>

          <div className={`flex items-center gap-2.5 border-t border-slate-200 px-1 pt-3 md:mt-auto ${collapsed ? "md:flex-col" : ""}`}>
            <Avatar name={user.name} />
            <span className={`min-w-0 flex-1 text-sm leading-tight ${mini}`}>
              <span className="block truncate font-medium">{user.name}</span>
              {user.detail && <span className="block truncate text-xs text-slate-400">{user.detail}</span>}
            </span>
            <ThemeToggle className={navIconButtonClass} />
            {actions}
          </div>
        </div>
      </aside>

      {tabs && (
        <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-slate-200 bg-white px-1 pt-1.5 pb-[calc(4px+env(safe-area-inset-bottom))] md:hidden print:hidden">
          {links.map(({ href, label, icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`relative flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg px-1 py-1 text-[11px] ${active ? "bg-slate-100 font-medium text-slate-900" : "text-slate-500"}`}
              >
                <span aria-hidden className="flex [&_svg]:h-[22px] [&_svg]:w-[22px]">
                  {icon}
                </span>
                <span className="max-w-full truncate">{label}</span>
                {badges?.[href] && <span className="absolute top-0 left-1/2 ml-1.5 [&>span]:ml-0 [&>span]:h-4 [&>span]:min-w-4 [&>span]:px-1 [&>span]:text-[10px]">{badges[href]}</span>}
              </Link>
            );
          })}
        </nav>
      )}

      {searching && <CommandPalette onClose={() => setSearching(false)} links={links} search={search} placeholder={searchPlaceholder} />}
    </>
  );
}
