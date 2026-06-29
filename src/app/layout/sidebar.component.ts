import { Component, HostListener, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { SIDEBAR_MENU } from './sidebar-menu.config';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnDestroy {
  menuItems: MenuItem[] = [];
  sidebarOpen = true;
  openSubmenus = new Set<string>();
  @ViewChild('sidebarRef') sidebarRef!: ElementRef<HTMLElement>;
  private previousActiveElement: HTMLElement | null = null;
  private focusTrapListener: ((e: KeyboardEvent) => void) | null = null;
  private routerSubscription!: Subscription;

  constructor(private router: Router) {
    this.menuItems = SIDEBAR_MENU;
    this.sidebarOpen = !this.isMobile();
    this.routerSubscription = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd && this.isMobile() && this.sidebarOpen) {
        this.sidebarOpen = false;
        this.openSubmenus.clear();
      }
    });
  }

  /** Vérifie si la route passée est active (exact match) */
  isActive(route: any[] | string): boolean {
    if (Array.isArray(route)) {
      return this.router.isActive(this.router.createUrlTree(route), {
        paths: 'subset',
        queryParams: 'ignored',
        fragment: 'ignored',
        matrixParams: 'ignored'
      });
    } else {
      // string route
      return this.router.isActive(route, {
        paths: 'exact',
        queryParams: 'ignored',
        fragment: 'ignored',
        matrixParams: 'ignored'
      });
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
    if (this.sidebarOpen && this.isMobile()) {
      this.enableFocusTrap();
    } else {
      this.disableFocusTrap();
    }
  }

  closeSidebar(): void {
    if (this.isMobile()) {
      this.sidebarOpen = false;
      this.openSubmenus.clear();
      this.disableFocusTrap();
    }
  }

  itemHasChildren(item: MenuItem): boolean {
    return !!item.items?.length;
  }

  toggleSubmenu(item: MenuItem, index?: number): void {
    const key = (item as any).id || (typeof index === 'number' ? `menu-${index}` : item.label || JSON.stringify(item.routerLink));
    if (this.openSubmenus.has(key)) {
      this.openSubmenus.delete(key);
    } else {
      this.openSubmenus.add(key);
    }
  }

  isSubmenuOpen(item: MenuItem, index?: number): boolean {
    const key = (item as any).id || (typeof index === 'number' ? `menu-${index}` : item.label || JSON.stringify(item.routerLink));
    return this.openSubmenus.has(key);
  }

  isMobile(): boolean {
    return window.innerWidth < 768;
  }

  @HostListener('window:resize')
  onResize(): void {
    if (!this.isMobile()) {
      this.sidebarOpen = true;
      this.disableFocusTrap();
    }
  }

  /** Focus trap helpers for mobile sidebar */
  private getFocusableElements(): HTMLElement[] {
    if (!this.sidebarRef) return [];
    const container = this.sidebarRef.nativeElement as HTMLElement;
    const selector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(el => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length));
  }

  private onKeydown(e: KeyboardEvent): void {
    if (!this.sidebarOpen || !this.isMobile()) return;
    if (e.key !== 'Tab') return;
    const focusable = this.getFocusableElements();
    if (!focusable.length) {
      e.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement as HTMLElement;
    if (e.shiftKey) {
      if (active === first || active === this.sidebarRef.nativeElement) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (active === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  private enableFocusTrap(): void {
    if (!this.sidebarRef) return;
    this.previousActiveElement = document.activeElement as HTMLElement;
    const focusable = this.getFocusableElements();
    if (focusable.length) {
      focusable[0].focus();
    } else {
      // fallback: focus the sidebar container
      this.sidebarRef.nativeElement.focus();
    }
    this.focusTrapListener = this.onKeydown.bind(this);
    document.addEventListener('keydown', this.focusTrapListener, true);
  }

  private disableFocusTrap(): void {
    if (this.focusTrapListener) {
      document.removeEventListener('keydown', this.focusTrapListener, true);
      this.focusTrapListener = null;
    }
    if (this.previousActiveElement) {
      try { this.previousActiveElement.focus(); } catch {}
      this.previousActiveElement = null;
    }
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
    this.disableFocusTrap();
  }
}