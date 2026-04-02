/**
 * RD COURS COMPTA — Storage Service
 */
import supabaseClient from '../config/supabase.js';
import { TABLES } from '../config/constants.js';

class StorageService {
  constructor() { this.client = supabaseClient; }

  async getModules() {
    const { data, error } = await this.client.from(TABLES.MODULES).select('*').eq('is_active', true).order('ordre');
    if (error) throw error; return data;
  }

  async getSequencesByModule(moduleId) {
    const { data, error } = await this.client.from(TABLES.SEQUENCES).select('*').eq('module_id', moduleId).eq('is_active', true).order('ordre');
    if (error) throw error; return data;
  }

  async getProgression(userId) {
    const { data, error } = await this.client.from(TABLES.PROGRESSION).select('*, tb_cours_sequences(*, tb_cours_modules(*))').eq('user_id', userId);
    if (error) throw error; return data;
  }

  async updateProgression(userId, sequenceId, statut, score = null) {
    const payload = {
      user_id: userId, sequence_id: sequenceId, statut,
      ...(statut === 'en_cours' ? { date_debut: new Date().toISOString() } : {}),
      ...(['termine','valide'].includes(statut) ? { date_fin: new Date().toISOString() } : {}),
      ...(score !== null ? { score } : {})
    };
    const { data, error } = await this.client.from(TABLES.PROGRESSION).upsert(payload, { onConflict: 'user_id,sequence_id' }).select().single();
    if (error) throw error; return data;
  }

  async getAllUsers() {
    const { data, error } = await this.client.from(TABLES.USERS).select('*').order('nom');
    if (error) throw error; return data;
  }

  async deleteUser(userId) {
    const { error } = await this.client.from(TABLES.USERS).delete().eq('id', userId);
    if (error) throw error;
  }

  async updateUser(userId, updates) {
    const { data, error } = await this.client.from(TABLES.USERS).update(updates).eq('id', userId).select().single();
    if (error) throw error; return data;
  }
}

const storageService = new StorageService();
export default storageService;
