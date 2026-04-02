-- ═══════════════════════════════════════════════════════════════
-- RD COURS COMPTA — Schéma Supabase v2.0
-- Préfixe : tb_cours_
-- Workflow : Admin importe CSV → stagiaire s'active au 1er login
-- ═══════════════════════════════════════════════════════════════

-- ─── Fonction updated_at ───
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─── 1. Table des utilisateurs ───
CREATE TABLE IF NOT EXISTS tb_cours_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  civilite TEXT NOT NULL CHECK (civilite IN ('M', 'Mme')),
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  adresse_mail TEXT NOT NULL UNIQUE,
  cohorte TEXT NOT NULL CHECK (cohorte IN ('CA','GCF','SA','AD','GP','ARH','AC')),
  role TEXT NOT NULL DEFAULT 'stagiaire' CHECK (role IN ('admin','formateur','stagiaire')),
  is_activated BOOLEAN NOT NULL DEFAULT false,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cours_users_cohorte ON tb_cours_users(cohorte);
CREATE INDEX IF NOT EXISTS idx_cours_users_role ON tb_cours_users(role);
CREATE INDEX IF NOT EXISTS idx_cours_users_auth ON tb_cours_users(auth_id);
CREATE INDEX IF NOT EXISTS idx_cours_users_mail ON tb_cours_users(adresse_mail);

CREATE TRIGGER trg_users_updated
  BEFORE UPDATE ON tb_cours_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── 2. Table des modules ───
