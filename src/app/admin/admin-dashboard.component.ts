import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type OrderStatus = 'Préparation' | 'En attente' | 'Prêt' | 'Livré' | 'Annulé';
export type FilterTab = 'Toutes' | 'En attente' | 'Préparation' | 'Prêtes';

export interface Order {
  id: string;
  client: string;
  clientAvatar: string;
  status: OrderStatus;
  employee: string | null;
  employeeOnline?: boolean;
  time: string;
  total: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent {
  activeTab = signal<FilterTab>('Toutes');
  searchQuery = signal('');
  selectedOrder = signal<Order | null>(null);
  activeNav = signal<string>('Admin');

  tabs: FilterTab[] = ['Toutes', 'En attente', 'Préparation', 'Prêtes'];

  navItems = [
    { label: 'Admin', icon: 'grid' },
    { label: 'Preparation', icon: 'scissors' },
    { label: 'Order Now', icon: 'shopping-bag' },
  ];

  stats = [
    {
      label: 'Commandes en cours',
      value: '12',
      trend: '+24%',
      trendUp: true,
      icon: 'bag',
      color: '#06b6d4',
    },
    {
      label: 'Ventes du jour',
      value: '1 240,50 €',
      trend: '+12%',
      trendUp: true,
      icon: 'dollar',
      color: '#f59e0b',
    },
    {
      label: 'Temps Prep Moyen',
      value: '8.4 min',
      trend: '-5%',
      trendUp: false,
      icon: 'clock',
      color: '#64748b',
    },
    {
      label: 'Satisfaction',
      value: '4.8/5',
      trend: '+0.2',
      trendUp: true,
      icon: 'smile',
      color: '#64748b',
    },
  ];

  orders: Order[] = [
    {
      id: '#ORD-8821',
      client: 'Jean Dupont',
      clientAvatar: 'JD',
      status: 'Préparation',
      employee: 'Sarah Connor',
      employeeOnline: true,
      time: '10:24',
      total: 24.5,
    },
    {
      id: '#ORD-8822',
      client: 'Marie Curie',
      clientAvatar: 'MC',
      status: 'En attente',
      employee: null,
      time: '10:30',
      total: 12.0,
    },
    {
      id: '#ORD-8823',
      client: 'Pierre Martin',
      clientAvatar: 'PM',
      status: 'Prêt',
      employee: 'Marc Levy',
      employeeOnline: true,
      time: '09:55',
      total: 35.8,
    },
    {
      id: '#ORD-8824',
      client: 'Sophie Germain',
      clientAvatar: 'SG',
      status: 'Livré',
      employee: 'Sarah Connor',
      employeeOnline: true,
      time: '09:15',
      total: 18.2,
    },
    {
      id: '#ORD-8825',
      client: 'Luc Besson',
      clientAvatar: 'LB',
      status: 'Annulé',
      employee: null,
      time: '08:45',
      total: 9.9,
    },
  ];

  filteredOrders = computed(() => {
    const tab = this.activeTab();
    const q = this.searchQuery().toLowerCase();

    return this.orders.filter((o) => {
      const matchTab =
        tab === 'Toutes' ||
        (tab === 'En attente' && o.status === 'En attente') ||
        (tab === 'Préparation' && o.status === 'Préparation') ||
        (tab === 'Prêtes' && o.status === 'Prêt');
      const matchSearch =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.client.toLowerCase().includes(q);
      return matchTab && matchSearch;
    });
  });

  setTab(tab: FilterTab) {
    this.activeTab.set(tab);
  }

  selectOrder(order: Order) {
    this.selectedOrder.set(
      this.selectedOrder()?.id === order.id ? null : order
    );
  }

  getStatusClass(status: OrderStatus): string {
    const map: Record<OrderStatus, string> = {
      Préparation: 'status--prep',
      'En attente': 'status--waiting',
      Prêt: 'status--ready',
      Livré: 'status--delivered',
      Annulé: 'status--cancelled',
    };
    return map[status] ?? '';
  }

  getStatusIcon(status: OrderStatus): string {
    const map: Record<OrderStatus, string> = {
      Préparation: '⟳',
      'En attente': '◷',
      Prêt: '✓',
      Livré: '↑',
      Annulé: '✕',
    };
    return map[status] ?? '';
  }

  formatTotal(value: number): string {
    return value.toFixed(2).replace('.', ',') + '€';
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }

  getAvatarColor(name: string): string {
    const colors = ['#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#f43f5e'];
    const idx = name.charCodeAt(0) % colors.length;
    return colors[idx];
  }
}