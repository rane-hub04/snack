import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { SidebarComponent } from './layout/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    NavbarComponent,
    SidebarComponent
  ],
  template: `
    <div class="flex flex-col min-h-screen">
      <app-navbar></app-navbar>
      <div class="flex flex-1">
        <app-sidebar></app-sidebar>
        <main class="flex-1 p-6 overflow-y-auto bg-gray-50">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --primary-color: #1e40af;
    }
  `]
})
export class AppComponent {
  title = 'BarOS POS';
}