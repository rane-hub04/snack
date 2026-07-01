import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * PosteCertificationComponent - Module pour la gestion des postes et certifications
 * 
 * Fonctionnalités futures :
 * - Gestion des postes/métiers
 * - Gestion des certifications et compétences
 * - Suivi des formations
 * - Historique des postes occupés
 * - Attribution des certifications professionnelles
 * 
 * @standalone Le composant est indépendant
 */
@Component({
  selector: 'app-poste-certification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty-page">
      <h2>Poste et Certification</h2>
      <p>Cette page est en cours de développement...</p>
    </div>
  `,
  styles: [`
    .empty-page {
      padding: 2rem;
      text-align: center;
      color: #7f8c8d;
    }
    h2 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }
  `]
})
export class PosteCertificationComponent {}
