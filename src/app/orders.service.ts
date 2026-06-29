import { computed, Injectable, signal } from '@angular/core';

export type OrderStatus = 'attente' | 'preparation' | 'pret' | 'livre' | 'annule';

export interface Order {
  id: string;
  clientName: string;
  clientAvatar: string;
  status: OrderStatus;
  employee: string | null;
  time: string;
  total: number;
}

export interface StatCard {
  icon: string;
  iconBg: string;
  label: string;
  value: string;
  trend: string;
  trendDirection: 'up' | 'down';
}

type TabFilter = 'toutes' | 'attente' | 'preparation' | 'pretes';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  readonly orders = signal<Order[]>([]);
  readonly statCards: StatCard[] = [];
  readonly totalOrdersToday = 0;
  readonly selectedOrder = signal<Order | null>(null);
  readonly activeTab = signal<TabFilter>('toutes');
  readonly searchTerm = signal('');
  readonly tabs: { key: TabFilter; label: string }[] = [];
  readonly filteredOrders = computed(() => this.orders());

  setTab(tab: TabFilter) {
    this.activeTab.set(tab);
  }

  selectOrder(order: Order) {
    this.selectedOrder.set(order);
  }

  clearSelection() {
    this.selectedOrder.set(null);
  }

  statusLabel(status: OrderStatus): string {
    return status;
  }

  statusIcon(status: OrderStatus): string {
    return status;
  }
}

export default OrdersService;
