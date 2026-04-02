/**
 * RD COURS COMPTA — Admin Page v2
 * Single user add + CSV mass import (auth_id=null, activation par le stagiaire)
 */
import authService from '../../core/services/authService.js';
import storageService from '../../core/services/storageService.js';
import { $, $$, redirectTo, toast, handleError } from '../../core/utils/utils.js';
import { ROLES } from '../../core/config/constants.js';

class AdminPage {
  constructor() { this.profile = null; this.users = []; this.editingUserId = null; this.csvData = []; this.init(); }

  async init() {
    try {
      const s = await authService.getSession();
      if (!s) { redirectTo('../../index.html'); return; }
      this.profile = await authService.getProfile();
      if (!this.profile || (this.profile.role !== ROLES.ADMIN && this.profile.role !== ROLES.FORMATEUR)) {
        toast.error('Accès non autorisé'); redirectTo('../../dashboard.html'); return;
      }
      this.renderUser(); this.attachEvents(); await this.loadUsers();
    } catch(e) { handleError(e, 'Admin init'); }
  }

  renderUser() {
    const {prenom,nom,role}=this.profile;
    const a=$('#userAvatar'); if(a)a.textContent=`${prenom[0]}${nom[0]}`;
    const n=$('#userName'); if(n)n.textContent=`${prenom} ${nom}`;
    const r=$('#userRole');
    if(r){
      if(this.profile.role==='stagiaire'){
        const cl={CA:'Comptable Assistant',GCF:'Gestionnaire Comptable et Fiscal',SA:'Secrétaire Assistant',AD:'Assistant de Direction',GP:'Gestionnaire de Paie',ARH:'Assistant Ressources Humaines',AC:'Assistant Commercial'};
        r.textContent=cl[this.profile.cohorte]||this.profile.cohorte;
      } else {
        r.textContent=role.charAt(0).toUpperCase()+role.slice(1);
      }
    }
  }

  async loadUsers() {
    try { this.users = await storageService.getAllUsers(); this.renderTable(); this.renderStats(); }
    catch(e) { handleError(e, 'Chargement'); }
  }

  renderStats() {
    const stagiaires = this.users.filter(u=>u.role==='stagiaire').length;
    const formateurs = this.users.filter(u=>u.role==='formateur').length;
    const activated = this.users.filter(u=>u.is_activated).length;
    const cohortes = new Set(this.users.map(u=>u.cohorte)).size;
    const st=$('#statTotal'); if(st)st.textContent=stagiaires;
    const sf=$('#statFormateurs'); if(sf)sf.textContent=formateurs;
    const sa=$('#statActivated'); if(sa)sa.textContent=`${activated} / ${this.users.length}`;
    const sc=$('#statCohortes'); if(sc)sc.textContent=cohortes;
  }

  renderTable(filtered=null) {
    const tbody=$('#usersTableBody'); if(!tbody) return;
    const list = filtered || this.users;
    if(!list.length) { tbody.innerHTML='<tr><td colspan="8" style="text-align:center;padding:var(--space-10);color:var(--text-muted);">Aucun utilisateur.</td></tr>'; return; }

    tbody.innerHTML = list.map(u => {
      const rb = u.role==='admin'?'badge--danger':u.role==='formateur'?'badge--primary':'badge--success';
      const ab = u.is_activated?'badge--activated':'badge--pending';
      const al = u.is_activated?'Activé':'En attente';
      return `<tr data-id="${u.id}">
        <td>${u.civilite}</td><td class="admin-table__name">${u.nom}</td><td>${u.prenom}</td>
        <td class="admin-table__email">${u.adresse_mail}</td>
        <td><span class="badge badge--cta">${u.cohorte}</span></td>
        <td><span class="badge ${rb}">${u.role}</span></td>
        <td><span class="badge ${ab}">${al}</span></td>
        <td class="admin-table__actions">
          <button class="btn btn-ghost btn-sm btn-edit" data-id="${u.id}" title="Modifier"><i data-lucide="pencil"></i></button>
          <button class="btn btn-ghost btn-sm btn-delete" data-id="${u.id}" title="Supprimer"><i data-lucide="trash-2"></i></button>
        </td></tr>`;
    }).join('');

    if(typeof lucide!=='undefined') lucide.createIcons();
    $$('.btn-edit').forEach(b=>b.addEventListener('click',()=>this.openEditModal(b.dataset.id)));
    $$('.btn-delete').forEach(b=>b.addEventListener('click',()=>this.deleteUser(b.dataset.id)));
  }

  applyFilters() {
    const c=$('#filterCohorte')?.value, r=$('#filterRole')?.value;
    let f=this.users;
    if(c) f=f.filter(u=>u.cohorte===c);
    if(r) f=f.filter(u=>u.role===r);
    this.renderTable(f);
  }

