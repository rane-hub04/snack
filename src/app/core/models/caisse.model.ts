export interface SessionCaisse {
  id: string;
  caissier_id: string;
  ouverture_at: string;
  fermeture_at: string | null;
  fond_caisse_debut: number | null;
  total_especes: number | null;
  total_mobile_money: number | null;
  total_ventes: number | null;
  ecart_caisse: number | null;
  notes_fermeture: string | null;
  statut: 'ouverte' | 'fermee';
  caissier?: {
    nom: string;
    prenom: string;
  };
}

export interface TransactionCaisse {
  id: string;
  session_id: string;
  type: 'vente' | 'depense' | 'apport' | 'retrait';
  montant: number;
  mode_paiement: string | null;
  description: string | null;
  created_at: string;
}
