# GUIDE-STORAGE.md — Configuration Supabase v2

## Workflow d'inscription

1. **L'admin** importe un CSV (ou ajoute manuellement) → profil créé dans `tb_cours_users` avec `auth_id = NULL` et `is_activated = false`
2. **Le stagiaire** accède au site → clique sur « Activer mon compte »
3. **Il saisit son email** (doit correspondre à celui importé par l'admin) + **choisit son mot de passe**
4. **Supabase crée le user auth** → le trigger `handle_new_user()` lie automatiquement `auth_id` et passe `is_activated = true`
5. **Le stagiaire peut maintenant se connecter** avec son email et son mot de passe choisi

## 1. Créer la base de données

1. Allez dans **SQL Editor** dans Supabase
2. Collez `supabase-schema.sql` et exécutez
3. Les tables, triggers et RLS sont créés automatiquement

## 2. Configurer l'authentification

1. **Authentication > Providers** → Activez **Email**
2. **Désactivez** "Confirm email" (pour que l'activation soit instantanée)
3. Vérifiez que "Enable email signup" est activé

## 3. Configurer env.js

```javascript
const ENV = {
  SUPABASE_URL: 'https://votre-projet.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGci...',
  APP_NAME: 'RD COURS COMPTA',
  APP_VERSION: '2.0.0'
};
```

## 4. Créer le premier admin

Dans le SQL Editor :
```sql
INSERT INTO tb_cours_users (civilite, nom, prenom, adresse_mail, cohorte, role)
VALUES ('M', 'VOTRE_NOM', 'Prénom', 'votre@email.fr', 'CA', 'admin');
```
Puis activez votre compte via « Activer mon compte » sur la page de login.

## 5. Format CSV pour import en masse

```csv
civilite,nom,prenom,adresse_mail,cohorte,role
M,DUPONT,Jean,jean.dupont@email.fr,CA,stagiaire
Mme,MARTIN,Marie,marie.martin@email.fr,GCF,stagiaire
M,BERNARD,Pierre,pierre.bernard@email.fr,CA,formateur
```

**Colonnes obligatoires** : civilite, nom, prenom, adresse_mail, cohorte, role

**Valeurs acceptées** :
- civilite : `M` ou `Mme`
- cohorte : `CA`, `GCF`, `SA`, `AD`, `GP`, `ARH`, `AC`
- role : `admin`, `formateur`, `stagiaire`

## 6. Déploiement GitHub Pages

```bash
git init
git add .
git commit -m "RD COURS COMPTA v2"
git remote add origin https://github.com/USER/rd-cours-compta.git
git push -u origin main
```

Settings > Pages : source = main, dossier = / (root).

## Structure du projet

```
index.html (login + activation)
dashboard.html
env.js (.gitignore)
supabase-schema.sql
assets/icons/icon.svg
assets/images/logo.svg
core/config/constants.js, supabase.js
core/services/authService.js, storageService.js
core/theme/theme.js
core/utils/messages.js, utils.js
css/main.css → base/ components/ layout/ animations/ modules/
pages/auth/login.js, dashboard.js
pages/admin/index.html, admin.js
pages/modules/module1/ (index.html + seq1-3.html + module.js)
pages/modules/module2/ (index.html + seq1-3.html + module.js)
pages/modules/module3/ (index.html + seq1-2.html + module.js)
pages/modules/module4/ (index.html + seq1-3.html + module.js)
```
