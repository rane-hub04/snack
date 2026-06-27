export interface Produit {
  id: string;
  nom: string;
  categorie_id: string;
  categorie?: Categorie;
  prix_vente: number;
  prix_achat: number | null;
  unite: string;
  stock_actuel: number;
  stock_minimum: number;
  stock_maximum: number | null;
  code_barre: string | null;
  description: string | null;
  image_url: string | null;
  actif: boolean;
  created_at: string;
  updated_at: string;
}

export interface Categorie {
  id: string;
  nom: string;
  type: 'alcoolisee' | 'non_alcoolisee';
  icone: string | null;
  ordre: number;
  actif: boolean;
  created_at: string;
}