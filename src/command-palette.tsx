"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AppWindow, ArrowUpRight, CornerDownRight, FileText, UserRound, Search, type LucideIcon } from "lucide-react";

/** Lien de navigation proposé sans rien taper (les entrées du menu). */
export type PaletteLink = { href: string; label: string; icon: ReactNode };

/** Résultat renvoyé par la recherche de l'application (action serveur) : sérialisable, l'icône est un nom. */
export type PaletteResult = { id: string; label: string; hint?: string; href: string; external?: boolean; icon?: "app" | "page" | "person" | "link" };
export type PaletteGroup = { label: string; items: PaletteResult[] };
export type PaletteSearch = (query: string) => Promise<PaletteGroup[]>;

const RESULT_ICONS: Record<NonNullable<PaletteResult["icon"]>, LucideIcon> = {
  app: AppWindow,
  page: FileText,
  person: UserRound,
  link: CornerDownRight,
};

function resultIcon(name: PaletteResult["icon"]) {
  const Icon = RESULT_ICONS[name ?? "link"];
  return <Icon />;
}

type Item = { key: string; group: string; label: string; hint?: string; icon: ReactNode; href: string; external?: boolean };

const norm = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

/**
 * Recherche globale (⌘K / Ctrl+K) : les liens du menu, plus les résultats de `search` (action serveur de l'application),
 * appelée 200 ms après la dernière frappe (et une fois à l'ouverture, texte vide). Montée à l'ouverture.
 */
export function CommandPalette({
  onClose,
  links,
  search,
  placeholder = "Rechercher…",
}: {
  onClose: () => void;
  links: PaletteLink[];
  search?: PaletteSearch;
  placeholder?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [groups, setGroups] = useState<PaletteGroup[]>([]);
  const [selected, setSelected] = useState(0);
  const [pending, startTransition] = useTransition();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!search) return;
    const timer = setTimeout(
      () => {
        startTransition(async () => {
          try {
            setGroups(await search(query));
          } catch {
            setGroups([]);
          }
        });
      },
      query ? 200 : 0,
    );
    return () => clearTimeout(timer);
  }, [query, search]);

  const items = useMemo<Item[]>(() => {
    const needle = norm(query.trim());
    return [
      ...links
        .filter((link) => !needle || norm(link.label).includes(needle))
        .map((link) => ({ key: `n${link.href}`, group: "Aller à", label: link.label, icon: link.icon, href: link.href })),
      ...groups.flatMap((group) =>
        group.items.map((item) => ({
          key: `${group.label}${item.id}`,
          group: group.label,
          label: item.label,
          hint: item.hint,
          icon: resultIcon(item.icon),
          href: item.href,
          external: item.external,
        })),
      ),
    ];
  }, [links, groups, query]);

  const current = Math.min(selected, Math.max(items.length - 1, 0));

  const go = useCallback(
    (item: Item | undefined) => {
      if (!item) return;
      onClose();
      if (item.external) window.location.href = item.href;
      else router.push(item.href);
    },
    [onClose, router],
  );

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${current}"]`)?.scrollIntoView({ block: "nearest" });
  }, [current]);

  let lastGroup = "";
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/30 px-4 pt-[12vh] backdrop-blur-[2px] dark:bg-black/50"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div role="dialog" aria-modal="true" aria-label="Recherche" className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-2xl">
        <div className="flex h-14 items-center gap-3 border-b border-slate-200 px-4 text-slate-400">
          <Search aria-hidden className="h-4 w-4 shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelected(0);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setSelected(Math.min(current + 1, items.length - 1));
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setSelected(Math.max(current - 1, 0));
              } else if (event.key === "Enter") {
                event.preventDefault();
                go(items[current]);
              } else if (event.key === "Escape") onClose();
            }}
            placeholder={placeholder}
            aria-label="Rechercher"
            className="min-w-0 flex-1 bg-transparent text-[15px] text-slate-900 outline-none placeholder:text-slate-400"
          />
          <kbd className="rounded-md border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-500">Échap</kbd>
        </div>
        <div ref={listRef} className="max-h-[min(380px,60vh)] overflow-y-auto p-2">
          {items.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-slate-500">{pending ? "Recherche…" : `Aucun résultat pour « ${query} »`}</p>
          ) : (
            items.map((item, index) => {
              const header = item.group !== lastGroup ? item.group : null;
              lastGroup = item.group;
              return (
                <div key={item.key}>
                  {header && <p className="px-2.5 pt-2.5 pb-1 text-xs text-slate-400">{header}</p>}
                  <button
                    type="button"
                    data-index={index}
                    onMouseMove={() => setSelected(index)}
                    onClick={() => go(item)}
                    className={`flex w-full items-center gap-3 rounded-[9px] px-2.5 py-2 text-left text-sm ${index === current ? "bg-slate-100" : ""}`}
                  >
                    <span aria-hidden className="flex shrink-0 text-slate-500 [&_svg]:h-4 [&_svg]:w-4">
                      {item.icon}
                    </span>
                    <span className="min-w-0 truncate">{item.label}</span>
                    {item.hint && <span className="ml-auto shrink-0 truncate pl-3 text-xs text-slate-400">{item.hint}</span>}
                    {item.external && <ArrowUpRight aria-hidden className="h-3.5 w-3.5 shrink-0 text-slate-400" />}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
