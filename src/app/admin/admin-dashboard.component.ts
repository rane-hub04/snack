import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import OrdersService, { Order, OrderStatus } from '../orders.service';

type TabFilter = 'toutes' | 'attente' | 'preparation' | 'pretes';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: []
})
export class AdminDashboardComponent {
  private readonly ordersService = inject(OrdersService);

  readonly statCards = this.ordersService.statCards;
  readonly orders = this.ordersService.orders;
  readonly totalOrdersToday = this.ordersService.totalOrdersToday;
  readonly selectedOrder = this.ordersService.selectedOrder;
  readonly activeTab = this.ordersService.activeTab;
  readonly searchTerm = this.ordersService.searchTerm;
  readonly filteredOrders = this.ordersService.filteredOrders;
  readonly tabs = this.ordersService.tabs;

  setTab(tab: TabFilter): void {
    this.ordersService.setTab(tab);
  }

  selectOrder(order: Order): void {
    this.ordersService.selectOrder(order);
  }

  clearSelection(): void {
    this.ordersService.clearSelection();
  }

  statusLabel(status: OrderStatus): string {
    return this.ordersService.statusLabel(status);
  }

  statusIcon(status: OrderStatus): string {
    return this.ordersService.statusIcon(status);
  }
}