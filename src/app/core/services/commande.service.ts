import { Injectable, signal, computed } from '@angular/core';
import { supabase } from './supabase.client';
import { AuthService } from './auth.service';
import { Commande, LigneCommande, PanierItem } from '../models/commande.model';

@Injectable({ providedIn: 'root' })
export class CommandeService {
  // Panier local (signal)
  readonly panier = signal<PanierItem[]>([]);
  readonly tableSelectionnee = signal<string | null>(null);

  readonly totalPanier = computed(() =>
    this.panier().reduce((sum, item) => sum + item.quantite * item.prix_unitaire, 0)
  );

  constructor(
    private auth: AuthService
  ) {}

  // === PANIER ===
  ajouterAuPanier(produit: any): void {
    const panier = this.panier();
    const existant = panier.find(p => p.produit_id === produit.id);

    if (existant) {
      this.panier.update(items =>
        items.map(i => i.produit_id === produit.id
          ? { ...i, quantite: i.quantite + 1 }
          : i
        )
      );
    } else {
      this.panier.update(items => [...items, {
        produit_id:    produit.id,
        produit_nom:   produit.nom,
        prix_unitaire: produit.prix_vente,
        quantite:      1
      }]);
    }
  }

  modifierQuantite(produit_id: string, quantite: number): void {
    if (quantite <= 0) {
      this.supprimerDuPanier(produit_id);
      return;
    }
    this.panier.update(items =>
      items.map(i => i.produit_id === produit_id ? { ...i, quantite } : i)
    );
  }

  supprimerDuPanier(produit_id: string): void {
    this.panier.update(items => items.filter(i => i.produit_id !== produit_id));
  }

  viderPanier(): void {
    this.panier.set([]);
    this.tableSelectionnee.set(null);
  }

  // === COMMANDES ===
  async validerCommande(): Promise<{ success: boolean; commande_id?: string; error?: string }> {
    const panierItems = this.panier();
    const tableId = this.tableSelectionnee();

    if (panierItems.length === 0) return { success: false, error: 'Le panier est vide' };

    const total = this.totalPanier();

    // Créer la commande
    const { data: commande, error: errCmd } = await supabase
      .from('commandes')
      .insert({
        table_id:      tableId,
        serveur_id:    this.auth.profile()?.id,
        statut:        'validee',
        montant_total: total
      })
      .select('id')
      .single();

    if (errCmd || !commande) return { success: false, error: 'Erreur création commande' };

    // Insérer les lignes
    const lignes = panierItems.map(item => ({
      commande_id:    commande.id,
      produit_id:     item.produit_id,
      quantite:       item.quantite,
      prix_unitaire:  item.prix_unitaire
    }));

    const { error: errLignes } = await supabase
      .from('lignes_commande')
      .insert(lignes);

    if (errLignes) return { success: false, error: 'Erreur enregistrement lignes' };

    // Marquer la table comme occupée
    if (tableId) {
      await supabase
        .from('tables_bar')
        .update({ statut: 'occupee' })
        .eq('id', tableId);
    }

    this.viderPanier();
    return { success: true, commande_id: commande.id };
  }

  async getCommandesDuJour(): Promise<any[]> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const { data } = await supabase
      .from('commandes')
      .select(`
        *,
        table_bar: tables_bar(numero, nom, zone),
        serveur: profiles!serveur_id(nom, prenom),
        lignes: lignes_commande(
          *,
          produit: produits(nom, prix_vente)
        )
      `)
      .gte('created_at', todayStart.toISOString())
      .lte('created_at', todayEnd.toISOString())
      .order('created_at', { ascending: false });

    return data ?? [];
  }

  async getMesCommandes(): Promise<any[]> {
    const { data } = await supabase
      .from('commandes')
      .select(`*, lignes: lignes_commande(*, produit: produits(nom))`)
      .eq('serveur_id', this.auth.profile()?.id)
      .in('statut', ['en_cours', 'validee'])
      .order('created_at', { ascending: false });

    return data ?? [];
  }

  // Abonnement temps réel aux nouvelles commandes (pour le caissier)
  subscribeCommandes(callback: (commande: any) => void) {
    return supabase
      .channel('commandes-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'commandes'
      }, (payload) => callback(payload.new))
      .subscribe();
  }
}