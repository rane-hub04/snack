import { Component, HostListener, OnDestroy } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnDestroy {
  menuItems: MenuItem[] = [];
  sidebarOpen = true;
  openSubmenus = new Set<string>();
  private routerSubscription!: Subscription;

  constructor(private router: Router) {
    this.buildMenu();
    this.sidebarOpen = !this.isMobile();
    this.routerSubscription = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd && this.isMobile() && this.sidebarOpen) {
        this.sidebarOpen = false;
        this.openSubmenus.clear();
      }
    });
  }

  private buildMenu(): void {
    this.menuItems = [
      {
        label: 'Point de vente',
        icon: 'pi-shopping-cart',
        items: [
          { label: 'Vue POS', icon: 'pi-desktop', routerLink: ['/pos'] },
          { label: 'Commande', icon: 'pi-shopping-basket', routerLink: ['/pos/commande-form'] },
          { label: 'Mes commandes', icon: 'pi-list', routerLink: ['/pos/mes-commandes'] },
          { label: 'Panier', icon: 'pi-shopping-cart', routerLink: ['/pos/panier'] },
          { label: 'Tables', icon: 'pi-table', routerLink: ['/pos/tables-grid'] }
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
  }

  /** Vérifie si la route passée est active (exact match) */
  isActive(route: any[] | string): boolean {
    if (Array.isArray(route)) {
      return this.router.isActive(this.router.createUrlTree(route), {
        paths: 'subset',
        queryParams: 'ignored',
        fragment: 'ignored',
        matrixParams: 'ignored'
      });
    } else {
      // string route
      return this.router.isActive(route, {
        paths: 'exact',
        queryParams: 'ignored',
        fragment: 'ignored',
        matrixParams: 'ignored'
      });
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    if (this.isMobile()) {
      this.sidebarOpen = false;
      this.openSubmenus.clear();
    }
  }

  itemHasChildren(item: MenuItem): boolean {
    return !!item.items?.length;
  }

  toggleSubmenu(item: MenuItem): void {
    const key = item.label || JSON.stringify(item.routerLink);
    if (this.openSubmenus.has(key)) {
      this.openSubmenus.delete(key);
    } else {
      this.openSubmenus.add(key);
    }
  }

  isSubmenuOpen(item: MenuItem): boolean {
    return this.openSubmenus.has(item.label || JSON.stringify(item.routerLink));
  }

  isMobile(): boolean {
    return window.innerWidth < 768;
  }

  @HostListener('window:resize')
  onResize(): void {
    if (!this.isMobile()) {
      this.sidebarOpen = true;
    }
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }
}