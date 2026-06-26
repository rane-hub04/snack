import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin/admin-dashboard.component';
import { PosComponent } from './features/pos/pos.component';
import { CommandeFormComponent } from './features/pos/commande-form/commande-form.component';
import { PanierComponent } from './features/pos/panier/panier.component';
import { MesCommandesComponent } from './features/pos/mes-commandes/mes-commandes.component';
import { TablesGridComponent } from './features/pos/tables-grid/tables-grid.component';
import { CaisseComponent } from './features/caisse/caisse.component';
import { EncaissementComponent } from './features/caisse/encaissement/encaissement.component';
import { SessionCaisseComponent } from './features/caisse/session-caisse/session-caisse.component';
import { JournalCaisseComponent } from './features/caisse/journal-caisse/journal-caisse.component';
import { StockComponent } from './features/stock/stock.component';
import { InventaireComponent } from './features/stock/inventaire/inventaire.component';
import { ApprovisionnementComponent } from './features/stock/approvisionnement/approvisionnement.component';
import { AlertesStockComponent } from './features/stock/alertes-stock/alertes-stock.component';
import { PersonnelComponent } from './features/personnel/personnel.component';
import { ProduitsComponent } from './features/produits/produits.component';
import { RapportsComponent } from './features/rapports/rapports.component';

export const routes: Routes = [
  { path: '', redirectTo: '/pos', pathMatch: 'full' },
  { path: 'pos', component: PosComponent },
  { path: 'pos/commande', component: CommandeFormComponent },
  { path: 'pos/panier', component: PanierComponent },
  { path: 'pos/mes-commandes', component: MesCommandesComponent },
  { path: 'pos/tables', component: TablesGridComponent },
  { path: 'caisse', component: CaisseComponent },
  { path: 'caisse/encaissement', component: EncaissementComponent },
  { path: 'caisse/session', component: SessionCaisseComponent },
  { path: 'caisse/journal', component: JournalCaisseComponent },
  { path: 'stock', component: StockComponent },
  { path: 'stock/inventaire', component: InventaireComponent },
  { path: 'stock/approvisionnement', component: ApprovisionnementComponent },
  { path: 'stock/alertes', component: AlertesStockComponent },
  { path: 'produits', component: ProduitsComponent },
  { path: 'personnel', component: PersonnelComponent },
  { path: 'rapports', component: RapportsComponent },
  { path: 'admin', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  { path: 'admin/dashboard', component: AdminDashboardComponent }
];