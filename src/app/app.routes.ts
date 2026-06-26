import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'pos',
    loadComponent: () => import('./features/pos/pos.component').then(m => m.PosComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['serveur', 'caissier', 'gerant', 'admin'] }
  },
  {
    path: 'caisse',
    loadComponent: () => import('./features/caisse/caisse.component').then(m => m.CaisseComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['caissier', 'gerant', 'admin'] }
  },
  {
    path: 'stock',
    loadComponent: () => import('./features/stock/stock.component').then(m => m.StockComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['gerant', 'admin'] }
  },
  {
    path: 'produits',
    loadComponent: () => import('./features/produits/produits.component').then(m => m.ProduitsComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['gerant', 'admin'] }
  },
  {
    path: 'personnel',
    loadComponent: () => import('./features/personnel/personnel.component').then(m => m.PersonnelComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['gerant', 'admin'] }
  },
  {
    path: 'rapports',
    loadComponent: () => import('./features/rapports/rapports.component').then(m => m.RapportsComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['gerant', 'admin'] }
  },
  {
    path: 'alertes-stock',
    loadComponent: () => import('./features/stock/alertes-stock/alertes-stock.component').then(m => m.AlertesStockComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['gerant', 'admin'] }
  },
  // Admin routes
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['admin'] },
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: 'users', loadComponent: () => import('./admin/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'products', loadComponent: () => import('./admin/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'reports', loadComponent: () => import('./admin/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'settings', loadComponent: () => import('./admin/admin-dashboard.component').then(m => m.AdminDashboardComponent) }
    ]
  },
  { path: '**', redirectTo: '' }
];