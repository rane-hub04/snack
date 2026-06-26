import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold">Paramètres</h1>
      <p class="mt-4 text-gray-600">Interface de paramètres (à implémenter).</p>
    </div>
  `
})
export class AdminSettingsComponent {}