import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { ToastService } from '../core/services/toast.service';
import { CommonModule } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { AvatarModule } from 'primeng/avatar';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    SidebarModule,
    AvatarModule,
    MenubarModule,
    ButtonModule,
    RippleModule,
    CommonModule
  ],
  template: `
    <div class="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-primary text-white shadow-md">
      <div class="flex items-center space-x-3 mb-4 md:mb-0">
        <img src="assets/logo.png" alt="Logo" class="h-8 w-8">
        <span class="text-xl font-bold">BarOS POS</span>
      </div>

      <div class="flex items-center space-x-4">
        <div class="relative">
          <button
            pButton
            type="button"
            icon="pi-bell"
            class="p-2 text-white hover:bg-primary-dark"
            (click)="sidebarVisible = true"
          ></button>
          <span *ngIf="unreadAlerts > 0" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {{ unreadAlerts }}
          </span>
        </div>

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

    <!-- Sidebar for notifications -->
    <p-sidebar [(visible)]="sidebarVisible" position="right" [fullScreen]="true">
      <ng-template pTemplate="header">
        <h5>Notifications</h5>
      </ng-template>
      <ng-template pTemplate="content">
        <!-- Notification list will go here -->
        <p>Notifications will be displayed here</p>
      </ng-template>
      <ng-template pTemplate="footer">
        <button
          pButton
          type="button"
          label="Voir toutes"
          icon="pi-eye"
          class="w-full"
          (click)="sidebarVisible = false"
        ></button>
      </ng-template>
    </p-sidebar>

    <!-- User menu -->
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
  `,
  styles: [`
    :host {
      --primary-color: #1e40af;
      --primary-color-dark: #1e3a8a;
    }
    .p-menuitem-link {
      color: var(--primary-color) !important;
    }
  `]
})
export class NavbarComponent {
  sidebarVisible = false;
  userMenuVisible = false;
  unreadAlerts = 0; // This would come from a service

  constructor(
    private auth: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  logout(): void {
    this.auth.logout().then(() => {
      this.toastService.success('Déconnexion', 'Vous avez été déconnecté avec succès');
    });
  }
}