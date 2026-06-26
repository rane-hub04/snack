import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
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
              [routerLink]="item.route"
              routerLinkActive="active"
              [class.active]="isActive(item.route)"
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
  menuItems: any[] = [];

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    this.buildMenu();
  }

  private buildMenu(): void {
    const role = this.auth.role();

    // Base items that everyone sees
    const baseItems = [
      { label: 'Point de vente', icon: 'pi-shopping-cart', route: ['/pos'] }
    ];

    // Items for cashier and above
    const cashierAndAboveItems = [
      { label: 'Caisse', icon: 'pi-banknote', route: ['/caisse'] }
    ];

    // Items for managers and admins
    const managerAndAboveItems = [
      { label: 'Stocks', icon: 'pi-package', route: ['/stock'] },
      { label: 'Produits', icon: 'pi-tag', route: ['/produits'] },
      { label: 'Personnel', icon: 'pi-users', route: ['/personnel'] },
      { label: 'Rapports', icon: 'pi-bar-chart', route: ['/rapports'] }
    ];

    // Items specific to admin
    const adminItems = [
      { label: 'Administration', icon: 'pi-cog', route: ['/admin'] },
      // subitems could be added via nested menu but for simplicity we add top-level items
      { label: 'Admin Dashboard', icon: 'pi-chart-bar', route: ['/admin/dashboard'] },
      { label: 'Utilisateurs', icon: 'pi-user-plus', route: ['/admin/users'] },
      { label: 'Produits', icon: 'pi-box', route: ['/admin/products'] },
      { label: 'Rapports', icon: 'pi-chart-line', route: ['/admin/reports'] },
      { label: 'Paramètres', icon: 'pi-cog', route: ['/admin/settings'] }
    ];

    let items = [...baseItems];

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

  isActive(route: any[]): boolean {
    return this.router.isActive(this.router.createUrlTree(route), {
      paths: 'subset',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored'
    });
  }

  logout(): void {
    this.auth.logout();
  }
}