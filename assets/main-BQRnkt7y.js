import{C as y,f as J,a as Me,b as f,g as ce}from"./formatters-MPK7lu-a.js";class ze{constructor(){this.state={rondaActual:1,rondaCerrada:!1,audicionActual:0,alumnos:[],canciones:[],configRonda:null,resultados:{},respuestasAudicion:[],isLoading:!1,error:null},this.listeners=[]}get(){return{...this.state}}set(t){this.state={...this.state,...t},this.notify()}subscribe(t){return this.listeners.push(t),()=>{this.listeners=this.listeners.filter(a=>a!==t)}}notify(){this.listeners.forEach(t=>t(this.state))}}const p=new ze,r={elements:{},init(){return this._ensureFeedbackElements(),this.elements={selectRonda:document.getElementById("select-ronda"),audicionNumero:document.getElementById("audicion-numero"),btnPlay:document.getElementById("btn-play"),listaAlumnos:document.getElementById("lista-alumnos"),btnGuardarAciertos:document.getElementById("btn-guardar-aciertos"),btnFinalizarRonda:document.getElementById("btn-finalizar-ronda"),btnResetRonda:document.getElementById("btn-reset-ronda"),btnVerRanking:document.getElementById("btn-ver-ranking"),rankingSection:document.getElementById("ranking-section"),rankingContent:document.getElementById("ranking-content"),loadingOverlay:document.getElementById("loading-overlay"),toast:document.getElementById("toast")},this.elements},_ensureFeedbackElements(){if(!document.getElementById("loading-overlay")){const e=document.createElement("div");e.id="loading-overlay",e.className="fixed inset-0 bg-black/75 z-50 flex flex-col items-center justify-center transition-opacity duration-300 hidden",e.innerHTML=`
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400 mb-4"></div>
        <p id="loading-text" class="text-white text-xl font-semibold tracking-wide">Cargando...</p>
      `,document.body.appendChild(e)}if(!document.getElementById("toast")){const e=document.createElement("div");e.id="toast",e.className="fixed bottom-5 right-5 z-50 max-w-md px-6 py-4 rounded-xl shadow-2xl text-white font-medium transform transition-all duration-300 translate-y-20 opacity-0 pointer-events-none flex items-center space-x-3",document.body.appendChild(e)}},get(e){return this.elements[e]||(this.elements[e]=document.getElementById(e)),this.elements[e]},showLoading(e="Procesando..."){const t=this.get("loadingOverlay");if(t){const a=document.getElementById("loading-text");a&&(a.textContent=e),t.classList.remove("hidden"),setTimeout(()=>t.classList.remove("opacity-0"),10)}},hideLoading(){const e=this.get("loadingOverlay");e&&(e.classList.add("opacity-0"),setTimeout(()=>e.classList.add("hidden"),250))},showToast(e,t="info",a=3500){const o=this.get("toast");if(!o)return;const s={success:"bg-emerald-600 border border-emerald-400",error:"bg-rose-600 border border-rose-400",warning:"bg-amber-600 border border-amber-400",info:"bg-blue-600 border border-blue-400"},n={success:"✓",error:"✕",warning:"⚠",info:"ℹ"};o.className=`fixed bottom-5 right-5 z-50 max-w-md px-6 py-4 rounded-xl shadow-2xl text-white font-medium transform transition-all duration-300 flex items-center space-x-3 ${s[t]||s.info}`,o.innerHTML=`
      <span class="text-2xl font-bold">${n[t]||"ℹ"}</span>
      <span class="flex-1">${e}</span>
    `,o.classList.remove("translate-y-20","opacity-0","pointer-events-none"),o.classList.add("translate-y-0","opacity-100"),this._toastTimer&&clearTimeout(this._toastTimer),this._toastTimer=setTimeout(()=>{o.classList.add("translate-y-20","opacity-0","pointer-events-none"),o.classList.remove("translate-y-0","opacity-100")},a)}};function xe(e){if(!e||typeof e!="string")return"";const t=e.trim();if(t.startsWith("[")&&t.endsWith("]")||t.toLowerCase()==="file_id"||t==="")return"";const a=t.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);if(a&&a[1])return a[1];const o=t.match(/[?&]id=([a-zA-Z0-9_-]+)/);if(o&&o[1])return o[1];const s=t.match(/\/d\/([a-zA-Z0-9_-]+)/);return s&&s[1]?s[1]:(/^[a-zA-Z0-9_-]{20,60}$/.test(t),t)}function Be(e,t=y.TOTAL_RONDAS||5){const a=Number(e);return Number.isInteger(a)&&a>=1&&a<=t}function Ue(e){const t=xe(e);return t?/^[a-zA-Z0-9_-]{20,60}$/.test(t):!1}function E(e){return e==null?"":String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function K(e){return String(e||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase().replace(/[^A-Z0-9]/g,"")}function B(e,t){let a=[],o=[],s=[],n=1,c=!1,g=4,u=1;if(e&&Array.isArray(e.alumnos))a=e.alumnos||[],o=Array.isArray(e.resultados)?e.resultados:Object.values(e.resultados||{}),s=Array.isArray(e.respuestasAudicion)?e.respuestasAudicion:[],n=e.rondaActual||1,c=!!e.rondaCerrada,u=e.audicionActual||1,g=(y.ROUNDS[n]||{audiciones:4}).audiciones;else{a=Array.isArray(e)?e:[],o=Array.isArray(t)?t:[];const b=r.get("selectRonda");b&&(n=parseInt(b.value,10)||1);const h=r.get("audicionNumero");h&&(u=parseInt(h.textContent,10)||1),g=(y.ROUNDS[n]||{audiciones:4}).audiciones}const d=r.get("listaAlumnos");if(!d)return;if(a.length===0){d.innerHTML=`
      <div class="col-span-full text-center py-8 text-blue-200">
        <p class="text-lg">No hay alumnos registrados o activos para este certamen.</p>
      </div>
    `;return}const m={},i={};o.forEach(b=>{if(parseInt(b.ronda,10)===n&&(m[String(b.alumnoId)]=b),b.eliminado){const h=b.rondaEliminacion||b.ronda;(!i[String(b.alumnoId)]||h<i[String(b.alumnoId)])&&(i[String(b.alumnoId)]=h)}});const x=(y.ROUNDS[n]||{minimoPasar:2}).minimoPasar,N=s.filter(b=>Number(b.ronda)===Number(n));d.innerHTML=a.map(b=>{var ve;const h=m[String(b.id)],R=N.filter($=>String($.alumnoId)===String(b.id)),v=R.length>0?R.filter($=>$.correcto===!0||String($.correcto).toLowerCase()==="true").length:h?parseInt(h.aciertos,10):0,A=b.rondaEliminacion||i[String(b.id)],S=A&&A<n,T=h?h.eliminado:!1,X=J(b.nombre);let U="bg-blue-900/60 text-blue-200 border border-blue-400/30",ee="En competencia";S?(U="bg-rose-950 text-rose-300 border border-rose-800",ee=`❌ Eliminado en Ronda ${A}`):T?(U="bg-red-900/80 text-red-200 border border-red-500",ee=`Eliminado en Ronda ${n}`):v>=x&&(U="bg-emerald-900/80 text-emerald-200 border border-emerald-500",ee=`Clasificado (${v}/${g})`);let ye="";for(let $=1;$<=g;$++){const Z=R.find(_e=>Number(_e.audicionNum)===$),re=Z&&(Z.correcto===!0||String(Z.correcto).toLowerCase()==="true"),se=$===u,Pe=c||S||!se;ye+=`
        <label class="flex flex-col items-center justify-center cursor-pointer p-1.5 rounded-lg border transition select-none ${se?"bg-yellow-500/20 border-yellow-400 shadow-md ring-1 ring-yellow-400":"bg-blue-950/60 hover:bg-blue-900 border-blue-700/50"}">
          <span class="text-xs ${se?"text-yellow-300 font-extrabold":"text-slate-300"} mb-1">Aud ${$}</span>
          <input 
            type="checkbox" 
            class="checkbox-acierto w-5 h-5 text-yellow-500 bg-blue-900 rounded border-gray-400 focus:ring-yellow-400 focus:ring-2 cursor-pointer"
            data-alumno-id="${E(b.id)}"
            data-audicion="${$}"
            ${re?"checked":""}
            ${Pe?"disabled":""}
          />
          <span class="text-[9px] ${Z?re?"text-emerald-300":"text-rose-300":"text-slate-500"}">${Z?re?"Correcta":"Error":"Pendiente"}</span>
        </label>
      `}return`
      <div class="alumno-card bg-slate-800/90 border border-slate-700 rounded-xl p-4 shadow-md transition hover:border-yellow-500/50 ${S?"opacity-40 bg-slate-950 cursor-not-allowed":""}" data-alumno-card="${E(b.id)}">
        <div class="flex items-start justify-between mb-2">
          <div>
            <h3 class="font-bold text-base md:text-lg text-white">${E(X)}</h3>
            <p class="text-xs text-slate-300">${E(b.grado||"")} ${E(b.nivel||"")}</p>
          </div>
          <span class="text-xs px-2.5 py-1 rounded-full font-medium ${U}">
            ${ee}
          </span>
        </div>

        <!-- Checkboxes de audiciones -->
        <div class="mt-2">
          <div class="text-xs text-slate-400 mb-1.5 flex justify-between items-center">
            <span>Aciertos Ronda ${n}:</span>
            <span class="font-bold text-yellow-400"><span id="aciertos-count-${b.id}">${v}</span> / ${g}</span>
          </div>
          <div class="grid grid-cols-${Math.min(g,4)} gap-1.5">
            ${ye}
          </div>
        </div>

        <!-- Entrada rápida de respuesta de pizarra para el jurado -->
        ${S?"":`
          <div class="mt-3 pt-2 border-t border-slate-700/60 flex items-center gap-2">
            <span class="text-xs text-slate-400 whitespace-nowrap">✏️ Pizarra:</span>
            <input 
              type="text" 
              placeholder="Código escrito (ej: TP2380)"
              class="input-pizarra-alumno bg-slate-950 text-yellow-300 border border-slate-700 uppercase font-mono text-xs px-2.5 py-1 rounded-lg w-full focus:ring-1 focus:ring-yellow-400 focus:outline-none"
              data-alumno-id="${E(b.id)}"
              data-audicion="${u}"
              ${c?"disabled":""}
              value="${E(((ve=R.find($=>Number($.audicionNum)===u))==null?void 0:ve.respuesta)||"")}"
            />
          </div>
        `}
      </div>
    `}).join("")}function V(e,t){let a=[],o=1,s=1;if(e&&e.rondaActual!==void 0)o=e.rondaActual,a=e.audicionesRonda||e.audiciones||[],s=e.audicionActual||1;else{a=Array.isArray(e)?e:[],o=1;const l=r.get("audicionNumero");l&&(s=parseInt(l.textContent,10)||1)}const n=r.get("audicionNumero");n&&(n.textContent=String(s));const c=a.find(l=>l.audicionNum===s)||a[s-1],g=document.getElementById("admin-cancion-nombre"),u=document.getElementById("admin-cancion-codigo"),d=document.getElementById("admin-seg-duracion"),m=y.ROUNDS[o]||{duracion:40,audiciones:4};g&&(g.textContent=c?c.cancionNombre||`Composición #${c.cancionId}`:"Composición no asignada"),u&&(u.textContent=c&&c.cancionCodigo||"----"),d&&(d.textContent=String(m.duracion||40));const i=document.getElementById("ronda-info-detalles");i&&(i.innerHTML=`
      <div class="flex flex-wrap items-center justify-between text-xs md:text-sm bg-blue-950/70 p-3 rounded-lg border border-blue-700/60 mt-3 gap-2">
        <span>⏱ <strong>Duración:</strong> ${m.duracion||40}s por audición</span>
        <span>🎯 <strong>Mínimo para clasificar:</strong> ${m.minimoPasar||2} aciertos</span>
        <span>🎼 <strong>Total audiciones:</strong> ${m.audiciones||4}</span>
      </div>
    `)}function we(e){const t=r.get("rankingContent");if(!t)return;if(!e||e.length===0){t.innerHTML=`
      <div class="text-center py-6 text-slate-300">
        <p>Aún no hay puntajes registrados en el certamen.</p>
      </div>
    `;return}const a=e.slice(0,3),o=je(a),s=e.map((n,c)=>{const g=c+1;let u=`<span class="font-bold text-slate-300">${Me(g)}</span>`,d="hover:bg-slate-700/50";g===1?(u='<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500 text-slate-950 font-black shadow-lg">🥇 1°</span>',d="bg-yellow-500/10 hover:bg-yellow-500/20 border-l-4 border-yellow-500"):g===2?(u='<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-300 text-slate-950 font-black shadow-lg">🥈 2°</span>',d="bg-slate-300/10 hover:bg-slate-300/20 border-l-4 border-slate-300"):g===3&&(u='<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-700 text-amber-100 font-black shadow-lg">🥉 3°</span>',d="bg-amber-700/10 hover:bg-amber-700/20 border-l-4 border-amber-600");const m=n.eliminado?`Eliminado en Ronda ${n.rondaEliminacion||1}`:`Activo (Ronda ${n.rondaMax||1})`;return`
      <tr class="border-b border-slate-700/60 ${d} transition-colors">
        <td class="p-3 text-center">${u}</td>
        <td class="p-3 font-semibold text-white">
          ${E(J(n.nombre))}
          ${n.premio?`<span class="block text-xs text-yellow-400 font-normal">🎁 ${n.premio}</span>`:""}
        </td>
        <td class="p-3 text-slate-300 text-sm">${E(n.grado||"")} ${E(n.nivel||"")}</td>
        <td class="p-3 text-center">
          <span class="inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${n.eliminado?"bg-rose-950 text-rose-300 border border-rose-800":"bg-emerald-950 text-emerald-300 border border-emerald-800"}">
            ${m}
          </span>
        </td>
        <td class="p-3 text-right font-bold text-yellow-400 text-lg">
          ${n.puntosTotal||0}
        </td>
      </tr>
    `}).join("");t.innerHTML=`
    ${o}

    <div class="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900/80 shadow-xl mt-6">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-950 text-slate-300 text-xs uppercase tracking-wider border-b border-slate-700">
            <th class="p-3 text-center w-16">Puesto</th>
            <th class="p-3">Participante</th>
            <th class="p-3">Grado</th>
            <th class="p-3 text-center">Estado del Participante</th>
            <th class="p-3 text-right">Puntos Totales</th>
          </tr>
        </thead>
        <tbody>
          ${s}
        </tbody>
      </table>
    </div>
  `}function je(e){if(!e||e.length===0)return"";const[t,a,o]=e;return`
    <div class="podium-container flex justify-center items-end gap-3 md:gap-6 my-8 px-2 max-w-2xl mx-auto">
      
      <!-- 2do Puesto -->
      <div class="flex-1 text-center order-1 transform transition hover:-translate-y-1">
        ${a?`
          <div class="bg-slate-800/90 border-2 border-slate-300 rounded-t-2xl p-4 shadow-xl flex flex-col items-center">
            <div class="w-12 h-12 rounded-full bg-slate-300 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg mb-2">
              🥈
            </div>
            <p class="font-bold text-white text-sm md:text-base line-clamp-1">${E(J(a.nombre))}</p>
            <p class="text-xs text-slate-300 mb-2">${E(a.grado||"")}</p>
            <div class="bg-slate-900/80 text-yellow-400 px-3 py-1 rounded-full text-sm font-extrabold border border-slate-700">
              ${a.puntosTotal||0} pts
            </div>
            <div class="h-20 md:h-28 w-full bg-gradient-to-t from-slate-700 to-slate-600 rounded-lg mt-3 flex items-center justify-center text-slate-200 font-black text-2xl shadow-inner">
              2°
            </div>
          </div>
        `:'<div class="h-32"></div>'}
      </div>

      <!-- 1er Puesto (Centro y más alto) -->
      <div class="flex-1 text-center order-2 transform scale-105 transition hover:scale-110 z-10">
        ${t?`
          <div class="bg-gradient-to-b from-yellow-950/80 to-slate-900 border-2 border-yellow-400 rounded-t-2xl p-5 shadow-2xl flex flex-col items-center relative overflow-hidden">
            <div class="absolute top-0 right-0 left-0 h-1 bg-yellow-400"></div>
            <div class="w-16 h-16 rounded-full bg-yellow-400 text-slate-950 font-black text-3xl flex items-center justify-center shadow-yellow-500/50 shadow-lg mb-2 animate-bounce">
              👑
            </div>
            <p class="font-extrabold text-yellow-300 text-base md:text-lg line-clamp-1">${E(J(t.nombre))}</p>
            <p class="text-xs text-yellow-200/80 mb-2">${E(t.grado||"")}</p>
            <div class="bg-yellow-500 text-slate-950 px-4 py-1.5 rounded-full text-sm font-black shadow-md">
              ${t.puntosTotal||0} pts
            </div>
            <div class="h-28 md:h-36 w-full bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-lg mt-3 flex items-center justify-center text-slate-950 font-black text-3xl shadow-lg">
              🥇 1°
            </div>
          </div>
        `:'<div class="h-44"></div>'}
      </div>

      <!-- 3er Puesto -->
      <div class="flex-1 text-center order-3 transform transition hover:-translate-y-1">
        ${o?`
          <div class="bg-slate-800/90 border-2 border-amber-600 rounded-t-2xl p-4 shadow-xl flex flex-col items-center">
            <div class="w-12 h-12 rounded-full bg-amber-700 text-white font-black text-2xl flex items-center justify-center shadow-lg mb-2">
              🥉
            </div>
            <p class="font-bold text-white text-sm md:text-base line-clamp-1">${E(J(o.nombre))}</p>
            <p class="text-xs text-slate-300 mb-2">${E(o.grado||"")}</p>
            <div class="bg-slate-900/80 text-yellow-400 px-3 py-1 rounded-full text-sm font-extrabold border border-slate-700">
              ${o.puntosTotal||0} pts
            </div>
            <div class="h-14 md:h-20 w-full bg-gradient-to-t from-amber-800 to-amber-700 rounded-lg mt-3 flex items-center justify-center text-amber-200 font-black text-2xl shadow-inner">
              3°
            </div>
          </div>
        `:'<div class="h-24"></div>'}
      </div>

    </div>
  `}function Ce(e,t){return new Map((Array.isArray(e)?e:[]).filter(a=>Number(a.audicionNum)===Number(t)).map(a=>[String(a.alumnoId),a]))}function Ie(e,t,a){if(!Array.isArray(a)||a.length===0)return!1;const o=Ce(e,t);return a.every(s=>o.has(String(s)))}let I=!1,G=!1,w=1,M=null,j=null,_={startSec:0,endSec:40,duration:40},z=null,te=null,oe=!1,W=!1;function qe(){r.init(),w=p.get().audicionActual||1;const e=r.get("btnPlay");e&&e.addEventListener("click",async()=>{if(I){Ge();return}if(G)return;G=!0,Ne(!0);const i=p.get(),l=i.rondaActual||1;let x=i.audicionesRonda||[];if(!x||x.length===0){r.showLoading("Obteniendo audición configurada...");try{x=(await f.getAudicionesRonda(l)).data||[],p.set({audicionesRonda:x})}catch(v){console.error("[AUDIO] No se pudieron cargar audiciones desde backend:",v),r.showToast("No se pudo cargar el sorteo de audiciones.","error"),G=!1,Y();return}finally{r.hideLoading()}}const N=x.find(v=>v.audicionNum===w)||x[w-1]||{};if(!N.cancionId){r.showToast("No hay un sorteo guardado para esta audición. Configura las canciones y genera el sorteo.","warning",4500),G=!1,Y();return}j=N;const b=xe(N.driveId||N.archivoDriveId);if(!Ue(b)){r.showToast("La canción asignada no tiene un archivo de audio válido en Google Drive.","error",4500),G=!1,Y();return}const h=document.getElementById("chk-random-start"),R=h?h.checked:!0;try{const v=`${Date.now()}-${Math.random().toString(36).slice(2,10)}`;z=v,oe=!1;const A=await f.solicitarReproduccionProyector({commandId:v,ronda:l,audicionNum:w,fileId:b,randomStart:R});if(A.data&&A.data.status!=="loading")throw new Error("El proyector no aceptó la orden de reproducción.");I=!0,pe(!0),D(`⏳ Enviando audición ${w} al proyector...`),ge(v)}catch(v){if(z)try{const A=await f.getReproduccionProyector();if(A.data&&String(A.data.commandId)===z&&["loading","countdown","playing"].includes(A.data.status)){I=!0,pe(!0),D("✅ La orden fue recibida; sincronizando con el proyector..."),ge(z);return}}catch(A){console.error("[PROYECTOR] No se pudo confirmar la orden:",A)}console.error("[PROYECTOR] No se pudo solicitar la reproducción:",v),z=null,I=!1,D("⚠️ No se pudo iniciar la reproducción en el proyector."),r.showToast(`No se pudo iniciar la audición: ${v.message}`,"error",5e3),Y()}finally{G=!1,Ne(!1)}});const t=document.getElementById("btn-prev-audicion"),a=document.getElementById("btn-next-audicion");t&&t.addEventListener("click",()=>{if(w>1){if(ue()&&!window.confirm("Hay respuestas sin guardar. ¿Descartarlas y volver a la audición anterior?"))return;w--,Ae(w),k()}}),a&&a.addEventListener("click",()=>{const i=p.get(),l=y.ROUNDS[i.rondaActual]||{audiciones:4};if(I){r.showToast("Espera a que termine el audio antes de cambiar de audición.","warning");return}if(!Te()||ue()){r.showToast("Verifica y guarda las respuestas de esta audición antes de avanzar.","warning",4e3);return}w<l.audiciones&&(w++,Ae(w),k())});const o={AUDICION:document.getElementById("btn-modo-audicion"),CLASIFICADOS:document.getElementById("btn-modo-clasificados"),RANKING_FINAL:document.getElementById("btn-modo-ranking")};Object.entries(o).forEach(([i,l])=>{l&&l.addEventListener("click",async()=>{Re(i,o),r.showToast(`Proyector configurado en: ${i}`,"info",2e3);try{await f.actualizarModoProyector(i)}catch(x){console.warn("Error al sincronizar modo proyector:",x)}})});const s=r.get("selectRonda");s&&s.addEventListener("change",async i=>{const l=parseInt(i.target.value,10);if(!Be(l)){r.showToast("Ronda inválida","error");return}const x=p.get();if(I){i.target.value=String(x.rondaActual||1),r.showToast("Espera a que termine el audio antes de cambiar de ronda.","warning");return}if(l>(x.rondaActual||1)&&!me()){i.target.value=String(x.rondaActual||1),r.showToast("Guarda todas las respuestas de la ronda actual antes de avanzar.","warning",4e3);return}r.showLoading(`Cargando Ronda ${l}...`);try{w=1,await f.actualizarRondaActual(l);const[N,b,h,R,v]=await Promise.all([f.getAudicionesRonda(l),f.getResultados(l),f.getAlumnos(),f.getRespuestasRonda(l),f.getEstadoCertamen()]);p.set({rondaActual:l,rondaCerrada:!!(v.data&&v.data.rondaCerrada),audicionActual:1,audicionesRonda:N.data||[],resultados:b.data||[],alumnos:h.data||[],respuestasAudicion:R.data||[]}),V(p.get()),B(p.get());const A=y.ROUNDS[l]||{duracion:40};he(0,A.duracion),k(),r.showToast(`Secuencia: Ronda ${l} activada`,"success")}catch(N){console.error("Error al cambiar ronda:",N),i.target.value=String(x.rondaActual||1),r.showToast("Error al cambiar de ronda: "+N.message,"error")}finally{r.hideLoading()}});const n=r.get("listaAlumnos");n&&(n.addEventListener("input",i=>{if(i.target&&i.target.classList.contains("input-pizarra-alumno")){const l=i.target.dataset.alumnoId,x=i.target.value.trim().toUpperCase(),b=p.get().audicionesRonda||[],h=b.find(U=>U.audicionNum===w)||b[w-1]||{},R=K(h.cancionCodigo),v=K(h.cancionNombre),A=[...n.querySelectorAll("[data-alumno-card]")].find(U=>U.getAttribute("data-alumno-card")===l);if(!A)return;const S=A.querySelector(`.checkbox-acierto[data-audicion="${w}"]`),T=K(i.target.value);T!==""&&(T===R||T===v)?(i.target.classList.remove("border-slate-700","border-rose-500"),i.target.classList.add("border-emerald-400","bg-emerald-950/60"),S&&!S.checked&&(S.checked=!0,ie(A,l))):x===""?(i.target.classList.remove("border-emerald-400","bg-emerald-950/60","border-rose-500"),i.target.classList.add("border-slate-700"),S&&(S.checked=!1)):(i.target.classList.remove("border-emerald-400","bg-emerald-950/60","border-slate-700"),i.target.classList.add("border-rose-500"),S&&(S.checked=!1)),ie(A,l),k()}}),n.addEventListener("change",i=>{if(i.target&&i.target.classList.contains("checkbox-acierto")){const l=i.target.dataset.alumnoId,x=document.querySelector(`[data-alumno-card="${l}"]`);x&&ie(x,l),k()}}));const c=r.get("btnGuardarAciertos");c&&c.addEventListener("click",async()=>{const i=p.get(),l=i.rondaActual||1,x=w;if(I){r.showToast("Espera a que termine el audio antes de guardar respuestas.","warning");return}const N=Q(i),b=[...document.querySelectorAll("[data-alumno-card]")];let h;try{h=N.map(R=>{const v=b.find(X=>X.getAttribute("data-alumno-card")===String(R.id));if(!v)throw new Error(`No se encontró la ficha del participante ${R.id}.`);const A=v.querySelector(`.input-pizarra-alumno[data-audicion="${x}"]`),S=v.querySelector(`.checkbox-acierto[data-audicion="${x}"]`),T=A?A.value.trim():"";return{alumnoId:R.id,respuesta:T,correcto:T!==""&&!!(S&&S.checked)}})}catch(R){console.error("Error al preparar respuestas:",R),r.showToast("Error al preparar respuestas: "+R.message,"error");return}if(h.length===0){r.showToast("No hay participantes elegibles para guardar.","warning");return}r.showLoading("Guardando respuestas de esta audición...");try{await f.guardarRespuestasAudicion({ronda:l,audicionNum:x,respuestas:h});const[R,v]=await Promise.all([f.getRespuestasRonda(l),f.getResultados(l)]);p.set({respuestasAudicion:R.data||[],resultados:v.data||[]}),B(p.get()),V(p.get()),k();const A=h.filter(S=>S.correcto).length;r.showToast(`Audición ${x} guardada: ${A} correctas y ${h.length-A} errores.`,"success",4500)}catch(R){console.error("Error al guardar respuestas:",R),r.showToast("❌ Error al guardar respuestas: "+R.message,"error")}finally{r.hideLoading()}});const g=r.get("btnFinalizarRonda");g&&g.addEventListener("click",async()=>{const l=p.get().rondaActual||1,x=y.ROUNDS[l]||{minimoPasar:2};if(!me()){r.showToast("No se puede finalizar: guarda las respuestas de todas las audiciones primero.","warning",4500);return}if(window.confirm(`¿Desea FINALIZAR la Ronda ${l}?

• Mínimo exigido: ${x.minimoPasar} aciertos
• Los alumnos con menos de ${x.minimoPasar} aciertos quedarán marcados como ELIMINADOS EN RONDA ${l}.
• El proyector pasará automáticamente al modo CLASIFICADOS.

¿Continuar?`)){r.showLoading("Finalizando ronda y calculando clasificación...");try{const h=(await f.finalizarRonda(l)).data||{};r.showToast(`Ronda ${l} Finalizada: ${h.pasanCount||0} clasifican, ${h.eliminadosCount||0} eliminados`,"success",5e3);const[R,v,A]=await Promise.all([f.getResultados(l),f.getRanking(),f.getAlumnos()]);p.set({resultados:R.data||[],ranking:v.data||[],alumnos:A.data||[],rondaCerrada:!0}),B(p.get()),Re(l===y.TOTAL_RONDAS?"RANKING_FINAL":"CLASIFICADOS",o);const S=r.get("rankingSection");if(S&&!S.classList.contains("hidden")&&we(v.data||[]),h.siguienteRonda&&h.siguienteRonda!==l&&h.siguienteRonda<=y.TOTAL_RONDAS){const T=r.get("selectRonda");T&&(T.value=String(h.siguienteRonda),T.dispatchEvent(new Event("change")))}}catch(b){console.error("Error al finalizar ronda:",b),r.showToast("Error al finalizar ronda: "+b.message,"error")}finally{r.hideLoading()}}});const u=r.get("btnResetRonda");u&&u.addEventListener("click",async()=>{const l=p.get().rondaActual||1;if(window.confirm(`⚠️ ATENCIÓN: ¿Está seguro de RESETEAR la Ronda ${l}?

Se borrarán las respuestas y resultados de la Ronda ${l} y de las rondas posteriores.`)){r.showLoading(`Reseteando datos de la Ronda ${l}...`);try{await f.resetRonda(l);const[N,b,h]=await Promise.all([f.getResultados(l),f.getAlumnos(),f.getRespuestasRonda(l)]);p.set({resultados:N.data||[],alumnos:b.data||[],respuestasAudicion:h.data||[],rondaCerrada:!1}),B(p.get()),k(),r.showToast(`Ronda ${l} ha sido reseteada correctamente`,"warning")}catch(N){console.error("Error al resetear ronda:",N),r.showToast("Error al resetear ronda: "+N.message,"error")}finally{r.hideLoading()}}});const d=r.get("btnVerRanking"),m=r.get("rankingSection");d&&m&&d.addEventListener("click",async()=>{if(m.classList.contains("hidden")){r.showLoading("Calculando tabla de posiciones y ranking...");try{const x=(await f.getRanking()).data||[];p.set({ranking:x}),we(x),m.classList.remove("hidden"),d.textContent="✕ Ocultar Ranking",d.classList.replace("bg-purple-700","bg-purple-900"),m.scrollIntoView({behavior:"smooth"})}catch(l){console.error("Error al obtener ranking:",l),r.showToast("Error al obtener ranking: "+l.message,"error")}finally{r.hideLoading()}}else m.classList.add("hidden"),d.textContent="🏆 Ver Ranking",d.classList.replace("bg-purple-900","bg-purple-700")}),k()}function Ae(e){p.set({audicionActual:e}),V(p.get()),B(p.get());const t=p.get(),a=y.ROUNDS[t.rondaActual]||{duracion:40};he(0,a.duracion)}function Q(e=p.get()){const t=Number(e.rondaActual)||1;return(e.alumnos||[]).filter(a=>{const o=Number(a.rondaEliminacion);return Number.isInteger(o)&&o>0?o>=t:!a.eliminado})}function Te(e=p.get()){const t=Q(e);return Ie(e.respuestasAudicion,w,t.map(a=>a.id))}function ue(e=p.get()){const t=Ce(e.respuestasAudicion,w),a=[...document.querySelectorAll("[data-alumno-card]")];return Q(e).some(o=>{const s=a.find(i=>i.getAttribute("data-alumno-card")===String(o.id));if(!s)return!1;const n=s.querySelector(`.input-pizarra-alumno[data-audicion="${w}"]`),c=s.querySelector(`.checkbox-acierto[data-audicion="${w}"]`),g=n?n.value.trim():"",u=!!(c&&c.checked),d=t.get(String(o.id));if(!d)return g!==""||u;const m=d.correcto===!0||String(d.correcto).toLowerCase()==="true";return K(g)!==K(d.respuesta)||u!==m})}function me(e=p.get()){const t=y.ROUNDS[e.rondaActual];if(!t)return!1;const a=Q(e).map(o=>o.id);return a.length===0?!1:Array.from({length:t.audiciones},(o,s)=>s+1).every(o=>Ie(e.respuestasAudicion,o,a))}function k(){const e=p.get(),t=y.ROUNDS[e.rondaActual];if(!t)return;const a=Te(e),o=ue(e),s=me(e),n=!!e.rondaCerrada,c=document.getElementById("btn-prev-audicion"),g=document.getElementById("btn-next-audicion"),u=r.get("btnGuardarAciertos"),d=r.get("btnFinalizarRonda"),m=document.getElementById("audicion-estado-guardado");if(c&&(c.disabled=n||I||w<=1),g){const i=!n&&a&&!o&&!I&&w<t.audiciones;g.disabled=!i,g.textContent=w<t.audiciones?"Siguiente ▶":"Última audición"}u&&(u.disabled=n||I||Q(e).length===0),d&&(d.disabled=n||I||!s),m&&(n?m.textContent="Ronda finalizada":I?m.textContent="Audio en curso":o?m.textContent="Hay cambios sin guardar":a?m.textContent=`Respuestas de la audición ${w} guardadas`:m.textContent=`Audición ${w} pendiente de guardar`,m.className=`text-xs mb-3 ${n||a&&!o?"text-emerald-300":"text-amber-300"}`)}function he(e,t){const a=document.getElementById("badge-rango-reproduccion");a&&(a.textContent=`📍 Rango: de ${e}s a ${t}s`)}function ie(e,t){const a=e.querySelectorAll(".checkbox-acierto:checked").length,o=document.getElementById(`aciertos-count-${t}`);o&&(o.textContent=a);const s=p.get(),n=y.ROUNDS[s.rondaActual]||{minimoPasar:2},c=e.querySelector("span.rounded-full");c&&!c.textContent.includes("Eliminado")&&(a>=n.minimoPasar?(c.className="text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-900/80 text-emerald-200 border border-emerald-500",c.textContent=`Clasificado (${a})`):(c.className="text-xs px-2.5 py-1 rounded-full font-medium bg-blue-900/60 text-blue-200 border border-blue-400/30",c.textContent="En competencia"))}function Re(e,t){Object.entries(t).forEach(([a,o])=>{o&&(a===e?o.className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition border border-yellow-500 bg-yellow-500 text-slate-950 cursor-pointer shadow":o.className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition border border-slate-700 bg-slate-800 text-slate-300 hover:text-white cursor-pointer")})}function D(e){const t=document.getElementById("admin-audio-cache-status");t&&(t.textContent=e)}function ge(e){z===e&&f.getReproduccionProyector().then(t=>{const a=t.data;if(!(!a||String(a.commandId)!==e)){if(a.stopRequested&&["loading","countdown","playing"].includes(a.status))W=!0,D("⏳ El proyector está deteniendo la audición...");else if(a.status==="loading")D(`⏳ El proyector está cargando la audición ${a.audicionNum}...`);else if(a.status==="countdown")be(a),he(_.startSec,_.endSec),D("✅ Archivo cargado en el proyector. Cuenta regresiva de 5 segundos...");else if(a.status==="playing"){if(be(a),!oe){oe=!0;const o=Date.parse(a.startedAt);M=Number.isFinite(o)?new Date(o):new Date,Fe()}D("🔊 Audición reproduciéndose desde el proyector.")}else if(a.status==="completed"){le(!0,a),de(),r.showToast(`Audición ${w} finalizada. Verifica y guarda las respuestas.`,"info",3e3),k();return}else if(a.status==="error"){le(!1,a),de(),D(`⚠️ Error en el proyector: ${a.error||"no se pudo reproducir el audio."}`),r.showToast(`Error de reproducción en el proyector: ${a.error||"audio no disponible."}`,"error",5e3);return}else if(a.status==="cancelled"){le(!1,a),de(),D("Audición detenida."),k();return}}}).catch(t=>{console.warn("[PROYECTOR] No se pudo consultar el estado:",t),D("⚠️ Sin conexión con el proyector; intentando sincronizar...")}).finally(()=>{z===e&&(te=setTimeout(()=>ge(e),500))})}function Ge(){const e=z;if(!e||W)return;W=!0;const t=r.get("btnPlay");t&&(t.disabled=!0,t.textContent="⏳ Deteniendo en el proyector..."),D("⏳ Enviando orden de detención al proyector..."),f.actualizarReproduccionProyector({commandId:e,status:"stopRequested"}).catch(a=>{console.error("[PROYECTOR] No se pudo solicitar la detención:",a),W=!1,pe(),r.showToast("No se pudo detener la reproducción en el proyector.","error",4500)})}function de(){te&&clearTimeout(te),te=null,z=null,oe=!1,W=!1,M=null,Y()}function be(e){const t=Number(e.startSec),a=Number(e.endSec),o=Number(e.playedDuration!==void 0?e.playedDuration:e.duration),s=Number.isFinite(t)?t:_.startSec,n=Number.isFinite(o)?o:_.duration;_={startSec:s,endSec:Number.isFinite(a)?a:s+n,duration:n}}function le(e,t){if(t&&t.startedAt&&!M){const m=Date.parse(t.startedAt);Number.isFinite(m)&&(M=new Date(m))}if(!M&&t){const m=Number(t.playedDuration),i=Date.parse(t.completedAt||"");Number.isFinite(m)&&m>0&&Number.isFinite(i)&&(M=new Date(i-m*1e3))}if(!M||!j)return;const o=p.get().rondaActual||1,s=y.ROUNDS[o]||{duracion:40};be(t||{});const n=_.startSec,c=Number.isFinite(Number(_.endSec))?Number(_.endSec):n+(e?s.duracion:0),g=Math.max(0,c-n),u=document.getElementById("admin-log-message"),d=document.getElementById("admin-log-range");d&&(d.textContent=`de ${n}s a ${c}s`),u&&(u.textContent="⏳ Audición finalizada. Guardando registro en Google Sheets..."),f.registrarReproduccion({ronda:o,audicionNum:w,cancionId:j.cancionId||"",cancionNombre:j.cancionNombre||"",cancionCodigo:j.cancionCodigo||"",segundoInicio:n,segundoFin:c,duracion:g}).then(m=>{console.log("[AUDITORIA] Registrado en Google Sheets:",m.data),u&&m.data&&(u.textContent=`✅ Registrado en Google Sheets: de ${n}s a ${c}s (${g}s) a las ${m.data.fechaHora.split(" ")[1]}`)}).catch(m=>{console.warn("[AUDITORIA ERROR]",m),u&&(u.textContent="⚠️ No se pudo guardar el registro de reproducción en Google Sheets.")}),M=null}function Fe(){const e=document.getElementById("admin-log-message");if(!e||!j)return;const t=p.get(),a=Number(_.startSec)||0,o=Number(_.endSec)||a,s=new Intl.DateTimeFormat("es-PE",{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(M||new Date),n=j.cancionNombre||`Composición #${j.cancionId}`,c=document.getElementById("admin-log-range");c&&(c.textContent=`de ${a}s a ${o}s`),e.textContent=`⏱ Reproducción iniciada: ${n} · Ronda ${t.rondaActual||1}, audición ${w} · de ${a}s a ${o}s · ${s}. Se guardará en Google Sheets al finalizar.`}function Ne(e){const t=r.get("btnPlay");t&&e&&(t.disabled=!0,t.textContent="⏳ Cargando audio...",t.className="bg-yellow-600 text-white text-xl md:text-2xl px-10 py-4 rounded-xl shadow-lg cursor-not-allowed opacity-80")}function pe(e){const t=r.get("btnPlay");t&&(t.disabled=!1,t.textContent="⏹ DETENER AUDICIÓN",t.className="bg-red-600 hover:bg-red-700 text-white text-xl md:text-2xl font-black px-10 py-4 rounded-xl shadow-xl transition animate-pulse cursor-pointer",document.body.classList.add("is-playing"))}function Y(){I=!1,document.body.classList.remove("is-playing");const e=r.get("btnPlay");e&&(e.disabled=!1,e.textContent="▶ REPRODUCIR AUDICIÓN",e.className="bg-emerald-600 hover:bg-emerald-500 text-white text-xl md:text-2xl font-black px-10 py-4 rounded-xl shadow-xl transition transform active:scale-95 inline-flex items-center space-x-3 cursor-pointer")}let q=null,Oe="rondas",L=[],P=[],ne=[],C=[],O={},F=[],H=[];function He(){Le();const e=document.getElementById("btn-abrir-config");e&&e.addEventListener("click",Ve)}function Le(){if(document.getElementById("modal-configuracion"))return;const e=document.createElement("div");e.id="modal-configuracion",e.className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 transition-opacity duration-300 hidden opacity-0",e.innerHTML=`
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
        <span>💡 Todos los cambios se sincronizan en Google Sheets</span>
        <button id="btn-cerrar-config-footer" class="bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-2 rounded-xl transition cursor-pointer">
          Cerrar
        </button>
      </div>

    </div>
  `,document.body.appendChild(e),q=e,e.querySelector("#btn-cerrar-config").addEventListener("click",Ee),e.querySelector("#btn-cerrar-config-footer").addEventListener("click",Ee),e.querySelectorAll(".tab-btn").forEach(t=>{t.addEventListener("click",a=>{const o=a.currentTarget.dataset.tab;Ze(o)})})}async function Ve(){q||Le(),r.showLoading("Cargando configuraciones...");try{const[e,t,a,o,s]=await Promise.all([f.getConfig(),f.getCanciones(),f.getAlumnos(),f.getResultados(),f.getRespuestasRonda()]);O=e.data||{},y.syncFromBackend(O),L=t.data||[],C=a.data||[],H=o.data||[],F=s.data||[];const n=Array.from({length:y.TOTAL_RONDAS},(g,u)=>u+1);P=(await Promise.all(n.map(g=>f.getAudicionesRonda(g)))).flatMap(g=>g.data||[]),ne=[...P],q.classList.remove("hidden"),setTimeout(()=>q.classList.remove("opacity-0"),10),De()}catch(e){console.error("Error al abrir configuración:",e),r.showToast("Error al cargar datos de configuración","error")}finally{r.hideLoading()}}function Ee(){q&&(q.classList.add("opacity-0"),setTimeout(()=>q.classList.add("hidden"),250))}function Ze(e){Oe=e,q.querySelectorAll(".tab-btn").forEach(t=>{t.dataset.tab===e?t.className="tab-btn px-4 py-3 border-b-2 border-yellow-400 text-yellow-300 flex items-center space-x-2 whitespace-nowrap cursor-pointer":t.className="tab-btn px-4 py-3 border-b-2 border-transparent text-slate-400 hover:text-white flex items-center space-x-2 whitespace-nowrap cursor-pointer"}),De()}function De(){const e=document.getElementById("config-tab-content");if(e)switch(Oe){case"rondas":ke(e);break;case"canciones":fe(e);break;case"sorteo":Ye(e);break;case"participantes":ae(e);break}}function Ye(e){const t=L.filter(o=>o.activa!==!1),a=Object.values(y.ROUNDS).reduce((o,s)=>o+s.audiciones,0);e.innerHTML=`
    <div class="space-y-4">
      <div class="bg-blue-950/60 border border-blue-800 p-4 rounded-xl">
        <h3 class="font-bold text-base text-yellow-300 flex items-center gap-2">
          <span>🎲</span> Sorteo Aleatorio de Repertorio por Rondas
        </h3>
        <p class="text-xs text-slate-300 mt-1">
          Distribuye las canciones activas entre las ${y.TOTAL_RONDAS} rondas. No se repite una obra dentro de la misma ronda; puede volver a aparecer en otra ronda.
        </p>
        <div class="mt-3 flex flex-wrap gap-3">
          <button id="btn-generar-sorteo" class="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black px-5 py-2.5 rounded-xl shadow-lg transition flex items-center space-x-2 cursor-pointer">
            <span>🎲</span>
            <span>Generar Nuevo Sorteo Aleatorio</span>
          </button>
          <button id="btn-guardar-sorteo" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg transition flex items-center space-x-2 cursor-pointer">
            <span>💾</span>
            <span>Guardar Sorteo en Google Sheets</span>
          </button>
        </div>
      </div>

      <div class="text-xs text-slate-400 flex items-center justify-between">
        <span>Canciones activas para el sorteo: <strong class="text-white">${t.length}</strong></span>
        <span>Total audiciones programadas: <strong class="text-white">${P.length||a}</strong></span>
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
            ${Se(P)}
          </tbody>
        </table>
      </div>
    </div>
  `,e.querySelector("#btn-generar-sorteo").addEventListener("click",()=>{if(t.length===0){r.showToast("No hay canciones activas para sortear","error");return}const o=[];let s=1;for(let n=1;n<=y.TOTAL_RONDAS;n++){const c=y.ROUNDS[n].audiciones;if(c>t.length){r.showToast(`La Ronda ${n} requiere ${c} canciones distintas, pero solo hay ${t.length} activas.`,"error",5e3);return}const g=Je(t);for(let u=1;u<=c;u++){const d=g[u-1];o.push({ronda:n,audicionNum:u,cancionId:d.id,cancionNombre:d.nombre,cancionCodigo:d.codigo,orden:s++})}}P=o,e.querySelector("#sorteo-preview-body").innerHTML=Se(o),r.showToast("¡Nuevo sorteo aleatorio generado con éxito!","success",2500)}),e.querySelector("#btn-guardar-sorteo").addEventListener("click",async()=>{if(P.length===0){r.showToast("Genera un sorteo antes de guardar","warning");return}const o=!Ke(ne,P),s=H.length>0||F.length>0,n=o&&s;if(!(n&&!window.confirm("El sorteo actual ya tiene respuestas o resultados. Si guardas este nuevo sorteo, se borrarán los resultados y respuestas de todas las rondas. ¿Continuar?"))){r.showLoading("Guardando orden de audiciones en Google Sheets...");try{const c=await f.guardarAudicionesRonda(P,n),g=!!(c.data&&c.data.reinicioRealizado),u=p.get(),d=g?1:u.rondaActual||1,[m,i,l]=await Promise.all([f.getAudicionesRonda(d),f.getResultados(),f.getRespuestasRonda(d)]);H=i.data||[],F=l.data||[],ne=[...P],p.set({rondaActual:d,rondaCerrada:g?!1:!!u.rondaCerrada,audicionActual:1,audicionesRonda:m.data||[],resultados:H.filter(N=>Number(N.ronda)===d),respuestasAudicion:F});const x=document.getElementById("select-ronda");x&&(x.value=String(d)),V(p.get()),B(p.get()),r.showToast("✅ Sorteo de canciones guardado correctamente en la nube","success")}catch(c){console.error("Error al guardar sorteo:",c),r.showToast("Error al guardar sorteo: "+c.message,"error")}finally{r.hideLoading()}}})}function Se(e){return!e||e.length===0?'<tr><td colspan="5" class="p-4 text-center text-slate-500">No hay sorteo cargado. Pulsa "Generar Nuevo Sorteo Aleatorio".</td></tr>':e.map(t=>{var a;return`
    <tr class="border-b border-slate-800/80 hover:bg-slate-800/40">
      <td class="p-2.5 text-center font-bold text-yellow-400">R${t.ronda}</td>
      <td class="p-2.5 text-center text-slate-300">Aud ${t.audicionNum}</td>
      <td class="p-2.5 font-semibold text-white">${E(t.cancionNombre||`Composición #${t.cancionId}`)}</td>
      <td class="p-2.5 text-center font-mono font-bold text-yellow-300">${E(t.cancionCodigo||"----")}</td>
      <td class="p-2.5 text-center text-slate-400">${((a=y.ROUNDS[t.ronda])==null?void 0:a.duracion)||0}s</td>
    </tr>
  `}).join("")}function Je(e){const t=[...e];for(let a=t.length-1;a>0;a--){const o=Math.floor(Math.random()*(a+1));[t[a],t[o]]=[t[o],t[a]]}return t}function Ke(e,t){if(e.length!==t.length)return!1;const a=new Map(e.map(o=>[`${o.ronda}:${o.audicionNum}`,String(o.cancionId)]));return t.every(o=>a.get(`${o.ronda}:${o.audicionNum}`)===String(o.cancionId))}function fe(e){e.innerHTML=`
    <div class="space-y-4">
      
      <!-- Formulario para Agregar Canción -->
      <div class="bg-blue-950/60 border border-blue-800 p-4 rounded-xl">
        <h3 class="font-bold text-sm text-yellow-300 mb-2">➕ Agregar Nueva Composición de Strauss</h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input type="text" id="add-cancion-nombre" placeholder="Nombre (ej: SANGRE VIENESA)" class="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white uppercase focus:ring-1 focus:ring-yellow-400 focus:outline-none">
          <input type="text" id="add-cancion-codigo" placeholder="Código (ej: SV1200)" class="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white uppercase font-mono focus:ring-1 focus:ring-yellow-400 focus:outline-none">
          <input type="text" id="add-cancion-drive" placeholder="ID de Google Drive o enlace" class="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:ring-1 focus:ring-yellow-400 focus:outline-none">
        </div>
        <div class="mt-2.5 flex justify-end">
          <button id="btn-add-cancion" class="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs shadow transition cursor-pointer">
            + Agregar a la Lista
          </button>
        </div>
      </div>

      <div class="flex justify-between items-center text-xs">
        <span class="text-slate-400">Total canciones en repertorio: <strong class="text-white">${L.length}</strong></span>
        <button id="btn-guardar-todas-canciones" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow transition cursor-pointer">
          💾 Guardar Canciones en Google Sheets
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
              <th class="p-2.5">ID Google Drive</th>
              <th class="p-2.5 text-center w-16">Acción</th>
            </tr>
          </thead>
          <tbody id="canciones-list-body">
            ${L.map((t,a)=>`
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
  `,e.querySelector("#btn-add-cancion").addEventListener("click",()=>{const t=e.querySelector("#add-cancion-nombre").value.trim(),a=e.querySelector("#add-cancion-codigo").value.trim(),o=e.querySelector("#add-cancion-drive").value.trim(),s=xe(o);if(!t){r.showToast("Ingresa el nombre de la obra","warning");return}const n=L.length>0?Math.max(...L.map(c=>Number(c.id)||0))+1:1;L.push({id:n,nombre:t.toUpperCase(),codigo:a.toUpperCase()||`ST${n.toString().padStart(4,"0")}`,driveId:s,archivoDriveId:s,anio:2026,activa:!0}),fe(e),r.showToast(`Obra "${t}" agregada a la lista`,"info",2e3)}),e.querySelectorAll(".btn-eliminar-cancion").forEach(t=>{t.addEventListener("click",a=>{const o=a.currentTarget.dataset.id;L=L.filter(s=>String(s.id)!==String(o)),fe(e)})}),e.querySelector("#btn-guardar-todas-canciones").addEventListener("click",async()=>{r.showLoading("Guardando lista de canciones en Google Sheets...");try{await f.guardarCanciones(L),p.set({canciones:L}),r.showToast("✅ Lista de canciones guardada exitosamente en la nube","success")}catch(t){r.showToast("Error al guardar canciones: "+t.message,"error")}finally{r.hideLoading()}})}function ae(e){e.innerHTML=`
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
        <span class="text-slate-400">Total participantes registrados: <strong class="text-white">${C.length}</strong></span>
        <button id="btn-guardar-alumnos-cloud" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow transition cursor-pointer">
          💾 Guardar Alumnos en Google Sheets
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
            ${C.map((t,a)=>`
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
  `,e.querySelector("#btn-importar-masivo").addEventListener("click",()=>{const t=e.querySelector("#textarea-alumnos-masivo").value.trim();if(!t){r.showToast("Pega al menos una línea con datos de alumnos","warning");return}const a=e.querySelector("#chk-reemplazar-alumnos").checked,o=t.split(`
`),s=[];let n=a?1:C.length>0?Math.max(...C.map(c=>Number(c.id)||0))+1:1;o.forEach(c=>{const g=c.trim();if(!g)return;const u=g.includes("	")?g.split("	"):g.split(","),d=(u[0]||"").trim(),m=(u[1]||"").trim(),i=(u[2]||"").trim();d&&s.push({id:n++,nombre:d,grado:m||"",nivel:i||"",anio:2026,activo:!0})}),a?C=s:C=[...C,...s],ae(e),r.showToast(`Se procesaron ${s.length} participantes`,"success")}),e.querySelector("#btn-vaciar-alumnos").addEventListener("click",()=>{confirm("¿Deseas vaciar la lista temporal de participantes?")&&(C=[],ae(e))}),e.querySelectorAll(".btn-eliminar-alumno").forEach(t=>{t.addEventListener("click",a=>{const o=a.currentTarget.dataset.id;C=C.filter(s=>String(s.id)!==String(o)),ae(e)})}),e.querySelector("#btn-guardar-alumnos-cloud").addEventListener("click",async()=>{r.showLoading("Guardando participantes en Google Sheets...");try{await f.guardarAlumnosLote(C,!0),p.set({alumnos:C}),B(p.get()),r.showToast("✅ Participantes guardados exitosamente en la nube","success")}catch(t){r.showToast("Error al guardar participantes: "+t.message,"error")}finally{r.hideLoading()}})}function ke(e){const t=O,a=Number(t.TOTAL_RONDAS)||y.TOTAL_RONDAS,o=Array.from({length:a},(s,n)=>n+1);e.innerHTML=`
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
        <p class="text-xs text-slate-400 mb-3">El mínimo de clasificación se configura por ronda. Los valores actuales se conservan como predeterminados.</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          ${o.map(s=>{const n=ce(s,a),c=y.ROUNDS[s]||{duracion:Math.max(2,Math.round(40/Math.pow(2,s-1))),audiciones:s<=2?4:3,minimoPasar:s===a?3:2},g=Number(t[`DURACION_RONDA_${n}`]??t[`DURACION_RONDA_${s}`]??c.duracion),u=Number(t[`NUM_AUDICIONES_RONDA_${n}`]??t[`NUM_AUDICIONES_RONDA_${s}`]??c.audiciones),d=Number(t[`MINIMO_PASAR_RONDA_${n}`]??t[`MINIMO_PASAR_RONDA_${s}`]??c.minimoPasar);return`
              <div class="bg-slate-900/90 border border-slate-700 p-3 rounded-xl space-y-2">
                <span class="font-bold text-yellow-400 block text-center border-b border-slate-700 pb-1">
                  ${s===a?"Ronda Final":`Ronda ${s}`}
                </span>
                <div>
                  <label class="text-[10px] text-slate-400 block">Duración (seg):</label>
                  <input type="number" id="cfg-dur-${s}" min="1" max="3600" step="1" value="${g}" class="w-full bg-slate-950 border border-slate-700 rounded p-1 text-center font-bold text-white">
                </div>
                <div>
                  <label class="text-[10px] text-slate-400 block">Audiciones:</label>
                  <input type="number" id="cfg-aud-${s}" min="1" max="100" step="1" value="${u}" class="w-full bg-slate-950 border border-slate-700 rounded p-1 text-center font-bold text-white">
                </div>
                <div>
                  <label class="text-[10px] text-slate-400 block">Mínimo clasificar:</label>
                  <input type="number" id="cfg-min-${s}" min="1" max="${u}" step="1" value="${d}" class="w-full bg-slate-950 border border-slate-700 rounded p-1 text-center font-bold text-yellow-300">
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
  `,e.querySelector("#cfg-total-rondas").addEventListener("change",s=>{const n=Number(s.currentTarget.value);if(!Number.isInteger(n)||n<1||n>20){r.showToast("La cantidad de rondas debe ser un entero entre 1 y 20.","warning"),s.currentTarget.value=String(a);return}We(e,a),O.TOTAL_RONDAS=n,ke(e)}),e.querySelector("#btn-guardar-reglas-cloud").addEventListener("click",async()=>{const s=Number(e.querySelector("#cfg-total-rondas").value);if(!Number.isInteger(s)||s<1||s>20){r.showToast("La cantidad de rondas debe ser un entero entre 1 y 20.","warning");return}const n={TOTAL_RONDAS:s,NOMBRE_EVENTO:e.querySelector("#cfg-nombre-evento").value.trim(),HOMENAJEADO:e.querySelector("#cfg-homenajeado").value.trim(),ANIO_CERTAMEN:Number(e.querySelector("#cfg-anio").value),PREMIOS_PRIMER_PUESTO:e.querySelector("#cfg-premio-1").value.trim(),PREMIOS_SEGUNDO_PUESTO:e.querySelector("#cfg-premio-2").value.trim(),PREMIOS_TERCER_PUESTO:e.querySelector("#cfg-premio-3").value.trim()};if(!Number.isInteger(n.ANIO_CERTAMEN)||n.ANIO_CERTAMEN<2e3||n.ANIO_CERTAMEN>2100){r.showToast("El año del certamen debe estar entre 2000 y 2100.","warning");return}for(let d=1;d<=s;d++){const m=Number(e.querySelector(`#cfg-dur-${d}`).value),i=Number(e.querySelector(`#cfg-aud-${d}`).value),l=Number(e.querySelector(`#cfg-min-${d}`).value);if(!Number.isInteger(m)||m<1||m>3600||!Number.isInteger(i)||i<1||i>100||!Number.isInteger(l)||l<1||l>i){r.showToast(`Revisa los valores de la Ronda ${d}: duración 1–3600, audiciones 1–100 y mínimo 1–audiciones.`,"warning",5e3);return}const x=ce(d,s);n[`DURACION_RONDA_${x}`]=m,n[`NUM_AUDICIONES_RONDA_${x}`]=i,n[`MINIMO_PASAR_RONDA_${x}`]=l}const c=s!==y.TOTAL_RONDAS||Object.entries(n).some(([d,m])=>/^(DURACION_RONDA_|NUM_AUDICIONES_RONDA_|MINIMO_PASAR_RONDA_)/.test(d)&&String(O[d]===void 0?"":O[d])!==String(m)),g=H.length>0||F.length>0,u=c&&g;if(!(u&&!window.confirm("Cambiar las reglas reiniciará el sorteo, las respuestas y los resultados guardados de todas las rondas. ¿Continuar?"))){r.showLoading("Actualizando parámetros en Google Sheets...");try{await f.guardarConfigLote(n,u),O={...O,...n},y.syncFromBackend(O),c&&(P=[],ne=[]),u&&(F=[],H=[]);const d=p.get(),m=Number(d.rondaActual)||1,i=u||m>s?1:m;c&&p.set({rondaActual:i,rondaCerrada:!1,audicionActual:1,audicionesRonda:[],resultados:u?[]:(d.resultados||[]).filter(x=>Number(x.ronda)===i),respuestasAudicion:u?[]:[]}),Qe();const l=document.getElementById("select-ronda");l&&(l.value=String(i)),V(p.get()),B(p.get()),r.showToast("✅ Paso 1 guardado. Continúa con canciones y luego realiza el sorteo.","success",4500)}catch(d){r.showToast("Error al actualizar configuración: "+d.message,"error")}finally{r.hideLoading()}}})}function We(e,t){for(let a=1;a<=t;a++){const o=e.querySelector(`#cfg-dur-${a}`),s=e.querySelector(`#cfg-aud-${a}`),n=e.querySelector(`#cfg-min-${a}`),c=ce(a,t);o&&(O[`DURACION_RONDA_${c}`]=Number(o.value)),s&&(O[`NUM_AUDICIONES_RONDA_${c}`]=Number(s.value)),n&&(O[`MINIMO_PASAR_RONDA_${c}`]=Number(n.value))}}function Qe(){const e=document.getElementById("select-ronda");if(!e)return;const t=Number(e.value);e.innerHTML=Object.entries(y.ROUNDS).map(([a,o])=>`<option value="${a}">${E(o.nombre)} - ${o.audiciones} audiciones de ${o.duracion}s (mínimo: ${o.minimoPasar})</option>`).join(""),e.value=String(t<=y.TOTAL_RONDAS?t:1)}async function $e(){r.init(),r.showLoading("Conectando con el certamen...");try{let e=[],t=[],a=[],o=[],s=[],n=1,c=!1;try{const[u,d,m,i]=await Promise.all([f.getConfig().catch(b=>(console.warn("[APP] No se pudo cargar configuración del backend:",b),{data:{}})),f.getCanciones().catch(()=>({data:[]})),f.getAlumnos().catch(()=>({data:[]})),f.getEstadoCertamen().catch(()=>({data:null}))]);y.syncFromBackend(u.data||{}),e=d.data||[],t=m.data||[],i&&i.data&&(n=i.data.rondaActual||1,c=!!i.data.rondaCerrada),y.ROUNDS[n]||(n=1);const[l,x,N]=await Promise.all([f.getAudicionesRonda(n).catch(()=>({data:[]})),f.getResultados(n).catch(()=>({data:[]})),f.getRespuestasRonda(n).catch(b=>(console.warn("[APP] Backend aún no expone las respuestas por audición:",b),{data:[]}))]);a=l.data||[],o=x.data||[],s=N.data||[]}catch(u){console.warn("[APP] Aviso de red al conectar backend Apps Script:",u),r.showToast("Modo sin conexión o URL de Apps Script pendiente. Cargando vista.","warning",4e3)}p.set({canciones:e,alumnos:t,rondaActual:n,rondaCerrada:c,audicionActual:1,audicionesRonda:a,resultados:o,respuestasAudicion:s,isLoading:!1}),qe(),He();const g=r.get("selectRonda");g&&(g.innerHTML=Object.entries(y.ROUNDS).map(([u,d])=>`<option value="${u}">${d.nombre} - ${d.audiciones} audiciones de ${d.duracion}s (mínimo: ${d.minimoPasar})</option>`).join(""),g.value=String(n)),V(p.get()),B(p.get()),console.log("✅ Aplicación inicializada correctamente"),r.showToast("Certamen listo para audición","success",2500)}catch(e){console.error("❌ Error al inicializar:",e),r.showToast("Error al conectar con la base de datos de Google Sheets.","error",5e3)}finally{r.hideLoading()}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",$e):$e();
