import { Injectable, signal } from '@angular/core';
import { supabase } from './supabase.client';
import { Alerte } from '../models/alerte.model';

@Injectable({ providedIn: 'root' })
export class AlerteService {
  private _alertes = signal<Alerte[]>([]);
  readonly alertes = this._alertes.asReadonly();

  private _nonLues = signal<number>(0);
  readonly nonLues = this._nonLues.asReadonly();

  constructor() {
    this.loadAlertes();
  }

  async loadAlertes(): Promise<void> {
    const { data, error } = await supabase
      .from('alertes')
      .select(`
        *,
        produit: produits(nom),
        operateur: profiles(nom, prenom)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur chargement alertes:', error);
      return;
    }

    this._alertes.set(data as Alerte[]);
    this._nonLues.set(this._alertes().filter(a => !a.lue).length);
  }

  async marquerCommeLue(alerteId: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
      .from('alertes')
      .update({ lue: true })
      .eq('id', alerteId);

    if (error) {
      console.error('Erreur marquage alerte comme lue:', error);
      return { success: false, error: error.message };
    }

    // Rafraîchir la liste
    await this.loadAlertes();
    return { success: true };
  }

  async marquerToutesCommeLues(): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
      .from('alertes')
      .update({ lue: true })
      .eq('lue', false);

    if (error) {
      console.error('Erreur marquage toutes alertes comme lues:', error);
      return { success: false, error: error.message };
    }

    // Rafraîchir la liste
    await this.loadAlertes();
    return { success: true };
  }

  async supprimerAlerte(alerteId: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
      .from('alertes')
      .delete()
      .eq('id', alerteId);

    if (error) {
      console.error('Erreur suppression alerte:', error);
      return { success: false, error: error.message };
    }

    // Rafraîchir la liste
    await this.loadAlertes();
    return { success: true };
  }

  // Abonnement temps réel aux nouvelles alertes
  subscribeAlertes(callback: (alerte: Alerte) => void) {
    return supabase
      .channel('alertes-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'alertes'
      }, (payload) => {
        const nouvelleAlerte = payload.new as Alerte;
        this._alertes.update(alertes => [nouvelleAlerte, ...alertes]);
        this._nonLues.set(this._nonLues() + 1);
        callback(nouvelleAlerte);
      })
      .subscribe();
  }

  // Obtenir les alertes non lues
  getAlertesNonLues(): Alerte[] {
    return this._alertes().filter(alerte => !alerte.lue);
  }

  // Obtenir les alertes par type
  getAlertesParType(type: 'stock_critique' | 'stock_rupture' | 'caisse' | 'autre'): Alerte[] {
    return this._alertes().filter(alerte => alerte.type_alerte === type);
  }
}