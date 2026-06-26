import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CaisseService } from '../../core/services/caisse.service';
import { SessionCaisse } from '../../core/models/caisse.model';
import { FcfaPipe } from '../../shared/pipes/fcfa.pipe';
import { DateDoualaPipe } from '../../shared/pipes/date-douala.pipe';

@Component({
  selector: 'app-caisse',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    FcfaPipe,
    DateDoualaPipe
  ],
  providers: [MessageService],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Caisse</h1>
        <div class="flex items-center space-x-4">
          <button
            pButton
            type="button"
            label="Nouvelle session"
            icon="pi-plus"
            class="bg-green-500 text-white"
            (click)="openSession()"
          ></button>
          <button
            pButton
            type="button"
            label="Fermer session"
            icon="pi-check"
            class="bg-red-500 text-white"
            (click)="closeSession()"
            [disabled]="!activeSession"
          ></button>
        </div>
      </div>

      <!-- Session Status -->
      <div class="mb-6">
        <div *ngIf="activeSession; else noSession" class="p-4 bg-green-50 rounded-lg">
          <div class="flex justify-between items-start">
            <div>
              <h2 class="text-lg font-semibold">Session active</h2>
              <p class="text-sm text-gray-600">
                Ouverte le {{ activeSession.ouverture_at | dateDouala }}
                par {{ activeSession.caissier?.prenom }} {{ activeSession.caissier?.nom }}
              </p>
            </div>
            <div class="text-right">
              <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Ouverte
              </span>
            </div>
          </div>
          <div class="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm font-medium text-gray-500">Fond de caisse initial</p>
              <p class="text-xl font-bold">{{ activeSession.fond_caisse_debut | fcfa }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Total espèces</p>
              <p class="text-xl font-bold">{{ (activeSession.total_especes || 0) | fcfa }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Total mobile money</p>
              <p class="text-xl font-bold">{{ (activeSession.total_mobile_money || 0) | fcfa }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Total ventes</p>
              <p class="text-xl font-bold">{{ (activeSession.total_ventes || 0) | fcfa }}</p>
            </div>
          </div>
        </div>
        <ng-template #noSession>
          <div class="p-4 bg-gray-50 rounded-lg text-center">
            <h2 class="text-lg font-semibold">Aucune session active</h2>
            <p class="text-gray-600">Ouvrez une session de caisse pour commencer à enregistrer les transactions</p>
          </div>
        </ng-template>
      </div>

      <!-- Recent Transactions -->
      <div class="mb-6">
        <h2 class="text-xl font-bold mb-4">Transactions récentes</h2>
        <div *ngIf="transactions.length === 0" class="text-center py-8">
          <p class="text-gray-500">Aucune transaction pour cette session</p>
        </div>
        <p-table [value]="transactions" [paginator]="true" [rows]="10"
                 emptyMessage="Aucune transaction trouvée" dataKey="id">
          <ng-template pTemplate="header">
            <tr>
              <th>Heure</th>
              <th>Type</th>
              <th>Montant</th>
              <th>Mode de paiement</th>
              <th>Description</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-transaction>
            <tr>
              <td>{{ transaction.created_at | dateDouala }}</td>
              <td>
                <span [ngClass]="getTransactionClass(transaction.type)"
                      class="px-2 py-1 text-xs rounded-full">
                  {{ getTransactionLabel(transaction.type) }}
                </span>
              </td>
              <td>{{ transaction.montant | fcfa }}</td>
              <td>{{ getPaymentMethodLabel(transaction.mode_paiement) }}</td>
              <td>{{ transaction.description }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <!-- Close Session -->
      <div *ngIf="activeSession" class="p-4 bg-gray-50 rounded-lg">
        <h2 class="text-lg font-semibold mb-4">Clôturer la session</h2>
        <div class="space-y-4">
          <div>
            <label for="closingNotes" class="block text-sm font-medium mb-2">Notes de clôture (optionnel)</label>
            <textarea id="closingNotes" rows="3"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      [(ngModel)]="closingNotes"></textarea>
          </div>
          <button
            pButton
            type="button"
            label="Clôturer la session"
            icon="pi-check"
            class="w-full bg-red-600 text-white py-2"
            (click)="closeSession()"
          ></button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .transaction-vente { background-color: #dcfce7; color: #166534; }
    .transaction-depense { background-color: #fee2e2; color: #991b1b; }
    .transaction-apport { background-color: #dbeafe; color: #1e40af; }
    .transaction-retrait { background-color: #fef3c7; color: #92400e; }
  `]
})
export class CaisseComponent {
  activeSession: SessionCaisse | null = null;
  transactions: any[] = [];
  closingNotes = '';

  constructor(
    private auth: AuthService,
    private caisseService: CaisseService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadSession();
    this.loadTransactions();
  }

  loadSession(): void {
    this.caisseService.loadSessionActive().then(session => {
      this.activeSession = session;
    });
  }

  loadTransactions(): void {
    this.caisseService.loadTransactions().then(transactions => {
      this.transactions = transactions;
    });
  }

  openSession(): void {
    // In a real app, we would show a dialog to enter the opening amount
    const openingAmount = 10000; // Default amount for demo

    this.caisseService.ouvrirSession(openingAmount).then(result => {
      if (result.success) {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Session de caisse ouverte' });
        this.loadSession();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: result.error || 'Impossible d\'ouvrir la session' });
      }
    });
  }

  closeSession(): void {
    this.caisseService.fermerSession(this.closingNotes).then(result => {
      if (result.success) {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Session de caisse clôturée' });
        this.loadSession();
        this.loadTransactions();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: result.error || 'Impossible de fermer la session' });
      }
    });
  }

  getTransactionClass(type: string): string {
    switch (type) {
      case 'vente': return 'transaction-vente';
      case 'depense': return 'transaction-depense';
      case 'apport': return 'transaction-apport';
      case 'retrait': return 'transaction-retrait';
      default: return '';
    }
  }

  getTransactionLabel(type: string): string {
    switch (type) {
      case 'vente': return 'Vente';
      case 'depense': return 'Dépense';
      case 'apport': return 'Apport';
      case 'retrait': return 'Retrait';
      default: return type;
    }
  }

  getPaymentMethodLabel(method: string | null): string {
    switch (method) {
      case 'especes': return 'Espèces';
      case 'orange_money': return 'Orange Money';
      case 'mtn_momo': return 'MTN MoMo';
      case 'mixte': return 'Mixte';
      default: return method || '-';
    }
  }
}