/**
 * RD COURS COMPTA — Dashboard
 */
import authService from '../../core/services/authService.js';
import storageService from '../../core/services/storageService.js';
import { $, redirectTo, toast } from '../../core/utils/utils.js';
import { getRandomMessage, getCiviliteLabel } from '../../core/utils/messages.js';
import { ROLES } from '../../core/config/constants.js';

class DashboardPage {
  constructor() { this.profile = null; this.init(); }

  async init() {
    try {
      const session = await authService.getSession();
      if (!session) { redirectTo('index.html'); return; }
      this.profile = await authService.getProfile();
      if (!this.profile) { redirectTo('index.html'); return; }
      this.renderUser();
      this.renderWelcome();
      this.attachEvents();
      await this.loadProgression();
    } catch (e) { console.error(e); redirectTo('index.html'); }
  }

  renderUser() {
    const { prenom, nom, role } = this.profile;
    const a = $('#userAvatar'); if (a) a.textContent = `${prenom[0]}${nom[0]}`;
    const n = $('#userName'); if (n) n.textContent = `${prenom} ${nom}`;
    const r = $('#userRole');
    if (r) {
      if (role === 'stagiaire') {
        const cohorteLabels = { CA:'Comptable Assistant', GCF:'Gestionnaire Comptable et Fiscal', SA:'Secrétaire Assistant', AD:'Assistant de Direction', GP:'Gestionnaire de Paie', ARH:'Assistant Ressources Humaines', AC:'Assistant Commercial' };
        r.textContent = cohorteLabels[this.profile.cohorte] || this.profile.cohorte;
      } else {
        r.textContent = role.charAt(0).toUpperCase() + role.slice(1);
      }
    }
    if (role === ROLES.ADMIN || role === ROLES.FORMATEUR) {
      const l = $('#adminSectionLabel'); if (l) l.style.display = '';
      const v = $('#adminNavItem'); if (v) v.style.display = '';
    }
  }

  renderWelcome() {
    const g = $('#welcomeGreeting');
    if (g) g.textContent = `${getCiviliteLabel(this.profile.civilite)} ${this.profile.nom}`;
    const m = $('#welcomeMessage');
    if (m) m.textContent = getRandomMessage(this.profile);
  }

  async loadProgression() {
    try {
      const p = await storageService.getProgression(this.profile.id);
      const done = p?.filter(x => x.statut === 'termine' || x.statut === 'valide').length || 0;
      const s = $('#statCompleted'); if (s) s.textContent = `${done} / 11`;
      const pr = $('#statProgress'); if (pr) pr.textContent = `${Math.round((done/11)*100)}%`;
    } catch(e) { console.error(e); }
  }

  attachEvents() {
    $('#logoutBtn')?.addEventListener('click', async () => { await authService.logout(); redirectTo('index.html'); });
    const mt = $('#menuToggle'), sb = $('#sidebar'), ov = $('#sidebarOverlay');
    if (mt && sb) {
      mt.addEventListener('click', () => { sb.classList.toggle('open'); ov?.classList.toggle('active'); });
      ov?.addEventListener('click', () => { sb.classList.remove('open'); ov.classList.remove('active'); });
    }
  }
}
new DashboardPage();
