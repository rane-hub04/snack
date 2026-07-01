import { Routes } from '@angular/router';

// ============ IMPORTS DES COMPOSANTS ============
// Module de login
import { LoginComponent } from './login/login';

// Module Admin
import { AdminDashboardComponent } from './admin/admin-dashboard.component';
import { UsersComponent } from './admin/users.component';
import { SettingsComponent } from './admin/settings.component';

// Module Gestions (Menus et Commandes)
import { MenuComponent } from './features/gestions/menu/menu.component';
import { MesCommandesComponent } from './features/gestions/mes-commandes/mes-commandes.component';
import { GestionDesMenusComponent } from './features/gestions/gestion-des-menus/gestion-des-menus.component';

// Module Caisse (Paiements et Sessions)
import { CaisseComponent } from './features/caisse/caisse.component';
import { EncaissementComponent } from './features/caisse/encaissement/encaissement.component';
import { JournalCaisseComponent } from './features/caisse/journal-caisse/journal-caisse.component';
import { SessionCaisseComponent } from './features/caisse/session-caisse/session-caisse.component';

// Module Stock (Inventaire et Approvisionnement)
import { StockComponent } from './features/stock/stock.component';
import { ApprovisionnementComponent } from './features/stock/approvisionnement/approvisionnement.component';
import { AlertesStockComponent } from './features/stock/alertes-stock/alertes-stock.component';
import { InventaireComponent } from './features/stock/inventaire/inventaire.component';

// Module Produits
import { ProduitsComponent } from './features/produits/produits.component';

// Module Personnel (Planning, Pointage, Certifications, Communication, Conformité)
import { PersonnelComponent } from './features/personnel/personnel.component';
import { PlanningComponent } from './features/personnel/planning/planning.component';
import { PointagePaieComponent } from './features/personnel/pointage-paie/pointage-paie.component';
import { PosteCertificationComponent } from './features/personnel/poste-certification/poste-certification.component';
import { CommunicationComponent } from './features/personnel/communication/communication.component';
import { ConformiteRchComponent } from './features/personnel/conformite-rch/conformite-rch.component';

// Module Rapports
import { RapportsComponent } from './features/rapports/rapports.component';

/**
 * CONFIGURATION DES ROUTES PRINCIPALES DE L'APPLICATION
 * 
 * Structure :
 * - Route par défaut : redirection vers le dashboard admin
 * - Admin : gestion générale de l'application
 * - Gestions : gestion des menus et commandes
 * - Caisse : gestion des paiements et sessions
 * - Stock : gestion des produits et approvisionnement
 * - Produits : consultation des produits
 * - Personnel : gestion du personnel (planning, paie, certifications, etc.)
 * - Rapports : générations de rapports
 * 
 * Les routes avec "children" utilisent le routing nested (routing imbriqué)
 */
export const routes: Routes = [
  // ============ ROUTES PAR DÉFAUT ============
  // Redirection de la racine vers le dashboard
  { path: '', redirectTo: '/admin/dashboard', pathMatch: 'full' },
  // Redirection de /admin vers le dashboard
  { path: 'admin', redirectTo: '/admin/dashboard', pathMatch: 'full' },
  
  // ============ MODULE ADMIN ============
  // Dashboard principal
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  // Gestion des utilisateurs
  { path: 'admin/users', component: UsersComponent },
  // Paramètres de l'application
  { path: 'admin/settings', component: SettingsComponent },
  
  // ============ MODULE GESTIONS (Menus et Commandes) ============
  { path: 'gestions/menu', component: MenuComponent },
  { path: 'gestions/mes-commandes', component: MesCommandesComponent },
  { path: 'gestions/gestion-des-menus', component: GestionDesMenusComponent },
  
  // ============ MODULE CAISSE (Paiements) ============
  { path: 'caisse', component: CaisseComponent },
  { path: 'caisse/encaissement', component: EncaissementComponent },
  { path: 'caisse/journal-caisse', component: JournalCaisseComponent },
  { path: 'caisse/session-caisse', component: SessionCaisseComponent },
  
  // ============ MODULE STOCK (Inventaire et Approvisionnement) ============
  { path: 'stock', component: StockComponent },
  { path: 'stock/approvisionnement', component: ApprovisionnementComponent },
  { path: 'stock/alertes-stock', component: AlertesStockComponent },
  { path: 'stock/inventaire', component: InventaireComponent },
  
  // ============ MODULE PRODUITS ============
  { path: 'produits', component: ProduitsComponent },
  
  // ============ MODULE PERSONNEL (avec routing nested) ============
  // Route principale Personnel avec ses sous-routes
  { 
    path: 'personnel', 
    component: PersonnelComponent,
    // Routes enfants : chaque module du personnel
    children: [
      // Planning hebdomadaire des employés
      { path: 'planning', component: PlanningComponent },
      // Gestion du pointage et de la paie
      { path: 'pointage-paie', component: PointagePaieComponent },
      // Gestion des postes et certifications
      { path: 'poste-certification', component: PosteCertificationComponent },
      // Communication d'équipe
      { path: 'communication', component: CommunicationComponent },
      // Conformité RCH (Ressources Humaines)
      { path: 'conformite-rch', component: ConformiteRchComponent },
      // Redirection par défaut vers le planning
      { path: '', redirectTo: 'planning', pathMatch: 'full' }
    ]
  },
  
  // ============ MODULE RAPPORTS ============
  { path: 'rapports', component: RapportsComponent },
  
  // ============ REDIRECTIONS (anciennes routes) ============
  { path: 'admin/products', redirectTo: '/admin/dashboard', pathMatch: 'full' },
  { path: 'admin/reports', redirectTo: '/admin/dashboard', pathMatch: 'full' },
  
  // ============ ROUTE PAR DÉFAUT (WILDCARD) ============
  // Capture toutes les routes non définies et les redirige vers le dashboard
  { path: '**', redirectTo: '/admin/dashboard', pathMatch: 'full' }
];