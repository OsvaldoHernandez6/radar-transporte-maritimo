const fmt=(n,d=0)=>Number(n).toLocaleString('es-CL',{minimumFractionDigits:d,maximumFractionDigits:d});
const k=n=>n>=1e6?fmt(n/1e6,1).replace(/,0$/,'')+' M':n>=1000?fmt(n/1000,1).replace(/,0$/,'')+' mil':fmt(n);
const pct=(n,d=3)=>fmt(n,d)+'%';
const VER='<span class="badge b-ver">verificado</span>', EST='<span class="badge b-est">estimado</span>';
const C=id=>`var(--c-${id})`;
let D;
const B=id=>D.brands.find(b=>b.id===id);
const nm=b=>`<span class="bn"><span class="sw" style="--c:${C(b.id)}"></span>${b.name}</span>`;
const SECTIONS=[['resumen','Resumen','RES'],['panorama','Panorama','CAT'],['linkedin','LinkedIn','LI'],['ads','LinkedIn Ads','ADS'],['oportunidades','Oportunidades','OPP'],['diagnostico','Diagnóstico','DX'],['fuentes','Fuentes','SRC']];
const byScore=()=>[...D.brands].sort((a,b)=>b.score-a.score);

function shead(id,title,desc,chan){return `<div class="shead"><div class="row"><span class="chan"><i></i>${chan}</span></div><h2>${title}</h2>${desc?`<p>${desc}</p>`:''}</div>`}
function bars(title,cap,get,f,opts={}){
  const rows=[...D.brands].sort((a,b)=>get(b)-get(a)), max=opts.max||Math.max(...rows.map(get))||1;
  return `<div class="panel"><div class="ptitle"><h4>${title}</h4>${opts.badge??VER}</div><p class="cap">${cap}</p><div class="bars">${rows.map(b=>`
   <div class="bar" data-b="${b.id}" data-tip="${b.name} · ${f(get(b))}${opts.tip?' · '+opts.tip(b):''}">
    <div class="n"><span class="sw" style="--c:${C(b.id)}"></span>${b.name}</div>
    <div class="t"><i style="--c:${C(b.id)};--w:${Math.max(1.5,Math.min(1,get(b)/max)*100)}%"></i></div>
    <div class="v">${f(get(b))}</div></div>`).join('')}</div></div>`;
}
function finds(arr,prefix){return `<div class="finds ${arr.length%2?'odd':''}">${arr.map((c,i)=>`<div class="find" data-search="${prefix} · ${c.title}" id="${prefix.toLowerCase()}-h${i+1}"><span class="id">${prefix} · H${String(i+1).padStart(2,'0')}</span><h3>${c.title}</h3><p>${c.text}</p></div>`).join('')}</div>`}
function recs(arr){return `<div class="recs">${arr.map(r=>`<div class="rec"><span class="prio ${r.priority}">${r.priority}</span><div><h3>${r.title}</h3><p>${r.text}</p></div></div>`).join('')}</div>`}

/* ---------- radar ---------- */
const AX=[['Alcance',b=>b.followers],['Frecuencia',b=>b.postsPerMonth],['Interacción',b=>b.interPerPost],['Video',b=>b.videoPct],['Pauta',b=>Math.log10(1+b.ads.count)],['Pauta ES/PT',b=>b.ads.esPt]];
function radarSVG(){
  const cx=210,cy=190,R=135,n=AX.length;
  const max=AX.map(a=>Math.max(...D.brands.map(a[1]))||1);
  const pt=(i,r)=>{const a=-Math.PI/2+i*2*Math.PI/n;return [cx+r*Math.cos(a),cy+r*Math.sin(a)]};
  let g='';
  [.25,.5,.75,1].forEach(s=>{g+=`<polygon points="${AX.map((_,i)=>pt(i,R*s).join(',')).join(' ')}" fill="none" stroke="var(--line-2)" stroke-width="1"/>`});
  AX.forEach((a,i)=>{const [x,y]=pt(i,R);const [lx,ly]=pt(i,R+22);g+=`<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="var(--line)" stroke-width="1"/><text x="${lx}" y="${ly+4}" text-anchor="${Math.abs(lx-cx)<8?'middle':lx>cx?'start':'end'}" font-family="var(--f-mono)" font-size="10.5" fill="var(--mute)">${a[0].toUpperCase()}</text>`});
  [...D.brands].reverse().forEach(b=>{const pts=AX.map((a,i)=>pt(i,Math.max(.04,a[1](b)/max[i])*R));
    g+=`<g class="rp" data-b="${b.id}"><polygon points="${pts.map(p=>p.join(',')).join(' ')}" fill="${C(b.id)}" fill-opacity=".05" stroke="${C(b.id)}" stroke-width="1.7" stroke-linejoin="round"/>${pts.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="2.6" fill="${C(b.id)}" stroke="var(--panel)" stroke-width="1.5"/>`).join('')}</g>`});
  return `<svg viewBox="0 0 420 380" role="img" aria-label="Radar comparativo de 5 navieras en 6 dimensiones">${g}</svg>`;
}
function gaugeSVG(v){
  const seg=40;let ticks='';
  for(let i=0;i<seg;i++){const a=(-90+i*360/seg)*Math.PI/180,on=i<Math.round(v/100*seg);ticks+=`<line x1="${60+44*Math.cos(a)}" y1="${60+44*Math.sin(a)}" x2="${60+(on?56:53)*Math.cos(a)}" y2="${60+(on?56:53)*Math.sin(a)}" stroke="${on?'var(--accent)':'var(--line-2)'}" stroke-width="2" stroke-linecap="round"/>`}
  return `<svg viewBox="0 0 120 120" role="img" aria-label="Puntaje ${v} de 100">${ticks}<text x="60" y="64" text-anchor="middle" font-family="var(--f-mono)" font-size="26" font-weight="500" fill="var(--ink)">${v}</text><text x="60" y="80" text-anchor="middle" font-family="var(--f-mono)" font-size="8.5" fill="var(--mute)">/ 100</text></svg>`;
}

/* ---------- charts ---------- */
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
const T=(x,y,txt,cls='ct',anchor='start',extra='')=>`<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}" ${extra}>${txt}</text>`;
const fzv=()=>parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--fz'))||1;
const FMTC={Video:'var(--ink-2)',Imagen:'color-mix(in srgb,var(--mute) 45%,transparent)',Documento:'var(--warn)',Link:'var(--accent)',Texto:'var(--line-2)'};
const LANGC={EN:'color-mix(in srgb,var(--mute) 45%,transparent)',ES:'var(--accent)',PT:'color-mix(in srgb,var(--accent) 55%,transparent)',FR:'var(--warn)',Otros:'var(--warn)'};

