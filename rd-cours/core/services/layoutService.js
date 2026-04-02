/**
 * RD COURS COMPTA — Shared Layout
 * Initialise le shell commun : sidebar, topbar, auth check, logout, mobile menu
 */

import authService from '../services/authService.js';
import { $, redirectTo } from '../utils/utils.js';
import { getCiviliteLabel } from '../utils/messages.js';
import { ROLES } from '../config/constants.js';

export async function initShell() {
  const session = await authService.getSession();
  if (!session) { redirectTo('../../../index.html'); return null; }

  const profile = await authService.getProfile();
  if (!profile) { redirectTo('../../../index.html'); return null; }

  // Render user info
  const avatar = $('#userAvatar');
  if (avatar) avatar.textContent = `${profile.prenom[0]}${profile.nom[0]}`;

  const nameEl = $('#userName');
  if (nameEl) nameEl.textContent = `${profile.prenom} ${profile.nom}`;

  const roleEl = $('#userRole');
  if (roleEl) roleEl.textContent = profile.role.charAt(0).toUpperCase() + profile.role.slice(1);

  // Admin nav
  if (profile.role === ROLES.ADMIN || profile.role === ROLES.FORMATEUR) {
    const adminLabel = $('#adminSectionLabel');
    const adminNav = $('#adminNavItem');
    if (adminLabel) adminLabel.style.display = '';
    if (adminNav) adminNav.style.display = '';
  }

  // Logout
  const logoutBtn = $('#logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await authService.logout();
      redirectTo('../../../index.html');
    });
  }

  // Mobile menu
  const menuToggle = $('#menuToggle');
  const sidebar = $('#sidebar');
  const overlay = $('#sidebarOverlay');

  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay?.classList.toggle('active');
    });
    overlay?.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    });
  }

  // Highlight current nav
  const currentPath = window.location.pathname;
  const navItems = document.querySelectorAll('.nav-item[data-module]');
  navItems.forEach(item => {
    if (currentPath.includes(item.getAttribute('href')?.replace(/^\.\.\//, ''))) {
      item.classList.add('nav-item--active');
    }
  });

  return profile;
}
