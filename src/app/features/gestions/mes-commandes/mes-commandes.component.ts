import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type Priority = 'high' | 'medium' | 'low';
export type SortMode = 'recent' | 'oldest';

export interface OrderItem {
  id: string;
  qty: number;
  name: string;
  note?: string;
  checked: boolean;
}

export interface PrepOrder {
  id: string;
  client: string;
  priority: Priority;
  etaMinutes: number;
  items: OrderItem[];
  started: boolean;
  category?: 'burger' | 'salade' | 'jus' | 'dessert' | 'snack' | 'boisson';
}

@Component({
  selector: 'app-mes-commandes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mes-commandes.component.html',
  styleUrl: './mes-commandes.component.scss',
})
export class MesCommandesComponent {
  // ── Navigation top bar ─────────────────────────────────────
  navItems = [
    { label: 'Preparation', icon: 'scissors' },
    { label: 'Order Now', icon: 'shopping-bag' },
  ];
  activeNav = signal<string>('Preparation');

  // ── Search & filters ───────────────────────────────────────
  searchQuery = signal('');
  urgentOnly = signal(false);
  sortMode = signal<SortMode>('recent');

  // ── Stock alert banner ─────────────────────────────────────
  stockAlertItems = ['Oignons Rouges', 'Pain Brioché'];
  stockAlertDismissed = signal(false);

  // ── Footer stats ───────────────────────────────────────────
  avgPrepTime = '8.5 min';
  ordersPreparedToday = 42;
  connectedUser = 'Chef Marc L.';

  // ── Orders data ────────────────────────────────────────────
  orders = signal<PrepOrder[]>([
    {
      id: '#1024',
      client: 'Jean Dupont',
      priority: 'high',
      etaMinutes: 12,
      started: true,
      category: 'burger',
      items: [
        { id: 'i1', qty: 2, name: 'Burger Classique', note: 'Sans oignons', checked: true },
        { id: 'i2', qty: 1, name: 'Frites XL', note: 'Sel extra', checked: false },
        { id: 'i3', qty: 2, name: 'Coca-Cola 33cl', checked: false },
      ],
    },
    {
      id: '#1025',
      client: 'Marie Curie',
      priority: 'medium',
      etaMinutes: 5,
      started: false,
      category: 'salade',
      items: [
        { id: 'i4', qty: 1, name: 'Salade César', note: 'Sauce à part', checked: false },
        { id: 'i5', qty: 1, name: 'Eau Minérale', checked: false },
      ],
    },
    {
      id: '#1026',
      client: 'Thomas Edison',
      priority: 'low',
      etaMinutes: 2,
      started: false,
      category: 'snack',
      items: [
        { id: 'i6', qty: 3, name: 'Hot Dog New York', note: 'Moutarde uniquement', checked: false },
        { id: 'i7', qty: 1, name: 'Muffin Chocolat', checked: false },
      ],
    },
    {
      id: '#1027',
      client: 'Sophie Germain',
      priority: 'high',
      etaMinutes: 18,
      started: true,
      category: 'dessert',
      items: [
        { id: 'i8', qty: 1, name: 'Menu Duo Box', note: 'Végétarien', checked: true },
        { id: 'i9', qty: 2, name: 'Tarte aux Pommes', checked: true },
      ],
    },
    {
      id: '#1028',
      client: 'Léonard de Vinci',
      priority: 'medium',
      etaMinutes: 1,
      started: false,
      category: 'jus',
      items: [
        { id: 'i10', qty: 1, name: 'Pizza Margherita', checked: false },
        { id: 'i11', qty: 1, name: "Jus d'Orange", checked: false },
      ],
    },
    {
      id: '#1029',
      client: 'Amina Diallo',
      priority: 'high',
      etaMinutes: 9,
      started: false,
      category: 'burger',
      items: [
        { id: 'i12', qty: 1, name: 'Burger Chicken Crunch', checked: false },
        { id: 'i13', qty: 1, name: 'Frites Maison', checked: false },
      ],
    },
    {
      id: '#1030',
      client: 'Noah Martin',
      priority: 'medium',
      etaMinutes: 7,
      started: true,
      category: 'salade',
      items: [
        { id: 'i14', qty: 1, name: 'Salade Niçoise', note: 'Sans thon', checked: true },
        { id: 'i15', qty: 1, name: 'Limonade Maison', checked: true },
      ],
    },
    {
      id: '#1031',
      client: 'Chloé Petit',
      priority: 'low',
      etaMinutes: 3,
      started: false,
      category: 'boisson',
      items: [
        { id: 'i16', qty: 2, name: 'Coca-Cola Zéro', checked: false },
        { id: 'i17', qty: 1, name: 'Eau pétillante', checked: false },
      ],
    },
    {
      id: '#1032',
      client: 'Khalil Benali',
      priority: 'high',
      etaMinutes: 14,
      started: false,
      category: 'dessert',
      items: [
        { id: 'i18', qty: 1, name: 'Brownie Chocolat', checked: false },
        { id: 'i19', qty: 1, name: 'Mini Cheesecake', checked: false },
      ],
    },
    {
      id: '#1033',
      client: 'Mina Rossi',
      priority: 'medium',
      etaMinutes: 4,
      started: true,
      category: 'snack',
      items: [
        { id: 'i20', qty: 2, name: 'Nuggets de Poulet', checked: true },
        { id: 'i21', qty: 1, name: 'Sauce BBQ', checked: true },
      ],
    },
    {
      id: '#1034',
      client: 'Omar Hassan',
      priority: 'low',
      etaMinutes: 6,
      started: false,
      category: 'jus',
      items: [
        { id: 'i22', qty: 1, name: 'Jus de Mangue', checked: false },
        { id: 'i23', qty: 1, name: 'Jus d’Orange', checked: false },
      ],
    },
    {
      id: '#1035',
      client: 'Laura Moreau',
      priority: 'high',
      etaMinutes: 11,
      started: false,
      category: 'burger',
      items: [
        { id: 'i24', qty: 1, name: 'Cheeseburger Double', checked: false },
        { id: 'i25', qty: 1, name: 'Coca-Cola 33cl', checked: false },
      ],
    },
  ]);

