// core/auth.js – Gestion de l'authentification (inscription / connexion)
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('auth-form');
  const messageContainer = document.getElementById('message-container');

  // Vérifier que les variables Supabase sont définies
  if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
    messageContainer.innerHTML =
      '<div class="alert-box" style="color: var(--danger);">⚠️ Configuration Supabase manquante. Veuillez renseigner core/config.js.</div>';
    return;
  }

  const supabase = createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

  // ─── Normalisation de la civilité ────────────────────────────────────────
  // Uniformise toutes les variantes vers les valeurs acceptées par la BDD
  function normaliseCivilite(valeur) {
    const v = (valeur || '').trim();
    if (['M', 'M.', 'Mr', 'Mr.', 'H'].includes(v)) return 'M.';
    if (['Mme', 'F', 'Mlle', 'Madame', 'Mademoiselle'].includes(v)) return 'Mme';
    return v; // fallback : renvoie tel quel
  }

  // ─── Affichage structuré des erreurs Supabase ─────────────────────────────
  function afficherErreur(error) {
    console.error('Erreur Supabase complète :', error);

    let detail = '';
    if (error?.message) detail = error.message;
    else if (error?.error_description) detail = error.error_description;
    else detail = JSON.stringify(error);

    // Aide contextuelle selon le type d'erreur
    let aide = '';
    if (detail.includes('check') || detail.includes('constraint')) {
      aide = '👉 La valeur de la civilité est rejetée par une contrainte CHECK dans Supabase. Vérifiez les valeurs autorisées pour la colonne <code>civilite</code>.';
    } else if (detail.includes('permission') || detail.includes('policy') || detail.includes('RLS') || detail.includes('row-level')) {
      aide = '👉 Une politique RLS bloque l\'opération. Activez une policy INSERT publique sur la table <code>cours_kpi_users</code> dans Supabase → Authentication → Policies.';
    } else if (detail.includes('null') || detail.includes('not-null')) {
      aide = '👉 Un champ obligatoire est manquant ou null. Vérifiez les colonnes NOT NULL de votre table.';
    } else if (detail.includes('duplicate') || detail.includes('unique')) {
      aide = '👉 Un enregistrement avec ces données existe déjà (contrainte UNIQUE).';
    }

    messageContainer.innerHTML = `
      <div class="alert-box" style="color: var(--danger); line-height:1.6;">
        ❌ <strong>Erreur Supabase :</strong> ${detail}
        ${aide ? `<br><br>${aide}` : ''}
      </div>`;
  }

  // ─── Soumission du formulaire ─────────────────────────────────────────────
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    messageContainer.innerHTML = '';

    const civiliteRaw = document.getElementById('civilite').value;
    const civilite    = normaliseCivilite(civiliteRaw);
    const nom         = document.getElementById('nom').value.trim();
    const prenom      = document.getElementById('prenom').value.trim();
    const email       = document.getElementById('email').value.trim();

    // Validation basique
    if (!nom || !prenom || !email) {
      messageContainer.innerHTML =
        '<div class="alert-box" style="color: var(--danger);">Tous les champs sont requis.</div>';
      return;
    }

    // Log de debug (à retirer en production)
    console.log('Données envoyées :', { civilite, nom, prenom, email });

    try {
      // Vérifier si l'utilisateur existe déjà
      const { data: existingUser, error: selectError } = await supabase
        .from('cours_kpi_users')
        .select('*')
        .eq('email', email);

      if (selectError) throw selectError;

      if (existingUser && existingUser.length > 0) {
        // ── Connexion (utilisateur existant) ──
        const user = existingUser[0];
        localStorage.setItem('kpi_user', JSON.stringify(user));
        messageContainer.innerHTML =
          '<div class="info-box" style="color: var(--success);">✅ Connexion réussie. Redirection...</div>';
        setTimeout(() => { window.location.href = 'page1.html'; }, 1500);

      } else {
        // ── Inscription (nouvel utilisateur) ──
        const { data: newUser, error: insertError } = await supabase
          .from('cours_kpi_users')
          .insert([{ civilite, nom, prenom, email }])
          .select();

        if (insertError) throw insertError;

        const user = newUser[0];
        localStorage.setItem('kpi_user', JSON.stringify(user));
        messageContainer.innerHTML =
          '<div class="info-box" style="color: var(--success);">✅ Inscription réussie. Bienvenue !</div>';
        setTimeout(() => { window.location.href = 'page1.html'; }, 1500);
      }

    } catch (error) {
      afficherErreur(error);
    }
  });
});
