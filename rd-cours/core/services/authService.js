/**
 * RD COURS COMPTA — Auth Service COMPLET
 * Version exhaustive — toutes les méthodes utilisables dans le projet
 *
 * Méthodes disponibles :
 *   Auth de base   : login, logout, getSession, signup, onAuthStateChange
 *   Profil         : getProfile, getCurrentUser, isAuthenticated
 *   Vérifications  : checkEmailExists
 *   Admin users    : createSingleUser, importUsers, updateUser,
 *                    deleteUser, getAllUsers, resendConfirmation,
 *                    toggleUserStatus, resetPasswordForUser
 */

import supabaseClient from '../config/supabase.js';
import { TABLES } from '../config/constants.js';

class AuthService {
  constructor() {
    this.client = supabaseClient;
  }

  // ═══════════════════════════════════════════
  // AUTH DE BASE
  // ═══════════════════════════════════════════

  async login(email, password) {
    const { data, error } = await this.client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async logout() {
    const { error } = await this.client.auth.signOut();
    if (error) throw error;
  }

  async getSession() {
    const { data: { session } } = await this.client.auth.getSession();
    return session;
  }

  /**
   * signup() — Inscription d'un stagiaire avec son propre mot de passe.
   * Appelé depuis la page de confirmation du stagiaire (lien email).
   * Le trigger handle_new_user() lie automatiquement auth_id.
   *
   * @param {string} email
   * @param {string} password
   */
  async signup(email, password) {
    const { data, error } = await this.client.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) throw error;
    return data;
  }

  onAuthStateChange(callback) {
    return this.client.auth.onAuthStateChange(callback);
  }

  // ═══════════════════════════════════════════
  // PROFIL & SESSION
  // ═══════════════════════════════════════════

  /**
   * isAuthenticated() — Vérifie si une session active existe
   */
  async isAuthenticated() {
    const session = await this.getSession();
    return session !== null;
  }

  /**
   * getCurrentUser() — Retourne l'objet user Supabase Auth
   */
  async getCurrentUser() {
    const session = await this.getSession();
    return session?.user ?? null;
  }

  /**
   * getProfile() — Profil depuis tb_cours_users
   * Retry 5x (race condition JWT) + fallback email si auth_id NULL
   */
  async getProfile() {
    const session = await this.getSession();
    if (!session) return null;

    const { user } = session;
    const MAX_RETRIES = 5;
    const DELAY_MS    = 400;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {

      // Passe 1 : par auth_id
      const { data: byAuthId, error: err1 } = await this.client
        .from(TABLES.USERS)
        .select('*')
        .eq('auth_id', user.id)
        .maybeSingle();

      if (err1 && attempt < MAX_RETRIES) {
        await this._wait(DELAY_MS * attempt); continue;
      }
      if (err1) throw err1;
      if (byAuthId) return byAuthId;

      // Passe 2 : fallback par email
      const { data: byEmail, error: err2 } = await this.client
        .from(TABLES.USERS)
        .select('*')
        .ilike('adresse_mail', user.email.trim())
        .maybeSingle();

      if (err2 && attempt < MAX_RETRIES) {
        await this._wait(DELAY_MS * attempt); continue;
      }
      if (err2) throw err2;

      if (!byEmail) {
        if (attempt < MAX_RETRIES) {
          await this._wait(DELAY_MS * attempt); continue;
        }
        throw new Error('Aucun profil trouvé avec cet email. Contactez votre formateur.');
      }

      // Liaison automatique auth_id
      await this.client
        .from(TABLES.USERS)
        .update({ auth_id: user.id, is_activated: true })
        .eq('id', byEmail.id);

      return { ...byEmail, auth_id: user.id, is_activated: true };
    }

    throw new Error('Impossible de charger le profil. Réessayez dans quelques secondes.');
  }

  // ═══════════════════════════════════════════
  // VÉRIFICATIONS
  // ═══════════════════════════════════════════

  /**
   * checkEmailExists() — Vérifie si l'email existe dans tb_cours_users
   */
  async checkEmailExists(email) {
    const { data, error } = await this.client
      .from(TABLES.USERS)
      .select('id')
      .ilike('adresse_mail', email.trim())
      .maybeSingle();
    if (error) throw error;
    return data !== null;
  }

