import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * PersonnelComponent - Composant principal pour la gestion du personnel
 * 
 * Rôle : Affiche la navigation vers les différents modules de gestion du personnel
 * - Planning hebdomadaire
 * - Pointage et Paie
 * - Poste et Certification
 * - Communication d'équipe
 * - Conformité RCH
 * 
 * Ce composant utilise un système de routing avec une barre de navigation responsive
 * @standalone Le composant est indépendant et ne nécessite pas de module NgModule
 */
@Component({
  selector: 'app-personnel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './personnel.component.html',
  styleUrls: ['./personnel.component.scss']
})
export class PersonnelComponent {
  // Flag pour gérer l'affichage du menu mobile (responsive)
  menuOpen = false;

  /**
   * Liste des modules disponibles dans le personnel
   * Chaque module contient :
   * - name: titre du module
   * - route: chemin de navigation relative
   */
  modules = [
    { name: 'Planning', route: 'planning' },
    { name: 'Pointage et Paie', route: 'pointage-paie' },
    { name: 'Poste et Certification', route: 'poste-certification' },
    { name: "Communication d'équipe", route: 'communication' },
    { name: 'Conformité RCH', route: 'conformite-rch' }
  ];

  /**
   * Bascule l'état du menu (ouvert/fermé)
   * Utilisé pour la navigation responsive sur mobile
   */
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  /**
   * Ferme le menu
   * Appelé après la sélection d'un lien de navigation
   */
  closeMenu(): void {
    this.menuOpen = false;
  }
}