CREATE TABLE IF NOT EXISTS tb_cours_modules (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  titre TEXT NOT NULL,
  description TEXT,
  duree_heures INTEGER NOT NULL,
  objectif TEXT,
  ordre INTEGER NOT NULL DEFAULT 0,
  icon_name TEXT DEFAULT 'book-open',
  couleur TEXT DEFAULT '#1f4590',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 3. Table des séquences ───
CREATE TABLE IF NOT EXISTS tb_cours_sequences (
  id SERIAL PRIMARY KEY,
  module_id INTEGER NOT NULL REFERENCES tb_cours_modules(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  titre TEXT NOT NULL,
  contenu_theorique TEXT,
  application_pratique TEXT,
  ordre INTEGER NOT NULL DEFAULT 0,
  icon_name TEXT DEFAULT 'layers',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(module_id, code)
);

CREATE INDEX IF NOT EXISTS idx_cours_sequences_module ON tb_cours_sequences(module_id);

-- ─── 4. Table de progression ───
CREATE TABLE IF NOT EXISTS tb_cours_progression (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES tb_cours_users(id) ON DELETE CASCADE,
  sequence_id INTEGER NOT NULL REFERENCES tb_cours_sequences(id) ON DELETE CASCADE,
  statut TEXT NOT NULL DEFAULT 'non_commence' CHECK (statut IN ('non_commence','en_cours','termine','valide')),
  score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  temps_passe_minutes INTEGER DEFAULT 0,
  date_debut TIMESTAMPTZ,
  date_fin TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, sequence_id)
);

CREATE INDEX IF NOT EXISTS idx_cours_progression_user ON tb_cours_progression(user_id);

CREATE TRIGGER trg_progression_updated
  BEFORE UPDATE ON tb_cours_progression
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── 5. Table des QCM ───
CREATE TABLE IF NOT EXISTS tb_cours_quiz (
  id SERIAL PRIMARY KEY,
  sequence_id INTEGER NOT NULL REFERENCES tb_cours_sequences(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  reponse_correcte INTEGER NOT NULL,
  explication TEXT,
  ordre INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 6. Table des réponses quiz ───
CREATE TABLE IF NOT EXISTS tb_cours_quiz_reponses (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES tb_cours_users(id) ON DELETE CASCADE,
  quiz_id INTEGER NOT NULL REFERENCES tb_cours_quiz(id) ON DELETE CASCADE,
  reponse_donnee INTEGER NOT NULL,
  est_correct BOOLEAN NOT NULL,
  tentative INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 7. Cohortes (référentiel) ───
CREATE TABLE IF NOT EXISTS tb_cours_cohortes (
  code TEXT PRIMARY KEY,
  libelle TEXT NOT NULL,
  description TEXT
);

INSERT INTO tb_cours_cohortes (code, libelle, description) VALUES
  ('CA',  'Comptable Assistant',              'Titre professionnel niveau 4'),
  ('GCF', 'Gestionnaire Comptable et Fiscal', 'Titre professionnel niveau 5'),
  ('SA',  'Secrétaire Assistant',             'Titre professionnel niveau 4'),
  ('AD',  'Assistant de Direction',           'Titre professionnel niveau 5'),
  ('GP',  'Gestionnaire de Paie',            'Titre professionnel niveau 5'),
  ('ARH', 'Assistant Ressources Humaines',    'Titre professionnel niveau 5'),
  ('AC',  'Assistant Commercial',             'Titre professionnel niveau 4')
ON CONFLICT (code) DO NOTHING;

-- ─── 8. Données des modules ───
INSERT INTO tb_cours_modules (code, titre, description, duree_heures, objectif, ordre, icon_name, couleur) VALUES
  ('MOD1', 'Les Fondamentaux de la Comptabilité',
   'Maîtriser le langage, les mécanismes et les états de synthèse comptables.',
   8, 'Maîtriser le langage, les mécanismes et les états de synthèse comptables avant la pratique opérationnelle.',
   1, 'book-open', '#1f4590'),
  ('MOD2', 'Gestion Administrative et Comptable des Clients (CP 1)',
   'Assurer la gestion administrative et comptable des clients.',
   8, 'Référentiel : Assurer la gestion administrative et comptable des clients.',
   2, 'users', '#1ca098'),
  ('MOD3', 'Gestion Administrative et Comptable des Fournisseurs (CP 2)',
   'Assurer la gestion administrative et comptable des fournisseurs.',
   8, 'Référentiel : Assurer la gestion administrative et comptable des fournisseurs.',
   3, 'truck', '#ff570a'),
  ('MOD4', 'Gestion des Opérations de Trésorerie (CP 3)',
   'Assurer la gestion des opérations de trésorerie.',
   8, 'Référentiel : Assurer la gestion administrative et comptable des opérations de trésorerie.',
   4, 'landmark', '#1f4590')
ON CONFLICT (code) DO NOTHING;

-- ─── 9. Données des séquences ───
INSERT INTO tb_cours_sequences (module_id, code, titre, ordre, icon_name) VALUES
  (1, 'SEQ1_1', 'Le langage comptable', 1, 'book-text'),
  (1, 'SEQ1_2', 'Le circuit de l''information comptable', 2, 'git-branch'),
  (1, 'SEQ1_3', 'La vision de synthèse', 3, 'pie-chart'),
  (2, 'SEQ2_1', 'De l''émission à l''enregistrement', 1, 'file-text'),
  (2, 'SEQ2_2', 'Suivi et relance', 2, 'bell-ring'),
  (2, 'SEQ2_3', 'Le rapprochement (lettrage)', 3, 'link'),
  (3, 'SEQ3_1', 'De la réception à l''enregistrement', 1, 'scan-line'),
  (3, 'SEQ3_2', 'Suivi des dettes', 2, 'clock'),
  (4, 'SEQ4_1', 'Encaissements et décaissements', 1, 'arrow-left-right'),
  (4, 'SEQ4_2', 'Justification et contrôle', 2, 'check-circle'),
  (4, 'SEQ4_3', 'Prévision', 3, 'trending-up')
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════
-- RLS (Row Level Security)
-- ═══════════════════════════════════════════
ALTER TABLE tb_cours_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tb_cours_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE tb_cours_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE tb_cours_progression ENABLE ROW LEVEL SECURITY;
ALTER TABLE tb_cours_quiz ENABLE ROW LEVEL SECURITY;
ALTER TABLE tb_cours_quiz_reponses ENABLE ROW LEVEL SECURITY;
ALTER TABLE tb_cours_cohortes ENABLE ROW LEVEL SECURITY;

-- Lecture publique contenu
CREATE POLICY "modules_read" ON tb_cours_modules FOR SELECT TO authenticated USING (true);
CREATE POLICY "sequences_read" ON tb_cours_sequences FOR SELECT TO authenticated USING (true);
CREATE POLICY "cohortes_read" ON tb_cours_cohortes FOR SELECT TO authenticated USING (true);
CREATE POLICY "quiz_read" ON tb_cours_quiz FOR SELECT TO authenticated USING (true);

-- Users : chacun voit son profil + admin/formateur voient tout
CREATE POLICY "users_select" ON tb_cours_users FOR SELECT TO authenticated
  USING (
    auth_id = auth.uid()
    OR EXISTS (SELECT 1 FROM tb_cours_users u WHERE u.auth_id = auth.uid() AND u.role IN ('admin','formateur'))
  );

-- Admin CRUD complet sur users
CREATE POLICY "users_admin_all" ON tb_cours_users FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM tb_cours_users u WHERE u.auth_id = auth.uid() AND u.role = 'admin'));

-- IMPORTANT : Permettre au signup de lier auth_id au profil existant
-- Le user peut UPDATE son propre profil pour y mettre son auth_id
CREATE POLICY "users_self_activate" ON tb_cours_users FOR UPDATE TO authenticated
  USING (adresse_mail = (SELECT email FROM auth.users WHERE id = auth.uid()))
  WITH CHECK (adresse_mail = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Progression
CREATE POLICY "progression_select" ON tb_cours_progression FOR SELECT TO authenticated
  USING (
    user_id IN (SELECT id FROM tb_cours_users WHERE auth_id = auth.uid())
    OR EXISTS (SELECT 1 FROM tb_cours_users u WHERE u.auth_id = auth.uid() AND u.role IN ('admin','formateur'))
  );

CREATE POLICY "progression_insert" ON tb_cours_progression FOR INSERT TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM tb_cours_users WHERE auth_id = auth.uid()));

CREATE POLICY "progression_update" ON tb_cours_progression FOR UPDATE TO authenticated
  USING (user_id IN (SELECT id FROM tb_cours_users WHERE auth_id = auth.uid()));

-- Quiz réponses
CREATE POLICY "quiz_reponses_all" ON tb_cours_quiz_reponses FOR ALL TO authenticated
  USING (
    user_id IN (SELECT id FROM tb_cours_users WHERE auth_id = auth.uid())
    OR EXISTS (SELECT 1 FROM tb_cours_users u WHERE u.auth_id = auth.uid() AND u.role IN ('admin','formateur'))
  );

-- Admin gère modules/séquences/quiz
CREATE POLICY "modules_admin" ON tb_cours_modules FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM tb_cours_users u WHERE u.auth_id = auth.uid() AND u.role = 'admin'));

