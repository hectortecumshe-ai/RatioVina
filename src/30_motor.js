// =====================================================================
// 30_motor.js — cálculo: redes, MICMAC, MACTOR, preceptos, NCA, escenarios, ahorro, calendario
// Sin dependencias. Cada función documenta su fórmula y su fuente.
// =====================================================================

// ---------- Redes (Freeman 1978; Brandes 2001) ----------
// nodos: [{id}], aristas: [{a,b,w}] no dirigidas. Distancia de una arista = 1/w (vínculo más fuerte = más cerca).
function metricasRed(nodos, aristas){
  const n = nodos.length, idx = new Map(nodos.map((d,i)=>[d.id,i]));
  const ady = Array.from({length:n}, ()=>[]);
  for(const e of aristas){ const i=idx.get(e.a), j=idx.get(e.b); if(i==null||j==null||i===j) continue; const w=+e.w||1;
    ady[i].push([j,w]); ady[j].push([i,w]); }
  const grado = ady.map(l=>l.reduce((s,[,w])=>s+w,0));        // grado ponderado (fuerza)
  const gradoN = ady.map(l=>l.length);
  const bet = new Array(n).fill(0), cerc = new Array(n).fill(0);
  for(let s=0;s<n;s++){ // Dijkstra + acumulación de Brandes
    const S=[], P=Array.from({length:n},()=>[]), sig=new Array(n).fill(0), d=new Array(n).fill(Infinity);
    sig[s]=1; d[s]=0; const Q=[[0,s]], hecho=new Array(n).fill(false);
    while(Q.length){ Q.sort((x,y)=>x[0]-y[0]); const [dv,v]=Q.shift(); if(hecho[v]) continue; hecho[v]=true; S.push(v);
      for(const [w,wt] of ady[v]){ const nd=dv+1/wt;
        if(nd < d[w]-1e-12){ d[w]=nd; Q.push([nd,w]); sig[w]=sig[v]; P[w]=[v]; }
        else if(Math.abs(nd-d[w])<1e-12){ sig[w]+=sig[v]; P[w].push(v); } } }
    const del=new Array(n).fill(0);
    while(S.length){ const w=S.pop(); for(const v of P[w]) del[v]+= sig[v]/sig[w]*(1+del[w]); if(w!==s) bet[w]+=del[w]; }
    const alc = d.filter((x,i)=>i!==s && isFinite(x)); const sum = alc.reduce((a,b)=>a+b,0);
    cerc[s] = sum>0 ? (alc.length/(n-1)) * (alc.length/sum) : 0;   // cercanía (Wasserman–Faust, componentes)
  }
  for(let i=0;i<n;i++) bet[i]/=2;                                  // red no dirigida
  const m = aristas.length, dens = n>1 ? 2*m/(n*(n-1)) : 0;
  return {nodos: nodos.map((d,i)=>({id:d.id, grado:grado[i], vecinos:gradoN[i], inter:bet[i], cerc:cerc[i]})), densidad:dens};
}

// ---------- MICMAC (Godet 2007) ----------
// M: matriz cuadrada de influencias directas (0 nula, 1 débil, 2 media, 3 fuerte). Fila i influye sobre columna j.
// Directo: motricidad = suma de fila, dependencia = suma de columna.
// Indirecto: se eleva M a potencias M^k hasta que la jerarquía de motricidad y dependencia se estabiliza.
function micmac(M, kmax=8){
  const n = M.length; const z = (a)=>a.map(r=>r.slice());
  const mult=(A,B)=>A.map((r,i)=>B[0].map((_,j)=>r.reduce((s,_,k)=>s+A[i][k]*B[k][j],0)));
  const sumas=(A)=>({mot:A.map(r=>r.reduce((s,x)=>s+x,0)), dep:A[0].map((_,j)=>A.reduce((s,r)=>s+r[j],0))});
  const rango=(v)=>{ const o=v.map((x,i)=>[x,i]).sort((a,b)=>b[0]-a[0]); const r=new Array(v.length); o.forEach(([,i],k)=>r[i]=k); return r; };
  const dir = sumas(M); let P = z(M), k = 1, prev = null, ind = dir;
  for(; k<kmax; k++){ P = mult(P, M); const s = sumas(P); const rk = rango(s.mot).join(',')+'|'+rango(s.dep).join(',');
    // normaliza para no desbordar
    const mx = Math.max(1e-9, ...P.flat()); P = P.map(r=>r.map(x=>x/mx)); ind = sumas(P);
    if(rk===prev) break; prev = rk; }
  const norm=(v)=>{ const t=v.reduce((a,b)=>a+b,0)||1; return v.map(x=>100*x/t); };
  const res = (s)=>{ const mot=norm(s.mot), dep=norm(s.dep), mm=100/n;
    return mot.map((m,i)=>({i, mot:m, dep:dep[i], zona: m>=mm ? (dep[i]>=mm ? 'enlace' : 'motriz') : (dep[i]>=mm ? 'dependiente' : 'autonoma')})); };
  return {directo: res(dir), indirecto: res(ind), iter:k, umbral:100/n};
}
const ZONAS_MICMAC = {
  motriz:['Motrices (influyentes)','Drivers (influential)','Mucha influencia, poca dependencia: palancas del sistema.','High influence, low dependence: system levers.'],
  enlace:['De enlace (clave)','Linkage (key)','Influyen y dependen: inestables, todo cambio repercute.','Influence and depend: unstable, every change propagates.'],
  dependiente:['Dependientes (resultado)','Dependent (outcome)','Reflejan el efecto de las demás.','Reflect the effect of the others.'],
  autonoma:['Autónomas','Autonomous','Poca relación con el sistema.','Weakly connected to the system.']
};

