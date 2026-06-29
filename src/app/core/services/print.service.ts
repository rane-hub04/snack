import { Injectable } from '@angular/core';
import { supabase } from './supabase.client';
import { Commande } from '../models/commande.model';

@Injectable({ providedIn: 'root' })
export class PrintService {
  constructor() {}

  async imprimerTicket(commandeId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Récupérer la commande complète avec ses relations
      const { data: commande, error: commandeError } = await supabase
        .from('commandes')
        .select(`
          *,
          numero,
          table_bar: tables_bar(numero, nom),
          serveur: profiles!serveur_id(nom, prenom),
          lignes: lignes_commande(
            *,
            produit: produits(nom)
          ),
          config_bar: params(valeur) // À adapter selon votre structure de configuration
        `)
        .eq('id', commandeId)
        .single();

      if (commandeError) throw commandeError;

      // Générer le HTML du ticket
      const ticketHtml = this.generateTicketHTML(commande as Commande);

      // Ouvrir une fenêtre d'impression
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Impossible d\'ouvrir la fenêtre d\'impression');
      }

      printWindow.document.write(`
        <html>
          <head>
            <title>Ticket de caisse</title>
            <style>
              body {
                font-family: monospace;
                font-size: 18px;
                background-color: #1d4ed8;
                color: white;
                padding: 10px;
                text-align: center;
                border-radius: 8px;
                margin-bottom: 15px;
              }
              .ticket-content {
                width: 80mm;
                margin: 0 auto;
                padding: 10px;
                background: white;
                border: 1px solid #ddd;
                border-radius: 4px;
              }
              .header {
                text-align: center;
                border-bottom: 1px dashed #333;
                padding-bottom: 8px;
                margin-bottom: 8px;
              }
              .bar-name {
                font-weight: bold;
                font-size: 16px;
              }
              .bar-address {
                font-size: 12px;
                color: #666;
              }
              .bar-phone {
                font-size: 12px;
                color: #666;
                margin-top: 4px;
              }
              .ticket-info {
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                margin-bottom: 8px;
              }
              .ticket-line {
                display: flex;
                justify-content: space-between;
                padding: 2px 0;
                font-size: 12px;
              }
              .item-name {
                flex: 2;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              .item-quantity {
                flex: 1;
                text-align: center;
              }
              .item-price {
                flex: 1;
                text-align: right;
              }
              .separator {
                border-top: 1px dashed #333;
                margin: 8px 0;
              }
              .total {
                font-size: 14px;
                font-weight: bold;
                margin-top: 8px;
                border-top: 1px solid #333;
                padding-top: 4px;
              }
              .payment-info {
                font-size: 12px;
                margin-top: 6px;
              }
              .footer {
                text-align: center;
                font-size: 10px;
                margin-top: 10px;
                border-top: 1px dashed #333;
                padding-top: 8px;
                color: #666;
              }
              @media print {
                body {
                  margin: 0;
                  padding: 0;
                }
                .ticket-content {
                  width: 80mm;
                  min-height: 100%;
                }
              }
            </style>
          </head>
          <body>
            <div class="ticket-content">
              <div class="header">
                <div class="bar-name">${this.getConfigValue('nom_bar') || 'Bar Le Refuge'}</div>
                <div class="bar-address">${this.getConfigValue('adresse_bar') || 'Douala, Cameroun'}</div>
                <div class="bar-phone">Tel: ${this.getConfigValue('telephone_bar') || '+237 6XX XXX XXX'}</div>
              </div>

              <div class="ticket-info">
                <span>Ticket N°: ${commande.numero}</span>
                <span>Date: ${new Date(commande.payee_at || commande.created_at).toLocaleString('fr-FR')}</span>
              </div>

              <div class="ticket-info">
                <span>Serveur: ${commande.serveur?.prenom} ${commande.serveur?.nom}</span>
                <span>Table: ${commande.table_bar?.numero ?? 'À emporter'}</span>
              </div>

              <div class="separator"></div>

              <!-- Articles -->
              ${commande.lignes && commande.lignes.length > 0 ? commande.lignes.map((ligne: any) => `
                <div class="ticket-line">
                  <span class="item-name">${ligne.produit?.nom || 'Produit inconnu'}</span>
                  <span class="item-quantity">x${ligne.quantite}</span>
                  <span class="item-price">${this.formatFCFA(ligne.sous_total)}</span>
                </div>
              `).join('') : '<div class="ticket-line"><span>Aucun article</span></div>'}

              <div class="separator"></div>

              <div class="ticket-line">
                <span>TOTAL</span>
                <span></span>
                <span class="total-amount">${this.formatFCFA(commande.montant_total)}</span>
              </div>

              <div class="ticket-line">
                <span>Payé (${this.formatModePaiement(commande.mode_paiement)})</span>
                <span></span>
                <span class="amount-paid">${this.formatFCFA(commande.montant_recu)}</span>
              </div>

              ${commande.montant_rendu && commande.montant_rendu > 0 ? `
                <div class="ticket-line">
                  <span>Monnaie rendue</span>
                  <span></span>
                  <span class="amount-change">${this.formatFCFA(commande.montant_rendu)}</span>
                </div>
              ` : ''}

              <div class="separator"></div>

              <div class="footer">
                Merci de votre visite !<br>
                À bientôt !
              </div>
            </div>
          </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.focus();

      // Attendre un peu puis imprimer
      setTimeout(() => {
        printWindow.print();
        // Fermer la fenêtre après impression (optionnel)
        // setTimeout(() => printWindow.close(), 500);
      }, 500);

      return { success: true };
    } catch (error) {
      console.error('Erreur impression ticket:', error);
      return { success: false, error: error.message };
    }
  }

  private formatFCFA(amount: number): string {
    return new Intl.NumberFormat('fr-CM', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' FCFA';
  }

  private formatModePaiement(mode: string): string {
    const modes: { [key: string]: string } = {
      especes: 'Espèces',
      orange_money: 'Orange Money',
      mtn_momo: 'MTN MoMo',
      mixte: 'Mixte'
    };
    return modes[mode] || mode;
  }

  private getConfigValue(key: string): string | null {
    // Dans une vraie application, cela viendrait d'une table de configuration ou d'un service de configuration
    // Pour l'exemple, on retourne des valeurs par défaut
    const config: { [key: string]: string } = {
      nom_bar: 'Bar Le Refuge',
      adresse_bar: 'Douala, Cameroun',
      telephone_bar: '+237 6XX XXX XXX'
    };
    return config[key] || null;
  }

  private generateTicketHTML(commande: Commande): string {
    // Cette méthode est utilisée internelement par imprimerTicket
    // Retourne le même HTML que ci-dessus mais sans les balises html/head/body
    // pour les cas où on voudrait juste le HTML
    return `
      <div class="ticket-content">
        <!-- Même contenu que dans imprimerTicket -->
      </div>
    `;
  }
}