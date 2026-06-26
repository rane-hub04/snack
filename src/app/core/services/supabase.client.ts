import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

export const supabase = createClient(
  environment.supabaseUrl,
  environment.supabaseAnonKey
);

// Define database types
export interface Database {
  public: {
    Tables: {
      approvisionnements: {
        Row: {
          id: string;
          numero: number;
          fournisseur: string | null;
          operateur_id: string | null;
          montant_total: number | null;
          statut: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          numero?: number;
          fournisseur?: string | null;
          operateur_id?: string | null;
          montant_total?: number | null;
          statut?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          numero?: number;
          fournisseur?: string | null;
          operateur_id?: string | null;
          montant_total?: number | null;
          statut?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "approvisionnements_operateur_id_fkey";
            columns: ["operateur_id"];
            isOneToOne: false;
            referencedTable: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      // ... other tables would be defined here, but for brevity
      // we'll focus on what we need for the dashboard
      categories: {
        Row: {
          id: string;
          nom: string;
          type: string;
          icone: string | null;
          ordre: number | null;
          actif: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          nom?: string;
          type?: string;
          icone?: string | null;
          ordre?: number | null;
          actif?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          nom?: string;
          type?: string;
          icone?: string | null;
          ordre?: number | null;
          actif?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      commandes: {
        Row: {
          id: string;
          numero: number;
          table_id: string | null;
          serveur_id: string;
          caissier_id: string | null;
          statut: string;
          mode_paiement: string | null;
          montant_total: number | null;
          montant_recu: number | null;
          montant_rendu: number | null;
          reference_paiement: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
          payee_at: string | null;
        };
        Insert: {
          id?: string;
          numero?: number;
          table_id?: string | null;
          serveur_id: string;
          caissier_id?: string | null;
          statut?: string;
          mode_paiement?: string | null;
          montant_total?: number | null;
          montant_recu?: number | null;
          montant_rendu?: number | null;
          reference_paiement?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          payee_at?: string | null;
        };
        Update: {
          id?: string;
          numero?: number;
          table_id?: string | null;
          serveur_id?: string;
          caissier_id?: string | null;
          statut?: string;
          mode_paiement?: string | null;
          montant_total?: number | null;
          montant_recu?: number | null;
          montant_rendu?: number | null;
          reference_paiement?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          payee_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "commandes_caissier_id_fkey";
            columns: ["caissier_id"];
            isOneToOne: false;
            referencedTable: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "commandes_serveur_id_fkey";
            columns: ["serveur_id"];
            isOneToOne: false;
            referencedTable: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "commandes_table_id_fkey";
            columns: ["table_id"];
            isOneToOne: false;
            referencedTable: "tables_bar";
            referencedColumns: ["id"];
          }
        ];
      };
      lignes_commande: {
        Row: {
          id: string;
          commande_id: string;
          produit_id: string;
          quantite: number;
          prix_unitaire: number | null;
          prix_achat_snap: number | null;
          sous_total: number;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          commande_id: string;
          produit_id: string;
          quantite: number;
          prix_unitaire?: number | null;
          prix_achat_snap?: number | null;
          sous_total?: number;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          commande_id?: string;
          produit_id?: string;
          quantite?: number;
          prix_unitaire?: number | null;
          prix_achat_snap?: number | null;
          sous_total?: number;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lignes_commande_commande_id_fkey";
            columns: ["commande_id"];
            isOneToOne: false;
            referencedTable: "commandes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lignes_commande_produit_id_fkey";
            columns: ["produit_id"];
            isOneToOne: false;
            referencedTable: "produits";
            referencedColumns: ["id"];
          }
        ];
      };
      mouvements_stock: {
        Row: {
          id: string;
          produit_id: string;
          type_mouvement: string;
          quantite: number;
          stock_avant: number;
          stock_apres: number;
          motif: string | null;
          reference_id: string | null;
          operateur_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          produit_id: string;
          type_mouvement: string;
          quantite: number;
          stock_avant: number;
          stock_apres: number;
          motif?: string | null;
          reference_id?: string | null;
          operateur_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          produit_id?: string;
          type_mouvement?: string;
          quantite?: number;
          stock_avant?: number;
          stock_apres?: number;
          motif?: string | null;
          reference_id?: string | null;
          operateur_id?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "mouvements_stock_operateur_id_fkey";
            columns: ["operateur_id"];
            isOneToOne: false;
            referencedTable: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "mouvements_stock_produit_id_fkey";
            columns: ["produit_id"];
            isOneToOne: false;
            referencedTable: "produits";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          id: string;
          nom: string;
          prenom: string;
          telephone: string | null;
          role: string;
          pin: string | null;
          actif: boolean;
          photo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          nom: string;
          prenom: string;
          telephone?: string | null;
          role: string;
          pin?: string | null;
          actif?: boolean;
          photo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nom?: string;
          prenom?: string;
          telefono?: string | null;
          role?: string;
          pin?: string | null;
          actif?: boolean;
          photo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      produits: {
        Row: {
          id: string;
          nom: string;
          categorie_id: string;
          prix_vente: number | null;
          prix_achat: number | null;
          unite: string | null;
          stock_actuel: number;
          stock_minimum: number;
          stock_maximum: number | null;
          code_barre: string | null;
          description: string | null;
          image_url: string | null;
          actif: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nom?: string;
          categorie_id: string;
          prix_vente?: number | null;
          prix_achat?: number | null;
          unite?: string | null;
          stock_actuel?: number;
          stock_minimum?: number;
          stock_maximum?: number | null;
          code_barre?: string | null;
          description?: string | null;
          image_url?: string | null;
          actif?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nom?: string;
          categorie_id?: string;
          prix_vente?: number | null;
          prix_achat?: number | null;
          unite?: string | null;
          stock_actuel?: number;
          stock_minimum?: number;
          stock_maximum?: number | null;
          code_barre?: string | null;
          description?: string | null;
          image_url?: string | null;
          actif?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "produits_categorie_id_fkey";
            columns: ["categorie_id"];
            isOneToOne: false;
            referencedTable: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      sessions_caisse: {
        Row: {
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
          statut: string;
        };
        Insert: {
          id?: string;
          caissier_id: string;
          ouverture_at?: string;
          fermeture_at?: string | null;
          fond_caisse_debut?: number | null;
          total_especes?: number | null;
          total_mobile_money?: number | null;
          total_ventes?: number | null;
          ecart_caisse?: number | null;
          notes_fermeture?: string | null;
          statut?: string;
        };
        Update: {
          id?: string;
          caissier_id?: string;
          ouverture_at?: string;
          fermeture_at?: string | null;
          fond_caisse_debut?: number | null;
          total_especes?: number | null;
          total_mobile_money?: number | null;
          total_ventes?: number | null;
          ecart_caisse?: number | null;
          notes_fermeture?: string | null;
          statut?: string;
        };
        Relationships: [
          {
            foreignKeyName: "sessions_caisse_caissier_id_fkey";
            columns: ["caissier_id"];
            isOneToOne: false;
            referencedTable: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      tables_bar: {
        Row: {
          id: string;
          numero: number;
          nom: string | null;
          capacite: number | null;
          zone: string | null;
          statut: string;
          actif: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          numero?: number;
          nom?: string | null;
          capacite?: number | null;
          zone?: string | null;
          statut?: string;
          actif?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          numero?: number;
          nom?: string | null;
          capacite?: number | null;
          zone?: string | null;
          statut?: string;
          actif?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}