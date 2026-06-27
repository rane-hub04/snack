import { Produit } from './produit.model';
import { Profile } from './profile.model';

export interface LigneCommande {
  id: string;
  commande_id: string;
  produit_id: string;
  produit?: Produit;
  quantite: number;
  prix_unitaire: number;
  prix_achat_snap: number | null;
  sous_total: number;
  notes: string | null;
  created_at: string;
}

export interface Commande {
  id: string;
  numero: number;
  table_id: string | null;
  table_bar?: TableBar;
  serveur_id: string;
  serveur?: Profile;
  caissier_id: string | null;
  caissier?: Profile;
  statut: 'en_cours' | 'validee' | 'payee' | 'annulee';
  mode_paiement: 'especes' | 'orange_money' | 'mtn_momo' | 'mixte' | null;
  montant_total: number;
  montant_recu: number | null;
  montant_rendu: number | null;
  reference_paiement: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  payee_at: string | null;
  lignes?: LigneCommande[];
}

export interface TableBar {
  id: string;
  numero: number;
  nom: string | null;
  capacite: number | null;
  zone: string | null;
  statut: 'libre' | 'occupee' | 'reservee';
  actif: boolean;
  created_at: string;
}

export interface PanierItem {
  produit_id: string;
  produit_nom: string;
  prix_unitaire: number;
  quantite: number;
}