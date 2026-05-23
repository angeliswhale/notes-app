<script>
const COLORS=[
  {id:'white', bg:'#FFFFFF', label:'白色 · White'},
  {id:'yellow',bg:'#FFF9C4', label:'淡黃 · Yellow'},
  {id:'blue',  bg:'#E1F5FE', label:'淡藍 · Blue'},
  {id:'green', bg:'#E8F5E9', label:'淡綠 · Green'},
  {id:'pink',  bg:'#FCE4EC', label:'淡粉 · Pink'},
  {id:'peach', bg:'#FBE9E7', label:'淡橘 · Peach'},
];

const sidebarList=document.getElementById('sidebarList');
const editorArea=document.getElementById('editorArea');
const editorFooterWrap=document.getElementById('editorFooterWrap');
const topbarTitle=document.getElementById('topbarTitle');
const searchInput=document.getElementById('searchInput');
const clearSearch=document.getElementById('clearSearch');
const footerMeta=document.getElementById('footerMeta');
const saveBtn=document.getElementById('saveBtn');
const deleteBtn=document.getElementById('deleteBtn');
const cancelBtn=document.getElementById('cancelBtn');
const newBtn=document.getElementById('newBtn');
const confirmBar=document.getElementById('confirmBar');
const confirmDelBtn=document.getElementById('confirmDelBtn');
const cancelDelBtn=document.getElementById('cancelDelBtn');

let notes=[];
let activeId=null;
let isNew=false;
let searchTerm='';
let activeColor='white';

function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6);}
function esc(s){const d=document.createElement('div');d.textContent=s;return d.innerHTML;}
function highlight(s,q){
  if(!q)return esc(s);
  const e=esc(s);
  return e.replace(new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'gi'),m=>`<mark>${m}</mark>`);
}
function fmt(iso){
  const d=new Date(iso);
  return d.toLocaleDateString('zh-TW')+' '+d.toLocaleTimeString('zh-TW',{hour:'2-digit',minute:'2-digit'});
}

async function load(){
  try{const r=await window.storage.get('notes_postit');notes=r?JSON.parse(r.value):[];}catch{notes=[];}
  renderSidebar();
}
async function persist(){
  try{await window.storage.set('notes_postit',JSON.stringify(notes));}catch{}
}

function colorById(id){return COLORS.find(c=>c.id===id)||COLORS[0];}

function renderSidebar(){
  const q=searchTerm.toLowerCase();
  const list=q?notes.filter(n=>n.title.toLowerCase().includes(q)||n.content.toLowerCase().includes(q)):notes;
  if(!list.length){
    sidebarList.innerHTML=`<div class="sidebar-empty">${q?'找不到結果 · No results':'尚無記事 · No notes'}</div>`;
    return;
  }
  sidebarList.innerHTML='';
  [...list].reverse().forEach(note=>{
    const col=colorById(note.color||'white');
    const el=document.createElement('div');
    el.className='sidebar-note'+(note.id===activeId?' active':'');
    const titleHtml=highlight(note.title||'（無標題）',searchTerm);
    const previewHtml=highlight((note.content||'').slice(0,36),searchTerm);
    el.innerHTML=`
      <span class="note-color-dot" style="background:${col.bg};" title="${col.label}"></span>
      <div class="sidebar-note-info">
        <div class="sidebar-note-title">${titleHtml}</div>
        <div class="sidebar-note-preview">${previewHtml||'<span style="color:#C9C9C5">無內容</span>'}</div>
      </div>`;
    el.addEventListener('click',()=>openNote(note.id));
    sidebarList.appendChild(el);
  });
}

function buildColorToolbar(selectedId){
  const wrap=document.createElement('div');
  wrap.className='color-toolbar';
  const lbl=document.createElement('span');
  lbl.className='color-toolbar-label';
  lbl.textContent='背景色 · Color';
  wrap.appendChild(lbl);
  COLORS.forEach(c=>{
    const sw=document.createElement('button');
    sw.className='color-swatch'+(c.id===selectedId?' selected':'');
    sw.style.background=c.bg;
    sw.title=c.label;
    sw.setAttribute('aria-label',c.label);
    sw.addEventListener('click',()=>{
      activeColor=c.id;
      editorArea.style.background=c.bg;
      wrap.querySelectorAll('.color-swatch').forEach(s=>s.classList.remove('selected'));
      sw.classList.add('selected');
    });
    wrap.appendChild(sw);
  });
  return wrap;
}

