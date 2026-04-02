/**
 * RD WORKFLOW — Messages de bienvenue
 * Phrases dynamiques selon la civilité (M. / Mme)
 * Utilisé dans le dashboard après connexion
 */

// ─────────────────────────────────────────────────
// MESSAGES POUR LES HOMMES (M.)
// ─────────────────────────────────────────────────
export const MESSAGES_HOMME = [
  // ── Classiques motivants ──
  "Salut {prenom}, on fait parler les chiffres ?",
  "Hey {prenom}, prêt pour le grand chelem comptable ?",
  "Hello {prenom}, à l'attaque du Grand Livre !",
  "Bienvenue {prenom}, prêt à dompter la balance ?",
  "Salut {prenom}, aujourd'hui, on vise l'équilibre !",
  "Hey {prenom}, transforme tes factures en victoires !",
  "Bonjour {prenom}, en route pour la clôture ?",
  "Salut {prenom}, tes chiffres n'attendent que toi.",
  "Hello {prenom}, prêt à briller dans l'audit ?",
  "Bienvenue {prenom}, le roi de l'actif, c'est toi !",

  // ── Humour comptable ──
  "Salut {prenom}, débit à gauche, crédit à droite. Go !",
  "Hey {prenom}, prêt pour le Tetris des justificatifs ?",
  "Bonjour {prenom}, où est passée la facture de 12€20 ?",
  "Salut {prenom}, ici on compte tout, sauf ses heures !",
  "Hey {prenom}, spoiler : le bilan va s'équilibrer.",
  "Salut {prenom}, un café et ça repart en débit !",
  "Hey {prenom}, la TVA n'a qu'à bien se tenir.",
  "Salut {prenom}, Excel tremble déjà en te voyant.",
  "Bonjour {prenom}, le rapprochement bancaire, c'est comme un puzzle… en mieux.",
  "Hello {prenom}, aujourd'hui on fait du CTRL+S sur ta carrière.",

  // ── Zen & encourageant ──
  "Hello {prenom}, garde ton calme et gère tes flux.",
  "Bienvenue {prenom}, l'as du rapprochement bancaire !",
  "Salut {prenom}, une ligne après l'autre. Tu gères !",
  "Bonjour {prenom}, reste zen face aux chiffres.",
  "Hello {prenom}, prêt pour une saisie en douceur ?",
  "Bienvenue {prenom}, chaque écriture est un pas de plus.",
  "Hey {prenom}, respire, la compta va bien se passer.",
  "Salut {prenom}, prêt pour un audit tranquille ?",
  "Bonjour {prenom}, on met de l'ordre avec le sourire ?",
  "Hello {prenom}, focus et efficacité au programme.",

  // ── Entrepreneurial ──
  "Bienvenue {prenom}, ton cockpit financier est prêt.",
  "Salut {prenom}, un pas de plus vers la maîtrise !",
  "Bonjour {prenom}, prêt à optimiser ton empire ?",
  "Salut {prenom}, l'œil de lynx est de sortie ?",
  "Hello {prenom}, voyons la santé de ton business.",
  "Bienvenue {prenom}, maître de la rentabilité !",
  "Hey {prenom}, fais rimer rigueur et bonheur.",
  "Bonjour {prenom}, prêt à dénicher des économies ?",
  "Salut {prenom}, la stratégie commence ici.",
  "Hello {prenom}, tes finances te disent merci !",

  // ── Express ──
  "Hey {prenom}, let's count !",
  "Salut {prenom}, à tes calculatrices !",
  "Bonjour {prenom}, objectif : zéro erreur.",
  "Hello {prenom}, expert en action !",
  "Bienvenue {prenom}, cap sur le bénéfice !",
  "Hey {prenom}, on fait chanter la balance ?",
  "Salut {prenom}, prêt pour le sprint ?",
  "Bonjour {prenom}, l'art de compter, c'est ici.",
  "Hello {prenom}, focus on the numbers !",

  // ── Geek & technique ──
  "Salut {prenom}, le magicien des tableurs est là.",
  "Hey {prenom}, prêt à dompter la TVA ?",
  "Hello {prenom}, en mode turbo-compta !",
  "Bienvenue {prenom}, le garant de la tréso.",
  "Salut {prenom}, prêt à figer le Grand Livre ?",
  "Hey {prenom}, transformons ces dépenses en assets !",
  "Bonjour {prenom}, ton expertise fait la différence.",
  "Hello {prenom}, on vise le vert aujourd'hui ?",
  "Bienvenue {prenom}, le maître des écritures.",
  "Salut {prenom}, prêt à chasser les écarts ?",

  // ── Épiques ──
  "Hey {prenom}, la rigueur, c'est ton super-pouvoir.",
  "Bonjour {prenom}, on lance la machine à calculer ?",
  "Hello {prenom}, prêt à aligner les astres (et les chiffres) ?",
  "Bienvenue {prenom}, l'architecte de tes comptes.",
  "Salut {prenom}, un café, un clic, un bilan !",
  "Hey {prenom}, plus vite que ton ombre sur le pavé numérique.",
  "Bonjour {prenom}, prêt à réconcilier le passé et le présent ?",
  "Hello {prenom}, cap sur une gestion 5 étoiles.",
  "Bienvenue {prenom}, le gardien du temple financier.",

  // ── Nouvelles phrases ──
  "Salut {prenom}, les comptes attendent leur maestro.",
  "Hey {prenom}, le tableur est chaud, les doigts aussi.",
  "Bonjour {prenom}, aujourd'hui tu codes en débit-crédit.",
  "Hello {prenom}, même Pythagore serait impressionné.",
  "Bienvenue {prenom}, la balance générale te salue bien.",
  "Salut {prenom}, si les chiffres pouvaient parler, ils t'applaudiraient.",
  "Hey {prenom}, ton plan comptable est prêt au décollage.",
  "Bonjour {prenom}, chaque saisie te rapproche de la clôture.",
  "Hello {prenom}, le journal de banque ne se fera pas tout seul !",
  "Bienvenue {prenom}, le Grand Livre a besoin de son héros.",

  // ── Culture pop & références ──
  "Salut {prenom}, que la Force du Solde soit avec toi.",
  "Hey {prenom}, mission acceptée : équilibrer le bilan.",
  "Bonjour {prenom}, to be balanced or not to be balanced…",
  "Hello {prenom}, en mode Matrix : tu vois la matrice… comptable.",
  "Bienvenue {prenom}, dans un monde de charges, sois un produit.",
  "Salut {prenom}, même le fisc serait fier de toi.",
  "Hey {prenom}, compta is coming… et toi tu es prêt.",
  "Bonjour {prenom}, tu es le Harry Potter des immobilisations.",
  "Hello {prenom}, « Un centime d'avance, mille soucis en moins. »",
  "Bienvenue {prenom}, l'homme qui murmurait à l'oreille des comptes.",

  // ── Philosophiques & inspirants ──
  "Salut {prenom}, derrière chaque chiffre, il y a une histoire.",
  "Hey {prenom}, la précision est l'élégance du comptable.",
  "Bonjour {prenom}, les détails font la perfection, et tu le sais.",
  "Hello {prenom}, un bilan équilibré, c'est un esprit en paix.",
  "Bienvenue {prenom}, la patience est la première vertu du financier.",
  "Salut {prenom}, ton sens du détail est ton meilleur investissement.",
  "Hey {prenom}, chaque jour est un nouveau bilan d'ouverture.",
  "Bonjour {prenom}, la compta, c'est l'art de voir ce que les autres ne voient pas.",
  "Hello {prenom}, ton travail d'aujourd'hui est le résultat de demain.",
  "Bienvenue {prenom}, l'excellence se cache dans les centimes."
];


