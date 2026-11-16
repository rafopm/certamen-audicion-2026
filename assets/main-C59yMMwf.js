import{C as v,f as Y,a as ke,b as f,g as se}from"./formatters-IVlRgLhJ.js";class Pe{constructor(){this.state={rondaActual:1,rondaCerrada:!1,audicionActual:0,alumnos:[],canciones:[],configRonda:null,resultados:{},respuestasAudicion:[],isLoading:!1,error:null},this.listeners=[]}get(){return{...this.state}}set(t){this.state={...this.state,...t},this.notify()}subscribe(t){return this.listeners.push(t),()=>{this.listeners=this.listeners.filter(a=>a!==t)}}notify(){this.listeners.forEach(t=>t(this.state))}}const p=new Pe;class _e{constructor(t,a={}){this.display=t,this.onTick=a.onTick||(()=>{}),this.onComplete=a.onComplete||(()=>{}),this.intervalId=null,this.timeLeft=0}start(t){this.stop(),this.timeLeft=t,this._updateDisplay(),this.intervalId=setInterval(()=>{this.timeLeft--,this._updateDisplay(),this.onTick(this.timeLeft),this.timeLeft<=0&&(this.stop(),this.onComplete())},1e3)}stop(){this.intervalId&&(clearInterval(this.intervalId),this.intervalId=null)}reset(){this.stop(),this.timeLeft=0,this._updateDisplay()}_updateDisplay(){this.display&&(this.display.textContent=this.timeLeft)}}class Me{constructor(t,a,o={}){this.audio=t,this.timerDisplay=a,this.onComplete=o.onComplete||(()=>{}),this.onError=o.onError||(()=>{}),this.timer=new _e(a,{onComplete:()=>this.stop()}),this.playbackInfo={startSec:0,endSec:0,duration:0},this._setupAudioEvents()}_setupAudioEvents(){this.audio.addEventListener("error",()=>{const t=this.audio.error,a=t?`Error ${t.code}: ${t.message||"Error de audio"}`:"Error al cargar el audio";this.onError(a)})}async play(t,a,o={}){return new Promise((r,n)=>{this.audio.pause(),this.audio.currentTime=0;let i=!1;const c=()=>{this.audio.removeEventListener("canplay",b),this.audio.removeEventListener("error",R),this.audio.removeEventListener("loadedmetadata",x)},g=()=>{const l=this.audio.duration;if(o.customStart!==void 0&&o.customStart!==null)return Math.max(0,Number(o.customStart)||0);if(o.randomStart&&isFinite(l)&&l>a){const u=Math.max(0,Math.floor(l-a));return Math.floor(Math.random()*(u+1))}return 0},d=()=>{if(i)return;i=!0,c();const l=g(),u=l+a;this.playbackInfo={startSec:l,endSec:u,duration:a};try{l>0&&(this.audio.currentTime=l)}catch(m){console.warn("[PLAYER] Aviso al posicionar segundo de inicio:",m)}this.audio.play().then(()=>{this.timer.start(a),r(this.playbackInfo)}).catch(m=>{this.onError("Error al iniciar reproducción: "+m.message),n(m)})},b=()=>{d()},x=()=>{this.audio.readyState>=2&&d()},R=()=>{if(i)return;i=!0,c();const l=this.audio.error,u=l?`Error (${l.code}) al cargar audio`:"Error de reproducción";this.onError(u),n(new Error(u))};this.audio.addEventListener("loadedmetadata",x),this.audio.addEventListener("canplay",b),this.audio.addEventListener("error",R),this.audio.src=t,this.audio.load(),this.audio.readyState>=3&&d()})}stop(){try{this.audio.pause()}catch{}this.timer.stop(),this.onComplete()}pause(){this.audio.pause()}resume(){this.audio.play()}}const s={elements:{},init(){return this._ensureFeedbackElements(),this.elements={selectRonda:document.getElementById("select-ronda"),audicionNumero:document.getElementById("audicion-numero"),audioPlayer:document.getElementById("audio-player"),timerDisplay:document.getElementById("timer-display"),btnPlay:document.getElementById("btn-play"),listaAlumnos:document.getElementById("lista-alumnos"),btnGuardarAciertos:document.getElementById("btn-guardar-aciertos"),btnFinalizarRonda:document.getElementById("btn-finalizar-ronda"),btnResetRonda:document.getElementById("btn-reset-ronda"),btnVerRanking:document.getElementById("btn-ver-ranking"),rankingSection:document.getElementById("ranking-section"),rankingContent:document.getElementById("ranking-content"),loadingOverlay:document.getElementById("loading-overlay"),toast:document.getElementById("toast")},this.elements},_ensureFeedbackElements(){if(!document.getElementById("loading-overlay")){const e=document.createElement("div");e.id="loading-overlay",e.className="fixed inset-0 bg-black/75 z-50 flex flex-col items-center justify-center transition-opacity duration-300 hidden",e.innerHTML=`
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400 mb-4"></div>
        <p id="loading-text" class="text-white text-xl font-semibold tracking-wide">Cargando...</p>
      `,document.body.appendChild(e)}if(!document.getElementById("toast")){const e=document.createElement("div");e.id="toast",e.className="fixed bottom-5 right-5 z-50 max-w-md px-6 py-4 rounded-xl shadow-2xl text-white font-medium transform transition-all duration-300 translate-y-20 opacity-0 pointer-events-none flex items-center space-x-3",document.body.appendChild(e)}},get(e){return this.elements[e]||(this.elements[e]=document.getElementById(e)),this.elements[e]},showLoading(e="Procesando..."){const t=this.get("loadingOverlay");if(t){const a=document.getElementById("loading-text");a&&(a.textContent=e),t.classList.remove("hidden"),setTimeout(()=>t.classList.remove("opacity-0"),10)}},hideLoading(){const e=this.get("loadingOverlay");e&&(e.classList.add("opacity-0"),setTimeout(()=>e.classList.add("hidden"),250))},showToast(e,t="info",a=3500){const o=this.get("toast");if(!o)return;const r={success:"bg-emerald-600 border border-emerald-400",error:"bg-rose-600 border border-rose-400",warning:"bg-amber-600 border border-amber-400",info:"bg-blue-600 border border-blue-400"},n={success:"✓",error:"✕",warning:"⚠",info:"ℹ"};o.className=`fixed bottom-5 right-5 z-50 max-w-md px-6 py-4 rounded-xl shadow-2xl text-white font-medium transform transition-all duration-300 flex items-center space-x-3 ${r[t]||r.info}`,o.innerHTML=`
      <span class="text-2xl font-bold">${n[t]||"ℹ"}</span>
      <span class="flex-1">${e}</span>
    `,o.classList.remove("translate-y-20","opacity-0","pointer-events-none"),o.classList.add("translate-y-0","opacity-100"),this._toastTimer&&clearTimeout(this._toastTimer),this._toastTimer=setTimeout(()=>{o.classList.add("translate-y-20","opacity-0","pointer-events-none"),o.classList.remove("translate-y-0","opacity-100")},a)}};function ue(e){if(!e||typeof e!="string")return"";const t=e.trim();if(t.startsWith("[")&&t.endsWith("]")||t.toLowerCase()==="file_id"||t==="")return"";const a=t.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);if(a&&a[1])return a[1];const o=t.match(/[?&]id=([a-zA-Z0-9_-]+)/);if(o&&o[1])return o[1];const r=t.match(/\/d\/([a-zA-Z0-9_-]+)/);return r&&r[1]?r[1]:(/^[a-zA-Z0-9_-]{20,60}$/.test(t),t)}function Ue(e,t=v.TOTAL_RONDAS||5){const a=Number(e);return Number.isInteger(a)&&a>=1&&a<=t}function ze(e){const t=ue(e);return t?/^[a-zA-Z0-9_-]{20,60}$/.test(t):!1}function I(e){return e==null?"":String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function K(e){return String(e||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase().replace(/[^A-Z0-9]/g,"")}function q(e,t){let a=[],o=[],r=[],n=1,i=!1,c=4,g=1;if(e&&Array.isArray(e.alumnos))a=e.alumnos||[],o=Array.isArray(e.resultados)?e.resultados:Object.values(e.resultados||{}),r=Array.isArray(e.respuestasAudicion)?e.respuestasAudicion:[],n=e.rondaActual||1,i=!!e.rondaCerrada,g=e.audicionActual||1,c=(v.ROUNDS[n]||{audiciones:4}).audiciones;else{a=Array.isArray(e)?e:[],o=Array.isArray(t)?t:[];const m=s.get("selectRonda");m&&(n=parseInt(m.value,10)||1);const h=s.get("audicionNumero");h&&(g=parseInt(h.textContent,10)||1),c=(v.ROUNDS[n]||{audiciones:4}).audiciones}const d=s.get("listaAlumnos");if(!d)return;if(a.length===0){d.innerHTML=`
      <div class="col-span-full text-center py-8 text-blue-200">
        <p class="text-lg">No hay alumnos registrados o activos para este certamen.</p>
      </div>
    `;return}const b={},x={};o.forEach(m=>{if(parseInt(m.ronda,10)===n&&(b[String(m.alumnoId)]=m),m.eliminado){const h=m.rondaEliminacion||m.ronda;(!x[String(m.alumnoId)]||h<x[String(m.alumnoId)])&&(x[String(m.alumnoId)]=h)}});const l=(v.ROUNDS[n]||{minimoPasar:2}).minimoPasar,u=r.filter(m=>Number(m.ronda)===Number(n));d.innerHTML=a.map(m=>{var M;const h=b[String(m.id)],N=u.filter(D=>String(D.alumnoId)===String(m.id)),y=N.length>0?N.filter(D=>D.correcto===!0||String(D.correcto).toLowerCase()==="true").length:h?parseInt(h.aciertos,10):0,A=m.rondaEliminacion||x[String(m.id)],w=A&&A<n,T=h?h.eliminado:!1,C=Y(m.nombre);let E="bg-blue-900/60 text-blue-200 border border-blue-400/30",$="En competencia";w?(E="bg-rose-950 text-rose-300 border border-rose-800",$=`❌ Eliminado en Ronda ${A}`):T?(E="bg-red-900/80 text-red-200 border border-red-500",$=`Eliminado en Ronda ${n}`):y>=l&&(E="bg-emerald-900/80 text-emerald-200 border border-emerald-500",$=`Clasificado (${y}/${c})`);let O="";for(let D=1;D<=c;D++){const J=N.find(De=>Number(De.audicionNum)===D),oe=J&&(J.correcto===!0||String(J.correcto).toLowerCase()==="true"),ne=D===g,Oe=i||w||!ne;O+=`
        <label class="flex flex-col items-center justify-center cursor-pointer p-1.5 rounded-lg border transition select-none ${ne?"bg-yellow-500/20 border-yellow-400 shadow-md ring-1 ring-yellow-400":"bg-blue-950/60 hover:bg-blue-900 border-blue-700/50"}">
          <span class="text-xs ${ne?"text-yellow-300 font-extrabold":"text-slate-300"} mb-1">Aud ${D}</span>
          <input 
            type="checkbox" 
            class="checkbox-acierto w-5 h-5 text-yellow-500 bg-blue-900 rounded border-gray-400 focus:ring-yellow-400 focus:ring-2 cursor-pointer"
            data-alumno-id="${I(m.id)}"
            data-audicion="${D}"
            ${oe?"checked":""}
            ${Oe?"disabled":""}
          />
          <span class="text-[9px] ${J?oe?"text-emerald-300":"text-rose-300":"text-slate-500"}">${J?oe?"Correcta":"Error":"Pendiente"}</span>
        </label>
      `}return`
      <div class="alumno-card bg-slate-800/90 border border-slate-700 rounded-xl p-4 shadow-md transition hover:border-yellow-500/50 ${w?"opacity-40 bg-slate-950 cursor-not-allowed":""}" data-alumno-card="${I(m.id)}">
        <div class="flex items-start justify-between mb-2">
          <div>
            <h3 class="font-bold text-base md:text-lg text-white">${I(C)}</h3>
            <p class="text-xs text-slate-300">${I(m.grado||"")} ${I(m.nivel||"")}</p>
          </div>
          <span class="text-xs px-2.5 py-1 rounded-full font-medium ${E}">
            ${$}
          </span>
        </div>

        <!-- Checkboxes de audiciones -->
        <div class="mt-2">
          <div class="text-xs text-slate-400 mb-1.5 flex justify-between items-center">
            <span>Aciertos Ronda ${n}:</span>
            <span class="font-bold text-yellow-400"><span id="aciertos-count-${m.id}">${y}</span> / ${c}</span>
          </div>
          <div class="grid grid-cols-${Math.min(c,4)} gap-1.5">
            ${O}
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
              data-alumno-id="${I(m.id)}"
              data-audicion="${g}"
              ${i?"disabled":""}
              value="${I(((M=N.find(D=>Number(D.audicionNum)===g))==null?void 0:M.respuesta)||"")}"
            />
          </div>
        `}
      </div>
    `}).join("")}function Z(e,t){let a=[],o=1,r=1;if(e&&e.rondaActual!==void 0)o=e.rondaActual,a=e.audicionesRonda||e.audiciones||[],r=e.audicionActual||1;else{a=Array.isArray(e)?e:[],o=1;const R=s.get("audicionNumero");R&&(r=parseInt(R.textContent,10)||1)}const n=s.get("audicionNumero");n&&(n.textContent=String(r));const i=a.find(R=>R.audicionNum===r)||a[r-1],c=document.getElementById("admin-cancion-nombre"),g=document.getElementById("admin-cancion-codigo"),d=document.getElementById("admin-seg-duracion"),b=v.ROUNDS[o]||{duracion:40,audiciones:4};c&&(c.textContent=i?i.cancionNombre||`Composición #${i.cancionId}`:"Composición no asignada"),g&&(g.textContent=i&&i.cancionCodigo||"----"),d&&(d.textContent=String(b.duracion||40));const x=document.getElementById("ronda-info-detalles");x&&(x.innerHTML=`
      <div class="flex flex-wrap items-center justify-between text-xs md:text-sm bg-blue-950/70 p-3 rounded-lg border border-blue-700/60 mt-3 gap-2">
        <span>⏱ <strong>Duración:</strong> ${b.duracion||40}s por audición</span>
        <span>🎯 <strong>Mínimo para clasificar:</strong> ${b.minimoPasar||2} aciertos</span>
        <span>🎼 <strong>Total audiciones:</strong> ${b.audiciones||4}</span>
      </div>
    `)}function me(e){const t=s.get("rankingContent");if(!t)return;if(!e||e.length===0){t.innerHTML=`
      <div class="text-center py-6 text-slate-300">
        <p>Aún no hay puntajes registrados en el certamen.</p>
      </div>
    `;return}const a=e.slice(0,3),o=Be(a),r=e.map((n,i)=>{const c=i+1;let g=`<span class="font-bold text-slate-300">${ke(c)}</span>`,d="hover:bg-slate-700/50";c===1?(g='<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500 text-slate-950 font-black shadow-lg">🥇 1°</span>',d="bg-yellow-500/10 hover:bg-yellow-500/20 border-l-4 border-yellow-500"):c===2?(g='<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-300 text-slate-950 font-black shadow-lg">🥈 2°</span>',d="bg-slate-300/10 hover:bg-slate-300/20 border-l-4 border-slate-300"):c===3&&(g='<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-700 text-amber-100 font-black shadow-lg">🥉 3°</span>',d="bg-amber-700/10 hover:bg-amber-700/20 border-l-4 border-amber-600");const b=n.eliminado?`Eliminado en Ronda ${n.rondaEliminacion||1}`:`Activo (Ronda ${n.rondaMax||1})`;return`
      <tr class="border-b border-slate-700/60 ${d} transition-colors">
        <td class="p-3 text-center">${g}</td>
        <td class="p-3 font-semibold text-white">
          ${I(Y(n.nombre))}
          ${n.premio?`<span class="block text-xs text-yellow-400 font-normal">🎁 ${n.premio}</span>`:""}
        </td>
        <td class="p-3 text-slate-300 text-sm">${I(n.grado||"")} ${I(n.nivel||"")}</td>
        <td class="p-3 text-center">
          <span class="inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${n.eliminado?"bg-rose-950 text-rose-300 border border-rose-800":"bg-emerald-950 text-emerald-300 border border-emerald-800"}">
            ${b}
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
          ${r}
        </tbody>
      </table>
    </div>
  `}function Be(e){if(!e||e.length===0)return"";const[t,a,o]=e;return`
    <div class="podium-container flex justify-center items-end gap-3 md:gap-6 my-8 px-2 max-w-2xl mx-auto">
      
      <!-- 2do Puesto -->
      <div class="flex-1 text-center order-1 transform transition hover:-translate-y-1">
        ${a?`
          <div class="bg-slate-800/90 border-2 border-slate-300 rounded-t-2xl p-4 shadow-xl flex flex-col items-center">
            <div class="w-12 h-12 rounded-full bg-slate-300 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg mb-2">
              🥈
            </div>
            <p class="font-bold text-white text-sm md:text-base line-clamp-1">${I(Y(a.nombre))}</p>
            <p class="text-xs text-slate-300 mb-2">${I(a.grado||"")}</p>
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
            <p class="font-extrabold text-yellow-300 text-base md:text-lg line-clamp-1">${I(Y(t.nombre))}</p>
            <p class="text-xs text-yellow-200/80 mb-2">${I(t.grado||"")}</p>
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
            <p class="font-bold text-white text-sm md:text-base line-clamp-1">${I(Y(o.nombre))}</p>
            <p class="text-xs text-slate-300 mb-2">${I(o.grado||"")}</p>
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
  `}function ie(e,t=40){const a=s.get("timerDisplay");a&&(a.textContent=e,e<=3&&e>0?a.className="text-7xl md:text-8xl font-black text-red-500 mb-4 animate-ping":e<=5&&e>0?a.className="text-7xl md:text-8xl font-black text-red-400 mb-4 animate-pulse":e<=10&&e>0?a.className="text-7xl md:text-8xl font-bold text-amber-400 mb-4":a.className="text-7xl md:text-8xl font-bold text-yellow-400 mb-4")}const H=new Map,ee=new Map;function qe(e){return H.has(String(e||"").trim())}async function je(e,t){const a=String(e||"").trim();if(!a)throw new Error("No se puede cargar audio sin un ID de archivo");if(typeof t!="function")throw new Error("Se requiere una función para cargar el audio");if(H.has(a))return H.get(a);if(ee.has(a))return ee.get(a);const o=(async()=>{const r=await t();if(typeof r!="string"||!r.startsWith("data:audio/"))throw new Error("El servidor no devolvió un audio válido");const n=await fetch(r);if(!n.ok)throw new Error("No se pudo preparar el audio para reproducción");const i=await n.blob();if(i.size===0)throw new Error("El archivo de audio está vacío");const c=URL.createObjectURL(i);return H.set(a,c),c})();ee.set(a,o);try{return await o}finally{ee.delete(a)}}typeof window<"u"&&window.addEventListener("pagehide",e=>{e.persisted||(H.forEach(t=>URL.revokeObjectURL(t)),H.clear())});function Se(e,t){return new Map((Array.isArray(e)?e:[]).filter(a=>Number(a.audicionNum)===Number(t)).map(a=>[String(a.alumnoId),a]))}function Ne(e,t,a){if(!Array.isArray(a)||a.length===0)return!1;const o=Se(e,t);return a.every(r=>o.has(String(r)))}let _=!1,S=1,Q=null,j=null,L={startSec:0,endSec:40,duration:40};function Ge(e){return!e||typeof e!="string"?"":e.startsWith("data:video/")||e.startsWith("data:application/octet-stream")||e.startsWith("data:binary/")?e.replace(/^data:[^;]+;base64,/,"data:audio/mpeg;base64,"):e}function Fe(e){s.init(),S=p.get().audicionActual||1;const t=s.get("btnPlay");t&&t.addEventListener("click",async()=>{if(_){be(e,!1),e.stop(),ye();return}const l=p.get(),u=l.rondaActual||1,m=v.ROUNDS[u]||{duracion:40};let h=l.audicionesRonda||[];if(!h||h.length===0){s.showLoading("Obteniendo audición configurada...");try{h=(await f.getAudicionesRonda(u)).data||[],p.set({audicionesRonda:h})}catch(E){console.warn("[AUDIO] No se pudieron cargar audiciones desde backend:",E)}finally{s.hideLoading()}}const N=h.find(E=>E.audicionNum===S)||h[S-1]||{};if(!N.cancionId){s.showToast("No hay un sorteo guardado para esta audición. Configura las canciones y genera el sorteo.","warning",4500);return}j=N;const y=N.driveId||N.archivoDriveId||null,A=ue(y),w=m.duracion,T=document.getElementById("chk-random-start"),C=T?T.checked:!0;xe(!0);try{let E=!1;if(y&&(y.startsWith("http://")||y.startsWith("https://")||y.startsWith("/"))&&!y.includes("drive.google.com"))try{console.log(`[AUDIO] Reproduciendo URL directa: ${y}`),L=await ve(e,y,w,{randomStart:C})||{startSec:0,endSec:w,duration:w},F(L.startSec,L.endSec),E=!0}catch($){console.warn("[AUDIO] Falló URL directa personalizada:",$)}if(!E&&ze(A)){let $="";const O=!qe(A);O&&s.showLoading("Cargando pista de audio desde Google Drive...");try{$=await je(A,async()=>{const M=await f.getAudioUrl(A,!0);return Ge(M&&M.data&&M.data.dataUri)})}catch(M){console.warn("[AUDIO] Error al consultar API de audio:",M)}finally{O&&s.hideLoading()}if($)try{L=await ve(e,$,w,{randomStart:C})||{startSec:0,endSec:w,duration:w},F(L.startSec,L.endSec),E=!0}catch(M){console.warn("[AUDIO] Error al reproducir Data URI:",M)}}if(!E){const $=C?Math.floor(Math.random()*40):0,O=$+w;L={startSec:$,endSec:O,duration:w},F($,O),s.showToast(`Audición ${S}: ${A?"Reproduciendo sonido de prueba":"Archivo no asignado"} (de ${$}s a ${O}s).`,"info",3500),we(e,w)}_=!0,Q=new Date,fe(),he(!0)}catch(E){console.error("[AUDIO ERROR GENERAL]",E);const $=C?Math.floor(Math.random()*30):0;L={startSec:$,endSec:$+w,duration:w},F($,$+w),we(e,w),_=!0,Q=new Date,fe(),he()}finally{xe(!1)}});const a=e.onComplete;if(e.onComplete=()=>{be(e,!0),ye(),s.showToast(`Audición ${S} finalizada. Verifica y guarda las respuestas.`,"info",3e3),B(),a&&a()},e.timer){const l=e.timer.onTick;e.timer.onTick=u=>{const m=p.get(),h=v.ROUNDS[m.rondaActual]||{duracion:40};ie(u,h.duracion),l&&l(u)}}const o=document.getElementById("btn-prev-audicion"),r=document.getElementById("btn-next-audicion");o&&o.addEventListener("click",()=>{if(S>1){if(de()&&!window.confirm("Hay respuestas sin guardar. ¿Descartarlas y volver a la audición anterior?"))return;S--,ge(S),B()}}),r&&r.addEventListener("click",()=>{const l=p.get(),u=v.ROUNDS[l.rondaActual]||{audiciones:4};if(_){s.showToast("Espera a que termine el audio antes de cambiar de audición.","warning");return}if(!$e()||de()){s.showToast("Verifica y guarda las respuestas de esta audición antes de avanzar.","warning",4e3);return}S<u.audiciones&&(S++,ge(S),B())});const n={AUDICION:document.getElementById("btn-modo-audicion"),CLASIFICADOS:document.getElementById("btn-modo-clasificados"),RANKING_FINAL:document.getElementById("btn-modo-ranking")};Object.entries(n).forEach(([l,u])=>{u&&u.addEventListener("click",async()=>{pe(l,n),s.showToast(`Proyector configurado en: ${l}`,"info",2e3);try{await f.actualizarModoProyector(l)}catch(m){console.warn("Error al sincronizar modo proyector:",m)}})});const i=s.get("selectRonda");i&&i.addEventListener("change",async l=>{const u=parseInt(l.target.value,10);if(!Ue(u)){s.showToast("Ronda inválida","error");return}const m=p.get();if(_){l.target.value=String(m.rondaActual||1),s.showToast("Espera a que termine el audio antes de cambiar de ronda.","warning");return}if(u>(m.rondaActual||1)&&!le()){l.target.value=String(m.rondaActual||1),s.showToast("Guarda todas las respuestas de la ronda actual antes de avanzar.","warning",4e3);return}s.showLoading(`Cargando Ronda ${u}...`);try{S=1,await f.actualizarRondaActual(u);const[h,N,y,A,w]=await Promise.all([f.getAudicionesRonda(u),f.getResultados(u),f.getAlumnos(),f.getRespuestasRonda(u),f.getEstadoCertamen()]);p.set({rondaActual:u,rondaCerrada:!!(w.data&&w.data.rondaCerrada),audicionActual:1,audicionesRonda:h.data||[],resultados:N.data||[],alumnos:y.data||[],respuestasAudicion:A.data||[]}),Z(p.get()),q(p.get());const T=v.ROUNDS[u]||{duracion:40};ie(T.duracion,T.duracion),F(0,T.duracion),B(),s.showToast(`Secuencia: Ronda ${u} activada`,"success")}catch(h){console.error("Error al cambiar ronda:",h),l.target.value=String(m.rondaActual||1),s.showToast("Error al cambiar de ronda: "+h.message,"error")}finally{s.hideLoading()}});const c=s.get("listaAlumnos");c&&(c.addEventListener("input",l=>{if(l.target&&l.target.classList.contains("input-pizarra-alumno")){const u=l.target.dataset.alumnoId,m=l.target.value.trim().toUpperCase(),N=p.get().audicionesRonda||[],y=N.find(O=>O.audicionNum===S)||N[S-1]||{},A=K(y.cancionCodigo),w=K(y.cancionNombre),T=[...c.querySelectorAll("[data-alumno-card]")].find(O=>O.getAttribute("data-alumno-card")===u);if(!T)return;const C=T.querySelector(`.checkbox-acierto[data-audicion="${S}"]`),E=K(l.target.value);E!==""&&(E===A||E===w)?(l.target.classList.remove("border-slate-700","border-rose-500"),l.target.classList.add("border-emerald-400","bg-emerald-950/60"),C&&!C.checked&&(C.checked=!0,re(T,u))):m===""?(l.target.classList.remove("border-emerald-400","bg-emerald-950/60","border-rose-500"),l.target.classList.add("border-slate-700"),C&&(C.checked=!1)):(l.target.classList.remove("border-emerald-400","bg-emerald-950/60","border-slate-700"),l.target.classList.add("border-rose-500"),C&&(C.checked=!1)),re(T,u),B()}}),c.addEventListener("change",l=>{if(l.target&&l.target.classList.contains("checkbox-acierto")){const u=l.target.dataset.alumnoId,m=document.querySelector(`[data-alumno-card="${u}"]`);m&&re(m,u),B()}}));const g=s.get("btnGuardarAciertos");g&&g.addEventListener("click",async()=>{const l=p.get(),u=l.rondaActual||1,m=S;if(_){s.showToast("Espera a que termine el audio antes de guardar respuestas.","warning");return}const h=X(l),N=[...document.querySelectorAll("[data-alumno-card]")];let y;try{y=h.map(A=>{const w=N.find($=>$.getAttribute("data-alumno-card")===String(A.id));if(!w)throw new Error(`No se encontró la ficha del participante ${A.id}.`);const T=w.querySelector(`.input-pizarra-alumno[data-audicion="${m}"]`),C=w.querySelector(`.checkbox-acierto[data-audicion="${m}"]`),E=T?T.value.trim():"";return{alumnoId:A.id,respuesta:E,correcto:E!==""&&!!(C&&C.checked)}})}catch(A){console.error("Error al preparar respuestas:",A),s.showToast("Error al preparar respuestas: "+A.message,"error");return}if(y.length===0){s.showToast("No hay participantes elegibles para guardar.","warning");return}s.showLoading("Guardando respuestas de esta audición...");try{await f.guardarRespuestasAudicion({ronda:u,audicionNum:m,respuestas:y});const[A,w]=await Promise.all([f.getRespuestasRonda(u),f.getResultados(u)]);p.set({respuestasAudicion:A.data||[],resultados:w.data||[]}),q(p.get()),Z(p.get()),B();const T=y.filter(C=>C.correcto).length;s.showToast(`Audición ${m} guardada: ${T} correctas y ${y.length-T} errores.`,"success",4500)}catch(A){console.error("Error al guardar respuestas:",A),s.showToast("❌ Error al guardar respuestas: "+A.message,"error")}finally{s.hideLoading()}});const d=s.get("btnFinalizarRonda");d&&d.addEventListener("click",async()=>{const u=p.get().rondaActual||1,m=v.ROUNDS[u]||{minimoPasar:2};if(!le()){s.showToast("No se puede finalizar: guarda las respuestas de todas las audiciones primero.","warning",4500);return}if(window.confirm(`¿Desea FINALIZAR la Ronda ${u}?

• Mínimo exigido: ${m.minimoPasar} aciertos
• Los alumnos con menos de ${m.minimoPasar} aciertos quedarán marcados como ELIMINADOS EN RONDA ${u}.
• El proyector pasará automáticamente al modo CLASIFICADOS.

¿Continuar?`)){s.showLoading("Finalizando ronda y calculando clasificación...");try{const y=(await f.finalizarRonda(u)).data||{};s.showToast(`Ronda ${u} Finalizada: ${y.pasanCount||0} clasifican, ${y.eliminadosCount||0} eliminados`,"success",5e3);const[A,w,T]=await Promise.all([f.getResultados(u),f.getRanking(),f.getAlumnos()]);p.set({resultados:A.data||[],ranking:w.data||[],alumnos:T.data||[],rondaCerrada:!0}),q(p.get()),pe(u===v.TOTAL_RONDAS?"RANKING_FINAL":"CLASIFICADOS",n);const C=s.get("rankingSection");if(C&&!C.classList.contains("hidden")&&me(w.data||[]),y.siguienteRonda&&y.siguienteRonda!==u&&y.siguienteRonda<=v.TOTAL_RONDAS){const E=s.get("selectRonda");E&&(E.value=String(y.siguienteRonda),E.dispatchEvent(new Event("change")))}}catch(N){console.error("Error al finalizar ronda:",N),s.showToast("Error al finalizar ronda: "+N.message,"error")}finally{s.hideLoading()}}});const b=s.get("btnResetRonda");b&&b.addEventListener("click",async()=>{const u=p.get().rondaActual||1;if(window.confirm(`⚠️ ATENCIÓN: ¿Está seguro de RESETEAR la Ronda ${u}?

Se borrarán las respuestas y resultados de la Ronda ${u} y de las rondas posteriores.`)){s.showLoading(`Reseteando datos de la Ronda ${u}...`);try{await f.resetRonda(u);const[h,N,y]=await Promise.all([f.getResultados(u),f.getAlumnos(),f.getRespuestasRonda(u)]);p.set({resultados:h.data||[],alumnos:N.data||[],respuestasAudicion:y.data||[],rondaCerrada:!1}),q(p.get()),B(),s.showToast(`Ronda ${u} ha sido reseteada correctamente`,"warning")}catch(h){console.error("Error al resetear ronda:",h),s.showToast("Error al resetear ronda: "+h.message,"error")}finally{s.hideLoading()}}});const x=s.get("btnVerRanking"),R=s.get("rankingSection");x&&R&&x.addEventListener("click",async()=>{if(R.classList.contains("hidden")){s.showLoading("Calculando tabla de posiciones y ranking...");try{const m=(await f.getRanking()).data||[];p.set({ranking:m}),me(m),R.classList.remove("hidden"),x.textContent="✕ Ocultar Ranking",x.classList.replace("bg-purple-700","bg-purple-900"),R.scrollIntoView({behavior:"smooth"})}catch(u){console.error("Error al obtener ranking:",u),s.showToast("Error al obtener ranking: "+u.message,"error")}finally{s.hideLoading()}}else R.classList.add("hidden"),x.textContent="🏆 Ver Ranking",x.classList.replace("bg-purple-900","bg-purple-700")}),B()}function ge(e){p.set({audicionActual:e}),Z(p.get()),q(p.get());const t=p.get(),a=v.ROUNDS[t.rondaActual]||{duracion:40};F(0,a.duracion)}function X(e=p.get()){const t=Number(e.rondaActual)||1;return(e.alumnos||[]).filter(a=>{const o=Number(a.rondaEliminacion);return Number.isInteger(o)&&o>0?o>=t:!a.eliminado})}function $e(e=p.get()){const t=X(e);return Ne(e.respuestasAudicion,S,t.map(a=>a.id))}function de(e=p.get()){const t=Se(e.respuestasAudicion,S),a=[...document.querySelectorAll("[data-alumno-card]")];return X(e).some(o=>{const r=a.find(x=>x.getAttribute("data-alumno-card")===String(o.id));if(!r)return!1;const n=r.querySelector(`.input-pizarra-alumno[data-audicion="${S}"]`),i=r.querySelector(`.checkbox-acierto[data-audicion="${S}"]`),c=n?n.value.trim():"",g=!!(i&&i.checked),d=t.get(String(o.id));if(!d)return c!==""||g;const b=d.correcto===!0||String(d.correcto).toLowerCase()==="true";return K(c)!==K(d.respuesta)||g!==b})}function le(e=p.get()){const t=v.ROUNDS[e.rondaActual];if(!t)return!1;const a=X(e).map(o=>o.id);return a.length===0?!1:Array.from({length:t.audiciones},(o,r)=>r+1).every(o=>Ne(e.respuestasAudicion,o,a))}function B(){const e=p.get(),t=v.ROUNDS[e.rondaActual];if(!t)return;const a=$e(e),o=de(e),r=le(e),n=!!e.rondaCerrada,i=document.getElementById("btn-prev-audicion"),c=document.getElementById("btn-next-audicion"),g=s.get("btnGuardarAciertos"),d=s.get("btnFinalizarRonda"),b=document.getElementById("audicion-estado-guardado");if(i&&(i.disabled=n||_||S<=1),c){const x=!n&&a&&!o&&!_&&S<t.audiciones;c.disabled=!x,c.textContent=S<t.audiciones?"Siguiente ▶":"Última audición"}g&&(g.disabled=n||_||X(e).length===0),d&&(d.disabled=n||_||!r),b&&(n?b.textContent="Ronda finalizada":_?b.textContent="Audio en curso":o?b.textContent="Hay cambios sin guardar":a?b.textContent=`Respuestas de la audición ${S} guardadas`:b.textContent=`Audición ${S} pendiente de guardar`,b.className=`text-xs mb-3 ${n||a&&!o?"text-emerald-300":"text-amber-300"}`)}function F(e,t){const a=document.getElementById("badge-rango-reproduccion");a&&(a.textContent=`📍 Rango: de ${e}s a ${t}s`)}function re(e,t){const a=e.querySelectorAll(".checkbox-acierto:checked").length,o=document.getElementById(`aciertos-count-${t}`);o&&(o.textContent=a);const r=p.get(),n=v.ROUNDS[r.rondaActual]||{minimoPasar:2},i=e.querySelector("span.rounded-full");i&&!i.textContent.includes("Eliminado")&&(a>=n.minimoPasar?(i.className="text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-900/80 text-emerald-200 border border-emerald-500",i.textContent=`Clasificado (${a})`):(i.className="text-xs px-2.5 py-1 rounded-full font-medium bg-blue-900/60 text-blue-200 border border-blue-400/30",i.textContent="En competencia"))}function pe(e,t){Object.entries(t).forEach(([a,o])=>{o&&(a===e?o.className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition border border-yellow-500 bg-yellow-500 text-slate-950 cursor-pointer shadow":o.className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition border border-slate-700 bg-slate-800 text-slate-300 hover:text-white cursor-pointer")})}function be(e,t){if(!Q||!j)return;const o=p.get().rondaActual||1,r=v.ROUNDS[o]||{duracion:40},n=L&&L.startSec!==void 0?L.startSec:0;let i=L&&L.endSec!==void 0?L.endSec:n+r.duracion;if(!t&&e.timer&&e.timer.timeLeft!==void 0){const d=r.duracion-e.timer.timeLeft;i=n+Math.max(1,d)}const c=Math.max(1,i-n),g=document.getElementById("admin-log-status");g&&(g.textContent="⏳ Audición finalizada. Guardando registro en Google Sheets..."),f.registrarReproduccion({ronda:o,audicionNum:S,cancionId:j.cancionId||"",cancionNombre:j.cancionNombre||"",cancionCodigo:j.cancionCodigo||"",segundoInicio:n,segundoFin:i,duracion:c}).then(d=>{console.log("[AUDITORIA] Registrado en Google Sheets:",d.data),g&&d.data&&(g.textContent=`✅ Registrado en Google Sheets: de ${n}s a ${i}s (${c}s) a las ${d.data.fechaHora.split(" ")[1]}`)}).catch(d=>{console.warn("[AUDITORIA ERROR]",d),g&&(g.textContent="⚠️ No se pudo guardar el registro de reproducción en Google Sheets.")}),Q=null}function fe(){const e=document.getElementById("admin-log-status");if(!e||!j)return;const t=p.get(),a=Number(L.startSec)||0,o=Number(L.endSec)||a,r=new Intl.DateTimeFormat("es-PE",{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(Q||new Date),n=j.cancionNombre||`Composición #${j.cancionId}`;e.textContent=`⏱ Reproducción iniciada: ${n} · Ronda ${t.rondaActual||1}, audición ${S} · de ${a}s a ${o}s · ${r}. Se guardará en Google Sheets al finalizar.`}function xe(e){const t=s.get("btnPlay");t&&e&&(t.disabled=!0,t.textContent="⏳ Cargando audio...",t.className="bg-yellow-600 text-white text-xl md:text-2xl px-10 py-4 rounded-xl shadow-lg cursor-not-allowed opacity-80")}function he(e){const t=s.get("btnPlay");t&&(t.disabled=!1,t.textContent="⏹ DETENER AUDICIÓN",t.className="bg-red-600 hover:bg-red-700 text-white text-xl md:text-2xl font-black px-10 py-4 rounded-xl shadow-xl transition animate-pulse cursor-pointer",document.body.classList.add("is-playing"))}function ye(){_=!1,document.body.classList.remove("is-playing");const e=s.get("btnPlay");e&&(e.disabled=!1,e.textContent="▶ REPRODUCIR AUDICIÓN",e.className="bg-emerald-600 hover:bg-emerald-500 text-white text-xl md:text-2xl font-black px-10 py-4 rounded-xl shadow-xl transition transform active:scale-95 inline-flex items-center space-x-3 cursor-pointer")}async function ve(e,t,a,o={}){return new Promise((r,n)=>{const i=setTimeout(()=>{n(new Error("Tiempo de espera agotado al reproducir fuente de audio"))},8e3);e.play(t,a,o).then(c=>{clearTimeout(i),r(c)}).catch(c=>{clearTimeout(i),n(c)})})}function we(e,t){try{const a=window.AudioContext||window.webkitAudioContext;if(!a)throw new Error("No Web Audio API");const o=new a,r=[293.66,369.99,440],n=[];r.forEach(i=>{const c=o.createOscillator(),g=o.createGain();c.type="triangle",c.frequency.setValueAtTime(i,o.currentTime),g.gain.setValueAtTime(.001,o.currentTime),g.gain.exponentialRampToValueAtTime(.15,o.currentTime+.1),g.gain.exponentialRampToValueAtTime(.001,o.currentTime+t),c.connect(g),g.connect(o.destination),c.start(),n.push(c)}),e.timer.start(t),setTimeout(()=>{try{n.forEach(i=>i.stop()),o.close()}catch{}},t*1e3)}catch{e.timer.start(t)}}let G=null,Ie="rondas",U=[],z=[],ae=[],k=[],P={},V=[],W=[];function He(){Ce();const e=document.getElementById("btn-abrir-config");e&&e.addEventListener("click",Ve)}function Ce(){if(document.getElementById("modal-configuracion"))return;const e=document.createElement("div");e.id="modal-configuracion",e.className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 transition-opacity duration-300 hidden opacity-0",e.innerHTML=`
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
  `,document.body.appendChild(e),G=e,e.querySelector("#btn-cerrar-config").addEventListener("click",Ae),e.querySelector("#btn-cerrar-config-footer").addEventListener("click",Ae),e.querySelectorAll(".tab-btn").forEach(t=>{t.addEventListener("click",a=>{const o=a.currentTarget.dataset.tab;We(o)})})}async function Ve(){G||Ce(),s.showLoading("Cargando configuraciones...");try{const[e,t,a,o,r]=await Promise.all([f.getConfig(),f.getCanciones(),f.getAlumnos(),f.getResultados(),f.getRespuestasRonda()]);P=e.data||{},v.syncFromBackend(P),U=t.data||[],k=a.data||[],W=o.data||[],V=r.data||[];const n=Array.from({length:v.TOTAL_RONDAS},(c,g)=>g+1);z=(await Promise.all(n.map(c=>f.getAudicionesRonda(c)))).flatMap(c=>c.data||[]),ae=[...z],G.classList.remove("hidden"),setTimeout(()=>G.classList.remove("opacity-0"),10),Te()}catch(e){console.error("Error al abrir configuración:",e),s.showToast("Error al cargar datos de configuración","error")}finally{s.hideLoading()}}function Ae(){G&&(G.classList.add("opacity-0"),setTimeout(()=>G.classList.add("hidden"),250))}function We(e){Ie=e,G.querySelectorAll(".tab-btn").forEach(t=>{t.dataset.tab===e?t.className="tab-btn px-4 py-3 border-b-2 border-yellow-400 text-yellow-300 flex items-center space-x-2 whitespace-nowrap cursor-pointer":t.className="tab-btn px-4 py-3 border-b-2 border-transparent text-slate-400 hover:text-white flex items-center space-x-2 whitespace-nowrap cursor-pointer"}),Te()}function Te(){const e=document.getElementById("config-tab-content");if(e)switch(Ie){case"rondas":Le(e);break;case"canciones":ce(e);break;case"sorteo":Ze(e);break;case"participantes":te(e);break}}function Ze(e){const t=U.filter(o=>o.activa!==!1),a=Object.values(v.ROUNDS).reduce((o,r)=>o+r.audiciones,0);e.innerHTML=`
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
            <span>Guardar Sorteo en Google Sheets</span>
          </button>
        </div>
      </div>

      <div class="text-xs text-slate-400 flex items-center justify-between">
        <span>Canciones activas para el sorteo: <strong class="text-white">${t.length}</strong></span>
        <span>Total audiciones programadas: <strong class="text-white">${z.length||a}</strong></span>
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
            ${Re(z)}
          </tbody>
        </table>
      </div>
    </div>
  `,e.querySelector("#btn-generar-sorteo").addEventListener("click",()=>{if(t.length===0){s.showToast("No hay canciones activas para sortear","error");return}const o=[];let r=1;for(let n=1;n<=v.TOTAL_RONDAS;n++){const i=v.ROUNDS[n].audiciones;if(i>t.length){s.showToast(`La Ronda ${n} requiere ${i} canciones distintas, pero solo hay ${t.length} activas.`,"error",5e3);return}const c=Je(t);for(let g=1;g<=i;g++){const d=c[g-1];o.push({ronda:n,audicionNum:g,cancionId:d.id,cancionNombre:d.nombre,cancionCodigo:d.codigo,orden:r++})}}z=o,e.querySelector("#sorteo-preview-body").innerHTML=Re(o),s.showToast("¡Nuevo sorteo aleatorio generado con éxito!","success",2500)}),e.querySelector("#btn-guardar-sorteo").addEventListener("click",async()=>{if(z.length===0){s.showToast("Genera un sorteo antes de guardar","warning");return}const o=!Ye(ae,z),r=W.length>0||V.length>0,n=o&&r;if(!(n&&!window.confirm("El sorteo actual ya tiene respuestas o resultados. Si guardas este nuevo sorteo, se borrarán los resultados y respuestas de todas las rondas. ¿Continuar?"))){s.showLoading("Guardando orden de audiciones en Google Sheets...");try{const i=await f.guardarAudicionesRonda(z,n),c=!!(i.data&&i.data.reinicioRealizado),g=p.get(),d=c?1:g.rondaActual||1,[b,x,R]=await Promise.all([f.getAudicionesRonda(d),f.getResultados(),f.getRespuestasRonda(d)]);W=x.data||[],V=R.data||[],ae=[...z],p.set({rondaActual:d,rondaCerrada:c?!1:!!g.rondaCerrada,audicionActual:1,audicionesRonda:b.data||[],resultados:W.filter(u=>Number(u.ronda)===d),respuestasAudicion:V});const l=document.getElementById("select-ronda");l&&(l.value=String(d)),Z(p.get()),q(p.get()),s.showToast("✅ Sorteo de canciones guardado correctamente en la nube","success")}catch(i){console.error("Error al guardar sorteo:",i),s.showToast("Error al guardar sorteo: "+i.message,"error")}finally{s.hideLoading()}}})}function Re(e){return!e||e.length===0?'<tr><td colspan="5" class="p-4 text-center text-slate-500">No hay sorteo cargado. Pulsa "Generar Nuevo Sorteo Aleatorio".</td></tr>':e.map(t=>{var a;return`
    <tr class="border-b border-slate-800/80 hover:bg-slate-800/40">
      <td class="p-2.5 text-center font-bold text-yellow-400">R${t.ronda}</td>
      <td class="p-2.5 text-center text-slate-300">Aud ${t.audicionNum}</td>
      <td class="p-2.5 font-semibold text-white">${I(t.cancionNombre||`Composición #${t.cancionId}`)}</td>
      <td class="p-2.5 text-center font-mono font-bold text-yellow-300">${I(t.cancionCodigo||"----")}</td>
      <td class="p-2.5 text-center text-slate-400">${((a=v.ROUNDS[t.ronda])==null?void 0:a.duracion)||0}s</td>
    </tr>
  `}).join("")}function Je(e){const t=[...e];for(let a=t.length-1;a>0;a--){const o=Math.floor(Math.random()*(a+1));[t[a],t[o]]=[t[o],t[a]]}return t}function Ye(e,t){if(e.length!==t.length)return!1;const a=new Map(e.map(o=>[`${o.ronda}:${o.audicionNum}`,String(o.cancionId)]));return t.every(o=>a.get(`${o.ronda}:${o.audicionNum}`)===String(o.cancionId))}function ce(e){e.innerHTML=`
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
        <span class="text-slate-400">Total canciones en repertorio: <strong class="text-white">${U.length}</strong></span>
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
            ${U.map((t,a)=>`
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
  `,e.querySelector("#btn-add-cancion").addEventListener("click",()=>{const t=e.querySelector("#add-cancion-nombre").value.trim(),a=e.querySelector("#add-cancion-codigo").value.trim(),o=e.querySelector("#add-cancion-drive").value.trim(),r=ue(o);if(!t){s.showToast("Ingresa el nombre de la obra","warning");return}const n=U.length>0?Math.max(...U.map(i=>Number(i.id)||0))+1:1;U.push({id:n,nombre:t.toUpperCase(),codigo:a.toUpperCase()||`ST${n.toString().padStart(4,"0")}`,driveId:r,archivoDriveId:r,anio:2026,activa:!0}),ce(e),s.showToast(`Obra "${t}" agregada a la lista`,"info",2e3)}),e.querySelectorAll(".btn-eliminar-cancion").forEach(t=>{t.addEventListener("click",a=>{const o=a.currentTarget.dataset.id;U=U.filter(r=>String(r.id)!==String(o)),ce(e)})}),e.querySelector("#btn-guardar-todas-canciones").addEventListener("click",async()=>{s.showLoading("Guardando lista de canciones en Google Sheets...");try{await f.guardarCanciones(U),p.set({canciones:U}),s.showToast("✅ Lista de canciones guardada exitosamente en la nube","success")}catch(t){s.showToast("Error al guardar canciones: "+t.message,"error")}finally{s.hideLoading()}})}function te(e){e.innerHTML=`
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
        <span class="text-slate-400">Total participantes registrados: <strong class="text-white">${k.length}</strong></span>
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
            ${k.map((t,a)=>`
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
  `,e.querySelector("#btn-importar-masivo").addEventListener("click",()=>{const t=e.querySelector("#textarea-alumnos-masivo").value.trim();if(!t){s.showToast("Pega al menos una línea con datos de alumnos","warning");return}const a=e.querySelector("#chk-reemplazar-alumnos").checked,o=t.split(`
`),r=[];let n=a?1:k.length>0?Math.max(...k.map(i=>Number(i.id)||0))+1:1;o.forEach(i=>{const c=i.trim();if(!c)return;const g=c.includes("	")?c.split("	"):c.split(","),d=(g[0]||"").trim(),b=(g[1]||"").trim(),x=(g[2]||"").trim();d&&r.push({id:n++,nombre:d,grado:b||"",nivel:x||"",anio:2026,activo:!0})}),a?k=r:k=[...k,...r],te(e),s.showToast(`Se procesaron ${r.length} participantes`,"success")}),e.querySelector("#btn-vaciar-alumnos").addEventListener("click",()=>{confirm("¿Deseas vaciar la lista temporal de participantes?")&&(k=[],te(e))}),e.querySelectorAll(".btn-eliminar-alumno").forEach(t=>{t.addEventListener("click",a=>{const o=a.currentTarget.dataset.id;k=k.filter(r=>String(r.id)!==String(o)),te(e)})}),e.querySelector("#btn-guardar-alumnos-cloud").addEventListener("click",async()=>{s.showLoading("Guardando participantes en Google Sheets...");try{await f.guardarAlumnosLote(k,!0),p.set({alumnos:k}),q(p.get()),s.showToast("✅ Participantes guardados exitosamente en la nube","success")}catch(t){s.showToast("Error al guardar participantes: "+t.message,"error")}finally{s.hideLoading()}})}function Le(e){const t=P,a=Number(t.TOTAL_RONDAS)||v.TOTAL_RONDAS,o=Array.from({length:a},(r,n)=>n+1);e.innerHTML=`
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
            <input type="text" id="cfg-nombre-evento" value="${I(t.NOMBRE_EVENTO||"Certamen Audición Musical 2026")}" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white">
          </div>
          <div>
            <label class="block text-xs text-slate-300 mb-1">Compositor Homenajeado:</label>
            <input type="text" id="cfg-homenajeado" value="${I(t.HOMENAJEADO||"Johann Strauss")}" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white">
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
          ${o.map(r=>{const n=se(r,a),i=v.ROUNDS[r]||{duracion:Math.max(2,Math.round(40/Math.pow(2,r-1))),audiciones:r<=2?4:3,minimoPasar:r===a?3:2},c=Number(t[`DURACION_RONDA_${n}`]??t[`DURACION_RONDA_${r}`]??i.duracion),g=Number(t[`NUM_AUDICIONES_RONDA_${n}`]??t[`NUM_AUDICIONES_RONDA_${r}`]??i.audiciones),d=Number(t[`MINIMO_PASAR_RONDA_${n}`]??t[`MINIMO_PASAR_RONDA_${r}`]??i.minimoPasar);return`
              <div class="bg-slate-900/90 border border-slate-700 p-3 rounded-xl space-y-2">
                <span class="font-bold text-yellow-400 block text-center border-b border-slate-700 pb-1">
                  ${r===a?"Ronda Final":`Ronda ${r}`}
                </span>
                <div>
                  <label class="text-[10px] text-slate-400 block">Duración (seg):</label>
                  <input type="number" id="cfg-dur-${r}" min="1" max="3600" step="1" value="${c}" class="w-full bg-slate-950 border border-slate-700 rounded p-1 text-center font-bold text-white">
                </div>
                <div>
                  <label class="text-[10px] text-slate-400 block">Audiciones:</label>
                  <input type="number" id="cfg-aud-${r}" min="1" max="100" step="1" value="${g}" class="w-full bg-slate-950 border border-slate-700 rounded p-1 text-center font-bold text-white">
                </div>
                <div>
                  <label class="text-[10px] text-slate-400 block">Mínimo clasificar:</label>
                  <input type="number" id="cfg-min-${r}" min="1" max="${g}" step="1" value="${d}" class="w-full bg-slate-950 border border-slate-700 rounded p-1 text-center font-bold text-yellow-300">
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
            <input type="text" id="cfg-premio-1" value="${I(t.PREMIOS_PRIMER_PUESTO||"Diploma, medalla y premio sorpresa")}" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white">
          </div>
          <div>
            <label class="block text-slate-400 mb-1">🥈 Segundo Puesto:</label>
            <input type="text" id="cfg-premio-2" value="${I(t.PREMIOS_SEGUNDO_PUESTO||"Diploma, medalla y premio sorpresa")}" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white">
          </div>
          <div>
            <label class="block text-slate-400 mb-1">🥉 Tercer Puesto:</label>
            <input type="text" id="cfg-premio-3" value="${I(t.PREMIOS_TERCER_PUESTO||"Diploma y medalla")}" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white">
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
  `,e.querySelector("#cfg-total-rondas").addEventListener("change",r=>{const n=Number(r.currentTarget.value);if(!Number.isInteger(n)||n<1||n>20){s.showToast("La cantidad de rondas debe ser un entero entre 1 y 20.","warning"),r.currentTarget.value=String(a);return}Ke(e,a),P.TOTAL_RONDAS=n,Le(e)}),e.querySelector("#btn-guardar-reglas-cloud").addEventListener("click",async()=>{const r=Number(e.querySelector("#cfg-total-rondas").value);if(!Number.isInteger(r)||r<1||r>20){s.showToast("La cantidad de rondas debe ser un entero entre 1 y 20.","warning");return}const n={TOTAL_RONDAS:r,NOMBRE_EVENTO:e.querySelector("#cfg-nombre-evento").value.trim(),HOMENAJEADO:e.querySelector("#cfg-homenajeado").value.trim(),ANIO_CERTAMEN:Number(e.querySelector("#cfg-anio").value),PREMIOS_PRIMER_PUESTO:e.querySelector("#cfg-premio-1").value.trim(),PREMIOS_SEGUNDO_PUESTO:e.querySelector("#cfg-premio-2").value.trim(),PREMIOS_TERCER_PUESTO:e.querySelector("#cfg-premio-3").value.trim()};if(!Number.isInteger(n.ANIO_CERTAMEN)||n.ANIO_CERTAMEN<2e3||n.ANIO_CERTAMEN>2100){s.showToast("El año del certamen debe estar entre 2000 y 2100.","warning");return}for(let d=1;d<=r;d++){const b=Number(e.querySelector(`#cfg-dur-${d}`).value),x=Number(e.querySelector(`#cfg-aud-${d}`).value),R=Number(e.querySelector(`#cfg-min-${d}`).value);if(!Number.isInteger(b)||b<1||b>3600||!Number.isInteger(x)||x<1||x>100||!Number.isInteger(R)||R<1||R>x){s.showToast(`Revisa los valores de la Ronda ${d}: duración 1–3600, audiciones 1–100 y mínimo 1–audiciones.`,"warning",5e3);return}const l=se(d,r);n[`DURACION_RONDA_${l}`]=b,n[`NUM_AUDICIONES_RONDA_${l}`]=x,n[`MINIMO_PASAR_RONDA_${l}`]=R}const i=r!==v.TOTAL_RONDAS||Object.entries(n).some(([d,b])=>/^(DURACION_RONDA_|NUM_AUDICIONES_RONDA_|MINIMO_PASAR_RONDA_)/.test(d)&&String(P[d]===void 0?"":P[d])!==String(b)),c=W.length>0||V.length>0,g=i&&c;if(!(g&&!window.confirm("Cambiar las reglas reiniciará el sorteo, las respuestas y los resultados guardados de todas las rondas. ¿Continuar?"))){s.showLoading("Actualizando parámetros en Google Sheets...");try{await f.guardarConfigLote(n,g),P={...P,...n},v.syncFromBackend(P),i&&(z=[],ae=[]),g&&(V=[],W=[]);const d=p.get(),b=Number(d.rondaActual)||1,x=g||b>r?1:b;i&&p.set({rondaActual:x,rondaCerrada:!1,audicionActual:1,audicionesRonda:[],resultados:g?[]:(d.resultados||[]).filter(l=>Number(l.ronda)===x),respuestasAudicion:g?[]:[]}),Qe();const R=document.getElementById("select-ronda");R&&(R.value=String(x)),Z(p.get()),q(p.get()),s.showToast("✅ Paso 1 guardado. Continúa con canciones y luego realiza el sorteo.","success",4500)}catch(d){s.showToast("Error al actualizar configuración: "+d.message,"error")}finally{s.hideLoading()}}})}function Ke(e,t){for(let a=1;a<=t;a++){const o=e.querySelector(`#cfg-dur-${a}`),r=e.querySelector(`#cfg-aud-${a}`),n=e.querySelector(`#cfg-min-${a}`),i=se(a,t);o&&(P[`DURACION_RONDA_${i}`]=Number(o.value)),r&&(P[`NUM_AUDICIONES_RONDA_${i}`]=Number(r.value)),n&&(P[`MINIMO_PASAR_RONDA_${i}`]=Number(n.value))}}function Qe(){const e=document.getElementById("select-ronda");if(!e)return;const t=Number(e.value);e.innerHTML=Object.entries(v.ROUNDS).map(([a,o])=>`<option value="${a}">${I(o.nombre)} - ${o.audiciones} audiciones de ${o.duracion}s (mínimo: ${o.minimoPasar})</option>`).join(""),e.value=String(t<=v.TOTAL_RONDAS?t:1)}async function Ee(){s.init(),s.showLoading("Conectando con el certamen...");try{let e=[],t=[],a=[],o=[],r=[],n=1,i=!1;try{const[R,l,u,m]=await Promise.all([f.getConfig().catch(A=>(console.warn("[APP] No se pudo cargar configuración del backend:",A),{data:{}})),f.getCanciones().catch(()=>({data:[]})),f.getAlumnos().catch(()=>({data:[]})),f.getEstadoCertamen().catch(()=>({data:null}))]);v.syncFromBackend(R.data||{}),e=l.data||[],t=u.data||[],m&&m.data&&(n=m.data.rondaActual||1,i=!!m.data.rondaCerrada),v.ROUNDS[n]||(n=1);const[h,N,y]=await Promise.all([f.getAudicionesRonda(n).catch(()=>({data:[]})),f.getResultados(n).catch(()=>({data:[]})),f.getRespuestasRonda(n).catch(A=>(console.warn("[APP] Backend aún no expone las respuestas por audición:",A),{data:[]}))]);a=h.data||[],o=N.data||[],r=y.data||[]}catch(R){console.warn("[APP] Aviso de red al conectar backend Apps Script:",R),s.showToast("Modo sin conexión o URL de Apps Script pendiente. Cargando vista.","warning",4e3)}p.set({canciones:e,alumnos:t,rondaActual:n,rondaCerrada:i,audicionActual:1,audicionesRonda:a,resultados:o,respuestasAudicion:r,isLoading:!1});const c=s.get("audioPlayer"),g=s.get("timerDisplay"),d=new Me(c,g,{onComplete:()=>console.log("[PLAYER] Audición finalizada")});Fe(d),He();const b=s.get("selectRonda");b&&(b.innerHTML=Object.entries(v.ROUNDS).map(([R,l])=>`<option value="${R}">${l.nombre} - ${l.audiciones} audiciones de ${l.duracion}s (mínimo: ${l.minimoPasar})</option>`).join(""),b.value=String(n));const x=(v.ROUNDS[n]||{}).duracion||40;ie(x,x),Z(p.get()),q(p.get()),console.log("✅ Aplicación inicializada correctamente"),s.showToast("Certamen listo para audición","success",2500)}catch(e){console.error("❌ Error al inicializar:",e),s.showToast("Error al conectar con la base de datos de Google Sheets.","error",5e3)}finally{s.hideLoading()}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Ee):Ee();