function buildEditor(note){
  activeColor=note?note.color||'white':'white';
  const col=colorById(activeColor);
  editorArea.className='editor-area';
  editorArea.style.background=col.bg;
  editorArea.innerHTML='';

  editorArea.appendChild(buildColorToolbar(activeColor));

  const titleWrap=document.createElement('div');titleWrap.className='field-title';
  const titleInput=document.createElement('input');
  titleInput.type='text';titleInput.id='noteTitleInput';
  titleInput.placeholder='標題 · Title…';titleInput.maxLength=80;
  titleInput.value=note?esc(note.title):'';
  titleInput.addEventListener('input',e=>{topbarTitle.textContent=e.target.value||'（無標題）';});
  titleWrap.appendChild(titleInput);
  editorArea.appendChild(titleWrap);

  const div=document.createElement('div');div.className='divider';editorArea.appendChild(div);

  const contentWrap=document.createElement('div');contentWrap.className='field-content';
  const ta=document.createElement('textarea');
  ta.id='noteContentInput';ta.placeholder='開始輸入… · Start writing…';ta.maxLength=2000;
  ta.value=note?note.content:'';
  const ch=document.createElement('div');ch.className='char-hint';
  const cs=document.createElement('span');cs.id='charCount';cs.textContent=note?note.content.length:0;
  ch.appendChild(cs);const slash=document.createTextNode(' / 2000');ch.appendChild(slash);
  ta.addEventListener('input',()=>{cs.textContent=ta.value.length;});
  contentWrap.appendChild(ta);
  editorArea.appendChild(contentWrap);
  editorArea.appendChild(ch);

  editorFooterWrap.style.display='block';
  footerMeta.textContent=note?'最後編輯 · Edited：'+fmt(note.date):'尚未儲存 · Unsaved';
  cancelBtn.style.display=isNew?'inline-block':'none';
  confirmBar.style.display='none';
  topbarTitle.textContent=note?(note.title||'（無標題）'):'新增記事 · New note';
}

function openNote(id){
  activeId=id;isNew=false;
  const note=notes.find(n=>n.id===id);
  if(!note)return;
  buildEditor(note);
  renderSidebar();
}

function startNew(){
  activeId=uid();isNew=true;
  buildEditor(null);
  renderSidebar();
  document.getElementById('noteTitleInput').focus();
}

saveBtn.addEventListener('click',()=>{
  const ti=document.getElementById('noteTitleInput');
  const ci=document.getElementById('noteContentInput');
  if(!ti||!ci)return;
  const t=ti.value.trim(),c=ci.value.trim();
  if(!t&&!c){footerMeta.textContent='標題或內容不能都空白 · Required';return;}
  if(isNew){
    notes.push({id:activeId,title:t||'（無標題）',content:c,color:activeColor,date:new Date().toISOString()});
    isNew=false;cancelBtn.style.display='none';
  } else {
    const note=notes.find(n=>n.id===activeId);
    if(note){note.title=t||'（無標題）';note.content=c;note.color=activeColor;note.date=new Date().toISOString();}
  }
  persist();
  topbarTitle.textContent=t||'（無標題）';
  footerMeta.textContent='已儲存 · Saved · '+fmt(new Date().toISOString());
  renderSidebar();
});

deleteBtn.addEventListener('click',()=>{confirmBar.style.display='flex';});
confirmDelBtn.addEventListener('click',()=>{
  notes=notes.filter(n=>n.id!==activeId);
  persist();
  activeId=null;isNew=false;
  editorArea.className='editor-area empty-state';
  editorArea.style.background='';
  editorArea.innerHTML='<div class="empty-hint">從左側選取記事<br>或點擊「新增記事」開始<br><span style="font-size:12px;color:#9B9B97;">Select a note or create a new one</span></div>';
  editorFooterWrap.style.display='none';
  topbarTitle.textContent='選擇或新增記事';
  renderSidebar();
});
cancelDelBtn.addEventListener('click',()=>{confirmBar.style.display='none';});

cancelBtn.addEventListener('click',()=>{
  activeId=null;isNew=false;
  editorArea.className='editor-area empty-state';
  editorArea.style.background='';
  editorArea.innerHTML='<div class="empty-hint">從左側選取記事<br>或點擊「新增記事」開始<br><span style="font-size:12px;color:#9B9B97;">Select a note or create a new one</span></div>';
  editorFooterWrap.style.display='none';
  topbarTitle.textContent='選擇或新增記事';
  renderSidebar();
});

newBtn.addEventListener('click',startNew);

searchInput.addEventListener('input',()=>{
  searchTerm=searchInput.value.trim();
  clearSearch.style.display=searchTerm?'inline':'none';
  renderSidebar();
});
searchInput.addEventListener('keyup',e=>{
  if(e.key==='Escape'){searchInput.value='';searchTerm='';clearSearch.style.display='none';renderSidebar();}
});
clearSearch.addEventListener('click',()=>{searchInput.value='';searchTerm='';clearSearch.style.display='none';renderSidebar();});

load();
</script>
