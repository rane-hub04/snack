export interface Profile {
  id: string;
  nom: string;
  prenom: string;
  telephone: string | null;
  role: 'admin' | 'gerant' | 'caissier' | 'serveur';
  pin: string | null;
  actif: boolean;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}