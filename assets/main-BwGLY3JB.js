import{C as w,f as we,a as Fe,b as y,g as se,c as me}from"./formatters-CwHejOBa.js";class He{constructor(){this.state={rondaActual:1,rondaVista:1,rondaCerrada:!1,rondaHistorial:null,audicionActual:0,alumnos:[],canciones:[],configRonda:null,resultados:{},respuestasAudicion:[],isLoading:!1,error:null},this.listeners=[]}get(){return{...this.state}}set(t){this.state={...this.state,...t},this.notify()}subscribe(t){return this.listeners.push(t),()=>{this.listeners=this.listeners.filter(a=>a!==t)}}notify(){this.listeners.forEach(t=>t(this.state))}}const f=new He,r={elements:{},init(){return this._ensureFeedbackElements(),this.elements={selectRonda:document.getElementById("select-ronda"),audicionNumero:document.getElementById("audicion-numero"),btnPlay:document.getElementById("btn-play"),listaAlumnos:document.getElementById("lista-alumnos"),btnGuardarAciertos:document.getElementById("btn-guardar-aciertos"),btnFinalizarRonda:document.getElementById("btn-finalizar-ronda"),btnResetRonda:document.getElementById("btn-reset-ronda"),btnVerRanking:document.getElementById("btn-ver-ranking"),rankingSection:document.getElementById("ranking-section"),rankingContent:document.getElementById("ranking-content"),loadingOverlay:document.getElementById("loading-overlay"),toast:document.getElementById("toast")},this.elements},_ensureFeedbackElements(){if(!document.getElementById("loading-overlay")){const e=document.createElement("div");e.id="loading-overlay",e.className="fixed inset-0 bg-black/75 z-50 flex flex-col items-center justify-center transition-opacity duration-300 hidden",e.innerHTML=`
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400 mb-4"></div>
        <p id="loading-text" class="text-white text-xl font-semibold tracking-wide">Cargando...</p>
      `,document.body.appendChild(e)}if(!document.getElementById("toast")){const e=document.createElement("div");e.id="toast",e.className="fixed bottom-5 right-5 z-50 max-w-md px-6 py-4 rounded-xl shadow-2xl text-white font-medium transform transition-all duration-300 translate-y-20 opacity-0 pointer-events-none flex items-center space-x-3",document.body.appendChild(e)}},get(e){return this.elements[e]||(this.elements[e]=document.getElementById(e)),this.elements[e]},showLoading(e="Procesando..."){const t=this.get("loadingOverlay");if(t){const a=document.getElementById("loading-text");a&&(a.textContent=e),t.classList.remove("hidden"),setTimeout(()=>t.classList.remove("opacity-0"),10)}},hideLoading(){const e=this.get("loadingOverlay");e&&(e.classList.add("opacity-0"),setTimeout(()=>e.classList.add("hidden"),250))},showToast(e,t="info",a=3500){const n=this.get("toast");if(!n)return;const o={success:"bg-emerald-600 border border-emerald-400",error:"bg-rose-600 border border-rose-400",warning:"bg-amber-600 border border-amber-400",info:"bg-blue-600 border border-blue-400"},s={success:"✓",error:"✕",warning:"⚠",info:"ℹ"};n.className=`fixed bottom-5 right-5 z-50 max-w-md px-6 py-4 rounded-xl shadow-2xl text-white font-medium transform transition-all duration-300 flex items-center space-x-3 ${o[t]||o.info}`,n.innerHTML=`
      <span class="text-2xl font-bold">${s[t]||"ℹ"}</span>
      <span class="flex-1">${e}</span>
    `,n.classList.remove("translate-y-20","opacity-0","pointer-events-none"),n.classList.add("translate-y-0","opacity-100"),this._toastTimer&&clearTimeout(this._toastTimer),this._toastTimer=setTimeout(()=>{n.classList.add("translate-y-20","opacity-0","pointer-events-none"),n.classList.remove("translate-y-0","opacity-100")},a)}};function Re(e){if(!e||typeof e!="string")return"";const t=e.trim();if(t.startsWith("[")&&t.endsWith("]")||t.toLowerCase()==="file_id"||t==="")return"";const a=t.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);if(a&&a[1])return a[1];const n=t.match(/[?&]id=([a-zA-Z0-9_-]+)/);if(n&&n[1])return n[1];const o=t.match(/\/d\/([a-zA-Z0-9_-]+)/);return o&&o[1]?o[1]:(/^[a-zA-Z0-9_-]{20,60}$/.test(t),t)}function Ge(e,t=w.TOTAL_RONDAS||5){const a=Number(e);return Number.isInteger(a)&&a>=1&&a<=t}function Ve(e){const t=Re(e);return t?/^[a-zA-Z0-9_-]{20,60}$/.test(t):!1}function S(e){return e==null?"":String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function Q(e){return String(e||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase().replace(/[^A-Z0-9]/g,"")}function U(e,t){let a=[],n=[],o=[],s=1,l=!1,u=!1,c=4,m=1;if(e&&Array.isArray(e.alumnos))a=e.alumnos||[],n=Array.isArray(e.resultados)?e.resultados:Object.values(e.resultados||{}),o=Array.isArray(e.respuestasAudicion)?e.respuestasAudicion:[],s=e.rondaActual||1,l=!!e.rondaCerrada,u=!!e.soloLectura,m=e.audicionActual||1,c=(w.ROUNDS[s]||{audiciones:4}).audiciones;else{a=Array.isArray(e)?e:[],n=Array.isArray(t)?t:[];const p=r.get("selectRonda");p&&(s=parseInt(p.value,10)||1);const h=r.get("audicionNumero");h&&(m=parseInt(h.textContent,10)||1),c=(w.ROUNDS[s]||{audiciones:4}).audiciones}const b=r.get("listaAlumnos");if(!b)return;const i={},d={};if(n.forEach(p=>{if(parseInt(p.ronda,10)===s&&(i[String(p.alumnoId)]=p),p.eliminado){const h=p.rondaEliminacion||p.ronda;(!d[String(p.alumnoId)]||h<d[String(p.alumnoId)])&&(d[String(p.alumnoId)]=h)}}),a=a.filter(p=>{const h=p.rondaEliminacion||d[String(p.id)],E=Number(h);return!Number.isInteger(E)||E>=s}),a.length===0){b.innerHTML=`
      <div class="col-span-full text-center py-8 text-blue-200">
        <p class="text-lg">No hay participantes que hayan clasificado a esta ronda.</p>
      </div>
    `;return}const g=(w.ROUNDS[s]||{minimoPasar:2}).minimoPasar,v=o.filter(p=>Number(p.ronda)===Number(s));b.innerHTML=a.map(p=>{var Ee;const h=i[String(p.id)],E=v.filter(I=>String(I.alumnoId)===String(p.id)),R=E.length>0?E.filter(I=>I.correcto===!0||String(I.correcto).toLowerCase()==="true").length:h?parseInt(h.aciertos,10):0,A=p.rondaEliminacion||d[String(p.id)],C=A&&A<s,j=h?h.eliminado:!1,J=we(p.nombre);let te="bg-blue-900/60 text-blue-200 border border-blue-400/30",ae="En competencia";C?(te="bg-rose-950 text-rose-300 border border-rose-800",ae=`❌ Eliminado en Ronda ${A}`):j?(te="bg-red-900/80 text-red-200 border border-red-500",ae=`Eliminado en Ronda ${s}`):R>=g&&(te="bg-emerald-900/80 text-emerald-200 border border-emerald-500",ae=`Clasificado (${R}/${c})`);let Ne="";for(let I=1;I<=c;I++){const K=E.find(je=>Number(je.audicionNum)===I),le=K&&(K.correcto===!0||String(K.correcto).toLowerCase()==="true"),ce=I===m,qe=u||l||C||!ce;Ne+=`
        <label class="flex flex-col items-center justify-center cursor-pointer p-1 rounded-md border transition select-none ${ce?"bg-yellow-500/20 border-yellow-400 shadow ring-1 ring-yellow-400":"bg-blue-950/60 hover:bg-blue-900 border-blue-700/50"}">
          <span class="text-[10px] ${ce?"text-yellow-300 font-extrabold":"text-slate-300"} mb-0.5">Aud ${I}</span>
          <input 
            type="checkbox" 
            class="checkbox-acierto w-4 h-4 text-yellow-500 bg-blue-900 rounded border-gray-400 focus:ring-yellow-400 focus:ring-2 cursor-pointer"
            data-alumno-id="${S(p.id)}"
            data-audicion="${I}"
            ${le?"checked":""}
            ${qe?"disabled":""}
          />
          <span class="text-[8px] ${K?le?"text-emerald-300":"text-rose-300":"text-slate-500"}">${K?le?"Correcta":"Error":"Pendiente"}</span>
        </label>
      `}return`
      <div class="alumno-card bg-slate-800/90 border border-slate-700 rounded-lg p-2.5 shadow transition hover:border-yellow-500/50 ${C?"opacity-40 bg-slate-950 cursor-not-allowed":""}" data-alumno-card="${S(p.id)}">
        <div class="flex items-start justify-between gap-2 mb-1.5">
          <div class="min-w-0">
            <h3 class="font-bold text-sm text-white truncate">${S(J)}</h3>
            <p class="text-[10px] text-slate-300">${S(p.grado||"")} ${S(p.nivel||"")}</p>
          </div>
          <span class="text-[9px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${te}">
            ${ae}
          </span>
        </div>

        <!-- Checkboxes de audiciones -->
        <div class="mt-1.5">
          <div class="text-[10px] text-slate-400 mb-1 flex justify-between items-center">
            <span>Aciertos Ronda ${s}:</span>
            <span class="font-bold text-yellow-400"><span id="aciertos-count-${p.id}">${R}</span> / ${c}</span>
          </div>
          <div class="grid grid-cols-${Math.min(c,4)} gap-1">
            ${Ne}
          </div>
        </div>

        <!-- Entrada rápida de respuesta de pizarra para el jurado -->
        ${C?"":`
          <div class="mt-2 pt-1.5 border-t border-slate-700/60 flex items-center gap-2">
            <span class="text-[10px] text-slate-400 whitespace-nowrap">✏️ Pizarra</span>
            <input 
              type="text" 
              placeholder="Código escrito (ej: TP2380)"
              class="input-pizarra-alumno bg-slate-950 text-yellow-300 border border-slate-700 uppercase font-mono text-[11px] px-2 py-1 rounded-md w-full focus:ring-1 focus:ring-yellow-400 focus:outline-none"
              data-alumno-id="${S(p.id)}"
              data-audicion="${m}"
              ${u||l?"disabled":""}
              value="${S(((Ee=E.find(I=>Number(I.audicionNum)===m))==null?void 0:Ee.respuesta)||"")}"
            />
          </div>
        `}
      </div>
    `}).join("")}function Y(e,t){let a=[],n=1,o=1,s=!1;if(e&&e.rondaActual!==void 0)n=e.rondaActual,a=e.audicionesRonda||e.audiciones||[],o=e.audicionActual||1,s=!!e.soloLectura;else{a=Array.isArray(e)?e:[],n=1;const g=r.get("audicionNumero");g&&(o=parseInt(g.textContent,10)||1)}const l=r.get("audicionNumero");l&&(l.textContent=String(o));const u=a.find(g=>g.audicionNum===o)||a[o-1],c=document.getElementById("admin-cancion-nombre"),m=document.getElementById("admin-cancion-codigo"),b=document.getElementById("admin-seg-duracion"),i=w.ROUNDS[n]||{duracion:40,audiciones:4},d=document.getElementById("badge-rango-reproduccion");d&&(d.textContent=`📍 Rango: de 0s a ${i.duracion||40}s`),c&&(c.textContent=u?u.cancionNombre||`Composición #${u.cancionId}`:"Composición no asignada"),m&&(m.textContent=u&&u.cancionCodigo||"----"),b&&(b.textContent=String(i.duracion||40));const x=document.getElementById("ronda-info-detalles");x&&(x.innerHTML=`
      <div class="flex flex-wrap items-center justify-between text-[10px] md:text-xs bg-blue-950/70 p-2 rounded-lg border border-blue-700/60 mt-2 gap-2">
        <span>⏱ <strong>Duración:</strong> ${i.duracion||40}s por audición</span>
        <span>🎯 <strong>Mínimo para clasificar:</strong> ${i.minimoPasar||2} aciertos</span>
        <span>🎼 <strong>Total audiciones:</strong> ${i.audiciones||4}</span>
        ${s?'<span class="font-bold text-cyan-300">Consulta histórica · solo lectura</span>':""}
      </div>
    `)}function Se(e){const t=r.get("rankingContent");if(!t)return;if(!e||e.length===0){t.innerHTML=`
      <div class="text-center py-6 text-slate-300">
        <p>Aún no hay puntajes registrados en el certamen.</p>
      </div>
    `;return}const a=Ye(e.filter((o,s)=>ge(o,s)<=3)),n=e.map((o,s)=>{const l=ge(o,s);let u=`<span class="font-bold text-slate-300">${Fe(l)}</span>`,c="hover:bg-slate-700/50";l===1?(u='<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500 text-slate-950 font-black shadow-lg">🥇 1°</span>',c="bg-yellow-500/10 hover:bg-yellow-500/20 border-l-4 border-yellow-500"):l===2?(u='<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-300 text-slate-950 font-black shadow-lg">🥈 2°</span>',c="bg-slate-300/10 hover:bg-slate-300/20 border-l-4 border-slate-300"):l===3&&(u='<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-700 text-amber-100 font-black shadow-lg">🥉 3°</span>',c="bg-amber-700/10 hover:bg-amber-700/20 border-l-4 border-amber-600");const m=o.eliminado?`Eliminado en Ronda ${o.rondaEliminacion||1}`:`Activo (Ronda ${o.rondaMax||1})`,b=Ze(o);return`
      <tr class="border-b border-slate-700/60 ${c} transition-colors">
        <td class="p-3 text-center">${u}</td>
        <td class="p-3 font-semibold text-white">
          ${S(we(o.nombre))}
          ${o.premio?`<span class="block text-xs text-yellow-400 font-normal">🎁 ${o.premio}</span>`:""}
        </td>
        <td class="p-3 text-slate-300 text-sm">${S(o.grado||"")} ${S(o.nivel||"")}</td>
        <td class="p-3 text-center">
          <span class="inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${o.eliminado?"bg-rose-950 text-rose-300 border border-rose-800":"bg-emerald-950 text-emerald-300 border border-emerald-800"}">
            ${m}
          </span>
        </td>
        <td class="p-3">
          <div class="flex flex-wrap gap-1">${b}</div>
        </td>
        <td class="p-3 text-right font-bold text-yellow-400 text-lg">
          ${o.puntosTotal||0}
        </td>
      </tr>
    `}).join("");t.innerHTML=`
    ${a}

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
          ${n}
        </tbody>
      </table>
    </div>
  `}function ge(e,t){const a=Number(e.posicion);return Number.isInteger(a)&&a>0?a:t+1}function Ze(e){const t=e.detalleRondas||{};return Array.from({length:w.TOTAL_RONDAS},(a,n)=>{const o=n+1,s=`ronda_${o}`;if(!Object.prototype.hasOwnProperty.call(t,s))return o<=Number(e.rondaMax||0)?`<span class="rounded-md bg-cyan-950 px-2 py-1 text-[10px] text-cyan-200" title="Llegó a la Ronda ${o}; aún no registra puntaje">R${o} en curso</span>`:`<span class="rounded-md bg-slate-800 px-2 py-1 text-[10px] text-slate-500" title="No llegó a la Ronda ${o}">R${o} —</span>`;const u=S(t[s]),c=w.ROUNDS[o]?w.ROUNDS[o].audiciones:"?";return`<span class="rounded-md bg-emerald-950 px-2 py-1 text-[10px] text-emerald-200" title="Aciertos en Ronda ${o}">R${o} ${u}/${c}</span>`}).join("")}function Ye(e){if(!e||e.length===0)return"";const t={1:{medal:"🥇",className:"border-yellow-400 bg-yellow-950/50 text-yellow-200"},2:{medal:"🥈",className:"border-slate-300 bg-slate-800/80 text-slate-200"},3:{medal:"🥉",className:"border-amber-600 bg-amber-950/50 text-amber-200"}};return`<div class="podium-container grid grid-cols-1 md:grid-cols-3 items-end gap-3 md:gap-6 my-8 px-2 max-w-4xl mx-auto">${[2,1,3].map(n=>{const o=e.filter((l,u)=>ge(l,u)===n),s=t[n];return o.length===0?'<div class="min-h-24"></div>':`
      <div class="rounded-t-2xl border-2 ${s.className} p-4 text-center shadow-xl">
        <div class="mb-3 text-3xl">${s.medal} <span class="text-xl font-black">${n}°</span></div>
        <div class="space-y-3">
          ${o.map(l=>`
            <div class="rounded-xl bg-slate-950/50 p-3">
              <p class="font-extrabold text-white">${S(we(l.nombre))}</p>
              <p class="text-xs text-slate-300">${S(l.grado||"")}</p>
              <p class="mt-1 font-black text-yellow-300">${Number(l.puntosTotal)||0} pts</p>
            </div>
          `).join("")}
        </div>
      </div>
    `}).join("")}</div>`}function De(e,t){return new Map((Array.isArray(e)?e:[]).filter(a=>Number(a.audicionNum)===Number(t)).map(a=>[String(a.alumnoId),a]))}function Pe(e,t,a){if(!Array.isArray(a)||a.length===0)return!1;const n=De(e,t);return a.every(o=>n.has(String(o)))}function F(){const e=document.getElementById("round-timeline");if(!e)return;const t=f.get(),a=Number(t.rondaActual)||1,n=Number(t.rondaVista)||a;e.innerHTML=Object.entries(w.ROUNDS).map(([o,s])=>{const l=Number(o),u=!!w.COMPLETED_ROUNDS[l],c=l===a,m=l===a+1&&!!t.rondaCerrada,b=c||l<a&&u||m,i=l===n,d=c?u?"Ronda activa · completada":"En curso":u?"Completada · solo lectura":m?"Disponible":"Bloqueada",x=i?"border-yellow-400 bg-yellow-500/15 text-yellow-100":"border-slate-700 bg-slate-950/70 text-slate-300";return`
      <button
        type="button"
        data-round="${l}"
        aria-pressed="${i}"
        title="${s.nombre}: ${d}"
        ${b?"":"disabled"}
        class="min-w-28 rounded-lg border px-3 py-2 text-left transition ${x} ${b?"hover:border-yellow-400 cursor-pointer":"opacity-45 cursor-not-allowed"}"
      >
        <span class="block text-xs font-bold">${s.nombre}</span>
        <span class="block mt-0.5 text-[10px] opacity-80">${d}</span>
      </button>
    `}).join("")}function Je(e){const t=document.getElementById("round-timeline");!t||!e||t.dataset.bound==="true"||(t.dataset.bound="true",t.addEventListener("click",a=>{const n=a.target.closest("button[data-round]");if(!n||n.disabled)return;const o=n.dataset.round;e.value!==o&&(e.value=o,e.dispatchEvent(new Event("change",{bubbles:!0})))}))}let O=!1,H=!1,N=1,M=null,z=null,k={startSec:0,endSec:40,duration:40},B=null,ne=null,ie=!1,X=!1;function Ke(){r.init(),N=f.get().audicionActual||1,Je(r.get("selectRonda")),F();const e=r.get("btnPlay");e&&e.addEventListener("click",async()=>{const i=f.get();if(G(i)||i.rondaCerrada){r.showToast("La reproducción solo está disponible en la ronda activa y abierta.","warning");return}if(O){Qe();return}if(H)return;H=!0,Oe(!0);const d=f.get(),x=d.rondaActual||1;let g=d.audicionesRonda||[];if(!g||g.length===0){r.showLoading("Obteniendo audición configurada...");try{g=(await y.getAudicionesRonda(x)).data||[],f.set({audicionesRonda:g})}catch(R){console.error("[AUDIO] No se pudieron cargar audiciones desde backend:",R),r.showToast("No se pudo cargar el sorteo de audiciones.","error"),H=!1,W();return}finally{r.hideLoading()}}const v=g.find(R=>R.audicionNum===N)||g[N-1]||{};if(!v.cancionId){r.showToast("No hay un sorteo guardado para esta audición. Configura las canciones y genera el sorteo.","warning",4500),H=!1,W();return}z=v;const p=Re(v.driveId||v.archivoDriveId);if(!Ve(p)){r.showToast("La canción asignada no tiene un identificador de archivo válido.","error",4500),H=!1,W();return}const h=document.getElementById("chk-random-start"),E=h?h.checked:!0;try{const R=`${Date.now()}-${Math.random().toString(36).slice(2,10)}`;B=R,ie=!1;const A=await y.solicitarReproduccionProyector({commandId:R,ronda:x,audicionNum:N,fileId:p,randomStart:E});if(A.data&&A.data.status!=="loading")throw new Error("El proyector no aceptó la orden de reproducción.");O=!0,ye(!0),P(`⏳ Enviando audición ${N} al proyector...`),xe(R)}catch(R){if(B)try{const A=await y.getReproduccionProyector();if(A.data&&String(A.data.commandId)===B&&["loading","countdown","playing"].includes(A.data.status)){O=!0,ye(!0),P("✅ La orden fue recibida; sincronizando con el proyector..."),xe(B);return}}catch(A){console.error("[PROYECTOR] No se pudo confirmar la orden:",A)}console.error("[PROYECTOR] No se pudo solicitar la reproducción:",R),B=null,O=!1,P("⚠️ No se pudo iniciar la reproducción en el proyector."),r.showToast(`No se pudo iniciar la audición: ${R.message}`,"error",5e3),W()}finally{H=!1,Oe(!1)}});const t=document.getElementById("btn-prev-audicion"),a=document.getElementById("btn-next-audicion");t&&t.addEventListener("click",()=>{if(N>1){if(fe()&&!window.confirm("Hay respuestas sin guardar. ¿Descartarlas y volver a la audición anterior?"))return;N--,$e(N),L()}}),a&&a.addEventListener("click",()=>{const i=f.get(),d=w.ROUNDS[i.rondaActual]||{audiciones:4};if(O){r.showToast("Espera a que termine el audio antes de cambiar de audición.","warning");return}if(!_e()||fe()){r.showToast("Verifica y guarda las respuestas de esta audición antes de avanzar.","warning",4e3);return}N<d.audiciones&&(N++,$e(N),L())});const n={AUDICION:document.getElementById("btn-modo-audicion"),CLASIFICADOS:document.getElementById("btn-modo-clasificados"),RANKING_FINAL:document.getElementById("btn-modo-ranking")};Object.entries(n).forEach(([i,d])=>{d&&d.addEventListener("click",async()=>{const x=f.get(),g=Array.from({length:w.TOTAL_RONDAS},(v,p)=>w.COMPLETED_ROUNDS[p+1]).every(Boolean);if(i==="CLASIFICADOS"&&!x.rondaCerrada){r.showToast("Finaliza la ronda actual antes de mostrar los clasificados.","warning");return}if(i==="RANKING_FINAL"&&!g){r.showToast("Finaliza todas las rondas antes de mostrar el ranking final.","warning");return}try{await y.actualizarModoProyector(i),oe(i,n),r.showToast(`Proyector configurado en: ${i}`,"info",2e3)}catch(v){console.error("Error al sincronizar modo proyector:",v),r.showToast("No se pudo cambiar el modo del proyector: "+v.message,"error")}})});const o=r.get("selectRonda");o&&o.addEventListener("change",async i=>{const d=parseInt(i.target.value,10);if(!Ge(d)){r.showToast("Ronda inválida","error");return}const x=f.get(),g=Number(x.rondaActual)||1,v=Number(x.rondaVista)||g;if(O){i.target.value=String(v),r.showToast("Espera a que termine el audio antes de cambiar de ronda.","warning");return}if(d<g&&!w.COMPLETED_ROUNDS[d]){i.target.value=String(v),r.showToast("Solo se pueden consultar rondas que ya fueron completadas.","warning");return}if(d>g&&(d!==g+1||!x.rondaCerrada)){i.target.value=String(v),r.showToast("Finaliza la ronda activa antes de iniciar la siguiente.","warning",4e3);return}r.showLoading(`Cargando Ronda ${d}...`);try{if(N=1,d<g){const[h,E,R]=await Promise.all([y.getAudicionesRonda(d),y.getResultados(d),y.getRespuestasRonda(d)]);f.set({rondaVista:d,rondaHistorial:{ronda:d,audicionesRonda:h.data||[],resultados:E.data||[],respuestasAudicion:R.data||[]},audicionActual:1})}else if(d===g)f.set({rondaVista:g,rondaHistorial:null,audicionActual:1});else{const[h,E,R,A]=await Promise.all([y.getAudicionesRonda(d),y.getResultados(d),y.getAlumnos(),y.getRespuestasRonda(d)]);await y.actualizarRondaActual(d),f.set({rondaActual:d,rondaVista:d,rondaHistorial:null,rondaCerrada:!!w.COMPLETED_ROUNDS[d],audicionActual:1,audicionesRonda:h.data||[],resultados:E.data||[],alumnos:R.data||[],respuestasAudicion:A.data||[]}),oe("AUDICION",n)}Ce(),F();const p=w.ROUNDS[d]||{duracion:40};Ae(0,p.duracion),L(),r.showToast(d<g?`Consulta de Ronda ${d} · solo lectura`:`Ronda ${d} activa`,"success")}catch(p){console.error("Error al cambiar ronda:",p),N=x.audicionActual||1,i.target.value=String(v),F(),Ce(),L(),r.showToast("Error al cambiar de ronda: "+p.message,"error")}finally{r.hideLoading()}});const s=r.get("listaAlumnos");s&&(s.addEventListener("input",i=>{if(i.target&&i.target.classList.contains("input-pizarra-alumno")){const d=i.target.dataset.alumnoId,x=i.target.value.trim().toUpperCase(),v=f.get().audicionesRonda||[],p=v.find(J=>J.audicionNum===N)||v[N-1]||{},h=Q(p.cancionCodigo),E=Q(p.cancionNombre),R=[...s.querySelectorAll("[data-alumno-card]")].find(J=>J.getAttribute("data-alumno-card")===d);if(!R)return;const A=R.querySelector(`.checkbox-acierto[data-audicion="${N}"]`),C=Q(i.target.value);C!==""&&(C===h||C===E)?(i.target.classList.remove("border-slate-700","border-rose-500"),i.target.classList.add("border-emerald-400","bg-emerald-950/60"),A&&!A.checked&&(A.checked=!0,ue(R,d))):x===""?(i.target.classList.remove("border-emerald-400","bg-emerald-950/60","border-rose-500"),i.target.classList.add("border-slate-700"),A&&(A.checked=!1)):(i.target.classList.remove("border-emerald-400","bg-emerald-950/60","border-slate-700"),i.target.classList.add("border-rose-500"),A&&(A.checked=!1)),ue(R,d),L()}}),s.addEventListener("change",i=>{if(i.target&&i.target.classList.contains("checkbox-acierto")){const d=i.target.dataset.alumnoId,x=document.querySelector(`[data-alumno-card="${d}"]`);x&&ue(x,d),L()}}));const l=r.get("btnGuardarAciertos");l&&l.addEventListener("click",async()=>{const i=f.get();if(G(i)){r.showToast("Las rondas históricas son de solo lectura.","warning");return}const d=i.rondaActual||1,x=N;if(O){r.showToast("Espera a que termine el audio antes de guardar respuestas.","warning");return}const g=ee(i),v=[...document.querySelectorAll("[data-alumno-card]")];let p;try{p=g.map(h=>{const E=v.find(j=>j.getAttribute("data-alumno-card")===String(h.id));if(!E)throw new Error(`No se encontró la ficha del participante ${h.id}.`);const R=E.querySelector(`.input-pizarra-alumno[data-audicion="${x}"]`),A=E.querySelector(`.checkbox-acierto[data-audicion="${x}"]`),C=R?R.value.trim():"";return{alumnoId:h.id,respuesta:C,correcto:C!==""&&!!(A&&A.checked)}})}catch(h){console.error("Error al preparar respuestas:",h),r.showToast("Error al preparar respuestas: "+h.message,"error");return}if(p.length===0){r.showToast("No hay participantes elegibles para guardar.","warning");return}r.showLoading("Guardando respuestas de esta audición...");try{await y.guardarRespuestasAudicion({ronda:d,audicionNum:x,respuestas:p});const[h,E]=await Promise.all([y.getRespuestasRonda(d),y.getResultados(d)]);f.set({respuestasAudicion:h.data||[],resultados:E.data||[]}),U(f.get()),Y(f.get()),L();const R=p.filter(A=>A.correcto).length;r.showToast(`Audición ${x} guardada: ${R} correctas y ${p.length-R} errores.`,"success",4500)}catch(h){console.error("Error al guardar respuestas:",h),r.showToast("❌ Error al guardar respuestas: "+h.message,"error")}finally{r.hideLoading()}});const u=r.get("btnFinalizarRonda");u&&u.addEventListener("click",async()=>{const i=f.get();if(G(i)){r.showToast("Selecciona la ronda activa para finalizarla.","warning");return}const d=i.rondaActual||1,x=w.ROUNDS[d]||{minimoPasar:2};if(!ke()){r.showToast("No se puede finalizar: guarda las respuestas de todas las audiciones primero.","warning",4500);return}if(window.confirm(`¿Desea FINALIZAR la Ronda ${d}?

• Mínimo exigido: ${x.minimoPasar} aciertos
• Los alumnos con menos de ${x.minimoPasar} aciertos quedarán marcados como ELIMINADOS EN RONDA ${d}.
• La ronda quedará marcada como completada y no se avanzará automáticamente.
• El proyector pasará al modo CLASIFICADOS.

¿Continuar?`)){r.showLoading("Finalizando ronda y calculando clasificación...");try{const p=(await y.finalizarRonda(d)).data||{};r.showToast(`Ronda ${d} completada: ${p.pasanCount||0} clasifican, ${p.eliminadosCount||0} eliminados`,"success",5e3);const[h,E,R]=await Promise.all([y.getResultados(d),y.getRanking(),y.getAlumnos()]);f.set({resultados:h.data||[],ranking:E.data||[],alumnos:R.data||[],rondaCerrada:!0}),w.COMPLETED_ROUNDS[d]=!0;const A=r.get("selectRonda");if(A){const j=A.querySelector(`option[value="${d}"]`);j&&(j.textContent=se(d))}U(f.get()),L(),F(),oe(d===w.TOTAL_RONDAS?"RANKING_FINAL":"CLASIFICADOS",n);const C=r.get("rankingSection");C&&!C.classList.contains("hidden")&&Se(E.data||[])}catch(v){console.error("Error al finalizar ronda:",v),r.showToast("Error al finalizar ronda: "+v.message,"error")}finally{r.hideLoading()}}});const c=r.get("btnResetRonda");c&&c.addEventListener("click",async()=>{const i=f.get();if(G(i)){r.showToast("Selecciona la ronda activa antes de resetearla.","warning");return}const d=i.rondaActual||1;if(window.confirm(`⚠️ ATENCIÓN: ¿Está seguro de RESETEAR la Ronda ${d}?

Se borrarán las respuestas y resultados de la Ronda ${d} y de las rondas posteriores.`)){r.showLoading(`Reseteando datos de la Ronda ${d}...`);try{await y.resetRonda(d);for(let h=d;h<=w.TOTAL_RONDAS;h++){w.COMPLETED_ROUNDS[h]=!1;const E=r.get("selectRonda"),R=E&&E.querySelector(`option[value="${h}"]`);R&&(R.textContent=se(h))}const[g,v,p]=await Promise.all([y.getResultados(d),y.getAlumnos(),y.getRespuestasRonda(d)]);f.set({resultados:g.data||[],alumnos:v.data||[],respuestasAudicion:p.data||[],rondaCerrada:!1}),oe("AUDICION",n),U(f.get()),L(),F(),r.showToast(`Ronda ${d} ha sido reseteada correctamente`,"warning")}catch(g){console.error("Error al resetear ronda:",g),r.showToast("Error al resetear ronda: "+g.message,"error")}finally{r.hideLoading()}}});const m=r.get("btnVerRanking"),b=r.get("rankingSection");m&&b&&m.addEventListener("click",async()=>{if(b.classList.contains("hidden")){r.showLoading("Calculando tabla de posiciones y ranking...");try{const x=(await y.getRanking()).data||[];f.set({ranking:x}),Se(x),b.classList.remove("hidden"),m.textContent="✕ Ocultar Ranking",m.classList.replace("bg-purple-700","bg-purple-900"),b.scrollIntoView({behavior:"smooth"})}catch(d){console.error("Error al obtener ranking:",d),r.showToast("Error al obtener ranking: "+d.message,"error")}finally{r.hideLoading()}}else b.classList.add("hidden"),m.textContent="🏆 Ver Ranking",m.classList.replace("bg-purple-900","bg-purple-700")}),L()}function $e(e){f.set({audicionActual:e}),Y(f.get()),U(f.get());const t=f.get(),a=w.ROUNDS[t.rondaActual]||{duracion:40};Ae(0,a.duracion)}function G(e=f.get()){return Number(e.rondaVista||e.rondaActual)!==Number(e.rondaActual)}function We(e=f.get()){if(!G(e))return{...e,soloLectura:!1};const t=e.rondaHistorial;return!t||Number(t.ronda)!==Number(e.rondaVista)?{...e,soloLectura:!0}:{...e,rondaActual:Number(t.ronda),audicionesRonda:t.audicionesRonda,resultados:t.resultados,respuestasAudicion:t.respuestasAudicion,rondaCerrada:!0,audicionActual:N,soloLectura:!0}}function Ce(){const e=We();Y(e),U(e)}function ee(e=f.get()){const t=Number(e.rondaActual)||1;return(e.alumnos||[]).filter(a=>{const n=Number(a.rondaEliminacion);return Number.isInteger(n)&&n>0?n>=t:!a.eliminado})}function _e(e=f.get()){const t=ee(e);return Pe(e.respuestasAudicion,N,t.map(a=>a.id))}function fe(e=f.get()){const t=De(e.respuestasAudicion,N),a=[...document.querySelectorAll("[data-alumno-card]")];return ee(e).some(n=>{const o=a.find(i=>i.getAttribute("data-alumno-card")===String(n.id));if(!o)return!1;const s=o.querySelector(`.input-pizarra-alumno[data-audicion="${N}"]`),l=o.querySelector(`.checkbox-acierto[data-audicion="${N}"]`),u=s?s.value.trim():"",c=!!(l&&l.checked),m=t.get(String(n.id));if(!m)return u!==""||c;const b=m.correcto===!0||String(m.correcto).toLowerCase()==="true";return Q(u)!==Q(m.respuesta)||c!==b})}function ke(e=f.get()){const t=w.ROUNDS[e.rondaActual];if(!t)return!1;const a=ee(e).map(n=>n.id);return a.length===0?!1:Array.from({length:t.audiciones},(n,o)=>o+1).every(n=>Pe(e.respuestasAudicion,n,a))}function L(){const e=f.get(),t=G(e),a=Number(t?e.rondaVista:e.rondaActual),n=w.ROUNDS[a];if(!n)return;const o=r.get("btnPlay"),s=document.getElementById("btn-prev-audicion"),l=document.getElementById("btn-next-audicion"),u=r.get("btnGuardarAciertos"),c=r.get("btnFinalizarRonda"),m=r.get("btnResetRonda"),b=document.getElementById("audicion-estado-guardado");if(t){o&&(o.disabled=!0),s&&(s.disabled=!0),l&&(l.disabled=!0),u&&(u.disabled=!0),c&&(c.disabled=!0),m&&(m.disabled=!0),b&&(b.textContent=`Consulta de Ronda ${a} · solo lectura`,b.className="text-xs mb-3 text-cyan-300");return}const i=_e(e),d=fe(e),x=ke(e),g=!!e.rondaCerrada;if(o&&!O&&(o.disabled=g),m&&(m.disabled=!1),s&&(s.disabled=g||O||N<=1),l){const v=!g&&i&&!d&&!O&&N<n.audiciones;l.disabled=!v,l.textContent=N<n.audiciones?"Siguiente ▶":"Última audición"}u&&(u.disabled=g||O||ee(e).length===0),c&&(c.disabled=g||O||!x),b&&(g?b.textContent="Ronda finalizada":O?b.textContent="Audio en curso":d?b.textContent="Hay cambios sin guardar":i?b.textContent=`Respuestas de la audición ${N} guardadas`:b.textContent=`Audición ${N} pendiente de guardar`,b.className=`text-xs mb-3 ${g||i&&!d?"text-emerald-300":"text-amber-300"}`)}function Ae(e,t){const a=document.getElementById("badge-rango-reproduccion");a&&(a.textContent=`📍 Rango: de ${e}s a ${t}s`)}function ue(e,t){const a=e.querySelectorAll(".checkbox-acierto:checked").length,n=document.getElementById(`aciertos-count-${t}`);n&&(n.textContent=a);const o=f.get(),s=w.ROUNDS[o.rondaActual]||{minimoPasar:2},l=e.querySelector("span.rounded-full");l&&!l.textContent.includes("Eliminado")&&(a>=s.minimoPasar?(l.className="text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-900/80 text-emerald-200 border border-emerald-500",l.textContent=`Clasificado (${a})`):(l.className="text-xs px-2.5 py-1 rounded-full font-medium bg-blue-900/60 text-blue-200 border border-blue-400/30",l.textContent="En competencia"))}function oe(e,t){Object.entries(t).forEach(([a,n])=>{n&&(a===e?n.className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition border border-yellow-500 bg-yellow-500 text-slate-950 cursor-pointer shadow":n.className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition border border-slate-700 bg-slate-800 text-slate-300 hover:text-white cursor-pointer")})}function P(e){const t=document.getElementById("admin-audio-cache-status");t&&(t.textContent=e)}function xe(e){B===e&&y.getReproduccionProyector().then(t=>{const a=t.data;if(!(!a||String(a.commandId)!==e)){if(a.stopRequested&&["loading","countdown","playing"].includes(a.status))X=!0,P("⏳ El proyector está deteniendo la audición...");else if(a.status==="loading")P(`⏳ El proyector está cargando la audición ${a.audicionNum}...`);else if(a.status==="countdown")he(a),Ae(k.startSec,k.endSec),P("✅ Archivo cargado en el proyector. Cuenta regresiva de 5 segundos...");else if(a.status==="playing"){if(he(a),!ie){ie=!0;const n=Date.parse(a.startedAt);M=Number.isFinite(n)?new Date(n):new Date,Xe()}P("🔊 Audición reproduciéndose desde el proyector.")}else if(a.status==="completed"){pe(!0,a),be(),r.showToast(`Audición ${N} finalizada. Verifica y guarda las respuestas.`,"info",3e3),L();return}else if(a.status==="error"){pe(!1,a),be(),P(`⚠️ Error en el proyector: ${a.error||"no se pudo reproducir el audio."}`),r.showToast(`Error de reproducción en el proyector: ${a.error||"audio no disponible."}`,"error",5e3);return}else if(a.status==="cancelled"){pe(!1,a),be(),P("Audición detenida."),L();return}}}).catch(t=>{console.warn("[PROYECTOR] No se pudo consultar el estado:",t),P("⚠️ Sin conexión con el proyector; intentando sincronizar...")}).finally(()=>{B===e&&(ne=setTimeout(()=>xe(e),500))})}function Qe(){const e=B;if(!e||X)return;X=!0;const t=r.get("btnPlay");t&&(t.disabled=!0,t.textContent="⏳ Deteniendo en el proyector..."),P("⏳ Enviando orden de detención al proyector..."),y.actualizarReproduccionProyector({commandId:e,status:"stopRequested"}).catch(a=>{console.error("[PROYECTOR] No se pudo solicitar la detención:",a),X=!1,ye(),r.showToast("No se pudo detener la reproducción en el proyector.","error",4500)})}function be(){ne&&clearTimeout(ne),ne=null,B=null,ie=!1,X=!1,M=null,W()}function he(e){const t=Number(e.startSec),a=Number(e.endSec),n=Number(e.playedDuration!==void 0?e.playedDuration:e.duration),o=Number.isFinite(t)?t:k.startSec,s=Number.isFinite(n)?n:k.duration;k={startSec:o,endSec:Number.isFinite(a)?a:o+s,duration:s}}function pe(e,t){if(t&&t.startedAt&&!M){const b=Date.parse(t.startedAt);Number.isFinite(b)&&(M=new Date(b))}if(!M&&t){const b=Number(t.playedDuration),i=Date.parse(t.completedAt||"");Number.isFinite(b)&&b>0&&Number.isFinite(i)&&(M=new Date(i-b*1e3))}if(!M||!z)return;const n=f.get().rondaActual||1,o=w.ROUNDS[n]||{duracion:40};he(t||{});const s=k.startSec,l=Number.isFinite(Number(k.endSec))?Number(k.endSec):s+(e?o.duracion:0),u=Math.max(0,l-s),c=document.getElementById("admin-log-message"),m=document.getElementById("admin-log-range");m&&(m.textContent=`de ${s}s a ${l}s`),c&&(c.textContent="⏳ Audición finalizada. Guardando registro en la base de datos..."),y.registrarReproduccion({ronda:n,audicionNum:N,cancionId:z.cancionId||"",cancionNombre:z.cancionNombre||"",cancionCodigo:z.cancionCodigo||"",segundoInicio:s,segundoFin:l,duracion:u}).then(b=>{console.log("[AUDITORIA] Registrado en la base de datos:",b.data),c&&b.data&&(c.textContent=`✅ Registrado en la base de datos: de ${s}s a ${l}s (${u}s) a las ${b.data.fechaHora.split(" ")[1]}`)}).catch(b=>{console.warn("[AUDITORIA ERROR]",b),c&&(c.textContent="⚠️ No se pudo guardar el registro de reproducción en la base de datos.")}),M=null}function Xe(){const e=document.getElementById("admin-log-message");if(!e||!z)return;const t=f.get(),a=Number(k.startSec)||0,n=Number(k.endSec)||a,o=new Intl.DateTimeFormat("es-PE",{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(M||new Date),s=z.cancionNombre||`Composición #${z.cancionId}`,l=document.getElementById("admin-log-range");l&&(l.textContent=`de ${a}s a ${n}s`),e.textContent=`⏱ Reproducción iniciada: ${s} · Ronda ${t.rondaActual||1}, audición ${N} · de ${a}s a ${n}s · ${o}. Se guardará en la base de datos al finalizar.`}function Oe(e){const t=r.get("btnPlay");t&&e&&(t.disabled=!0,t.textContent="⏳ Cargando audio...",t.className="bg-yellow-600 text-white text-xl md:text-2xl px-10 py-4 rounded-xl shadow-lg cursor-not-allowed opacity-80")}function ye(e){const t=r.get("btnPlay");t&&(t.disabled=!1,t.textContent="⏹ DETENER AUDICIÓN",t.className="bg-red-600 hover:bg-red-700 text-white text-xl md:text-2xl font-black px-10 py-4 rounded-xl shadow-xl transition animate-pulse cursor-pointer",document.body.classList.add("is-playing"))}function W(){O=!1,document.body.classList.remove("is-playing");const e=r.get("btnPlay");e&&(e.disabled=!1,e.textContent="▶ REPRODUCIR AUDICIÓN",e.className="bg-emerald-600 hover:bg-emerald-500 text-white text-xl md:text-2xl font-black px-10 py-4 rounded-xl shadow-xl transition transform active:scale-95 inline-flex items-center space-x-3 cursor-pointer")}let q=null,Me="rondas",D=[],_=[],de=[],T=[],$={},V=[],Z=[];function et(){Be();const e=document.getElementById("btn-abrir-config");e&&e.addEventListener("click",tt)}function Be(){if(document.getElementById("modal-configuracion"))return;const e=document.createElement("div");e.id="modal-configuracion",e.className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 transition-opacity duration-300 hidden opacity-0",e.innerHTML=`
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
  `,document.body.appendChild(e),q=e,e.querySelector("#btn-cerrar-config").addEventListener("click",Ie),e.querySelector("#btn-cerrar-config-footer").addEventListener("click",Ie),e.querySelectorAll(".tab-btn").forEach(t=>{t.addEventListener("click",a=>{const n=a.currentTarget.dataset.tab;at(n)})})}async function tt(){q||Be(),r.showLoading("Cargando configuraciones...");try{const[e,t,a,n,o]=await Promise.all([y.getConfig(),y.getCanciones(),y.getAlumnos(),y.getResultados(),y.getRespuestasRonda()]);$=e.data||{},w.syncFromBackend($),D=t.data||[],T=a.data||[],Z=n.data||[],V=o.data||[];const s=Array.from({length:w.TOTAL_RONDAS},(u,c)=>c+1);_=(await Promise.all(s.map(u=>y.getAudicionesRonda(u)))).flatMap(u=>u.data||[]),de=[..._],q.classList.remove("hidden"),setTimeout(()=>q.classList.remove("opacity-0"),10),Ue()}catch(e){console.error("Error al abrir configuración:",e),r.showToast("Error al cargar datos de configuración","error")}finally{r.hideLoading()}}function Ie(){q&&(q.classList.add("opacity-0"),setTimeout(()=>q.classList.add("hidden"),250))}function at(e){Me=e,q.querySelectorAll(".tab-btn").forEach(t=>{t.dataset.tab===e?t.className="tab-btn px-4 py-3 border-b-2 border-yellow-400 text-yellow-300 flex items-center space-x-2 whitespace-nowrap cursor-pointer":t.className="tab-btn px-4 py-3 border-b-2 border-transparent text-slate-400 hover:text-white flex items-center space-x-2 whitespace-nowrap cursor-pointer"}),Ue()}function Ue(){const e=document.getElementById("config-tab-content");if(e)switch(Me){case"rondas":ze(e);break;case"canciones":ve(e);break;case"sorteo":ot(e);break;case"participantes":re(e);break}}function ot(e){const t=D.filter(n=>n.activa!==!1),a=Object.values(w.ROUNDS).reduce((n,o)=>n+o.audiciones,0);e.innerHTML=`
    <div class="space-y-4">
      <div class="bg-blue-950/60 border border-blue-800 p-4 rounded-xl">
        <h3 class="font-bold text-base text-yellow-300 flex items-center gap-2">
          <span>🎲</span> Sorteo Aleatorio de Repertorio por Rondas
        </h3>
        <p class="text-xs text-slate-300 mt-1">
          Distribuye las canciones activas entre las ${w.TOTAL_RONDAS} rondas. No se repite una obra dentro de la misma ronda; puede volver a aparecer en otra ronda.
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
        <span>Total audiciones programadas: <strong class="text-white">${_.length||a}</strong></span>
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
            ${Te(_)}
          </tbody>
        </table>
      </div>
    </div>
  `,e.querySelector("#btn-generar-sorteo").addEventListener("click",()=>{if(t.length===0){r.showToast("No hay canciones activas para sortear","error");return}const n=[];let o=1;for(let s=1;s<=w.TOTAL_RONDAS;s++){const l=w.ROUNDS[s].audiciones;if(l>t.length){r.showToast(`La Ronda ${s} requiere ${l} canciones distintas, pero solo hay ${t.length} activas.`,"error",5e3);return}const u=nt(t);for(let c=1;c<=l;c++){const m=u[c-1];n.push({ronda:s,audicionNum:c,cancionId:m.id,cancionNombre:m.nombre,cancionCodigo:m.codigo,orden:o++})}}_=n,e.querySelector("#sorteo-preview-body").innerHTML=Te(n),r.showToast("¡Nuevo sorteo aleatorio generado con éxito!","success",2500)}),e.querySelector("#btn-guardar-sorteo").addEventListener("click",async()=>{if(_.length===0){r.showToast("Genera un sorteo antes de guardar","warning");return}const n=!rt(de,_),o=Z.length>0||V.length>0,s=n&&o;if(!(s&&!window.confirm("El sorteo actual ya tiene respuestas o resultados. Si guardas este nuevo sorteo, se borrarán los resultados y respuestas de todas las rondas. ¿Continuar?"))){r.showLoading("Guardando orden de audiciones en la base de datos...");try{const l=await y.guardarAudicionesRonda(_,s),u=!!(l.data&&l.data.reinicioRealizado),c=f.get(),m=u?1:c.rondaActual||1,[b,i,d]=await Promise.all([y.getAudicionesRonda(m),y.getResultados(),y.getRespuestasRonda(m)]);Z=i.data||[],V=d.data||[],de=[..._],f.set({rondaActual:m,rondaCerrada:u?!1:!!c.rondaCerrada,audicionActual:1,audicionesRonda:b.data||[],resultados:Z.filter(g=>Number(g.ronda)===m),respuestasAudicion:V});const x=document.getElementById("select-ronda");x&&(x.value=String(m)),Y(f.get()),U(f.get()),r.showToast("✅ Sorteo de canciones guardado correctamente en la nube","success")}catch(l){console.error("Error al guardar sorteo:",l),r.showToast("Error al guardar sorteo: "+l.message,"error")}finally{r.hideLoading()}}})}function Te(e){return!e||e.length===0?'<tr><td colspan="5" class="p-4 text-center text-slate-500">No hay sorteo cargado. Pulsa "Generar Nuevo Sorteo Aleatorio".</td></tr>':e.map(t=>{var a;return`
    <tr class="border-b border-slate-800/80 hover:bg-slate-800/40">
      <td class="p-2.5 text-center font-bold text-yellow-400">R${t.ronda}</td>
      <td class="p-2.5 text-center text-slate-300">Aud ${t.audicionNum}</td>
      <td class="p-2.5 font-semibold text-white">${S(t.cancionNombre||`Composición #${t.cancionId}`)}</td>
      <td class="p-2.5 text-center font-mono font-bold text-yellow-300">${S(t.cancionCodigo||"----")}</td>
      <td class="p-2.5 text-center text-slate-400">${((a=w.ROUNDS[t.ronda])==null?void 0:a.duracion)||0}s</td>
    </tr>
  `}).join("")}function nt(e){const t=[...e];for(let a=t.length-1;a>0;a--){const n=Math.floor(Math.random()*(a+1));[t[a],t[n]]=[t[n],t[a]]}return t}function rt(e,t){if(e.length!==t.length)return!1;const a=new Map(e.map(n=>[`${n.ronda}:${n.audicionNum}`,String(n.cancionId)]));return t.every(n=>a.get(`${n.ronda}:${n.audicionNum}`)===String(n.cancionId))}function ve(e){e.innerHTML=`
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
        <span class="text-slate-400">Total canciones en repertorio: <strong class="text-white">${D.length}</strong></span>
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
            ${D.map((t,a)=>`
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
  `,e.querySelector("#btn-add-cancion").addEventListener("click",()=>{const t=e.querySelector("#add-cancion-nombre").value.trim(),a=e.querySelector("#add-cancion-codigo").value.trim(),n=e.querySelector("#add-cancion-drive").value.trim(),o=Re(n);if(!t){r.showToast("Ingresa el nombre de la obra","warning");return}const s=D.length>0?Math.max(...D.map(l=>Number(l.id)||0))+1:1;D.push({id:s,nombre:t.toUpperCase(),codigo:a.toUpperCase()||`ST${s.toString().padStart(4,"0")}`,driveId:o,archivoDriveId:o,anio:2026,activa:!0}),ve(e),r.showToast(`Obra "${t}" agregada a la lista`,"info",2e3)}),e.querySelectorAll(".btn-eliminar-cancion").forEach(t=>{t.addEventListener("click",a=>{const n=a.currentTarget.dataset.id;D=D.filter(o=>String(o.id)!==String(n)),ve(e)})}),e.querySelector("#btn-guardar-todas-canciones").addEventListener("click",async()=>{r.showLoading("Guardando lista de canciones en la base de datos...");try{await y.guardarCanciones(D),f.set({canciones:D}),r.showToast("✅ Lista de canciones guardada exitosamente en la nube","success")}catch(t){r.showToast("Error al guardar canciones: "+t.message,"error")}finally{r.hideLoading()}})}function re(e){e.innerHTML=`
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
`),o=[];let s=a?1:T.length>0?Math.max(...T.map(l=>Number(l.id)||0))+1:1;n.forEach(l=>{const u=l.trim();if(!u)return;const c=u.includes("	")?u.split("	"):u.split(","),m=(c[0]||"").trim(),b=(c[1]||"").trim(),i=(c[2]||"").trim();m&&o.push({id:s++,nombre:m,grado:b||"",nivel:i||"",anio:2026,activo:!0})}),a?T=o:T=[...T,...o],re(e),r.showToast(`Se procesaron ${o.length} participantes`,"success")}),e.querySelector("#btn-vaciar-alumnos").addEventListener("click",()=>{confirm("¿Deseas vaciar la lista temporal de participantes?")&&(T=[],re(e))}),e.querySelectorAll(".btn-eliminar-alumno").forEach(t=>{t.addEventListener("click",a=>{const n=a.currentTarget.dataset.id;T=T.filter(o=>String(o.id)!==String(n)),re(e)})}),e.querySelector("#btn-guardar-alumnos-cloud").addEventListener("click",async()=>{r.showLoading("Guardando participantes en la base de datos...");try{await y.guardarAlumnosLote(T,!0),f.set({alumnos:T}),U(f.get()),r.showToast("✅ Participantes guardados exitosamente en la nube","success")}catch(t){r.showToast("Error al guardar participantes: "+t.message,"error")}finally{r.hideLoading()}})}function ze(e){const t=$,a=Number(t.TOTAL_RONDAS)||w.TOTAL_RONDAS,n=Array.from({length:a},(o,s)=>s+1);e.innerHTML=`
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
            <input type="text" id="cfg-nombre-evento" value="${S(t.NOMBRE_EVENTO||"Certamen Audición Musical 2026")}" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white">
          </div>
          <div>
            <label class="block text-xs text-slate-300 mb-1">Compositor Homenajeado:</label>
            <input type="text" id="cfg-homenajeado" value="${S(t.HOMENAJEADO||"Johann Strauss")}" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white">
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
          ${n.map(o=>{const s=me(o,a),l=w.ROUNDS[o]||{duracion:Math.max(2,Math.round(40/Math.pow(2,o-1))),audiciones:o<=2?4:3,minimoPasar:o===a?3:2,puntosPorAcierto:1,bonusClasificar:0},u=Number(t[`DURACION_RONDA_${s}`]??t[`DURACION_RONDA_${o}`]??l.duracion),c=Number(t[`NUM_AUDICIONES_RONDA_${s}`]??t[`NUM_AUDICIONES_RONDA_${o}`]??l.audiciones),m=Number(t[`MINIMO_PASAR_RONDA_${s}`]??t[`MINIMO_PASAR_RONDA_${o}`]??l.minimoPasar),b=Number(t[`PUNTOS_POR_ACIERTO_RONDA_${s}`]??t[`PUNTOS_POR_ACIERTO_RONDA_${o}`]??l.puntosPorAcierto),i=Number(t[`BONUS_POR_CLASIFICAR_RONDA_${s}`]??t[`BONUS_POR_CLASIFICAR_RONDA_${o}`]??l.bonusClasificar);return`
              <div class="bg-slate-900/90 border border-slate-700 p-3 rounded-xl space-y-2">
                <span class="font-bold text-yellow-400 block text-center border-b border-slate-700 pb-1">
                  ${o===a?"Ronda Final":`Ronda ${o}`}
                </span>
                <div>
                  <label class="text-[10px] text-slate-400 block">Duración (seg):</label>
                  <input type="number" id="cfg-dur-${o}" min="1" max="3600" step="1" value="${u}" class="w-full bg-slate-950 border border-slate-700 rounded p-1 text-center font-bold text-white">
                </div>
                <div>
                  <label class="text-[10px] text-slate-400 block">Audiciones:</label>
                  <input type="number" id="cfg-aud-${o}" min="1" max="100" step="1" value="${c}" class="w-full bg-slate-950 border border-slate-700 rounded p-1 text-center font-bold text-white">
                </div>
                <div>
                  <label class="text-[10px] text-slate-400 block">Mínimo clasificar:</label>
                  <input type="number" id="cfg-min-${o}" min="1" max="${c}" step="1" value="${m}" class="w-full bg-slate-950 border border-slate-700 rounded p-1 text-center font-bold text-yellow-300">
                </div>
                <div>
                  <label class="text-[10px] text-slate-400 block">Puntos por acierto:</label>
                  <input type="number" id="cfg-puntos-${o}" min="0" max="10000" step="1" value="${b}" class="w-full bg-slate-950 border border-slate-700 rounded p-1 text-center font-bold text-emerald-300">
                </div>
                <div>
                  <label class="text-[10px] text-slate-400 block">Bonus al clasificar:</label>
                  <input type="number" id="cfg-bonus-${o}" min="0" max="10000" step="1" value="${i}" class="w-full bg-slate-950 border border-slate-700 rounded p-1 text-center font-bold text-emerald-300">
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
            <input type="text" id="cfg-premio-1" value="${S(t.PREMIOS_PRIMER_PUESTO||"Diploma, medalla y premio sorpresa")}" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white">
          </div>
          <div>
            <label class="block text-slate-400 mb-1">🥈 Segundo Puesto:</label>
            <input type="text" id="cfg-premio-2" value="${S(t.PREMIOS_SEGUNDO_PUESTO||"Diploma, medalla y premio sorpresa")}" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white">
          </div>
          <div>
            <label class="block text-slate-400 mb-1">🥉 Tercer Puesto:</label>
            <input type="text" id="cfg-premio-3" value="${S(t.PREMIOS_TERCER_PUESTO||"Diploma y medalla")}" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white">
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
  `,e.querySelector("#cfg-total-rondas").addEventListener("change",o=>{const s=Number(o.currentTarget.value);if(!Number.isInteger(s)||s<1||s>20){r.showToast("La cantidad de rondas debe ser un entero entre 1 y 20.","warning"),o.currentTarget.value=String(a);return}st(e,a),$.TOTAL_RONDAS=s,ze(e)}),e.querySelector("#btn-guardar-reglas-cloud").addEventListener("click",async()=>{const o=Number(e.querySelector("#cfg-total-rondas").value);if(!Number.isInteger(o)||o<1||o>20){r.showToast("La cantidad de rondas debe ser un entero entre 1 y 20.","warning");return}const s={TOTAL_RONDAS:o,NOMBRE_EVENTO:e.querySelector("#cfg-nombre-evento").value.trim(),HOMENAJEADO:e.querySelector("#cfg-homenajeado").value.trim(),ANIO_CERTAMEN:Number(e.querySelector("#cfg-anio").value),PREMIOS_PRIMER_PUESTO:e.querySelector("#cfg-premio-1").value.trim(),PREMIOS_SEGUNDO_PUESTO:e.querySelector("#cfg-premio-2").value.trim(),PREMIOS_TERCER_PUESTO:e.querySelector("#cfg-premio-3").value.trim()};if(!Number.isInteger(s.ANIO_CERTAMEN)||s.ANIO_CERTAMEN<2e3||s.ANIO_CERTAMEN>2100){r.showToast("El año del certamen debe estar entre 2000 y 2100.","warning");return}for(let i=1;i<=o;i++){const d=Number(e.querySelector(`#cfg-dur-${i}`).value),x=Number(e.querySelector(`#cfg-aud-${i}`).value),g=Number(e.querySelector(`#cfg-min-${i}`).value),v=Number(e.querySelector(`#cfg-puntos-${i}`).value),p=Number(e.querySelector(`#cfg-bonus-${i}`).value);if(!Number.isInteger(d)||d<1||d>3600||!Number.isInteger(x)||x<1||x>100||!Number.isInteger(g)||g<1||g>x||!Number.isInteger(v)||v<0||v>1e4||!Number.isInteger(p)||p<0||p>1e4){r.showToast(`Revisa los valores de la Ronda ${i}: duración 1–3600, audiciones 1–100, mínimo 1–audiciones y puntos/bonus 0–10000.`,"warning",5e3);return}const h=me(i,o);s[`DURACION_RONDA_${h}`]=d,s[`NUM_AUDICIONES_RONDA_${h}`]=x,s[`MINIMO_PASAR_RONDA_${h}`]=g,s[`PUNTOS_POR_ACIERTO_RONDA_${h}`]=v,s[`BONUS_POR_CLASIFICAR_RONDA_${h}`]=p}const l=o!==w.TOTAL_RONDAS||Object.entries(s).some(([i,d])=>/^(DURACION_RONDA_|NUM_AUDICIONES_RONDA_|MINIMO_PASAR_RONDA_)/.test(i)&&String($[i]===void 0?"":$[i])!==String(d)),u=Object.entries(s).some(([i,d])=>/^(PUNTOS_POR_ACIERTO_RONDA_|BONUS_POR_CLASIFICAR_RONDA_)/.test(i)&&String($[i]===void 0?i.indexOf("PUNTOS_POR_ACIERTO_")===0?1:0:$[i])!==String(d)),c=l||u,m=Z.length>0||V.length>0,b=c&&m;if(!(b&&!window.confirm("Cambiar las reglas o los puntajes reiniciará las respuestas y los resultados guardados de todas las rondas. Si cambias la cantidad o los parámetros de las audiciones, también se reiniciará el sorteo. ¿Continuar?"))){r.showLoading("Actualizando parámetros en la base de datos...");try{if(await y.guardarConfigLote(s,b),$={...$,...s},w.syncFromBackend($),l&&(_=[],de=[]),b){V=[],Z=[];for(let v=1;v<=w.TOTAL_RONDAS;v++)$[`RONDA_CERRADA_${v}`]=!1,w.COMPLETED_ROUNDS[v]=!1}const i=f.get(),d=Number(i.rondaActual)||1,x=b||d>o?1:d;(l||b)&&f.set({rondaActual:x,rondaVista:x,rondaHistorial:null,rondaCerrada:!1,audicionActual:1,audicionesRonda:l?[]:i.audicionesRonda,resultados:b?[]:(i.resultados||[]).filter(v=>Number(v.ronda)===x),respuestasAudicion:b?[]:[]}),it();const g=document.getElementById("select-ronda");g&&(g.value=String(x)),F(),Y(f.get()),U(f.get()),r.showToast("✅ Paso 1 guardado. Continúa con canciones y luego realiza el sorteo.","success",4500)}catch(i){r.showToast("Error al actualizar configuración: "+i.message,"error")}finally{r.hideLoading()}}})}function st(e,t){for(let a=1;a<=t;a++){const n=e.querySelector(`#cfg-dur-${a}`),o=e.querySelector(`#cfg-aud-${a}`),s=e.querySelector(`#cfg-min-${a}`),l=e.querySelector(`#cfg-puntos-${a}`),u=e.querySelector(`#cfg-bonus-${a}`),c=me(a,t);n&&($[`DURACION_RONDA_${c}`]=Number(n.value)),o&&($[`NUM_AUDICIONES_RONDA_${c}`]=Number(o.value)),s&&($[`MINIMO_PASAR_RONDA_${c}`]=Number(s.value)),l&&($[`PUNTOS_POR_ACIERTO_RONDA_${c}`]=Number(l.value)),u&&($[`BONUS_POR_CLASIFICAR_RONDA_${c}`]=Number(u.value))}}function it(){const e=document.getElementById("select-ronda");if(!e)return;const t=Number(e.value);e.innerHTML=Object.entries(w.ROUNDS).map(([a,n])=>`<option value="${a}">${S(se(a,n))}</option>`).join(""),e.value=String(t<=w.TOTAL_RONDAS?t:1)}async function Le(){r.init(),r.showLoading("Conectando con el certamen...");try{let e=[],t=[],a=[],n=[],o=[],s=1,l=!1;try{const[c,m,b,i]=await Promise.all([y.getConfig().catch(v=>(console.warn("[APP] No se pudo cargar configuración del backend:",v),{data:{}})),y.getCanciones().catch(()=>({data:[]})),y.getAlumnos().catch(()=>({data:[]})),y.getEstadoCertamen().catch(()=>({data:null}))]);w.syncFromBackend(c.data||{}),e=m.data||[],t=b.data||[],i&&i.data&&(s=i.data.rondaActual||1,l=!!i.data.rondaCerrada),w.ROUNDS[s]||(s=1);const[d,x,g]=await Promise.all([y.getAudicionesRonda(s).catch(()=>({data:[]})),y.getResultados(s).catch(()=>({data:[]})),y.getRespuestasRonda(s).catch(v=>(console.warn("[APP] Backend aún no expone las respuestas por audición:",v),{data:[]}))]);a=d.data||[],n=x.data||[],o=g.data||[]}catch(c){console.warn("[APP] Aviso de red al conectar el servicio de datos:",c),r.showToast("Modo sin conexión o dirección del servicio de datos pendiente. Cargando vista.","warning",4e3)}f.set({canciones:e,alumnos:t,rondaActual:s,rondaVista:s,rondaHistorial:null,rondaCerrada:l,audicionActual:1,audicionesRonda:a,resultados:n,respuestasAudicion:o,isLoading:!1}),Ke(),et();const u=r.get("selectRonda");u&&(u.innerHTML=Object.entries(w.ROUNDS).map(([c,m])=>`<option value="${c}">${se(c,m)}</option>`).join(""),u.value=String(s)),F(),Y(f.get()),U(f.get()),console.log("✅ Aplicación inicializada correctamente"),r.showToast("Certamen listo para audición","success",2500)}catch(e){console.error("❌ Error al inicializar:",e),r.showToast("Error al conectar con la base de datos.","error",5e3)}finally{r.hideLoading()}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Le):Le();
