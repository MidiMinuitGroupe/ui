// Pastille rouge d'un lien de la barre latérale ; placée en coin quand la barre est réduite (data-collapsed sur la barre).
export function NavBadge({ count, title }: { count: number; title: string }) {
  if (!count) return null;
  return (
    <span
      title={title}
      className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-semibold text-white tabular-nums md:group-data-[collapsed=true]:absolute md:group-data-[collapsed=true]:-top-1 md:group-data-[collapsed=true]:-right-1 md:group-data-[collapsed=true]:ml-0 md:group-data-[collapsed=true]:h-4 md:group-data-[collapsed=true]:min-w-4 md:group-data-[collapsed=true]:px-1 md:group-data-[collapsed=true]:text-[10px]"
    >
      {count}
      <span className="sr-only"> · {title}</span>
    </span>
  );
}
