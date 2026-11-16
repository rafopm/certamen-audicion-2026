import{C as y,f as te,a as Me,b,g as ue}from"./formatters-NJ3LGy62.js";class ze{constructor(){this.state={rondaActual:1,rondaCerrada:!1,audicionActual:0,alumnos:[],canciones:[],configRonda:null,resultados:{},respuestasAudicion:[],isLoading:!1,error:null},this.listeners=[]}get(){return{...this.state}}set(t){this.state={...this.state,...t},this.notify()}subscribe(t){return this.listeners.push(t),()=>{this.listeners=this.listeners.filter(a=>a!==t)}}notify(){this.listeners.forEach(t=>t(this.state))}}const g=new ze;class Be{constructor(t,a={}){this.display=t,this.onTick=a.onTick||(()=>{}),this.onComplete=a.onComplete||(()=>{}),this.intervalId=null,this.timeLeft=0}start(t){this.stop(),this.timeLeft=t,this._updateDisplay(),this.intervalId=setInterval(()=>{this.timeLeft--,this._updateDisplay(),this.onTick(this.timeLeft),this.timeLeft<=0&&(this.stop(),this.onComplete())},1e3)}stop(){this.intervalId&&(clearInterval(this.intervalId),this.intervalId=null)}reset(){this.stop(),this.timeLeft=0,this._updateDisplay()}_updateDisplay(){this.display&&(this.display.textContent=this.timeLeft)}}class Ue{constructor(t,a,r={}){this.audio=t,this.timerDisplay=a,this.onComplete=r.onComplete||(()=>{}),this.onError=r.onError||(()=>{}),this.timer=new Be(a,{onComplete:()=>this.stop()}),this.playbackInfo={startSec:0,endSec:0,duration:0},this._setupAudioEvents()}_setupAudioEvents(){this.audio.addEventListener("error",()=>{const t=this.audio.error,a=t?`Error ${t.code}: ${t.message||"Error de audio"}`:"Error al cargar el audio";this.onError(a)})}async play(t,a,r={}){return new Promise((s,o)=>{this.audio.pause(),this.audio.currentTime=0;let i=!1;const p=()=>{this.audio.removeEventListener("canplay",f),this.audio.removeEventListener("error",v),this.audio.removeEventListener("loadedmetadata",x)},m=()=>{const c=this.audio.duration;if(r.customStart!==void 0&&r.customStart!==null)return Math.max(0,Number(r.customStart)||0);if(r.randomStart&&isFinite(c)&&c>a){const u=Math.max(0,Math.floor(c-a));return Math.floor(Math.random()*(u+1))}return 0},d=()=>{if(i)return;i=!0,p();const c=m(),u=c+a;this.playbackInfo={startSec:c,endSec:u,duration:a};try{c>0&&(this.audio.currentTime=c)}catch(l){console.warn("[PLAYER] Aviso al posicionar segundo de inicio:",l)}this.audio.play().then(()=>{this.timer.start(a),s(this.playbackInfo)}).catch(l=>{this.onError("Error al iniciar reproducción: "+l.message),o(l)})},f=()=>{d()},x=()=>{this.audio.readyState>=2&&d()},v=()=>{if(i)return;i=!0,p();const c=this.audio.error,u=c?`Error (${c.code}) al cargar audio`:"Error de reproducción";this.onError(u),o(new Error(u))};this.audio.addEventListener("loadedmetadata",x),this.audio.addEventListener("canplay",f),this.audio.addEventListener("error",v),this.audio.src=t,this.audio.load(),this.audio.readyState>=3&&d()})}stop(){try{this.audio.pause()}catch{}this.timer.stop(),this.onComplete()}pause(){this.audio.pause()}resume(){this.audio.play()}}const n={elements:{},init(){return this._ensureFeedbackElements(),this.elements={selectRonda:document.getElementById("select-ronda"),audicionNumero:document.getElementById("audicion-numero"),audioPlayer:document.getElementById("audio-player"),timerDisplay:document.getElementById("timer-display"),btnPlay:document.getElementById("btn-play"),listaAlumnos:document.getElementById("lista-alumnos"),btnGuardarAciertos:document.getElementById("btn-guardar-aciertos"),btnFinalizarRonda:document.getElementById("btn-finalizar-ronda"),btnResetRonda:document.getElementById("btn-reset-ronda"),btnVerRanking:document.getElementById("btn-ver-ranking"),rankingSection:document.getElementById("ranking-section"),rankingContent:document.getElementById("ranking-content"),loadingOverlay:document.getElementById("loading-overlay"),toast:document.getElementById("toast")},this.elements},_ensureFeedbackElements(){if(!document.getElementById("loading-overlay")){const e=document.createElement("div");e.id="loading-overlay",e.className="fixed inset-0 bg-black/75 z-50 flex flex-col items-center justify-center transition-opacity duration-300 hidden",e.innerHTML=`
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400 mb-4"></div>
        <p id="loading-text" class="text-white text-xl font-semibold tracking-wide">Cargando...</p>
      `,document.body.appendChild(e)}if(!document.getElementById("toast")){const e=document.createElement("div");e.id="toast",e.className="fixed bottom-5 right-5 z-50 max-w-md px-6 py-4 rounded-xl shadow-2xl text-white font-medium transform transition-all duration-300 translate-y-20 opacity-0 pointer-events-none flex items-center space-x-3",document.body.appendChild(e)}},get(e){return this.elements[e]||(this.elements[e]=document.getElementById(e)),this.elements[e]},showLoading(e="Procesando..."){const t=this.get("loadingOverlay");if(t){const a=document.getElementById("loading-text");a&&(a.textContent=e),t.classList.remove("hidden"),setTimeout(()=>t.classList.remove("opacity-0"),10)}},hideLoading(){const e=this.get("loadingOverlay");e&&(e.classList.add("opacity-0"),setTimeout(()=>e.classList.add("hidden"),250))},showToast(e,t="info",a=3500){const r=this.get("toast");if(!r)return;const s={success:"bg-emerald-600 border border-emerald-400",error:"bg-rose-600 border border-rose-400",warning:"bg-amber-600 border border-amber-400",info:"bg-blue-600 border border-blue-400"},o={success:"✓",error:"✕",warning:"⚠",info:"ℹ"};r.className=`fixed bottom-5 right-5 z-50 max-w-md px-6 py-4 rounded-xl shadow-2xl text-white font-medium transform transition-all duration-300 flex items-center space-x-3 ${s[t]||s.info}`,r.innerHTML=`
      <span class="text-2xl font-bold">${o[t]||"ℹ"}</span>
      <span class="flex-1">${e}</span>
    `,r.classList.remove("translate-y-20","opacity-0","pointer-events-none"),r.classList.add("translate-y-0","opacity-100"),this._toastTimer&&clearTimeout(this._toastTimer),this._toastTimer=setTimeout(()=>{r.classList.add("translate-y-20","opacity-0","pointer-events-none"),r.classList.remove("translate-y-0","opacity-100")},a)}};function xe(e){if(!e||typeof e!="string")return"";const t=e.trim();if(t.startsWith("[")&&t.endsWith("]")||t.toLowerCase()==="file_id"||t==="")return"";const a=t.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);if(a&&a[1])return a[1];const r=t.match(/[?&]id=([a-zA-Z0-9_-]+)/);if(r&&r[1])return r[1];const s=t.match(/\/d\/([a-zA-Z0-9_-]+)/);return s&&s[1]?s[1]:(/^[a-zA-Z0-9_-]{20,60}$/.test(t),t)}function je(e,t=y.TOTAL_RONDAS||5){const a=Number(e);return Number.isInteger(a)&&a>=1&&a<=t}function qe(e){const t=xe(e);return t?/^[a-zA-Z0-9_-]{20,60}$/.test(t):!1}function N(e){return e==null?"":String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function ae(e){return String(e||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase().replace(/[^A-Z0-9]/g,"")}function U(e,t){let a=[],r=[],s=[],o=1,i=!1,p=4,m=1;if(e&&Array.isArray(e.alumnos))a=e.alumnos||[],r=Array.isArray(e.resultados)?e.resultados:Object.values(e.resultados||{}),s=Array.isArray(e.respuestasAudicion)?e.respuestasAudicion:[],o=e.rondaActual||1,i=!!e.rondaCerrada,m=e.audicionActual||1,p=(y.ROUNDS[o]||{audiciones:4}).audiciones;else{a=Array.isArray(e)?e:[],r=Array.isArray(t)?t:[];const l=n.get("selectRonda");l&&(o=parseInt(l.value,10)||1);const h=n.get("audicionNumero");h&&(m=parseInt(h.textContent,10)||1),p=(y.ROUNDS[o]||{audiciones:4}).audiciones}const d=n.get("listaAlumnos");if(!d)return;if(a.length===0){d.innerHTML=`
      <div class="col-span-full text-center py-8 text-blue-200">
        <p class="text-lg">No hay alumnos registrados o activos para este certamen.</p>
      </div>
    `;return}const f={},x={};r.forEach(l=>{if(parseInt(l.ronda,10)===o&&(f[String(l.alumnoId)]=l),l.eliminado){const h=l.rondaEliminacion||l.ronda;(!x[String(l.alumnoId)]||h<x[String(l.alumnoId)])&&(x[String(l.alumnoId)]=h)}});const c=(y.ROUNDS[o]||{minimoPasar:2}).minimoPasar,u=s.filter(l=>Number(l.ronda)===Number(o));d.innerHTML=a.map(l=>{var ye;const h=f[String(l.id)],$=u.filter(L=>String(L.alumnoId)===String(l.id)),R=$.length>0?$.filter(L=>L.correcto===!0||String(L.correcto).toLowerCase()==="true").length:h?parseInt(h.aciertos,10):0,E=l.rondaEliminacion||x[String(l.id)],w=E&&E<o,S=h?h.eliminado:!1,C=te(l.nombre);let T="bg-blue-900/60 text-blue-200 border border-blue-400/30",V="En competencia";w?(T="bg-rose-950 text-rose-300 border border-rose-800",V=`❌ Eliminado en Ronda ${E}`):S?(T="bg-red-900/80 text-red-200 border border-red-500",V=`Eliminado en Ronda ${o}`):R>=c&&(T="bg-emerald-900/80 text-emerald-200 border border-emerald-500",V=`Clasificado (${R}/${p})`);let J="";for(let L=1;L<=p;L++){const ee=$.find(_e=>Number(_e.audicionNum)===L),ie=ee&&(ee.correcto===!0||String(ee.correcto).toLowerCase()==="true"),de=L===m,De=i||w||!de;J+=`
        <label class="flex flex-col items-center justify-center cursor-pointer p-1.5 rounded-lg border transition select-none ${de?"bg-yellow-500/20 border-yellow-400 shadow-md ring-1 ring-yellow-400":"bg-blue-950/60 hover:bg-blue-900 border-blue-700/50"}">
          <span class="text-xs ${de?"text-yellow-300 font-extrabold":"text-slate-300"} mb-1">Aud ${L}</span>
          <input 
            type="checkbox" 
            class="checkbox-acierto w-5 h-5 text-yellow-500 bg-blue-900 rounded border-gray-400 focus:ring-yellow-400 focus:ring-2 cursor-pointer"
            data-alumno-id="${N(l.id)}"
            data-audicion="${L}"
            ${ie?"checked":""}
            ${De?"disabled":""}
          />
          <span class="text-[9px] ${ee?ie?"text-emerald-300":"text-rose-300":"text-slate-500"}">${ee?ie?"Correcta":"Error":"Pendiente"}</span>
        </label>
      `}return`
      <div class="alumno-card bg-slate-800/90 border border-slate-700 rounded-xl p-4 shadow-md transition hover:border-yellow-500/50 ${w?"opacity-40 bg-slate-950 cursor-not-allowed":""}" data-alumno-card="${N(l.id)}">
        <div class="flex items-start justify-between mb-2">
          <div>
            <h3 class="font-bold text-base md:text-lg text-white">${N(C)}</h3>
            <p class="text-xs text-slate-300">${N(l.grado||"")} ${N(l.nivel||"")}</p>
          </div>
          <span class="text-xs px-2.5 py-1 rounded-full font-medium ${T}">
            ${V}
          </span>
        </div>

        <!-- Checkboxes de audiciones -->
        <div class="mt-2">
          <div class="text-xs text-slate-400 mb-1.5 flex justify-between items-center">
            <span>Aciertos Ronda ${o}:</span>
            <span class="font-bold text-yellow-400"><span id="aciertos-count-${l.id}">${R}</span> / ${p}</span>
          </div>
          <div class="grid grid-cols-${Math.min(p,4)} gap-1.5">
            ${J}
          </div>
        </div>

        <!-- Entrada rápida de respuesta de pizarra para el jurado -->
        ${w?"":`
          <div class="mt-3 pt-2 border-t border-slate-700/60 flex items-center gap-2">
            <span class="text-xs text-slate-400 whitespace-nowrap">✏️ Pizarra:</span>
            <input 
              type="text" 
              placeholder="Código escrito (ej: TP2380)"
              class="input-pizarra-alumno bg-slate-950 text-yellow-300 border border-slate-700 uppercase font-mono text-xs px-2.5 py-1 rounded-lg w-full focus:ring-1 focus:ring-yellow-400 focus:outline-none"
              data-alumno-id="${N(l.id)}"
              data-audicion="${m}"
              ${i?"disabled":""}
              value="${N(((ye=$.find(L=>Number(L.audicionNum)===m))==null?void 0:ye.respuesta)||"")}"
            />
          </div>
        `}
      </div>
    `}).join("")}function X(e,t){let a=[],r=1,s=1;if(e&&e.rondaActual!==void 0)r=e.rondaActual,a=e.audicionesRonda||e.audiciones||[],s=e.audicionActual||1;else{a=Array.isArray(e)?e:[],r=1;const v=n.get("audicionNumero");v&&(s=parseInt(v.textContent,10)||1)}const o=n.get("audicionNumero");o&&(o.textContent=String(s));const i=a.find(v=>v.audicionNum===s)||a[s-1],p=document.getElementById("admin-cancion-nombre"),m=document.getElementById("admin-cancion-codigo"),d=document.getElementById("admin-seg-duracion"),f=y.ROUNDS[r]||{duracion:40,audiciones:4};p&&(p.textContent=i?i.cancionNombre||`Composición #${i.cancionId}`:"Composición no asignada"),m&&(m.textContent=i&&i.cancionCodigo||"----"),d&&(d.textContent=String(f.duracion||40));const x=document.getElementById("ronda-info-detalles");x&&(x.innerHTML=`
      <div class="flex flex-wrap items-center justify-between text-xs md:text-sm bg-blue-950/70 p-3 rounded-lg border border-blue-700/60 mt-3 gap-2">
        <span>⏱ <strong>Duración:</strong> ${f.duracion||40}s por audición</span>
        <span>🎯 <strong>Mínimo para clasificar:</strong> ${f.minimoPasar||2} aciertos</span>
        <span>🎼 <strong>Total audiciones:</strong> ${f.audiciones||4}</span>
      </div>
    `)}function ve(e){const t=n.get("rankingContent");if(!t)return;if(!e||e.length===0){t.innerHTML=`
      <div class="text-center py-6 text-slate-300">
        <p>Aún no hay puntajes registrados en el certamen.</p>
      </div>
    `;return}const a=e.slice(0,3),r=Ge(a),s=e.map((o,i)=>{const p=i+1;let m=`<span class="font-bold text-slate-300">${Me(p)}</span>`,d="hover:bg-slate-700/50";p===1?(m='<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500 text-slate-950 font-black shadow-lg">🥇 1°</span>',d="bg-yellow-500/10 hover:bg-yellow-500/20 border-l-4 border-yellow-500"):p===2?(m='<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-300 text-slate-950 font-black shadow-lg">🥈 2°</span>',d="bg-slate-300/10 hover:bg-slate-300/20 border-l-4 border-slate-300"):p===3&&(m='<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-700 text-amber-100 font-black shadow-lg">🥉 3°</span>',d="bg-amber-700/10 hover:bg-amber-700/20 border-l-4 border-amber-600");const f=o.eliminado?`Eliminado en Ronda ${o.rondaEliminacion||1}`:`Activo (Ronda ${o.rondaMax||1})`;return`
      <tr class="border-b border-slate-700/60 ${d} transition-colors">
        <td class="p-3 text-center">${m}</td>
        <td class="p-3 font-semibold text-white">
          ${N(te(o.nombre))}
          ${o.premio?`<span class="block text-xs text-yellow-400 font-normal">🎁 ${o.premio}</span>`:""}
        </td>
        <td class="p-3 text-slate-300 text-sm">${N(o.grado||"")} ${N(o.nivel||"")}</td>
        <td class="p-3 text-center">
          <span class="inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${o.eliminado?"bg-rose-950 text-rose-300 border border-rose-800":"bg-emerald-950 text-emerald-300 border border-emerald-800"}">
            ${f}
          </span>
        </td>
        <td class="p-3 text-right font-bold text-yellow-400 text-lg">
          ${o.puntosTotal||0}
        </td>
      </tr>
    `}).join("");t.innerHTML=`
    ${r}

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
  `}function Ge(e){if(!e||e.length===0)return"";const[t,a,r]=e;return`
    <div class="podium-container flex justify-center items-end gap-3 md:gap-6 my-8 px-2 max-w-2xl mx-auto">
      
      <!-- 2do Puesto -->
      <div class="flex-1 text-center order-1 transform transition hover:-translate-y-1">
        ${a?`
          <div class="bg-slate-800/90 border-2 border-slate-300 rounded-t-2xl p-4 shadow-xl flex flex-col items-center">
            <div class="w-12 h-12 rounded-full bg-slate-300 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg mb-2">
              🥈
            </div>
            <p class="font-bold text-white text-sm md:text-base line-clamp-1">${N(te(a.nombre))}</p>
            <p class="text-xs text-slate-300 mb-2">${N(a.grado||"")}</p>
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
            <p class="font-extrabold text-yellow-300 text-base md:text-lg line-clamp-1">${N(te(t.nombre))}</p>
            <p class="text-xs text-yellow-200/80 mb-2">${N(t.grado||"")}</p>
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
        ${r?`
          <div class="bg-slate-800/90 border-2 border-amber-600 rounded-t-2xl p-4 shadow-xl flex flex-col items-center">
            <div class="w-12 h-12 rounded-full bg-amber-700 text-white font-black text-2xl flex items-center justify-center shadow-lg mb-2">
              🥉
            </div>
            <p class="font-bold text-white text-sm md:text-base line-clamp-1">${N(te(r.nombre))}</p>
            <p class="text-xs text-slate-300 mb-2">${N(r.grado||"")}</p>
            <div class="bg-slate-900/80 text-yellow-400 px-3 py-1 rounded-full text-sm font-extrabold border border-slate-700">
              ${r.puntosTotal||0} pts
            </div>
            <div class="h-14 md:h-20 w-full bg-gradient-to-t from-amber-800 to-amber-700 rounded-lg mt-3 flex items-center justify-center text-amber-200 font-black text-2xl shadow-inner">
              3°
            </div>
          </div>
        `:'<div class="h-24"></div>'}
      </div>

    </div>
  `}function me(e,t=40){const a=n.get("timerDisplay");a&&(a.textContent=e,e<=3&&e>0?a.className="text-7xl md:text-8xl font-black text-red-500 mb-4 animate-ping":e<=5&&e>0?a.className="text-7xl md:text-8xl font-black text-red-400 mb-4 animate-pulse":e<=10&&e>0?a.className="text-7xl md:text-8xl font-bold text-amber-400 mb-4":a.className="text-7xl md:text-8xl font-bold text-yellow-400 mb-4")}function Ce(e,t){return new Map((Array.isArray(e)?e:[]).filter(a=>Number(a.audicionNum)===Number(t)).map(a=>[String(a.alumnoId),a]))}function Te(e,t,a){if(!Array.isArray(a)||a.length===0)return!1;const r=Ce(e,t);return a.every(s=>r.has(String(s)))}let I=!1,K=!1,A=1,j=null,G=null,_={startSec:0,endSec:40},M=null,Z=null,q=null,F=!1;function Fe(e){n.init(),A=g.get().audicionActual||1;const t=n.get("btnPlay");t&&t.addEventListener("click",async()=>{if(I){He(e),Y();return}if(K)return;K=!0,Re(!0);const c=g.get(),u=c.rondaActual||1;let l=c.audicionesRonda||[];if(!l||l.length===0){n.showLoading("Obteniendo audición configurada...");try{l=(await b.getAudicionesRonda(u)).data||[],g.set({audicionesRonda:l})}catch(w){console.error("[AUDIO] No se pudieron cargar audiciones desde backend:",w),n.showToast("No se pudo cargar el sorteo de audiciones.","error"),K=!1,Y();return}finally{n.hideLoading()}}const h=l.find(w=>w.audicionNum===A)||l[A-1]||{};if(!h.cancionId){n.showToast("No hay un sorteo guardado para esta audición. Configura las canciones y genera el sorteo.","warning",4500),K=!1,Y();return}G=h;const $=xe(h.driveId||h.archivoDriveId);if(!qe($)){n.showToast("La canción asignada no tiene un archivo de audio válido en Google Drive.","error",4500),K=!1,Y();return}const R=document.getElementById("chk-random-start"),E=R?R.checked:!0;try{const w=`${Date.now()}-${Math.random().toString(36).slice(2,10)}`;M=w,F=!1;const S=await b.solicitarReproduccionProyector({commandId:w,ronda:u,audicionNum:A,fileId:$,randomStart:E});if(S.data&&S.data.status!=="loading")throw new Error("El proyector no aceptó la orden de reproducción.");I=!0,Ee(!0),k(`⏳ Enviando audición ${A} al proyector...`),be(w,e)}catch(w){if(M)try{const S=await b.getReproduccionProyector();if(S.data&&String(S.data.commandId)===M&&["loading","countdown","playing"].includes(S.data.status)){I=!0,Ee(!0),k("✅ La orden fue recibida; sincronizando con el proyector..."),be(M,e);return}}catch(S){console.error("[PROYECTOR] No se pudo confirmar la orden:",S)}console.error("[PROYECTOR] No se pudo solicitar la reproducción:",w),M=null,I=!1,k("⚠️ No se pudo iniciar la reproducción en el proyector."),n.showToast(`No se pudo iniciar la audición: ${w.message}`,"error",5e3),Y()}finally{K=!1,Re(!1)}});const a=e.onComplete;if(e.onComplete=()=>{F&&(ne(e,!0),Y(),n.showToast(`Audición ${A} finalizada. Verifica y guarda las respuestas.`,"info",3e3),z()),a&&a()},e.timer){const c=e.timer.onTick;e.timer.onTick=u=>{const l=g.get(),h=y.ROUNDS[l.rondaActual]||{duracion:40};me(u,h.duracion),c&&c(u)}}const r=document.getElementById("btn-prev-audicion"),s=document.getElementById("btn-next-audicion");r&&r.addEventListener("click",()=>{if(A>1){if(pe()&&!window.confirm("Hay respuestas sin guardar. ¿Descartarlas y volver a la audición anterior?"))return;A--,we(A),z()}}),s&&s.addEventListener("click",()=>{const c=g.get(),u=y.ROUNDS[c.rondaActual]||{audiciones:4};if(I){n.showToast("Espera a que termine el audio antes de cambiar de audición.","warning");return}if(!Ie()||pe()){n.showToast("Verifica y guarda las respuestas de esta audición antes de avanzar.","warning",4e3);return}A<u.audiciones&&(A++,we(A),z())});const o={AUDICION:document.getElementById("btn-modo-audicion"),CLASIFICADOS:document.getElementById("btn-modo-clasificados"),RANKING_FINAL:document.getElementById("btn-modo-ranking")};Object.entries(o).forEach(([c,u])=>{u&&u.addEventListener("click",async()=>{Ae(c,o),n.showToast(`Proyector configurado en: ${c}`,"info",2e3);try{await b.actualizarModoProyector(c)}catch(l){console.warn("Error al sincronizar modo proyector:",l)}})});const i=n.get("selectRonda");i&&i.addEventListener("change",async c=>{const u=parseInt(c.target.value,10);if(!je(u)){n.showToast("Ronda inválida","error");return}const l=g.get();if(I){c.target.value=String(l.rondaActual||1),n.showToast("Espera a que termine el audio antes de cambiar de ronda.","warning");return}if(u>(l.rondaActual||1)&&!ge()){c.target.value=String(l.rondaActual||1),n.showToast("Guarda todas las respuestas de la ronda actual antes de avanzar.","warning",4e3);return}n.showLoading(`Cargando Ronda ${u}...`);try{A=1,await b.actualizarRondaActual(u);const[h,$,R,E,w]=await Promise.all([b.getAudicionesRonda(u),b.getResultados(u),b.getAlumnos(),b.getRespuestasRonda(u),b.getEstadoCertamen()]);g.set({rondaActual:u,rondaCerrada:!!(w.data&&w.data.rondaCerrada),audicionActual:1,audicionesRonda:h.data||[],resultados:$.data||[],alumnos:R.data||[],respuestasAudicion:E.data||[]}),X(g.get()),U(g.get());const S=y.ROUNDS[u]||{duracion:40};me(S.duracion,S.duracion),he(0,S.duracion),z(),n.showToast(`Secuencia: Ronda ${u} activada`,"success")}catch(h){console.error("Error al cambiar ronda:",h),c.target.value=String(l.rondaActual||1),n.showToast("Error al cambiar de ronda: "+h.message,"error")}finally{n.hideLoading()}});const p=n.get("listaAlumnos");p&&(p.addEventListener("input",c=>{if(c.target&&c.target.classList.contains("input-pizarra-alumno")){const u=c.target.dataset.alumnoId,l=c.target.value.trim().toUpperCase(),$=g.get().audicionesRonda||[],R=$.find(J=>J.audicionNum===A)||$[A-1]||{},E=ae(R.cancionCodigo),w=ae(R.cancionNombre),S=[...p.querySelectorAll("[data-alumno-card]")].find(J=>J.getAttribute("data-alumno-card")===u);if(!S)return;const C=S.querySelector(`.checkbox-acierto[data-audicion="${A}"]`),T=ae(c.target.value);T!==""&&(T===E||T===w)?(c.target.classList.remove("border-slate-700","border-rose-500"),c.target.classList.add("border-emerald-400","bg-emerald-950/60"),C&&!C.checked&&(C.checked=!0,le(S,u))):l===""?(c.target.classList.remove("border-emerald-400","bg-emerald-950/60","border-rose-500"),c.target.classList.add("border-slate-700"),C&&(C.checked=!1)):(c.target.classList.remove("border-emerald-400","bg-emerald-950/60","border-slate-700"),c.target.classList.add("border-rose-500"),C&&(C.checked=!1)),le(S,u),z()}}),p.addEventListener("change",c=>{if(c.target&&c.target.classList.contains("checkbox-acierto")){const u=c.target.dataset.alumnoId,l=document.querySelector(`[data-alumno-card="${u}"]`);l&&le(l,u),z()}}));const m=n.get("btnGuardarAciertos");m&&m.addEventListener("click",async()=>{const c=g.get(),u=c.rondaActual||1,l=A;if(I){n.showToast("Espera a que termine el audio antes de guardar respuestas.","warning");return}const h=oe(c),$=[...document.querySelectorAll("[data-alumno-card]")];let R;try{R=h.map(E=>{const w=$.find(V=>V.getAttribute("data-alumno-card")===String(E.id));if(!w)throw new Error(`No se encontró la ficha del participante ${E.id}.`);const S=w.querySelector(`.input-pizarra-alumno[data-audicion="${l}"]`),C=w.querySelector(`.checkbox-acierto[data-audicion="${l}"]`),T=S?S.value.trim():"";return{alumnoId:E.id,respuesta:T,correcto:T!==""&&!!(C&&C.checked)}})}catch(E){console.error("Error al preparar respuestas:",E),n.showToast("Error al preparar respuestas: "+E.message,"error");return}if(R.length===0){n.showToast("No hay participantes elegibles para guardar.","warning");return}n.showLoading("Guardando respuestas de esta audición...");try{await b.guardarRespuestasAudicion({ronda:u,audicionNum:l,respuestas:R});const[E,w]=await Promise.all([b.getRespuestasRonda(u),b.getResultados(u)]);g.set({respuestasAudicion:E.data||[],resultados:w.data||[]}),U(g.get()),X(g.get()),z();const S=R.filter(C=>C.correcto).length;n.showToast(`Audición ${l} guardada: ${S} correctas y ${R.length-S} errores.`,"success",4500)}catch(E){console.error("Error al guardar respuestas:",E),n.showToast("❌ Error al guardar respuestas: "+E.message,"error")}finally{n.hideLoading()}});const d=n.get("btnFinalizarRonda");d&&d.addEventListener("click",async()=>{const u=g.get().rondaActual||1,l=y.ROUNDS[u]||{minimoPasar:2};if(!ge()){n.showToast("No se puede finalizar: guarda las respuestas de todas las audiciones primero.","warning",4500);return}if(window.confirm(`¿Desea FINALIZAR la Ronda ${u}?

• Mínimo exigido: ${l.minimoPasar} aciertos
• Los alumnos con menos de ${l.minimoPasar} aciertos quedarán marcados como ELIMINADOS EN RONDA ${u}.
• El proyector pasará automáticamente al modo CLASIFICADOS.

¿Continuar?`)){n.showLoading("Finalizando ronda y calculando clasificación...");try{const R=(await b.finalizarRonda(u)).data||{};n.showToast(`Ronda ${u} Finalizada: ${R.pasanCount||0} clasifican, ${R.eliminadosCount||0} eliminados`,"success",5e3);const[E,w,S]=await Promise.all([b.getResultados(u),b.getRanking(),b.getAlumnos()]);g.set({resultados:E.data||[],ranking:w.data||[],alumnos:S.data||[],rondaCerrada:!0}),U(g.get()),Ae(u===y.TOTAL_RONDAS?"RANKING_FINAL":"CLASIFICADOS",o);const C=n.get("rankingSection");if(C&&!C.classList.contains("hidden")&&ve(w.data||[]),R.siguienteRonda&&R.siguienteRonda!==u&&R.siguienteRonda<=y.TOTAL_RONDAS){const T=n.get("selectRonda");T&&(T.value=String(R.siguienteRonda),T.dispatchEvent(new Event("change")))}}catch($){console.error("Error al finalizar ronda:",$),n.showToast("Error al finalizar ronda: "+$.message,"error")}finally{n.hideLoading()}}});const f=n.get("btnResetRonda");f&&f.addEventListener("click",async()=>{const u=g.get().rondaActual||1;if(window.confirm(`⚠️ ATENCIÓN: ¿Está seguro de RESETEAR la Ronda ${u}?

Se borrarán las respuestas y resultados de la Ronda ${u} y de las rondas posteriores.`)){n.showLoading(`Reseteando datos de la Ronda ${u}...`);try{await b.resetRonda(u);const[h,$,R]=await Promise.all([b.getResultados(u),b.getAlumnos(),b.getRespuestasRonda(u)]);g.set({resultados:h.data||[],alumnos:$.data||[],respuestasAudicion:R.data||[],rondaCerrada:!1}),U(g.get()),z(),n.showToast(`Ronda ${u} ha sido reseteada correctamente`,"warning")}catch(h){console.error("Error al resetear ronda:",h),n.showToast("Error al resetear ronda: "+h.message,"error")}finally{n.hideLoading()}}});const x=n.get("btnVerRanking"),v=n.get("rankingSection");x&&v&&x.addEventListener("click",async()=>{if(v.classList.contains("hidden")){n.showLoading("Calculando tabla de posiciones y ranking...");try{const l=(await b.getRanking()).data||[];g.set({ranking:l}),ve(l),v.classList.remove("hidden"),x.textContent="✕ Ocultar Ranking",x.classList.replace("bg-purple-700","bg-purple-900"),v.scrollIntoView({behavior:"smooth"})}catch(u){console.error("Error al obtener ranking:",u),n.showToast("Error al obtener ranking: "+u.message,"error")}finally{n.hideLoading()}}else v.classList.add("hidden"),x.textContent="🏆 Ver Ranking",x.classList.replace("bg-purple-900","bg-purple-700")}),z()}function we(e){g.set({audicionActual:e}),X(g.get()),U(g.get());const t=g.get(),a=y.ROUNDS[t.rondaActual]||{duracion:40};he(0,a.duracion)}function oe(e=g.get()){const t=Number(e.rondaActual)||1;return(e.alumnos||[]).filter(a=>{const r=Number(a.rondaEliminacion);return Number.isInteger(r)&&r>0?r>=t:!a.eliminado})}function Ie(e=g.get()){const t=oe(e);return Te(e.respuestasAudicion,A,t.map(a=>a.id))}function pe(e=g.get()){const t=Ce(e.respuestasAudicion,A),a=[...document.querySelectorAll("[data-alumno-card]")];return oe(e).some(r=>{const s=a.find(x=>x.getAttribute("data-alumno-card")===String(r.id));if(!s)return!1;const o=s.querySelector(`.input-pizarra-alumno[data-audicion="${A}"]`),i=s.querySelector(`.checkbox-acierto[data-audicion="${A}"]`),p=o?o.value.trim():"",m=!!(i&&i.checked),d=t.get(String(r.id));if(!d)return p!==""||m;const f=d.correcto===!0||String(d.correcto).toLowerCase()==="true";return ae(p)!==ae(d.respuesta)||m!==f})}function ge(e=g.get()){const t=y.ROUNDS[e.rondaActual];if(!t)return!1;const a=oe(e).map(r=>r.id);return a.length===0?!1:Array.from({length:t.audiciones},(r,s)=>s+1).every(r=>Te(e.respuestasAudicion,r,a))}function z(){const e=g.get(),t=y.ROUNDS[e.rondaActual];if(!t)return;const a=Ie(e),r=pe(e),s=ge(e),o=!!e.rondaCerrada,i=document.getElementById("btn-prev-audicion"),p=document.getElementById("btn-next-audicion"),m=n.get("btnGuardarAciertos"),d=n.get("btnFinalizarRonda"),f=document.getElementById("audicion-estado-guardado");if(i&&(i.disabled=o||I||A<=1),p){const x=!o&&a&&!r&&!I&&A<t.audiciones;p.disabled=!x,p.textContent=A<t.audiciones?"Siguiente ▶":"Última audición"}m&&(m.disabled=o||I||oe(e).length===0),d&&(d.disabled=o||I||!s),f&&(o?f.textContent="Ronda finalizada":I?f.textContent="Audio en curso":r?f.textContent="Hay cambios sin guardar":a?f.textContent=`Respuestas de la audición ${A} guardadas`:f.textContent=`Audición ${A} pendiente de guardar`,f.className=`text-xs mb-3 ${o||a&&!r?"text-emerald-300":"text-amber-300"}`)}function he(e,t){const a=document.getElementById("badge-rango-reproduccion");a&&(a.textContent=`📍 Rango: de ${e}s a ${t}s`)}function le(e,t){const a=e.querySelectorAll(".checkbox-acierto:checked").length,r=document.getElementById(`aciertos-count-${t}`);r&&(r.textContent=a);const s=g.get(),o=y.ROUNDS[s.rondaActual]||{minimoPasar:2},i=e.querySelector("span.rounded-full");i&&!i.textContent.includes("Eliminado")&&(a>=o.minimoPasar?(i.className="text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-900/80 text-emerald-200 border border-emerald-500",i.textContent=`Clasificado (${a})`):(i.className="text-xs px-2.5 py-1 rounded-full font-medium bg-blue-900/60 text-blue-200 border border-blue-400/30",i.textContent="En competencia"))}function Ae(e,t){Object.entries(t).forEach(([a,r])=>{r&&(a===e?r.className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition border border-yellow-500 bg-yellow-500 text-slate-950 cursor-pointer shadow":r.className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition border border-slate-700 bg-slate-800 text-slate-300 hover:text-white cursor-pointer")})}function k(e){const t=document.getElementById("admin-audio-cache-status");t&&(t.textContent=e)}function be(e,t){if(M!==e)return;const a=Date.now();b.getReproduccionProyector().then(r=>{const s=Date.now(),o=r.data;if(!o||String(o.commandId)!==e)return;const i=Date.parse(o.serverNow),p=Number.isFinite(i)?i-(a+s)/2:0;if(o.status==="loading")k(`⏳ El proyector está cargando la audición ${o.audicionNum}...`);else if(o.status==="countdown"){if(_={startSec:Number(o.startSec)||0,endSec:Number(o.endSec)||Number(o.startSec)+Number(o.duration),duration:Number(o.duration)},he(_.startSec,_.endSec),k("✅ Archivo cargado en el proyector. Cuenta regresiva de 5 segundos..."),!q){const m=Date.parse(o.startAt);if(!Number.isFinite(m)){k("⚠️ El servidor devolvió una hora de inicio inválida."),b.actualizarReproduccionProyector({commandId:e,status:"error",error:"Hora de inicio inválida."}).catch(f=>console.error("[PROYECTOR] No se pudo reportar el error:",f));return}const d=Math.max(0,m-Date.now()-p);q=setTimeout(()=>{q=null,!(M!==e||!I)&&(F=!0,j=new Date,t.timer.start(Number(o.duration)),Ve(),k("🔊 Audición reproduciéndose desde el proyector."))},d)}}else if(o.status==="playing")k("🔊 Audición reproduciéndose desde el proyector.");else if(o.status==="completed"){F&&j&&(t.timer.stop(),ne(t,!0)),ce(t),n.showToast(`Audición ${A} finalizada. Verifica y guarda las respuestas.`,"info",3e3),z();return}else if(o.status==="error"){F&&j&&(t.timer.stop(),ne(t,!1)),ce(t),k(`⚠️ Error en el proyector: ${o.error||"no se pudo reproducir el audio."}`),n.showToast(`Error de reproducción en el proyector: ${o.error||"audio no disponible."}`,"error",5e3);return}else if(o.status==="cancelled"){ce(t),k("Audición detenida.");return}}).catch(r=>{console.warn("[PROYECTOR] No se pudo consultar el estado:",r),k("⚠️ Sin conexión con el proyector; intentando sincronizar...")}).finally(()=>{M===e&&(Z=setTimeout(()=>be(e,t),1e3))})}function He(e){const t=M;F&&j&&ne(e,!1),e.timer.stop(),q&&clearTimeout(q),Z&&clearTimeout(Z),q=null,Z=null,M=null,F=!1,j=null,t&&b.actualizarReproduccionProyector({commandId:t,status:"cancelled"}).catch(a=>console.error("[PROYECTOR] No se pudo detener la reproducción:",a)),k("Audición detenida.")}function ce(e){e.timer.stop(),q&&clearTimeout(q),Z&&clearTimeout(Z),q=null,Z=null,M=null,F=!1,j=null,Y()}function ne(e,t){if(!j||!G)return;const r=g.get().rondaActual||1,s=y.ROUNDS[r]||{duracion:40},o=_&&_.startSec!==void 0?_.startSec:0;let i=_&&_.endSec!==void 0?_.endSec:o+s.duracion;if(!t&&e.timer&&e.timer.timeLeft!==void 0){const d=s.duracion-e.timer.timeLeft;i=o+Math.max(1,d)}const p=Math.max(1,i-o),m=document.getElementById("admin-log-message");m&&(m.textContent="⏳ Audición finalizada. Guardando registro en Google Sheets..."),b.registrarReproduccion({ronda:r,audicionNum:A,cancionId:G.cancionId||"",cancionNombre:G.cancionNombre||"",cancionCodigo:G.cancionCodigo||"",segundoInicio:o,segundoFin:i,duracion:p}).then(d=>{console.log("[AUDITORIA] Registrado en Google Sheets:",d.data),m&&d.data&&(m.textContent=`✅ Registrado en Google Sheets: de ${o}s a ${i}s (${p}s) a las ${d.data.fechaHora.split(" ")[1]}`)}).catch(d=>{console.warn("[AUDITORIA ERROR]",d),m&&(m.textContent="⚠️ No se pudo guardar el registro de reproducción en Google Sheets.")}),j=null}function Ve(){const e=document.getElementById("admin-log-message");if(!e||!G)return;const t=g.get(),a=Number(_.startSec)||0,r=Number(_.endSec)||a,s=new Intl.DateTimeFormat("es-PE",{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(j||new Date),o=G.cancionNombre||`Composición #${G.cancionId}`;e.textContent=`⏱ Reproducción iniciada: ${o} · Ronda ${t.rondaActual||1}, audición ${A} · de ${a}s a ${r}s · ${s}. Se guardará en Google Sheets al finalizar.`}function Re(e){const t=n.get("btnPlay");t&&e&&(t.disabled=!0,t.textContent="⏳ Cargando audio...",t.className="bg-yellow-600 text-white text-xl md:text-2xl px-10 py-4 rounded-xl shadow-lg cursor-not-allowed opacity-80")}function Ee(e){const t=n.get("btnPlay");t&&(t.disabled=!1,t.textContent="⏹ DETENER AUDICIÓN",t.className="bg-red-600 hover:bg-red-700 text-white text-xl md:text-2xl font-black px-10 py-4 rounded-xl shadow-xl transition animate-pulse cursor-pointer",document.body.classList.add("is-playing"))}function Y(){I=!1,document.body.classList.remove("is-playing");const e=n.get("btnPlay");e&&(e.disabled=!1,e.textContent="▶ REPRODUCIR AUDICIÓN",e.className="bg-emerald-600 hover:bg-emerald-500 text-white text-xl md:text-2xl font-black px-10 py-4 rounded-xl shadow-xl transition transform active:scale-95 inline-flex items-center space-x-3 cursor-pointer")}let H=null,Le="rondas",D=[],B=[],se=[],O=[],P={},W=[],Q=[];function Ye(){Oe();const e=document.getElementById("btn-abrir-config");e&&e.addEventListener("click",Ze)}function Oe(){if(document.getElementById("modal-configuracion"))return;const e=document.createElement("div");e.id="modal-configuracion",e.className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 transition-opacity duration-300 hidden opacity-0",e.innerHTML=`
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
  `,document.body.appendChild(e),H=e,e.querySelector("#btn-cerrar-config").addEventListener("click",Se),e.querySelector("#btn-cerrar-config-footer").addEventListener("click",Se),e.querySelectorAll(".tab-btn").forEach(t=>{t.addEventListener("click",a=>{const r=a.currentTarget.dataset.tab;Je(r)})})}async function Ze(){H||Oe(),n.showLoading("Cargando configuraciones...");try{const[e,t,a,r,s]=await Promise.all([b.getConfig(),b.getCanciones(),b.getAlumnos(),b.getResultados(),b.getRespuestasRonda()]);P=e.data||{},y.syncFromBackend(P),D=t.data||[],O=a.data||[],Q=r.data||[],W=s.data||[];const o=Array.from({length:y.TOTAL_RONDAS},(p,m)=>m+1);B=(await Promise.all(o.map(p=>b.getAudicionesRonda(p)))).flatMap(p=>p.data||[]),se=[...B],H.classList.remove("hidden"),setTimeout(()=>H.classList.remove("opacity-0"),10),ke()}catch(e){console.error("Error al abrir configuración:",e),n.showToast("Error al cargar datos de configuración","error")}finally{n.hideLoading()}}function Se(){H&&(H.classList.add("opacity-0"),setTimeout(()=>H.classList.add("hidden"),250))}function Je(e){Le=e,H.querySelectorAll(".tab-btn").forEach(t=>{t.dataset.tab===e?t.className="tab-btn px-4 py-3 border-b-2 border-yellow-400 text-yellow-300 flex items-center space-x-2 whitespace-nowrap cursor-pointer":t.className="tab-btn px-4 py-3 border-b-2 border-transparent text-slate-400 hover:text-white flex items-center space-x-2 whitespace-nowrap cursor-pointer"}),ke()}function ke(){const e=document.getElementById("config-tab-content");if(e)switch(Le){case"rondas":Pe(e);break;case"canciones":fe(e);break;case"sorteo":Ke(e);break;case"participantes":re(e);break}}function Ke(e){const t=D.filter(r=>r.activa!==!1),a=Object.values(y.ROUNDS).reduce((r,s)=>r+s.audiciones,0);e.innerHTML=`
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
        <span>Total audiciones programadas: <strong class="text-white">${B.length||a}</strong></span>
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
            ${Ne(B)}
          </tbody>
        </table>
      </div>
    </div>
  `,e.querySelector("#btn-generar-sorteo").addEventListener("click",()=>{if(t.length===0){n.showToast("No hay canciones activas para sortear","error");return}const r=[];let s=1;for(let o=1;o<=y.TOTAL_RONDAS;o++){const i=y.ROUNDS[o].audiciones;if(i>t.length){n.showToast(`La Ronda ${o} requiere ${i} canciones distintas, pero solo hay ${t.length} activas.`,"error",5e3);return}const p=We(t);for(let m=1;m<=i;m++){const d=p[m-1];r.push({ronda:o,audicionNum:m,cancionId:d.id,cancionNombre:d.nombre,cancionCodigo:d.codigo,orden:s++})}}B=r,e.querySelector("#sorteo-preview-body").innerHTML=Ne(r),n.showToast("¡Nuevo sorteo aleatorio generado con éxito!","success",2500)}),e.querySelector("#btn-guardar-sorteo").addEventListener("click",async()=>{if(B.length===0){n.showToast("Genera un sorteo antes de guardar","warning");return}const r=!Qe(se,B),s=Q.length>0||W.length>0,o=r&&s;if(!(o&&!window.confirm("El sorteo actual ya tiene respuestas o resultados. Si guardas este nuevo sorteo, se borrarán los resultados y respuestas de todas las rondas. ¿Continuar?"))){n.showLoading("Guardando orden de audiciones en Google Sheets...");try{const i=await b.guardarAudicionesRonda(B,o),p=!!(i.data&&i.data.reinicioRealizado),m=g.get(),d=p?1:m.rondaActual||1,[f,x,v]=await Promise.all([b.getAudicionesRonda(d),b.getResultados(),b.getRespuestasRonda(d)]);Q=x.data||[],W=v.data||[],se=[...B],g.set({rondaActual:d,rondaCerrada:p?!1:!!m.rondaCerrada,audicionActual:1,audicionesRonda:f.data||[],resultados:Q.filter(u=>Number(u.ronda)===d),respuestasAudicion:W});const c=document.getElementById("select-ronda");c&&(c.value=String(d)),X(g.get()),U(g.get()),n.showToast("✅ Sorteo de canciones guardado correctamente en la nube","success")}catch(i){console.error("Error al guardar sorteo:",i),n.showToast("Error al guardar sorteo: "+i.message,"error")}finally{n.hideLoading()}}})}function Ne(e){return!e||e.length===0?'<tr><td colspan="5" class="p-4 text-center text-slate-500">No hay sorteo cargado. Pulsa "Generar Nuevo Sorteo Aleatorio".</td></tr>':e.map(t=>{var a;return`
    <tr class="border-b border-slate-800/80 hover:bg-slate-800/40">
      <td class="p-2.5 text-center font-bold text-yellow-400">R${t.ronda}</td>
      <td class="p-2.5 text-center text-slate-300">Aud ${t.audicionNum}</td>
      <td class="p-2.5 font-semibold text-white">${N(t.cancionNombre||`Composición #${t.cancionId}`)}</td>
      <td class="p-2.5 text-center font-mono font-bold text-yellow-300">${N(t.cancionCodigo||"----")}</td>
      <td class="p-2.5 text-center text-slate-400">${((a=y.ROUNDS[t.ronda])==null?void 0:a.duracion)||0}s</td>
    </tr>
  `}).join("")}function We(e){const t=[...e];for(let a=t.length-1;a>0;a--){const r=Math.floor(Math.random()*(a+1));[t[a],t[r]]=[t[r],t[a]]}return t}function Qe(e,t){if(e.length!==t.length)return!1;const a=new Map(e.map(r=>[`${r.ronda}:${r.audicionNum}`,String(r.cancionId)]));return t.every(r=>a.get(`${r.ronda}:${r.audicionNum}`)===String(r.cancionId))}function fe(e){e.innerHTML=`
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
        <span class="text-slate-400">Total canciones en repertorio: <strong class="text-white">${D.length}</strong></span>
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
  `,e.querySelector("#btn-add-cancion").addEventListener("click",()=>{const t=e.querySelector("#add-cancion-nombre").value.trim(),a=e.querySelector("#add-cancion-codigo").value.trim(),r=e.querySelector("#add-cancion-drive").value.trim(),s=xe(r);if(!t){n.showToast("Ingresa el nombre de la obra","warning");return}const o=D.length>0?Math.max(...D.map(i=>Number(i.id)||0))+1:1;D.push({id:o,nombre:t.toUpperCase(),codigo:a.toUpperCase()||`ST${o.toString().padStart(4,"0")}`,driveId:s,archivoDriveId:s,anio:2026,activa:!0}),fe(e),n.showToast(`Obra "${t}" agregada a la lista`,"info",2e3)}),e.querySelectorAll(".btn-eliminar-cancion").forEach(t=>{t.addEventListener("click",a=>{const r=a.currentTarget.dataset.id;D=D.filter(s=>String(s.id)!==String(r)),fe(e)})}),e.querySelector("#btn-guardar-todas-canciones").addEventListener("click",async()=>{n.showLoading("Guardando lista de canciones en Google Sheets...");try{await b.guardarCanciones(D),g.set({canciones:D}),n.showToast("✅ Lista de canciones guardada exitosamente en la nube","success")}catch(t){n.showToast("Error al guardar canciones: "+t.message,"error")}finally{n.hideLoading()}})}function re(e){e.innerHTML=`
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
        <span class="text-slate-400">Total participantes registrados: <strong class="text-white">${O.length}</strong></span>
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
            ${O.map((t,a)=>`
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
  `,e.querySelector("#btn-importar-masivo").addEventListener("click",()=>{const t=e.querySelector("#textarea-alumnos-masivo").value.trim();if(!t){n.showToast("Pega al menos una línea con datos de alumnos","warning");return}const a=e.querySelector("#chk-reemplazar-alumnos").checked,r=t.split(`
`),s=[];let o=a?1:O.length>0?Math.max(...O.map(i=>Number(i.id)||0))+1:1;r.forEach(i=>{const p=i.trim();if(!p)return;const m=p.includes("	")?p.split("	"):p.split(","),d=(m[0]||"").trim(),f=(m[1]||"").trim(),x=(m[2]||"").trim();d&&s.push({id:o++,nombre:d,grado:f||"",nivel:x||"",anio:2026,activo:!0})}),a?O=s:O=[...O,...s],re(e),n.showToast(`Se procesaron ${s.length} participantes`,"success")}),e.querySelector("#btn-vaciar-alumnos").addEventListener("click",()=>{confirm("¿Deseas vaciar la lista temporal de participantes?")&&(O=[],re(e))}),e.querySelectorAll(".btn-eliminar-alumno").forEach(t=>{t.addEventListener("click",a=>{const r=a.currentTarget.dataset.id;O=O.filter(s=>String(s.id)!==String(r)),re(e)})}),e.querySelector("#btn-guardar-alumnos-cloud").addEventListener("click",async()=>{n.showLoading("Guardando participantes en Google Sheets...");try{await b.guardarAlumnosLote(O,!0),g.set({alumnos:O}),U(g.get()),n.showToast("✅ Participantes guardados exitosamente en la nube","success")}catch(t){n.showToast("Error al guardar participantes: "+t.message,"error")}finally{n.hideLoading()}})}function Pe(e){const t=P,a=Number(t.TOTAL_RONDAS)||y.TOTAL_RONDAS,r=Array.from({length:a},(s,o)=>o+1);e.innerHTML=`
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
            <input type="text" id="cfg-nombre-evento" value="${N(t.NOMBRE_EVENTO||"Certamen Audición Musical 2026")}" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white">
          </div>
          <div>
            <label class="block text-xs text-slate-300 mb-1">Compositor Homenajeado:</label>
            <input type="text" id="cfg-homenajeado" value="${N(t.HOMENAJEADO||"Johann Strauss")}" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white">
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
          ${r.map(s=>{const o=ue(s,a),i=y.ROUNDS[s]||{duracion:Math.max(2,Math.round(40/Math.pow(2,s-1))),audiciones:s<=2?4:3,minimoPasar:s===a?3:2},p=Number(t[`DURACION_RONDA_${o}`]??t[`DURACION_RONDA_${s}`]??i.duracion),m=Number(t[`NUM_AUDICIONES_RONDA_${o}`]??t[`NUM_AUDICIONES_RONDA_${s}`]??i.audiciones),d=Number(t[`MINIMO_PASAR_RONDA_${o}`]??t[`MINIMO_PASAR_RONDA_${s}`]??i.minimoPasar);return`
              <div class="bg-slate-900/90 border border-slate-700 p-3 rounded-xl space-y-2">
                <span class="font-bold text-yellow-400 block text-center border-b border-slate-700 pb-1">
                  ${s===a?"Ronda Final":`Ronda ${s}`}
                </span>
                <div>
                  <label class="text-[10px] text-slate-400 block">Duración (seg):</label>
                  <input type="number" id="cfg-dur-${s}" min="1" max="3600" step="1" value="${p}" class="w-full bg-slate-950 border border-slate-700 rounded p-1 text-center font-bold text-white">
                </div>
                <div>
                  <label class="text-[10px] text-slate-400 block">Audiciones:</label>
                  <input type="number" id="cfg-aud-${s}" min="1" max="100" step="1" value="${m}" class="w-full bg-slate-950 border border-slate-700 rounded p-1 text-center font-bold text-white">
                </div>
                <div>
                  <label class="text-[10px] text-slate-400 block">Mínimo clasificar:</label>
                  <input type="number" id="cfg-min-${s}" min="1" max="${m}" step="1" value="${d}" class="w-full bg-slate-950 border border-slate-700 rounded p-1 text-center font-bold text-yellow-300">
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
            <input type="text" id="cfg-premio-1" value="${N(t.PREMIOS_PRIMER_PUESTO||"Diploma, medalla y premio sorpresa")}" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white">
          </div>
          <div>
            <label class="block text-slate-400 mb-1">🥈 Segundo Puesto:</label>
            <input type="text" id="cfg-premio-2" value="${N(t.PREMIOS_SEGUNDO_PUESTO||"Diploma, medalla y premio sorpresa")}" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white">
          </div>
          <div>
            <label class="block text-slate-400 mb-1">🥉 Tercer Puesto:</label>
            <input type="text" id="cfg-premio-3" value="${N(t.PREMIOS_TERCER_PUESTO||"Diploma y medalla")}" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white">
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
  `,e.querySelector("#cfg-total-rondas").addEventListener("change",s=>{const o=Number(s.currentTarget.value);if(!Number.isInteger(o)||o<1||o>20){n.showToast("La cantidad de rondas debe ser un entero entre 1 y 20.","warning"),s.currentTarget.value=String(a);return}Xe(e,a),P.TOTAL_RONDAS=o,Pe(e)}),e.querySelector("#btn-guardar-reglas-cloud").addEventListener("click",async()=>{const s=Number(e.querySelector("#cfg-total-rondas").value);if(!Number.isInteger(s)||s<1||s>20){n.showToast("La cantidad de rondas debe ser un entero entre 1 y 20.","warning");return}const o={TOTAL_RONDAS:s,NOMBRE_EVENTO:e.querySelector("#cfg-nombre-evento").value.trim(),HOMENAJEADO:e.querySelector("#cfg-homenajeado").value.trim(),ANIO_CERTAMEN:Number(e.querySelector("#cfg-anio").value),PREMIOS_PRIMER_PUESTO:e.querySelector("#cfg-premio-1").value.trim(),PREMIOS_SEGUNDO_PUESTO:e.querySelector("#cfg-premio-2").value.trim(),PREMIOS_TERCER_PUESTO:e.querySelector("#cfg-premio-3").value.trim()};if(!Number.isInteger(o.ANIO_CERTAMEN)||o.ANIO_CERTAMEN<2e3||o.ANIO_CERTAMEN>2100){n.showToast("El año del certamen debe estar entre 2000 y 2100.","warning");return}for(let d=1;d<=s;d++){const f=Number(e.querySelector(`#cfg-dur-${d}`).value),x=Number(e.querySelector(`#cfg-aud-${d}`).value),v=Number(e.querySelector(`#cfg-min-${d}`).value);if(!Number.isInteger(f)||f<1||f>3600||!Number.isInteger(x)||x<1||x>100||!Number.isInteger(v)||v<1||v>x){n.showToast(`Revisa los valores de la Ronda ${d}: duración 1–3600, audiciones 1–100 y mínimo 1–audiciones.`,"warning",5e3);return}const c=ue(d,s);o[`DURACION_RONDA_${c}`]=f,o[`NUM_AUDICIONES_RONDA_${c}`]=x,o[`MINIMO_PASAR_RONDA_${c}`]=v}const i=s!==y.TOTAL_RONDAS||Object.entries(o).some(([d,f])=>/^(DURACION_RONDA_|NUM_AUDICIONES_RONDA_|MINIMO_PASAR_RONDA_)/.test(d)&&String(P[d]===void 0?"":P[d])!==String(f)),p=Q.length>0||W.length>0,m=i&&p;if(!(m&&!window.confirm("Cambiar las reglas reiniciará el sorteo, las respuestas y los resultados guardados de todas las rondas. ¿Continuar?"))){n.showLoading("Actualizando parámetros en Google Sheets...");try{await b.guardarConfigLote(o,m),P={...P,...o},y.syncFromBackend(P),i&&(B=[],se=[]),m&&(W=[],Q=[]);const d=g.get(),f=Number(d.rondaActual)||1,x=m||f>s?1:f;i&&g.set({rondaActual:x,rondaCerrada:!1,audicionActual:1,audicionesRonda:[],resultados:m?[]:(d.resultados||[]).filter(c=>Number(c.ronda)===x),respuestasAudicion:m?[]:[]}),et();const v=document.getElementById("select-ronda");v&&(v.value=String(x)),X(g.get()),U(g.get()),n.showToast("✅ Paso 1 guardado. Continúa con canciones y luego realiza el sorteo.","success",4500)}catch(d){n.showToast("Error al actualizar configuración: "+d.message,"error")}finally{n.hideLoading()}}})}function Xe(e,t){for(let a=1;a<=t;a++){const r=e.querySelector(`#cfg-dur-${a}`),s=e.querySelector(`#cfg-aud-${a}`),o=e.querySelector(`#cfg-min-${a}`),i=ue(a,t);r&&(P[`DURACION_RONDA_${i}`]=Number(r.value)),s&&(P[`NUM_AUDICIONES_RONDA_${i}`]=Number(s.value)),o&&(P[`MINIMO_PASAR_RONDA_${i}`]=Number(o.value))}}function et(){const e=document.getElementById("select-ronda");if(!e)return;const t=Number(e.value);e.innerHTML=Object.entries(y.ROUNDS).map(([a,r])=>`<option value="${a}">${N(r.nombre)} - ${r.audiciones} audiciones de ${r.duracion}s (mínimo: ${r.minimoPasar})</option>`).join(""),e.value=String(t<=y.TOTAL_RONDAS?t:1)}async function $e(){n.init(),n.showLoading("Conectando con el certamen...");try{let e=[],t=[],a=[],r=[],s=[],o=1,i=!1;try{const[v,c,u,l]=await Promise.all([b.getConfig().catch(E=>(console.warn("[APP] No se pudo cargar configuración del backend:",E),{data:{}})),b.getCanciones().catch(()=>({data:[]})),b.getAlumnos().catch(()=>({data:[]})),b.getEstadoCertamen().catch(()=>({data:null}))]);y.syncFromBackend(v.data||{}),e=c.data||[],t=u.data||[],l&&l.data&&(o=l.data.rondaActual||1,i=!!l.data.rondaCerrada),y.ROUNDS[o]||(o=1);const[h,$,R]=await Promise.all([b.getAudicionesRonda(o).catch(()=>({data:[]})),b.getResultados(o).catch(()=>({data:[]})),b.getRespuestasRonda(o).catch(E=>(console.warn("[APP] Backend aún no expone las respuestas por audición:",E),{data:[]}))]);a=h.data||[],r=$.data||[],s=R.data||[]}catch(v){console.warn("[APP] Aviso de red al conectar backend Apps Script:",v),n.showToast("Modo sin conexión o URL de Apps Script pendiente. Cargando vista.","warning",4e3)}g.set({canciones:e,alumnos:t,rondaActual:o,rondaCerrada:i,audicionActual:1,audicionesRonda:a,resultados:r,respuestasAudicion:s,isLoading:!1});const p=n.get("audioPlayer"),m=n.get("timerDisplay"),d=new Ue(p,m,{onComplete:()=>console.log("[PLAYER] Audición finalizada")});Fe(d),Ye();const f=n.get("selectRonda");f&&(f.innerHTML=Object.entries(y.ROUNDS).map(([v,c])=>`<option value="${v}">${c.nombre} - ${c.audiciones} audiciones de ${c.duracion}s (mínimo: ${c.minimoPasar})</option>`).join(""),f.value=String(o));const x=(y.ROUNDS[o]||{}).duracion||40;me(x,x),X(g.get()),U(g.get()),console.log("✅ Aplicación inicializada correctamente"),n.showToast("Certamen listo para audición","success",2500)}catch(e){console.error("❌ Error al inicializar:",e),n.showToast("Error al conectar con la base de datos de Google Sheets.","error",5e3)}finally{n.hideLoading()}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",$e):$e();
