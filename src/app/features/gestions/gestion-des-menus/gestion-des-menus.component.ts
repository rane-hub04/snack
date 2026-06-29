import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type MenuStatus = 'publie' | 'brouillon' | 'en-attente' | 'rejete';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  status: MenuStatus;
  imageUrl: string;
  sku?: string;
}

@Component({
  selector: 'app-gestion-des-menus',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-des-menus.component.html',
  styleUrls: ['./gestion-des-menus.component.scss'],
})
export class GestionDesMenusComponent {
  // ── Top bar ────────────────────────────────────────────────
  currentUser = {
    name: 'Admin',
    avatarUrl: 'https://i.pravatar.cc/40?img=47',
    online: true,
  };

  // ── Search & actions ───────────────────────────────────────
  searchQuery = signal('');

  // ── Menus data ─────────────────────────────────────────────
  menuItems = signal<MenuItem[]>([
    {
      id: 'm1',
      name: 'Frites Maison XL',
      description: 'Frites coupées à la main, sel de mer et herbes de Provence.',
      price: 4.5,
      status: 'publie',
      imageUrl:
        'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&q=80',
      sku: 'FRT-XL-001',
    },
    {
      id: 'm2',
      name: 'Burger Maison',
      description: 'Pain brioché, steak de bœuf, cheddar fondu et sauce maison.',
      price: 8.9,
      status: 'publie',
      imageUrl:
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
      sku: 'BRG-MA-002',
    },
    {
      id: 'm3',
      name: 'Salade César',
      description: 'Poulet grillé, parmesan, croûtons et dressing maison.',
      price: 7.2,
      status: 'brouillon',
      imageUrl:
        'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&q=80',
      sku: 'SLD-CS-003',
    },
    {
      id: 'm4',
      name: 'Nuggets Crunch',
      description: 'Nuggets croustillants servis avec sauce barbecue maison.',
      price: 5.4,
      status: 'publie',
      imageUrl:
        'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=600&q=80',
      sku: 'NGT-CR-004',
    },
    {
      id: 'm5',
      name: 'Tacos Mexicain',
      description: 'Tacos au bœuf épicé, salsa tomate et coriandre.',
      price: 6.8,
      status: 'en-attente',
      imageUrl:
        'https://images.unsplash.com/photo-1552332386-f8dd00dc8d60?w=600&q=80',
      sku: 'TAC-MX-005',
    },
    {
      id: 'm6',
      name: 'Pizza Margherita',
      description: 'Tomate San Marzano, mozzarella, basilic frais.',
      price: 9.2,
      status: 'rejete',
      imageUrl:
        'https://images.unsplash.com/photo-1548365328-8b0df4ee4dff?w=600&q=80',
      sku: 'PIZ-MR-006',
    },
    {
      id: 'm7',
      name: 'Wrap Poulet',
      description: 'Poulet grillé, crudités croquantes et sauce yaourt.',
      price: 7.6,
      status: 'brouillon',
      imageUrl:
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
      sku: 'WRP-PL-007',
    },
    {
      id: 'm8',
      name: 'Saumon Teriyaki',
      description: 'Filet de saumon laqué, riz jasmin et légumes vapeurs.',
      price: 12.5,
      status: 'publie',
      imageUrl:
        'https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?w=600&q=80',
      sku: 'SAL-TE-008',
    },
    {
      id: 'm9',
      name: 'Curry de Légumes',
      description: 'Légumes de saison mijotés dans une sauce coco parfumée.',
      price: 8.0,
      status: 'en-attente',
      imageUrl:
        'https://images.unsplash.com/photo-1512058564366-c9e3d7ba3bb1?w=600&q=80',
      sku: 'CRY-LG-009',
    },
    {
      id: 'm10',
      name: 'Poke Bowl',
      description: 'Saumon mariné, avocat, edamame et riz vinaigré.',
      price: 11.3,
      status: 'publie',
      imageUrl:
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
      sku: 'POK-BW-010',
    },
    {
      id: 'm11',
      name: 'Burrito Veggie',
      description: 'Haricots noirs, riz, guacamole et légumes grillés.',
      price: 7.9,
      status: 'rejete',
      imageUrl:
        'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80',
      sku: 'BUR-VG-011',
    },
    {
      id: 'm12',
      name: 'Pad Thaï',
      description: 'Nouilles sautées, crevettes, cacahuètes et citron vert.',
      price: 10.4,
      status: 'brouillon',
      imageUrl:
        'https://images.unsplash.com/photo-1512058564366-c9e3d7ba3bb1?w=600&q=80',
      sku: 'PAD-TH-012',
    },
    {
      id: 'm13',
      name: 'Pâtes Carbonara',
      description: 'Spaghetti crémeux au lard croustillant et pecorino.',
      price: 9.5,
      status: 'publie',
      imageUrl:
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
      sku: 'PTC-CR-013',
    },
    {
      id: 'm14',
      name: 'Falafel Bowl',
      description: 'Falafels croustillants, houmous, salade et pita grillé.',
      price: 8.7,
      status: 'en-attente',
      imageUrl:
        'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80',
      sku: 'FAL-BW-014',
    },
    {
      id: 'm15',
      name: 'Tartine Avocat',
      description: 'Pain complet, avocat mûr, graines et citron frais.',
      price: 6.0,
      status: 'brouillon',
      imageUrl:
        'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80',
      sku: 'TAR-AV-015',
    },
    {
      id: 'm16',
      name: 'Brochettes de Poulet',
      description: 'Brochettes marinées, sauce satay et légumes grillés.',
      price: 9.8,
      status: 'publie',
      imageUrl:
        'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=600&q=80',
      sku: 'BRQ-PL-016',
    },
    {
      id: 'm17',
      name: 'Soupe Minestrone',
      description: 'Soupe chaude aux légumes et pâtes, parfumée au basilic.',
      price: 5.9,
      status: 'en-attente',
      imageUrl:
        'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=600&q=80',
      sku: 'SOU-MN-017',
    },
    {
      id: 'm18',
      name: 'Club Sandwich',
      description: 'Poulet grillé, bacon, salade, tomate et mayonnaise maison.',
      price: 8.5,
      status: 'rejete',
      imageUrl:
        'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80',
      sku: 'CLU-SW-018',
    },
    {
      id: 'm19',
      name: 'Riz Cantonais',
      description: 'Riz sauté, œufs, petits pois et jambon fumé.',
      price: 7.3,
      status: 'brouillon',
      imageUrl:
        'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80',
      sku: 'RIZ-CN-019',
    },
    {
      id: 'm20',
      name: 'Salade Niçoise',
      description: 'Thon, olives, œufs, haricots verts et tomates.',
      price: 8.4,
      status: 'publie',
      imageUrl:
        'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80',
      sku: 'SLD-NC-020',
    },
    {
      id: 'm21',
      name: 'Burger Végétarien',
      description: 'Galette de légumes maison, avocat et cheddar vegan.',
      price: 9.1,
      status: 'en-attente',
      imageUrl:
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
      sku: 'BRG-VG-021',
    },
    {
      id: 'm22',
      name: 'Pâtes Pesto',
      description: 'Penne au pesto basilic et tomates séchées.',
      price: 8.8,
      status: 'brouillon',
      imageUrl:
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80',
      sku: 'PTC-PS-022',
    },
    {
      id: 'm23',
      name: 'Salade de Quinoa',
      description: 'Quinoa, légumes croquants et vinaigrette citronnée.',
      price: 7.7,
      status: 'publie',
      imageUrl:
        'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80',
      sku: 'SLD-QN-023',
    },
    {
      id: 'm24',
      name: 'Tartelette Citron',
      description: 'Tartelette acidulée au citron meringuée.',
      price: 5.6,
      status: 'en-attente',
      imageUrl:
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80',
      sku: 'TAR-CT-024',
    },
  ]);

  // ── Derived data ───────────────────────────────────────────
  filteredMenuItems = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) return this.menuItems();
    return this.menuItems().filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        (m.sku ?? '').toLowerCase().includes(q)
    );
  });

  // ── Actions ────────────────────────────────────────────────
  editMenu(item: MenuItem): void {
    void item;
  }

  submitMenu(item: MenuItem): void {
    this.menuItems.update((list) =>
      list.map((m) => (m.id === item.id ? { ...m, status: 'publie' as MenuStatus } : m))
    );
  }

  importCsv(): void {
    // Hook à brancher plus tard pour l’import CSV.
  }

  createNewMenu(): void {
    // Hook à brancher plus tard pour la création d’un menu.
  }

  formatPrice(value: number): string {
    return value.toFixed(2).replace('.', ',') + ' €';
  }

  statusLabel(status: MenuStatus): string {
    switch (status) {
      case 'publie':
        return 'Publié';
      case 'brouillon':
        return 'Brouillon';
      case 'en-attente':
        return 'En attente de validation';
      case 'rejete':
        return 'Rejeté';
    }
  }
}