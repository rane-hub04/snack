import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './layout/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    SidebarComponent
  ],
  template: `
    <div class="app-root">
      <div class="app-shell">
        <div class="hamburger" [class.active]="showSidebar" (click)="toggleSidebar()" aria-label="Toggle sidebar">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </div>
        <app-sidebar [collapsed]="!showSidebar"></app-sidebar>
        <main class="app-main" [class.collapsed]="!showSidebar">
          <router-outlet></router-outlet>
        </main>
        <div class="navbar-overlay" [class.active]="showSidebar && isMobile()" (click)="toggleSidebar()"></div>
      </div>
    </div>
  `,
  styles: [`
    /* SCSS variables */
    $color-bg: #ffffff;
    $color-text: #2c3e50;
    $color-text-light: #7f8c8d;
    $color-accent: #ff9500;
    $color-accent-light: #ffb84d;
    $color-active: #ff9500;
    $color-overlay: rgba(0, 0, 0, 0.5);
    $color-shadow: rgba(0, 0, 0, 0.08);
    $color-danger: #e74c3c;
    $color-divider: #ecf0f1;
    $mobile: 768px;
    $transition-speed: 0.3s ease-in-out;

    :host {
      display: block;
      --primary-color: #1e40af;
      background: #f8fafc;
    }

    .app-root {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: #f8fafc;
    }

    .app-shell {
      display: flex;
      flex: 1;
      min-height: 0;
      position: relative;
    }

    /* Hamburger Button */
    .hamburger {
      display: none;
      flex-direction: column;
      background: none;
      border: none;
      cursor: pointer;
      padding: 5px;
      z-index: 1100;
      gap: 6px;

      &:focus {
        outline: none;
      }

      &:focus-visible {
        outline: 2px solid $color-accent;
        outline-offset: 2px;
        border-radius: 4px;
      }
    }

    .hamburger-line {
      display: block;
      width: 25px;
      height: 3px;
      background-color: $color-text;
      border-radius: 3px;
      transition: all $transition-speed;
    }

    .hamburger.active .hamburger-line {
      &:nth-child(1) {
        transform: rotate(45deg) translate(10px, 10px);
      }

      &:nth-child(2) {
        opacity: 0;
      }

      &:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -7px);
      }
    }

    /* Overlay */
    .navbar-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: $color-overlay;
      z-index: 999;
      opacity: 0;
      pointer-events: none;
      transition: opacity $transition-speed;

      &.active {
        opacity: 1;
        pointer-events: auto;
      }
    }

    /* Main content */
    .app-main {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
      min-height: 0;
      background: #f8fafc;
      transition: margin-left 0.3s ease;
      margin-left: 0;
    }

    /* When sidebar is expanded (desktop), shift main content */
    @media (min-width: 768px) {
      .app-main {
        margin-left: 250px; /* matches sidebar width */
      }
      .app-main.collapsed {
        margin-left: 60px; /* collapsed sidebar width */
      }
    }

    /* Mobile specific styles */
    @media (max-width: 767px) {
      .hamburger {
        display: flex;
      }
    }
  `]
})
export class AppComponent {
  title = 'BarOS POS';
  showSidebar = true;

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  isMobile(): boolean {
    return window.innerWidth < 768;
  }

  @HostListener('window:resize')
  onResize() {
    // We don't need to do anything here because the overlay visibility is computed in the template
    // and the hamburger display is handled by CSS.
    // However, we might want to close the sidebar when resizing to desktop?
    // Currently, we keep the sidebar state as is. That's acceptable.
  }
}