const CHARTS={
 /* 1. Alcance vs interacción */
 scatter(W){
  const fz=fzv(),H=Math.max(300,Math.min(420,W*.56)),m={l:54*fz,r:18,t:22,b:44*fz};
  const xs=[5000,5e6],lx=v=>m.l+(Math.log(v)-Math.log(xs[0]))/(Math.log(xs[1])-Math.log(xs[0]))*(W-m.l-m.r);
  const ymax=600,ly=v=>H-m.b-(v/ymax)*(H-m.t-m.b);
  const med=a=>{const s=[...a].sort((x,y)=>x-y);return s[Math.floor(s.length/2)]};
  const mx=med(D.brands.map(b=>b.followers)),my=med(D.brands.map(b=>b.interPerPost));
  let g='';
  [0,150,300,450,600].forEach(v=>{g+=`<line x1="${m.l}" x2="${W-m.r}" y1="${ly(v)}" y2="${ly(v)}" class="gl"/>`+T(m.l-8,ly(v)+4,fmt(v),'ct','end')});
  [10000,100000,1e6].forEach(v=>{g+=`<line x1="${lx(v)}" x2="${lx(v)}" y1="${m.t}" y2="${H-m.b}" class="gl"/>`+T(lx(v),H-m.b+16*fz,k(v),'ct','middle')});
  g+=T((m.l+W-m.r)/2,H-6,W<560?'SEGUIDORES (log)':'SEGUIDORES EN LINKEDIN (escala log)','ct cap2','middle');
  g+=`<line x1="${lx(mx)}" x2="${lx(mx)}" y1="${m.t}" y2="${H-m.b}" class="ml"/><line x1="${m.l}" x2="${W-m.r}" y1="${ly(my)}" y2="${ly(my)}" class="ml"/>`;
  const narrow=W<560;
  if(!narrow)g+=T(m.l+6,m.t+12,'BASE CHICA · RESUENA','ct q')+T(W-m.r-6,m.t+12,'BASE GRANDE · RESUENA','ct q','end')+T(m.l+6,H-m.b-8,'BASE CHICA · POCA RESPUESTA','ct q')+T(W-m.r-6,H-m.b-8,'BASE GRANDE · POCA RESPUESTA','ct q','end');
  [...D.brands].sort((a,b)=>b.postsPerMonth-a.postsPerMonth).forEach(b=>{
    const x=lx(b.followers),y=ly(b.interPerPost),r=5+Math.sqrt(b.postsPerMonth)*2.6,left=x>W*.72;
    const lab=narrow?T(x,y-r-6,esc(b.name),'ct lbl2','middle'):T(left?x-r-6:x+r+6,y+4,esc(b.name),'ct lbl2',left?'end':'start');
    g+=`<g data-b="${b.id}" data-tip="${esc(b.name)} · ${k(b.followers)} seguidores · ${fmt(b.interPerPost)} interacciones/post · ${fmt(b.postsPerMonth,1).replace(/,0$/,'')} posts/mes"><circle cx="${x}" cy="${y}" r="${r}" fill="${C(b.id)}" fill-opacity=".6" stroke="${C(b.id)}" stroke-width="1.4"/><circle cx="${x}" cy="${y}" r="${r+12}" fill="transparent"/>${lab}</g>`});
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Dispersión: seguidores contra interacciones por publicación">${g}</svg>
   <div class="ckey"><span><i class="kb"></i>Tamaño de la burbuja = posts por mes</span><span><i class="kl"></i>Líneas punteadas = mediana de la categoría</span></div>`;
 },
 /* 2. Mix de formatos */
 mix(W){
  const fz=fzv(),lab=W<520?0:140*fz,row=W<520?44*fz:34*fz,H=row*D.brands.length+4,w=W-lab-(W<520?0:70*fz);let g='';
  D.brands.forEach((b,i)=>{const y=i*row+(W<520?18*fz:6);let x=lab;
    g+=`<g data-b="${b.id}">`+T(0,W<520?y-5*fz:y+13*fz,esc(b.name),'ct lbl2');
    Object.entries(b.fmt).forEach(([kk,v])=>{const ww=v/100*w;g+=`<rect x="${x}" y="${y}" width="${Math.max(0,ww-2)}" height="${18*fz}" rx="3" fill="${FMTC[kk]}" data-tip="${esc(b.name)} · ${kk} ${v}%"/>`;if(ww>34*fz)g+=T(x+6,y+13*fz,v+'%','ct',"start",`style="fill:${kk==='Video'?'var(--panel)':'var(--ink)'}"`);x+=ww});
    if(W>=520)g+=T(W,y+13*fz,b.videoPct+'% video','ct','end');g+='</g>'});
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Mix de formatos por marca">${g}</svg>
   <div class="ckey">${Object.entries(FMTC).map(([kk,c])=>`<span><i class="sq" style="background:${c}"></i>${kk}</span>`).join('')}</div>`;
 },
 /* 3. Volumen de pauta (log) */
 adsLog(W){
  const fz=fzv(),row=40*fz,lab=Math.min(130*fz,W*.32),m={r:70*fz,t:6,b:30*fz},H=m.t+row*D.brands.length+m.b;
  const lx=v=>lab+Math.log10(Math.max(1,v))/4*(W-lab-m.r);let g='';
  [1,10,100,1000,10000].forEach(v=>{g+=`<line x1="${lx(v)}" x2="${lx(v)}" y1="${m.t}" y2="${H-m.b}" class="gl"/>`+T(lx(v),H-m.b+16*fz,fmt(v),'ct','middle')});
  [...D.brands].sort((a,b)=>b.ads.count-a.ads.count).forEach((b,i)=>{const y=m.t+row*i,a=b.ads.count;
    g+=`<g data-b="${b.id}" data-tip="${esc(b.name)} · ${a?fmt(a)+' anuncios en la biblioteca':'sin pauta en LinkedIn'}">`+T(0,y+row/2+4,esc(b.name),'ct lbl2')+
     (a?`<rect x="${lab}" y="${y+row/2-6*fz}" width="${lx(a)-lab}" height="${12*fz}" rx="3" fill="${C(b.id)}"/>`+T(lx(a)+8,y+row/2+4,fmt(a),'ct strong'):T(lab,y+row/2+4,'sin pauta','ct'))+`</g>`});
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Anuncios en la Biblioteca de LinkedIn por marca, escala logarítmica">${g}</svg>
   <div class="ckey"><span>Escala logarítmica: cada línea multiplica por 10</span></div>`;
 },
 /* 4. Idioma de la pauta */
 langs(W){
  const fz=fzv(),lab=W<520?0:130*fz,row=W<520?44*fz:34*fz,rows=[...D.brands].sort((a,b)=>b.ads.esPt-a.ads.esPt),H=row*rows.length+4,w=W-lab-(W<520?0:76*fz);let g='';
  rows.forEach((b,i)=>{const y=i*row+(W<520?18*fz:6),t=b.ads.loaded;let x=lab;
    g+=`<g data-b="${b.id}">`+T(0,W<520?y-5*fz:y+13*fz,esc(b.name),'ct lbl2');
    if(!t)g+=`<rect x="${lab}" y="${y}" width="${w}" height="${18*fz}" rx="3" fill="var(--panel-2)"/>`+T(lab+8,y+13*fz,'sin pauta','ct');
    else Object.entries(b.ads.langs).forEach(([kk,v])=>{const ww=v/t*w;g+=`<rect x="${x}" y="${y}" width="${Math.max(0,ww-2)}" height="${18*fz}" rx="3" fill="${LANGC[kk]}" data-tip="${esc(b.name)} · ${kk}: ${v} de ${t} anuncios"/>`;if(ww>30*fz)g+=T(x+6,y+13*fz,kk,'ct','start',`style="fill:${kk==='ES'?'var(--panel)':'var(--ink)'}"`);x+=ww});
    if(W>=520)g+=T(W,y+13*fz,b.ads.esPt+'% ES/PT','ct'+(b.ads.esPt>=30?' strong':''),'end');g+='</g>'});
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Idioma de los anuncios por marca">${g}</svg>
   <div class="ckey">${[['EN','Inglés'],['ES','Español'],['PT','Portugués'],['FR','Francés y otros europeos']].map(([kk,l])=>`<span><i class="sq" style="background:${LANGC[kk]}"></i>${l}</span>`).join('')}</div>`;
 },
 /* 5. Territorios de pauta */
 heat(W){
  const t=D.linkedinAds.territories,fz=fzv(),cols=t.labels.length,lab=W<620?Math.min(104*fz,W*.34):Math.min(140*fz,W*.3),cw=(W-lab-38*fz)/cols,ch=34*fz,head=W<620?128*fz:40*fz;
  const H=head+ch*D.brands.length+30*fz;let g='';
  t.labels.forEach((l,j)=>{const x=lab+j*cw+cw/2;
    g+=W<620?`<text class="ct" transform="translate(${x+4},${head-8}) rotate(-90)" text-anchor="start">${l}</text>`:T(x,head-12,l.split(' ')[0],'ct','middle',`data-tip="${esc(l)}"`)+(l.includes(' ')?T(x,head-12+12*fz,l.split(' ').slice(1).join(' '),'ct','middle'):'')});
  D.brands.forEach((b,i)=>{const y=head+i*ch;const vals=t.values[b.id];
    g+=`<g data-b="${b.id}">`+T(0,y+ch/2+4,esc(b.name),W<620?'ct':'ct lbl2');
    vals.forEach((v,j)=>{const x=lab+j*cw+3,w=cw-6,h=ch-8,note=(t.notes[b.id]||{})[j];
      g+=`<rect x="${x}" y="${y+4}" width="${w}" height="${h}" rx="5" fill="${v?C(b.id):'var(--panel-2)'}" fill-opacity="${v===1?.85:v?.35:1}" stroke="${v?C(b.id):'var(--line)'}" data-tip="${esc(b.name)} · ${esc(t.labels[j])}: ${v===1?'sí':v?'parcial':'no'}${note?' · '+esc(note):''}"/>`});
    g+=T(lab+cols*cw+8,y+ch/2+4,`${vals.filter(Boolean).length}/${cols}`,'ct','start')+'</g>'});
  const y=head+D.brands.length*ch+18*fz;
  t.labels.forEach((l,j)=>{const n=D.brands.filter(b=>t.values[b.id][j]).length;g+=T(lab+j*cw+cw/2,y,cw<40?`${n}`:`${n}/5`,'ct'+(n>=3?' hot':n===1?' cold':''),'middle',`data-tip="${esc(l)}: ${n} de 5 marcas"`)});
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Territorios de la pauta por marca">${g}</svg>
   <div class="ckey"><span><i class="kf"></i>Pauta activa en ese territorio</span><span><i class="kp"></i>Parcial</span><span><b class="hot mono">3/5</b>&nbsp;Territorio disputado</span><span><b class="cold mono">1/5</b>&nbsp;Territorio exclusivo</span></div>`;
 },
 /* 6. Ranking apilado */
 stack(W){
  const fz=fzv(),dims=D.diagnostic.dims,row=42*fz,lab=Math.min(130*fz,W*.3),val=56*fz,H=row*D.brands.length+4,w=W-lab-val;
  const op=[1,.8,.6,.42,.85,.6,.85,.55],col=i=>i<6?'var(--accent)':'var(--warn)';let g='';
  byScore().forEach((b,i)=>{const y=i*row;let x=lab;
    g+=`<g data-b="${b.id}">`+T(0,y+row/2+4,esc(b.name),'ct lbl2')+`<rect x="${lab}" y="${y+row/2-8*fz}" width="${w}" height="${16*fz}" rx="3" fill="var(--panel-2)"/>`;
    dims.forEach((d,j)=>{const v=b.scoreParts[d.dim],ww=v/100*w;if(ww>0)g+=`<rect x="${x}" y="${y+row/2-8*fz}" width="${Math.max(0,ww-1.5)}" height="${16*fz}" fill="${j<4?'var(--accent)':j<6?'var(--ok)':'var(--warn)'}" fill-opacity="${op[j]}" data-tip="${esc(b.name)} · ${esc(d.dim)}: ${fmt(v,1)} de ${d.weight}"/>`;x+=ww});
    g+=T(W,y+row/2+5,b.score,'ct strong','end',`style="font-size:${15*fz}px"`)+'</g>'});
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Puntaje por marca desglosado por dimensión">${g}</svg>
   <div class="ckey"><span><i class="sq" style="background:var(--accent)"></i>Orgánico (alcance, frecuencia, interacción, video)</span><span><i class="sq" style="background:var(--ok)"></i>Latam orgánico y consistencia</span><span><i class="sq" style="background:var(--warn)"></i>Pauta (volumen y ES/PT)</span></div>`;
 }
};
function drawCharts(){document.querySelectorAll('[data-chart]').forEach(el=>{const w=Math.floor(el.clientWidth);if(!w)return;el.innerHTML=CHARTS[el.dataset.chart](w)});applyLens()}
let _rz;addEventListener('resize',()=>{clearTimeout(_rz);_rz=setTimeout(drawCharts,120)});

