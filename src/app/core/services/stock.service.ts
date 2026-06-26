import { Injectable, signal } from '@angular/core';
import { supabase } from './supabase.client';
import { MouvementStock, ProduitStock } from '../models/stock.model';

@Injectable({ providedIn: 'root' })
export class StockService {
  private _alertes = signal<any[]>([]);
  readonly alertes = this._alertes.asReadonly();

  private _mouvements = signal<MouvementStock[]>([]);
  readonly mouvements = this._mouvements.asReadonly();

  private _produitsStock = signal<ProduitStock[]>([]);
  readonly produitsStock = this._produitsStock.asReadonly();

  constructor() {
    this.loadAlertes();
    this.loadMouvementsStock();
    this.loadProduitsStock();
  }

  async loadAlertes(): Promise<void> {
    const { data, error } = await supabase
      .from('alertes')
      .select(`
        *,
        produit: produits(nom)
      `)
      .eq('lue', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur chargement alertes:', error);
      return;
    }

    this._alertes.set(data as any[]);
  }

  async loadMouvementsStock(): Promise<void> {
    const { data, error } = await supabase
      .from('mouvements_stock')
      .select(`
        *,
        produit: produits(nom, categorie_id, categories!inner(nom))
      `)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Erreur chargements mouvements stock:', error);
      return;
    }

    this._mouvements.set(data as MouvementStock[]);
  }

  async loadProduitsStock(): Promise<void> {
    const { data, error } = await supabase
      .from('produits')
      .select(`
        *,
        categorie: categories(nom, type)
      `)
      .eq('actif', true)
      .order('nom');

    if (error) {
      console.error('Erreur chargement produits stock:', error);
      return;
    }

    // Transformer en format attendu pour l'affichage
    const produitsStock: ProduitStock[] = data.map(p => ({
      id: p.id,
      nom: p.nom,
      categorie: p.categorie?.nom || '',
      type: p.categorie?.type || '',
      stock_actuel: p.stock_actuel,
      stock_minimum: p.stock_minimum,
      stock_maximum: p.stock_maximum,
      unite: p.unite,
      statut: this.calculerStatutStock(p.stock_actuel, p.stock_minimum)
    }));

    this._produitsStock.set(produitsStock);
  }

  private calculerStatutStock(stockActuel: number, stockMinimum: number): 'ok' | 'critique' | 'rupture' {
    if (stockActuel <= 0) return 'rupture';
    if (stockActuel <= stockMinimum) return 'critique';
    return 'ok';
  }

  async corrigerStock(produitId: string, nouveauStock: number, motif: string): Promise<{ success: boolean; error?: string }> {
    // D'abord récupérer le stock actuel
    const { data: produitData, error: produitError } = await supabase
      .from('produits')
      .select('stock_actuel')
      .eq('id', produitId)
      .single();

    if (produitError) {
      console.error('Erreur récupération produit:', produitError);
      return { success: false, error: produitError.message };
    }

    const stockActuel = produitData.stock_actuel;
    const quantite = nouveauStock - stockActuel;
    const typeMouvement = quantite > 0 ? 'entree' : 'sortie';

    // Mettre à jour le stock
    const { error: updateError } = await supabase
      .from('produits')
      .update({ stock_actuel: nouveauStock, updated_at: new Date().toISOString() })
      .eq('id', produitId);

    if (updateError) {
      console.error('Erreur mise à jour stock:', updateError);
      return { success: false, error: updateError.message };
    }

    // Enregistrer le mouvement
    const { error: mouvementError } = await supabase
      .from('mouvements_stock')
      .insert({
        produit_id: produitId,
        type_mouvement: typeMouvement,
        quantite: Math.abs(quantite),
        stock_avant: stockActuel,
        stock_apres: nouveauStock,
        motif,
        operateur_id: (await supabase.auth.getSession()).data.session?.user.id
      });

    if (mouvementError) {
      console.error('Erreur enregistrement mouvement:', mouvementError);
      return { success: false, error: mouvementError.message };
    }

    // Rafraîchir les données
    await this.loadProduitsStock();
    await this.loadMouvementsStock();

    return { success: true };
  }

  async approuverApprovisionnement(approId: string, lignes: any[]): Promise<{ success: boolean; error?: string }> {
    try {
      // Mettre à jour chaque ligne d'approvisionnement
      for (const ligne of lignes) {
        // Mettre à jour la quantité reçue
        const { error: ligneError } = await supabase
          .from('lignes_appro')
          .update({ quantite_recue: ligne.quantite_recue })
          .eq('id', ligne.id);

        if (ligneError) throw ligneError;

        // Mettre à jour le stock du produit
        const { data: produitData, error: produitError } = await supabase
          .from('produits')
          .select('stock_actuel')
          .eq('id', ligne.produit_id)
          .single();

        if (produitError) throw produitError;

        const nouveauStock = produitData.stock_actuel + ligne.quantite_recue;
        const { error: stockError } = await supabase
          .from('produits')
          .update({ stock_actuel: nouveauStock, prix_achat: ligne.prix_unitaire_achat, updated_at: new Date().toISOString() })
          .eq('id', ligne.produit_id);

        if (stockError) throw stockError;

        // Enregistrer le mouvement de stock
        const { error: mouvementError } = await supabase
          .from('mouvements_stock')
          .insert({
            produit_id: ligne.produit_id,
            type_mouvement: 'entree',
            quantite: ligne.quantite_recue,
            stock_avant: produitData.stock_actuel,
            stock_apres: nouveauStock,
            motif: `Approvisionnement ${approId}`,
            operateur_id: (await supabase.auth.getSession()).data.session?.user.id,
            reference_id: approId
          });

        if (mouvementError) throw mouvementError;
      }

      // Marquer l'approvisionnement comme reçu
      const { error: approError } = await supabase
        .from('approvisionnements')
        .update({ statut: 'recu' })
        .eq('id', approId);

      if (approError) throw approError;

      // Rafraîchir les données
      await this.loadProduitsStock();
      await this.loadMouvementsStock();
      await this.loadAlertes(); // Au cas où certaines alertes seraient résolues

      return { success: true };
    } catch (error: any) {
      console.error('Erreur approvisionnement:', error);
      return { success: false, error: error.message };
    }
  }

  // Abonnement temps réel aux alertes stock
  subscribeAlertes(callback: (alerte: any) => void) {
    return supabase
      .channel('alertes-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'alertes'
      }, (payload) => {
        this._alertes.update(alertes => [payload.new, ...alertes]);
        callback(payload.new);
      })
      .subscribe();
  }
}