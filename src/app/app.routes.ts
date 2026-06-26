import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin/admin-dashboard.component';
import { AdminUsersComponent } from './admin/users.component';
import { AdminSettingsComponent } from './admin/settings.component';
import { PosComponent } from './features/pos/pos.component';
import { CaisseComponent } from './features/caisse/caisse.component';
import { StockComponent } from './features/stock/stock.component';
import { ProduitsComponent } from './features/produits/produits.component';
import { PersonnelComponent } from './features/personnel/personnel.component';
import { RapportsComponent } from './features/rapports/rapports.component';

export const routes: Routes = [
  { path: '', redirectTo: '/admin/dashboard', pathMatch: 'full' },
  { path: 'admin', redirectTo: '/admin/dashboard', pathMatch: 'full' },
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'pos', component: PosComponent },
  { path: 'caisse', component: CaisseComponent },
  { path: 'stock', component: StockComponent },
  { path: 'produits', component: ProduitsComponent },
  { path: 'personnel', component: PersonnelComponent },
  { path: 'rapports', component: RapportsComponent },
  // Admin sub-routes
  { path: 'admin/users', component: AdminUsersComponent },
  { path: 'admin/products', redirectTo: '/admin/dashboard', pathMatch: 'full' },
  { path: 'admin/reports', redirectTo: '/admin/dashboard', pathMatch: 'full' },
  { path: 'admin/settings', component: AdminSettingsComponent }
];