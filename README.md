# @midiminuit/ui

Thème et composants communs des applications Midi Minuit Groupe : portail, Planning, puis les autres.
Ne contient que de l'affichage : aucune donnée, aucun secret (dépôt public, installé par Vercel sans clé).

## Installer dans une application (Next.js 16, Tailwind 4)

1. `npm install github:MidiMinuitGroupe/ui#v0.3.0` (toujours une version étiquetée).
2. `next.config.ts` : `transpilePackages: ["@midiminuit/ui"]` (le paquet est livré en TypeScript).
3. `globals.css` :
   ```css
   @import "tailwindcss";
   @import "@midiminuit/ui/theme.css";
   ```
4. Layout racine : police Instrument Sans avec la variable `--font-instrument-sans` (depuis la v0.3.0 ; Inter `--font-inter` reste lue à défaut), script de thème dans le `<head>`, `suppressHydrationWarning` sur `<html>` :
   ```tsx
   import { Instrument_Sans } from "next/font/google";
   import { THEME_SCRIPT } from "@midiminuit/ui/theme-script";
   const sans = Instrument_Sans({ variable: "--font-instrument-sans", subsets: ["latin"] });
   // <html lang="fr" className={sans.variable} suppressHydrationWarning>
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
     collapsedPaths={["/service"]} // facultatif : barre réduite d'office sur ces pages
   />
   ```

## Applications sans Tailwind (Bar Manager, Food)

- `layout.tsx` : `import "@midiminuit/ui/tokens.css";`, police Instrument Sans (`--font-instrument-sans`), puis dans le `<head>` `THEME_SCRIPT`
  et `THEME_TOGGLE_SCRIPT` (`@midiminuit/ui/theme-toggle-script`), `transpilePackages: ["@midiminuit/ui"]`.
- La feuille de l'application lit les jetons `--mm-*` (fond, surfaces, bordures, texte, accent, couleurs de statut
  `--mm-amber-100`, `--mm-red-700`…), tous déclinés en sombre.
- Bouton de thème : n'importe quel `<button data-mm-theme-toggle>` (icône et titre posés par le script).

## Ce que fournit le thème

- Refonte 2026 (v0.3.0) : fond blanc, cartes à filet fin sans ombre (`card`), boutons violet profond (`primary`, `primary-hover`),
  sélection lavande (`accent-soft`), liens violets (`accent`), panneau gris très clair (`panel`), couleurs des pôles
  (`pole-rh` pêche, `pole-fnb` jaune, `pole-com` menthe, `pole-ops` lilas) dont `tint` donne les ronds pastel.
- Titres : `title-page` (grand, gras), `title-section`. Pastille teintée : `tint` + variable `--tint`.
- Mode sombre sans réécrire les pages : les échelles Tailwind utilisées (slate, white, red, amber, emerald, sky, indigo, pink, orange, violet)
  sont redéfinies en sombre. Choix auto / clair / sombre gardé dans le navigateur (`ThemeToggle`), `useResolvedTheme()` pour
  les composants qui en ont besoin. Variante Tailwind `dark:` branchée sur `data-theme="dark"`.
- Classes de formulaires, boutons (`buttonClass` violet, `secondaryButtonClass` à contour, `quietButtonClass` gris), filtres en pilules (`pillClass`), onglets (`tabClass`, `underlineTabClass`), lien violet (`linkClass`) : `@midiminuit/ui/classes`.
- Barre latérale : sélection lavande, liens externes (`external`, `muted`) pour lister des applications, lien « Afficher tout » de section (`more`). Avatars aux initiales : `@midiminuit/ui/avatar`.

## Publier une version

Modifier, puis `git tag v0.x.y && git push --tags`, et mettre à jour la version dans chaque application.
