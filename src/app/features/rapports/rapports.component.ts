import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rapports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold">Rapports</h1>
      <p class="mt-4 text-gray-600">Consultez les rapports financiers et de vente.</p>
    </div>
  `
})
export class RapportsComponent {}
