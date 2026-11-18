// Cookie de la barre latérale réduite : lu côté serveur par le layout de l'application (initiallyCollapsed),
// écrit par la barre quand on la réduit ou la déplie.
export const NAV_COOKIE = "nav";
export const isNavCollapsed = (value: string | undefined) => value === "collapsed";
