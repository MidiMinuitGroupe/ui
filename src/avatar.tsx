// Pastille ronde aux initiales, teintée d'une couleur stable tirée du nom (couleurs des pôles).
const TONES = ["var(--color-pole-rh)", "var(--color-pole-fnb)", "var(--color-pole-com)", "var(--color-pole-ops)"];

export function initials(name: string) {
  return name
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function toneOf(name: string) {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return TONES[hash % TONES.length];
}

export function Avatar({ name, size = "md", className = "" }: { name: string; size?: "sm" | "md"; className?: string }) {
  return (
    <span
      aria-hidden
      className={`tint inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${size === "sm" ? "h-6 w-6 text-[10px]" : "h-8 w-8 text-xs"} ${className}`}
      style={{ "--tint": toneOf(name) } as React.CSSProperties}
    >
      {initials(name)}
    </span>
  );
}
