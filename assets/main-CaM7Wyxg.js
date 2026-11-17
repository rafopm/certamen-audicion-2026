import{C as v,f as Ce,a as Xe,b as y,g as ue,c as Re}from"./formatters-CwHejOBa.js";class et{constructor(){this.state={rondaActual:1,rondaVista:1,rondaCerrada:!1,rondaHistorial:null,audicionActual:0,alumnos:[],canciones:[],configRonda:null,resultados:{},respuestasAudicion:[],isLoading:!1,error:null},this.listeners=[]}get(){return{...this.state}}set(t){this.state={...this.state,...t},this.notify()}subscribe(t){return this.listeners.push(t),()=>{this.listeners=this.listeners.filter(a=>a!==t)}}notify(){this.listeners.forEach(t=>t(this.state))}}const x=new et,r={elements:{},init(){return this._ensureFeedbackElements(),this.elements={selectRonda:document.getElementById("select-ronda"),audicionNumero:document.getElementById("audicion-numero"),btnPlay:document.getElementById("btn-play"),listaAlumnos:document.getElementById("lista-alumnos"),btnGuardarAciertos:document.getElementById("btn-guardar-aciertos"),btnFinalizarRonda:document.getElementById("btn-finalizar-ronda"),btnResetRonda:document.getElementById("btn-reset-ronda"),btnVerRanking:document.getElementById("btn-ver-ranking"),rankingSection:document.getElementById("ranking-section"),rankingContent:document.getElementById("ranking-content"),loadingOverlay:document.getElementById("loading-overlay"),toast:document.getElementById("toast")},this.elements},_ensureFeedbackElements(){if(!document.getElementById("loading-overlay")){const e=document.createElement("div");e.id="loading-overlay",e.className="fixed inset-0 bg-black/75 z-50 flex flex-col items-center justify-center transition-opacity duration-300 hidden",e.innerHTML=`
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400 mb-4"></div>
        <p id="loading-text" class="text-white text-xl font-semibold tracking-wide">Cargando...</p>
      `,document.body.appendChild(e)}if(!document.getElementById("toast")){const e=document.createElement("div");e.id="toast",e.className="fixed bottom-5 right-5 z-50 max-w-md px-6 py-4 rounded-xl shadow-2xl text-white font-medium transform transition-all duration-300 translate-y-20 opacity-0 pointer-events-none flex items-center space-x-3",document.body.appendChild(e)}},get(e){return this.elements[e]||(this.elements[e]=document.getElementById(e)),this.elements[e]},showLoading(e="Procesando..."){const t=this.get("loadingOverlay");if(t){const a=document.getElementById("loading-text");a&&(a.textContent=e),t.classList.remove("hidden"),setTimeout(()=>t.classList.remove("opacity-0"),10)}},hideLoading(){const e=this.get("loadingOverlay");e&&(e.classList.add("opacity-0"),setTimeout(()=>e.classList.add("hidden"),250))},showToast(e,t="info",a=3500){const n=this.get("toast");if(!n)return;const s={success:"bg-emerald-600 border border-emerald-400",error:"bg-rose-600 border border-rose-400",warning:"bg-amber-600 border border-amber-400",info:"bg-blue-600 border border-blue-400"},o={success:"✓",error:"✕",warning:"⚠",info:"ℹ"};n.className=`fixed bottom-5 right-5 z-50 max-w-md px-6 py-4 rounded-xl shadow-2xl text-white font-medium transform transition-all duration-300 flex items-center space-x-3 ${s[t]||s.info}`,n.innerHTML=`
      <span class="text-2xl font-bold">${o[t]||"ℹ"}</span>
      <span class="flex-1">${e}</span>
    `,n.classList.remove("translate-y-20","opacity-0","pointer-events-none"),n.classList.add("translate-y-0","opacity-100"),this._toastTimer&&clearTimeout(this._toastTimer),this._toastTimer=setTimeout(()=>{n.classList.add("translate-y-20","opacity-0","pointer-events-none"),n.classList.remove("translate-y-0","opacity-100")},a)}};function Oe(e){if(!e||typeof e!="string")return"";const t=e.trim();if(t.startsWith("[")&&t.endsWith("]")||t.toLowerCase()==="file_id"||t==="")return"";const a=t.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);if(a&&a[1])return a[1];const n=t.match(/[?&]id=([a-zA-Z0-9_-]+)/);if(n&&n[1])return n[1];const s=t.match(/\/d\/([a-zA-Z0-9_-]+)/);return s&&s[1]?s[1]:(/^[a-zA-Z0-9_-]{20,60}$/.test(t),t)}function tt(e,t=v.TOTAL_RONDAS||5){const a=Number(e);return Number.isInteger(a)&&a>=1&&a<=t}function at(e){const t=Oe(e);return t?/^[a-zA-Z0-9_-]{20,60}$/.test(t):!1}function E(e){return e==null?"":String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function ne(e){return String(e||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase().replace(/[^A-Z0-9]/g,"")}const _={finalista:"bg-amber-900/70 text-amber-200 border border-amber-500",finalistaPuntaje:"bg-emerald-900/80 text-emerald-200 border border-emerald-500",finalistaEnCurso:"bg-amber-950/80 text-amber-200 border border-amber-600/70",eliminado:"bg-rose-950 text-rose-300 border border-rose-800",eliminadoRonda:"bg-red-900/80 text-red-200 border border-red-500",clasificado:"bg-emerald-900/80 text-emerald-200 border border-emerald-500",enCompetencia:"bg-blue-900/60 text-blue-200 border border-blue-400/30",activo:"bg-emerald-950 text-emerald-300 border border-emerald-800"},ot={1:"grid-cols-1",2:"grid-cols-2",3:"grid-cols-3",4:"grid-cols-4"};function Q(e){return e===!0||String(e).toLowerCase()==="true"}function pe(){const e=Number(v&&v.TOTAL_RONDAS);if(Number.isInteger(e)&&e>0)return e;const t=Object.keys(v&&v.ROUNDS||{}).map(Number).filter(a=>Number.isInteger(a)&&a>0);return t.length?Math.max(...t):1}function G(e){const t=Number(e);return Number.isInteger(t)&&t>0&&t===pe()}function nt(e){return e?Q(e.eliminado)&&G(e.rondaEliminacion)?!0:G(e.rondaMax):!1}function j(e,t){let a=[],n=[],s=[],o=1,l=!1,b=!1,c=4,g=1;if(e&&Array.isArray(e.alumnos))a=e.alumnos||[],n=Array.isArray(e.resultados)?e.resultados:Object.values(e.resultados||{}),s=Array.isArray(e.respuestasAudicion)?e.respuestasAudicion:[],o=e.rondaActual||1,l=!!e.rondaCerrada,b=!!e.soloLectura,g=e.audicionActual||1,c=(v.ROUNDS[o]||{audiciones:4}).audiciones;else{a=Array.isArray(e)?e:[],n=Array.isArray(t)?t:[];const p=r.get("selectRonda");p&&(o=parseInt(p.value,10)||1);const R=r.get("audicionNumero");R&&(g=parseInt(R.textContent,10)||1),c=(v.ROUNDS[o]||{audiciones:4}).audiciones}const u=r.get("listaAlumnos");if(!u)return;const i=G(o),d=pe(),f={},m={};if(n.forEach(p=>{const R=String(p.alumnoId);if(parseInt(p.ronda,10)===Number(o)&&(f[R]=p),Q(p.eliminado)){const $=Number(p.rondaEliminacion||p.ronda);Number.isFinite($)&&(!m[R]||$<m[R])&&(m[R]=$)}}),a=a.filter(p=>{const R=p.rondaEliminacion||m[String(p.id)],$=Number(R);return!Number.isInteger($)||$>=Number(o)}),a.length===0){const p=i?"No hay finalistas registrados en la ronda final.":"No hay participantes que hayan clasificado a esta ronda.";u.innerHTML=`
      <div class="col-span-full text-center py-8 text-blue-200">
        <p class="text-lg">${p}</p>
      </div>
    `;return}const A=(v.ROUNDS[o]||{minimoPasar:2}).minimoPasar??2,w=s.filter(p=>Number(p.ronda)===Number(o)),S=ot[Math.min(Math.max(Number(c)||1,1),4)]||"grid-cols-4";u.innerHTML=a.map(p=>{const R=f[String(p.id)],$=w.filter(L=>String(L.alumnoId)===String(p.id)),I=$.length>0?$.filter(L=>Q(L.correcto)).length:R&&parseInt(R.aciertos,10)||0,U=p.rondaEliminacion||m[String(p.id)],K=!!U&&Number(U)<Number(o),Te=R?Q(R.eliminado):!1,Ye=(K||Te)&&G(K?U:o),Je=Ce(p.nombre);let V=_.enCompetencia,Z="En competencia",Y=`En competencia en la Ronda ${o}`;Ye?(V=_.finalista,Z="🏆 Finalista",Y=`Finalista del certamen · cerró su participación en la ronda final (Ronda ${d})`):K?(V=_.eliminado,Z=`❌ Eliminado en Ronda ${U}`,Y=`Eliminado en la Ronda ${U}`):Te?(V=_.eliminadoRonda,Z=`Eliminado en Ronda ${o}`,Y=`Eliminado en la Ronda ${o}`):i?I>=A?(V=_.finalistaPuntaje,Z=`🏆 Finalista (${I}/${c})`,Y=`Finalista · puntaje en la ronda final: ${I} de ${c}`):(V=_.finalistaEnCurso,Z="🏆 Finalista · en competencia",Y=`Finalista · disputando la ronda final (Ronda ${d})`):I>=A&&(V=_.clasificado,Z=`Clasificado (${I}/${c})`,Y=`Clasificado a la siguiente ronda con ${I} aciertos`);let Le="";for(let L=1;L<=c;L++){const ie=$.find(Qe=>Number(Qe.audicionNum)===L),fe=ie&&Q(ie.correcto),xe=L===Number(g),We=b||l||K||!xe;Le+=`
        <label class="flex flex-col items-center justify-center cursor-pointer p-1 rounded-md border transition select-none ${xe?"bg-yellow-500/20 border-yellow-400 shadow ring-1 ring-yellow-400":"bg-blue-950/60 hover:bg-blue-900 border-blue-700/50"}">
          <span class="text-[10px] ${xe?"text-yellow-300 font-extrabold":"text-slate-300"} mb-0.5">Aud ${L}</span>
          <input 
            type="checkbox" 
            class="checkbox-acierto w-4 h-4 text-yellow-500 bg-blue-900 rounded border-gray-400 focus:ring-yellow-400 focus:ring-2 cursor-pointer"
            data-alumno-id="${E(p.id)}"
            data-audicion="${L}"
            ${fe?"checked":""}
            ${We?"disabled":""}
          />
          <span class="text-[8px] ${ie?fe?"text-emerald-300":"text-rose-300":"text-slate-500"}">${ie?fe?"Correcta":"Error":"Pendiente"}</span>
        </label>
      `}const Ke=i?"Aciertos Ronda Final:":`Aciertos Ronda ${o}:`,ge=$.find(L=>Number(L.audicionNum)===Number(g));return`
      <div class="alumno-card bg-slate-800/90 border border-slate-700 rounded-lg p-2.5 shadow transition hover:border-yellow-500/50 ${i?"ring-1 ring-amber-500/30":""} ${K?"opacity-40 bg-slate-950 cursor-not-allowed":""}" data-alumno-card="${E(p.id)}">
        <div class="flex items-start justify-between gap-2 mb-1.5">
          <div class="min-w-0">
            <h3 class="font-bold text-sm text-white truncate">${E(Je)}</h3>
            <p class="text-[10px] text-slate-300">${E(p.grado||"")} ${E(p.nivel||"")}</p>
          </div>
          <span class="text-[9px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${V}" title="${E(Y)}">
            ${Z}
          </span>
        </div>

        <!-- Checkboxes de audiciones -->
        <div class="mt-1.5">
          <div class="text-[10px] text-slate-400 mb-1 flex justify-between items-center">
            <span>${Ke}</span>
            <span class="font-bold text-yellow-400"><span id="aciertos-count-${p.id}">${I}</span> / ${c}</span>
          </div>
          <div class="grid ${S} gap-1">
            ${Le}
          </div>
        </div>

        <!-- Entrada rápida de respuesta de pizarra para el jurado -->
        ${K?"":`
          <div class="mt-2 pt-1.5 border-t border-slate-700/60 flex items-center gap-2">
            <span class="text-[10px] text-slate-400 whitespace-nowrap">✏️ Pizarra</span>
            <input 
              type="text" 
              placeholder="Código escrito (ej: TP2380)"
              class="input-pizarra-alumno bg-slate-950 text-yellow-300 border border-slate-700 uppercase font-mono text-[11px] px-2 py-1 rounded-md w-full focus:ring-1 focus:ring-yellow-400 focus:outline-none"
              data-alumno-id="${E(p.id)}"
              data-audicion="${g}"
              ${b||l?"disabled":""}
              value="${E((ge==null?void 0:ge.respuesta)||"")}"
            />
          </div>
        `}
      </div>
    `}).join("")}function ae(e,t){let a=[],n=1,s=1,o=!1;if(e&&e.rondaActual!==void 0)n=e.rondaActual,a=e.audicionesRonda||e.audiciones||[],s=e.audicionActual||1,o=!!e.soloLectura;else{a=Array.isArray(e)?e:[],n=1;const m=r.get("audicionNumero");m&&(s=parseInt(m.textContent,10)||1)}const l=r.get("audicionNumero");l&&(l.textContent=String(s));const b=a.find(m=>m.audicionNum===s)||a[s-1],c=document.getElementById("admin-cancion-nombre"),g=document.getElementById("admin-cancion-codigo"),u=document.getElementById("admin-seg-duracion"),i=v.ROUNDS[n]||{duracion:40,audiciones:4},d=document.getElementById("badge-rango-reproduccion");d&&(d.textContent=`📍 Rango: de 0s a ${i.duracion||40}s`),c&&(c.textContent=b?b.cancionNombre||`Composición #${b.cancionId}`:"Composición no asignada"),g&&(g.textContent=b&&b.cancionCodigo||"----"),u&&(u.textContent=String(i.duracion||40));const f=document.getElementById("ronda-info-detalles");if(f){const m=G(n),h=i.minimoPasar??2,A=m?`<span>🏆 <strong>Ronda final:</strong> mínimo ${h} aciertos</span>`:`<span>🎯 <strong>Mínimo para clasificar:</strong> ${h} aciertos</span>`,w=m?'<span class="font-bold text-amber-300">🏆 Ronda final · Finalistas</span>':"";f.innerHTML=`
      <div class="flex flex-wrap items-center justify-between text-[10px] md:text-xs bg-blue-950/70 p-2 rounded-lg border border-blue-700/60 mt-2 gap-2">
        <span>⏱ <strong>Duración:</strong> ${i.duracion||40}s por audición</span>
        ${A}
        <span>🎼 <strong>Total audiciones:</strong> ${i.audiciones||4}</span>
        ${w}
        ${o?'<span class="font-bold text-cyan-300">Consulta histórica · solo lectura</span>':""}
      </div>
    `}}function De(e){const t=r.get("rankingContent");if(!t)return;if(!e||e.length===0){t.innerHTML=`
      <div class="text-center py-6 text-slate-300">
        <p>Aún no hay puntajes registrados en el certamen.</p>
      </div>
    `;return}const a=pe(),n=st(e.filter((o,l)=>we(o,l)<=3)),s=e.map((o,l)=>{const b=we(o,l);let c=`<span class="font-bold text-slate-300">${Xe(b)}</span>`,g="hover:bg-slate-700/50";b===1?(c='<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500 text-slate-950 font-black shadow-lg">🥇 1°</span>',g="bg-yellow-500/10 hover:bg-yellow-500/20 border-l-4 border-yellow-500"):b===2?(c='<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-300 text-slate-950 font-black shadow-lg">🥈 2°</span>',g="bg-slate-300/10 hover:bg-slate-300/20 border-l-4 border-slate-300"):b===3&&(c='<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-700 text-amber-100 font-black shadow-lg">🥉 3°</span>',g="bg-amber-700/10 hover:bg-amber-700/20 border-l-4 border-amber-600");const u=Q(o.eliminado),i=u&&G(o.rondaEliminacion),d=!u&&G(o.rondaMax),f=i?"🏆 Finalista":d?"🏆 Finalista · en competencia":u?`Eliminado en Ronda ${o.rondaEliminacion||1}`:`Activo (Ronda ${o.rondaMax||1})`,m=i?_.finalista:d?_.finalistaEnCurso:u?_.eliminado:_.activo,h=i?`Finalista · cerró su participación en la ronda final (Ronda ${a})`:d?`Finalista · en competencia en la ronda final (Ronda ${a})`:u?`Eliminado en la Ronda ${o.rondaEliminacion||1}`:`Activo en la Ronda ${o.rondaMax||1}`,A=rt(o);return`
      <tr class="border-b border-slate-700/60 ${g} transition-colors">
        <td class="p-3 text-center">${c}</td>
        <td class="p-3 font-semibold text-white">
          ${E(Ce(o.nombre))}
          ${o.premio?`<span class="block text-xs text-yellow-400 font-normal">🎁 ${o.premio}</span>`:""}
        </td>
        <td class="p-3 text-slate-300 text-sm">${E(o.grado||"")} ${E(o.nivel||"")}</td>
        <td class="p-3 text-center">
          <span class="inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${m}" title="${E(h)}">
            ${f}
          </span>
        </td>
        <td class="p-3">
          <div class="flex flex-wrap gap-1">${A}</div>
        </td>
        <td class="p-3 text-right font-bold text-yellow-400 text-lg">
          ${o.puntosTotal||0}
        </td>
      </tr>
    `}).join("");t.innerHTML=`
    ${n}
    <div class="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900/80 shadow-xl mt-6">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-950 text-slate-300 text-xs uppercase tracking-wider border-b border-slate-700">
            <th class="p-3 text-center w-16">Puesto</th>
            <th class="p-3">Participante</th>
            <th class="p-3">Grado</th>
            <th class="p-3 text-center">Estado del Participante</th>
            <th class="p-3">Trayectoria por rondas</th>
            <th class="p-3 text-right">Puntos Totales</th>
          </tr>
        </thead>
        <tbody>
          ${s}
        </tbody>
      </table>
    </div>
  `}function we(e,t){const a=Number(e.posicion);return Number.isInteger(a)&&a>0?a:t+1}function rt(e){const t=e.detalleRondas||{},a=Number(e.rondaMax||0);return Array.from({length:pe()},(n,s)=>{const o=s+1,l=`ronda_${o}`,b=Object.prototype.hasOwnProperty.call(t,l),c=G(o);if(!b){if(o<=a){const f=c?"bg-amber-950 text-amber-200 ring-1 ring-amber-600/60":"bg-cyan-950 text-cyan-200",m=c?`Ronda final: llegó a la Ronda ${o}; aún no registra puntaje`:`Llegó a la Ronda ${o}; aún no registra puntaje`;return`<span class="rounded-md ${f} px-2 py-1 text-[10px]" title="${m}">${c?"🏆 ":""}R${o} en curso</span>`}return`<span class="rounded-md bg-slate-800 px-2 py-1 text-[10px] text-slate-500" title="No llegó a la Ronda ${o}">R${o} —</span>`}const g=E(t[l]),u=v.ROUNDS[o]?v.ROUNDS[o].audiciones:"?",i=c?"bg-amber-950 text-amber-200 ring-1 ring-amber-600/60":"bg-emerald-950 text-emerald-200",d=c?`Ronda final · ${g} aciertos de ${u}`:`Aciertos en Ronda ${o}`;return`<span class="rounded-md ${i} px-2 py-1 text-[10px]" title="${d}">${c?"🏆 ":""}R${o} ${g}/${u}</span>`}).join("")}function st(e){if(!e||e.length===0)return"";const t={1:{medal:"🥇",className:"border-yellow-400 bg-yellow-950/50 text-yellow-200"},2:{medal:"🥈",className:"border-slate-300 bg-slate-800/80 text-slate-200"},3:{medal:"🥉",className:"border-amber-600 bg-amber-950/50 text-amber-200"}};return`<div class="podium-container grid grid-cols-1 md:grid-cols-3 items-end gap-3 md:gap-6 my-8 px-2 max-w-4xl mx-auto">${[2,1,3].map(n=>{const s=e.filter((l,b)=>we(l,b)===n),o=t[n];return s.length===0?'<div class="min-h-24"></div>':`
      <div class="rounded-t-2xl border-2 ${o.className} p-4 text-center shadow-xl">
        <div class="mb-3 text-3xl">${o.medal} <span class="text-xl font-black">${n}°</span></div>
        <div class="space-y-3">
          ${s.map(l=>`
            <div class="rounded-xl bg-slate-950/50 p-3">
              <p class="font-extrabold text-white">${E(Ce(l.nombre))}</p>
              <p class="text-xs text-slate-300">${E(l.grado||"")}</p>
              ${nt(l)?'<p class="mt-1 text-[10px] font-bold uppercase tracking-wide text-amber-300">🏆 Finalista</p>':""}
              <p class="mt-1 font-black text-yellow-300">${Number(l.puntosTotal)||0} pts</p>
            </div>
          `).join("")}
        </div>
      </div>
    `}).join("")}</div>`}function Fe(e,t){return new Map((Array.isArray(e)?e:[]).filter(a=>Number(a.audicionNum)===Number(t)).map(a=>[String(a.alumnoId),a]))}function ze(e,t,a){if(!Array.isArray(a)||a.length===0)return!1;const n=Fe(e,t);return a.every(s=>n.has(String(s)))}function J(){const e=document.getElementById("round-timeline");if(!e)return;const t=x.get(),a=Number(t.rondaActual)||1,n=Number(t.rondaVista)||a;e.innerHTML=Object.entries(v.ROUNDS).map(([s,o])=>{const l=Number(s),b=!!v.COMPLETED_ROUNDS[l],c=l===a,g=l===a+1&&!!t.rondaCerrada,u=c||l<a&&b||g,i=l===n,d=c?b?"Ronda activa · completada":"En curso":b?"Completada · solo lectura":g?"Disponible":"Bloqueada",f=i?"border-yellow-400 bg-yellow-500/15 text-yellow-100":"border-slate-700 bg-slate-950/70 text-slate-300";return`
      <button
        type="button"
        data-round="${l}"
        aria-pressed="${i}"
        title="${o.nombre}: ${d}"
        ${u?"":"disabled"}
        class="min-w-28 rounded-lg border px-3 py-2 text-left transition ${f} ${u?"hover:border-yellow-400 cursor-pointer":"opacity-45 cursor-not-allowed"}"
      >
        <span class="block text-xs font-bold">${o.nombre}</span>
        <span class="block mt-0.5 text-[10px] opacity-80">${d}</span>
      </button>
    `}).join("")}function it(e){const t=document.getElementById("round-timeline");!t||!e||t.dataset.bound==="true"||(t.dataset.bound="true",t.addEventListener("click",a=>{const n=a.target.closest("button[data-round]");if(!n||n.disabled)return;const s=n.dataset.round;e.value!==s&&(e.value=s,e.dispatchEvent(new Event("change",{bubbles:!0})))}))}let O=!1,W=!1,N=1,F=null,q=null,B={startSec:0,endSec:40,duration:40},z=null,le=null,me=!1,re=!1;function dt(){r.init(),N=x.get().audicionActual||1,it(r.get("selectRonda")),J();const e=r.get("btnPlay");e&&e.addEventListener("click",async()=>{const i=x.get();if(X(i)||i.rondaCerrada){r.showToast("La reproducción solo está disponible en la ronda activa y abierta.","warning");return}if(O){ct();return}if(W)return;W=!0,ke(!0);const d=x.get(),f=d.rondaActual||1;let m=d.audicionesRonda||[];if(!m||m.length===0){r.showLoading("Obteniendo audición configurada...");try{m=(await y.getAudicionesRonda(f)).data||[],x.set({audicionesRonda:m})}catch(p){console.error("[AUDIO] No se pudieron cargar audiciones desde backend:",p),r.showToast("No se pudo cargar el sorteo de audiciones.","error"),W=!1,oe();return}finally{r.hideLoading()}}const h=m.find(p=>p.audicionNum===N)||m[N-1]||{};if(!h.cancionId){r.showToast("No hay un sorteo guardado para esta audición. Configura las canciones y genera el sorteo.","warning",4500),W=!1,oe();return}q=h;const A=Oe(h.driveId||h.archivoDriveId);if(!at(A)){r.showToast("La canción asignada no tiene un identificador de archivo válido.","error",4500),W=!1,oe();return}const w=document.getElementById("chk-random-start"),S=w?w.checked:!0;try{const p=`${Date.now()}-${Math.random().toString(36).slice(2,10)}`;z=p,me=!1;const R=await y.solicitarReproduccionProyector({commandId:p,ronda:f,audicionNum:N,fileId:A,randomStart:S});if(R.data&&R.data.status!=="loading")throw new Error("El proyector no aceptó la orden de reproducción.");O=!0,$e(!0),k(`⏳ Enviando audición ${N} al proyector...`),Ne(p)}catch(p){if(z)try{const R=await y.getReproduccionProyector();if(R.data&&String(R.data.commandId)===z&&["loading","countdown","playing"].includes(R.data.status)){O=!0,$e(!0),k("✅ La orden fue recibida; sincronizando con el proyector..."),Ne(z);return}}catch(R){console.error("[PROYECTOR] No se pudo confirmar la orden:",R)}console.error("[PROYECTOR] No se pudo solicitar la reproducción:",p),z=null,O=!1,k("⚠️ No se pudo iniciar la reproducción en el proyector."),r.showToast(`No se pudo iniciar la audición: ${p.message}`,"error",5e3),oe()}finally{W=!1,ke(!1)}});const t=document.getElementById("btn-prev-audicion"),a=document.getElementById("btn-next-audicion");t&&t.addEventListener("click",()=>{if(N>1){if(Ae()&&!window.confirm("Hay respuestas sin guardar. ¿Descartarlas y volver a la audición anterior?"))return;N--,Pe(N),D()}}),a&&a.addEventListener("click",()=>{const i=x.get(),d=v.ROUNDS[i.rondaActual]||{audiciones:4};if(O){r.showToast("Espera a que termine el audio antes de cambiar de audición.","warning");return}if(!je()||Ae()){r.showToast("Verifica y guarda las respuestas de esta audición antes de avanzar.","warning",4e3);return}N<d.audiciones&&(N++,Pe(N),D())});const n={AUDICION:document.getElementById("btn-modo-audicion"),CLASIFICADOS:document.getElementById("btn-modo-clasificados"),RANKING_FINAL:document.getElementById("btn-modo-ranking")};Object.entries(n).forEach(([i,d])=>{d&&d.addEventListener("click",async()=>{const f=x.get(),m=Array.from({length:v.TOTAL_RONDAS},(h,A)=>v.COMPLETED_ROUNDS[A+1]).every(Boolean);if(i==="CLASIFICADOS"&&!f.rondaCerrada){r.showToast("Finaliza la ronda actual antes de mostrar los clasificados.","warning");return}if(i==="RANKING_FINAL"&&!m){r.showToast("Finaliza todas las rondas antes de mostrar el ranking final.","warning");return}try{await y.actualizarModoProyector(i),de(i,n),r.showToast(`Proyector configurado en: ${i}`,"info",2e3)}catch(h){console.error("Error al sincronizar modo proyector:",h),r.showToast("No se pudo cambiar el modo del proyector: "+h.message,"error")}})});const s=r.get("selectRonda");s&&s.addEventListener("change",async i=>{const d=parseInt(i.target.value,10);if(!tt(d)){r.showToast("Ronda inválida","error");return}const f=x.get(),m=Number(f.rondaActual)||1,h=Number(f.rondaVista)||m;if(O){i.target.value=String(h),r.showToast("Espera a que termine el audio antes de cambiar de ronda.","warning");return}if(d<m&&!v.COMPLETED_ROUNDS[d]){i.target.value=String(h),r.showToast("Solo se pueden consultar rondas que ya fueron completadas.","warning");return}if(d>m&&(d!==m+1||!f.rondaCerrada)){i.target.value=String(h),r.showToast("Finaliza la ronda activa antes de iniciar la siguiente.","warning",4e3);return}r.showLoading(`Cargando Ronda ${d}...`);try{if(N=1,d<m){const[w,S,p]=await Promise.all([y.getAudicionesRonda(d),y.getResultados(d),y.getRespuestasRonda(d)]);x.set({rondaVista:d,rondaHistorial:{ronda:d,audicionesRonda:w.data||[],resultados:S.data||[],respuestasAudicion:p.data||[]},audicionActual:1})}else if(d===m)x.set({rondaVista:m,rondaHistorial:null,audicionActual:1});else{const[w,S,p,R]=await Promise.all([y.getAudicionesRonda(d),y.getResultados(d),y.getAlumnos(),y.getRespuestasRonda(d)]);await y.actualizarRondaActual(d),x.set({rondaActual:d,rondaVista:d,rondaHistorial:null,rondaCerrada:!!v.COMPLETED_ROUNDS[d],audicionActual:1,audicionesRonda:w.data||[],resultados:S.data||[],alumnos:p.data||[],respuestasAudicion:R.data||[]}),de("AUDICION",n)}_e(),J();const A=v.ROUNDS[d]||{duracion:40};Ie(0,A.duracion),D(),r.showToast(d<m?`Consulta de Ronda ${d} · solo lectura`:`Ronda ${d} activa`,"success")}catch(A){console.error("Error al cambiar ronda:",A),N=f.audicionActual||1,i.target.value=String(h),J(),_e(),D(),r.showToast("Error al cambiar de ronda: "+A.message,"error")}finally{r.hideLoading()}});const o=r.get("listaAlumnos");o&&(o.addEventListener("input",i=>{if(i.target&&i.target.classList.contains("input-pizarra-alumno")){const d=i.target.dataset.alumnoId,f=i.target.value.trim().toUpperCase(),h=x.get().audicionesRonda||[],A=h.find(U=>U.audicionNum===N)||h[N-1]||{},w=ne(A.cancionCodigo),S=ne(A.cancionNombre),p=[...o.querySelectorAll("[data-alumno-card]")].find(U=>U.getAttribute("data-alumno-card")===d);if(!p)return;const R=p.querySelector(`.checkbox-acierto[data-audicion="${N}"]`),$=ne(i.target.value);$!==""&&($===w||$===S)?(i.target.classList.remove("border-slate-700","border-rose-500"),i.target.classList.add("border-emerald-400","bg-emerald-950/60"),R&&!R.checked&&(R.checked=!0,he(p,d))):f===""?(i.target.classList.remove("border-emerald-400","bg-emerald-950/60","border-rose-500"),i.target.classList.add("border-slate-700"),R&&(R.checked=!1)):(i.target.classList.remove("border-emerald-400","bg-emerald-950/60","border-slate-700"),i.target.classList.add("border-rose-500"),R&&(R.checked=!1)),he(p,d),D()}}),o.addEventListener("change",i=>{if(i.target&&i.target.classList.contains("checkbox-acierto")){const d=i.target.dataset.alumnoId,f=document.querySelector(`[data-alumno-card="${d}"]`);f&&he(f,d),D()}}));const l=r.get("btnGuardarAciertos");l&&l.addEventListener("click",async()=>{const i=x.get();if(X(i)){r.showToast("Las rondas históricas son de solo lectura.","warning");return}const d=i.rondaActual||1,f=N;if(O){r.showToast("Espera a que termine el audio antes de guardar respuestas.","warning");return}const m=se(i),h=[...document.querySelectorAll("[data-alumno-card]")];let A;try{A=m.map(w=>{const S=h.find(I=>I.getAttribute("data-alumno-card")===String(w.id));if(!S)throw new Error(`No se encontró la ficha del participante ${w.id}.`);const p=S.querySelector(`.input-pizarra-alumno[data-audicion="${f}"]`),R=S.querySelector(`.checkbox-acierto[data-audicion="${f}"]`),$=p?p.value.trim():"";return{alumnoId:w.id,respuesta:$,correcto:$!==""&&!!(R&&R.checked)}})}catch(w){console.error("Error al preparar respuestas:",w),r.showToast("Error al preparar respuestas: "+w.message,"error");return}if(A.length===0){r.showToast("No hay participantes elegibles para guardar.","warning");return}r.showLoading("Guardando respuestas de esta audición...");try{await y.guardarRespuestasAudicion({ronda:d,audicionNum:f,respuestas:A});const[w,S]=await Promise.all([y.getRespuestasRonda(d),y.getResultados(d)]);x.set({respuestasAudicion:w.data||[],resultados:S.data||[]}),j(x.get()),ae(x.get()),D();const p=A.filter(R=>R.correcto).length;r.showToast(`Audición ${f} guardada: ${p} correctas y ${A.length-p} errores.`,"success",4500)}catch(w){console.error("Error al guardar respuestas:",w),r.showToast("❌ Error al guardar respuestas: "+w.message,"error")}finally{r.hideLoading()}});const b=r.get("btnFinalizarRonda");b&&b.addEventListener("click",async()=>{const i=x.get();if(X(i)){r.showToast("Selecciona la ronda activa para finalizarla.","warning");return}const d=i.rondaActual||1,f=v.ROUNDS[d]||{minimoPasar:2};if(!qe()){r.showToast("No se puede finalizar: guarda las respuestas de todas las audiciones primero.","warning",4500);return}if(window.confirm(`¿Desea FINALIZAR la Ronda ${d}?

• Mínimo exigido: ${f.minimoPasar} aciertos
• Los alumnos con menos de ${f.minimoPasar} aciertos quedarán marcados como ELIMINADOS EN RONDA ${d}.
• La ronda quedará marcada como completada y no se avanzará automáticamente.
• El proyector pasará al modo CLASIFICADOS.

¿Continuar?`)){r.showLoading("Finalizando ronda y calculando clasificación...");try{const A=(await y.finalizarRonda(d)).data||{};r.showToast(`Ronda ${d} completada: ${A.pasanCount||0} clasifican, ${A.eliminadosCount||0} eliminados`,"success",5e3);const[w,S,p]=await Promise.all([y.getResultados(d),y.getRanking(),y.getAlumnos()]);x.set({resultados:w.data||[],ranking:S.data||[],alumnos:p.data||[],rondaCerrada:!0}),v.COMPLETED_ROUNDS[d]=!0;const R=r.get("selectRonda");if(R){const I=R.querySelector(`option[value="${d}"]`);I&&(I.textContent=ue(d))}j(x.get()),D(),J(),de(d===v.TOTAL_RONDAS?"RANKING_FINAL":"CLASIFICADOS",n);const $=r.get("rankingSection");$&&!$.classList.contains("hidden")&&De(S.data||[])}catch(h){console.error("Error al finalizar ronda:",h),r.showToast("Error al finalizar ronda: "+h.message,"error")}finally{r.hideLoading()}}});const c=r.get("btnResetRonda");c&&c.addEventListener("click",async()=>{const i=x.get();if(X(i)){r.showToast("Selecciona la ronda activa antes de resetearla.","warning");return}const d=i.rondaActual||1;if(window.confirm(`⚠️ ATENCIÓN: ¿Está seguro de RESETEAR la Ronda ${d}?

Se borrarán las respuestas y resultados de la Ronda ${d} y de las rondas posteriores.`)){r.showLoading(`Reseteando datos de la Ronda ${d}...`);try{await y.resetRonda(d);for(let w=d;w<=v.TOTAL_RONDAS;w++){v.COMPLETED_ROUNDS[w]=!1;const S=r.get("selectRonda"),p=S&&S.querySelector(`option[value="${w}"]`);p&&(p.textContent=ue(w))}const[m,h,A]=await Promise.all([y.getResultados(d),y.getAlumnos(),y.getRespuestasRonda(d)]);x.set({resultados:m.data||[],alumnos:h.data||[],respuestasAudicion:A.data||[],rondaCerrada:!1}),de("AUDICION",n),j(x.get()),D(),J(),r.showToast(`Ronda ${d} ha sido reseteada correctamente`,"warning")}catch(m){console.error("Error al resetear ronda:",m),r.showToast("Error al resetear ronda: "+m.message,"error")}finally{r.hideLoading()}}});const g=r.get("btnVerRanking"),u=r.get("rankingSection");g&&u&&g.addEventListener("click",async()=>{if(u.classList.contains("hidden")){r.showLoading("Calculando tabla de posiciones y ranking...");try{const f=(await y.getRanking()).data||[];x.set({ranking:f}),De(f),u.classList.remove("hidden"),g.textContent="✕ Ocultar Ranking",g.classList.replace("bg-purple-700","bg-purple-900"),u.scrollIntoView({behavior:"smooth"})}catch(d){console.error("Error al obtener ranking:",d),r.showToast("Error al obtener ranking: "+d.message,"error")}finally{r.hideLoading()}}else u.classList.add("hidden"),g.textContent="🏆 Ver Ranking",g.classList.replace("bg-purple-900","bg-purple-700")}),D()}function Pe(e){x.set({audicionActual:e}),ae(x.get()),j(x.get());const t=x.get(),a=v.ROUNDS[t.rondaActual]||{duracion:40};Ie(0,a.duracion)}function X(e=x.get()){return Number(e.rondaVista||e.rondaActual)!==Number(e.rondaActual)}function lt(e=x.get()){if(!X(e))return{...e,soloLectura:!1};const t=e.rondaHistorial;return!t||Number(t.ronda)!==Number(e.rondaVista)?{...e,soloLectura:!0}:{...e,rondaActual:Number(t.ronda),audicionesRonda:t.audicionesRonda,resultados:t.resultados,respuestasAudicion:t.respuestasAudicion,rondaCerrada:!0,audicionActual:N,soloLectura:!0}}function _e(){const e=lt();ae(e),j(e)}function se(e=x.get()){const t=Number(e.rondaActual)||1;return(e.alumnos||[]).filter(a=>{const n=Number(a.rondaEliminacion);return Number.isInteger(n)&&n>0?n>=t:!a.eliminado})}function je(e=x.get()){const t=se(e);return ze(e.respuestasAudicion,N,t.map(a=>a.id))}function Ae(e=x.get()){const t=Fe(e.respuestasAudicion,N),a=[...document.querySelectorAll("[data-alumno-card]")];return se(e).some(n=>{const s=a.find(i=>i.getAttribute("data-alumno-card")===String(n.id));if(!s)return!1;const o=s.querySelector(`.input-pizarra-alumno[data-audicion="${N}"]`),l=s.querySelector(`.checkbox-acierto[data-audicion="${N}"]`),b=o?o.value.trim():"",c=!!(l&&l.checked),g=t.get(String(n.id));if(!g)return b!==""||c;const u=g.correcto===!0||String(g.correcto).toLowerCase()==="true";return ne(b)!==ne(g.respuesta)||c!==u})}function qe(e=x.get()){const t=v.ROUNDS[e.rondaActual];if(!t)return!1;const a=se(e).map(n=>n.id);return a.length===0?!1:Array.from({length:t.audiciones},(n,s)=>s+1).every(n=>ze(e.respuestasAudicion,n,a))}function D(){const e=x.get(),t=X(e),a=Number(t?e.rondaVista:e.rondaActual),n=v.ROUNDS[a];if(!n)return;const s=r.get("btnPlay"),o=document.getElementById("btn-prev-audicion"),l=document.getElementById("btn-next-audicion"),b=r.get("btnGuardarAciertos"),c=r.get("btnFinalizarRonda"),g=r.get("btnResetRonda"),u=document.getElementById("audicion-estado-guardado");if(t){s&&(s.disabled=!0),o&&(o.disabled=!0),l&&(l.disabled=!0),b&&(b.disabled=!0),c&&(c.disabled=!0),g&&(g.disabled=!0),u&&(u.textContent=`Consulta de Ronda ${a} · solo lectura`,u.className="text-xs mb-3 text-cyan-300");return}const i=je(e),d=Ae(e),f=qe(e),m=!!e.rondaCerrada;if(s&&!O&&(s.disabled=m),g&&(g.disabled=!1),o&&(o.disabled=m||O||N<=1),l){const h=!m&&i&&!d&&!O&&N<n.audiciones;l.disabled=!h,l.textContent=N<n.audiciones?"Siguiente ▶":"Última audición"}b&&(b.disabled=m||O||se(e).length===0),c&&(c.disabled=m||O||!f),u&&(m?u.textContent="Ronda finalizada":O?u.textContent="Audio en curso":d?u.textContent="Hay cambios sin guardar":i?u.textContent=`Respuestas de la audición ${N} guardadas`:u.textContent=`Audición ${N} pendiente de guardar`,u.className=`text-xs mb-3 ${m||i&&!d?"text-emerald-300":"text-amber-300"}`)}function Ie(e,t){const a=document.getElementById("badge-rango-reproduccion");a&&(a.textContent=`📍 Rango: de ${e}s a ${t}s`)}function he(e,t){const a=e.querySelectorAll(".checkbox-acierto:checked").length,n=document.getElementById(`aciertos-count-${t}`);n&&(n.textContent=a);const s=x.get(),o=v.ROUNDS[s.rondaActual]||{minimoPasar:2},l=e.querySelector("span.rounded-full");l&&!l.textContent.includes("Eliminado")&&(a>=o.minimoPasar?(l.className="text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-900/80 text-emerald-200 border border-emerald-500",l.textContent=`Clasificado (${a})`):(l.className="text-xs px-2.5 py-1 rounded-full font-medium bg-blue-900/60 text-blue-200 border border-blue-400/30",l.textContent="En competencia"))}function de(e,t){Object.entries(t).forEach(([a,n])=>{n&&(a===e?n.className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition border border-yellow-500 bg-yellow-500 text-slate-950 cursor-pointer shadow":n.className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition border border-slate-700 bg-slate-800 text-slate-300 hover:text-white cursor-pointer")})}function k(e){const t=document.getElementById("admin-audio-cache-status");t&&(t.textContent=e)}function Ne(e){z===e&&y.getReproduccionProyector().then(t=>{const a=t.data;if(!(!a||String(a.commandId)!==e)){if(a.stopRequested&&["loading","countdown","playing"].includes(a.status))re=!0,k("⏳ El proyector está deteniendo la audición...");else if(a.status==="loading")k(`⏳ El proyector está cargando la audición ${a.audicionNum}...`);else if(a.status==="countdown")Ee(a),Ie(B.startSec,B.endSec),k("✅ Archivo cargado en el proyector. Cuenta regresiva de 5 segundos...");else if(a.status==="playing"){if(Ee(a),!me){me=!0;const n=Date.parse(a.startedAt);F=Number.isFinite(n)?new Date(n):new Date,ut()}k("🔊 Audición reproduciéndose desde el proyector.")}else if(a.status==="completed"){ve(!0,a),ye(),r.showToast(`Audición ${N} finalizada. Verifica y guarda las respuestas.`,"info",3e3),D();return}else if(a.status==="error"){ve(!1,a),ye(),k(`⚠️ Error en el proyector: ${a.error||"no se pudo reproducir el audio."}`),r.showToast(`Error de reproducción en el proyector: ${a.error||"audio no disponible."}`,"error",5e3);return}else if(a.status==="cancelled"){ve(!1,a),ye(),k("Audición detenida."),D();return}}}).catch(t=>{console.warn("[PROYECTOR] No se pudo consultar el estado:",t),k("⚠️ Sin conexión con el proyector; intentando sincronizar...")}).finally(()=>{z===e&&(le=setTimeout(()=>Ne(e),500))})}function ct(){const e=z;if(!e||re)return;re=!0;const t=r.get("btnPlay");t&&(t.disabled=!0,t.textContent="⏳ Deteniendo en el proyector..."),k("⏳ Enviando orden de detención al proyector..."),y.actualizarReproduccionProyector({commandId:e,status:"stopRequested"}).catch(a=>{console.error("[PROYECTOR] No se pudo solicitar la detención:",a),re=!1,$e(),r.showToast("No se pudo detener la reproducción en el proyector.","error",4500)})}function ye(){le&&clearTimeout(le),le=null,z=null,me=!1,re=!1,F=null,oe()}function Ee(e){const t=Number(e.startSec),a=Number(e.endSec),n=Number(e.playedDuration!==void 0?e.playedDuration:e.duration),s=Number.isFinite(t)?t:B.startSec,o=Number.isFinite(n)?n:B.duration;B={startSec:s,endSec:Number.isFinite(a)?a:s+o,duration:o}}function ve(e,t){if(t&&t.startedAt&&!F){const u=Date.parse(t.startedAt);Number.isFinite(u)&&(F=new Date(u))}if(!F&&t){const u=Number(t.playedDuration),i=Date.parse(t.completedAt||"");Number.isFinite(u)&&u>0&&Number.isFinite(i)&&(F=new Date(i-u*1e3))}if(!F||!q)return;const n=x.get().rondaActual||1,s=v.ROUNDS[n]||{duracion:40};Ee(t||{});const o=B.startSec,l=Number.isFinite(Number(B.endSec))?Number(B.endSec):o+(e?s.duracion:0),b=Math.max(0,l-o),c=document.getElementById("admin-log-message"),g=document.getElementById("admin-log-range");g&&(g.textContent=`de ${o}s a ${l}s`),c&&(c.textContent="⏳ Audición finalizada. Guardando registro en la base de datos..."),y.registrarReproduccion({ronda:n,audicionNum:N,cancionId:q.cancionId||"",cancionNombre:q.cancionNombre||"",cancionCodigo:q.cancionCodigo||"",segundoInicio:o,segundoFin:l,duracion:b}).then(u=>{console.log("[AUDITORIA] Registrado en la base de datos:",u.data),c&&u.data&&(c.textContent=`✅ Registrado en la base de datos: de ${o}s a ${l}s (${b}s) a las ${u.data.fechaHora.split(" ")[1]}`)}).catch(u=>{console.warn("[AUDITORIA ERROR]",u),c&&(c.textContent="⚠️ No se pudo guardar el registro de reproducción en la base de datos.")}),F=null}function ut(){const e=document.getElementById("admin-log-message");if(!e||!q)return;const t=x.get(),a=Number(B.startSec)||0,n=Number(B.endSec)||a,s=new Intl.DateTimeFormat("es-PE",{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(F||new Date),o=q.cancionNombre||`Composición #${q.cancionId}`,l=document.getElementById("admin-log-range");l&&(l.textContent=`de ${a}s a ${n}s`),e.textContent=`⏱ Reproducción iniciada: ${o} · Ronda ${t.rondaActual||1}, audición ${N} · de ${a}s a ${n}s · ${s}. Se guardará en la base de datos al finalizar.`}function ke(e){const t=r.get("btnPlay");t&&e&&(t.disabled=!0,t.textContent="⏳ Cargando audio...",t.className="bg-yellow-600 text-white text-xl md:text-2xl px-10 py-4 rounded-xl shadow-lg cursor-not-allowed opacity-80")}function $e(e){const t=r.get("btnPlay");t&&(t.disabled=!1,t.textContent="⏹ DETENER AUDICIÓN",t.className="bg-red-600 hover:bg-red-700 text-white text-xl md:text-2xl font-black px-10 py-4 rounded-xl shadow-xl transition animate-pulse cursor-pointer",document.body.classList.add("is-playing"))}function oe(){O=!1,document.body.classList.remove("is-playing");const e=r.get("btnPlay");e&&(e.disabled=!1,e.textContent="▶ REPRODUCIR AUDICIÓN",e.className="bg-emerald-600 hover:bg-emerald-500 text-white text-xl md:text-2xl font-black px-10 py-4 rounded-xl shadow-xl transition transform active:scale-95 inline-flex items-center space-x-3 cursor-pointer")}let H=null,He="rondas",P=[],M=[],be=[],T=[],C={},ee=[],te=[];function mt(){Ge();const e=document.getElementById("btn-abrir-config");e&&e.addEventListener("click",bt)}function Ge(){if(document.getElementById("modal-configuracion"))return;const e=document.createElement("div");e.id="modal-configuracion",e.className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 transition-opacity duration-300 hidden opacity-0",e.innerHTML=`
    <div class="bg-slate-900 border border-yellow-500/50 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in text-white">
      
      <!-- Header del Panel -->
      <div class="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 p-4 md:p-5 border-b border-slate-800 flex justify-between items-center">
        <div class="flex items-center space-x-3">
          <span class="text-3xl">⚙️</span>
          <div>
            <h2 class="text-xl md:text-2xl font-black text-yellow-400 font-display">
              Panel de Configuración del Certamen
            </h2>
            <p class="text-xs text-slate-300">
              Personaliza el sorteo de canciones, participantes, rondas y parámetros
            </p>
          </div>
        </div>
        <button id="btn-cerrar-config" class="text-slate-400 hover:text-white text-2xl font-black px-3 py-1 rounded-lg hover:bg-slate-800 transition cursor-pointer">
          ✕
        </button>
      </div>

      <!-- Barra de Pestañas / Tabs -->
      <div class="flex border-b border-slate-800 bg-slate-950/70 overflow-x-auto text-xs md:text-sm font-bold">
        <button class="tab-btn px-4 py-3 border-b-2 border-yellow-400 text-yellow-300 flex items-center space-x-2 whitespace-nowrap cursor-pointer" data-tab="rondas">
          <span>1️⃣</span>
          <span>Rondas y reglas</span>
        </button>
        <button class="tab-btn px-4 py-3 border-b-2 border-transparent text-slate-400 hover:text-white flex items-center space-x-2 whitespace-nowrap cursor-pointer" data-tab="canciones">
          <span>🎵</span>
          <span>2. Canciones</span>
        </button>
        <button class="tab-btn px-4 py-3 border-b-2 border-transparent text-slate-400 hover:text-white flex items-center space-x-2 whitespace-nowrap cursor-pointer" data-tab="sorteo">
          <span>3️⃣</span>
          <span>Sorteo de canciones</span>
        </button>
        <button class="tab-btn px-4 py-3 border-b-2 border-transparent text-slate-400 hover:text-white flex items-center space-x-2 whitespace-nowrap cursor-pointer" data-tab="participantes">
          <span>👥</span>
          <span>Participantes</span>
        </button>
      </div>

      <!-- Contenedor del Cuerpo de la Pestaña -->
      <div id="config-tab-content" class="p-4 md:p-6 overflow-y-auto flex-1 text-sm">
        <!-- Render dinámico según tab -->
      </div>

      <!-- Footer del Modal -->
      <div class="bg-slate-950 p-3 md:p-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
        <span>💡 Todos los cambios se sincronizan con la base de datos</span>
        <button id="btn-cerrar-config-footer" class="bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-2 rounded-xl transition cursor-pointer">
          Cerrar
        </button>
      </div>

    </div>
  `,document.body.appendChild(e),H=e,e.querySelector("#btn-cerrar-config").addEventListener("click",Me),e.querySelector("#btn-cerrar-config-footer").addEventListener("click",Me),e.querySelectorAll(".tab-btn").forEach(t=>{t.addEventListener("click",a=>{const n=a.currentTarget.dataset.tab;pt(n)})})}async function bt(){H||Ge(),r.showLoading("Cargando configuraciones...");try{const[e,t,a,n,s]=await Promise.all([y.getConfig(),y.getCanciones(),y.getAlumnos(),y.getResultados(),y.getRespuestasRonda()]);C=e.data||{},v.syncFromBackend(C),P=t.data||[],T=a.data||[],te=n.data||[],ee=s.data||[];const o=Array.from({length:v.TOTAL_RONDAS},(b,c)=>c+1);M=(await Promise.all(o.map(b=>y.getAudicionesRonda(b)))).flatMap(b=>b.data||[]),be=[...M],H.classList.remove("hidden"),setTimeout(()=>H.classList.remove("opacity-0"),10),Ve()}catch(e){console.error("Error al abrir configuración:",e),r.showToast("Error al cargar datos de configuración","error")}finally{r.hideLoading()}}function Me(){H&&(H.classList.add("opacity-0"),setTimeout(()=>H.classList.add("hidden"),250))}function pt(e){He=e,H.querySelectorAll(".tab-btn").forEach(t=>{t.dataset.tab===e?t.className="tab-btn px-4 py-3 border-b-2 border-yellow-400 text-yellow-300 flex items-center space-x-2 whitespace-nowrap cursor-pointer":t.className="tab-btn px-4 py-3 border-b-2 border-transparent text-slate-400 hover:text-white flex items-center space-x-2 whitespace-nowrap cursor-pointer"}),Ve()}function Ve(){const e=document.getElementById("config-tab-content");if(e)switch(He){case"rondas":Ze(e);break;case"canciones":Se(e);break;case"sorteo":gt(e);break;case"participantes":ce(e);break}}function gt(e){const t=P.filter(n=>n.activa!==!1),a=Object.values(v.ROUNDS).reduce((n,s)=>n+s.audiciones,0);e.innerHTML=`
    <div class="space-y-4">
      <div class="bg-blue-950/60 border border-blue-800 p-4 rounded-xl">
        <h3 class="font-bold text-base text-yellow-300 flex items-center gap-2">
          <span>🎲</span> Sorteo Aleatorio de Repertorio por Rondas
        </h3>
        <p class="text-xs text-slate-300 mt-1">
          Distribuye las canciones activas entre las ${v.TOTAL_RONDAS} rondas. No se repite una obra dentro de la misma ronda; puede volver a aparecer en otra ronda.
        </p>
        <div class="mt-3 flex flex-wrap gap-3">
          <button id="btn-generar-sorteo" class="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black px-5 py-2.5 rounded-xl shadow-lg transition flex items-center space-x-2 cursor-pointer">
            <span>🎲</span>
            <span>Generar Nuevo Sorteo Aleatorio</span>
          </button>
          <button id="btn-guardar-sorteo" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg transition flex items-center space-x-2 cursor-pointer">
            <span>💾</span>
            <span>Guardar sorteo en la base de datos</span>
          </button>
        </div>
      </div>

      <div class="text-xs text-slate-400 flex items-center justify-between">
        <span>Canciones activas para el sorteo: <strong class="text-white">${t.length}</strong></span>
        <span>Total audiciones programadas: <strong class="text-white">${M.length||a}</strong></span>
      </div>

      <!-- Tabla previa del sorteo -->
      <div class="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 max-h-[50vh]">
        <table class="w-full text-left text-xs md:text-sm">
          <thead>
            <tr class="bg-slate-950 text-slate-400 uppercase text-xs border-b border-slate-800">
              <th class="p-2.5 text-center w-16">Ronda</th>
              <th class="p-2.5 text-center w-20">Audición</th>
              <th class="p-2.5">Obra Asignada</th>
              <th class="p-2.5 text-center w-28">Código</th>
              <th class="p-2.5 text-center w-24">Duración</th>
            </tr>
          </thead>
          <tbody id="sorteo-preview-body">
            ${Be(M)}
          </tbody>
        </table>
      </div>
    </div>
  `,e.querySelector("#btn-generar-sorteo").addEventListener("click",()=>{if(t.length===0){r.showToast("No hay canciones activas para sortear","error");return}const n=[];let s=1;for(let o=1;o<=v.TOTAL_RONDAS;o++){const l=v.ROUNDS[o].audiciones;if(l>t.length){r.showToast(`La Ronda ${o} requiere ${l} canciones distintas, pero solo hay ${t.length} activas.`,"error",5e3);return}const b=ft(t);for(let c=1;c<=l;c++){const g=b[c-1];n.push({ronda:o,audicionNum:c,cancionId:g.id,cancionNombre:g.nombre,cancionCodigo:g.codigo,orden:s++})}}M=n,e.querySelector("#sorteo-preview-body").innerHTML=Be(n),r.showToast("¡Nuevo sorteo aleatorio generado con éxito!","success",2500)}),e.querySelector("#btn-guardar-sorteo").addEventListener("click",async()=>{if(M.length===0){r.showToast("Genera un sorteo antes de guardar","warning");return}const n=!xt(be,M),s=te.length>0||ee.length>0,o=n&&s;if(!(o&&!window.confirm("El sorteo actual ya tiene respuestas o resultados. Si guardas este nuevo sorteo, se borrarán los resultados y respuestas de todas las rondas. ¿Continuar?"))){r.showLoading("Guardando orden de audiciones en la base de datos...");try{const l=await y.guardarAudicionesRonda(M,o),b=!!(l.data&&l.data.reinicioRealizado),c=x.get(),g=b?1:c.rondaActual||1,[u,i,d]=await Promise.all([y.getAudicionesRonda(g),y.getResultados(),y.getRespuestasRonda(g)]);te=i.data||[],ee=d.data||[],be=[...M],x.set({rondaActual:g,rondaCerrada:b?!1:!!c.rondaCerrada,audicionActual:1,audicionesRonda:u.data||[],resultados:te.filter(m=>Number(m.ronda)===g),respuestasAudicion:ee});const f=document.getElementById("select-ronda");f&&(f.value=String(g)),ae(x.get()),j(x.get()),r.showToast("✅ Sorteo de canciones guardado correctamente en la nube","success")}catch(l){console.error("Error al guardar sorteo:",l),r.showToast("Error al guardar sorteo: "+l.message,"error")}finally{r.hideLoading()}}})}function Be(e){return!e||e.length===0?'<tr><td colspan="5" class="p-4 text-center text-slate-500">No hay sorteo cargado. Pulsa "Generar Nuevo Sorteo Aleatorio".</td></tr>':e.map(t=>{var a;return`
    <tr class="border-b border-slate-800/80 hover:bg-slate-800/40">
      <td class="p-2.5 text-center font-bold text-yellow-400">R${t.ronda}</td>
      <td class="p-2.5 text-center text-slate-300">Aud ${t.audicionNum}</td>
      <td class="p-2.5 font-semibold text-white">${E(t.cancionNombre||`Composición #${t.cancionId}`)}</td>
      <td class="p-2.5 text-center font-mono font-bold text-yellow-300">${E(t.cancionCodigo||"----")}</td>
      <td class="p-2.5 text-center text-slate-400">${((a=v.ROUNDS[t.ronda])==null?void 0:a.duracion)||0}s</td>
    </tr>
  `}).join("")}function ft(e){const t=[...e];for(let a=t.length-1;a>0;a--){const n=Math.floor(Math.random()*(a+1));[t[a],t[n]]=[t[n],t[a]]}return t}function xt(e,t){if(e.length!==t.length)return!1;const a=new Map(e.map(n=>[`${n.ronda}:${n.audicionNum}`,String(n.cancionId)]));return t.every(n=>a.get(`${n.ronda}:${n.audicionNum}`)===String(n.cancionId))}function Se(e){e.innerHTML=`
    <div class="space-y-4">
      
      <!-- Formulario para Agregar Canción -->
      <div class="bg-blue-950/60 border border-blue-800 p-4 rounded-xl">
        <h3 class="font-bold text-sm text-yellow-300 mb-2">➕ Agregar Nueva Composición de Strauss</h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input type="text" id="add-cancion-nombre" placeholder="Nombre (ej: SANGRE VIENESA)" class="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white uppercase focus:ring-1 focus:ring-yellow-400 focus:outline-none">
          <input type="text" id="add-cancion-codigo" placeholder="Código (ej: SV1200)" class="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white uppercase font-mono focus:ring-1 focus:ring-yellow-400 focus:outline-none">
          <input type="text" id="add-cancion-drive" placeholder="ID de archivo o enlace" class="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:ring-1 focus:ring-yellow-400 focus:outline-none">
        </div>
        <div class="mt-2.5 flex justify-end">
          <button id="btn-add-cancion" class="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs shadow transition cursor-pointer">
            + Agregar a la Lista
          </button>
        </div>
      </div>

      <div class="flex justify-between items-center text-xs">
        <span class="text-slate-400">Total canciones en repertorio: <strong class="text-white">${P.length}</strong></span>
        <button id="btn-guardar-todas-canciones" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow transition cursor-pointer">
          💾 Guardar canciones en la base de datos
        </button>
      </div>

      <!-- Tabla de Canciones -->
      <div class="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 max-h-[45vh]">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-slate-950 text-slate-400 uppercase border-b border-slate-800">
              <th class="p-2.5 text-center w-12">ID</th>
              <th class="p-2.5">Título de la Obra</th>
              <th class="p-2.5 text-center w-24">Código</th>
              <th class="p-2.5">ID de archivo</th>
              <th class="p-2.5 text-center w-16">Acción</th>
            </tr>
          </thead>
          <tbody id="canciones-list-body">
            ${P.map((t,a)=>`
              <tr class="border-b border-slate-800/80 hover:bg-slate-800/30">
                <td class="p-2.5 text-center font-bold text-yellow-400">${t.id||a+1}</td>
                <td class="p-2.5 font-semibold text-white">${t.nombre||""}</td>
                <td class="p-2.5 text-center font-mono font-bold text-yellow-300">${t.codigo||""}</td>
                <td class="p-2.5 font-mono text-slate-400 truncate max-w-xs">${t.driveId||t.archivoDriveId||'<span class="text-amber-500">Sin ID</span>'}</td>
                <td class="p-2.5 text-center">
                  <button class="btn-eliminar-cancion text-rose-400 hover:text-rose-300 font-bold px-2 py-1 rounded hover:bg-rose-950/50 transition cursor-pointer" data-id="${t.id}">
                    🗑
                  </button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

    </div>
  `,e.querySelector("#btn-add-cancion").addEventListener("click",()=>{const t=e.querySelector("#add-cancion-nombre").value.trim(),a=e.querySelector("#add-cancion-codigo").value.trim(),n=e.querySelector("#add-cancion-drive").value.trim(),s=Oe(n);if(!t){r.showToast("Ingresa el nombre de la obra","warning");return}const o=P.length>0?Math.max(...P.map(l=>Number(l.id)||0))+1:1;P.push({id:o,nombre:t.toUpperCase(),codigo:a.toUpperCase()||`ST${o.toString().padStart(4,"0")}`,driveId:s,archivoDriveId:s,anio:2026,activa:!0}),Se(e),r.showToast(`Obra "${t}" agregada a la lista`,"info",2e3)}),e.querySelectorAll(".btn-eliminar-cancion").forEach(t=>{t.addEventListener("click",a=>{const n=a.currentTarget.dataset.id;P=P.filter(s=>String(s.id)!==String(n)),Se(e)})}),e.querySelector("#btn-guardar-todas-canciones").addEventListener("click",async()=>{r.showLoading("Guardando lista de canciones en la base de datos...");try{await y.guardarCanciones(P),x.set({canciones:P}),r.showToast("✅ Lista de canciones guardada exitosamente en la nube","success")}catch(t){r.showToast("Error al guardar canciones: "+t.message,"error")}finally{r.hideLoading()}})}function ce(e){e.innerHTML=`
    <div class="space-y-4">
      
      <!-- Sección de Carga Masiva -->
      <div class="bg-blue-950/60 border border-blue-800 p-4 rounded-xl">
        <h3 class="font-bold text-sm text-yellow-300 flex items-center gap-2">
          <span>📥</span> Carga Masiva de Alumnos (Pega desde Excel o texto)
        </h3>
        <p class="text-xs text-slate-300 mt-1">
          Pega los participantes directamente en formato: <strong>Nombre, Grado, Nivel</strong> (uno por línea o tabulado desde Excel).
        </p>
        <textarea 
          id="textarea-alumnos-masivo" 
          rows="4" 
          placeholder="Ejemplo:&#10;Valeria Sánchez, 5to, Primaria&#10;Mateo Quispe, 6to, Primaria&#10;Camila Flores, 1ro, Secundaria"
          class="w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono focus:ring-1 focus:ring-yellow-400 focus:outline-none"
        ></textarea>
        
        <div class="mt-3 flex flex-wrap justify-between items-center gap-2">
          <label class="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
            <input type="checkbox" id="chk-reemplazar-alumnos" class="w-4 h-4 text-yellow-500 rounded bg-slate-900 border-slate-700">
            <span>Reemplazar toda la lista actual</span>
          </label>
          <div class="flex gap-2">
            <button id="btn-importar-masivo" class="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow transition cursor-pointer">
              📥 Importar Alumnos
            </button>
            <button id="btn-vaciar-alumnos" class="bg-rose-800 hover:bg-rose-700 text-white font-bold px-3 py-2 rounded-xl text-xs transition cursor-pointer">
              🗑 Vaciar Lista
            </button>
          </div>
        </div>
      </div>

      <div class="flex justify-between items-center text-xs">
        <span class="text-slate-400">Total participantes registrados: <strong class="text-white">${T.length}</strong></span>
        <button id="btn-guardar-alumnos-cloud" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow transition cursor-pointer">
          💾 Guardar participantes en la base de datos
        </button>
      </div>

      <!-- Tabla de Participantes -->
      <div class="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 max-h-[42vh]">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-slate-950 text-slate-400 uppercase border-b border-slate-800">
              <th class="p-2.5 text-center w-12">ID</th>
              <th class="p-2.5">Nombre Completo</th>
              <th class="p-2.5">Grado</th>
              <th class="p-2.5">Nivel</th>
              <th class="p-2.5 text-center w-16">Acción</th>
            </tr>
          </thead>
          <tbody id="alumnos-list-body">
            ${T.map((t,a)=>`
              <tr class="border-b border-slate-800/80 hover:bg-slate-800/30">
                <td class="p-2.5 text-center font-bold text-yellow-400">${t.id||a+1}</td>
                <td class="p-2.5 font-semibold text-white">${t.nombre||""}</td>
                <td class="p-2.5 text-slate-300">${t.grado||""}</td>
                <td class="p-2.5 text-slate-400">${t.nivel||""}</td>
                <td class="p-2.5 text-center">
                  <button class="btn-eliminar-alumno text-rose-400 hover:text-rose-300 font-bold px-2 py-1 rounded hover:bg-rose-950/50 transition cursor-pointer" data-id="${t.id}">
                    🗑
                  </button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

    </div>
  `,e.querySelector("#btn-importar-masivo").addEventListener("click",()=>{const t=e.querySelector("#textarea-alumnos-masivo").value.trim();if(!t){r.showToast("Pega al menos una línea con datos de alumnos","warning");return}const a=e.querySelector("#chk-reemplazar-alumnos").checked,n=t.split(`
`),s=[];let o=a?1:T.length>0?Math.max(...T.map(l=>Number(l.id)||0))+1:1;n.forEach(l=>{const b=l.trim();if(!b)return;const c=b.includes("	")?b.split("	"):b.split(","),g=(c[0]||"").trim(),u=(c[1]||"").trim(),i=(c[2]||"").trim();g&&s.push({id:o++,nombre:g,grado:u||"",nivel:i||"",anio:2026,activo:!0})}),a?T=s:T=[...T,...s],ce(e),r.showToast(`Se procesaron ${s.length} participantes`,"success")}),e.querySelector("#btn-vaciar-alumnos").addEventListener("click",()=>{confirm("¿Deseas vaciar la lista temporal de participantes?")&&(T=[],ce(e))}),e.querySelectorAll(".btn-eliminar-alumno").forEach(t=>{t.addEventListener("click",a=>{const n=a.currentTarget.dataset.id;T=T.filter(s=>String(s.id)!==String(n)),ce(e)})}),e.querySelector("#btn-guardar-alumnos-cloud").addEventListener("click",async()=>{r.showLoading("Guardando participantes en la base de datos...");try{await y.guardarAlumnosLote(T,!0),x.set({alumnos:T}),j(x.get()),r.showToast("✅ Participantes guardados exitosamente en la nube","success")}catch(t){r.showToast("Error al guardar participantes: "+t.message,"error")}finally{r.hideLoading()}})}function Ze(e){const t=C,a=Number(t.TOTAL_RONDAS)||v.TOTAL_RONDAS,n=Array.from({length:a},(s,o)=>o+1);e.innerHTML=`
    <div class="space-y-4">
      
      <div class="bg-yellow-950/30 border border-yellow-500/40 p-4 rounded-xl">
        <h3 class="font-bold text-base text-yellow-300">Paso 1: definir las rondas</h3>
        <p class="text-xs text-slate-300 mt-1">Configura primero cuántas rondas habrá y, para cada una, cuántas audiciones, cuánto dura cada fragmento y cuántos aciertos se necesitan para clasificar.</p>
        <div class="mt-3 max-w-xs">
          <label class="block text-xs text-slate-300 mb-1" for="cfg-total-rondas">Cantidad total de rondas (1–20):</label>
          <input type="number" id="cfg-total-rondas" min="1" max="20" step="1" value="${a}" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white">
        </div>
      </div>

      <!-- Datos Generales del Evento -->
      <div class="bg-blue-950/60 border border-blue-800 p-4 rounded-xl">
        <h3 class="font-bold text-sm text-yellow-300 mb-3">🏛 Datos Oficiales del Evento</h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="block text-xs text-slate-300 mb-1">Nombre Oficial del Evento:</label>
            <input type="text" id="cfg-nombre-evento" value="${E(t.NOMBRE_EVENTO||"Certamen Audición Musical 2026")}" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white">
          </div>
          <div>
            <label class="block text-xs text-slate-300 mb-1">Compositor Homenajeado:</label>
            <input type="text" id="cfg-homenajeado" value="${E(t.HOMENAJEADO||"Johann Strauss")}" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white">
          </div>
          <div>
            <label class="block text-xs text-slate-300 mb-1">Año del Certamen:</label>
            <input type="number" id="cfg-anio" min="2000" max="2100" value="${Number(t.ANIO_CERTAMEN)||2026}" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white">
          </div>
        </div>
      </div>

      <!-- Configuración dinámica de rondas -->
      <div class="bg-blue-950/60 border border-blue-800 p-4 rounded-xl">
        <h3 class="font-bold text-sm text-yellow-300 mb-2">⏱ Parámetros por ronda</h3>
        <p class="text-xs text-slate-400 mb-3">Configura los puntos por cada acierto y el bonus único al alcanzar el mínimo para clasificar (en la final, para ganar).</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          ${n.map(s=>{const o=Re(s,a),l=v.ROUNDS[s]||{duracion:Math.max(2,Math.round(40/Math.pow(2,s-1))),audiciones:s<=2?4:3,minimoPasar:s===a?3:2,puntosPorAcierto:1,bonusClasificar:0},b=Number(t[`DURACION_RONDA_${o}`]??t[`DURACION_RONDA_${s}`]??l.duracion),c=Number(t[`NUM_AUDICIONES_RONDA_${o}`]??t[`NUM_AUDICIONES_RONDA_${s}`]??l.audiciones),g=Number(t[`MINIMO_PASAR_RONDA_${o}`]??t[`MINIMO_PASAR_RONDA_${s}`]??l.minimoPasar),u=Number(t[`PUNTOS_POR_ACIERTO_RONDA_${o}`]??t[`PUNTOS_POR_ACIERTO_RONDA_${s}`]??l.puntosPorAcierto),i=Number(t[`BONUS_POR_CLASIFICAR_RONDA_${o}`]??t[`BONUS_POR_CLASIFICAR_RONDA_${s}`]??l.bonusClasificar);return`
              <div class="bg-slate-900/90 border border-slate-700 p-3 rounded-xl space-y-2">
                <span class="font-bold text-yellow-400 block text-center border-b border-slate-700 pb-1">
                  ${s===a?"Ronda Final":`Ronda ${s}`}
                </span>
                <div>
                  <label class="text-[10px] text-slate-400 block">Duración (seg):</label>
                  <input type="number" id="cfg-dur-${s}" min="1" max="3600" step="1" value="${b}" class="w-full bg-slate-950 border border-slate-700 rounded p-1 text-center font-bold text-white">
                </div>
                <div>
                  <label class="text-[10px] text-slate-400 block">Audiciones:</label>
                  <input type="number" id="cfg-aud-${s}" min="1" max="100" step="1" value="${c}" class="w-full bg-slate-950 border border-slate-700 rounded p-1 text-center font-bold text-white">
                </div>
                <div>
                  <label class="text-[10px] text-slate-400 block">Mínimo clasificar:</label>
                  <input type="number" id="cfg-min-${s}" min="1" max="${c}" step="1" value="${g}" class="w-full bg-slate-950 border border-slate-700 rounded p-1 text-center font-bold text-yellow-300">
                </div>
                <div>
                  <label class="text-[10px] text-slate-400 block">Puntos por acierto:</label>
                  <input type="number" id="cfg-puntos-${s}" min="0" max="10000" step="1" value="${u}" class="w-full bg-slate-950 border border-slate-700 rounded p-1 text-center font-bold text-emerald-300">
                </div>
                <div>
                  <label class="text-[10px] text-slate-400 block">Bonus al clasificar:</label>
                  <input type="number" id="cfg-bonus-${s}" min="0" max="10000" step="1" value="${i}" class="w-full bg-slate-950 border border-slate-700 rounded p-1 text-center font-bold text-emerald-300">
                </div>
              </div>
            `}).join("")}
        </div>
      </div>

      <!-- Premios -->
      <div class="bg-blue-950/60 border border-blue-800 p-4 rounded-xl">
        <h3 class="font-bold text-sm text-yellow-300 mb-2">🎁 Premios Oficiales</h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label class="block text-slate-400 mb-1">🥇 Primer Puesto:</label>
            <input type="text" id="cfg-premio-1" value="${E(t.PREMIOS_PRIMER_PUESTO||"Diploma, medalla y premio sorpresa")}" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white">
          </div>
          <div>
            <label class="block text-slate-400 mb-1">🥈 Segundo Puesto:</label>
            <input type="text" id="cfg-premio-2" value="${E(t.PREMIOS_SEGUNDO_PUESTO||"Diploma, medalla y premio sorpresa")}" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white">
          </div>
          <div>
            <label class="block text-slate-400 mb-1">🥉 Tercer Puesto:</label>
            <input type="text" id="cfg-premio-3" value="${E(t.PREMIOS_TERCER_PUESTO||"Diploma y medalla")}" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white">
          </div>
        </div>
      </div>

      <div class="flex justify-end pt-2">
        <button id="btn-guardar-reglas-cloud" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg transition flex items-center space-x-2 cursor-pointer text-xs">
          <span>💾</span>
          <span>Guardar paso 1 y continuar</span>
        </button>
      </div>

    </div>
  `,e.querySelector("#cfg-total-rondas").addEventListener("change",s=>{const o=Number(s.currentTarget.value);if(!Number.isInteger(o)||o<1||o>20){r.showToast("La cantidad de rondas debe ser un entero entre 1 y 20.","warning"),s.currentTarget.value=String(a);return}ht(e,a),C.TOTAL_RONDAS=o,Ze(e)}),e.querySelector("#btn-guardar-reglas-cloud").addEventListener("click",async()=>{const s=Number(e.querySelector("#cfg-total-rondas").value);if(!Number.isInteger(s)||s<1||s>20){r.showToast("La cantidad de rondas debe ser un entero entre 1 y 20.","warning");return}const o={TOTAL_RONDAS:s,NOMBRE_EVENTO:e.querySelector("#cfg-nombre-evento").value.trim(),HOMENAJEADO:e.querySelector("#cfg-homenajeado").value.trim(),ANIO_CERTAMEN:Number(e.querySelector("#cfg-anio").value),PREMIOS_PRIMER_PUESTO:e.querySelector("#cfg-premio-1").value.trim(),PREMIOS_SEGUNDO_PUESTO:e.querySelector("#cfg-premio-2").value.trim(),PREMIOS_TERCER_PUESTO:e.querySelector("#cfg-premio-3").value.trim()};if(!Number.isInteger(o.ANIO_CERTAMEN)||o.ANIO_CERTAMEN<2e3||o.ANIO_CERTAMEN>2100){r.showToast("El año del certamen debe estar entre 2000 y 2100.","warning");return}for(let i=1;i<=s;i++){const d=Number(e.querySelector(`#cfg-dur-${i}`).value),f=Number(e.querySelector(`#cfg-aud-${i}`).value),m=Number(e.querySelector(`#cfg-min-${i}`).value),h=Number(e.querySelector(`#cfg-puntos-${i}`).value),A=Number(e.querySelector(`#cfg-bonus-${i}`).value);if(!Number.isInteger(d)||d<1||d>3600||!Number.isInteger(f)||f<1||f>100||!Number.isInteger(m)||m<1||m>f||!Number.isInteger(h)||h<0||h>1e4||!Number.isInteger(A)||A<0||A>1e4){r.showToast(`Revisa los valores de la Ronda ${i}: duración 1–3600, audiciones 1–100, mínimo 1–audiciones y puntos/bonus 0–10000.`,"warning",5e3);return}const w=Re(i,s);o[`DURACION_RONDA_${w}`]=d,o[`NUM_AUDICIONES_RONDA_${w}`]=f,o[`MINIMO_PASAR_RONDA_${w}`]=m,o[`PUNTOS_POR_ACIERTO_RONDA_${w}`]=h,o[`BONUS_POR_CLASIFICAR_RONDA_${w}`]=A}const l=s!==v.TOTAL_RONDAS||Object.entries(o).some(([i,d])=>/^(DURACION_RONDA_|NUM_AUDICIONES_RONDA_|MINIMO_PASAR_RONDA_)/.test(i)&&String(C[i]===void 0?"":C[i])!==String(d)),b=Object.entries(o).some(([i,d])=>/^(PUNTOS_POR_ACIERTO_RONDA_|BONUS_POR_CLASIFICAR_RONDA_)/.test(i)&&String(C[i]===void 0?i.indexOf("PUNTOS_POR_ACIERTO_")===0?1:0:C[i])!==String(d)),c=l||b,g=te.length>0||ee.length>0,u=c&&g;if(!(u&&!window.confirm("Cambiar las reglas o los puntajes reiniciará las respuestas y los resultados guardados de todas las rondas. Si cambias la cantidad o los parámetros de las audiciones, también se reiniciará el sorteo. ¿Continuar?"))){r.showLoading("Actualizando parámetros en la base de datos...");try{if(await y.guardarConfigLote(o,u),C={...C,...o},v.syncFromBackend(C),l&&(M=[],be=[]),u){ee=[],te=[];for(let h=1;h<=v.TOTAL_RONDAS;h++)C[`RONDA_CERRADA_${h}`]=!1,v.COMPLETED_ROUNDS[h]=!1}const i=x.get(),d=Number(i.rondaActual)||1,f=u||d>s?1:d;(l||u)&&x.set({rondaActual:f,rondaVista:f,rondaHistorial:null,rondaCerrada:!1,audicionActual:1,audicionesRonda:l?[]:i.audicionesRonda,resultados:u?[]:(i.resultados||[]).filter(h=>Number(h.ronda)===f),respuestasAudicion:u?[]:[]}),yt();const m=document.getElementById("select-ronda");m&&(m.value=String(f)),J(),ae(x.get()),j(x.get()),r.showToast("✅ Paso 1 guardado. Continúa con canciones y luego realiza el sorteo.","success",4500)}catch(i){r.showToast("Error al actualizar configuración: "+i.message,"error")}finally{r.hideLoading()}}})}function ht(e,t){for(let a=1;a<=t;a++){const n=e.querySelector(`#cfg-dur-${a}`),s=e.querySelector(`#cfg-aud-${a}`),o=e.querySelector(`#cfg-min-${a}`),l=e.querySelector(`#cfg-puntos-${a}`),b=e.querySelector(`#cfg-bonus-${a}`),c=Re(a,t);n&&(C[`DURACION_RONDA_${c}`]=Number(n.value)),s&&(C[`NUM_AUDICIONES_RONDA_${c}`]=Number(s.value)),o&&(C[`MINIMO_PASAR_RONDA_${c}`]=Number(o.value)),l&&(C[`PUNTOS_POR_ACIERTO_RONDA_${c}`]=Number(l.value)),b&&(C[`BONUS_POR_CLASIFICAR_RONDA_${c}`]=Number(b.value))}}function yt(){const e=document.getElementById("select-ronda");if(!e)return;const t=Number(e.value);e.innerHTML=Object.entries(v.ROUNDS).map(([a,n])=>`<option value="${a}">${E(ue(a,n))}</option>`).join(""),e.value=String(t<=v.TOTAL_RONDAS?t:1)}async function Ue(){r.init(),r.showLoading("Conectando con el certamen...");try{let e=[],t=[],a=[],n=[],s=[],o=1,l=!1;try{const[c,g,u,i]=await Promise.all([y.getConfig().catch(h=>(console.warn("[APP] No se pudo cargar configuración del backend:",h),{data:{}})),y.getCanciones().catch(()=>({data:[]})),y.getAlumnos().catch(()=>({data:[]})),y.getEstadoCertamen().catch(()=>({data:null}))]);v.syncFromBackend(c.data||{}),e=g.data||[],t=u.data||[],i&&i.data&&(o=i.data.rondaActual||1,l=!!i.data.rondaCerrada),v.ROUNDS[o]||(o=1);const[d,f,m]=await Promise.all([y.getAudicionesRonda(o).catch(()=>({data:[]})),y.getResultados(o).catch(()=>({data:[]})),y.getRespuestasRonda(o).catch(h=>(console.warn("[APP] Backend aún no expone las respuestas por audición:",h),{data:[]}))]);a=d.data||[],n=f.data||[],s=m.data||[]}catch(c){console.warn("[APP] Aviso de red al conectar el servicio de datos:",c),r.showToast("Modo sin conexión o dirección del servicio de datos pendiente. Cargando vista.","warning",4e3)}x.set({canciones:e,alumnos:t,rondaActual:o,rondaVista:o,rondaHistorial:null,rondaCerrada:l,audicionActual:1,audicionesRonda:a,resultados:n,respuestasAudicion:s,isLoading:!1}),dt(),mt();const b=r.get("selectRonda");b&&(b.innerHTML=Object.entries(v.ROUNDS).map(([c,g])=>`<option value="${c}">${ue(c,g)}</option>`).join(""),b.value=String(o)),J(),ae(x.get()),j(x.get()),console.log("✅ Aplicación inicializada correctamente"),r.showToast("Certamen listo para audición","success",2500)}catch(e){console.error("❌ Error al inicializar:",e),r.showToast("Error al conectar con la base de datos.","error",5e3)}finally{r.hideLoading()}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Ue):Ue();