// ─────────────────────────────────────────────────
// MESSAGES POUR LES FEMMES (Mme)
// ─────────────────────────────────────────────────
export const MESSAGES_FEMME = [
  // ── Classiques motivants ──
  "Salut {prenom}, on fait parler les chiffres ?",
  "Hey {prenom}, prête pour le grand chelem comptable ?",
  "Hello {prenom}, à l'attaque du Grand Livre !",
  "Bienvenue {prenom}, prête à dompter la balance ?",
  "Salut {prenom}, aujourd'hui, on vise l'équilibre !",
  "Hey {prenom}, transforme tes factures en victoires !",
  "Bonjour {prenom}, en route pour la clôture ?",
  "Salut {prenom}, tes chiffres n'attendent que toi.",
  "Hello {prenom}, prête à briller dans l'audit ?",
  "Bienvenue {prenom}, la reine de l'actif, c'est toi !",

  // ── Humour comptable ──
  "Salut {prenom}, débit à gauche, crédit à droite. Go !",
  "Hey {prenom}, prête pour le Tetris des justificatifs ?",
  "Bonjour {prenom}, où est passée la facture de 12€20 ?",
  "Salut {prenom}, ici on compte tout, sauf ses heures !",
  "Hey {prenom}, spoiler : le bilan va s'équilibrer.",
  "Salut {prenom}, un café et ça repart en débit !",
  "Hey {prenom}, la TVA n'a qu'à bien se tenir.",
  "Salut {prenom}, Excel tremble déjà en te voyant.",
  "Bonjour {prenom}, le rapprochement bancaire, c'est comme un puzzle… en mieux.",
  "Hello {prenom}, aujourd'hui on fait du CTRL+S sur ta carrière.",

  // ── Zen & encourageant ──
  "Hello {prenom}, garde ton calme et gère tes flux.",
  "Bienvenue {prenom}, l'as du rapprochement bancaire !",
  "Salut {prenom}, une ligne après l'autre. Tu gères !",
  "Bonjour {prenom}, reste zen face aux chiffres.",
  "Hello {prenom}, prête pour une saisie en douceur ?",
  "Bienvenue {prenom}, chaque écriture est un pas de plus.",
  "Hey {prenom}, respire, la compta va bien se passer.",
  "Salut {prenom}, prête pour un audit tranquille ?",
  "Bonjour {prenom}, on met de l'ordre avec le sourire ?",
  "Hello {prenom}, focus et efficacité au programme.",

  // ── Entrepreneurial ──
  "Bienvenue {prenom}, ton cockpit financier est prêt.",
  "Salut {prenom}, un pas de plus vers la maîtrise !",
  "Bonjour {prenom}, prête à optimiser ton empire ?",
  "Salut {prenom}, l'œil de lynx est de sortie ?",
  "Hello {prenom}, voyons la santé de ton business.",
  "Bienvenue {prenom}, maîtresse de la rentabilité !",
  "Hey {prenom}, fais rimer rigueur et bonheur.",
  "Bonjour {prenom}, prête à dénicher des économies ?",
  "Salut {prenom}, la stratégie commence ici.",
  "Hello {prenom}, tes finances te disent merci !",

  // ── Express ──
  "Hey {prenom}, let's count !",
  "Salut {prenom}, à tes calculatrices !",
  "Bonjour {prenom}, objectif : zéro erreur.",
  "Hello {prenom}, experte en action !",
  "Bienvenue {prenom}, cap sur le bénéfice !",
  "Hey {prenom}, on fait chanter la balance ?",
  "Salut {prenom}, prête pour le sprint ?",
  "Bonjour {prenom}, l'art de compter, c'est ici.",
  "Hello {prenom}, focus on the numbers !",

  // ── Geek & technique ──
  "Salut {prenom}, la magicienne des tableurs est là.",
  "Hey {prenom}, prête à dompter la TVA ?",
  "Hello {prenom}, en mode turbo-compta !",
  "Bienvenue {prenom}, la garante de la tréso.",
  "Salut {prenom}, prête à figer le Grand Livre ?",
  "Hey {prenom}, transformons ces dépenses en assets !",
  "Bonjour {prenom}, ton expertise fait la différence.",
  "Hello {prenom}, on vise le vert aujourd'hui ?",
  "Bienvenue {prenom}, la maîtresse des écritures.",
  "Salut {prenom}, prête à chasser les écarts ?",

  // ── Épiques ──
  "Hey {prenom}, la rigueur, c'est ton super-pouvoir.",
  "Bonjour {prenom}, on lance la machine à calculer ?",
  "Hello {prenom}, prête à aligner les astres (et les chiffres) ?",
  "Bienvenue {prenom}, l'architecte de tes comptes.",
  "Salut {prenom}, un café, un clic, un bilan !",
  "Hey {prenom}, plus vite que ton ombre sur le pavé numérique.",
  "Bonjour {prenom}, prête à réconcilier le passé et le présent ?",
  "Hello {prenom}, cap sur une gestion 5 étoiles.",
  "Bienvenue {prenom}, la gardienne du temple financier.",

  // ── Nouvelles phrases ──
  "Salut {prenom}, les comptes attendent leur virtuose.",
  "Hey {prenom}, le tableur est chaud, les doigts aussi.",
  "Bonjour {prenom}, aujourd'hui tu codes en débit-crédit.",
  "Hello {prenom}, même Pythagore serait impressionné.",
  "Bienvenue {prenom}, la balance générale te salue bien.",
  "Salut {prenom}, si les chiffres pouvaient parler, ils t'applaudiraient.",
  "Hey {prenom}, ton plan comptable est prêt au décollage.",
  "Bonjour {prenom}, chaque saisie te rapproche de la clôture.",
  "Hello {prenom}, le journal de banque ne se fera pas tout seul !",
  "Bienvenue {prenom}, le Grand Livre a besoin de son héroïne.",

  // ── Culture pop & références ──
  "Salut {prenom}, que la Force du Solde soit avec toi.",
  "Hey {prenom}, mission acceptée : équilibrer le bilan.",
  "Bonjour {prenom}, to be balanced or not to be balanced…",
  "Hello {prenom}, en mode Matrix : tu vois la matrice… comptable.",
  "Bienvenue {prenom}, dans un monde de charges, sois un produit.",
  "Salut {prenom}, même le fisc serait fier de toi.",
  "Hey {prenom}, compta is coming… et toi tu es prête.",
  "Bonjour {prenom}, tu es la Hermione des immobilisations.",
  "Hello {prenom}, « Un centime d'avance, mille soucis en moins. »",
  "Bienvenue {prenom}, celle qui murmurait à l'oreille des comptes.",

  // ── Philosophiques & inspirants ──
  "Salut {prenom}, derrière chaque chiffre, il y a une histoire.",
  "Hey {prenom}, la précision est l'élégance de la comptable.",
  "Bonjour {prenom}, les détails font la perfection, et tu le sais.",
  "Hello {prenom}, un bilan équilibré, c'est un esprit en paix.",
  "Bienvenue {prenom}, la patience est la première vertu de la financière.",
  "Salut {prenom}, ton sens du détail est ton meilleur investissement.",
  "Hey {prenom}, chaque jour est un nouveau bilan d'ouverture.",
  "Bonjour {prenom}, la compta, c'est l'art de voir ce que les autres ne voient pas.",
  "Hello {prenom}, ton travail d'aujourd'hui est le résultat de demain.",
  "Bienvenue {prenom}, l'excellence se cache dans les centimes."
];


