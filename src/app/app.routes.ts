import { Routes } from '@angular/router';

import { LoginComponent } from './login/login';


export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: '**', redirectTo: '' },
];
export const loginRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'login' }
];
import { AdminDashboardComponent } from './admin/admin-dashboard.component';
import { MenuComponent } from './features/gestions/menu/menu.component';
import { MesCommandesComponent } from './features/gestions/mes-commandes/mes-commandes.component';
import { GestionDesMenusComponent } from './features/gestions/gestion-des-menus/gestion-des-menus.component';
import { CaisseComponent } from './features/caisse/caisse.component';
import { EncaissementComponent } from './features/caisse/encaissement/encaissement.component';
import { JournalCaisseComponent } from './features/caisse/journal-caisse/journal-caisse.component';
import { SessionCaisseComponent } from './features/caisse/session-caisse/session-caisse.component';
import { StockComponent } from './features/stock/stock.component';
import { ApprovisionnementComponent } from './features/stock/approvisionnement/approvisionnement.component';
import { AlertesStockComponent } from './features/stock/alertes-stock/alertes-stock.component';
import { InventaireComponent } from './features/stock/inventaire/inventaire.component';
import { ProduitsComponent } from './features/produits/produits.component';
import { PersonnelComponent } from './features/personnel/personnel.component';
import { RapportsComponent } from './features/rapports/rapports.component';
import { UsersComponent } from './admin/users.component';
import { SettingsComponent } from './admin/settings.component';

export const routes: Routes = [
  { path: '', redirectTo: '/admin/dashboard', pathMatch: 'full' },
  { path: 'admin', redirectTo: '/admin/dashboard', pathMatch: 'full' },
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'admin/users', component: UsersComponent },
  { path: 'admin/settings', component: SettingsComponent },
  { path: 'gestions/menu', component: MenuComponent },
  { path: 'gestions/mes-commandes', component: MesCommandesComponent },
  { path: 'gestions/gestion-des-menus', component: GestionDesMenusComponent },
  { path: 'caisse', component: CaisseComponent },
  { path: 'caisse/encaissement', component: EncaissementComponent },
  { path: 'caisse/journal-caisse', component: JournalCaisseComponent },
  { path: 'caisse/session-caisse', component: SessionCaisseComponent },
  { path: 'stock', component: StockComponent },
  { path: 'stock/approvisionnement', component: ApprovisionnementComponent },
  { path: 'stock/alertes-stock', component: AlertesStockComponent },
  { path: 'stock/inventaire', component: InventaireComponent },
  { path: 'produits', component: ProduitsComponent },
  { path: 'personnel', component: PersonnelComponent },
  { path: 'rapports', component: RapportsComponent },
  { path: 'admin/products', redirectTo: '/admin/dashboard', pathMatch: 'full' },
  { path: 'admin/reports', redirectTo: '/admin/dashboard', pathMatch: 'full' }
>>>>>>> 6423d381f0d176079484b545e7f16da436a9b35d
];