import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    ButtonModule
  ],
  template: `
    <div class="flex flex-col min-h-screen">
      <header class="bg-primary text-white shadow-md">
        <div class="flex items-center justify-between px-6 py-4">
          <div class="flex items-center space-x-3">
            <img src="assets/logo.png" alt="Logo" class="h-8 w-8">
            <span class="text-xl font-bold">BarOS POS</span>
          </div>
          <div class="flex items-center space-x-4">
            <button
              pButton
              type="button"
              icon="pi-bell"
              class="p-2 text-white hover:bg-primary-dark"
              (click)="sidebarVisible = true"
            ></button>
            <div class="relative">
              <button
                pButton
                type="button"
                icon="pi-user"
                class="p-2 text-white hover:bg-primary-dark"
                (click)="userMenuVisible = true"
              ></button>
            </div>
          </div>
        </div>
      </header>

      <div class="flex flex-1">
        <!-- Sidebar -->
        <aside class="w-64 bg-white border-r border-gray-200">
          <div class="p-4">
            <nav class="space-y-2">
              <!-- Navigation items will be dynamically generated based on role -->
              <ng-container *ngIf="authService.isAuthenticated()">
                <a
                  routerLink="/pos"
                  routerLinkActive="bg-blue-50 text-blue-600"
                  class="flex items-center px-3 py-2 rounded-md font-medium hover:bg-gray-50"
                >
                  <img src="assets/icons/pos.svg" alt="Point de vente" class="h-5 w-5 mr-2">
                  <span>Point de vente</span>
                </a>

                <a
                  routerLink="/caisse"
                  routerLinkActive="bg-blue-50 text-blue-600"
                  class="flex items-center px-3 py-2 rounded-md font-medium hover:bg-gray-50"
                  *ngIf="authService.isCaissier() || authService.isAdmin() || authService.isGerant()"
                >
                  <img src="assets/icons/caisse.svg" alt="Caisse" class="h-5 w-5 mr-2">
                  <span>Caisse</span>
                </a>

                <a
                  routerLink="/stock"
                  routerLinkActive="bg-blue-50 text-blue-600"
                  class="flex items-center px-3 py-2 rounded-md font-medium hover:bg-gray-50"
                  *ngIf="authService.isAdmin() || authService.isGerant()"
                >
                  <img src="assets/icons/stock.svg" alt="Stock" class="h-5 w-5 mr-2">
                  <span>Stocks</span>
                </a>

                <a
                  routerLink="/alertes-stock"
                  routerLinkActive="bg-blue-50 text-blue-600"
                  class="flex items-center px-3 py-2 rounded-md font-medium hover:bg-gray-50"
                  *ngIf="authService.isAdmin() || authService.isGerant()"
                >
                  <img src="assets/icons/alert.svg" alt="Alertes" class="h-5 w-5 mr-2">
                  <span>Alertes stock</span>
                </a>

                <a
                  routerLink="/produits"
                  routerLinkActive="bg-blue-50 text-blue-600"
                  class="flex items-center px-3 py-2 rounded-md font-medium hover:bg-gray-50"
                  *ngIf="authService.isAdmin() || authService.isGerant()"
                >
                  <img src="assets/icons/produits.svg" alt="Produits" class="h-5 w-5 mr-2">
                  <span>Produits</span>
                </a>

                <a
                  routerLink="/personnel"
                  routerLinkActive="bg-blue-50 text-blue-600"
                  class="flex items-center px-3 py-2 rounded-md font-medium hover:bg-gray-50"
                  *ngIf="authService.isAdmin() || authService.isGerant()"
                >
                  <img src="assets/icons/personnel.svg" alt="Personnel" class="h-5 w-5 mr-2">
                  <span>Personnel</span>
                </a>

                <a
                  routerLink="/rapports"
                  routerLinkActive="bg-blue-50 text-blue-600"
                  class="flex items-center px-3 py-2 rounded-md font-medium hover:bg-gray-50"
                  *ngIf="authService.isAdmin() || authService.isGerant()"
                >
                  <img src="assets/icons/rapports.svg" alt="Rapports" class="h-5 w-5 mr-2">
                  <span>Rapports</span>
                </a>
              </ng-container>
            </nav>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 p-6 overflow-y-auto bg-gray-50">
          <router-outlet></router-outlet>
        </main>
      </div>

      <!-- Sidebar for notifications (right side) -->
      <div class="fixed right-0 top-20 h-full w-64 bg-white border-l border-gray-200 z-50 transform translate-x-full transition-transform duration-300" [class.translate-x-0]="sidebarVisible">
        <div class="p-4">
          <h3 class="font-semibold mb-4">Notifications</h3>
          <div class="space-y-3">
            <!-- Notification items -->
            <div class="p-3 border rounded hover:bg-gray-50 cursor-pointer" *ngFor="let notification of notifications">
              <div class="flex justify-between items-start">
                <div>
                  <p class="font-medium">{{ notification.title }}</p>
                  <p class="text-sm text-gray-500">{{ notification.time }}</p>
                </div>
                <button pButton type="button" icon="pi-times" size="small" class="ml-2"></button>
              </div>
            </div>
          </div>
          <div class="mt-4">
            <button pButton type="button" label="Tout marquer comme lu" icon="pi-check" class="w-full"></button>
          </div>
        </div>
      </div>

      <!-- User menu dropdown -->
      <div class="fixed right-4 top-16 z-50 w-48" *ngIf="userMenuVisible">
        <div class="bg-white rounded-lg shadow-lg border border-gray-200">
          <div class="px-4 py-3">
            <p class="text-sm font-medium">{{ authService.profile()?.prenom }} {{ authService.profile()?.nom }}</p>
            <p class="text-xs text-gray-500">{{ authService.role() }}</p>
          </div>
          <div class="border-t border-gray-200">
            <nav class="py-1">
              <a
                routerLink="/profile"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Mon profil
              </a>
              <a
                (click)="logout()"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Déconnexion
              </a>
            </nav>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --primary-color: #1e40af;
    }
  `]
})
export class AppComponent {
  title = 'BarOS POS';
  sidebarVisible = false;
  userMenuVisible = false;
  notifications = [
    { title: 'Nouvelle commande reçue', time: 'Il y a 5 minutes' },
    { title: 'Stock critique: Whisky JB', time: 'Il y a 1 heure' }
  ];

  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
    this.userMenuVisible = false;
  }
}