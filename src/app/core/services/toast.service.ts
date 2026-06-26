import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private messageService: MessageService) {}

  success(summary: string, detail: string): void {
    this.messageService.add({ severity: 'success', summary, detail, life: 3000 });
  }

  error(summary: string, detail: string): void {
    this.messageService.add({ severity: 'error', summary, detail, life: 3000 });
  }

  warn(summary: string, detail: string): void {
    this.messageService.add({ severity: 'warn', summary, detail, life: 3000 });
  }

  info(summary: string, detail: string): void {
    this.messageService.add({ severity: 'info', summary, detail, life: 3000 });
  }

  // Méthodes spécifiques pour l'application
  showConfirmation(message: string, acceptLabel: string = 'Oui', rejectLabel: string = 'Non'): Promise<boolean> {
    return new Promise((resolve) => {
      this.messageService.clear();
      this.messageService.add({
        key: 'confirmation',
        sticky: true,
        severity: 'warn',
        summary: 'Confirmation requise',
        detail: message,
        icon: 'pi pi-exclamation-triangle'
      });

      // Dans une vraie implémentation, on utiliserait un service de confirmation dédié
      // Pour cet exemple, on simule une réponse après 2 secondes
      setTimeout(() => {
        this.messageService.clear('confirmation');
        resolve(true); // Par défaut, on accepte
      }, 2000);
    });
  }

  showLoading(message: string = 'Chargement...'): void {
    this.messageService.clear();
    this.messageService.add({
      key: 'loading',
      sticky: true,
      severity: 'info',
      summary: message,
      // On pourrait ajouter un spinner ici
    });
  }

  hideLoading(): void {
    this.messageService.clear('loading');
  }

  showStockAlert(produitNom: string, type: 'stock_critique' | 'stock_rupture', quantite: number): void {
    if (type === 'stock_critique') {
      this.warn('Stock critique', `${produitNom} : ${quantite} unités restantes`);
    } else if (type === 'stock_rupture') {
      this.error('Rupture de stock', `${produitNom} : Stock épuisé`);
    }
  }

  showPaiementReussi(montant: number, rendu: number): void {
    this.success('Paiement réussi', `Montant payé: ${this.formatFCFA(montant)}` +
      (rendu > 0 ? `, Monnaie rendue: ${this.formatFCFA(rendu)}` : ''));
  }

  showErreurPaiement(message: string): void {
    this.error('Échec du paiement', message);
  }

  showCommandeValidee(numero: number): void {
    this.success('Commande validée', `La commande #${numero} a été validée avec succès`);
  }

  showSessionOuverte(): void {
    this.success('Session ouverte', 'La session de caisse est maintenant ouverte');
  }

  showSessionFermee(ecart: number): void {
    if (ecart !== 0) {
      this.warn('Session fermée', `Écart de caisse détecté: ${this.formatFCFA(ecart)}`);
    } else {
      this.success('Session fermée', 'La session de caisse a été clôturée sans écart');
    }
  }

  private formatFCFA(amount: number): string {
    return new Intl.NumberFormat('fr-CM', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' FCFA';
  }
}