  // ── Derived data ───────────────────────────────────────────
  activeOrdersCount = computed(() => this.orders().length);

  filteredOrders = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const urgent = this.urgentOnly();
    const sort = this.sortMode();

    let list = this.orders().filter((o) => {
      const matchSearch =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.client.toLowerCase().includes(q) ||
        o.items.some((i) => i.name.toLowerCase().includes(q));
      const matchUrgent = !urgent || o.priority === 'high';
      return matchSearch && matchUrgent;
    });

    list = [...list].sort((a, b) =>
      sort === 'recent' ? a.etaMinutes - b.etaMinutes : b.etaMinutes - a.etaMinutes
    );

    return list;
  });

  // ── Actions ────────────────────────────────────────────────
  toggleItem(order: PrepOrder, item: OrderItem): void {
    this.orders.update((list) =>
      list.map((o) =>
        o.id !== order.id
          ? o
          : {
              ...o,
              items: o.items.map((i) => (i.id === item.id ? { ...i, checked: !i.checked } : i)),
            }
      )
    );
  }

  allItemsChecked(order: PrepOrder): boolean {
    return order.items.every((i) => i.checked);
  }

  startOrder(order: PrepOrder): void {
    this.orders.update((list) =>
      list.map((o) => (o.id === order.id ? { ...o, started: true } : o))
    );
  }

  markReady(order: PrepOrder): void {
    this.orders.update((list) => list.filter((o) => o.id !== order.id));
  }

  setUrgentOnly(value: boolean): void {
    this.urgentOnly.set(value);
  }

  setSortMode(mode: SortMode): void {
    this.sortMode.set(mode);
  }

  dismissStockAlert(): void {
    this.stockAlertDismissed.set(true);
  }

  priorityLabel(p: Priority): string {
    return p; // affiché tel quel dans la maquette ("high", "medium", "low")
  }
}