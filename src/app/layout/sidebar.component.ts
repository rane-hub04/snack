import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
//import { Profile } from '../../models/profile.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterModule,
    MenuModule,
    CommonModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() collapsed = false;
  menuItems: MenuItem[] = [];

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    this.buildMenu();
  }

  private buildMenu(): void {
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
      { label: 'Utilisateurs', icon: 'pi-user-plus', routerLink: ['/admin/users'] },
      { label: 'Paramètres', icon: 'pi-cog', routerLink: ['/admin/settings'] }
    ];

    let items: MenuItem[] = [...baseItems, ...cashierAndAboveItems, ...managerAndAboveItems, ...adminItems];

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

  /** Get current user profile */
  get profile() {
    return this.auth.profile();
  }

  /** Get user's full name */
  get fullName(): string {
    const profile = this.profile;
    if (!profile) return '';
    return `${profile.prenom} ${profile.nom}`.trim();
  }

  /** Get user's initials for avatar */
  get initials(): string {
    const profile = this.profile;
    if (!profile) return '?';

    const first = profile.prenom ? profile.prenom[0] : '';
    const last = profile.nom ? profile.nom[0] : '';
    return (first + last).toUpperCase() || '?';
  }

  /** Get user role label in French */
  get roleLabel(): string {
    const profile = this.profile;
    if (!profile) return '';

    const roleMap: Record<string, string> = {
      'admin': 'Administrateur',
      'gerant': 'Gérant',
      'caissier': 'Caissier',
      'serveur': 'Serveur'
    };

    return roleMap[profile.role] || profile.role;
  }
}