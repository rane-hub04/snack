import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-card">
      <h2>Paramètres</h2>
      <p>Configuration générale de l’application.</p>
    </section>
  `,
  styles: [
    `:host { display: block; }`,
    `.page-card { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 8px 24px rgba(0,0,0,0.06); }`,
    `h2 { margin: 0 0 8px; color: #2c3e50; }`,
    `p { margin: 0; color: #7f8c8d; }`
  ]
})
export class SettingsComponent {}
