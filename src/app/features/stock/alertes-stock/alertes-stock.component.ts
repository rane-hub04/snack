import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alertes-stock',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold">Alertes Stock</h1>
      <p class="mt-4 text-gray-600">Affichez et gérez les alertes de stock critiques et ruptures.</p>
    </div>
  `
})
export class AlertesStockComponent {}