/* ---------- sections ---------- */
function resumen(){
  const v=D.diagnostic.verdict,avg=Math.round(D.brands.reduce((s,b)=>s+b.score,0)/D.brands.length);
  const totF=D.brands.reduce((s,b)=>s+b.followers,0),totA=D.brands.reduce((s,b)=>s+b.ads.count,0),mk=B('maersk'),hl=B('hapag');
  return `<section id="resumen"><div class="hero">
   <div class="lead">
    <div class="eyebrow">Radar competitivo<span>/ transporte marítimo / Latam / ${D.meta.extractionDate}</span></div>
    <h1>Maersk pauta 58 veces más que MSC, pero MSC logra el doble de interacción por post</h1>
    <p class="sub">Benchmark de LinkedIn orgánico y LinkedIn Ads de 5 navieras, con un diagnóstico puntuado y las oportunidades que nadie en la categoría está tomando en Latinoamérica.</p>
    <div class="verdict">${gaugeSVG(avg)}<div><span class="lbl">Diagnóstico de la categoría · promedio</span><b>${v.label}</b><p>${v.description}</p></div></div>
    <div class="kpis">
     <div class="kpi"><div class="v num">~${k(totF)}</div><div class="l">Seguidores combinados</div><div class="r">${Math.round(mk.followers/totF*100)}% Maersk</div></div>
     <div class="kpi"><div class="v num">${fmt(totA)}</div><div class="l">Anuncios en la biblioteca</div><div class="r">${Math.round(mk.ads.count/totA*100)}% Maersk</div></div>
     <div class="kpi"><div class="v num">${hl.ads.esPt}%</div><div class="l">Pauta en ES/PT de Hapag-Lloyd</div><div class="r">#1 en Latam</div></div>
     <div class="kpi"><div class="v num">0</div><div class="l">Posts sobre Chancay</div><div class="r">en 5 páginas</div></div>
    </div>
   </div>
   <div class="panel radar-panel"><div class="ptitle"><h4>Huella en LinkedIn comparada</h4>${VER}</div><p class="cap">Cada eje está normalizado contra el líder de esa dimensión; pauta en escala logarítmica. Toca una marca para aislarla.</p>${radarSVG()}
    <div class="legend">${D.brands.map(b=>`<button type="button" data-lens="${b.id}" data-b="${b.id}"><span class="sw" style="--c:${C(b.id)}"></span>${b.name}</button>`).join('')}</div></div>
  </div></section>`;
}
function logo(b){return b.logo?`<img src="${b.logo}" alt="${b.name}">`:`<span class="wm" style="--c:${C(b.id)}">${b.name}</span>`}
function panorama(){
  const rows=D.brands.map(b=>`<tr data-b="${b.id}"><td>${nm(b)}</td><td><a href="${b.url}" target="_blank" rel="noopener">${b.page}</a></td><td class="r">${b.followersLabel} ${VER}</td><td class="r">${fmt(b.associates)}</td><td class="r">${fmt(b.postsPerMonth,1).replace(/,0$/,'')}</td><td class="r">${fmt(b.interPerPost)}</td><td class="r">${pct(b.er)} ${EST}</td><td class="r">${b.videoPct}%</td><td class="r">${b.ads.count?fmt(b.ads.count):'0'}</td><td class="r">${b.spanishPosts}</td></tr>`).join('');
  const pos=D.brands.map(b=>`<tr data-b="${b.id}"><td>${nm(b)}</td><td>${b.pos.tone}</td><td>${b.pos.focus}</td><td>${b.pos.latam}</td><td>${b.pos.top}</td></tr>`).join('');
  return `<section id="panorama">${shead('panorama','Panorama de la categoría','Las cuatro mayores navieras globales y la filial peruana de COSCO, medidas con las mismas métricas en sus páginas de LinkedIn.','CAT · 5 marcas')}
   <div class="logos">${D.brands.map(b=>`<button type="button" class="logo-card" data-lens="${b.id}" data-b="${b.id}"><div class="lw">${logo(b)}</div><div class="meta"><b><span class="sw" style="--c:${C(b.id)}"></span>${b.name}</b><span class="mono" style="font-size:calc(10.5px * var(--fz))">${fmt(b.share,1)}% flota</span></div><span class="mono" style="font-size:calc(11px * var(--fz));color:var(--mute)">${b.handle}</span></button>`).join('')}</div>
   <div class="subh"><h3>Comparativa general</h3><span>Desliza la tabla en pantallas chicas</span></div>
   <div class="tw"><table><thead><tr><th>Marca</th><th>Página</th><th class="r">Seguidores</th><th class="r">Asociados</th><th class="r">Posts/mes</th><th class="r">Interacc./post</th><th class="r">Tasa interacc.</th><th class="r">Video</th><th class="r">Anuncios</th><th class="r">Posts en ES</th></tr></thead><tbody>${rows}</tbody></table></div>
   <div class="subh"><h3>Posicionamiento</h3><span>Lectura de ~50 publicaciones por marca</span></div>
   <div class="tw"><table><thead><tr><th>Marca</th><th>Tono</th><th>Foco de contenido</th><th>Latam en el feed</th><th>Post más fuerte</th></tr></thead><tbody>${pos}</tbody></table></div>
   <p class="cap" style="margin:0">Cuota de flota: Alphaliner, sept-2026. En COSCO corresponde al grupo global; la página analizada es la filial de Perú.</p>
  </section>`;
}
function linkedin(){
  const L=D.linkedin;
  const cards=D.brands.map(b=>`<div class="bcard" data-b="${b.id}">${nm(b)}
   <div class="mini"><div><b>${fmt(b.postsPerMonth,1).replace(/,0$/,'')}</b><span>posts/mes</span></div><div><b>${fmt(b.interPerPost)}</b><span>int./post</span></div><div><b>${b.videoPct}%</b><span>video</span></div></div>
   <p style="font-size:calc(13px * var(--fz))">${b.insight}</p><div class="tags">${b.themes.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
   <a class="btn" href="${b.url}" target="_blank" rel="noopener">Ver página ↗</a></div>`).join('');
  return `<section id="linkedin">${shead('linkedin','LinkedIn orgánico','Alcance, ritmo, respuesta y formatos según ~50 publicaciones por página. Promedios de los últimos 30 días.','LI · orgánico')}
   <div class="grid g2">
    ${bars('Seguidores','Tamaño de la comunidad (redondeado por LinkedIn)',b=>b.followers,k)}
    ${bars('Posts por mes','Publicaciones de los últimos 30 días',b=>b.postsPerMonth,v=>fmt(v,1).replace(/,0$/,''))}
    ${bars('Interacciones por post','Reacciones + comentarios + compartidos, promedio',b=>b.interPerPost,fmt,{tip:b=>fmt(b.reac)+' reacc · '+fmt(b.com,1)+' com · '+fmt(b.sh,1)+' compartidos'})}
    ${bars('Tasa de interacción','Interacciones por post ÷ seguidores. COSCO Perú lidera por su base de 8 mil; el resto se lee entre sí',b=>b.er,v=>pct(v),{badge:EST,max:0.03})}
   </div>
   <div class="panel"><div class="ptitle"><h4>Alcance vs. respuesta</h4>${VER}</div><p class="cap">Eje horizontal, tamaño de la comunidad; eje vertical, interacciones por post. MSC y CMA CGM resuenan más que Maersk con menos seguidores; Maersk compensa con volumen.</p><div class="chart" data-chart="scatter"></div></div>
   <div class="panel"><div class="ptitle"><h4>Mix de formatos</h4>${VER}</div><p class="cap">Distribución de las ~50 publicaciones revisadas. Los dos líderes de interacción son los que más video usan.</p><div class="chart" data-chart="mix"></div></div>
   <div class="subh"><h3>Hallazgos</h3></div>${finds(L.conclusions,'LI')}
   <div class="subh"><h3>Recomendaciones para competir en Latam</h3></div>${recs(L.recommendations)}
   <div class="subh"><h3>Lo que publica cada marca</h3></div>
   <div class="grid g5">${cards}</div>
  </section>`;
}
function ads(){
  const A=D.linkedinAds;
  const cards=byScore().sort((a,b)=>b.ads.count-a.ads.count).map(b=>{const a=b.ads;return `<div class="bcard" data-b="${b.id}" id="ads-${b.id}">
   <div class="top">${nm(b)}<span class="state ${a.active?'on':'off'}"><i></i>${a.active?'con pauta':'sin pauta'}</span></div>
   <div class="mini"><div><b>${fmt(a.count)}</b><span>anuncios</span></div><div><b>${a.esPt}%</b><span>ES/PT</span></div><div><b>${a.tla}</b><span>ejecutivos</span></div></div>
   <p style="font-size:calc(13.5px * var(--fz))">${a.summary}</p>
   ${a.themes.length?`<div class="tags">${a.themes.map(t=>`<span class="tag">${t}</span>`).join('')}</div>`:''}
   ${a.formats?`<div class="spec">FMT → ${a.formats}<br>MUESTRA → ${a.loaded} anuncios leídos</div>`:''}
   ${a.alert?`<div class="alert"><b>Alerta</b>${a.alert}</div>`:''}
   ${a.library?`<a class="btn" href="${a.library}" target="_blank" rel="noopener">Biblioteca de anuncios ↗</a>`:''}</div>`}).join('');
  return `<section id="ads">${shead('ads','LinkedIn Ads','Anuncios acumulados en la Biblioteca de Anuncios de LinkedIn, con idioma y territorio de cada mensaje.','ADS · pagado')}
   <div class="grid g2">
    <div class="panel"><div class="ptitle"><h4>Anuncios en la biblioteca</h4>${VER}</div><p class="cap">Total acumulado por anunciante. Con escala lineal, MSC y CMA CGM no serían visibles.</p><div class="chart" data-chart="adsLog"></div></div>
    <div class="panel"><div class="ptitle"><h4>Idioma de la pauta</h4>${VER}</div><p class="cap">Sobre los anuncios leídos (hasta 168 por marca). Hapag-Lloyd es el único con un tercio en español o portugués.</p><div class="chart" data-chart="langs"></div></div>
   </div>
   <div class="panel"><div class="ptitle"><h4>Territorios de la pauta</h4>${EST}</div><p class="cap">Qué temas pauta cada marca, según los mensajes leídos. Producto digital y empleo están disputados; resiliencia es exclusivo de Maersk y ferias/agro casi no se pauta.</p><div class="chart" data-chart="heat"></div></div>
   <div class="grid g3">${cards}</div>
   <div class="subh"><h3>Hallazgos</h3></div>${finds(A.conclusions,'ADS')}
   <div class="subh"><h3>Recomendaciones para competir en Latam</h3></div>${recs(A.recommendations)}
  </section>`;
}
function oportunidades(){
  const O=D.strategicOpportunities;
  return `<section id="oportunidades">${shead('oportunidades',O.title,O.subtitle+'. Cada una parte de una brecha visible en los datos del benchmark.','OPP · estrategia')}
   <div class="stats">${O.industryStats.map(s=>`<div class="stat"><div class="v num">${s.value}</div><div class="l">${s.label}</div><div class="s">${s.source}</div></div>`).join('')}</div>
   <div class="grid g3">${O.opportunities.map((o,i)=>`<div class="opp" id="opp-${i+1}" data-search="Oportunidad · ${o.title}"><div class="code"><span>OPP-${String(i+1).padStart(2,'0')}</span><span>${o.platforms.join(' · ')}</span></div><h3>${o.title}</h3><p>${o.description}</p><div class="hook"><b>Idea de activación</b>${o.hook}</div></div>`).join('')}</div>
  </section>`;
}
function diagnostico(){
  const G=D.diagnostic,v=G.verdict,R=byScore(),avg=Math.round(D.brands.reduce((s,b)=>s+b.score,0)/D.brands.length);
  const segs=(p,w)=>`<div class="seg" style="grid-template-columns:repeat(${w},1fr)">${Array.from({length:w},(_,i)=>`<i class="${i<Math.round(p)?'f':''}"></i>`).join('')}</div>`;
  const gv=(b,key)=>key==='adsCount'?fmt(b.ads.count):key==='esPt'?b.ads.esPt+'%':key==='videoPct'?b.videoPct+'%':key==='followersLabel'?b.followersLabel:key==='postsPerMonth'?fmt(b.postsPerMonth,1).replace(/,0$/,''):fmt(b[key]);
  return `<section id="diagnostico">${shead('diagnostico','Diagnóstico de presencia en LinkedIn','Puntaje sobre 100 en ocho dimensiones de orgánico y pauta. Sin marca cliente: las cinco se miden con la misma vara. Rúbrica de benmarch2 adaptada a LinkedIn como único canal.','DX · ranking')}
   <div class="diag">
    <div class="panel gauge"><span class="lbl">Promedio de la categoría</span>${gaugeSVG(avg)}<div class="lab">${v.label}</div><p>${v.description}</p></div>
    <div class="panel"><div class="ptitle"><h4>Ranking</h4><span class="mono" style="font-size:calc(11px * var(--fz));color:var(--mute)">ancho total = 100 puntos</span></div><p class="cap">Cada tramo es una dimensión. Pasa el cursor para ver su puntaje.</p><div class="chart" data-chart="stack"></div></div>
   </div>
   <div class="subh"><h3>Desglose por dimensión</h3><span>1 bloque = 1 punto</span></div>
   <div class="tw"><table><thead><tr><th>Dimensión</th><th class="r">Peso</th>${R.map(b=>`<th>${b.name}</th>`).join('')}</tr></thead><tbody>
    ${G.dims.map(d=>`<tr><td style="font-weight:600;white-space:nowrap">${d.dim} ${/Latam orgánico|Consistencia/.test(d.dim)?EST:''}<br><span style="font-weight:400;font-size:calc(11.5px * var(--fz));color:var(--mute)">${d.note}</span></td><td class="r">${d.weight}</td>${R.map(b=>`<td data-b="${b.id}"><div class="segcell">${segs(b.scoreParts[d.dim],d.weight)}<span>${fmt(b.scoreParts[d.dim],1).replace(/,0$/,'')}</span></div></td>`).join('')}</tr>`).join('')}
    <tr><td style="font-weight:600">Total</td><td class="r">100</td>${R.map(b=>`<td data-b="${b.id}" class="mono" style="font-weight:600">${b.score}</td>`).join('')}</tr>
   </tbody></table></div>
   <div class="grid g5">${R.map(b=>`<div class="bcard vcard" data-b="${b.id}" id="dx-${b.id}" data-search="Diagnóstico · ${b.name}">${nm(b)}<div class="gsm">${gaugeSVG(b.score)}<b>${b.verdict.label}</b></div>
     <ul class="ok">${b.verdict.strengths.map(s=>`<li>${s}</li>`).join('')}</ul><ul class="ko">${b.verdict.weaknesses.map(s=>`<li>${s}</li>`).join('')}</ul></div>`).join('')}</div>
   <div class="subh"><h3>Brechas clave</h3></div>
   <div class="tw"><table><thead><tr><th>Dimensión</th>${R.map(b=>`<th class="r">${b.name}</th>`).join('')}<th>Lectura estratégica</th><th>Nivel</th></tr></thead><tbody>
    ${G.gaps.map(g=>`<tr><td style="font-weight:600;white-space:nowrap">${g.dimension}</td>${R.map(b=>`<td class="r" data-b="${b.id}">${gv(b,g.key)}</td>`).join('')}<td style="min-width:300px">${g.gapText}</td><td><span class="sev ${g.severity}">${g.severity}</span></td></tr>`).join('')}
   </tbody></table></div>
   <div class="lists">
    <div class="panel"><h3><i style="background:var(--ok)"></i>Fortalezas de la categoría</h3><ul class="l-ok">${v.strengths.map(s=>`<li>${s}</li>`).join('')}</ul></div>
    <div class="panel"><h3><i style="background:var(--bad)"></i>Debilidades de la categoría</h3><ul class="l-ko">${v.weaknesses.map(s=>`<li>${s}</li>`).join('')}</ul></div>
    <div class="panel"><h3><i style="background:var(--accent)"></i>Prioridades para competir en Latam</h3><ol class="l-pr">${v.priority.map(s=>`<li>${s}</li>`).join('')}</ol></div>
   </div>
  </section>`;
}
function fuentes(){
  return `<section id="fuentes">${shead('fuentes','Metodología y fuentes','','SRC')}
   <div class="method"><p>${D.meta.method} ${VER} indica un dato leído directamente en LinkedIn; ${EST}, una cifra calculada o una lectura cualitativa.</p>
   <ol>${D.sources.map(s=>`<li><a href="${s.u}" target="_blank" rel="noopener">${s.t}</a></li>`).join('')}</ol>
   <span class="mono" style="font-size:calc(11px * var(--fz));color:var(--mute)">RADAR BY OSVALDO · ${D.meta.extractionDate.toUpperCase()}</span></div></section>`;
}

