import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * CommunicationComponent - Module pour la communication d'équipe
 * 
 * Fonctionnalités futures :
 * - Système de messagerie interne
 * - Tableaux d'affichage
 * - Annonces et notifications
 * - Forums de discussion
 * - Gestion des réunions d'équipe
 * - Chat en temps réel
 * 
 * @standalone Le composant est indépendant
 */
@Component({
  selector: 'app-communication',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty-page">
      <h2>Communication d'équipe</h2>
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
export class CommunicationComponent {}