// ─────────────────────────────────────────────────
// MESSAGES ADMIN (formateur)
// ─────────────────────────────────────────────────
export const MESSAGES_ADMIN = [
  "Salut {prenom}, le commandant de bord est aux commandes.",
  "Bienvenue {prenom}, prêt à former les futurs pros ?",
  "Hello {prenom}, le tableau de bord est opérationnel.",
  "Salut {prenom}, tes stagiaires t'attendent !",
  "Bonjour {prenom}, l'architecte pédagogique est dans la place.",
  "Hey {prenom}, on façonne les talents d'aujourd'hui et de demain.",
  "Salut {prenom}, la formation commence… maintenant.",
  "Bienvenue {prenom}, le formateur légendaire est de retour.",
  "Hello {prenom}, mode superviseur activé.",
  "Bonjour {prenom}, prêt à envoyer quelques mails fictifs ?",
  "Salut {prenom}, vos stagiaires progressent, et c'est grâce à vous.",
  "Hey {prenom}, le meilleur formateur est celui qui est là. Bravo.",
  "Bonjour {prenom}, Supabase est debout, les élèves aussi.",
  "Hello {prenom}, nouvel exercice ou nouvelle mission ?",
  "Bienvenue {prenom}, le chef d'orchestre est prêt."
];


