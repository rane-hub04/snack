import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { AvatarModule } from 'primeng/avatar';
import { ChipModule } from 'primeng/chip';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { FcfaPipe } from '../shared/pipes/fcfa.pipe';
import { DateDoualaPipe } from '../shared/pipes/date-douala.pipe';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    TableModule,
    PaginatorModule,
    AvatarModule,
    ChipModule,
    ToggleButtonModule,
    ButtonModule,
    FcfaPipe,
    DateDoualaPipe
  ],
  template: `
    <div class="admin-dashboard p-6">
      <h1 class="text-2xl font-bold mb-4">Tableau de bord administrateur</h1>

      <!-- Stats Cards -->
      <div class="grid gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        <div class="p-4 bg-white rounded-lg shadow">
          <h3 class="text-lg font-semibold text-gray-600">Utilisateurs actifs</h3>
          <p class="text-3xl font-bold">{{ stats.activeUsers }}</p>
        </div>
        <div class="p-4 bg-white rounded-lg shadow">
          <h3 class="text-lg font-semibold text-gray-600">Ventes du jour</h3>
          <p class="text-3xl font-bold">{{ stats.todaySales | fcfa }}</p>
        </div>
        <div class="p-4 bg-white rounded-lg shadow">
          <h3 class="text-lg font-semibold text-gray-600">Commandes en attente</h3>
          <p class="text-3xl font-bold">{{ stats.pendingOrders }}</p>
        </div>
        <div class="p-4 bg-white rounded-lg shadow">
          <h3 class="text-lg font-semibold text-gray-600">Dernière sauvegarde</h3>
          <p class="text-3xl font-bold">{{ lastBackup | dateDouala }}</p>
        </div>
      </div>

      <!-- System Alerts & Recent Activity -->
      <div class="grid gap-6 mb-6">
        <!-- System Alerts -->
        <div class="col-span-1 lg:col-span-1">
          <p-card header="Alertes système">
            <div *ngIf="systemAlerts.length === 0" class="text-center py-4">
              <p class="text-muted-foreground">Aucune alerte</p>
            </div>
            <ul *ngIf="systemAlerts.length > 0" class="list-none space-y-2">
              <li *ngFor="let alert of systemAlerts" class="p-3 border rounded hover:bg-gray-50">
                <span class="pi pi-exclamation-triangle text-orange-500 mr-2"></span>
                <span>{{ alert }}</span>
              </li>
            </ul>
          </p-card>
        </div>

        <!-- Recent Activity -->
        <div class="col-span-1 lg:col-span-2">
          <p-card header="Activité récente">
            <div *ngFor="let act of recentActivities; let i = index" class="flex mb-3">
              <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full mr-3"
                   [ngClass]="{'bg-blue-100 text-blue-600': i % 2 === 0, 'bg-green-100 text-green-600': i % 2 === 1}">
                <i class="pi {{ getActivityIcon(act.action) }}"></i>
              </div>
              <div class="flex-1">
                <p class="font-medium">{{ act.user }}</p>
                <p class="text-sm text-gray-500">{{ actionDescription(act.action) }}</p>
                <p class="text-xs text-gray-400">{{ act.timestamp | dateDouala }}</p>
              </div>
            </div>
          </p-card>
        </div>
      </div>

      <!-- User Management Preview -->
      <p-card header="Aperçu de la gestion des utilisateurs">
        <p-table [value]="users" [paginator]="true" [rows]="5">
          <ng-template pTemplate="header">
            <tr>
              <th>Nom</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Dernière connexion</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-user>
            <tr>
              <td>
                <div class="flex items-center space-x-2">
                  <p-avatar image="{{ user.avatar }}" size="normal" label="{{ user.name.charAt(0) }}"></p-avatar>
                  <span>{{ user.name }}</span>
                </div>
              </td>
              <td>
                <p-chip [label]="user.role" [styleClass]="getRoleSeverity(user.role)"></p-chip>
              </td>
              <td>
                <p-chip [label]="user.status" [styleClass]="user.status === 'Actif' ? 'chip-success' : 'chip-danger'"></p-chip>
              </td>
              <td>{{ user.lastLogin | dateDouala }}</td>
            </tr>
          </ng-template>
        </p-table>
        <div class="mt-3 text-right">
          <button pButton type="button" label="Gérer les utilisateurs" icon="pi-users" class="mr-2" (click)="navigateTo('users')"></button>
          <button pButton type="button" label="Ajouter utilisateur" icon="pi-plus" class="p-button-text" (click)="navigateTo('users')"></button>
        </div>
      </p-card>

      <!-- System Settings -->
      <p-card header="Paramètres système rapides">
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span>Notifications email</span>
            <p-toggleButton [(ngModel)]="emailNotifications" (onChange)="toggleEmailNotifications($event)"></p-toggleButton>
          </div>
          <div class="flex justify-between items-center">
            <span>Sauvegarde automatique</span>
            <p-toggleButton [(ngModel)]="autoBackup" (onChange)="toggleAutoBackup($event)"></p-toggleButton>
          </div>
          <div class="flex justify-between items-center">
            <span>Maintenance mode</span>
            <p-toggleButton [(ngModel)]="maintenanceMode" (onChange)="toggleMaintenanceMode($event)"></p-toggleButton>
          </div>
        </div>
      </p-card>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  adminName = 'Administrateur';
  adminRole = 'Administrateur Système';

  stats = {
    activeUsers: 12,
    todaySales: 450000,
    pendingOrders: 5
  };

  systemAlerts: string[] = ['Sauvegarde en cours', 'Mise à jour disponible'];

  lastBackup = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago

  recentActivities = [
    { user: 'admin', action: 'user_created', type: 'success', timestamp: new Date(Date.now() - 5 * 60 * 1000) },
    { user: 'gerant', action: 'stock_updated', type: 'info', timestamp: new Date(Date.now() - 15 * 60 * 1000) },
    { user: 'caissier', action: 'payment_failed', type: 'error', timestamp: new Date(Date.now() - 30 * 60 * 1000) },
    { user: 'admin', action: 'settings_updated', type: 'warning', timestamp: new Date(Date.now() - 45 * 60 * 1000) },
    { user: 'personnel', action: 'profile_updated', type: 'success', timestamp: new Date(Date.now() - 60 * 60 * 1000) }
  ];

  users = [
    { name: 'Marie Kameni', role: 'Caissier', status: 'Actif', avatar: 'assets/user1.png', lastLogin: new Date(Date.now() - 30 * 60 * 1000) },
    { name: 'Jean Fut', role: 'Serveur', status: 'Actif', avatar: 'assets/user2.png', lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { name: 'Alice Tou', role: 'Gérant', status: 'Inactif', avatar: 'assets/user3.png', lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    { name: 'Samuel Kengne', role: 'Admin', status: 'Actif', avatar: 'assets/user4.png', lastLogin: new Date(Date.now() - 10 * 60 * 1000) }
  ];

  emailNotifications = true;
  autoBackup = true;
  maintenanceMode = false;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    // Initialize any data or subscriptions
  }

  getActivityIcon(action: string): string {
    const icons: { [key: string]: string } = {
      'user_created': 'user-plus',
      'stock_updated': 'sync',
      'payment_failed': 'credit-card',
      'settings_updated': 'cog',
      'profile_updated': 'user-edit',
      'login': 'sign-in',
      'logout': 'sign-out'
    };
    return icons[action] || 'info-circle';
  }

  actionDescription(action: string): string {
    const actions: { [key: string]: string } = {
      'user_created': 'Nouvel utilisateur créé',
      'stock_updated': 'Stock mis à jour',
      'payment_failed': 'Échec de paiement détecté',
      'settings_updated': 'Paramètres modifiés',
      'profile_updated': 'Profil mis à jour',
      'login': 'Connexion utilisateur',
      'logout': 'Déconnexion utilisateur'
    };
    return actions[action] || action;
  }

  // Return a CSS class name to apply to the p-chip instead of binding to a non-existent "severity" input
  getRoleSeverity(role: string): string | undefined {
    switch (role) {
      case 'Admin': return 'chip-success';
      case 'Gérant': return 'chip-info';
      case 'Caissier': return 'chip-warning';
      case 'Serveur': return 'chip-success';
      default: return undefined;
    }
  }

  toggleEmailNotifications(event: any): void {
    this.messageService.add({ severity: 'info', summary: 'Paramètre mis à jour', detail: `Notifications email ${event.checked ? 'activées' : 'désactivées'}` });
  }

  toggleAutoBackup(event: any): void {
    this.messageService.add({ severity: 'info', summary: 'Paramètre mis à jour', detail: `Sauvegarde automatique ${event.checked ? 'activée' : 'désactivée'}` });
  }

  toggleMaintenanceMode(event: any): void {
    if (event.checked) {
      this.messageService.add({ severity: 'warn', summary: 'Mode maintenance', detail: 'Le système sera bientôt en maintenance' });
    } else {
      this.messageService.add({ severity: 'success', summary: 'Mode maintenance', detail: 'Le système revient en ligne' });
    }
  }

  navigateTo(section: string): void {
    // In a real app, this would navigate to the appropriate admin section
    this.messageService.add({ severity: 'info', summary: 'Navigation', detail: `Redirection vers ${section}` });
  }
}