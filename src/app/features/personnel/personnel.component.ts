import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-personnel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold">Personnel</h1>
      <p class="mt-4 text-gray-600">Liste et gestion du personnel du bar.</p>
    </div>
  `
})
export class PersonnelComponent {}