// ---------- MACTOR (Godet 2007) ----------
// MID: influencias directas entre actores (0–4). MIDI_ij = MID_ij + Σ_k min(MID_ik, MID_kj).
// Mi (influencia) = Σ_j MIDI_ij − MIDI_ii ; Di (dependencia) = Σ_j MIDI_ji − MIDI_ii
// Ri* = (Mi/ΣM)·Mi/(Mi+Di) ; ri = Ri*/promedio(R*) (relación de fuerza)
// MAO: posición de cada actor ante cada objetivo (−3…+3). 3MAO_ik = MAO_ik · ri
// Convergencia/divergencia entre actores i, j: Σ_k (|3MAO_ik|+|3MAO_jk|)/2 sobre objetivos de mismo signo / signo opuesto.
function mactor(MID, MAO){
  const n = MID.length;
  const MIDI = MID.map((r,i)=>r.map((x,j)=>{ let s=x; for(let k=0;k<n;k++) if(k!==i&&k!==j) s+=Math.min(MID[i][k],MID[k][j]); return i===j?0:s; }));
  const M = MIDI.map((r,i)=>r.reduce((s,x,j)=>s+(j===i?0:x),0));
  const D = MIDI[0].map((_,j)=>MIDI.reduce((s,r,i)=>s+(i===j?0:r[j]),0));
  const sM = M.reduce((a,b)=>a+b,0)||1;
  const R = M.map((m,i)=> (m+D[i])>0 ? (m/sM)*(m/(m+D[i])) : 0);
  const mR = R.reduce((a,b)=>a+b,0)/n || 1; const r = R.map(x=>x/mR);
  const P3 = MAO.map((fila,i)=>fila.map(x=>x*r[i]));
  const conv = [], div = [];
  for(let i=0;i<n;i++){ conv.push([]); div.push([]); for(let j=0;j<n;j++){ let c=0,d=0;
    if(i!==j) P3[i].forEach((x,k)=>{ const y=P3[j][k]; if(x===0||y===0) return; const v=(Math.abs(x)+Math.abs(y))/2; if(Math.sign(x)===Math.sign(y)) c+=v; else d+=v; });
    conv[i].push(c); div[i].push(d); } }
  const movil = MAO[0] ? MAO[0].map((_,k)=>({pro:P3.reduce((s,f)=>s+(f[k]>0?f[k]:0),0), contra:P3.reduce((s,f)=>s+(f[k]<0?-f[k]:0),0)})) : [];
  return {MIDI, M, D, r, P3, conv, div, movil};
}

// ---------- Preceptos de DL y CA (tesis, Tabla 2.2-1) ----------
function valorPrecepto(p, conteo){ const c = Math.max(0, +conteo||0); if(p.n===8) return c>0 ? 1 : 0; return Math.min(p.max, +(c*p.paso).toFixed(2)); }
function leerRegla(v){ return REGLAS_PRECEPTO.find(r=>v < r.hasta) || REGLAS_PRECEPTO[REGLAS_PRECEPTO.length-1]; }
// NCA = (VC + VRUP) · VMPUP  (tesis, Paso 3)
function nca(VC, VRUP, VMPUP){ return (+VC + +VRUP) * +VMPUP; }

// ---------- Escenarios futuribles (no lineales) ----------
// Trayectoria logística entre el estado actual x0 y el deseado xd con tasa k y punto de inflexión t0 (años):
//   x(t) = x0 + (xd − x0)·L(t), con L(t) = [σ(k(t−t0)) − σ(−k t0)] / [1 − σ(−k t0)]   (L(0)=0, L(∞)=1)
// Tres escenarios: deseable (alcanza la meta), tendencial (fracción a de la meta), regresivo (retrocede una fracción b).
function trayectoria(x0, xd, k, t0, H, frac){ const s=(z)=>1/(1+Math.exp(-z)); const b=s(-k*t0);
  const out=[]; for(let t=0;t<=H;t++){ const L=(s(k*(t-t0))-b)/(1-b); out.push(x0 + (xd-x0)*frac*L); } return out; }

// ---------- Ahorro de recursos ----------
// Para cada recurso: ahorro por hectárea = convencional − local; total = ahorro × superficie; % = ahorro / convencional.
function ahorro(filas, ha){ return filas.map(f=>{ const c=+f.conv, l=+f.local; const ok = isFinite(c)&&isFinite(l)&&f.conv!==''&&f.local!=='';
  const a = ok ? c-l : null; return {...f, ah:a, tot: ok ? a*ha : null, pct: ok && c ? 100*a/c : null}; }); }

// ---------- Calendario del Stack ----------
// Día del año (0–364) del centro de la ventana de cada paso. Para pasos con DDS se usa la fecha de siembra elegida.
const MES_DIA = [0,31,59,90,120,151,181,212,243,273,304,334];
function diaPaso(p, siembraDia){ if(p.dds){ const m = p.dds.length>1 ? (p.dds[0]+p.dds[1])/2 : p.dds[0]; return (siembraDia + m) % 365; }
  const v = p.v; const a = MES_DIA[v[0]-1], b = MES_DIA[v[v.length-1]-1] + 30; let c = (a + b)/2; if(v.length>1 && v[0]>v[v.length-1]) c = (a + b + 365)/2;
  return c % 365; }
