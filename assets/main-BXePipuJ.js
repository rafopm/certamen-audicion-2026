import{C as w,f as J,a as Me,b as x,g as ce}from"./formatters-toznqtaa.js";class Be{constructor(){this.state={rondaActual:1,rondaCerrada:!1,audicionActual:0,alumnos:[],canciones:[],configRonda:null,resultados:{},respuestasAudicion:[],isLoading:!1,error:null},this.listeners=[]}get(){return{...this.state}}set(t){this.state={...this.state,...t},this.notify()}subscribe(t){return this.listeners.push(t),()=>{this.listeners=this.listeners.filter(a=>a!==t)}}notify(){this.listeners.forEach(t=>t(this.state))}}const f=new Be,r={elements:{},init(){return this._ensureFeedbackElements(),this.elements={selectRonda:document.getElementById("select-ronda"),audicionNumero:document.getElementById("audicion-numero"),btnPlay:document.getElementById("btn-play"),listaAlumnos:document.getElementById("lista-alumnos"),btnGuardarAciertos:document.getElementById("btn-guardar-aciertos"),btnFinalizarRonda:document.getElementById("btn-finalizar-ronda"),btnResetRonda:document.getElementById("btn-reset-ronda"),btnVerRanking:document.getElementById("btn-ver-ranking"),rankingSection:document.getElementById("ranking-section"),rankingContent:document.getElementById("ranking-content"),loadingOverlay:document.getElementById("loading-overlay"),toast:document.getElementById("toast")},this.elements},_ensureFeedbackElements(){if(!document.getElementById("loading-overlay")){const e=document.createElement("div");e.id="loading-overlay",e.className="fixed inset-0 bg-black/75 z-50 flex flex-col items-center justify-center transition-opacity duration-300 hidden",e.innerHTML=`
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400 mb-4"></div>
        <p id="loading-text" class="text-white text-xl font-semibold tracking-wide">Cargando...</p>
      `,document.body.appendChild(e)}if(!document.getElementById("toast")){const e=document.createElement("div");e.id="toast",e.className="fixed bottom-5 right-5 z-50 max-w-md px-6 py-4 rounded-xl shadow-2xl text-white font-medium transform transition-all duration-300 translate-y-20 opacity-0 pointer-events-none flex items-center space-x-3",document.body.appendChild(e)}},get(e){return this.elements[e]||(this.elements[e]=document.getElementById(e)),this.elements[e]},showLoading(e="Procesando..."){const t=this.get("loadingOverlay");if(t){const a=document.getElementById("loading-text");a&&(a.textContent=e),t.classList.remove("hidden"),setTimeout(()=>t.classList.remove("opacity-0"),10)}},hideLoading(){const e=this.get("loadingOverlay");e&&(e.classList.add("opacity-0"),setTimeout(()=>e.classList.add("hidden"),250))},showToast(e,t="info",a=3500){const o=this.get("toast");if(!o)return;const s={success:"bg-emerald-600 border border-emerald-400",error:"bg-rose-600 border border-rose-400",warning:"bg-amber-600 border border-amber-400",info:"bg-blue-600 border border-blue-400"},n={success:"✓",error:"✕",warning:"⚠",info:"ℹ"};o.className=`fixed bottom-5 right-5 z-50 max-w-md px-6 py-4 rounded-xl shadow-2xl text-white font-medium transform transition-all duration-300 flex items-center space-x-3 ${s[t]||s.info}`,o.innerHTML=`
      <span class="text-2xl font-bold">${n[t]||"ℹ"}</span>
      <span class="flex-1">${e}</span>
    `,o.classList.remove("translate-y-20","opacity-0","pointer-events-none"),o.classList.add("translate-y-0","opacity-100"),this._toastTimer&&clearTimeout(this._toastTimer),this._toastTimer=setTimeout(()=>{o.classList.add("translate-y-20","opacity-0","pointer-events-none"),o.classList.remove("translate-y-0","opacity-100")},a)}};function xe(e){if(!e||typeof e!="string")return"";const t=e.trim();if(t.startsWith("[")&&t.endsWith("]")||t.toLowerCase()==="file_id"||t==="")return"";const a=t.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);if(a&&a[1])return a[1];const o=t.match(/[?&]id=([a-zA-Z0-9_-]+)/);if(o&&o[1])return o[1];const s=t.match(/\/d\/([a-zA-Z0-9_-]+)/);return s&&s[1]?s[1]:(/^[a-zA-Z0-9_-]{20,60}$/.test(t),t)}function ze(e,t=w.TOTAL_RONDAS||5){const a=Number(e);return Number.isInteger(a)&&a>=1&&a<=t}function Ue(e){const t=xe(e);return t?/^[a-zA-Z0-9_-]{20,60}$/.test(t):!1}function S(e){return e==null?"":String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function K(e){return String(e||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase().replace(/[^A-Z0-9]/g,"")}function z(e,t){let a=[],o=[],s=[],n=1,l=!1,b=4,c=1;if(e&&Array.isArray(e.alumnos))a=e.alumnos||[],o=Array.isArray(e.resultados)?e.resultados:Object.values(e.resultados||{}),s=Array.isArray(e.respuestasAudicion)?e.respuestasAudicion:[],n=e.rondaActual||1,l=!!e.rondaCerrada,c=e.audicionActual||1,b=(w.ROUNDS[n]||{audiciones:4}).audiciones;else{a=Array.isArray(e)?e:[],o=Array.isArray(t)?t:[];const m=r.get("selectRonda");m&&(n=parseInt(m.value,10)||1);const h=r.get("audicionNumero");h&&(c=parseInt(h.textContent,10)||1),b=(w.ROUNDS[n]||{audiciones:4}).audiciones}const g=r.get("listaAlumnos");if(!g)return;if(a.length===0){g.innerHTML=`
      <div class="col-span-full text-center py-8 text-blue-200">
        <p class="text-lg">No hay alumnos registrados o activos para este certamen.</p>
      </div>
    `;return}const u={},i={};o.forEach(m=>{if(parseInt(m.ronda,10)===n&&(u[String(m.alumnoId)]=m),m.eliminado){const h=m.rondaEliminacion||m.ronda;(!i[String(m.alumnoId)]||h<i[String(m.alumnoId)])&&(i[String(m.alumnoId)]=h)}});const p=(w.ROUNDS[n]||{minimoPasar:2}).minimoPasar,y=s.filter(m=>Number(m.ronda)===Number(n));g.innerHTML=a.map(m=>{var ve;const h=u[String(m.id)],v=y.filter(C=>String(C.alumnoId)===String(m.id)),R=v.length>0?v.filter(C=>C.correcto===!0||String(C.correcto).toLowerCase()==="true").length:h?parseInt(h.aciertos,10):0,N=m.rondaEliminacion||i[String(m.id)],E=N&&N<n,O=h?h.eliminado:!1,X=J(m.nombre);let U="bg-blue-900/60 text-blue-200 border border-blue-400/30",ee="En competencia";E?(U="bg-rose-950 text-rose-300 border border-rose-800",ee=`❌ Eliminado en Ronda ${N}`):O?(U="bg-red-900/80 text-red-200 border border-red-500",ee=`Eliminado en Ronda ${n}`):R>=p&&(U="bg-emerald-900/80 text-emerald-200 border border-emerald-500",ee=`Clasificado (${R}/${b})`);let ye="";for(let C=1;C<=b;C++){const Z=v.find(ke=>Number(ke.audicionNum)===C),re=Z&&(Z.correcto===!0||String(Z.correcto).toLowerCase()==="true"),se=C===c,_e=l||E||!se;ye+=`
        <label class="flex flex-col items-center justify-center cursor-pointer p-1.5 rounded-lg border transition select-none ${se?"bg-yellow-500/20 border-yellow-400 shadow-md ring-1 ring-yellow-400":"bg-blue-950/60 hover:bg-blue-900 border-blue-700/50"}">
          <span class="text-xs ${se?"text-yellow-300 font-extrabold":"text-slate-300"} mb-1">Aud ${C}</span>
          <input 
            type="checkbox" 
            class="checkbox-acierto w-5 h-5 text-yellow-500 bg-blue-900 rounded border-gray-400 focus:ring-yellow-400 focus:ring-2 cursor-pointer"
            data-alumno-id="${S(m.id)}"
            data-audicion="${C}"
            ${re?"checked":""}
            ${_e?"disabled":""}
          />
          <span class="text-[9px] ${Z?re?"text-emerald-300":"text-rose-300":"text-slate-500"}">${Z?re?"Correcta":"Error":"Pendiente"}</span>
        </label>
      `}return`
      <div class="alumno-card bg-slate-800/90 border border-slate-700 rounded-xl p-4 shadow-md transition hover:border-yellow-500/50 ${E?"opacity-40 bg-slate-950 cursor-not-allowed":""}" data-alumno-card="${S(m.id)}">
        <div class="flex items-start justify-between mb-2">
          <div>
            <h3 class="font-bold text-base md:text-lg text-white">${S(X)}</h3>
            <p class="text-xs text-slate-300">${S(m.grado||"")} ${S(m.nivel||"")}</p>
          </div>
          <span class="text-xs px-2.5 py-1 rounded-full font-medium ${U}">
            ${ee}
          </span>
        </div>

        <!-- Checkboxes de audiciones -->
        <div class="mt-2">
          <div class="text-xs text-slate-400 mb-1.5 flex justify-between items-center">
            <span>Aciertos Ronda ${n}:</span>
            <span class="font-bold text-yellow-400"><span id="aciertos-count-${m.id}">${R}</span> / ${b}</span>
          </div>
          <div class="grid grid-cols-${Math.min(b,4)} gap-1.5">
            ${ye}
          </div>
        </div>

        <!-- Entrada rápida de respuesta de pizarra para el jurado -->
        ${E?"":`
          <div class="mt-3 pt-2 border-t border-slate-700/60 flex items-center gap-2">
            <span class="text-xs text-slate-400 whitespace-nowrap">✏️ Pizarra:</span>
            <input 
              type="text" 
              placeholder="Código escrito (ej: TP2380)"
              class="input-pizarra-alumno bg-slate-950 text-yellow-300 border border-slate-700 uppercase font-mono text-xs px-2.5 py-1 rounded-lg w-full focus:ring-1 focus:ring-yellow-400 focus:outline-none"
              data-alumno-id="${S(m.id)}"
              data-audicion="${c}"
              ${l?"disabled":""}
              value="${S(((ve=v.find(C=>Number(C.audicionNum)===c))==null?void 0:ve.respuesta)||"")}"
            />
          </div>
        `}
      </div>
    `}).join("")}function V(e,t){let a=[],o=1,s=1;if(e&&e.rondaActual!==void 0)o=e.rondaActual,a=e.audicionesRonda||e.audiciones||[],s=e.audicionActual||1;else{a=Array.isArray(e)?e:[],o=1;const d=r.get("audicionNumero");d&&(s=parseInt(d.textContent,10)||1)}const n=r.get("audicionNumero");n&&(n.textContent=String(s));const l=a.find(d=>d.audicionNum===s)||a[s-1],b=document.getElementById("admin-cancion-nombre"),c=document.getElementById("admin-cancion-codigo"),g=document.getElementById("admin-seg-duracion"),u=w.ROUNDS[o]||{duracion:40,audiciones:4};b&&(b.textContent=l?l.cancionNombre||`Composición #${l.cancionId}`:"Composición no asignada"),c&&(c.textContent=l&&l.cancionCodigo||"----"),g&&(g.textContent=String(u.duracion||40));const i=document.getElementById("ronda-info-detalles");i&&(i.innerHTML=`
      <div class="flex flex-wrap items-center justify-between text-xs md:text-sm bg-blue-950/70 p-3 rounded-lg border border-blue-700/60 mt-3 gap-2">
        <span>⏱ <strong>Duración:</strong> ${u.duracion||40}s por audición</span>
        <span>🎯 <strong>Mínimo para clasificar:</strong> ${u.minimoPasar||2} aciertos</span>
        <span>🎼 <strong>Total audiciones:</strong> ${u.audiciones||4}</span>
      </div>
    `)}function we(e){const t=r.get("rankingContent");if(!t)return;if(!e||e.length===0){t.innerHTML=`
      <div class="text-center py-6 text-slate-300">
        <p>Aún no hay puntajes registrados en el certamen.</p>
      </div>
    `;return}const a=e.slice(0,3),o=qe(a),s=e.map((n,l)=>{const b=l+1;let c=`<span class="font-bold text-slate-300">${Me(b)}</span>`,g="hover:bg-slate-700/50";b===1?(c='<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500 text-slate-950 font-black shadow-lg">🥇 1°</span>',g="bg-yellow-500/10 hover:bg-yellow-500/20 border-l-4 border-yellow-500"):b===2?(c='<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-300 text-slate-950 font-black shadow-lg">🥈 2°</span>',g="bg-slate-300/10 hover:bg-slate-300/20 border-l-4 border-slate-300"):b===3&&(c='<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-700 text-amber-100 font-black shadow-lg">🥉 3°</span>',g="bg-amber-700/10 hover:bg-amber-700/20 border-l-4 border-amber-600");const u=n.eliminado?`Eliminado en Ronda ${n.rondaEliminacion||1}`:`Activo (Ronda ${n.rondaMax||1})`;return`
      <tr class="border-b border-slate-700/60 ${g} transition-colors">
        <td class="p-3 text-center">${c}</td>
        <td class="p-3 font-semibold text-white">
          ${S(J(n.nombre))}
          ${n.premio?`<span class="block text-xs text-yellow-400 font-normal">🎁 ${n.premio}</span>`:""}
        </td>
        <td class="p-3 text-slate-300 text-sm">${S(n.grado||"")} ${S(n.nivel||"")}</td>
        <td class="p-3 text-center">
          <span class="inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${n.eliminado?"bg-rose-950 text-rose-300 border border-rose-800":"bg-emerald-950 text-emerald-300 border border-emerald-800"}">
            ${u}
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
  `}function qe(e){if(!e||e.length===0)return"";const[t,a,o]=e;return`
    <div class="podium-container flex justify-center items-end gap-3 md:gap-6 my-8 px-2 max-w-2xl mx-auto">
      
      <!-- 2do Puesto -->
      <div class="flex-1 text-center order-1 transform transition hover:-translate-y-1">
        ${a?`
          <div class="bg-slate-800/90 border-2 border-slate-300 rounded-t-2xl p-4 shadow-xl flex flex-col items-center">
            <div class="w-12 h-12 rounded-full bg-slate-300 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg mb-2">
              🥈
            </div>
            <p class="font-bold text-white text-sm md:text-base line-clamp-1">${S(J(a.nombre))}</p>
            <p class="text-xs text-slate-300 mb-2">${S(a.grado||"")}</p>
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
            <p class="font-extrabold text-yellow-300 text-base md:text-lg line-clamp-1">${S(J(t.nombre))}</p>
            <p class="text-xs text-yellow-200/80 mb-2">${S(t.grado||"")}</p>
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
            <p class="font-bold text-white text-sm md:text-base line-clamp-1">${S(J(o.nombre))}</p>
            <p class="text-xs text-slate-300 mb-2">${S(o.grado||"")}</p>
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
  `}function Ce(e,t){return new Map((Array.isArray(e)?e:[]).filter(a=>Number(a.audicionNum)===Number(t)).map(a=>[String(a.alumnoId),a]))}function Ie(e,t,a){if(!Array.isArray(a)||a.length===0)return!1;const o=Ce(e,t);return a.every(s=>o.has(String(s)))}let T=!1,G=!1,A=1,M=null,q=null,k={startSec:0,endSec:40,duration:40},B=null,te=null,oe=!1,W=!1;function je(){r.init(),A=f.get().audicionActual||1;const e=r.get("btnPlay");e&&e.addEventListener("click",async()=>{if(T){Ge();return}if(G)return;G=!0,Ne(!0);const i=f.get(),d=i.rondaActual||1;let p=i.audicionesRonda||[];if(!p||p.length===0){r.showLoading("Obteniendo audición configurada...");try{p=(await x.getAudicionesRonda(d)).data||[],f.set({audicionesRonda:p})}catch(R){console.error("[AUDIO] No se pudieron cargar audiciones desde backend:",R),r.showToast("No se pudo cargar el sorteo de audiciones.","error"),G=!1,Y();return}finally{r.hideLoading()}}const y=p.find(R=>R.audicionNum===A)||p[A-1]||{};if(!y.cancionId){r.showToast("No hay un sorteo guardado para esta audición. Configura las canciones y genera el sorteo.","warning",4500),G=!1,Y();return}q=y;const m=xe(y.driveId||y.archivoDriveId);if(!Ue(m)){r.showToast("La canción asignada no tiene un archivo de audio válido en Google Drive.","error",4500),G=!1,Y();return}const h=document.getElementById("chk-random-start"),v=h?h.checked:!0;try{const R=`${Date.now()}-${Math.random().toString(36).slice(2,10)}`;B=R,oe=!1;const N=await x.solicitarReproduccionProyector({commandId:R,ronda:d,audicionNum:A,fileId:m,randomStart:v});if(N.data&&N.data.status!=="loading")throw new Error("El proyector no aceptó la orden de reproducción.");T=!0,pe(!0),P(`⏳ Enviando audición ${A} al proyector...`),be(R)}catch(R){if(B)try{const N=await x.getReproduccionProyector();if(N.data&&String(N.data.commandId)===B&&["loading","countdown","playing"].includes(N.data.status)){T=!0,pe(!0),P("✅ La orden fue recibida; sincronizando con el proyector..."),be(B);return}}catch(N){console.error("[PROYECTOR] No se pudo confirmar la orden:",N)}console.error("[PROYECTOR] No se pudo solicitar la reproducción:",R),B=null,T=!1,P("⚠️ No se pudo iniciar la reproducción en el proyector."),r.showToast(`No se pudo iniciar la audición: ${R.message}`,"error",5e3),Y()}finally{G=!1,Ne(!1)}});const t=document.getElementById("btn-prev-audicion"),a=document.getElementById("btn-next-audicion");t&&t.addEventListener("click",()=>{if(A>1){if(ue()&&!window.confirm("Hay respuestas sin guardar. ¿Descartarlas y volver a la audición anterior?"))return;A--,Re(A),D()}}),a&&a.addEventListener("click",()=>{const i=f.get(),d=w.ROUNDS[i.rondaActual]||{audiciones:4};if(T){r.showToast("Espera a que termine el audio antes de cambiar de audición.","warning");return}if(!Te()||ue()){r.showToast("Verifica y guarda las respuestas de esta audición antes de avanzar.","warning",4e3);return}A<d.audiciones&&(A++,Re(A),D())});const o={AUDICION:document.getElementById("btn-modo-audicion"),CLASIFICADOS:document.getElementById("btn-modo-clasificados"),RANKING_FINAL:document.getElementById("btn-modo-ranking")};Object.entries(o).forEach(([i,d])=>{d&&d.addEventListener("click",async()=>{Ae(i,o),r.showToast(`Proyector configurado en: ${i}`,"info",2e3);try{await x.actualizarModoProyector(i)}catch(p){console.warn("Error al sincronizar modo proyector:",p)}})});const s=r.get("selectRonda");s&&s.addEventListener("change",async i=>{const d=parseInt(i.target.value,10);if(!ze(d)){r.showToast("Ronda inválida","error");return}const p=f.get();if(T){i.target.value=String(p.rondaActual||1),r.showToast("Espera a que termine el audio antes de cambiar de ronda.","warning");return}if(d>(p.rondaActual||1)&&!me()){i.target.value=String(p.rondaActual||1),r.showToast("Guarda todas las respuestas de la ronda actual antes de avanzar.","warning",4e3);return}r.showLoading(`Cargando Ronda ${d}...`);try{A=1,await x.actualizarRondaActual(d);const[y,m,h,v,R]=await Promise.all([x.getAudicionesRonda(d),x.getResultados(d),x.getAlumnos(),x.getRespuestasRonda(d),x.getEstadoCertamen()]);f.set({rondaActual:d,rondaCerrada:!!(R.data&&R.data.rondaCerrada),audicionActual:1,audicionesRonda:y.data||[],resultados:m.data||[],alumnos:h.data||[],respuestasAudicion:v.data||[]}),V(f.get()),z(f.get());const N=w.ROUNDS[d]||{duracion:40};he(0,N.duracion),D(),r.showToast(`Secuencia: Ronda ${d} activada`,"success")}catch(y){console.error("Error al cambiar ronda:",y),i.target.value=String(p.rondaActual||1),r.showToast("Error al cambiar de ronda: "+y.message,"error")}finally{r.hideLoading()}});const n=r.get("listaAlumnos");n&&(n.addEventListener("input",i=>{if(i.target&&i.target.classList.contains("input-pizarra-alumno")){const d=i.target.dataset.alumnoId,p=i.target.value.trim().toUpperCase(),m=f.get().audicionesRonda||[],h=m.find(U=>U.audicionNum===A)||m[A-1]||{},v=K(h.cancionCodigo),R=K(h.cancionNombre),N=[...n.querySelectorAll("[data-alumno-card]")].find(U=>U.getAttribute("data-alumno-card")===d);if(!N)return;const E=N.querySelector(`.checkbox-acierto[data-audicion="${A}"]`),O=K(i.target.value);O!==""&&(O===v||O===R)?(i.target.classList.remove("border-slate-700","border-rose-500"),i.target.classList.add("border-emerald-400","bg-emerald-950/60"),E&&!E.checked&&(E.checked=!0,ie(N,d))):p===""?(i.target.classList.remove("border-emerald-400","bg-emerald-950/60","border-rose-500"),i.target.classList.add("border-slate-700"),E&&(E.checked=!1)):(i.target.classList.remove("border-emerald-400","bg-emerald-950/60","border-slate-700"),i.target.classList.add("border-rose-500"),E&&(E.checked=!1)),ie(N,d),D()}}),n.addEventListener("change",i=>{if(i.target&&i.target.classList.contains("checkbox-acierto")){const d=i.target.dataset.alumnoId,p=document.querySelector(`[data-alumno-card="${d}"]`);p&&ie(p,d),D()}}));const l=r.get("btnGuardarAciertos");l&&l.addEventListener("click",async()=>{const i=f.get(),d=i.rondaActual||1,p=A;if(T){r.showToast("Espera a que termine el audio antes de guardar respuestas.","warning");return}const y=Q(i),m=[...document.querySelectorAll("[data-alumno-card]")];let h;try{h=y.map(v=>{const R=m.find(X=>X.getAttribute("data-alumno-card")===String(v.id));if(!R)throw new Error(`No se encontró la ficha del participante ${v.id}.`);const N=R.querySelector(`.input-pizarra-alumno[data-audicion="${p}"]`),E=R.querySelector(`.checkbox-acierto[data-audicion="${p}"]`),O=N?N.value.trim():"";return{alumnoId:v.id,respuesta:O,correcto:O!==""&&!!(E&&E.checked)}})}catch(v){console.error("Error al preparar respuestas:",v),r.showToast("Error al preparar respuestas: "+v.message,"error");return}if(h.length===0){r.showToast("No hay participantes elegibles para guardar.","warning");return}r.showLoading("Guardando respuestas de esta audición...");try{await x.guardarRespuestasAudicion({ronda:d,audicionNum:p,respuestas:h});const[v,R]=await Promise.all([x.getRespuestasRonda(d),x.getResultados(d)]);f.set({respuestasAudicion:v.data||[],resultados:R.data||[]}),z(f.get()),V(f.get()),D();const N=h.filter(E=>E.correcto).length;r.showToast(`Audición ${p} guardada: ${N} correctas y ${h.length-N} errores.`,"success",4500)}catch(v){console.error("Error al guardar respuestas:",v),r.showToast("❌ Error al guardar respuestas: "+v.message,"error")}finally{r.hideLoading()}});const b=r.get("btnFinalizarRonda");b&&b.addEventListener("click",async()=>{const d=f.get().rondaActual||1,p=w.ROUNDS[d]||{minimoPasar:2};if(!me()){r.showToast("No se puede finalizar: guarda las respuestas de todas las audiciones primero.","warning",4500);return}if(window.confirm(`¿Desea FINALIZAR la Ronda ${d}?

• Mínimo exigido: ${p.minimoPasar} aciertos
• Los alumnos con menos de ${p.minimoPasar} aciertos quedarán marcados como ELIMINADOS EN RONDA ${d}.
• El proyector pasará automáticamente al modo CLASIFICADOS.

¿Continuar?`)){r.showLoading("Finalizando ronda y calculando clasificación...");try{const h=(await x.finalizarRonda(d)).data||{};r.showToast(`Ronda ${d} Finalizada: ${h.pasanCount||0} clasifican, ${h.eliminadosCount||0} eliminados`,"success",5e3);const[v,R,N]=await Promise.all([x.getResultados(d),x.getRanking(),x.getAlumnos()]);f.set({resultados:v.data||[],ranking:R.data||[],alumnos:N.data||[],rondaCerrada:!0}),z(f.get()),Ae(d===w.TOTAL_RONDAS?"RANKING_FINAL":"CLASIFICADOS",o);const E=r.get("rankingSection");if(E&&!E.classList.contains("hidden")&&we(R.data||[]),h.siguienteRonda&&h.siguienteRonda!==d&&h.siguienteRonda<=w.TOTAL_RONDAS){const O=r.get("selectRonda");O&&(O.value=String(h.siguienteRonda),O.dispatchEvent(new Event("change")))}}catch(m){console.error("Error al finalizar ronda:",m),r.showToast("Error al finalizar ronda: "+m.message,"error")}finally{r.hideLoading()}}});const c=r.get("btnResetRonda");c&&c.addEventListener("click",async()=>{const d=f.get().rondaActual||1;if(window.confirm(`⚠️ ATENCIÓN: ¿Está seguro de RESETEAR la Ronda ${d}?

Se borrarán las respuestas y resultados de la Ronda ${d} y de las rondas posteriores.`)){r.showLoading(`Reseteando datos de la Ronda ${d}...`);try{await x.resetRonda(d);const[y,m,h]=await Promise.all([x.getResultados(d),x.getAlumnos(),x.getRespuestasRonda(d)]);f.set({resultados:y.data||[],alumnos:m.data||[],respuestasAudicion:h.data||[],rondaCerrada:!1}),z(f.get()),D(),r.showToast(`Ronda ${d} ha sido reseteada correctamente`,"warning")}catch(y){console.error("Error al resetear ronda:",y),r.showToast("Error al resetear ronda: "+y.message,"error")}finally{r.hideLoading()}}});const g=r.get("btnVerRanking"),u=r.get("rankingSection");g&&u&&g.addEventListener("click",async()=>{if(u.classList.contains("hidden")){r.showLoading("Calculando tabla de posiciones y ranking...");try{const p=(await x.getRanking()).data||[];f.set({ranking:p}),we(p),u.classList.remove("hidden"),g.textContent="✕ Ocultar Ranking",g.classList.replace("bg-purple-700","bg-purple-900"),u.scrollIntoView({behavior:"smooth"})}catch(d){console.error("Error al obtener ranking:",d),r.showToast("Error al obtener ranking: "+d.message,"error")}finally{r.hideLoading()}}else u.classList.add("hidden"),g.textContent="🏆 Ver Ranking",g.classList.replace("bg-purple-900","bg-purple-700")}),D()}function Re(e){f.set({audicionActual:e}),V(f.get()),z(f.get());const t=f.get(),a=w.ROUNDS[t.rondaActual]||{duracion:40};he(0,a.duracion)}function Q(e=f.get()){const t=Number(e.rondaActual)||1;return(e.alumnos||[]).filter(a=>{const o=Number(a.rondaEliminacion);return Number.isInteger(o)&&o>0?o>=t:!a.eliminado})}function Te(e=f.get()){const t=Q(e);return Ie(e.respuestasAudicion,A,t.map(a=>a.id))}function ue(e=f.get()){const t=Ce(e.respuestasAudicion,A),a=[...document.querySelectorAll("[data-alumno-card]")];return Q(e).some(o=>{const s=a.find(i=>i.getAttribute("data-alumno-card")===String(o.id));if(!s)return!1;const n=s.querySelector(`.input-pizarra-alumno[data-audicion="${A}"]`),l=s.querySelector(`.checkbox-acierto[data-audicion="${A}"]`),b=n?n.value.trim():"",c=!!(l&&l.checked),g=t.get(String(o.id));if(!g)return b!==""||c;const u=g.correcto===!0||String(g.correcto).toLowerCase()==="true";return K(b)!==K(g.respuesta)||c!==u})}function me(e=f.get()){const t=w.ROUNDS[e.rondaActual];if(!t)return!1;const a=Q(e).map(o=>o.id);return a.length===0?!1:Array.from({length:t.audiciones},(o,s)=>s+1).every(o=>Ie(e.respuestasAudicion,o,a))}function D(){const e=f.get(),t=w.ROUNDS[e.rondaActual];if(!t)return;const a=Te(e),o=ue(e),s=me(e),n=!!e.rondaCerrada,l=document.getElementById("btn-prev-audicion"),b=document.getElementById("btn-next-audicion"),c=r.get("btnGuardarAciertos"),g=r.get("btnFinalizarRonda"),u=document.getElementById("audicion-estado-guardado");if(l&&(l.disabled=n||T||A<=1),b){const i=!n&&a&&!o&&!T&&A<t.audiciones;b.disabled=!i,b.textContent=A<t.audiciones?"Siguiente ▶":"Última audición"}c&&(c.disabled=n||T||Q(e).length===0),g&&(g.disabled=n||T||!s),u&&(n?u.textContent="Ronda finalizada":T?u.textContent="Audio en curso":o?u.textContent="Hay cambios sin guardar":a?u.textContent=`Respuestas de la audición ${A} guardadas`:u.textContent=`Audición ${A} pendiente de guardar`,u.className=`text-xs mb-3 ${n||a&&!o?"text-emerald-300":"text-amber-300"}`)}function he(e,t){const a=document.getElementById("badge-rango-reproduccion");a&&(a.textContent=`📍 Rango: de ${e}s a ${t}s`)}function ie(e,t){const a=e.querySelectorAll(".checkbox-acierto:checked").length,o=document.getElementById(`aciertos-count-${t}`);o&&(o.textContent=a);const s=f.get(),n=w.ROUNDS[s.rondaActual]||{minimoPasar:2},l=e.querySelector("span.rounded-full");l&&!l.textContent.includes("Eliminado")&&(a>=n.minimoPasar?(l.className="text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-900/80 text-emerald-200 border border-emerald-500",l.textContent=`Clasificado (${a})`):(l.className="text-xs px-2.5 py-1 rounded-full font-medium bg-blue-900/60 text-blue-200 border border-blue-400/30",l.textContent="En competencia"))}function Ae(e,t){Object.entries(t).forEach(([a,o])=>{o&&(a===e?o.className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition border border-yellow-500 bg-yellow-500 text-slate-950 cursor-pointer shadow":o.className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition border border-slate-700 bg-slate-800 text-slate-300 hover:text-white cursor-pointer")})}function P(e){const t=document.getElementById("admin-audio-cache-status");t&&(t.textContent=e)}function be(e){B===e&&x.getReproduccionProyector().then(t=>{const a=t.data;if(!(!a||String(a.commandId)!==e)){if(a.stopRequested&&["loading","countdown","playing"].includes(a.status))W=!0,P("⏳ El proyector está deteniendo la audición...");else if(a.status==="loading")P(`⏳ El proyector está cargando la audición ${a.audicionNum}...`);else if(a.status==="countdown")ge(a),he(k.startSec,k.endSec),P("✅ Archivo cargado en el proyector. Cuenta regresiva de 5 segundos...");else if(a.status==="playing"){if(ge(a),!oe){oe=!0;const o=Date.parse(a.startedAt);M=Number.isFinite(o)?new Date(o):new Date,Fe()}P("🔊 Audición reproduciéndose desde el proyector.")}else if(a.status==="completed"){le(!0,a),de(),r.showToast(`Audición ${A} finalizada. Verifica y guarda las respuestas.`,"info",3e3),D();return}else if(a.status==="error"){le(!1,a),de(),P(`⚠️ Error en el proyector: ${a.error||"no se pudo reproducir el audio."}`),r.showToast(`Error de reproducción en el proyector: ${a.error||"audio no disponible."}`,"error",5e3);return}else if(a.status==="cancelled"){le(!1,a),de(),P("Audición detenida."),D();return}}}).catch(t=>{console.warn("[PROYECTOR] No se pudo consultar el estado:",t),P("⚠️ Sin conexión con el proyector; intentando sincronizar...")}).finally(()=>{B===e&&(te=setTimeout(()=>be(e),500))})}function Ge(){const e=B;if(!e||W)return;W=!0;const t=r.get("btnPlay");t&&(t.disabled=!0,t.textContent="⏳ Deteniendo en el proyector..."),P("⏳ Enviando orden de detención al proyector..."),x.actualizarReproduccionProyector({commandId:e,status:"stopRequested"}).catch(a=>{console.error("[PROYECTOR] No se pudo solicitar la detención:",a),W=!1,pe(),r.showToast("No se pudo detener la reproducción en el proyector.","error",4500)})}function de(){te&&clearTimeout(te),te=null,B=null,oe=!1,W=!1,M=null,Y()}function ge(e){const t=Number(e.startSec),a=Number(e.endSec),o=Number(e.playedDuration!==void 0?e.playedDuration:e.duration),s=Number.isFinite(t)?t:k.startSec,n=Number.isFinite(o)?o:k.duration;k={startSec:s,endSec:Number.isFinite(a)?a:s+n,duration:n}}function le(e,t){if(t&&t.startedAt&&!M){const u=Date.parse(t.startedAt);Number.isFinite(u)&&(M=new Date(u))}if(!M&&t){const u=Number(t.playedDuration),i=Date.parse(t.completedAt||"");Number.isFinite(u)&&u>0&&Number.isFinite(i)&&(M=new Date(i-u*1e3))}if(!M||!q)return;const o=f.get().rondaActual||1,s=w.ROUNDS[o]||{duracion:40};ge(t||{});const n=k.startSec,l=Number.isFinite(Number(k.endSec))?Number(k.endSec):n+(e?s.duracion:0),b=Math.max(0,l-n),c=document.getElementById("admin-log-message"),g=document.getElementById("admin-log-range");g&&(g.textContent=`de ${n}s a ${l}s`),c&&(c.textContent="⏳ Audición finalizada. Guardando registro en Google Sheets..."),x.registrarReproduccion({ronda:o,audicionNum:A,cancionId:q.cancionId||"",cancionNombre:q.cancionNombre||"",cancionCodigo:q.cancionCodigo||"",segundoInicio:n,segundoFin:l,duracion:b}).then(u=>{console.log("[AUDITORIA] Registrado en Google Sheets:",u.data),c&&u.data&&(c.textContent=`✅ Registrado en Google Sheets: de ${n}s a ${l}s (${b}s) a las ${u.data.fechaHora.split(" ")[1]}`)}).catch(u=>{console.warn("[AUDITORIA ERROR]",u),c&&(c.textContent="⚠️ No se pudo guardar el registro de reproducción en Google Sheets.")}),M=null}function Fe(){const e=document.getElementById("admin-log-message");if(!e||!q)return;const t=f.get(),a=Number(k.startSec)||0,o=Number(k.endSec)||a,s=new Intl.DateTimeFormat("es-PE",{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(M||new Date),n=q.cancionNombre||`Composición #${q.cancionId}`,l=document.getElementById("admin-log-range");l&&(l.textContent=`de ${a}s a ${o}s`),e.textContent=`⏱ Reproducción iniciada: ${n} · Ronda ${t.rondaActual||1}, audición ${A} · de ${a}s a ${o}s · ${s}. Se guardará en Google Sheets al finalizar.`}function Ne(e){const t=r.get("btnPlay");t&&e&&(t.disabled=!0,t.textContent="⏳ Cargando audio...",t.className="bg-yellow-600 text-white text-xl md:text-2xl px-10 py-4 rounded-xl shadow-lg cursor-not-allowed opacity-80")}function pe(e){const t=r.get("btnPlay");t&&(t.disabled=!1,t.textContent="⏹ DETENER AUDICIÓN",t.className="bg-red-600 hover:bg-red-700 text-white text-xl md:text-2xl font-black px-10 py-4 rounded-xl shadow-xl transition animate-pulse cursor-pointer",document.body.classList.add("is-playing"))}function Y(){T=!1,document.body.classList.remove("is-playing");const e=r.get("btnPlay");e&&(e.disabled=!1,e.textContent="▶ REPRODUCIR AUDICIÓN",e.className="bg-emerald-600 hover:bg-emerald-500 text-white text-xl md:text-2xl font-black px-10 py-4 rounded-xl shadow-xl transition transform active:scale-95 inline-flex items-center space-x-3 cursor-pointer")}let j=null,Oe="rondas",L=[],_=[],ne=[],I=[],$={},F=[],H=[];function He(){Le();const e=document.getElementById("btn-abrir-config");e&&e.addEventListener("click",Ve)}function Le(){if(document.getElementById("modal-configuracion"))return;const e=document.createElement("div");e.id="modal-configuracion",e.className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 transition-opacity duration-300 hidden opacity-0",e.innerHTML=`
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
  `,document.body.appendChild(e),j=e,e.querySelector("#btn-cerrar-config").addEventListener("click",Se),e.querySelector("#btn-cerrar-config-footer").addEventListener("click",Se),e.querySelectorAll(".tab-btn").forEach(t=>{t.addEventListener("click",a=>{const o=a.currentTarget.dataset.tab;Ze(o)})})}async function Ve(){j||Le(),r.showLoading("Cargando configuraciones...");try{const[e,t,a,o,s]=await Promise.all([x.getConfig(),x.getCanciones(),x.getAlumnos(),x.getResultados(),x.getRespuestasRonda()]);$=e.data||{},w.syncFromBackend($),L=t.data||[],I=a.data||[],H=o.data||[],F=s.data||[];const n=Array.from({length:w.TOTAL_RONDAS},(b,c)=>c+1);_=(await Promise.all(n.map(b=>x.getAudicionesRonda(b)))).flatMap(b=>b.data||[]),ne=[..._],j.classList.remove("hidden"),setTimeout(()=>j.classList.remove("opacity-0"),10),Pe()}catch(e){console.error("Error al abrir configuración:",e),r.showToast("Error al cargar datos de configuración","error")}finally{r.hideLoading()}}function Se(){j&&(j.classList.add("opacity-0"),setTimeout(()=>j.classList.add("hidden"),250))}function Ze(e){Oe=e,j.querySelectorAll(".tab-btn").forEach(t=>{t.dataset.tab===e?t.className="tab-btn px-4 py-3 border-b-2 border-yellow-400 text-yellow-300 flex items-center space-x-2 whitespace-nowrap cursor-pointer":t.className="tab-btn px-4 py-3 border-b-2 border-transparent text-slate-400 hover:text-white flex items-center space-x-2 whitespace-nowrap cursor-pointer"}),Pe()}function Pe(){const e=document.getElementById("config-tab-content");if(e)switch(Oe){case"rondas":De(e);break;case"canciones":fe(e);break;case"sorteo":Ye(e);break;case"participantes":ae(e);break}}function Ye(e){const t=L.filter(o=>o.activa!==!1),a=Object.values(w.ROUNDS).reduce((o,s)=>o+s.audiciones,0);e.innerHTML=`
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
            <span>Guardar Sorteo en Google Sheets</span>
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
            ${Ee(_)}
          </tbody>
        </table>
      </div>
    </div>
  `,e.querySelector("#btn-generar-sorteo").addEventListener("click",()=>{if(t.length===0){r.showToast("No hay canciones activas para sortear","error");return}const o=[];let s=1;for(let n=1;n<=w.TOTAL_RONDAS;n++){const l=w.ROUNDS[n].audiciones;if(l>t.length){r.showToast(`La Ronda ${n} requiere ${l} canciones distintas, pero solo hay ${t.length} activas.`,"error",5e3);return}const b=Je(t);for(let c=1;c<=l;c++){const g=b[c-1];o.push({ronda:n,audicionNum:c,cancionId:g.id,cancionNombre:g.nombre,cancionCodigo:g.codigo,orden:s++})}}_=o,e.querySelector("#sorteo-preview-body").innerHTML=Ee(o),r.showToast("¡Nuevo sorteo aleatorio generado con éxito!","success",2500)}),e.querySelector("#btn-guardar-sorteo").addEventListener("click",async()=>{if(_.length===0){r.showToast("Genera un sorteo antes de guardar","warning");return}const o=!Ke(ne,_),s=H.length>0||F.length>0,n=o&&s;if(!(n&&!window.confirm("El sorteo actual ya tiene respuestas o resultados. Si guardas este nuevo sorteo, se borrarán los resultados y respuestas de todas las rondas. ¿Continuar?"))){r.showLoading("Guardando orden de audiciones en Google Sheets...");try{const l=await x.guardarAudicionesRonda(_,n),b=!!(l.data&&l.data.reinicioRealizado),c=f.get(),g=b?1:c.rondaActual||1,[u,i,d]=await Promise.all([x.getAudicionesRonda(g),x.getResultados(),x.getRespuestasRonda(g)]);H=i.data||[],F=d.data||[],ne=[..._],f.set({rondaActual:g,rondaCerrada:b?!1:!!c.rondaCerrada,audicionActual:1,audicionesRonda:u.data||[],resultados:H.filter(y=>Number(y.ronda)===g),respuestasAudicion:F});const p=document.getElementById("select-ronda");p&&(p.value=String(g)),V(f.get()),z(f.get()),r.showToast("✅ Sorteo de canciones guardado correctamente en la nube","success")}catch(l){console.error("Error al guardar sorteo:",l),r.showToast("Error al guardar sorteo: "+l.message,"error")}finally{r.hideLoading()}}})}function Ee(e){return!e||e.length===0?'<tr><td colspan="5" class="p-4 text-center text-slate-500">No hay sorteo cargado. Pulsa "Generar Nuevo Sorteo Aleatorio".</td></tr>':e.map(t=>{var a;return`
    <tr class="border-b border-slate-800/80 hover:bg-slate-800/40">
      <td class="p-2.5 text-center font-bold text-yellow-400">R${t.ronda}</td>
      <td class="p-2.5 text-center text-slate-300">Aud ${t.audicionNum}</td>
      <td class="p-2.5 font-semibold text-white">${S(t.cancionNombre||`Composición #${t.cancionId}`)}</td>
      <td class="p-2.5 text-center font-mono font-bold text-yellow-300">${S(t.cancionCodigo||"----")}</td>
      <td class="p-2.5 text-center text-slate-400">${((a=w.ROUNDS[t.ronda])==null?void 0:a.duracion)||0}s</td>
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
  `,e.querySelector("#btn-add-cancion").addEventListener("click",()=>{const t=e.querySelector("#add-cancion-nombre").value.trim(),a=e.querySelector("#add-cancion-codigo").value.trim(),o=e.querySelector("#add-cancion-drive").value.trim(),s=xe(o);if(!t){r.showToast("Ingresa el nombre de la obra","warning");return}const n=L.length>0?Math.max(...L.map(l=>Number(l.id)||0))+1:1;L.push({id:n,nombre:t.toUpperCase(),codigo:a.toUpperCase()||`ST${n.toString().padStart(4,"0")}`,driveId:s,archivoDriveId:s,anio:2026,activa:!0}),fe(e),r.showToast(`Obra "${t}" agregada a la lista`,"info",2e3)}),e.querySelectorAll(".btn-eliminar-cancion").forEach(t=>{t.addEventListener("click",a=>{const o=a.currentTarget.dataset.id;L=L.filter(s=>String(s.id)!==String(o)),fe(e)})}),e.querySelector("#btn-guardar-todas-canciones").addEventListener("click",async()=>{r.showLoading("Guardando lista de canciones en Google Sheets...");try{await x.guardarCanciones(L),f.set({canciones:L}),r.showToast("✅ Lista de canciones guardada exitosamente en la nube","success")}catch(t){r.showToast("Error al guardar canciones: "+t.message,"error")}finally{r.hideLoading()}})}function ae(e){e.innerHTML=`
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
        <span class="text-slate-400">Total participantes registrados: <strong class="text-white">${I.length}</strong></span>
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
            ${I.map((t,a)=>`
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
`),s=[];let n=a?1:I.length>0?Math.max(...I.map(l=>Number(l.id)||0))+1:1;o.forEach(l=>{const b=l.trim();if(!b)return;const c=b.includes("	")?b.split("	"):b.split(","),g=(c[0]||"").trim(),u=(c[1]||"").trim(),i=(c[2]||"").trim();g&&s.push({id:n++,nombre:g,grado:u||"",nivel:i||"",anio:2026,activo:!0})}),a?I=s:I=[...I,...s],ae(e),r.showToast(`Se procesaron ${s.length} participantes`,"success")}),e.querySelector("#btn-vaciar-alumnos").addEventListener("click",()=>{confirm("¿Deseas vaciar la lista temporal de participantes?")&&(I=[],ae(e))}),e.querySelectorAll(".btn-eliminar-alumno").forEach(t=>{t.addEventListener("click",a=>{const o=a.currentTarget.dataset.id;I=I.filter(s=>String(s.id)!==String(o)),ae(e)})}),e.querySelector("#btn-guardar-alumnos-cloud").addEventListener("click",async()=>{r.showLoading("Guardando participantes en Google Sheets...");try{await x.guardarAlumnosLote(I,!0),f.set({alumnos:I}),z(f.get()),r.showToast("✅ Participantes guardados exitosamente en la nube","success")}catch(t){r.showToast("Error al guardar participantes: "+t.message,"error")}finally{r.hideLoading()}})}function De(e){const t=$,a=Number(t.TOTAL_RONDAS)||w.TOTAL_RONDAS,o=Array.from({length:a},(s,n)=>n+1);e.innerHTML=`
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
          ${o.map(s=>{const n=ce(s,a),l=w.ROUNDS[s]||{duracion:Math.max(2,Math.round(40/Math.pow(2,s-1))),audiciones:s<=2?4:3,minimoPasar:s===a?3:2,puntosPorAcierto:1,bonusClasificar:0},b=Number(t[`DURACION_RONDA_${n}`]??t[`DURACION_RONDA_${s}`]??l.duracion),c=Number(t[`NUM_AUDICIONES_RONDA_${n}`]??t[`NUM_AUDICIONES_RONDA_${s}`]??l.audiciones),g=Number(t[`MINIMO_PASAR_RONDA_${n}`]??t[`MINIMO_PASAR_RONDA_${s}`]??l.minimoPasar),u=Number(t[`PUNTOS_POR_ACIERTO_RONDA_${n}`]??t[`PUNTOS_POR_ACIERTO_RONDA_${s}`]??l.puntosPorAcierto),i=Number(t[`BONUS_POR_CLASIFICAR_RONDA_${n}`]??t[`BONUS_POR_CLASIFICAR_RONDA_${s}`]??l.bonusClasificar);return`
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
  `,e.querySelector("#cfg-total-rondas").addEventListener("change",s=>{const n=Number(s.currentTarget.value);if(!Number.isInteger(n)||n<1||n>20){r.showToast("La cantidad de rondas debe ser un entero entre 1 y 20.","warning"),s.currentTarget.value=String(a);return}We(e,a),$.TOTAL_RONDAS=n,De(e)}),e.querySelector("#btn-guardar-reglas-cloud").addEventListener("click",async()=>{const s=Number(e.querySelector("#cfg-total-rondas").value);if(!Number.isInteger(s)||s<1||s>20){r.showToast("La cantidad de rondas debe ser un entero entre 1 y 20.","warning");return}const n={TOTAL_RONDAS:s,NOMBRE_EVENTO:e.querySelector("#cfg-nombre-evento").value.trim(),HOMENAJEADO:e.querySelector("#cfg-homenajeado").value.trim(),ANIO_CERTAMEN:Number(e.querySelector("#cfg-anio").value),PREMIOS_PRIMER_PUESTO:e.querySelector("#cfg-premio-1").value.trim(),PREMIOS_SEGUNDO_PUESTO:e.querySelector("#cfg-premio-2").value.trim(),PREMIOS_TERCER_PUESTO:e.querySelector("#cfg-premio-3").value.trim()};if(!Number.isInteger(n.ANIO_CERTAMEN)||n.ANIO_CERTAMEN<2e3||n.ANIO_CERTAMEN>2100){r.showToast("El año del certamen debe estar entre 2000 y 2100.","warning");return}for(let i=1;i<=s;i++){const d=Number(e.querySelector(`#cfg-dur-${i}`).value),p=Number(e.querySelector(`#cfg-aud-${i}`).value),y=Number(e.querySelector(`#cfg-min-${i}`).value),m=Number(e.querySelector(`#cfg-puntos-${i}`).value),h=Number(e.querySelector(`#cfg-bonus-${i}`).value);if(!Number.isInteger(d)||d<1||d>3600||!Number.isInteger(p)||p<1||p>100||!Number.isInteger(y)||y<1||y>p||!Number.isInteger(m)||m<0||m>1e4||!Number.isInteger(h)||h<0||h>1e4){r.showToast(`Revisa los valores de la Ronda ${i}: duración 1–3600, audiciones 1–100, mínimo 1–audiciones y puntos/bonus 0–10000.`,"warning",5e3);return}const v=ce(i,s);n[`DURACION_RONDA_${v}`]=d,n[`NUM_AUDICIONES_RONDA_${v}`]=p,n[`MINIMO_PASAR_RONDA_${v}`]=y,n[`PUNTOS_POR_ACIERTO_RONDA_${v}`]=m,n[`BONUS_POR_CLASIFICAR_RONDA_${v}`]=h}const l=s!==w.TOTAL_RONDAS||Object.entries(n).some(([i,d])=>/^(DURACION_RONDA_|NUM_AUDICIONES_RONDA_|MINIMO_PASAR_RONDA_)/.test(i)&&String($[i]===void 0?"":$[i])!==String(d)),b=Object.entries(n).some(([i,d])=>/^(PUNTOS_POR_ACIERTO_RONDA_|BONUS_POR_CLASIFICAR_RONDA_)/.test(i)&&String($[i]===void 0?i.indexOf("PUNTOS_POR_ACIERTO_")===0?1:0:$[i])!==String(d)),c=l||b,g=H.length>0||F.length>0,u=c&&g;if(!(u&&!window.confirm("Cambiar las reglas o los puntajes reiniciará las respuestas y los resultados guardados de todas las rondas. Si cambias la cantidad o los parámetros de las audiciones, también se reiniciará el sorteo. ¿Continuar?"))){r.showLoading("Actualizando parámetros en Google Sheets...");try{await x.guardarConfigLote(n,u),$={...$,...n},w.syncFromBackend($),l&&(_=[],ne=[]),u&&(F=[],H=[]);const i=f.get(),d=Number(i.rondaActual)||1,p=u||d>s?1:d;(l||u)&&f.set({rondaActual:p,rondaCerrada:!1,audicionActual:1,audicionesRonda:l?[]:i.audicionesRonda,resultados:u?[]:(i.resultados||[]).filter(m=>Number(m.ronda)===p),respuestasAudicion:u?[]:[]}),Qe();const y=document.getElementById("select-ronda");y&&(y.value=String(p)),V(f.get()),z(f.get()),r.showToast("✅ Paso 1 guardado. Continúa con canciones y luego realiza el sorteo.","success",4500)}catch(i){r.showToast("Error al actualizar configuración: "+i.message,"error")}finally{r.hideLoading()}}})}function We(e,t){for(let a=1;a<=t;a++){const o=e.querySelector(`#cfg-dur-${a}`),s=e.querySelector(`#cfg-aud-${a}`),n=e.querySelector(`#cfg-min-${a}`),l=e.querySelector(`#cfg-puntos-${a}`),b=e.querySelector(`#cfg-bonus-${a}`),c=ce(a,t);o&&($[`DURACION_RONDA_${c}`]=Number(o.value)),s&&($[`NUM_AUDICIONES_RONDA_${c}`]=Number(s.value)),n&&($[`MINIMO_PASAR_RONDA_${c}`]=Number(n.value)),l&&($[`PUNTOS_POR_ACIERTO_RONDA_${c}`]=Number(l.value)),b&&($[`BONUS_POR_CLASIFICAR_RONDA_${c}`]=Number(b.value))}}function Qe(){const e=document.getElementById("select-ronda");if(!e)return;const t=Number(e.value);e.innerHTML=Object.entries(w.ROUNDS).map(([a,o])=>`<option value="${a}">${S(o.nombre)} - ${o.audiciones} audiciones de ${o.duracion}s (mínimo: ${o.minimoPasar}, ${o.puntosPorAcierto} pts/acierto, +${o.bonusClasificar} bonus)</option>`).join(""),e.value=String(t<=w.TOTAL_RONDAS?t:1)}async function $e(){r.init(),r.showLoading("Conectando con el certamen...");try{let e=[],t=[],a=[],o=[],s=[],n=1,l=!1;try{const[c,g,u,i]=await Promise.all([x.getConfig().catch(m=>(console.warn("[APP] No se pudo cargar configuración del backend:",m),{data:{}})),x.getCanciones().catch(()=>({data:[]})),x.getAlumnos().catch(()=>({data:[]})),x.getEstadoCertamen().catch(()=>({data:null}))]);w.syncFromBackend(c.data||{}),e=g.data||[],t=u.data||[],i&&i.data&&(n=i.data.rondaActual||1,l=!!i.data.rondaCerrada),w.ROUNDS[n]||(n=1);const[d,p,y]=await Promise.all([x.getAudicionesRonda(n).catch(()=>({data:[]})),x.getResultados(n).catch(()=>({data:[]})),x.getRespuestasRonda(n).catch(m=>(console.warn("[APP] Backend aún no expone las respuestas por audición:",m),{data:[]}))]);a=d.data||[],o=p.data||[],s=y.data||[]}catch(c){console.warn("[APP] Aviso de red al conectar backend Apps Script:",c),r.showToast("Modo sin conexión o URL de Apps Script pendiente. Cargando vista.","warning",4e3)}f.set({canciones:e,alumnos:t,rondaActual:n,rondaCerrada:l,audicionActual:1,audicionesRonda:a,resultados:o,respuestasAudicion:s,isLoading:!1}),je(),He();const b=r.get("selectRonda");b&&(b.innerHTML=Object.entries(w.ROUNDS).map(([c,g])=>`<option value="${c}">${g.nombre} - ${g.audiciones} audiciones de ${g.duracion}s (mínimo: ${g.minimoPasar})</option>`).join(""),b.value=String(n)),V(f.get()),z(f.get()),console.log("✅ Aplicación inicializada correctamente"),r.showToast("Certamen listo para audición","success",2500)}catch(e){console.error("❌ Error al inicializar:",e),r.showToast("Error al conectar con la base de datos de Google Sheets.","error",5e3)}finally{r.hideLoading()}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",$e):$e();