  // ── Single User Modal ──
  openModal(editing=false) {
    $('#modalBackdrop')?.classList.add('active');
    $('#userModal')?.classList.add('active');
    const t=$('#modalTitle'); if(t) t.textContent=editing?'Modifier':'Ajouter un utilisateur';
  }
  closeModal() {
    $('#modalBackdrop')?.classList.remove('active');
    $('#userModal')?.classList.remove('active');
    this.editingUserId=null;
    ['formCivilite','formNom','formPrenom','formEmail','formCohorte'].forEach(id=>{const el=$(`#${id}`);if(el)el.value='';});
    $('#formRole').value='stagiaire';
  }
  openEditModal(id) {
    const u=this.users.find(x=>x.id===id); if(!u) return;
    this.editingUserId=id;
    $('#formCivilite').value=u.civilite;
    $('#formNom').value=u.nom;
    $('#formPrenom').value=u.prenom;
    $('#formEmail').value=u.adresse_mail;
    $('#formCohorte').value=u.cohorte;
    $('#formRole').value=u.role;
    this.openModal(true);
  }
  async handleSubmit() {
    const civ=$('#formCivilite').value, nom=$('#formNom').value.trim(), pre=$('#formPrenom').value.trim();
    const email=$('#formEmail').value.trim(), coh=$('#formCohorte').value, role=$('#formRole').value;
    if(!civ||!nom||!pre||!email||!coh) { toast.warning('Remplissez tous les champs.'); return; }

    try {
      if(this.editingUserId) {
        await storageService.updateUser(this.editingUserId, {civilite:civ,nom:nom.toUpperCase(),prenom:pre,adresse_mail:email,cohorte:coh,role});
        toast.success('Utilisateur modifié.');
      } else {
        await authService.createSingleUser({civilite:civ,nom,prenom:pre,adresse_mail:email,cohorte:coh,role});
        toast.success('Utilisateur créé. Il devra activer son compte.');
      }
      this.closeModal(); await this.loadUsers();
    } catch(e) { handleError(e, 'Enregistrement'); }
  }
  async deleteUser(id) {
    const u=this.users.find(x=>x.id===id); if(!u) return;
    if(!confirm(`Supprimer ${u.prenom} ${u.nom} ?`)) return;
    try { await storageService.deleteUser(id); toast.success('Supprimé.'); await this.loadUsers(); }
    catch(e) { handleError(e, 'Suppression'); }
  }

  // ── CSV Import ──
  openCsvModal() {
    $('#modalBackdrop')?.classList.add('active');
    $('#csvModal')?.classList.add('active');
    this.csvData=[]; this.resetCsvUI();
  }
  closeCsvModal() {
    $('#modalBackdrop')?.classList.remove('active');
    $('#csvModal')?.classList.remove('active');
    this.csvData=[]; this.resetCsvUI();
  }
  resetCsvUI() {
    const p=$('#csvPreview'); if(p){p.style.display='none';p.innerHTML='';}
    const e=$('#csvError'); if(e)e.style.display='none';
    const s=$('#csvSuccess'); if(s)s.style.display='none';
    const b=$('#csvSubmitBtn'); if(b){b.disabled=true;}
    const c=$('#csvCount'); if(c)c.textContent='0';
  }

