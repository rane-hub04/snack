import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { supabase } from './supabase.client';
import { Profile } from '../models/profile.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _profile = signal<Profile | null>(null);

  readonly profile = this._profile.asReadonly();
  readonly role = computed(() => this._profile()?.role ?? null);
  readonly isAdmin = computed(() => ['admin', 'gerant'].includes(this.role() ?? ''));
  readonly isGerant = computed(() => this.role() === 'gerant');
  readonly isCaissier = computed(() => ['admin', 'gerant', 'caissier'].includes(this.role() ?? ''));
  readonly isServeur = computed(() => this.role() === 'serveur');
  readonly isAuthenticated = computed(() => this._profile() !== null);

  constructor(
    private router: Router
  ) {
    // Restaurer la session au démarrage
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) this.loadProfile(data.session.user.id);
    });

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        this.loadProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        this._profile.set(null);
      }
    });
  }

  private async loadProfile(userId: string): Promise<void> {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) this._profile.set(data as Profile);
  }

  async loginWithEmail(email: string, password: string): Promise<{ error?: string }> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: 'Identifiants incorrects' };
    return {};
  }

  async loginWithPin(pin: string): Promise<{ error?: string }> {
    // Appeler la fonction Edge Function pour valider le PIN
    const { data, error } = await supabase.functions.invoke('login-pin', {
      body: { pin }
    });
    if (error || !data?.token) return { error: 'Code PIN incorrect' };

    const { error: signInError } = await supabase.auth.setSession(data.token);
    if (signInError) return { error: 'Erreur de connexion' };
    return {};
  }

  async logout(): Promise<void> {
    await supabase.auth.signOut();
    this.router.navigate(['/login']);
  }

  /** Retourne la route par défaut selon le rôle */
  getDefaultRoute(): string {
    switch (this.role()) {
      case 'admin':
      case 'gerant':   return '/pos';
      case 'caissier': return '/caisse';
      case 'serveur':  return '/pos';
      default:         return '/login';
    }
  }
}