// ─────────────────────────────────────────────────
// MESSAGES FORMATEUR
// Développement personnel, motivation, humour collègue
// ─────────────────────────────────────────────────
export const MESSAGES_FORMATEUR = [
  // ── Motivation & développement personnel ──
  "Salut {prenom}, chaque jour est une chance d'inspirer quelqu'un.",
  "Hey {prenom}, ton énergie est contagieuse, utilise-la bien !",
  "Bonjour {prenom}, le meilleur investissement, c'est en toi-même.",
  "Hello {prenom}, enseigner c'est apprendre deux fois.",
  "Bienvenue {prenom}, ta patience est ton super-pouvoir.",
  "Salut {prenom}, aujourd'hui tu plantes des graines de compétences.",
  "Hey {prenom}, derrière chaque pro, il y a un formateur exceptionnel.",
  "Bonjour {prenom}, le succès de tes stagiaires, c'est le tien.",
  "Hello {prenom}, la bienveillance est la meilleure pédagogie.",
  "Bienvenue {prenom}, prêt(e) à transformer des vies ?",

  // ── Humour entre collègues ──
  "Salut {prenom}, café servi, stagiaires pas encore perdus ? Bonne journée.",
  "Hey {prenom}, spoiler : la pause café est dans 2h. Courage.",
  "Bonjour {prenom}, tes slides sont prêtes ou on improvise ?",
  "Hello {prenom}, le PowerPoint ne va pas se faire tout seul… quoique.",
  "Bienvenue {prenom}, les stagiaires sont motivés. Enfin, la plupart.",
  "Salut {prenom}, tu gères comme un chef. Littéralement.",
  "Hey {prenom}, on parie combien que quelqu'un va demander « c'est noté ? »",
  "Bonjour {prenom}, les post-its sont rechargés, le tableau est propre. Let's go.",
  "Hello {prenom}, entre formateurs, on se soutient. T'es pas seul(e) !",
  "Bienvenue {prenom}, la machine à café te dit bonjour aussi.",

  // ── Inspirants ──
  "Salut {prenom}, « Le seul échec est de ne pas essayer. »",
  "Hey {prenom}, chaque stagiaire est un potentiel qui s'ignore.",
  "Bonjour {prenom}, la confiance que tu donnes revient toujours en compétence.",
  "Hello {prenom}, former, c'est croire en l'autre avant qu'il y croie lui-même.",
  "Bienvenue {prenom}, ta mission est noble, ne l'oublie jamais.",
  "Salut {prenom}, « L'éducation est l'arme la plus puissante. » — Mandela",
  "Hey {prenom}, sois le formateur que tu aurais aimé avoir.",
  "Bonjour {prenom}, chaque question posée est un signe de progrès.",
  "Hello {prenom}, la répétition est la mère de l'apprentissage.",
  "Bienvenue {prenom}, on n'enseigne pas ce qu'on sait, on enseigne ce qu'on est.",

  // ── Fun & léger ──
  "Salut {prenom}, mode formateur activé. Prêt(e) à briller !",
  "Hey {prenom}, tes stagiaires ont de la chance de t'avoir.",
  "Bonjour {prenom}, aujourd'hui objectif : zéro regard perdu.",
  "Hello {prenom}, si la pédagogie était un sport, tu serais champion(ne).",
  "Bienvenue {prenom}, rappel : tu fais un métier qui a du sens.",
  "Salut {prenom}, 50% pédagogie, 50% patience, 100% talent.",
  "Hey {prenom}, la salle t'attend, le vidéoprojecteur aussi (s'il veut bien).",
  "Bonjour {prenom}, ton impact va bien au-delà de la salle de formation.",
  "Hello {prenom}, nouveaux défis, nouvelles victoires.",
  "Bienvenue {prenom}, former c'est aimer ce qu'on fait, et ça se voit.",

  // ── Culture pop adaptée ──
  "Salut {prenom}, que la Force pédagogique soit avec toi.",
  "Hey {prenom}, « Un grand pouvoir implique une grande responsabilité. » — Ton contrat.",
  "Bonjour {prenom}, tel un Jedi, tu guides tes padawans.",
  "Hello {prenom}, « La vie, c'est comme une boîte de stagiaires… » — Forrest",
  "Bienvenue {prenom}, même Dumbledore envierait ta classe.",
  "Salut {prenom}, tu es le Gandalf de cette formation : « Vous ne passerez pas… sans avoir compris. »",
  "Hey {prenom}, to teach or not to teach ? That is NOT the question.",
  "Bonjour {prenom}, mission : transformer les débutants en experts.",
  "Hello {prenom}, Netflix a des séries, toi tu as des cohortes. Même passion.",
  "Bienvenue {prenom}, « Il n'y a pas de mauvais élèves, que des méthodes à adapter. »"
];


// ─────────────────────────────────────────────────
// FONCTION UTILITAIRE
// ─────────────────────────────────────────────────

/**
 * Retourne un message aléatoire selon le profil
 * @param {Object} profile - { prenom, civilite, role }
 * @returns {string} Message personnalisé
 */
export function getRandomMessage(profile) {
  const { prenom, civilite, role } = profile;

  let pool;
  if (role === 'admin') {
    pool = MESSAGES_ADMIN;
  } else if (role === 'formateur') {
    pool = MESSAGES_FORMATEUR;
  } else if (civilite === 'Mme') {
    pool = MESSAGES_FEMME;
  } else {
    pool = MESSAGES_HOMME;
  }

  const index = Math.floor(Math.random() * pool.length);
  return pool[index].replace(/\{prenom\}/g, prenom || 'champion');
}

/**
 * Retourne le titre de civilité complet
 */
export function getCiviliteLabel(civilite) {
  if (civilite === 'Mme') return 'Madame';
  if (civilite === 'M') return 'Monsieur';
  return '';
}