CREATE POLICY "sequences_admin" ON tb_cours_sequences FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM tb_cours_users u WHERE u.auth_id = auth.uid() AND u.role = 'admin'));

CREATE POLICY "quiz_admin" ON tb_cours_quiz FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM tb_cours_users u WHERE u.auth_id = auth.uid() AND u.role = 'admin'));

-- ═══════════════════════════════════════════
-- Fonction d'activation au signup
-- Quand un user fait signup avec un email qui existe dans tb_cours_users,
-- on lie automatiquement son auth_id
-- ═══════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.tb_cours_users
  SET auth_id = NEW.id, is_activated = true, updated_at = now()
  WHERE adresse_mail = NEW.email AND auth_id IS NULL;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger sur auth.users pour auto-lier au signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ═══════════════════════════════════════════
-- QUIZ DE DÉMONSTRATION (3-5 questions par séquence)
-- L'admin peut ajouter/modifier via la table tb_cours_quiz
-- ═══════════════════════════════════════════

-- Module 1, Séquence 1 : Le langage comptable
INSERT INTO tb_cours_quiz (sequence_id, question, options, reponse_correcte, explication, ordre) VALUES
  (1, 'Quel est le principe fondamental de la comptabilité ?',
   '["Le principe de prudence","Le principe de la partie double","Le principe de continuité","Le principe de spécialisation"]',
   1, 'Le principe de la partie double stipule que toute écriture affecte au moins deux comptes : un au débit, un au crédit. Total débits = Total crédits.', 1),
  (1, 'À quelle classe du PCG appartient le compte 411 (Clients) ?',
   '["Classe 1 — Capitaux","Classe 4 — Tiers","Classe 5 — Financiers","Classe 7 — Produits"]',
   1, 'La classe 4 regroupe les comptes de tiers : clients (411), fournisseurs (401), personnel (421), État (445).', 2),
  (1, 'Lors d''une vente de prestation à 1 000 € HT (TVA 20 %), quel compte est crédité pour la TVA ?',
   '["44566 — TVA déductible","44571 — TVA collectée","411 — Clients","706 — Prestations"]',
   1, 'La TVA facturée au client est une TVA collectée (44571) — c''est une dette envers l''État, donc créditée.', 3),
  (1, 'Comment enregistre-t-on le paiement d''un fournisseur par virement ?',
   '["Débit 512, Crédit 401","Débit 401, Crédit 512","Débit 606, Crédit 512","Débit 401, Crédit 530"]',
   1, 'On diminue la dette (débit 401) et la banque diminue (crédit 512).', 4)