/* ---------- interaction ---------- */
let focusId=null;
function setLens(id){focusId=(id&&id!==focusId)?id:null;applyLens()}
function applyLens(){
  document.body.classList.toggle('focusing',!!focusId);
  document.querySelectorAll('[data-b]').forEach(el=>el.classList.toggle('lit',el.dataset.b===focusId));
  document.querySelectorAll('[data-lens-btn]').forEach(el=>el.setAttribute('aria-pressed',el.dataset.lensBtn===focusId));
  document.querySelectorAll('.rp').forEach(g=>{const p=g.querySelector('polygon');p.setAttribute('fill-opacity',focusId&&g.dataset.b===focusId?.22:.05)});
}
function buildRail(){
  document.getElementById('toc').innerHTML=SECTIONS.map(s=>`<li><a href="#${s[0]}" data-sec="${s[0]}"><span class="tg">${s[2]}</span>${s[1]}<span class="pg"><i></i></span></a></li>`).join('');
  document.getElementById('dock').innerHTML=SECTIONS.filter(x=>['resumen','linkedin','ads','oportunidades','diagnostico'].includes(x[0])).map(s=>`<a href="#${s[0]}" data-sec="${s[0]}" aria-label="${s[1]}"><b>${s[2]}</b></a>`).join('')+`<button type="button" id="dock-prefs" aria-label="Ajustes de lectura: tema y tamaño de texto"><b style="font-size:13px;font-family:var(--f-sans)">Aa</b></button><button type="button" id="dock-search" aria-label="Buscar"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg></button>`;
  const lensBtns=D.brands.map((b,i)=>`<button type="button" data-lens-btn="${b.id}" aria-pressed="false"><span class="sw" style="--c:${C(b.id)}"></span>${b.name}<span class="k">${i+1}</span></button>`).join('');
  document.getElementById('lens').innerHTML=lensBtns;
  const lb=document.createElement('div');lb.className='lens-bar';lb.innerHTML=lensBtns.replace(/<span class="k">\d<\/span>/g,'');
  document.getElementById('resumen').after(lb);
  document.getElementById('live-txt').textContent='Verificado · '+D.meta.extractionDate;
  if(!/Mac|iPhone|iPad/.test(navigator.platform||''))document.getElementById('kbd-hint').textContent='Ctrl K';
}
function spy(){
  const secs=SECTIONS.map(s=>document.getElementById(s[0])).filter(Boolean);
  const upd=()=>{
    const y=innerHeight*.3;let cur=secs[0];
    secs.forEach(s=>{if(s.getBoundingClientRect().top<=y)cur=s});
    if(innerHeight+scrollY>=document.documentElement.scrollHeight-4)cur=secs[secs.length-1];
    document.querySelectorAll('[data-sec]').forEach(a=>a.classList.toggle('on',a.dataset.sec===cur.id));
    secs.forEach(s=>{const r=s.getBoundingClientRect();const p=Math.min(1,Math.max(0,(y-r.top)/r.height));const a=document.querySelector(`.toc [data-sec="${s.id}"] .pg i`);if(a)a.style.width=(p*100)+'%'});
  };
  addEventListener('scroll',upd,{passive:true});upd();
}
function go(id){const el=document.getElementById(id);if(!el)return;el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});el.classList.remove('flash');void el.offsetWidth;if(!el.matches('section'))el.classList.add('flash')}
let CMD=[],sel=0;
function cmdItems(){
  CMD=[...SECTIONS.map(s=>({t:'Módulo',x:s[1],a:()=>go(s[0])})),
    ...D.brands.map(b=>({t:'Lente',x:'Aislar '+b.name,a:()=>{focusId=null;setLens(b.id)}})),
    {t:'Lente',x:'Ver todas las marcas',a:()=>setLens(null)},
    ...D.brands.map(b=>({t:'Pauta',x:b.name+' en LinkedIn Ads',a:()=>go('ads-'+b.id)})),
    ...[...document.querySelectorAll('[data-search]')].map(el=>({t:el.dataset.search.split(' · ')[0],x:el.dataset.search.split(' · ').slice(1).join(' · '),a:()=>go(el.id)})),
    {t:'Tema',x:'Cambiar a modo oscuro',a:()=>setTheme('dark')},{t:'Tema',x:'Cambiar a modo claro',a:()=>setTheme('light')},{t:'Texto',x:'Agrandar texto',a:()=>setFz(fzI+1)},{t:'Texto',x:'Achicar texto',a:()=>setFz(fzI-1)},{t:'Texto',x:'Tamaño normal',a:()=>setFz(1)}];
}
const norm=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
function renderCmd(q=''){
  const qq=norm(q.trim());const list=CMD.filter(c=>!qq||norm(c.t+' '+c.x).includes(qq)).slice(0,40);
  sel=Math.min(sel,Math.max(0,list.length-1));
  const ul=document.getElementById('cmd-list');
  ul.innerHTML=list.length?list.map((c,i)=>`<li role="option" data-i="${i}" aria-selected="${i===sel}"><span class="ty">${c.t}</span><span class="tx">${c.x}</span></li>`).join(''):'<div class="empty">Sin resultados. Prueba con “Chancay”, “Hapag” o “español”.</div>';
  ul._list=list;
  ul.querySelector('[aria-selected="true"]')?.scrollIntoView({block:'nearest'});
}
let lastFocus=null;
function openCmd(){lastFocus=document.activeElement;const m=document.getElementById('cmdk');m.hidden=false;const i=document.getElementById('cmd-in');i.value='';sel=0;renderCmd();i.focus()}
function closeCmd(){document.getElementById('cmdk').hidden=true;lastFocus?.focus?.()}
function runCmd(){const l=document.getElementById('cmd-list')._list;if(l&&l[sel]){closeCmd();l[sel].a()}}

