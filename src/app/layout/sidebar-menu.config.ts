import { MenuItem } from 'primeng/api';

export const SIDEBAR_MENU: MenuItem[] = [
  {
    label: 'Point de vente',
    icon: 'pi-shopping-cart',
    items: [
      { label: 'Menu', icon: 'pi-shopping-basket', routerLink: ['/gestions/menu'] },
      { label: 'Mes commandes', icon: 'pi-list', routerLink: ['/gestions/mes-commandes'] },
      { label: 'Gestion des menus', icon: 'pi-shopping-cart', routerLink: ['/gestions/gestion-des-menus'] }
    ]
  },
  {
    label: 'Caisse',
    icon: 'pi-banknote',
    items: [
      { label: 'Vue caisse', icon: 'pi-wallet', routerLink: ['/caisse'] },
      { label: 'Encaissement', icon: 'pi-credit-card', routerLink: ['/caisse/encaissement'] },
      { label: 'Journal', icon: 'pi-file', routerLink: ['/caisse/journal-caisse'] },
      { label: 'Session', icon: 'pi-clock', routerLink: ['/caisse/session-caisse'] }
    ]
  },
  {
    label: 'Stocks',
    icon: 'pi-package',
    items: [
      { label: 'Vue stock', icon: 'pi-box', routerLink: ['/stock'] },
      { label: 'Approvisionnement', icon: 'pi-plus-circle', routerLink: ['/stock/approvisionnement'] },
      { label: 'Alertes stock', icon: 'pi-exclamation-circle', routerLink: ['/stock/alertes-stock'] },
      { label: 'Inventaire', icon: 'pi-book', routerLink: ['/stock/inventaire'] }
    ]
  },
  {
    label: 'Produits',
    icon: 'pi-tag',
    routerLink: ['/produits']
  },
  {
    label: 'Personnel',
    icon: 'pi-users',
    routerLink: ['/personnel']
  },
  {
    label: 'Rapports',
    icon: 'pi-bar-chart',
    routerLink: ['/rapports']
  },
  {
    label: 'Administration',
    icon: 'pi-cog',
    items: [
      { label: 'Dashboard', icon: 'pi-home', routerLink: ['/admin/dashboard'] },
      { label: 'Utilisateurs', icon: 'pi-user-plus', routerLink: ['/admin/users'] },
      { label: 'Paramètres', icon: 'pi-sliders-h', routerLink: ['/admin/settings'] }
    ]
  }
];