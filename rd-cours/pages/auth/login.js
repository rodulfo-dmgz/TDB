/**
 * RD COURS COMPTA — Login + Activation
 * Workflow : Admin crée profil (auth_id=null) → stagiaire s'active via signup
 * Le trigger Supabase handle_new_user() lie automatiquement auth_id
 */
import authService from '../../core/services/authService.js';
import { $, toast, handleError, redirectTo } from '../../core/utils/utils.js';

class LoginPage {
  constructor() {
    this.init();
  }

  async init() {
    const session = await authService.getSession();
    if (session) {
      // Vérifier que le profil est bien lié
      try {
        const profile = await authService.getProfile();
        if (profile) { redirectTo('dashboard.html'); return; }
      } catch(e) { /* profil pas encore lié, on reste sur login */ }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => this.attachEvents());
    else this.attachEvents();
  }

  attachEvents() {
    // Login form
    const loginForm = $('#loginForm');
    const activateForm = $('#activateForm');

    loginForm?.addEventListener('submit', (e) => this.handleLogin(e));
    activateForm?.addEventListener('submit', (e) => this.handleActivate(e));

    // Toggle between forms
    $('#showActivateLink')?.addEventListener('click', (e) => {
      e.preventDefault();
      loginForm.style.display = 'none';
      activateForm.style.display = 'flex';
    });
    $('#showLoginLink')?.addEventListener('click', (e) => {
      e.preventDefault();
      activateForm.style.display = 'none';
      loginForm.style.display = 'flex';
    });

    // Password toggles
    this.setupPasswordToggle('passwordToggle', 'password');
    this.setupPasswordToggle('activatePasswordToggle', 'activatePassword');

    // Forgot password modal
    const forgotLink = $('#forgotPasswordLink');
    const forgotModal = $('#forgotPasswordModal');
    if (forgotLink && forgotModal) {
      forgotLink.addEventListener('click', (e) => { e.preventDefault(); forgotModal.style.display = 'block'; });
      const close = () => { forgotModal.style.display = 'none'; };
      $('#forgotModalCloseBtn')?.addEventListener('click', close);
      $('#forgotModalBackdrop')?.addEventListener('click', close);
    }
  }

  setupPasswordToggle(toggleId, inputId) {
    const toggle = $(`#${toggleId}`);
    const input = $(`#${inputId}`);
    if (!toggle || !input) return;
    toggle.addEventListener('click', () => {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      toggle.innerHTML = '';
      const icon = document.createElement('i');
      icon.setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
      toggle.appendChild(icon);
      if (typeof lucide !== 'undefined') lucide.createIcons({ root: toggle });
    });
  }

  async handleLogin(e) {
    e.preventDefault();
    const email = $('#email').value.trim();
    const password = $('#password').value;

    if (!email) { this.showError('email-error', "L'email est requis"); return; }
    if (!password) { this.showError('password-error', 'Le mot de passe est requis'); return; }

    const btn = $('#submitBtn');
    btn.disabled = true;
    btn.classList.add('btn--loading');

    try {
      await authService.login(email, password);
      toast.success('Connexion réussie !');
      setTimeout(() => redirectTo('dashboard.html'), 500);
    } catch (error) {
      btn.disabled = false;
      btn.classList.remove('btn--loading');

      if (error.message?.includes('Invalid login')) {
        this.showError('globalError', 'Email ou mot de passe incorrect.');
      } else {
        handleError(error, 'Connexion');
      }
    }
  }

  async handleActivate(e) {
    e.preventDefault();
    const email = $('#activateEmail').value.trim();
    const password = $('#activatePassword').value;
    const confirm = $('#activatePasswordConfirm').value;

    // Reset errors
    ['activate-email-error', 'activate-pwd-error', 'activate-confirm-error', 'activateGlobalError'].forEach(id => {
      const el = $(`#${id}`);
      if (el) el.style.display = 'none';
    });

    if (!email) { this.showError('activate-email-error', "L'email est requis"); return; }
    if (!password || password.length < 6) { this.showError('activate-pwd-error', 'Minimum 6 caractères'); return; }
    if (password !== confirm) { this.showError('activate-confirm-error', 'Les mots de passe ne correspondent pas'); return; }

    const btn = $('#activateSubmitBtn');
    btn.disabled = true;
    btn.classList.add('btn--loading');

    try {
      // 1. Vérifier que l'email existe dans tb_cours_users (pré-créé par admin)
      const profile = await authService.checkEmailExists(email);
      if (!profile) {
        this.showError('activateGlobalError', "Aucun profil trouvé avec cet email. Contactez votre formateur.");
        btn.disabled = false;
        btn.classList.remove('btn--loading');
        return;
      }

      if (profile.is_activated) {
        this.showError('activateGlobalError', "Ce compte est déjà activé. Utilisez « Se connecter ».");
        btn.disabled = false;
        btn.classList.remove('btn--loading');
        return;
      }

      // 2. Signup via Supabase Auth → le trigger handle_new_user() lie automatiquement auth_id
      await authService.signup(email, password);

      // 3. Succès
      const successEl = $('#activateSuccess');
      if (successEl) {
        successEl.textContent = `Bienvenue ${profile.prenom} ! Votre compte est activé. Vous pouvez maintenant vous connecter.`;
        successEl.style.display = 'block';
      }

      btn.textContent = 'Compte activé !';
      btn.disabled = true;

      // Auto-switch to login after 3s
      setTimeout(() => {
        $('#activateForm').style.display = 'none';
        $('#loginForm').style.display = 'flex';
        $('#email').value = email;
        toast.success('Compte activé ! Connectez-vous avec votre nouveau mot de passe.');
      }, 3000);

    } catch (error) {
      btn.disabled = false;
      btn.classList.remove('btn--loading');

      if (error.message?.includes('already registered')) {
        this.showError('activateGlobalError', "Cet email est déjà enregistré. Utilisez « Se connecter ».");
      } else {
        this.showError('activateGlobalError', error.message || 'Erreur lors de l\'activation.');
      }
    }
  }

  showError(elementId, message) {
    const el = $(`#${elementId}`);
    if (el) { el.textContent = message; el.style.display = 'block'; }
  }
}

new LoginPage();
