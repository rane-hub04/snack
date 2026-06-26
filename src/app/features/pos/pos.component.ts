import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProduitService } from '../../core/services/produit.service';
import { Produit } from '../../core/models/produit.model';
import { CommandeService } from '../../core/services/commande.service';
import { FcfaPipe } from '../../shared/pipes/fcfa.pipe';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ToastModule,
    FcfaPipe
  ],
  providers: [MessageService],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Point de Vente</h1>
        <div class="flex items-center space-x-4">
          <div class="relative">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              class="w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
          </div>
          <div class="relative">
            <button
              pButton
              type="button"
              icon="pi-table"
              label="Sélectionner une table"
              class="bg-blue-500 text-white"
              (click)="showTableDialog = true"
            ></button>
          </div>
          <span *ngIf="selectedTable" class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
            Table {{ selectedTable }}
          </span>
        </div>
      </div>

      <!-- Product Categories -->
      <div class="mb-6">
        <div class="flex overflow-x-auto space-x-2">
          <button
            pButton
            type="button"
            label="Toutes"
            [class.active]="selectedCategory === ''"
            (click)="selectedCategory = ''"
          ></button>
          <button *ngFor="let category of categories"
            pButton
            type="button"
            label="{{ category.nom }}"
            [class.active]="selectedCategory === category.id"
            (click)="selectedCategory = category.id"
          ></button>
        </div>
      </div>

      <div class="grid gap-6">
        <!-- Product Catalog -->
        <div class="col-span-2 lg:col-span-3">
          <div class="space-y-4">
            <div *ngIf="loadingProducts; else productList" class="text-center py-8">
              <p class="text-gray-500">Chargement des produits...</p>
            </div>
            <ng-template #productList>
              <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div *ngFor="let produit of filteredProducts"
                  class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  (click)="addToCart(produit)"
                  [class.border-green-500]="isInCart(produit.id)"
                >
                  <div class="text-center mb-3">
                    <img *ngIf="produit.image_url" [src]="produit.image_url" alt="{{ produit.nom }}" class="h-24 w-24 object-contain mx-auto">
                    <i *ngIf="!produit.image_url" class="fa-solid fa-box text-2xl text-gray-400"></i>
                  </div>
                  <h3 class="text-lg font-semibold mb-2">{{ produit.nom }}</h3>
                  <p class="text-gray-600 text-sm mb-2">{{ produit.prix_vente | fcfa }}</p>
                  <div class="flex items-center justify-between">
                    <span class="text-sm">
                      Stock: {{ produit.stock_actuel }}
                    </span>
                    <button
                      pButton
                      type="button"
                      icon="pi-plus"
                      size="small"
                      class="bg-green-500 text-white"
                      (click)="addToCart(produit); $event.stopPropagation()"
                    ></button>
                  </div>
                </div>
              </div>
            </ng-template>
          </div>
        </div>

        <!-- Cart -->
        <div class="lg:col-span-2 space-y-4">
          <div class="border border-gray-200 rounded-lg p-4">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold">Panier</h2>
              <button
                pButton
                type="button"
                icon="pi-trash"
                label="Vider"
                class="bg-red-500 text-white"
                (click)="clearCart()"
              ></button>
            </div>

            <div *ngIf="cartItems.length === 0; else cartList" class="text-center py-8">
              <p class="text-gray-500">Votre panier est vide</p>
            </div>
            <ng-template #cartList>
              <div class="space-y-3">
                <div *ngFor="let item of cartItems" class="flex justify-between items-center p-3 border rounded">
                  <div class="flex-1">
                    <div class="font-medium">{{ item.produit_nom }}</div>
                    <div class="text-sm text-gray-500">{{ item.prix_unitaire | fcfa }} x {{ item.quantite }}</div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <button
                      pButton
                      type="button"
                      icon="pi-minus"
                      size="small"
                      (click)="decreaseQuantity(item.produit_id)"
                    ></button>
                    <span class="w-8 text-center">{{ item.quantite }}</span>
                    <button
                      pButton
                      type="button"
                      icon="pi-plus"
                      size="small"
                      (click)="increaseQuantity(item.produit_id)"
                    ></button>
                  </div>
                </div>
              </div>
            </ng-template>

            <div class="mt-6 pt-4 border-t border-gray-200">
              <div class="flex justify-between items-center mb-2">
                <span class="font-medium">Total:</span>
                <span class="font-bold text-xl">{{ totalCart | fcfa }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-500">Articles:</span>
                <span>{{ totalItems }}</span>
              </div>
            </div>

            <div class="mt-6">
              <button
                pButton
                type="button"
                label="Valider la commande"
                icon="pi-check"
                class="w-full bg-green-600 text-white py-2"
                (click)="validateOrder()"
                [disabled]="cartItems.length === 0 || !selectedTable"
              ></button>
            </div>
          </div>
        </div>
      </div>

      <!-- Table Selection Dialog -->
      <p-dialog header="Sélectionner une table" [(visible)]="showTableDialog" [modal]="true" [style]="{width: '400px'}">
        <div class="space-y-4">
          <div *ngIf="tables.length === 0" class="text-center py-8">
            <p class="text-gray-500">Aucune table disponible</p>
          </div>
          <div *ngIf="tables.length > 0" class="grid gap-3">
            <div *ngFor="let table of tables"
              (click)="selectTable(table.numero)"
              [class.selected-border]="selectedTable === table.numero"
              class="border border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:shadow-md"
            >
              <div class="text-2xl font-bold">
                {{ table.numero }}
              </div>
              <div class="text-sm">
                {{ table.nom || 'Table ' + table.numero }}
              </div>
              <div class="h-4 w-full bg-gray-200 rounded-full mt-2">
                <div
                  [class.bg-green-500]="table.statut === 'libre'"
                  [class.bg-yellow-500]="table.statut === 'reservee'"
                  [class.bg-red-500]="table.statut === 'occupee'"
                  class="h-full rounded-full"
                  [style.width.%]="table.statut === 'libre' ? 100 : 50"
                ></div>
              </div>
              <div class="text-xs mt-1">
                {{ table.statut }}
              </div>
            </div>
          </div>
        </div>
      </p-dialog>
    </div>
  `,
  styles: [`
    .selected-border {
      border-color: #3b82f6 !important;
      box-shadow: 0 0 0 2px #3b82f6;
    }
    .active {
      background-color: #3b82f6 !important;
      color: white !important;
    }
  `]
})
export class PosComponent {
  // Product data
  products: Produit[] = [];
  categories: any[] = [];
  selectedCategory: string = '';
  loadingProducts = false;

  // Cart data
  cartItems: any[] = [];
  selectedTable: number | null = null;
  showTableDialog = false;

  // Table data
  tables: any[] = [];

  constructor(
    private auth: AuthService,
    private produitService: ProduitService,
    private commandeService: CommandeService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadTables();
  }

  loadProducts(): void {
    this.loadingProducts = true;
    this.produitService.getAllProduits().then(products => {
      this.products = products;
      this.loadingProducts = false;
    });
  }

  loadCategories(): void {
    // In a real app, we'd fetch categories from the product service
    // For now, we'll extract them from products
    const uniqueCategories = [...new Set(this.products.map(p => p.categorie_id))];
    this.categories = this.products
      .filter(p => uniqueCategories.includes(p.categorie_id))
      .map(p => ({
        id: p.categorie_id,
        nom: p.categorie?.nom || `Catégorie ${p.categorie_id}`
      }));
  }

  loadTables(): void {
    // In a real app, we'd fetch tables from a table service
    // For now, we'll use mock data
    this.tables = [
      { numero: 1, nom: 'Table 1', statut: 'libre' },
      { numero: 2, nom: 'Table 2', statut: 'libre' },
      { numero: 3, nom: 'Table 3', statut: 'libre' },
      { numero: 4, nom: 'Table 4', statut: 'libre' },
      { numero: 5, nom: 'Table 5', statut: 'libre' },
      { numero: 6, nom: 'Table 6', statut: 'libre' },
      { numero: 7, nom: 'VIP 1', statut: 'libre' },
      { numero: 8, nom: 'VIP 2', statut: 'libre' }
    ];
  }

  get filteredProducts(): Produit[] {
    if (!this.selectedCategory) {
      return this.products;
    }
    return this.products.filter(p => p.categorie_id === this.selectedCategory);
  }

  addToCart(produit: Produit): void {
    const existingItem = this.cartItems.find(item => item.produit_id === produit.id);
    if (existingItem) {
      this.ModifierQuantite(existingItem.produit_id, existingItem.quantite + 1);
    } else {
      this.cartItems.push({
        produit_id: produit.id,
        produit_nom: produit.nom,
        prix_unitaire: produit.prix_vente,
        quantite: 1
      });
    }
  }

  increaseQuantity(produitId: string): void {
    this.ModifierQuantite(produitId, this.getQuantity(produitId) + 1);
  }

  decreaseQuantity(produitId: string): void {
    const currentQty = this.getQuantity(produitId);
    if (currentQty <= 1) {
      this.removeFromCart(produitId);
    } else {
      this.ModifierQuantite(produitId, currentQty - 1);
    }
  }

  ModifierQuantite(produitId: string, quantite: number): void {
    if (quantite <= 0) {
      this.removeFromCart(produitId);
      return;
    }
    const item = this.cartItems.find(item => item.produit_id === produitId);
    if (item) {
      item.quantite = quantite;
    }
  }

  removeFromCart(produitId: string): void {
    this.cartItems = this.cartItems.filter(item => item.produit_id !== produitId);
  }

  getQuantity(produitId: string): number {
    const item = this.cartItems.find(item => item.produit_id === produitId);
    return item ? item.quantite : 0;
  }

  isInCart(produitId: string): boolean {
    return this.cartItems.some(item => item.produit_id === produitId);
  }

  get totalCart(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.prix_unitaire * item.quantite), 0);
  }

  get totalItems(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantite, 0);
  }

  clearCart(): void {
    this.cartItems = [];
  }

  selectTable(tableNumber: number): void {
    this.selectedTable = tableNumber;
    this.showTableDialog = false;
  }

  async validateOrder(): Promise<void> {
    if (this.cartItems.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Le panier est vide' });
      return;
    }

    if (!this.selectedTable) {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez sélectionner une table' });
      return;
    }

    // Add products to cart items for the commande service
    const produitsAvecQuantite = this.cartItems.map(item => ({
      produit_id: item.produit_id,
      quantite: item.quantite
    }));

    // In a real implementation, we would add the products to the commande service's panier
    // For now, we'll simulate the process
    this.messageService.add({ severity: 'info', summary: 'Commande validée', detail: 'Votre commande a été validée avec succès' });

    // Reset
    this.cartItems = [];
    this.selectedTable = null;
  }
}