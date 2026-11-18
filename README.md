# @midiminuit/ui

Thème et composants communs des applications Midi Minuit Groupe : portail, Planning, puis les autres.
Ne contient que de l'affichage : aucune donnée, aucun secret (dépôt public, installé par Vercel sans clé).

## Installer dans une application (Next.js 16, Tailwind 4)

1. `npm install github:MidiMinuitGroupe/ui#v0.1.2` (toujours une version étiquetée).
2. `next.config.ts` : `transpilePackages: ["@midiminuit/ui"]` (le paquet est livré en TypeScript).
3. `globals.css` :
   ```css
   @import "tailwindcss";
   @import "@midiminuit/ui/theme.css";
   ```
4. Layout racine : police Inter avec la variable `--font-inter`, script de thème dans le `<head>`, `suppressHydrationWarning` sur `<html>` :
   ```tsx
   import { Inter } from "next/font/google";
   import { THEME_SCRIPT } from "@midiminuit/ui/theme-script";
   const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
   // <html lang="fr" className={inter.variable} suppressHydrationWarning>
   //   <head><script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} /></head>
   ```
5. Barre latérale (`@midiminuit/ui/nav`) dans le layout de l'application, icônes lucide-react déjà dessinées :
   ```tsx
   <SideNav
     appName="Planning"
     sections={[{ items: [{ href: "/", label: "Accueil", icon: <House /> }] }]}
     badges={{ "/absences": <Suspense><MonCompteur /></Suspense> }}   // NavBadge de @midiminuit/ui/nav-badge
     user={{ name: "Camille Martin", detail: "Manager" }}
     actions={<a href="…/deconnexion" className={navIconButtonClass}><LogOut /></a>}
     initiallyCollapsed={isNavCollapsed((await cookies()).get(NAV_COOKIE)?.value)}
     search={maRechercheServeur}   // facultatif : (texte) => Promise<PaletteGroup[]>
     mobile="tabs"                 // ou "drawer"
   />
   ```

## Ce que fournit le thème

- Gris neutres légèrement violacés, cartes blanches à bordure fine (`card`), accent violet (`accent`, `accent-soft`),
  couleurs des pôles « Prisme » (`pole-rh`, `pole-fnb`, `pole-com`, `pole-ops`).
- Titres : `title-page`, `title-section` (Inter). Pastille teintée : `tint` + variable `--tint`.
- Mode sombre sans réécrire les pages : les échelles Tailwind utilisées (slate, white, red, amber, emerald, sky, indigo, pink, orange, violet)
  sont redéfinies en sombre. Choix auto / clair / sombre gardé dans le navigateur (`ThemeToggle`), `useResolvedTheme()` pour
  les composants qui en ont besoin. Variante Tailwind `dark:` branchée sur `data-theme="dark"`.
- Classes de formulaires et boutons : `@midiminuit/ui/classes`. Avatars aux initiales : `@midiminuit/ui/avatar`.

## Publier une version

Modifier, puis `git tag v0.x.y && git push --tags`, et mettre à jour la version dans chaque application.