ON CONFLICT DO NOTHING;

-- Module 1, Séquence 2 : Le circuit de l'information
INSERT INTO tb_cours_quiz (sequence_id, question, options, reponse_correcte, explication, ordre) VALUES
  (2, 'Quel est l''ordre correct du circuit de l''information comptable ?',
   '["Balance → Journal → Grand livre → Pièce","Pièce justificative → Journal → Grand livre → Balance","Grand livre → Journal → Balance → Pièce","Journal → Pièce → Balance → Grand livre"]',
   1, 'La pièce justificative est le point de départ. Ensuite : journal (chronologique) → grand livre (par compte) → balance (synthèse).', 1),
  (2, 'Dans quel journal enregistre-t-on une facture d''achat ?',
   '["Journal des Ventes (VTE)","Journal de Banque (BQ)","Journal des Achats (ACH)","Journal des OD"]',
   2, 'Les factures fournisseurs sont enregistrées dans le journal des Achats (ACH).', 2),
  (2, 'Un solde débiteur sur le compte 411 (Clients) signifie que :',
   '["L''entreprise doit de l''argent au client","Le client nous doit de l''argent","Le compte est soldé","Il y a une erreur"]',
   1, 'Un solde débiteur sur le 411 est normal : il représente une créance, le client nous doit de l''argent.', 3)
ON CONFLICT DO NOTHING;

-- Module 1, Séquence 3 : La vision de synthèse
INSERT INTO tb_cours_quiz (sequence_id, question, options, reponse_correcte, explication, ordre) VALUES
  (3, 'Quelle est la règle fondamentale du bilan ?',
   '["Produits = Charges","Actif = Passif","Débit = Crédit","Capital = Résultat"]',
   1, 'Le bilan respecte toujours l''égalité : Total Actif (ce qu''on possède) = Total Passif (ce qu''on doit).', 1),
  (3, 'La Valeur Ajoutée (VA) se calcule comment ?',
   '["Produits − Charges","Production − Consommations en provenance des tiers","EBE − Dotations","Ventes − Achats de marchandises"]',
   1, 'La VA = Production de l''exercice − Consommations externes. Elle mesure la richesse créée par l''entreprise.', 2),
  (3, 'L''EBE (Excédent Brut d''Exploitation) représente :',
   '["Le bénéfice net","La performance brute d''exploitation","Le chiffre d''affaires","La marge commerciale"]',
   1, 'L''EBE = VA − Impôts/taxes − Charges de personnel. C''est la performance brute avant amortissements et résultat financier.', 3)
ON CONFLICT DO NOTHING;

-- Module 2, Séquence 1 : De l'émission à l'enregistrement
INSERT INTO tb_cours_quiz (sequence_id, question, options, reponse_correcte, explication, ordre) VALUES
  (4, 'Lors de l''émission d''une facture client de 6 000 € TTC (5 000 € HT), quelle écriture est passée ?',
   '["Débit 512, Crédit 706","Débit 411 6000, Crédit 706 5000 + Crédit 44571 1000","Débit 706, Crédit 411","Débit 44571, Crédit 411"]',
   1, 'Le client nous doit 6 000 € (débit 411), le produit est de 5 000 € (crédit 706), et la TVA collectée est de 1 000 € (crédit 44571).', 1),
  (4, 'Qu''est-ce que le lettrage ?',
   '["L''envoi d''une lettre de relance","L''association d''un paiement à sa facture correspondante","La numérotation des factures","Le classement alphabétique des clients"]',
   1, 'Le lettrage consiste à pointer (associer) un paiement reçu à la facture correspondante pour solder le compte client.', 2),
  (4, 'Comment enregistre-t-on un avoir client de 1 200 € TTC (1 000 € HT) ?',
   '["Débit 411, Crédit 706 + 44571","Débit 706 1000 + Débit 44571 200, Crédit 411 1200","Débit 512, Crédit 411","Débit 706, Crédit 512"]',
   1, 'L''avoir est l''inverse de la facture : on débite le produit (706) et la TVA (44571), et on crédite le client (411) pour réduire la créance.', 3)