  parseCSV(text) {
    const lines=text.trim().split(/\r?\n/);
    if(lines.length<2) throw new Error('Le fichier doit contenir au moins une ligne d\'en-tête et une ligne de données.');
    
    const header=lines[0].split(/[,;]/).map(h=>h.trim().toLowerCase().replace(/['"]/g,''));
    const required=['civilite','nom','prenom','adresse_mail','cohorte','role'];
    const missing=required.filter(r=>!header.includes(r));
    if(missing.length) throw new Error(`Colonnes manquantes : ${missing.join(', ')}`);

    const validCohortes=['CA','GCF','SA','AD','GP','ARH','AC'];
    const validRoles=['admin','formateur','stagiaire'];
    const validCiv=['M','Mme'];

    const data=[];
    for(let i=1;i<lines.length;i++){
      if(!lines[i].trim()) continue;
      const vals=lines[i].split(/[,;]/).map(v=>v.trim().replace(/^["']|["']$/g,''));
      const row={};
      header.forEach((h,j)=>{row[h]=vals[j]||'';});

      row._errors=[];
      if(!validCiv.includes(row.civilite)) row._errors.push('civilité invalide');
      if(!row.nom) row._errors.push('nom vide');
      if(!row.prenom) row._errors.push('prénom vide');
      if(!row.adresse_mail||!row.adresse_mail.includes('@')) row._errors.push('email invalide');
      if(!validCohortes.includes(row.cohorte?.toUpperCase())) row._errors.push('cohorte invalide');
      if(!validRoles.includes(row.role?.toLowerCase())) row._errors.push('rôle invalide');

      row.cohorte=(row.cohorte||'').toUpperCase();
      row.role=(row.role||'stagiaire').toLowerCase();
      data.push(row);
    }
    return data;
  }

  renderCsvPreview(data) {
    const preview=$('#csvPreview');
    if(!preview) return;
    
    const validCount=data.filter(r=>!r._errors.length).length;
    const errorCount=data.filter(r=>r._errors.length).length;

    let html='<table><thead><tr><th>#</th><th>Civilité</th><th>Nom</th><th>Prénom</th><th>Email</th><th>Cohorte</th><th>Rôle</th><th>Statut</th></tr></thead><tbody>';
    data.forEach((r,i)=>{
      const cls=r._errors.length?'error':'';
      const status=r._errors.length?`<span style="color:var(--text-danger)">${r._errors.join(', ')}</span>`:'<span style="color:var(--text-success)">OK</span>';
      html+=`<tr class="${cls}"><td>${i+1}</td><td>${r.civilite}</td><td>${r.nom}</td><td>${r.prenom}</td><td>${r.adresse_mail}</td><td>${r.cohorte}</td><td>${r.role}</td><td>${status}</td></tr>`;
    });
    html+='</tbody></table>';

    preview.innerHTML=html;
    preview.style.display='block';

    const btn=$('#csvSubmitBtn');
    const count=$('#csvCount');
    if(btn) btn.disabled=validCount===0;
    if(count) count.textContent=validCount;

    if(errorCount>0){
      const err=$('#csvError');
      if(err){err.textContent=`${errorCount} ligne(s) avec erreur(s) — elles seront ignorées.`;err.style.display='block';}
    }

    this.csvData=data.filter(r=>!r._errors.length);
  }

  async handleCsvImport() {
    if(!this.csvData.length) return;
    const btn=$('#csvSubmitBtn');
    btn.disabled=true; btn.classList.add('btn--loading');

    try {
      const result = await authService.importUsers(this.csvData);
      const suc=$('#csvSuccess');
      if(suc){suc.textContent=`${result.length} utilisateur(s) importé(s) avec succès ! Ils devront activer leur compte.`;suc.style.display='block';}
      toast.success(`${result.length} utilisateurs importés.`);
      setTimeout(()=>{this.closeCsvModal();this.loadUsers();},2000);
    } catch(e) {
      handleError(e,'Import CSV');
      btn.disabled=false; btn.classList.remove('btn--loading');
    }
  }

  attachEvents() {
    // Logout + mobile menu
    $('#logoutBtn')?.addEventListener('click',async()=>{await authService.logout();redirectTo('../../index.html');});
    const mt=$('#menuToggle'),sb=$('#sidebar'),ov=$('#sidebarOverlay');
    if(mt&&sb){mt.addEventListener('click',()=>{sb.classList.toggle('open');ov?.classList.toggle('active');});ov?.addEventListener('click',()=>{sb.classList.remove('open');ov.classList.remove('active');});}

    // Filters
    $('#filterCohorte')?.addEventListener('change',()=>this.applyFilters());
    $('#filterRole')?.addEventListener('change',()=>this.applyFilters());

    // Single user modal
    $('#addUserBtn')?.addEventListener('click',()=>this.openModal(false));
    $('#modalClose')?.addEventListener('click',()=>this.closeModal());
    $('#modalCancel')?.addEventListener('click',()=>this.closeModal());
    $('#modalSubmit')?.addEventListener('click',()=>this.handleSubmit());

    // CSV modal
    $('#importCsvBtn')?.addEventListener('click',()=>this.openCsvModal());
    $('#csvModalClose')?.addEventListener('click',()=>this.closeCsvModal());
    $('#csvModalCancel')?.addEventListener('click',()=>this.closeCsvModal());
    $('#csvSubmitBtn')?.addEventListener('click',()=>this.handleCsvImport());

    // Backdrop closes both modals
    $('#modalBackdrop')?.addEventListener('click',()=>{this.closeModal();this.closeCsvModal();});

    // CSV dropzone
    const dz=$('#csvDropzone');
    const fi=$('#csvFileInput');
    if(dz&&fi){
      dz.addEventListener('click',()=>fi.click());
      dz.addEventListener('dragover',(e)=>{e.preventDefault();dz.classList.add('dragover');});
      dz.addEventListener('dragleave',()=>dz.classList.remove('dragover'));
      dz.addEventListener('drop',(e)=>{
        e.preventDefault();dz.classList.remove('dragover');
        const file=e.dataTransfer.files[0];
        if(file) this.handleCsvFile(file);
      });
      fi.addEventListener('change',()=>{
        const file=fi.files[0];
        if(file) this.handleCsvFile(file);
      });
    }
  }

  handleCsvFile(file) {
    if(!file.name.match(/\.(csv|txt)$/i)){toast.error('Format non supporté. Utilisez .csv ou .txt.');return;}
    const reader=new FileReader();
    reader.onload=(e)=>{
      try {
        const data=this.parseCSV(e.target.result);
        this.renderCsvPreview(data);
      } catch(err) {
        const errEl=$('#csvError');
        if(errEl){errEl.textContent=err.message;errEl.style.display='block';}
      }
    };
    reader.readAsText(file,'UTF-8');
  }
}

new AdminPage();