const FZ=[0.9,1,1.12,1.25,1.4];let fzI=1;
const ICS={light:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',system:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>',dark:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>'};
function prefsHTML(){return `<div class="row"><span class="lbl">Tema</span><div class="seg-ctl" role="group" aria-label="Tema">${[['light','Claro'],['system','Auto'],['dark','Oscuro']].map(t=>`<button type="button" data-th="${t[0]}" aria-pressed="false" title="Tema ${t[1].toLowerCase()}">${ICS[t[0]]}<span>${t[1]}</span></button>`).join('')}</div></div>
<div class="row"><span class="lbl">Texto</span><div class="seg-ctl" role="group" aria-label="Tamaño del texto"><button type="button" data-fz="-1" aria-label="Achicar texto">A−</button><output data-fz-out aria-live="polite">100%</output><button type="button" data-fz="1" aria-label="Agrandar texto">A+</button></div></div>`}
function setFz(i){fzI=Math.max(0,Math.min(FZ.length-1,i));document.documentElement.style.setProperty('--fz',FZ[fzI]);
  document.querySelectorAll('[data-fz-out]').forEach(o=>o.textContent=Math.round(FZ[fzI]*100)+'%');
  document.querySelectorAll('[data-fz="-1"]').forEach(b=>b.disabled=fzI===0);document.querySelectorAll('[data-fz="1"]').forEach(b=>b.disabled=fzI===FZ.length-1);
  try{localStorage.setItem('radar-fz',fzI)}catch(e){}
  if(typeof D!=='undefined'&&D)requestAnimationFrame(drawCharts)}
function openSheet(){lastFocus=document.activeElement;document.getElementById('sheet').hidden=false;document.querySelector('#sheet [data-th][aria-pressed="true"]')?.focus()}
function closeSheet(){document.getElementById('sheet').hidden=true;lastFocus?.focus?.()}
function setTheme(t){try{t==='system'?localStorage.removeItem('radar-theme'):localStorage.setItem('radar-theme',t)}catch(e){} if(t==='system')document.documentElement.removeAttribute('data-theme');else document.documentElement.setAttribute('data-theme',t);document.querySelectorAll('[data-th]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.th===t))}
function wire(){
  document.addEventListener('click',e=>{
    const l=e.target.closest('[data-lens],[data-lens-btn]');if(l)setLens(l.dataset.lens||l.dataset.lensBtn);
    if(e.target.closest('#open-cmd,#dock-search'))openCmd();
    if(e.target.id==='cmdk')closeCmd();
    const li=e.target.closest('#cmd-list li');if(li){sel=+li.dataset.i;runCmd()}
    const th=e.target.closest('[data-th]');if(th)setTheme(th.dataset.th);
    const fz=e.target.closest('[data-fz]');if(fz&&!fz.disabled)setFz(fzI+(+fz.dataset.fz));
    if(e.target.closest('#dock-prefs'))openSheet();
    if(e.target.id==='sheet'||e.target.closest('#sheet-close'))closeSheet();
  });
  document.getElementById('cmd-in').addEventListener('input',e=>{sel=0;renderCmd(e.target.value)});
  document.addEventListener('keydown',e=>{
    const open=!document.getElementById('cmdk').hidden;
    if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();open?closeCmd():openCmd();return}
    if(open){
      if(e.key==='Escape')closeCmd();
      else if(e.key==='ArrowDown'){e.preventDefault();sel++;renderCmd(document.getElementById('cmd-in').value)}
      else if(e.key==='ArrowUp'){e.preventDefault();sel=Math.max(0,sel-1);renderCmd(document.getElementById('cmd-in').value)}
      else if(e.key==='Enter'){e.preventDefault();runCmd()}
      else if(e.key==='Tab'){e.preventDefault();document.getElementById('cmd-in').focus()}
      return;
    }
    if(!document.getElementById('sheet').hidden&&e.key==='Escape'){closeSheet();return}
    if(/input|textarea/i.test(document.activeElement.tagName)||e.metaKey||e.ctrlKey||e.altKey)return;
    if(e.key==='+'||e.key==='='){setFz(fzI+1);return}
    if(e.key==='-'||e.key==='_'){setFz(fzI-1);return}
    if(e.key==='/'){e.preventDefault();openCmd()}
    else if(e.key==='Escape')setLens(null);
    else if(/^[1-5]$/.test(e.key))setLens(D.brands[+e.key-1].id);
    else if(e.key==='0')setLens(null);
    else if(e.key==='j'||e.key==='k'){const cur=document.querySelector('.toc a.on')?.dataset.sec;const i=SECTIONS.findIndex(s=>s[0]===cur);const n=SECTIONS[Math.min(SECTIONS.length-1,Math.max(0,i+(e.key==='j'?1:-1)))];go(n[0])}
  });
  const tip=document.getElementById('tip');
  document.addEventListener('mousemove',e=>{const r=e.target.closest('[data-tip]');if(!r){tip.style.opacity=0;return}tip.textContent=r.dataset.tip;tip.style.opacity=1;tip.style.left=Math.min(e.clientX+14,innerWidth-tip.offsetWidth-8)+'px';tip.style.top=(e.clientY+16)+'px'});
  document.querySelectorAll('[data-prefs]').forEach(el=>el.innerHTML=prefsHTML());
  let t='system';try{t=localStorage.getItem('radar-theme')||'system'}catch(e){} setTheme(t);
  let f=1;try{const v=localStorage.getItem('radar-fz');if(v!==null)f=+v}catch(e){} setFz(isNaN(f)?1:f);
}
async function init(){
  if(window.__DATA__)D=window.__DATA__;else{const r=await fetch('data.json',{cache:'no-store'});D=await r.json()}
  document.getElementById('app').innerHTML=resumen()+panorama()+linkedin()+ads()+oportunidades()+diagnostico()+fuentes();
  buildRail();wire();spy();cmdItems();drawCharts();
  if(location.hash&&/^#[\w-]+$/.test(location.hash))setTimeout(()=>go(location.hash.slice(1)),50);
}
init();
