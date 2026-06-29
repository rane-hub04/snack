export interface MouvementStock {
  id: string;
  produit_id: string;
  produit?: any; // À remplacer par Produit une fois importé correctement
  type_mouvement: 'entree' | 'sortie' | 'correction' | 'perte';
  quantite: number;
  stock_avant: number;
  stock_apres: number;
  motif: string | null;
  reference_id: string | null;
  operateur_id: string | null;
  operateur?: any; // À remplacer par Profile
  created_at: string;
}

export interface ProduitStock {
  id: string;
  nom: string;
  categorie: string;
  type: 'alcoolisee' | 'non_alcoolisee';
  stock_actuel: number;
  stock_minimum: number;
  stock_maximum: number | null;
  unite: string;
  statut: 'ok' | 'critique' | 'rupture';
}