import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin/admin-dashboard.component';
import { AdminUsersComponent } from './admin/users.component';
import { AdminSettingsComponent } from './admin/settings.component';
import { PosComponent } from './features/pos/pos.component';
import { CommandeFormComponent } from './features/pos/commande-form/commande-form.component';
import { MesCommandesComponent } from './features/pos/mes-commandes/mes-commandes.component';
import { PanierComponent } from './features/pos/panier/panier.component';
import { TablesGridComponent } from './features/pos/tables-grid/tables-grid.component';
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

export const routes: Routes = [
  { path: '', redirectTo: '/admin/dashboard', pathMatch: 'full' },
  { path: 'admin', redirectTo: '/admin/dashboard', pathMatch: 'full' },
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'pos', component: PosComponent },
  { path: 'pos/commande-form', component: CommandeFormComponent },
  { path: 'pos/mes-commandes', component: MesCommandesComponent },
  { path: 'pos/panier', component: PanierComponent },
  { path: 'pos/tables-grid', component: TablesGridComponent },
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
  // Admin sub-routes
  { path: 'admin/users', component: AdminUsersComponent },
  { path: 'admin/products', redirectTo: '/admin/dashboard', pathMatch: 'full' },
  { path: 'admin/reports', redirectTo: '/admin/dashboard', pathMatch: 'full' },
  { path: 'admin/settings', component: AdminSettingsComponent }
];