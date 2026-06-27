import { Injectable, signal } from '@angular/core';
import { supabase } from './supabase.client';
import { SessionCaisse, TransactionCaisse } from '../models/caisse.model';

@Injectable({ providedIn: 'root' })
export class CaisseService {
  private _sessionActive = signal<SessionCaisse | null>(null);
  readonly sessionActive = this._sessionActive.asReadonly();

  private _transactions = signal<TransactionCaisse[]>([]);
  readonly transactions = this._transactions.asReadonly();

  constructor() {
    this.loadSessionActive();
    this.loadTransactions();
  }

  async loadSessionActive(): Promise<SessionCaisse | null> {
    const { data, error } = await supabase
      .from('sessions_caisse')
      .select(`
        *,
        caissier: profiles(nom, prenom)
      `)
      .eq('statut', 'ouverte')
      .order('ouverture_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Erreur chargement session caisse active:', error);
      this._sessionActive.set(null);
      return null;
    }

    const session = data ? (data[0] as SessionCaisse) : null;
    this._sessionActive.set(session);
    return session;
  }

  async ouvrirSession(fondCaisseDebut: number, notes?: string): Promise<{ success: boolean; session?: SessionCaisse; error?: string }> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      return { success: false, error: 'Utilisateur non authentifié' };
    }

    const { data, error } = await supabase
      .from('sessions_caisse')
      .insert({
        caissier_id: userData.user.id,
        fond_caisse_debut: fondCaisseDebut,
        notes_fermeture: notes
      })
      .select()
      .single();

    if (error) {
      console.error('Erreur ouverture session caisse:', error);
      return { success: false, error: error.message };
    }

    // Charger la session complète avec les infos du caissier
    const { data: sessionData, error: sessionError } = await supabase
      .from('sessions_caisse')
      .select(`
        *,
        caissier: profiles(nom, prenom)
      `)
      .eq('id', data.id)
      .single();

    if (sessionError) {
      console.error('Erreur récupération session créée:', sessionError);
      return { success: false, error: sessionError.message };
    }

    this._sessionActive.set(sessionData as SessionCaisse);
    return { success: true, session: sessionData as SessionCaisse };
  }

  async fermerSession(notesFermeture?: string): Promise<{ success: boolean; ecart?: number; error?: string }> {
    const session = this._sessionActive();
    if (!session) {
      return { success: false, error: 'Aucune session ouverte' };
    }

    // Calculer les totaux depuis les transactions de la journée
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const { data: transactionsData, error: transactionsError } = await supabase
      .from('sessions_caisse')
      .select('total_especes, total_mobile_money, total_ventes')
      .eq('id', session.id)
      .single();

    if (transactionsError) {
      console.error('Erreur récupération totaux session:', transactionsError);
      return { success: false, error: transactionsError.message };
    }

    const totalEspeces = transactionsData.total_especes || 0;
    const totalMobileMoney = transactionsData.total_mobile_money || 0;
    const totalAttendu = session.fond_caisse_debut + totalEspeces + totalMobileMoney;

    // Fermer la session
    const { error: closeError } = await supabase
      .from('sessions_caisse')
      .update({
        statut: 'fermee',
        fermeture_at: new Date().toISOString(),
        notes_fermeture: notesFermeture,
        ecart_caisse: 0 // Sera calculé par le déclencheur ou l'application
      })
      .eq('id', session.id);

    if (closeError) {
      console.error('Erreur fermeture session caisse:', closeError);
      return { success: false, error: closeError.message };
    }

    // Note: L'écart réel serait calculé par un déclencheur ou en comparant avec le déclaratif
    // Pour l'exemple, on suppose qu'il est calculé côté base de données

    this._sessionActive.set(null);
    return { success: true, ecart: 0 }; // L'écart viendra de la base de données après mise à jour
  }

  async loadTransactions(): Promise<TransactionCaisse[]> {
    const session = this._sessionActive();
    if (!session) {
      this._transactions.set([]);
      return [];
    }

    const { data, error } = await supabase
      .from('vues_transactions_caisse') // Vue que nous créerons en base
      .select('*')
      .eq('session_id', session.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur chargement transactions caisse:', error);
      // Fallback sur la table sessions_caisse pour avoir au moins les totaux
      const { data: sessionData } = await supabase
        .from('sessions_caisse')
        .select('total_especes, total_mobile_money, total_ventes')
        .eq('id', session.id)
        .single();

      this._transactions.set([]);
      return [];
    }

    const transactions = data as TransactionCaisse[];
    this._transactions.set(transactions);
    return transactions;
  }

  // Méthode pour encaisser une commande (à appeler depuis le service commande lors du paiement)
  async encaisserCommande(commandeId: string, modePaiement: string, montantRecu: number, reference?: string): Promise<{ success: boolean; rendu?: number; error?: string }> {
    const session = this._sessionActive();
    if (!session) {
      return { success: false, error: 'Aucune session de caisse ouverte' };
    }

    // Récupérer les détails de la commande
    const { data: commandeData, error: commandeError } = await supabase
      .from('commandes')
      .select('statut, montant_total, mode_paiement, montant_recu, montant_rendu')
      .eq('id', commandeId)
      .single();

    if (commandeError || !commandeData) {
      console.error('Erreur récupération commande:', commandeError);
      return { success: false, error: commandeError?.message || 'Commande introuvable' };
    }

    const commande = commandeData as {
      statut?: string;
      montant_total: number;
      mode_paiement: string;
      montant_recu: number;
      montant_rendu: number;
    };

    if (commande.statut !== 'validee') {
      return { success: false, error: 'La commande doit être validée avant paiement' };
    }

    const montantTotal = commande.montant_total;
    const rendu = montantRecu - montantTotal;

    // Mettre à jour la commande via la RPC payer_commande
    const { data: paiementResult, error: paiementError } = await supabase
      .rpc('payer_commande', {
        p_commande_id: commandeId,
        p_mode_paiement: modePaiement,
        p_montant_recu: montantRecu,
        p_caissier_id: session.caissier_id,
        p_reference: reference
      });

    if (paiementError) {
      console.error('Erreur paiement commande:', paiementError);
      return { success: false, error: paiementError.message };
    }

    // Mettre à jour les totaux de la session
    const updates: any = {};
    if (modePaiement === 'especes') {
      updates.total_especes = (session.total_especes || 0) + montantRecu;
    } else if (['orange_money', 'mtn_momo'].includes(modePaiement)) {
      updates.total_mobile_money = (session.total_mobile_money || 0) + montantRecu;
    }
    // Le total_ventes est mis à jour par déclencheur ou séparément

    const { error: updateError } = await supabase
      .from('sessions_caisse')
      .update(updates)
      .eq('id', session.id);

    if (updateError) {
      console.error('Erreur mise à jour totaux caisse:', updateError);
      return { success: false, error: updateError.message };
    }

    // Rafraîchir la session et les transactions
    await this.loadSessionActive();
    await this.loadTransactions();

    return { success: true, rendu };
  }

  // Abonnement temps réel aux sessions de caisse
  subscribeSessionsCaisse(callback: (session: SessionCaisse | null) => void) {
    return supabase
      .channel('sessions-caisse-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'sessions_caisse'
      }, (payload) => {
        const newPayload = payload.new as any;
        const oldPayload = payload.old as any;

        if (payload.eventType === 'INSERT' && newPayload['statut'] === 'ouverte') {
          this._sessionActive.set(newPayload as SessionCaisse);
        } else if (payload.eventType === 'UPDATE' && oldPayload['statut'] === 'ouverte' && newPayload['statut'] === 'fermee') {
          this._sessionActive.set(null);
        } else if (payload.eventType === 'UPDATE' && newPayload['statut'] === 'ouverte') {
          this._sessionActive.set(newPayload as SessionCaisse);
        }
        callback(this._sessionActive());
      })
      .subscribe();
  }
}