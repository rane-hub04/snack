export interface Alerte {
  id: string;
  type_alerte: 'stock_critique' | 'stock_rupture' | 'caisse' | 'autre';
  message: string;
  produit_id: string | null;
  produit?: {
    nom: string;
  };
  lue: boolean;
  created_at: string;
  operateur_id: string | null;
  operateur?: {
    nom: string;
    prenom: string;
  };
}