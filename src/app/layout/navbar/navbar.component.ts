import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { AlerteService } from '../../core/services/alerte.service';
import { Alerte } from '../../core/models/alerte.model';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgIf,
    NgFor,
    DatePipe,
    DrawerModule,
    ButtonModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  sidebarVisible = false;
  userMenuVisible = false;

  constructor(
    public auth: AuthService,
    private router: Router,
    private toastService: ToastService,
    private alerteService: AlerteService
  ) {}

  /** Déconnexion utilisateur */
  logout(): void {
    this.auth.logout().then(() => {
      this.toastService.success('Déconnexion', 'Vous avez été déconnecté avec succès');
    }).catch(error => {
      this.toastService.error('Erreur', 'Impossible de se déconnecter');
      console.error('Logout error:', error);
    });
  }

  /** Vérifie si la route courante correspond au path fourni (utile pour les classes actives) */
  isActiveRoute(path: string): boolean {
    return this.router.isActive(path, { paths: 'exact', queryParams: 'ignored', fragment: 'ignored', matrixParams: 'ignored' });
  }

  /** Getter for nonLues signal */
  nonLues(): number {
    return this.alerteService.nonLues();
  }

  /** Getter for alertes signal */
  alertes(): Alerte[] {
    return this.alerteService.alertes();
  }

  /** Marquer une alerte comme lue (rafraîchit le compteur) */
  async marquerCommeLue(alerteId: string): Promise<void> {
    const result = await this.alerteService.marquerCommeLue(alerteId);
    if (result.success) {
      this.toastInfo('Notification marquée comme lue');
    } else {
      this.toastService.error('Erreur', result.error ?? 'Impossible de marquer la notification comme lue');
    }
  }

  /** Helper for toast info */
  private toastInfo(detail: string): void {
    this.toastService.info('Info', detail);
  }

  /** Retourne un titre lisible selon le type d'alerte */
  getAlertTitle(alerte: Alerte): string {
    switch (alerte.type_alerte) {
      case 'stock_critique': return 'Stock critique';
      case 'stock_rupture': return 'Rupture de stock';
      case 'caisse': return 'Caisse';
      case 'autre': return 'Autre';
      default: return 'Notification';
    }
  }
}