import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-produits',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold">Produits</h1>
      <p class="mt-4 text-gray-600">Gestion des produits disponibles dans le bar.</p>
    </div>
  `
})
export class ProduitsComponent {}