ON CONFLICT DO NOTHING;

-- Module 2, Séquence 2 : Suivi et relance
INSERT INTO tb_cours_quiz (sequence_id, question, options, reponse_correcte, explication, ordre) VALUES
  (5, 'Qu''est-ce que la balance âgée ?',
   '["Un bilan simplifié","Un état classant les créances par ancienneté","Le relevé bancaire du client","La liste des avoirs"]',
   1, 'La balance âgée classe les factures impayées par tranches d''ancienneté (non échues, 0-30j, 30-60j, etc.) pour identifier les risques.', 1),
  (5, 'À partir de quel retard doit-on envisager une provision pour dépréciation ?',
   '["Dès le premier jour de retard","Après 30 jours","Après 90 jours généralement","Jamais"]',
   2, 'Au-delà de 90 jours de retard, la créance est considérée à risque et une provision pour dépréciation (compte 491) doit être envisagée.', 2),
  (5, 'Quel est le compte utilisé pour la provision pour dépréciation des clients ?',
   '["401","411","491","6817"]',
   2, 'Le compte 491 est « Dépréciation des comptes clients ». L''écriture est : Débit 6817 (dotation) / Crédit 491.', 3)
ON CONFLICT DO NOTHING;

-- Module 2, Séquence 3 : Le rapprochement (lettrage)
INSERT INTO tb_cours_quiz (sequence_id, question, options, reponse_correcte, explication, ordre) VALUES
  (6, 'Quelle est la différence entre un écart temporaire et un écart permanent dans le rapprochement bancaire ?',
   '["Il n''y a pas de différence","L''écart temporaire nécessite une écriture, pas le permanent","L''écart temporaire se résorbe seul, le permanent nécessite une écriture","Les deux nécessitent une écriture"]',
   2, 'Un écart temporaire (chèque non encaissé) se résorbera au prochain relevé. Un écart permanent (frais bancaires oubliés) nécessite une écriture comptable.', 1),
  (6, 'Comment comptabilise-t-on des frais bancaires de 20 € découverts lors du rapprochement ?',
   '["Débit 627, Crédit 512","Débit 512, Crédit 627","Débit 401, Crédit 512","Débit 627, Crédit 401"]',
   0, 'Les frais bancaires sont une charge (débit 627 Services bancaires) et la banque diminue (crédit 512).', 2),
  (6, 'Après lettrage complet d''un client, quel est le solde attendu du compte 411 ?',
   '["Débiteur","Créditeur","Nul (zéro)","Variable"]',
   2, 'Si toutes les factures sont lettrées avec leurs paiements, le solde du compte client doit être nul.', 3)
ON CONFLICT DO NOTHING;

-- Module 3, Séquence 1 : De la réception à l'enregistrement
INSERT INTO tb_cours_quiz (sequence_id, question, options, reponse_correcte, explication, ordre) VALUES
  (7, 'Quelle est la première étape lors de la réception d''une facture fournisseur ?',
   '["L''enregistrer immédiatement","La payer","Contrôler sa cohérence avec le bon de commande","La classer"]',
   2, 'Le contrôle (quantités, prix, TVA, conditions) est la première étape indispensable avant tout enregistrement.', 1),
  (7, 'Pourquoi la TVA sur un taxi n''est-elle pas récupérable ?',
   '["Parce que c''est un service","Parce que la loi l''exclut des dépenses ouvrant droit à déduction","Parce que le montant est trop faible","Parce qu''il n''y a pas de facture"]',
   1, 'La TVA sur les taxis, la restauration et les véhicules de tourisme n''est pas récupérable par disposition légale.', 2),
  (7, 'Comment enregistre-t-on une facture de fournitures de 300 € TTC (250 HT, 50 TVA) ?',
   '["Débit 606 250 + Débit 44566 50, Crédit 401 300","Débit 401 300, Crédit 606 250 + Crédit 44566 50","Débit 606 300, Crédit 401 300","Débit 606 250, Crédit 512 250"]',
   0, 'La charge est débitée (606), la TVA déductible est débitée (44566), et la dette fournisseur est créditée (401).', 3)
