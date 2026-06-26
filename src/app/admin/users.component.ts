import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold">Gestion des utilisateurs</h1>
      <p class="mt-4 text-gray-600">Interface de gestion des utilisateurs (à implémenter).</p>
    </div>
  `
})
export class AdminUsersComponent {}