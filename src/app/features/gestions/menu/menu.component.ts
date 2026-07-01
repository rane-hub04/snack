import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  tag?: 'populaire' | 'nouveautes';
  category: 'burger' | 'salade' | 'jus' | 'dessert' | 'snack' | 'boisson';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  readonly filters = [
    { key: 'all', label: 'Tous' },
    { key: 'burger', label: 'Burgers' },
    { key: 'salade', label: 'Salades' },
    { key: 'jus', label: 'Jus' },
    { key: 'dessert', label: 'Desserts' },
    { key: 'snack', label: 'Snacks' },
    { key: 'boisson', label: 'Boissons' }
  ];

  activeFilter = signal<string>('all');
  cart = signal<CartItem[]>([]);

  readonly products: Product[] = [
    {
      id: 1,
      name: 'Burger Gourmet Classique',
      description: 'Bœuf grillé, laitue fraîche, tomates, oignons rouges et notre sauce maison.',
      price: 12.50,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
      tag: 'populaire',
      category: 'burger'
    },
    {
      id: 2,
      name: 'Cheeseburger Double',
      description: 'Deux steaks de bœuf, double cheddar fondu et cornichons.',
      price: 14.90,
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=80',
      tag: 'populaire',
      category: 'burger'
    },
    {
      id: 3,
      name: 'Burger Chicken Crunch',
      description: 'Poulet croustillant, salade, sauce maison et cheddar fondant.',
      price: 13.20,
      image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600&q=80',
      tag: 'nouveautes',
      category: 'burger'
    },
    {
      id: 4,
      name: 'Salade César',
      description: 'Poulet grillé, parmesan, croûtons, laitue et sauce césar.',
      price: 9.80,
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&q=80',
      tag: 'populaire',
      category: 'salade'
    },
    {
      id: 5,
      name: 'Salade Niçoise',
      description: 'Thon, olives, œufs, haricots verts et pommes de terre.',
      price: 10.50,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
      tag: 'nouveautes',
      category: 'salade'
    },
    {
      id: 6,
      name: 'Salade de Fruits',
      description: 'Mélange de fruits frais et sirop maison.',
      price: 6.20,
      image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=600&q=80',
      category: 'salade'
    },
    {
      id: 7,
      name: 'Jus d’Orange Frais',
      description: 'Pressé à la minute avec une touche de citron.',
      price: 4.50,
      image: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=600&q=80',
      category: 'jus'
    },
    {
      id: 8,
      name: 'Jus de Mangue',
      description: 'Jus doux et tropical, servi très frais.',
      price: 4.80,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
      category: 'jus'
    },
    {
      id: 9,
      name: 'Limonade Maison',
      description: 'Limonade artisanale, pétillante et équilibrée.',
      price: 3.50,
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80',
      category: 'boisson'
    },
    {
      id: 10,
      name: 'Brownie Chocolat',
      description: 'Brownie fondant au chocolat noir et noix.',
      price: 5.50,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80',
      tag: 'nouveautes',
      category: 'dessert'
    },
    {
      id: 11,
      name: 'Mini Cheesecake',
      description: 'Cheesecake vanille avec coulis de fruits rouges.',
      price: 5.20,
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80',
      category: 'dessert'
    },
    {
      id: 12,
      name: 'Nuggets de Poulet (x8)',
      description: 'Blanc de poulet tendre enrobé d’une chapelure dorée.',
      price: 8.00,
      image: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=600&q=80',
      tag: 'populaire',
      category: 'snack'
    }
  ];

  filteredProducts = computed(() => {
    const f = this.activeFilter();
    return f === 'all'
      ? this.products
      : this.products.filter(p => p.category === f);
  });

  subtotal = computed(() =>
    this.cart().reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  );

  /** Taxe incluse dans le prix — affichée à 0 FCFA comme dans la maquette */
  taxAmount = computed(() => 0);

  total = computed(() => this.subtotal());

  // ── Filters ─────────────────────────────────────────────────
  setFilter(f: string): void {
    this.activeFilter.set(f);
  }

  // ── Cart ────────────────────────────────────────────────────
  addToCart(product: Product): void {
    this.cart.update(items => {
      const existing = items.find(i => i.product.id === product.id);
      if (existing) {
        return items.map(i =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...items, { product, quantity: 1 }];
    });
  }

  decreaseQty(productId: number): void {
    this.cart.update(items =>
      items
        .map(i => i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i)
        .filter(i => i.quantity > 0)
    );
  }

  removeFromCart(productId: number): void {
    this.cart.update(items => items.filter(i => i.product.id !== productId));
  }

  // ── Helpers ─────────────────────────────────────────────────
  formatPrice(value: number): string {
    return new Intl.NumberFormat('fr-CM', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value) + ' FCFA';
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/products/placeholder.svg';
  }

  /** Titre de la catégorie active */
  get categoryLabel(): string {
    return 'Menu';
  }
}