ON CONFLICT DO NOTHING;

-- Module 3, Séquence 2 : Suivi des dettes
INSERT INTO tb_cours_quiz (sequence_id, question, options, reponse_correcte, explication, ordre) VALUES
  (8, 'Quel est le délai légal maximum de paiement fournisseur ?',
   '["30 jours","45 jours","60 jours date de facture ou 45 jours fin de mois","90 jours"]',
   2, 'Le Code de commerce fixe le délai à 60 jours date de facture ou 45 jours fin de mois, sauf accord contractuel différent.', 1),
  (8, 'Comment enregistre-t-on un avoir fournisseur de 240 € TTC ?',
   '["Débit 401 240, Crédit 607 + 44566","Débit 607 + 44566, Crédit 401 240","Débit 401, Crédit 512","Débit 512, Crédit 401"]',
   0, 'L''avoir réduit la dette : débit 401 (diminution de la dette), crédit des comptes de charge et TVA.', 2)
ON CONFLICT DO NOTHING;

-- Module 4, Séquence 1 : Encaissements et décaissements
INSERT INTO tb_cours_quiz (sequence_id, question, options, reponse_correcte, explication, ordre) VALUES
  (9, 'Quel compte utilise-t-on pour un chèque reçu mais pas encore encaissé ?',
   '["512 — Banque","411 — Clients","511 — Chèques à encaisser","530 — Caisse"]',
   2, 'Le compte 511 permet de suivre les chèques en transit entre la réception et l''encaissement effectif.', 1),
  (9, 'Quel est l''avantage principal du virement SEPA groupé ?',
   '["Il est gratuit","Il permet de payer plusieurs fournisseurs en une seule opération","Il annule les pénalités de retard","Il augmente le délai de paiement"]',
   1, 'Le virement SEPA groupé permet de traiter plusieurs paiements en une seule opération, réduisant le risque d''oubli et le temps de traitement.', 2)
ON CONFLICT DO NOTHING;

-- Module 4, Séquence 2 : Justification et contrôle
INSERT INTO tb_cours_quiz (sequence_id, question, options, reponse_correcte, explication, ordre) VALUES
  (10, 'Que signifie un écart entre le solde du compte 512 et le relevé bancaire ?',
   '["Une erreur systématique","Des opérations en décalage temporel ou des écritures manquantes","Le compte est faux","La banque a fait une erreur"]',
   1, 'L''écart provient généralement de décalages temporels (chèques non encaissés) ou d''écritures manquantes (frais bancaires non saisis).', 1),
  (10, 'Comment comptabilise-t-on des intérêts créditeurs de 400 € découverts sur le relevé ?',
   '["Débit 512 400, Crédit 768 400","Débit 768 400, Crédit 512 400","Débit 627 400, Crédit 512 400","Débit 512 400, Crédit 627 400"]',
   0, 'Les intérêts créditeurs augmentent la banque (débit 512) et constituent un produit financier (crédit 768).', 2)
ON CONFLICT DO NOTHING;

-- Module 4, Séquence 3 : Prévision
INSERT INTO tb_cours_quiz (sequence_id, question, options, reponse_correcte, explication, ordre) VALUES
  (11, 'Quel est l''objectif principal du budget de trésorerie ?',
   '["Calculer le bénéfice","Anticiper les flux de trésorerie pour éviter les découverts","Établir le bilan","Calculer les cotisations sociales"]',
   1, 'Le budget de trésorerie projette les entrées et sorties futures pour anticiper les besoins de financement ou les excédents.', 1),
  (11, 'Si le solde prévisionnel devient négatif le 10/04, quelle action est recommandée ?',
   '["Attendre que ça se résorbe","Relancer un client pour accélérer un encaissement","Arrêter de payer les fournisseurs","Fermer le compte bancaire"]',
   1, 'Relancer un client en retard pour avancer un encaissement est une action concrète et efficace pour combler un déficit temporaire.', 2),
  (11, 'D''où proviennent les données d''encaissements dans le budget de trésorerie ?',
   '["Du compte de résultat","De l''échéancier clients (factures non échues et échues)","Du bilan","Des SIG"]',
   1, 'Les encaissements prévisionnels sont basés sur l''échéancier clients : les dates d''échéance des factures non encore réglées.', 3)
ON CONFLICT DO NOTHING;
