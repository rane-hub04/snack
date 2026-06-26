import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterModule,
    MenuModule,
    CommonModule
  ],
  template: `
    <div class="sidebar-menu h-full">
      <div class="flex items-center p-4 border-b">
        <div class="flex-shrink-0">
          <img src="assets/logo.png" alt="Logo" class="h-8 w-8">
        </div>
        <div class="ml-3">
          <span class="font-medium text-gray-900">BarOS POS</span>
        </div>
      </div>

      <div class="flex-1 overflow-auto">
        <ul class="space-y-1 p-4">
          <li *ngFor="let item of menuItems" class="mb-1">
            <a
              [routerLink]="item.routerLink"
              routerLinkActive="active"
              [class.active]="isActive(item.routerLink)"
              class="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <i class="pi {{ item.icon }} mr-3"></i>
              <span>{{ item.label }}</span>
            </a>
          </li>
        </ul>
      </div>

      <div class="border-t">
        <div class="p-4">
          <button
            pButton
            type="button"
            label="Se déconnecter"
            icon="pi pi-sign-out"
            class="w-full"
            (click)="logout()"
          ></button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sidebar-menu {
      background-color: white;
      border-right: 1px solid #e2e8f0;
      width: 250px;
    }
    .active {
      background-color: #ebf8ff !important;
      color: #1e40af !important;
      font-weight: 600;
    }
    .active .pi {
      color: #1e40af !important;
    }
  `]
})
export class SidebarComponent {
  menuItems: MenuItem[] = [];

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    this.buildMenu();
  }

  private buildMenu(): void {
    const role = this.auth.role() ?? '';

    // Base items that everyone sees (point of sale)
    const baseItems: MenuItem[] = [
      { label: 'Point de vente', icon: 'pi-shopping-cart', routerLink: ['/pos'] }
    ];

    // Items for cashier and above (caisse, etc.)
    const cashierAndAboveItems: MenuItem[] = [
      { label: 'Caisse', icon: 'pi-banknote', routerLink: ['/caisse'] }
    ];

    // Items for managers and admins (stock, products, personnel, reports)
    const managerAndAboveItems: MenuItem[] = [
      { label: 'Stocks', icon: 'pi-package', routerLink: ['/stock'] },
      { label: 'Produits', icon: 'pi-tag', routerLink: ['/produits'] },
      { label: 'Personnel', icon: 'pi-users', routerLink: ['/personnel'] },
      { label: 'Rapports', icon: 'pi-bar-chart', routerLink: ['/rapports'] }
    ];

    // Items specific to admin (user management, settings, admin dashboard)
    const adminItems: MenuItem[] = [
      { label: 'Administration', icon: 'pi-cog', routerLink: ['/admin'] },
      { label: 'Tableau de bord admin', icon: 'pi-chart-bar', routerLink: ['/admin/dashboard'] },
      { label: 'Utilisateurs', icon: 'pi-user-plus', routerLink: ['/admin/users'] },
      { label: 'Produits admin', icon: 'pi-box', routerLink: ['/admin/products'] },
      { label: 'Rapports admin', icon: 'pi-chart-line', routerLink: ['/admin/reports'] },
      { label: 'Paramètres', icon: 'pi-cog', routerLink: ['/admin/settings'] }
    ];

    let items: MenuItem[] = [...baseItems];

    if (['admin', 'gerant', 'caissier'].includes(role)) {
      items = [...items, ...cashierAndAboveItems];
    }

    if (['admin', 'gerant'].includes(role)) {
      items = [...items, ...managerAndAboveItems];
    }

    if (role === 'admin') {
      items = [...items, ...adminItems];
    }

    this.menuItems = items;
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

  /** Déconnexion */
  logout(): void {
    this.auth.logout();
  }
}