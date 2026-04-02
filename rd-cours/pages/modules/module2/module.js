/**
 * RD COURS COMPTA — Module/Sequence Page
 */
import authService from '../../../core/services/authService.js';
import { $, redirectTo } from '../../../core/utils/utils.js';
import { ROLES } from '../../../core/config/constants.js';

class ModulePage {
  constructor() { this.init(); }
  async init() {
    try {
      const s = await authService.getSession();
      if (!s) { redirectTo('../../../index.html'); return; }
      this.profile = await authService.getProfile();
      if (!this.profile) { redirectTo('../../../index.html'); return; }
      this.renderUser(); this.attachEvents();
    } catch(e) { console.error(e); }
  }
  renderUser() {
    const {prenom,nom,role} = this.profile;
    const a=$('#userAvatar'); if(a) a.textContent=`${prenom[0]}${nom[0]}`;
    const n=$('#userName'); if(n) n.textContent=`${prenom} ${nom}`;
    const r=$('#userRole'); if(r) r.textContent=role.charAt(0).toUpperCase()+role.slice(1);
    if(role===ROLES.ADMIN||role===ROLES.FORMATEUR){
      const l=$('#adminSectionLabel');if(l)l.style.display='';
      const v=$('#adminNavItem');if(v)v.style.display='';
    }
  }
  attachEvents() {
    $('#logoutBtn')?.addEventListener('click',async()=>{await authService.logout();redirectTo('../../../index.html');});
    const mt=$('#menuToggle'),sb=$('#sidebar'),ov=$('#sidebarOverlay');
    if(mt&&sb){mt.addEventListener('click',()=>{sb.classList.toggle('open');ov?.classList.toggle('active');});ov?.addEventListener('click',()=>{sb.classList.remove('open');ov.classList.remove('active');});}
  }
}
new ModulePage();
