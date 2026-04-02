/**
 * RD COURS COMPTA — Constantes
 */
export const ROLES = { ADMIN: 'admin', FORMATEUR: 'formateur', STAGIAIRE: 'stagiaire' };

export const COHORTES = {
  CA:  { code: 'CA',  label: 'Comptable Assistant' },
  GCF: { code: 'GCF', label: 'Gestionnaire Comptable et Fiscal' },
  SA:  { code: 'SA',  label: 'Secrétaire Assistant' },
  AD:  { code: 'AD',  label: 'Assistant de Direction' },
  GP:  { code: 'GP',  label: 'Gestionnaire de Paie' },
  ARH: { code: 'ARH', label: 'Assistant Ressources Humaines' },
  AC:  { code: 'AC',  label: 'Assistant Commercial' }
};

export const CIVILITES = { M: { code: 'M', label: 'Monsieur' }, MME: { code: 'Mme', label: 'Madame' } };

export const TABLES = {
  USERS: 'tb_cours_users',
  MODULES: 'tb_cours_modules',
  SEQUENCES: 'tb_cours_sequences',
  PROGRESSION: 'tb_cours_progression',
  QUIZ: 'tb_cours_quiz',
  QUIZ_REPONSES: 'tb_cours_quiz_reponses',
  COHORTES: 'tb_cours_cohortes'
};
