import { Injectable, signal } from '@angular/core';
import { supabase } from './supabase.client';
import { RapportFinancier, RapportVentes, RapportStock, PerformanceServeur } from '../models/rapport.model';

@Injectable({ providedIn: 'root' })
export class RapportService {
  private _rapportFinancier = signal<RapportFinancier | null>(null);
  readonly rapportFinancier = this._rapportFinancier.asReadonly();

  private _rapportVentes = signal<RapportVentes[]>([]);
  readonly rapportVentes = this._rapportVentes.asReadonly();

  private _rapportStock = signal<RapportStock[]>([]);
  readonly rapportStock = this._rapportStock.asReadonly();

  private _performancesServeurs = signal<PerformanceServeur[]>([]);
  readonly performancesServeurs = this._performancesServeurs.asReadonly();

  constructor() {
    // Chargement initial
    this.loadRapports();
  }

  async loadRapports(): Promise<void> {
    await Promise.all([
      this.loadRapportFinancier(),
      this.loadRapportVentes(),
      this.loadRapportStock(),
      this.loadPerformancesServeurs()
    ]);
  }

  async loadRapportFinancier(): Promise<void> {
    try {
      // Utiliser la fonction RPC get_dashboard_stats pour les données du jour
      const { data: aujourdhui, error: aujourdhuiError } = await supabase
        .rpc('get_dashboard_stats');

      if (aujourdhuiError) throw aujourdhuiError;

      // Pour les autres périodes, on pourrait avoir d'autres RPC ou faire des requêtes directes
      const { data: cetteSemaine, error: cetteSemaineError } = await supabase
        .rpc('get_stats_periode', { p_debut: this.getDateILangueIlYAPeujours(7), p_fin: new Date().toISOString() });

      const { data: ceMois, error: ceMoisError } = await supabase
        .rpc('get_stats_periode', { p_debut: this.getDateDuMoisEnCours(), p_fin: new Date().toISOString() });

      // Simplification pour l'exemple - on utiliserait réellement des fonctions SQL plus spécifiques
      const rapport: RapportFinancier = {
        periode: 'Aujourd\'hui',
        ventesTotales: aujourdhui?.ventes_jour || 0,
        nbCommandes: aujourdhui?.nb_commandes || 0,
        panierMoyen: aujourdhui?.panier_moyen || 0,
        nbClients: aujourdhui?.nb_clients || 0,
        totalAchats: 0, // À implémenter avec une fonction spécifique
        totalDepenses: 0, // À implémenter avec une fonction spécifique
        beneficeNet: 0 // À calculer
      };

      this._rapportFinancier.set(rapport);
    } catch (error) {
      console.error('Erreur chargement rapport financier:', error);
      // Valeurs par défaut en cas d'erreur
      this._rapportFinancier.set({
        periode: 'Aujourd\'hui',
        ventesTotales: 0,
        nbCommandes: 0,
        panierMoyen: 0,
        nbClients: 0,
        totalAchats: 0,
        totalDepenses: 0,
        beneficeNet: 0
      });
    }
  }

  async loadRapportVentes(): Promise<void> {
    try {
      // Ventes par jour sur les 7 derniers jours
      const septJoursAvant = new Date();
      septJoursAvant.setDate(septJoursAvant.getDate() - 7);

      const { data, error } = await supabase
        .rpc('get_ventes_par_jour', { p_debut: septJoursAvant.toISOString(), p_fin: new Date().toISOString() });

      if (error) throw error;

      // Formatage des données pour le graphique
      const ventesJournaliere: RapportVentes[] = (data || []).map((jour: any) => ({
        date: new Date(jour.jour).toLocaleDateString('fr-CA'),
        montant: jour.total_ventes || 0,
        nbCommandes: jour.nb_commandes || 0
      }));

      this._rapportVentes.set(ventesJournaliere);
    } catch (error) {
      console.error('Erreur chargement rapport ventes:', error);
      // Données vides en cas d'erreur
      this._rapportVentes.set([]);
    }
  }

