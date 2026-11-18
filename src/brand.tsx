/** Logo du groupe (provisoire, en attendant la charte) : un disque mi-soleil, mi-nuit. */
export function BrandMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <span aria-hidden className={`flex shrink-0 overflow-hidden rounded-full ring-1 ring-slate-300 ${className}`}>
      <span className="h-full w-1/2 bg-amber-400" />
      <span className="h-full w-1/2 bg-[#1d1b3a] dark:bg-[#3a3570]" />
    </span>
  );
}

/** Logo et nom : « Midi Minuit » pour le portail, le nom de l'application ailleurs (« Planning »). */
export function Brand({ name = "Midi Minuit Groupe", icon, className = "" }: { name?: string; icon?: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 font-semibold tracking-tight ${className}`}>
      {icon ?? <BrandMark />}
      <span>{name}</span>
    </span>
  );
}
