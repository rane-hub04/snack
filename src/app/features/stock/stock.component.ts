import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold">Stock</h1>
      <p class="mt-4 text-gray-600">Consultez et gérez les niveaux de stock des produits.</p>
    </div>
  `
})
export class StockComponent {}
