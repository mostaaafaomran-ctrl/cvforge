const $=s=>document.querySelector(s);
const UI={
ar:{cvLang:'لغة السيرة',download:'تحميل PDF',atsNote:'قالب بسيط بعمود واحد ونص حقيقي وعناوين قياسية، عشان أنظمة التوظيف (ATS) تقراه صح. بياناتك بتتحفظ على جهازك بس.',personal:'البيانات الشخصية',name:'الاسم الكامل',title:'المسمى الوظيفي',email:'البريد الإلكتروني',phone:'الموبايل',city:'المدينة',link:'رابط (LinkedIn / GitHub)',summary:'نبذة مختصرة',exp:'الخبرات',addExp:'+ إضافة خبرة',edu:'التعليم',addEdu:'+ إضافة مؤهل',skills:'المهارات',skillsHint:'افصل بينها بفاصلة',langs:'اللغات',langsHint:'مثال: العربية (لغة أم)، English (Fluent)',sample:'تجربة بيانات مثال',exportJson:'حفظ كملف',importJson:'استرجاع ملف',clear:'مسح الكل',preview:'معاينة مباشرة',footer:'مجاني ومفتوح المصدر. من غير تسجيل ومن غير سيرفر.',uiBtn:'English UI',role:'المسمى / الوظيفة',company:'الشركة',from:'من',to:'إلى',points:'نقاط (كل سطر نقطة)',remove:'حذف',degree:'الدرجة / التخصص',school:'الجامعة / المعهد',confirm:'تمسح كل البيانات؟',empty:'ابدأ بكتابة بياناتك وهتشوف السيرة هنا'},
en:{cvLang:'CV language',download:'Download PDF',atsNote:'Single-column layout, real text and standard headings so applicant tracking systems (ATS) read it correctly. Your data stays on your device.',personal:'Personal details',name:'Full name',title:'Job title',email:'Email',phone:'Phone',city:'City',link:'Link (LinkedIn / GitHub)',summary:'Summary',exp:'Experience',addExp:'+ Add experience',edu:'Education',addEdu:'+ Add education',skills:'Skills',skillsHint:'Separate with commas',langs:'Languages',langsHint:'e.g. Arabic (Native), English (Fluent)',sample:'Try sample data',exportJson:'Save to file',importJson:'Load file',clear:'Clear all',preview:'Live preview',footer:'Free and open source. No sign-up, no server.',uiBtn:'واجهة عربي',role:'Role',company:'Company',from:'From',to:'To',points:'Bullets (one per line)',remove:'Remove',degree:'Degree / major',school:'University / school',confirm:'Clear all data?',empty:'Start typing and your CV appears here'}};
const CV={ar:{summary:'نبذة مختصرة',exp:'الخبرات العملية',edu:'التعليم',skills:'المهارات',langs:'اللغات',present:'حتى الآن'},en:{summary:'Summary',exp:'Experience',edu:'Education',skills:'Skills',langs:'Languages',present:'Present'}};
const blank=()=>({ui:'ar',cvLang:'ar',name:'',title:'',email:'',phone:'',city:'',link:'',summary:'',skills:'',langs:'',exp:[],edu:[]});
let S;try{S=Object.assign(blank(),JSON.parse(localStorage.getItem('cvforge')||'{}'))}catch(e){S=blank()}
const save=()=>localStorage.setItem('cvforge',JSON.stringify(S));
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const t=k=>UI[S.ui][k];
function applyUI(){
  document.documentElement.lang=S.ui;document.documentElement.dir=S.ui==='ar'?'rtl':'ltr';
  document.querySelectorAll('[data-t]').forEach(e=>e.textContent=t(e.dataset.t));
  $('#uiLang').textContent=t('uiBtn');$('#cvLang').value=S.cvLang;
  document.title='CVForge | '+(S.ui==='ar'?'مولد السيرة الذاتية':'CV Builder');
  renderLists();render();
}
function renderLists(){
  const exp=(e,i)=>`<div class="item"><div class="grid">
   <label><span>${t('role')}</span><input data-l="exp" data-i="${i}" data-f="role" value="${esc(e.role)}"></label>
   <label><span>${t('company')}</span><input data-l="exp" data-i="${i}" data-f="company" value="${esc(e.company)}"></label>
   <label><span>${t('from')}</span><input data-l="exp" data-i="${i}" data-f="from" value="${esc(e.from)}" placeholder="2023-06"></label>
   <label><span>${t('to')}</span><input data-l="exp" data-i="${i}" data-f="to" value="${esc(e.to)}" placeholder="${CV[S.cvLang].present}"></label></div>
   <label><span>${t('points')}</span><textarea rows="3" data-l="exp" data-i="${i}" data-f="points">${esc(e.points)}</textarea></label>
   <button class="rm" data-rm="exp" data-i="${i}">${t('remove')}</button></div>`;
  const edu=(e,i)=>`<div class="item"><div class="grid">
   <label><span>${t('degree')}</span><input data-l="edu" data-i="${i}" data-f="degree" value="${esc(e.degree)}"></label>
   <label><span>${t('school')}</span><input data-l="edu" data-i="${i}" data-f="school" value="${esc(e.school)}"></label>
   <label><span>${t('from')}</span><input data-l="edu" data-i="${i}" data-f="from" value="${esc(e.from)}"></label>
   <label><span>${t('to')}</span><input data-l="edu" data-i="${i}" data-f="to" value="${esc(e.to)}"></label></div>
   <button class="rm" data-rm="edu" data-i="${i}">${t('remove')}</button></div>`;
  $('#expList').innerHTML=S.exp.map(exp).join('');
  $('#eduList').innerHTML=S.edu.map(edu).join('');
  document.querySelectorAll('[data-k]').forEach(el=>el.value=S[el.dataset.k]||'');
}
function render(){
  const L=CV[S.cvLang],dir=S.cvLang==='ar'?'rtl':'ltr';
  const dates=e=>[e.from,e.to||(e.from?L.present:'')].filter(Boolean).join(' - ');
  const contact=[S.email,S.phone,S.city,S.link].filter(Boolean).map(x=>'<bdi>'+esc(x)+'</bdi>').join(' | ');
  let h='';
  if(S.name)h+=`<h1>${esc(S.name)}</h1>`;
  if(S.title)h+=`<div class="ttl">${esc(S.title)}</div>`;
  if(contact)h+=`<div class="contact">${contact}</div>`;
  if(S.summary.trim())h+=`<h2>${L.summary}</h2><p style="margin:0">${esc(S.summary)}</p>`;
  const ex=S.exp.filter(e=>e.role||e.company);
  if(ex.length)h+=`<h2>${L.exp}</h2>`+ex.map(e=>{const pts=(e.points||'').split('\n').map(x=>x.trim()).filter(Boolean);
    return `<div class="ent"><div class="h"><span>${esc(e.role)}</span><span><bdi>${esc(dates(e))}</bdi></span></div><div class="s">${esc(e.company)}</div>${pts.length?'<ul>'+pts.map(p=>`<li>${esc(p)}</li>`).join('')+'</ul>':''}</div>`}).join('');
  const ed=S.edu.filter(e=>e.degree||e.school);
  if(ed.length)h+=`<h2>${L.edu}</h2>`+ed.map(e=>`<div class="ent"><div class="h"><span>${esc(e.degree)}</span><span><bdi>${esc(dates(e))}</bdi></span></div><div class="s">${esc(e.school)}</div></div>`).join('');
  if(S.skills.trim())h+=`<h2>${L.skills}</h2><p style="margin:0">${esc(S.skills.split(/[,،\n]/).map(x=>x.trim()).filter(Boolean).join(S.cvLang==='ar'?'، ':', '))}</p>`;
  if(S.langs.trim())h+=`<h2>${L.langs}</h2><p style="margin:0">${esc(S.langs)}</p>`;
  const cv=$('#cv');cv.dir=dir;cv.lang=S.cvLang;cv.innerHTML=h||`<div class="empty">${t('empty')}</div>`;
}
document.addEventListener('input',e=>{
  const el=e.target;
  if(el.dataset.k){S[el.dataset.k]=el.value}
  else if(el.dataset.l){S[el.dataset.l][el.dataset.i][el.dataset.f]=el.value}
  else return;
  save();render();
});
document.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.add){S[b.dataset.add].push(b.dataset.add==='exp'?{role:'',company:'',from:'',to:'',points:''}:{degree:'',school:'',from:'',to:''});save();renderLists();render()}
  if(b.dataset.rm){S[b.dataset.rm].splice(+b.dataset.i,1);save();renderLists();render()}
});
$('#cvLang').onchange=e=>{S.cvLang=e.target.value;save();renderLists();render()};
$('#uiLang').onclick=()=>{S.ui=S.ui==='ar'?'en':'ar';save();applyUI()};
$('#printBtn').onclick=()=>{document.title=(S.name||'CV').replace(/[\\/:*?"<>|]/g,'')+' - CV';window.print();setTimeout(applyUI,500)};
$('#clear').onclick=()=>{if(confirm(t('confirm'))){const ui=S.ui;S=blank();S.ui=ui;save();applyUI()}};
$('#exportJson').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(S,null,2)],{type:'application/json'}));a.download='cvforge-data.json';a.click()};
$('#importJson').onchange=e=>{const f=e.target.files[0];if(!f)return;f.text().then(x=>{try{S=Object.assign(blank(),JSON.parse(x));save();applyUI()}catch(err){alert('Invalid file')}})};
$('#sample').onclick=()=>{
  const ar=S.cvLang==='ar';
  Object.assign(S,ar?{name:'أحمد محمد علي',title:'مطور برمجيات',email:'ahmed@example.com',phone:'+20 100 000 0000',city:'القاهرة، مصر',link:'github.com/ahmed',summary:'مطور برمجيات خريج علوم حاسب، عندي خبرة في بناء تطبيقات الويب بـ JavaScript وPython. بحب أحل مشاكل حقيقية وأشتغل في فريق.',skills:'JavaScript, Python, React, SQL, Git, حل المشكلات',langs:'العربية (لغة أم)، English (جيد جداً)',
   exp:[{role:'مطور ويب متدرب',company:'شركة تقنية، القاهرة',from:'2025-07',to:'',points:'بنيت لوحة تحكم بـ React قللت وقت التقارير 40%\nكتبت اختبارات آلية لخدمات الـ API'}],edu:[{degree:'بكالوريوس علوم الحاسب',school:'جامعة حلوان',from:'2022',to:'2026'}]}
  :{name:'Ahmed Mohamed Ali',title:'Software Developer',email:'ahmed@example.com',phone:'+20 100 000 0000',city:'Cairo, Egypt',link:'github.com/ahmed',summary:'Computer science graduate who builds web apps with JavaScript and Python. I like solving real problems and working in a team.',skills:'JavaScript, Python, React, SQL, Git, Problem solving',langs:'Arabic (Native), English (Very good)',
   exp:[{role:'Web Developer Intern',company:'Tech company, Cairo',from:'2025-07',to:'',points:'Built a React dashboard that cut reporting time by 40%\nWrote automated tests for API services'}],edu:[{degree:'B.Sc. Computer Science',school:'Helwan University',from:'2022',to:'2026'}]});
  save();applyUI()};
applyUI();