  // ═══════════════════════════════════════════
  // GESTION UTILISATEURS — ADMIN
  // ═══════════════════════════════════════════

  /**
   * getAllUsers() — Liste tous les utilisateurs (RLS : admin/formateur only)
   */
  async getAllUsers(filters = {}) {
    let query = this.client
      .from(TABLES.USERS)
      .select('*')
      .order('nom');

    if (filters.cohorte) query = query.eq('cohorte', filters.cohorte);
    if (filters.role)    query = query.eq('role', filters.role);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  /**
   * createSingleUser() — Ajoute 1 profil dans tb_cours_users (sans auth)
   * Le stagiaire crée son mot de passe en cliquant "Confirmer mon email"
   */
  async createSingleUser({ civilite, nom, prenom, adresse_mail, cohorte, role = 'stagiaire' }) {
    const exists = await this.checkEmailExists(adresse_mail);
    if (exists) throw new Error(`L'email ${adresse_mail} est déjà enregistré.`);

    const { data, error } = await this.client
      .from(TABLES.USERS)
      .insert({
        civilite,
        nom:          nom.toUpperCase().trim(),
        prenom:       prenom.trim(),
        adresse_mail: adresse_mail.toLowerCase().trim(),
        cohorte,
        role,
        is_activated: false,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * importUsers() — Import CSV en masse
   * Retourne { inserted, skipped, errors }
   */
  async importUsers(users) {
    const results = { inserted: 0, skipped: 0, errors: [] };

    for (const user of users) {
      try {
        const exists = await this.checkEmailExists(user.adresse_mail);
        if (exists) { results.skipped++; continue; }

        const { error } = await this.client
          .from(TABLES.USERS)
          .insert({
            civilite:     user.civilite,
            nom:          (user.nom || '').toUpperCase().trim(),
            prenom:       (user.prenom || '').trim(),
            adresse_mail: (user.adresse_mail || '').toLowerCase().trim(),
            cohorte:      user.cohorte,
            role:         user.role || 'stagiaire',
            is_activated: false,
          });

        if (error) throw error;
        results.inserted++;
      } catch (err) {
        results.errors.push({ email: user.adresse_mail, message: err.message });
      }
    }

    return results;
  }

  /**
   * updateUser() — Met à jour un profil existant
   */
  async updateUser(userId, updates) {
    if (updates.nom)    updates.nom    = updates.nom.toUpperCase().trim();
    if (updates.prenom) updates.prenom = updates.prenom.trim();

    const { data, error } = await this.client
      .from(TABLES.USERS)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * deleteUser() — Supprime un profil de tb_cours_users
   */
  async deleteUser(userId) {
    const { error } = await this.client
      .from(TABLES.USERS)
      .delete()
      .eq('id', userId);
    if (error) throw error;
    return true;
  }

  /**
   * toggleUserStatus() — Active/désactive is_activated
   */
  async toggleUserStatus(userId, isActivated) {
    const { data, error } = await this.client
      .from(TABLES.USERS)
      .update({ is_activated: isActivated, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  /**
   * resendConfirmation() — Renvoie l'email de confirmation Supabase Auth
   * Utilise signUp() avec le même email : Supabase renvoie l'email si le
   * compte n'est pas encore confirmé, sans créer de doublon.
   *
   * @param {string} email
   */
  async resendConfirmation(email) {
    const { data, error } = await this.client.auth.resend({
      type:  'signup',
      email: email.trim().toLowerCase(),
    });
    if (error) throw error;
    return data;
  }

  /**
   * resetPasswordForUser() — Envoie un email de réinitialisation de mot de passe
   *
   * @param {string} email
   */
  async resetPasswordForUser(email) {
    const { data, error } = await this.client.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      { redirectTo: `${window.location.origin}/pages/auth/reset-password.html` }
    );
    if (error) throw error;
    return data;
  }

  // ═══════════════════════════════════════════
  // UTILITAIRE INTERNE
  // ═══════════════════════════════════════════

  _wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

const authService = new AuthService();
export default authService;