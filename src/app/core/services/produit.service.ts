import { Injectable, signal } from '@angular/core';
import { supabase } from './supabase.client';
import { Produit } from '../models/produit.model';

@Injectable({ providedIn: 'root' })
export class ProduitService {
  private _produits = signal<Produit[]>([]);
  readonly produits = this._produits.asReadonly();

  constructor() {
    this.loadProduits();
  }

  async loadProduits(): Promise<void> {
    const { data, error } = await supabase
      .from('produits')
      .select(`
        *,
        categorie: categories(nom, type, icone)
      `)
      .eq('actif', true)
      .order('nom');

    if (error) {
      console.error('Erreur chargement produits:', error);
      return;
    }

    this._produits.set(data as Produit[]);
  }

  async getProduitById(id: string): Promise<Produit | null> {
    const { data, error } = await supabase
      .from('produits')
      .select(`
        *,
        categorie: categories(nom, type, icone)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erreur récupération produit:', error);
      return null;
    }

    return data as Produit;
  }

  async getProduitsByCategorie(categorieId: string): Promise<Produit[]> {
    const { data, error } = await supabase
      .from('produits')
      .select(`
        *,
        categorie: categories(nom, type, icone)
      `)
      .eq('categorie_id', categorieId)
      .eq('actif', true)
      .order('nom');

    if (error) {
      console.error('Erreur filtrage produits par catégorie:', error);
      return [];
    }

    return data as Produit[];
  }

  async chercherProduits(term: string): Promise<Produit[]> {
    if (!term.trim()) return await this.getAllProduits();

    const { data, error } = await supabase
      .from('produits')
      .select(`
        *,
        categorie: categories(nom, type, icone)
      `)
      .ilike('nom', `%${term}%`)
      .eq('actif', true)
      .order('nom');

    if (error) {
      console.error('Erreur recherche produits:', error);
      return [];
    }

    return data as Produit[];
  }

  async getAllProduits(): Promise<Produit[]> {
    const { data, error } = await supabase
      .from('produits')
      .select(`
        *,
        categorie: categories(nom, type, icone)
      `)
      .eq('actif', true)
      .order('nom');

    if (error) {
      console.error('Erreur chargement tous produits:', error);
      return [];
    }

    return data as Produit[];
  }

  async creerProduit(produit: Omit<Produit, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; produit?: Produit; error?: string }> {
    const { data, error } = await supabase
      .from('produits')
      .insert(produit)
      .select()
      .single();

    if (error) {
      console.error('Erreur création produit:', error);
      return { success: false, error: error.message };
    }

    // Rafraîchir la liste
    await this.loadProduits();
    return { success: true, produit: data as Produit };
  }

  async mettreAJourProduit(id: string, produit: Partial<Produit>): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
      .from('produits')
      .update(produit)
      .eq('id', id);

    if (error) {
      console.error('Erreur mise à jour produit:', error);
      return { success: false, error: error.message };
    }

    // Rafraîchir la liste
    await this.loadProduits();
    return { success: true };
  }

  async supprimerProduit(id: string): Promise<{ success: boolean; error?: string }> {
    // En réalité, on ne supprime pas, on désactive juste
    const { error } = await supabase
      .from('produits')
      .update({ actif: false })
      .eq('id', id);

    if (error) {
      console.error('Erreur suppression produit:', error);
      return { success: false, error: error.message };
    }

    // Rafraîchir la liste
    await this.loadProduits();
    return { success: true };
  }
}