  async loadRapportStock(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('vues_stock_actuel') // Vue que nous créerons
        .select(`
          *,
          categories!inner(nom, type)
        `)
        .order('nom');

      if (error) throw error;

      const stockRapport: RapportStock[] = (data || []).map((article: any) => ({
        id: article.id,
        nom: article.nom,
        categorie: article.categorie.nom,
        typeCategorie: article.categorie.type,
        stockActuel: article.stock_actuel,
        stockMinimum: article.stock_minimum,
        stockMaximum: article.stock_maximum,
        unite: article.unite,
        valeurStock: (article.stock_actuel * article.prix_achat) || 0,
        valeurStockVente: (article.stock_actuel * article.prix_vente) || 0,
        statut: this.calculerStatutStock(article.stock_actuel, article.stock_minimum)
      }));

      this._rapportStock.set(stockRapport);
    } catch (error) {
      console.error('Erreur chargement rapport stock:', error);
      this._rapportStock.set([]);
    }
  }

  async loadPerformancesServeurs(): Promise<void> {
    try {
      const { data, error } = await supabase
        .rpc('get_performance_serveurs', { p_debut: this.getDateDebutSemaine().toISOString(), p_fin: new Date().toISOString() });

      if (error) throw error;

      const performances: PerformanceServeur[] = (data || []).map((serveur: any) => ({
        id: serveur.id,
        nom: `${serveur.prenom} ${serveur.nom}`,
        commandes: serveur.nb_commandes || 0,
        ca: serveur.ca_total || 0,
        clients: serveur.nb_clients_distincts || 0,
        produitsVendus: {},
        noteMoyenne: 0 // À implémenter si on ajoute un système de notation
      }));

      this._performancesServeurs.set(performances);
    } catch (error) {
      console.error('Erreur chargement performances serveurs:', error);
      this._performancesServeurs.set([]);
    }
  }

  async getRapportFinancierParPeriode(debut: string, fin: string): Promise<RapportFinancier> {
    try {
      const { data, error } = await supabase
        .rpc('get_rapport_financier_periode', { p_debut: debut, p_fin: fin });

      if (error) throw error;

      return {
        periode: `${new Date(debut).toLocaleDateString('fr-CA')} au ${new Date(fin).toLocaleDateString('fr-CA')}`,
        ventesTotales: data?.total_ventes || 0,
        nbCommandes: data?.nb_commandes || 0,
        panierMoyen: data?.panier_moyen || 0,
        nbClients: data?.nb_clients || 0,
        totalAchats: data?.total_achats || 0,
        totalDepenses: data?.total_depenses || 0,
        beneficeNet: (data?.total_ventes || 0) - (data?.total_achats || 0) - (data?.total_depenses || 0)
      };
    } catch (error) {
      console.error('Erreur génération rapport financier période:', error);
      return {
        periode: 'Erreur',
        ventesTotales: 0,
        nbCommandes: 0,
        panierMoyen: 0,
        nbClients: 0,
        totalAchats: 0,
        totalDepenses: 0,
        beneficeNet: 0
      };
    }
  }

  private calculerStatutStock(stockActuel: number, stockMinimum: number): 'excellent' | 'bon' | 'faible' | 'critique' | 'rupture' {
    if (stockActuel <= 0) return 'rupture';
    if (stockActuel <= stockMinimum * 0.5) return 'critique';
    if (stockActuel <= stockMinimum) return 'faible';
    if (stockActuel <= stockMinimum * 2) return 'bon';
    return 'excellent';
  }

  getDateILangueIlYAPeujours(jours: number): string {
    const date = new Date();
    date.setDate(date.getDate() - jours);
    return date.toISOString().split('T')[0];
  }

  getDateDuMoisEnCours(): string {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
  }

  getDateDebutSemaine(): string {
    const date = new Date();
    const jour = date.getDay(); // 0 = dimanche
    const diff = jour === 0 ? -6 : 1 - jour; // Ajuster pour lundi comme premier jour
    date.setDate(date.getDate() + diff);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString().split('T')[0];
  }
}