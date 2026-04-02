/**
 * RD COURS COMPTA — Utilitaires
 */
export const $ = (sel, ctx = document) => ctx.querySelector(sel);
export const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
export function redirectTo(page) { window.location.href = page; }

export const toast = {
  _container: null,
  _getContainer() {
    if (!this._container) { this._container = document.createElement('div'); this._container.className = 'toast-container'; document.body.appendChild(this._container); }
    return this._container;
  },
  show(message, type = 'info', duration = 3000) {
    const c = this._getContainer(), el = document.createElement('div');
    el.className = `toast toast--${type}`;
    const icons = { success: 'check-circle', error: 'x-circle', warning: 'alert-triangle', info: 'info' };
    el.innerHTML = `<i data-lucide="${icons[type]||'info'}"></i><span>${message}</span>`;
    c.appendChild(el);
    if (typeof lucide !== 'undefined') lucide.createIcons({ root: el });
    requestAnimationFrame(() => el.classList.add('toast--visible'));
    setTimeout(() => { el.classList.remove('toast--visible'); el.addEventListener('transitionend', () => el.remove()); }, duration);
  },
  success(m) { this.show(m, 'success'); },
  error(m) { this.show(m, 'error', 5000); },
  warning(m) { this.show(m, 'warning'); },
  info(m) { this.show(m, 'info'); }
};

export function handleError(error, context = '') {
  console.error(`[${context}]`, error);
  toast.error(error?.message || 'Une erreur est survenue');
}
