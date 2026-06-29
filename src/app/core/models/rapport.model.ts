export interface RapportFinancier {
  periode: string;
  ventesTotales: number;
  nbCommandes: number;
  panierMoyen: number;
  nbClients: number;
  totalAchats: number;
  totalDepenses: number;
  beneficeNet: number;
}

export interface RapportVentes {
  date: string;
  montant: number;
  nbCommandes: number;
}

export interface RapportStock {
  id: string;
  nom: string;
  categorie: string;
  typeCategorie: string;
  stockActuel: number;
  stockMinimum: number;
  stockMaximum: number | null;
  unite: string;
  valeurStock: number;
  valeurStockVente: number;
  statut: 'excellent' | 'bon' | 'faible' | 'critique' | 'rupture';
}

export interface PerformanceServeur {
  id: string;
  nom: string;
  commandes: number;
  ca: number;
  clients: number;
  produitsVendus: { [key: string]: number }; // produit nom -> quantité
  noteMoyenne: number;
}