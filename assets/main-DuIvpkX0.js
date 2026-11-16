import{C as v,f as Z,a as Oe,b as f,g as ae}from"./formatters-CH_PCQn-.js";class De{constructor(){this.state={rondaActual:1,rondaCerrada:!1,audicionActual:0,alumnos:[],canciones:[],configRonda:null,resultados:{},respuestasAudicion:[],isLoading:!1,error:null},this.listeners=[]}get(){return{...this.state}}set(t){this.state={...this.state,...t},this.notify()}subscribe(t){return this.listeners.push(t),()=>{this.listeners=this.listeners.filter(a=>a!==t)}}notify(){this.listeners.forEach(t=>t(this.state))}}const b=new De;class ke{constructor(t,a={}){this.display=t,this.onTick=a.onTick||(()=>{}),this.onComplete=a.onComplete||(()=>{}),this.intervalId=null,this.timeLeft=0}start(t){this.stop(),this.timeLeft=t,this._updateDisplay(),this.intervalId=setInterval(()=>{this.timeLeft--,this._updateDisplay(),this.onTick(this.timeLeft),this.timeLeft<=0&&(this.stop(),this.onComplete())},1e3)}stop(){this.intervalId&&(clearInterval(this.intervalId),this.intervalId=null)}reset(){this.stop(),this.timeLeft=0,this._updateDisplay()}_updateDisplay(){this.display&&(this.display.textContent=this.timeLeft)}}class Pe{constructor(t,a,o={}){this.audio=t,this.timerDisplay=a,this.onComplete=o.onComplete||(()=>{}),this.onError=o.onError||(()=>{}),this.timer=new ke(a,{onComplete:()=>this.stop()}),this.playbackInfo={startSec:0,endSec:0,duration:0},this._setupAudioEvents()}_setupAudioEvents(){this.audio.addEventListener("error",()=>{const t=this.audio.error,a=t?`Error ${t.code}: ${t.message||"Error de audio"}`:"Error al cargar el audio";this.onError(a)})}async play(t,a,o={}){return new Promise((s,n)=>{this.audio.pause(),this.audio.currentTime=0;let i=!1;const m=()=>{this.audio.removeEventListener("canplay",g),this.audio.removeEventListener("error",R),this.audio.removeEventListener("loadedmetadata",x)},u=()=>{const d=this.audio.duration;if(o.customStart!==void 0&&o.customStart!==null)return Math.max(0,Number(o.customStart)||0);if(o.randomStart&&isFinite(d)&&d>a){const l=Math.max(0,Math.floor(d-a));return Math.floor(Math.random()*(l+1))}return 0},p=()=>{if(i)return;i=!0,m();const d=u(),l=d+a;this.playbackInfo={startSec:d,endSec:l,duration:a};try{d>0&&(this.audio.currentTime=d)}catch(c){console.warn("[PLAYER] Aviso al posicionar segundo de inicio:",c)}this.audio.play().then(()=>{this.timer.start(a),s(this.playbackInfo)}).catch(c=>{this.onError("Error al iniciar reproducción: "+c.message),n(c)})},g=()=>{p()},x=()=>{this.audio.readyState>=2&&p()},R=()=>{if(i)return;i=!0,m();const d=this.audio.error,l=d?`Error (${d.code}) al cargar audio`:"Error de reproducción";this.onError(l),n(new Error(l))};this.audio.addEventListener("loadedmetadata",x),this.audio.addEventListener("canplay",g),this.audio.addEventListener("error",R),this.audio.src=t,this.audio.load(),this.audio.readyState>=3&&p()})}stop(){try{this.audio.pause()}catch{}this.timer.stop(),this.onComplete()}pause(){this.audio.pause()}resume(){this.audio.play()}}const r={elements:{},init(){return this._ensureFeedbackElements(),this.elements={selectRonda:document.getElementById("select-ronda"),audicionNumero:document.getElementById("audicion-numero"),audioPlayer:document.getElementById("audio-player"),timerDisplay:document.getElementById("timer-display"),btnPlay:document.getElementById("btn-play"),listaAlumnos:document.getElementById("lista-alumnos"),btnGuardarAciertos:document.getElementById("btn-guardar-aciertos"),btnFinalizarRonda:document.getElementById("btn-finalizar-ronda"),btnResetRonda:document.getElementById("btn-reset-ronda"),btnVerRanking:document.getElementById("btn-ver-ranking"),rankingSection:document.getElementById("ranking-section"),rankingContent:document.getElementById("ranking-content"),loadingOverlay:document.getElementById("loading-overlay"),toast:document.getElementById("toast")},this.elements},_ensureFeedbackElements(){if(!document.getElementById("loading-overlay")){const e=document.createElement("div");e.id="loading-overlay",e.className="fixed inset-0 bg-black/75 z-50 flex flex-col items-center justify-center transition-opacity duration-300 hidden",e.innerHTML=`
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400 mb-4"></div>
        <p id="loading-text" class="text-white text-xl font-semibold tracking-wide">Cargando...</p>
      `,document.body.appendChild(e)}if(!document.getElementById("toast")){const e=document.createElement("div");e.id="toast",e.className="fixed bottom-5 right-5 z-50 max-w-md px-6 py-4 rounded-xl shadow-2xl text-white font-medium transform transition-all duration-300 translate-y-20 opacity-0 pointer-events-none flex items-center space-x-3",document.body.appendChild(e)}},get(e){return this.elements[e]||(this.elements[e]=document.getElementById(e)),this.elements[e]},showLoading(e="Procesando..."){const t=this.get("loadingOverlay");if(t){const a=document.getElementById("loading-text");a&&(a.textContent=e),t.classList.remove("hidden"),setTimeout(()=>t.classList.remove("opacity-0"),10)}},hideLoading(){const e=this.get("loadingOverlay");e&&(e.classList.add("opacity-0"),setTimeout(()=>e.classList.add("hidden"),250))},showToast(e,t="info",a=3500){const o=this.get("toast");if(!o)return;const s={success:"bg-emerald-600 border border-emerald-400",error:"bg-rose-600 border border-rose-400",warning:"bg-amber-600 border border-amber-400",info:"bg-blue-600 border border-blue-400"},n={success:"✓",error:"✕",warning:"⚠",info:"ℹ"};o.className=`fixed bottom-5 right-5 z-50 max-w-md px-6 py-4 rounded-xl shadow-2xl text-white font-medium transform transition-all duration-300 flex items-center space-x-3 ${s[t]||s.info}`,o.innerHTML=`
      <span class="text-2xl font-bold">${n[t]||"ℹ"}</span>
      <span class="flex-1">${e}</span>
    `,o.classList.remove("translate-y-20","opacity-0","pointer-events-none"),o.classList.add("translate-y-0","opacity-100"),this._toastTimer&&clearTimeout(this._toastTimer),this._toastTimer=setTimeout(()=>{o.classList.add("translate-y-20","opacity-0","pointer-events-none"),o.classList.remove("translate-y-0","opacity-100")},a)}};function de(e){if(!e||typeof e!="string")return"";const t=e.trim();if(t.startsWith("[")&&t.endsWith("]")||t.toLowerCase()==="file_id"||t==="")return"";const a=t.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);if(a&&a[1])return a[1];const o=t.match(/[?&]id=([a-zA-Z0-9_-]+)/);if(o&&o[1])return o[1];const s=t.match(/\/d\/([a-zA-Z0-9_-]+)/);return s&&s[1]?s[1]:(/^[a-zA-Z0-9_-]{20,60}$/.test(t),t)}function _e(e,t=v.TOTAL_RONDAS||5){const a=Number(e);return Number.isInteger(a)&&a>=1&&a<=t}function Me(e){const t=de(e);return t?/^[a-zA-Z0-9_-]{20,60}$/.test(t):!1}function I(e){return e==null?"":String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function J(e){return String(e||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase().replace(/[^A-Z0-9]/g,"")}function z(e,t){let a=[],o=[],s=[],n=1,i=!1,m=4,u=1;if(e&&Array.isArray(e.alumnos))a=e.alumnos||[],o=Array.isArray(e.resultados)?e.resultados:Object.values(e.resultados||{}),s=Array.isArray(e.respuestasAudicion)?e.respuestasAudicion:[],n=e.rondaActual||1,i=!!e.rondaCerrada,u=e.audicionActual||1,m=(v.ROUNDS[n]||{audiciones:4}).audiciones;else{a=Array.isArray(e)?e:[],o=Array.isArray(t)?t:[];const c=r.get("selectRonda");c&&(n=parseInt(c.value,10)||1);const h=r.get("audicionNumero");h&&(u=parseInt(h.textContent,10)||1),m=(v.ROUNDS[n]||{audiciones:4}).audiciones}const p=r.get("listaAlumnos");if(!p)return;if(a.length===0){p.innerHTML=`
      <div class="col-span-full text-center py-8 text-blue-200">
        <p class="text-lg">No hay alumnos registrados o activos para este certamen.</p>
      </div>
    `;return}const g={},x={};o.forEach(c=>{if(parseInt(c.ronda,10)===n&&(g[String(c.alumnoId)]=c),c.eliminado){const h=c.rondaEliminacion||c.ronda;(!x[String(c.alumnoId)]||h<x[String(c.alumnoId)])&&(x[String(c.alumnoId)]=h)}});const d=(v.ROUNDS[n]||{minimoPasar:2}).minimoPasar,l=s.filter(c=>Number(c.ronda)===Number(n));p.innerHTML=a.map(c=>{var le;const h=g[String(c.id)],$=l.filter(D=>String(D.alumnoId)===String(c.id)),y=$.length>0?$.filter(D=>D.correcto===!0||String(D.correcto).toLowerCase()==="true").length:h?parseInt(h.aciertos,10):0,A=c.rondaEliminacion||x[String(c.id)],w=A&&A<n,C=h?h.eliminado:!1,T=Z(c.nombre);let E="bg-blue-900/60 text-blue-200 border border-blue-400/30",S="En competencia";w?(E="bg-rose-950 text-rose-300 border border-rose-800",S=`❌ Eliminado en Ronda ${A}`):C?(E="bg-red-900/80 text-red-200 border border-red-500",S=`Eliminado en Ronda ${n}`):y>=d&&(E="bg-emerald-900/80 text-emerald-200 border border-emerald-500",S=`Clasificado (${y}/${m})`);let L="";for(let D=1;D<=m;D++){const V=$.find(Le=>Number(Le.audicionNum)===D),X=V&&(V.correcto===!0||String(V.correcto).toLowerCase()==="true"),ee=D===u,Ce=i||w||!ee;L+=`
        <label class="flex flex-col items-center justify-center cursor-pointer p-1.5 rounded-lg border transition select-none ${ee?"bg-yellow-500/20 border-yellow-400 shadow-md ring-1 ring-yellow-400":"bg-blue-950/60 hover:bg-blue-900 border-blue-700/50"}">
          <span class="text-xs ${ee?"text-yellow-300 font-extrabold":"text-slate-300"} mb-1">Aud ${D}</span>
          <input 
            type="checkbox" 
            class="checkbox-acierto w-5 h-5 text-yellow-500 bg-blue-900 rounded border-gray-400 focus:ring-yellow-400 focus:ring-2 cursor-pointer"
            data-alumno-id="${I(c.id)}"
            data-audicion="${D}"
            ${X?"checked":""}
            ${Ce?"disabled":""}
          />
          <span class="text-[9px] ${V?X?"text-emerald-300":"text-rose-300":"text-slate-500"}">${V?X?"Correcta":"Error":"Pendiente"}</span>
        </label>
      `}return`
      <div class="alumno-card bg-slate-800/90 border border-slate-700 rounded-xl p-4 shadow-md transition hover:border-yellow-500/50 ${w?"opacity-40 bg-slate-950 cursor-not-allowed":""}" data-alumno-card="${I(c.id)}">
        <div class="flex items-start justify-between mb-2">
          <div>
            <h3 class="font-bold text-base md:text-lg text-white">${I(T)}</h3>
            <p class="text-xs text-slate-300">${I(c.grado||"")} ${I(c.nivel||"")}</p>
          </div>
          <span class="text-xs px-2.5 py-1 rounded-full font-medium ${E}">
            ${S}
          </span>
        </div>

        <!-- Checkboxes de audiciones -->
        <div class="mt-2">
          <div class="text-xs text-slate-400 mb-1.5 flex justify-between items-center">
            <span>Aciertos Ronda ${n}:</span>
            <span class="font-bold text-yellow-400"><span id="aciertos-count-${c.id}">${y}</span> / ${m}</span>
          </div>
          <div class="grid grid-cols-${Math.min(m,4)} gap-1.5">
            ${L}
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
              data-alumno-id="${I(c.id)}"
              data-audicion="${u}"
              ${i?"disabled":""}
              value="${I(((le=$.find(D=>Number(D.audicionNum)===u))==null?void 0:le.respuesta)||"")}"
            />
          </div>
        `}
      </div>
    `}).join("")}function H(e,t){let a=[],o=1,s=1;if(e&&e.rondaActual!==void 0)o=e.rondaActual,a=e.audicionesRonda||e.audiciones||[],s=e.audicionActual||1;else{a=Array.isArray(e)?e:[],o=1;const R=r.get("audicionNumero");R&&(s=parseInt(R.textContent,10)||1)}const n=r.get("audicionNumero");n&&(n.textContent=String(s));const i=a.find(R=>R.audicionNum===s)||a[s-1],m=document.getElementById("admin-cancion-nombre"),u=document.getElementById("admin-cancion-codigo"),p=document.getElementById("admin-seg-duracion"),g=v.ROUNDS[o]||{duracion:40,audiciones:4};m&&(m.textContent=i?i.cancionNombre||`Composición #${i.cancionId}`:"Composición no asignada"),u&&(u.textContent=i&&i.cancionCodigo||"----"),p&&(p.textContent=String(g.duracion||40));const x=document.getElementById("ronda-info-detalles");x&&(x.innerHTML=`
      <div class="flex flex-wrap items-center justify-between text-xs md:text-sm bg-blue-950/70 p-3 rounded-lg border border-blue-700/60 mt-3 gap-2">
        <span>⏱ <strong>Duración:</strong> ${g.duracion||40}s por audición</span>
        <span>🎯 <strong>Mínimo para clasificar:</strong> ${g.minimoPasar||2} aciertos</span>
        <span>🎼 <strong>Total audiciones:</strong> ${g.audiciones||4}</span>
      </div>
    `)}function ce(e){const t=r.get("rankingContent");if(!t)return;if(!e||e.length===0){t.innerHTML=`
      <div class="text-center py-6 text-slate-300">
        <p>Aún no hay puntajes registrados en el certamen.</p>
      </div>
    `;return}const a=e.slice(0,3),o=Ue(a),s=e.map((n,i)=>{const m=i+1;let u=`<span class="font-bold text-slate-300">${Oe(m)}</span>`,p="hover:bg-slate-700/50";m===1?(u='<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500 text-slate-950 font-black shadow-lg">🥇 1°</span>',p="bg-yellow-500/10 hover:bg-yellow-500/20 border-l-4 border-yellow-500"):m===2?(u='<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-300 text-slate-950 font-black shadow-lg">🥈 2°</span>',p="bg-slate-300/10 hover:bg-slate-300/20 border-l-4 border-slate-300"):m===3&&(u='<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-700 text-amber-100 font-black shadow-lg">🥉 3°</span>',p="bg-amber-700/10 hover:bg-amber-700/20 border-l-4 border-amber-600");const g=n.eliminado?`Eliminado en Ronda ${n.rondaEliminacion||1}`:`Activo (Ronda ${n.rondaMax||1})`;return`
      <tr class="border-b border-slate-700/60 ${p} transition-colors">
        <td class="p-3 text-center">${u}</td>
        <td class="p-3 font-semibold text-white">
          ${I(Z(n.nombre))}
          ${n.premio?`<span class="block text-xs text-yellow-400 font-normal">🎁 ${n.premio}</span>`:""}
        </td>
        <td class="p-3 text-slate-300 text-sm">${I(n.grado||"")} ${I(n.nivel||"")}</td>
        <td class="p-3 text-center">
          <span class="inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${n.eliminado?"bg-rose-950 text-rose-300 border border-rose-800":"bg-emerald-950 text-emerald-300 border border-emerald-800"}">
            ${g}
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
  `}function Ue(e){if(!e||e.length===0)return"";const[t,a,o]=e;return`
    <div class="podium-container flex justify-center items-end gap-3 md:gap-6 my-8 px-2 max-w-2xl mx-auto">
      
      <!-- 2do Puesto -->
      <div class="flex-1 text-center order-1 transform transition hover:-translate-y-1">
        ${a?`
          <div class="bg-slate-800/90 border-2 border-slate-300 rounded-t-2xl p-4 shadow-xl flex flex-col items-center">
            <div class="w-12 h-12 rounded-full bg-slate-300 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg mb-2">
              🥈
            </div>
            <p class="font-bold text-white text-sm md:text-base line-clamp-1">${I(Z(a.nombre))}</p>
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
            <p class="font-extrabold text-yellow-300 text-base md:text-lg line-clamp-1">${I(Z(t.nombre))}</p>
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
            <p class="font-bold text-white text-sm md:text-base line-clamp-1">${I(Z(o.nombre))}</p>
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
  `}function oe(e,t=40){const a=r.get("timerDisplay");a&&(a.textContent=e,e<=3&&e>0?a.className="text-7xl md:text-8xl font-black text-red-500 mb-4 animate-ping":e<=5&&e>0?a.className="text-7xl md:text-8xl font-black text-red-400 mb-4 animate-pulse":e<=10&&e>0?a.className="text-7xl md:text-8xl font-bold text-amber-400 mb-4":a.className="text-7xl md:text-8xl font-bold text-yellow-400 mb-4")}function Re(e,t){return new Map((Array.isArray(e)?e:[]).filter(a=>Number(a.audicionNum)===Number(t)).map(a=>[String(a.alumnoId),a]))}function Ee(e,t,a){if(!Array.isArray(a)||a.length===0)return!1;const o=Re(e,t);return a.every(s=>o.has(String(s)))}let _=!1,N=1,ne=null,W=null,O={startSec:0,endSec:40,duration:40};const ue={};function Be(e){return!e||typeof e!="string"?"":e.startsWith("data:video/")||e.startsWith("data:application/octet-stream")||e.startsWith("data:binary/")?e.replace(/^data:[^;]+;base64,/,"data:audio/mpeg;base64,"):e}function ze(e){r.init(),N=b.get().audicionActual||1;const t=r.get("btnPlay");t&&t.addEventListener("click",async()=>{if(_){be(e,!1),e.stop(),xe();return}const d=b.get(),l=d.rondaActual||1,c=v.ROUNDS[l]||{duracion:40};let h=d.audicionesRonda||[];if(!h||h.length===0){r.showLoading("Obteniendo audición configurada...");try{h=(await f.getAudicionesRonda(l)).data||[],b.set({audicionesRonda:h})}catch(E){console.warn("[AUDIO] No se pudieron cargar audiciones desde backend:",E)}finally{r.hideLoading()}}const $=h.find(E=>E.audicionNum===N)||h[N-1]||{};if(!$.cancionId){r.showToast("No hay un sorteo guardado para esta audición. Configura las canciones y genera el sorteo.","warning",4500);return}W=$;const y=$.driveId||$.archivoDriveId||null,A=de(y),w=c.duracion,C=document.getElementById("chk-random-start"),T=C?C.checked:!0;ge(!0);try{let E=!1;if(ne=new Date,y&&(y.startsWith("http://")||y.startsWith("https://")||y.startsWith("/"))&&!y.includes("drive.google.com"))try{console.log(`[AUDIO] Reproduciendo URL directa: ${y}`),O=await he(e,y,w,{randomStart:T})||{startSec:0,endSec:w,duration:w},j(O.startSec,O.endSec),E=!0}catch(S){console.warn("[AUDIO] Falló URL directa personalizada:",S)}if(!E&&Me(A)){let S=ue[A];if(!S){r.showLoading("Cargando pista de audio desde Google Drive...");try{const L=await f.getAudioUrl(A,!0);L&&L.data&&L.data.dataUri&&(S=Be(L.data.dataUri),ue[A]=S)}catch(L){console.warn("[AUDIO] Error al consultar API de audio:",L)}finally{r.hideLoading()}}if(S)try{O=await he(e,S,w,{randomStart:T})||{startSec:0,endSec:w,duration:w},j(O.startSec,O.endSec),E=!0}catch(L){console.warn("[AUDIO] Error al reproducir Data URI:",L)}}if(!E){const S=T?Math.floor(Math.random()*40):0,L=S+w;O={startSec:S,endSec:L,duration:w},j(S,L),r.showToast(`Audición ${N}: ${A?"Reproduciendo sonido de prueba":"Archivo no asignado"} (de ${S}s a ${L}s).`,"info",3500),ye(e,w)}_=!0,fe(!0)}catch(E){console.error("[AUDIO ERROR GENERAL]",E);const S=T?Math.floor(Math.random()*30):0;O={startSec:S,endSec:S+w,duration:w},j(S,S+w),ye(e,w),_=!0,fe()}finally{ge(!1)}});const a=e.onComplete;if(e.onComplete=()=>{be(e,!0),xe(),r.showToast(`Audición ${N} finalizada. Verifica y guarda las respuestas.`,"info",3e3),B(),a&&a()},e.timer){const d=e.timer.onTick;e.timer.onTick=l=>{const c=b.get(),h=v.ROUNDS[c.rondaActual]||{duracion:40};oe(l,h.duracion),d&&d(l)}}const o=document.getElementById("btn-prev-audicion"),s=document.getElementById("btn-next-audicion");o&&o.addEventListener("click",()=>{if(N>1){if(re()&&!window.confirm("Hay respuestas sin guardar. ¿Descartarlas y volver a la audición anterior?"))return;N--,me(N),B()}}),s&&s.addEventListener("click",()=>{const d=b.get(),l=v.ROUNDS[d.rondaActual]||{audiciones:4};if(_){r.showToast("Espera a que termine el audio antes de cambiar de audición.","warning");return}if(!Se()||re()){r.showToast("Verifica y guarda las respuestas de esta audición antes de avanzar.","warning",4e3);return}N<l.audiciones&&(N++,me(N),B())});const n={AUDICION:document.getElementById("btn-modo-audicion"),CLASIFICADOS:document.getElementById("btn-modo-clasificados"),RANKING_FINAL:document.getElementById("btn-modo-ranking")};Object.entries(n).forEach(([d,l])=>{l&&l.addEventListener("click",async()=>{pe(d,n),r.showToast(`Proyector configurado en: ${d}`,"info",2e3);try{await f.actualizarModoProyector(d)}catch(c){console.warn("Error al sincronizar modo proyector:",c)}})});const i=r.get("selectRonda");i&&i.addEventListener("change",async d=>{const l=parseInt(d.target.value,10);if(!_e(l)){r.showToast("Ronda inválida","error");return}const c=b.get();if(_){d.target.value=String(c.rondaActual||1),r.showToast("Espera a que termine el audio antes de cambiar de ronda.","warning");return}if(l>(c.rondaActual||1)&&!se()){d.target.value=String(c.rondaActual||1),r.showToast("Guarda todas las respuestas de la ronda actual antes de avanzar.","warning",4e3);return}r.showLoading(`Cargando Ronda ${l}...`);try{N=1,await f.actualizarRondaActual(l);const[h,$,y,A,w]=await Promise.all([f.getAudicionesRonda(l),f.getResultados(l),f.getAlumnos(),f.getRespuestasRonda(l),f.getEstadoCertamen()]);b.set({rondaActual:l,rondaCerrada:!!(w.data&&w.data.rondaCerrada),audicionActual:1,audicionesRonda:h.data||[],resultados:$.data||[],alumnos:y.data||[],respuestasAudicion:A.data||[]}),H(b.get()),z(b.get());const C=v.ROUNDS[l]||{duracion:40};oe(C.duracion,C.duracion),j(0,C.duracion),B(),r.showToast(`Secuencia: Ronda ${l} activada`,"success")}catch(h){console.error("Error al cambiar ronda:",h),d.target.value=String(c.rondaActual||1),r.showToast("Error al cambiar de ronda: "+h.message,"error")}finally{r.hideLoading()}});const m=r.get("listaAlumnos");m&&(m.addEventListener("input",d=>{if(d.target&&d.target.classList.contains("input-pizarra-alumno")){const l=d.target.dataset.alumnoId,c=d.target.value.trim().toUpperCase(),$=b.get().audicionesRonda||[],y=$.find(L=>L.audicionNum===N)||$[N-1]||{},A=J(y.cancionCodigo),w=J(y.cancionNombre),C=[...m.querySelectorAll("[data-alumno-card]")].find(L=>L.getAttribute("data-alumno-card")===l);if(!C)return;const T=C.querySelector(`.checkbox-acierto[data-audicion="${N}"]`),E=J(d.target.value);E!==""&&(E===A||E===w)?(d.target.classList.remove("border-slate-700","border-rose-500"),d.target.classList.add("border-emerald-400","bg-emerald-950/60"),T&&!T.checked&&(T.checked=!0,te(C,l))):c===""?(d.target.classList.remove("border-emerald-400","bg-emerald-950/60","border-rose-500"),d.target.classList.add("border-slate-700"),T&&(T.checked=!1)):(d.target.classList.remove("border-emerald-400","bg-emerald-950/60","border-slate-700"),d.target.classList.add("border-rose-500"),T&&(T.checked=!1)),te(C,l),B()}}),m.addEventListener("change",d=>{if(d.target&&d.target.classList.contains("checkbox-acierto")){const l=d.target.dataset.alumnoId,c=document.querySelector(`[data-alumno-card="${l}"]`);c&&te(c,l),B()}}));const u=r.get("btnGuardarAciertos");u&&u.addEventListener("click",async()=>{const d=b.get(),l=d.rondaActual||1,c=N;if(_){r.showToast("Espera a que termine el audio antes de guardar respuestas.","warning");return}const h=Y(d),$=[...document.querySelectorAll("[data-alumno-card]")];let y;try{y=h.map(A=>{const w=$.find(S=>S.getAttribute("data-alumno-card")===String(A.id));if(!w)throw new Error(`No se encontró la ficha del participante ${A.id}.`);const C=w.querySelector(`.input-pizarra-alumno[data-audicion="${c}"]`),T=w.querySelector(`.checkbox-acierto[data-audicion="${c}"]`),E=C?C.value.trim():"";return{alumnoId:A.id,respuesta:E,correcto:E!==""&&!!(T&&T.checked)}})}catch(A){console.error("Error al preparar respuestas:",A),r.showToast("Error al preparar respuestas: "+A.message,"error");return}if(y.length===0){r.showToast("No hay participantes elegibles para guardar.","warning");return}r.showLoading("Guardando respuestas de esta audición...");try{await f.guardarRespuestasAudicion({ronda:l,audicionNum:c,respuestas:y});const[A,w]=await Promise.all([f.getRespuestasRonda(l),f.getResultados(l)]);b.set({respuestasAudicion:A.data||[],resultados:w.data||[]}),z(b.get()),H(b.get()),B();const C=y.filter(T=>T.correcto).length;r.showToast(`Audición ${c} guardada: ${C} correctas y ${y.length-C} errores.`,"success",4500)}catch(A){console.error("Error al guardar respuestas:",A),r.showToast("❌ Error al guardar respuestas: "+A.message,"error")}finally{r.hideLoading()}});const p=r.get("btnFinalizarRonda");p&&p.addEventListener("click",async()=>{const l=b.get().rondaActual||1,c=v.ROUNDS[l]||{minimoPasar:2};if(!se()){r.showToast("No se puede finalizar: guarda las respuestas de todas las audiciones primero.","warning",4500);return}if(window.confirm(`¿Desea FINALIZAR la Ronda ${l}?

• Mínimo exigido: ${c.minimoPasar} aciertos
• Los alumnos con menos de ${c.minimoPasar} aciertos quedarán marcados como ELIMINADOS EN RONDA ${l}.
• El proyector pasará automáticamente al modo CLASIFICADOS.

¿Continuar?`)){r.showLoading("Finalizando ronda y calculando clasificación...");try{const y=(await f.finalizarRonda(l)).data||{};r.showToast(`Ronda ${l} Finalizada: ${y.pasanCount||0} clasifican, ${y.eliminadosCount||0} eliminados`,"success",5e3);const[A,w,C]=await Promise.all([f.getResultados(l),f.getRanking(),f.getAlumnos()]);b.set({resultados:A.data||[],ranking:w.data||[],alumnos:C.data||[],rondaCerrada:!0}),z(b.get()),pe(l===v.TOTAL_RONDAS?"RANKING_FINAL":"CLASIFICADOS",n);const T=r.get("rankingSection");if(T&&!T.classList.contains("hidden")&&ce(w.data||[]),y.siguienteRonda&&y.siguienteRonda!==l&&y.siguienteRonda<=v.TOTAL_RONDAS){const E=r.get("selectRonda");E&&(E.value=String(y.siguienteRonda),E.dispatchEvent(new Event("change")))}}catch($){console.error("Error al finalizar ronda:",$),r.showToast("Error al finalizar ronda: "+$.message,"error")}finally{r.hideLoading()}}});const g=r.get("btnResetRonda");g&&g.addEventListener("click",async()=>{const l=b.get().rondaActual||1;if(window.confirm(`⚠️ ATENCIÓN: ¿Está seguro de RESETEAR la Ronda ${l}?

Se borrarán las respuestas y resultados de la Ronda ${l} y de las rondas posteriores.`)){r.showLoading(`Reseteando datos de la Ronda ${l}...`);try{await f.resetRonda(l);const[h,$,y]=await Promise.all([f.getResultados(l),f.getAlumnos(),f.getRespuestasRonda(l)]);b.set({resultados:h.data||[],alumnos:$.data||[],respuestasAudicion:y.data||[],rondaCerrada:!1}),z(b.get()),B(),r.showToast(`Ronda ${l} ha sido reseteada correctamente`,"warning")}catch(h){console.error("Error al resetear ronda:",h),r.showToast("Error al resetear ronda: "+h.message,"error")}finally{r.hideLoading()}}});const x=r.get("btnVerRanking"),R=r.get("rankingSection");x&&R&&x.addEventListener("click",async()=>{if(R.classList.contains("hidden")){r.showLoading("Calculando tabla de posiciones y ranking...");try{const c=(await f.getRanking()).data||[];b.set({ranking:c}),ce(c),R.classList.remove("hidden"),x.textContent="✕ Ocultar Ranking",x.classList.replace("bg-purple-700","bg-purple-900"),R.scrollIntoView({behavior:"smooth"})}catch(l){console.error("Error al obtener ranking:",l),r.showToast("Error al obtener ranking: "+l.message,"error")}finally{r.hideLoading()}}else R.classList.add("hidden"),x.textContent="🏆 Ver Ranking",x.classList.replace("bg-purple-900","bg-purple-700")}),B()}function me(e){b.set({audicionActual:e}),H(b.get()),z(b.get());const t=b.get(),a=v.ROUNDS[t.rondaActual]||{duracion:40};j(0,a.duracion)}function Y(e=b.get()){const t=Number(e.rondaActual)||1;return(e.alumnos||[]).filter(a=>{const o=Number(a.rondaEliminacion);return Number.isInteger(o)&&o>0?o>=t:!a.eliminado})}function Se(e=b.get()){const t=Y(e);return Ee(e.respuestasAudicion,N,t.map(a=>a.id))}function re(e=b.get()){const t=Re(e.respuestasAudicion,N),a=[...document.querySelectorAll("[data-alumno-card]")];return Y(e).some(o=>{const s=a.find(x=>x.getAttribute("data-alumno-card")===String(o.id));if(!s)return!1;const n=s.querySelector(`.input-pizarra-alumno[data-audicion="${N}"]`),i=s.querySelector(`.checkbox-acierto[data-audicion="${N}"]`),m=n?n.value.trim():"",u=!!(i&&i.checked),p=t.get(String(o.id));if(!p)return m!==""||u;const g=p.correcto===!0||String(p.correcto).toLowerCase()==="true";return J(m)!==J(p.respuesta)||u!==g})}function se(e=b.get()){const t=v.ROUNDS[e.rondaActual];if(!t)return!1;const a=Y(e).map(o=>o.id);return a.length===0?!1:Array.from({length:t.audiciones},(o,s)=>s+1).every(o=>Ee(e.respuestasAudicion,o,a))}function B(){const e=b.get(),t=v.ROUNDS[e.rondaActual];if(!t)return;const a=Se(e),o=re(e),s=se(e),n=!!e.rondaCerrada,i=document.getElementById("btn-prev-audicion"),m=document.getElementById("btn-next-audicion"),u=r.get("btnGuardarAciertos"),p=r.get("btnFinalizarRonda"),g=document.getElementById("audicion-estado-guardado");if(i&&(i.disabled=n||_||N<=1),m){const x=!n&&a&&!o&&!_&&N<t.audiciones;m.disabled=!x,m.textContent=N<t.audiciones?"Siguiente ▶":"Última audición"}u&&(u.disabled=n||_||Y(e).length===0),p&&(p.disabled=n||_||!s),g&&(n?g.textContent="Ronda finalizada":_?g.textContent="Audio en curso":o?g.textContent="Hay cambios sin guardar":a?g.textContent=`Respuestas de la audición ${N} guardadas`:g.textContent=`Audición ${N} pendiente de guardar`,g.className=`text-xs mb-3 ${n||a&&!o?"text-emerald-300":"text-amber-300"}`)}function j(e,t){const a=document.getElementById("badge-rango-reproduccion");a&&(a.textContent=`📍 Rango: de ${e}s a ${t}s`)}function te(e,t){const a=e.querySelectorAll(".checkbox-acierto:checked").length,o=document.getElementById(`aciertos-count-${t}`);o&&(o.textContent=a);const s=b.get(),n=v.ROUNDS[s.rondaActual]||{minimoPasar:2},i=e.querySelector("span.rounded-full");i&&!i.textContent.includes("Eliminado")&&(a>=n.minimoPasar?(i.className="text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-900/80 text-emerald-200 border border-emerald-500",i.textContent=`Clasificado (${a})`):(i.className="text-xs px-2.5 py-1 rounded-full font-medium bg-blue-900/60 text-blue-200 border border-blue-400/30",i.textContent="En competencia"))}function pe(e,t){Object.entries(t).forEach(([a,o])=>{o&&(a===e?o.className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition border border-yellow-500 bg-yellow-500 text-slate-950 cursor-pointer shadow":o.className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition border border-slate-700 bg-slate-800 text-slate-300 hover:text-white cursor-pointer")})}function be(e,t){if(!ne||!W)return;const o=b.get().rondaActual||1,s=v.ROUNDS[o]||{duracion:40},n=O&&O.startSec!==void 0?O.startSec:0;let i=O&&O.endSec!==void 0?O.endSec:n+s.duracion;if(!t&&e.timer&&e.timer.timeLeft!==void 0){const u=s.duracion-e.timer.timeLeft;i=n+Math.max(1,u)}const m=Math.max(1,i-n);f.registrarReproduccion({ronda:o,audicionNum:N,cancionId:W.cancionId||"",cancionNombre:W.cancionNombre||"",cancionCodigo:W.cancionCodigo||"",segundoInicio:n,segundoFin:i,duracion:m}).then(u=>{console.log("[AUDITORIA] Registrado en Google Sheets:",u.data);const p=document.getElementById("admin-log-status");p&&u.data&&(p.innerHTML=`✅ Registrado en Google Sheets: de ${n}s a ${i}s (${m}s) a las ${u.data.fechaHora.split(" ")[1]}`)}).catch(u=>{console.warn("[AUDITORIA ERROR]",u)}),ne=null}function ge(e){const t=r.get("btnPlay");t&&e&&(t.disabled=!0,t.textContent="⏳ Cargando audio...",t.className="bg-yellow-600 text-white text-xl md:text-2xl px-10 py-4 rounded-xl shadow-lg cursor-not-allowed opacity-80")}function fe(e){const t=r.get("btnPlay");t&&(t.disabled=!1,t.textContent="⏹ DETENER AUDICIÓN",t.className="bg-red-600 hover:bg-red-700 text-white text-xl md:text-2xl font-black px-10 py-4 rounded-xl shadow-xl transition animate-pulse cursor-pointer",document.body.classList.add("is-playing"))}function xe(){_=!1,document.body.classList.remove("is-playing");const e=r.get("btnPlay");e&&(e.disabled=!1,e.textContent="▶ REPRODUCIR AUDICIÓN",e.className="bg-emerald-600 hover:bg-emerald-500 text-white text-xl md:text-2xl font-black px-10 py-4 rounded-xl shadow-xl transition transform active:scale-95 inline-flex items-center space-x-3 cursor-pointer")}async function he(e,t,a,o={}){return new Promise((s,n)=>{const i=setTimeout(()=>{n(new Error("Tiempo de espera agotado al reproducir fuente de audio"))},8e3);e.play(t,a,o).then(m=>{clearTimeout(i),s(m)}).catch(m=>{clearTimeout(i),n(m)})})}function ye(e,t){try{const a=window.AudioContext||window.webkitAudioContext;if(!a)throw new Error("No Web Audio API");const o=new a,s=[293.66,369.99,440],n=[];s.forEach(i=>{const m=o.createOscillator(),u=o.createGain();m.type="triangle",m.frequency.setValueAtTime(i,o.currentTime),u.gain.setValueAtTime(.001,o.currentTime),u.gain.exponentialRampToValueAtTime(.15,o.currentTime+.1),u.gain.exponentialRampToValueAtTime(.001,o.currentTime+t),m.connect(u),u.connect(o.destination),m.start(),n.push(m)}),e.timer.start(t),setTimeout(()=>{try{n.forEach(i=>i.stop()),o.close()}catch{}},t*1e3)}catch{e.timer.start(t)}}let q=null,Ne="rondas",M=[],U=[],Q=[],k=[],P={},G=[],F=[];function qe(){$e();const e=document.getElementById("btn-abrir-config");e&&e.addEventListener("click",je)}function $e(){if(document.getElementById("modal-configuracion"))return;const e=document.createElement("div");e.id="modal-configuracion",e.className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 transition-opacity duration-300 hidden opacity-0",e.innerHTML=`
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
  `,document.body.appendChild(e),q=e,e.querySelector("#btn-cerrar-config").addEventListener("click",ve),e.querySelector("#btn-cerrar-config-footer").addEventListener("click",ve),e.querySelectorAll(".tab-btn").forEach(t=>{t.addEventListener("click",a=>{const o=a.currentTarget.dataset.tab;Ge(o)})})}async function je(){q||$e(),r.showLoading("Cargando configuraciones...");try{const[e,t,a,o,s]=await Promise.all([f.getConfig(),f.getCanciones(),f.getAlumnos(),f.getResultados(),f.getRespuestasRonda()]);P=e.data||{},v.syncFromBackend(P),M=t.data||[],k=a.data||[],F=o.data||[],G=s.data||[];const n=Array.from({length:v.TOTAL_RONDAS},(m,u)=>u+1);U=(await Promise.all(n.map(m=>f.getAudicionesRonda(m)))).flatMap(m=>m.data||[]),Q=[...U],q.classList.remove("hidden"),setTimeout(()=>q.classList.remove("opacity-0"),10),Ie()}catch(e){console.error("Error al abrir configuración:",e),r.showToast("Error al cargar datos de configuración","error")}finally{r.hideLoading()}}function ve(){q&&(q.classList.add("opacity-0"),setTimeout(()=>q.classList.add("hidden"),250))}function Ge(e){Ne=e,q.querySelectorAll(".tab-btn").forEach(t=>{t.dataset.tab===e?t.className="tab-btn px-4 py-3 border-b-2 border-yellow-400 text-yellow-300 flex items-center space-x-2 whitespace-nowrap cursor-pointer":t.className="tab-btn px-4 py-3 border-b-2 border-transparent text-slate-400 hover:text-white flex items-center space-x-2 whitespace-nowrap cursor-pointer"}),Ie()}function Ie(){const e=document.getElementById("config-tab-content");if(e)switch(Ne){case"rondas":Te(e);break;case"canciones":ie(e);break;case"sorteo":Fe(e);break;case"participantes":K(e);break}}function Fe(e){const t=M.filter(o=>o.activa!==!1),a=Object.values(v.ROUNDS).reduce((o,s)=>o+s.audiciones,0);e.innerHTML=`
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
        <span>Total audiciones programadas: <strong class="text-white">${U.length||a}</strong></span>
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
            ${we(U)}
          </tbody>
        </table>
      </div>
    </div>
  `,e.querySelector("#btn-generar-sorteo").addEventListener("click",()=>{if(t.length===0){r.showToast("No hay canciones activas para sortear","error");return}const o=[];let s=1;for(let n=1;n<=v.TOTAL_RONDAS;n++){const i=v.ROUNDS[n].audiciones;if(i>t.length){r.showToast(`La Ronda ${n} requiere ${i} canciones distintas, pero solo hay ${t.length} activas.`,"error",5e3);return}const m=He(t);for(let u=1;u<=i;u++){const p=m[u-1];o.push({ronda:n,audicionNum:u,cancionId:p.id,cancionNombre:p.nombre,cancionCodigo:p.codigo,orden:s++})}}U=o,e.querySelector("#sorteo-preview-body").innerHTML=we(o),r.showToast("¡Nuevo sorteo aleatorio generado con éxito!","success",2500)}),e.querySelector("#btn-guardar-sorteo").addEventListener("click",async()=>{if(U.length===0){r.showToast("Genera un sorteo antes de guardar","warning");return}const o=!Ve(Q,U),s=F.length>0||G.length>0,n=o&&s;if(!(n&&!window.confirm("El sorteo actual ya tiene respuestas o resultados. Si guardas este nuevo sorteo, se borrarán los resultados y respuestas de todas las rondas. ¿Continuar?"))){r.showLoading("Guardando orden de audiciones en Google Sheets...");try{const i=await f.guardarAudicionesRonda(U,n),m=!!(i.data&&i.data.reinicioRealizado),u=b.get(),p=m?1:u.rondaActual||1,[g,x,R]=await Promise.all([f.getAudicionesRonda(p),f.getResultados(),f.getRespuestasRonda(p)]);F=x.data||[],G=R.data||[],Q=[...U],b.set({rondaActual:p,rondaCerrada:m?!1:!!u.rondaCerrada,audicionActual:1,audicionesRonda:g.data||[],resultados:F.filter(l=>Number(l.ronda)===p),respuestasAudicion:G});const d=document.getElementById("select-ronda");d&&(d.value=String(p)),H(b.get()),z(b.get()),r.showToast("✅ Sorteo de canciones guardado correctamente en la nube","success")}catch(i){console.error("Error al guardar sorteo:",i),r.showToast("Error al guardar sorteo: "+i.message,"error")}finally{r.hideLoading()}}})}function we(e){return!e||e.length===0?'<tr><td colspan="5" class="p-4 text-center text-slate-500">No hay sorteo cargado. Pulsa "Generar Nuevo Sorteo Aleatorio".</td></tr>':e.map(t=>{var a;return`
    <tr class="border-b border-slate-800/80 hover:bg-slate-800/40">
      <td class="p-2.5 text-center font-bold text-yellow-400">R${t.ronda}</td>
      <td class="p-2.5 text-center text-slate-300">Aud ${t.audicionNum}</td>
      <td class="p-2.5 font-semibold text-white">${I(t.cancionNombre||`Composición #${t.cancionId}`)}</td>
      <td class="p-2.5 text-center font-mono font-bold text-yellow-300">${I(t.cancionCodigo||"----")}</td>
      <td class="p-2.5 text-center text-slate-400">${((a=v.ROUNDS[t.ronda])==null?void 0:a.duracion)||0}s</td>
    </tr>
  `}).join("")}function He(e){const t=[...e];for(let a=t.length-1;a>0;a--){const o=Math.floor(Math.random()*(a+1));[t[a],t[o]]=[t[o],t[a]]}return t}function Ve(e,t){if(e.length!==t.length)return!1;const a=new Map(e.map(o=>[`${o.ronda}:${o.audicionNum}`,String(o.cancionId)]));return t.every(o=>a.get(`${o.ronda}:${o.audicionNum}`)===String(o.cancionId))}function ie(e){e.innerHTML=`
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
        <span class="text-slate-400">Total canciones en repertorio: <strong class="text-white">${M.length}</strong></span>
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
            ${M.map((t,a)=>`
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
  `,e.querySelector("#btn-add-cancion").addEventListener("click",()=>{const t=e.querySelector("#add-cancion-nombre").value.trim(),a=e.querySelector("#add-cancion-codigo").value.trim(),o=e.querySelector("#add-cancion-drive").value.trim(),s=de(o);if(!t){r.showToast("Ingresa el nombre de la obra","warning");return}const n=M.length>0?Math.max(...M.map(i=>Number(i.id)||0))+1:1;M.push({id:n,nombre:t.toUpperCase(),codigo:a.toUpperCase()||`ST${n.toString().padStart(4,"0")}`,driveId:s,archivoDriveId:s,anio:2026,activa:!0}),ie(e),r.showToast(`Obra "${t}" agregada a la lista`,"info",2e3)}),e.querySelectorAll(".btn-eliminar-cancion").forEach(t=>{t.addEventListener("click",a=>{const o=a.currentTarget.dataset.id;M=M.filter(s=>String(s.id)!==String(o)),ie(e)})}),e.querySelector("#btn-guardar-todas-canciones").addEventListener("click",async()=>{r.showLoading("Guardando lista de canciones en Google Sheets...");try{await f.guardarCanciones(M),b.set({canciones:M}),r.showToast("✅ Lista de canciones guardada exitosamente en la nube","success")}catch(t){r.showToast("Error al guardar canciones: "+t.message,"error")}finally{r.hideLoading()}})}function K(e){e.innerHTML=`
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
  `,e.querySelector("#btn-importar-masivo").addEventListener("click",()=>{const t=e.querySelector("#textarea-alumnos-masivo").value.trim();if(!t){r.showToast("Pega al menos una línea con datos de alumnos","warning");return}const a=e.querySelector("#chk-reemplazar-alumnos").checked,o=t.split(`
`),s=[];let n=a?1:k.length>0?Math.max(...k.map(i=>Number(i.id)||0))+1:1;o.forEach(i=>{const m=i.trim();if(!m)return;const u=m.includes("	")?m.split("	"):m.split(","),p=(u[0]||"").trim(),g=(u[1]||"").trim(),x=(u[2]||"").trim();p&&s.push({id:n++,nombre:p,grado:g||"",nivel:x||"",anio:2026,activo:!0})}),a?k=s:k=[...k,...s],K(e),r.showToast(`Se procesaron ${s.length} participantes`,"success")}),e.querySelector("#btn-vaciar-alumnos").addEventListener("click",()=>{confirm("¿Deseas vaciar la lista temporal de participantes?")&&(k=[],K(e))}),e.querySelectorAll(".btn-eliminar-alumno").forEach(t=>{t.addEventListener("click",a=>{const o=a.currentTarget.dataset.id;k=k.filter(s=>String(s.id)!==String(o)),K(e)})}),e.querySelector("#btn-guardar-alumnos-cloud").addEventListener("click",async()=>{r.showLoading("Guardando participantes en Google Sheets...");try{await f.guardarAlumnosLote(k,!0),b.set({alumnos:k}),z(b.get()),r.showToast("✅ Participantes guardados exitosamente en la nube","success")}catch(t){r.showToast("Error al guardar participantes: "+t.message,"error")}finally{r.hideLoading()}})}function Te(e){const t=P,a=Number(t.TOTAL_RONDAS)||v.TOTAL_RONDAS,o=Array.from({length:a},(s,n)=>n+1);e.innerHTML=`
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
          ${o.map(s=>{const n=ae(s,a),i=v.ROUNDS[s]||{duracion:Math.max(2,Math.round(40/Math.pow(2,s-1))),audiciones:s<=2?4:3,minimoPasar:s===a?3:2},m=Number(t[`DURACION_RONDA_${n}`]??t[`DURACION_RONDA_${s}`]??i.duracion),u=Number(t[`NUM_AUDICIONES_RONDA_${n}`]??t[`NUM_AUDICIONES_RONDA_${s}`]??i.audiciones),p=Number(t[`MINIMO_PASAR_RONDA_${n}`]??t[`MINIMO_PASAR_RONDA_${s}`]??i.minimoPasar);return`
              <div class="bg-slate-900/90 border border-slate-700 p-3 rounded-xl space-y-2">
                <span class="font-bold text-yellow-400 block text-center border-b border-slate-700 pb-1">
                  ${s===a?"Ronda Final":`Ronda ${s}`}
                </span>
                <div>
                  <label class="text-[10px] text-slate-400 block">Duración (seg):</label>
                  <input type="number" id="cfg-dur-${s}" min="1" max="3600" step="1" value="${m}" class="w-full bg-slate-950 border border-slate-700 rounded p-1 text-center font-bold text-white">
                </div>
                <div>
                  <label class="text-[10px] text-slate-400 block">Audiciones:</label>
                  <input type="number" id="cfg-aud-${s}" min="1" max="100" step="1" value="${u}" class="w-full bg-slate-950 border border-slate-700 rounded p-1 text-center font-bold text-white">
                </div>
                <div>
                  <label class="text-[10px] text-slate-400 block">Mínimo clasificar:</label>
                  <input type="number" id="cfg-min-${s}" min="1" max="${u}" step="1" value="${p}" class="w-full bg-slate-950 border border-slate-700 rounded p-1 text-center font-bold text-yellow-300">
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
  `,e.querySelector("#cfg-total-rondas").addEventListener("change",s=>{const n=Number(s.currentTarget.value);if(!Number.isInteger(n)||n<1||n>20){r.showToast("La cantidad de rondas debe ser un entero entre 1 y 20.","warning"),s.currentTarget.value=String(a);return}We(e,a),P.TOTAL_RONDAS=n,Te(e)}),e.querySelector("#btn-guardar-reglas-cloud").addEventListener("click",async()=>{const s=Number(e.querySelector("#cfg-total-rondas").value);if(!Number.isInteger(s)||s<1||s>20){r.showToast("La cantidad de rondas debe ser un entero entre 1 y 20.","warning");return}const n={TOTAL_RONDAS:s,NOMBRE_EVENTO:e.querySelector("#cfg-nombre-evento").value.trim(),HOMENAJEADO:e.querySelector("#cfg-homenajeado").value.trim(),ANIO_CERTAMEN:Number(e.querySelector("#cfg-anio").value),PREMIOS_PRIMER_PUESTO:e.querySelector("#cfg-premio-1").value.trim(),PREMIOS_SEGUNDO_PUESTO:e.querySelector("#cfg-premio-2").value.trim(),PREMIOS_TERCER_PUESTO:e.querySelector("#cfg-premio-3").value.trim()};if(!Number.isInteger(n.ANIO_CERTAMEN)||n.ANIO_CERTAMEN<2e3||n.ANIO_CERTAMEN>2100){r.showToast("El año del certamen debe estar entre 2000 y 2100.","warning");return}for(let p=1;p<=s;p++){const g=Number(e.querySelector(`#cfg-dur-${p}`).value),x=Number(e.querySelector(`#cfg-aud-${p}`).value),R=Number(e.querySelector(`#cfg-min-${p}`).value);if(!Number.isInteger(g)||g<1||g>3600||!Number.isInteger(x)||x<1||x>100||!Number.isInteger(R)||R<1||R>x){r.showToast(`Revisa los valores de la Ronda ${p}: duración 1–3600, audiciones 1–100 y mínimo 1–audiciones.`,"warning",5e3);return}const d=ae(p,s);n[`DURACION_RONDA_${d}`]=g,n[`NUM_AUDICIONES_RONDA_${d}`]=x,n[`MINIMO_PASAR_RONDA_${d}`]=R}const i=s!==v.TOTAL_RONDAS||Object.entries(n).some(([p,g])=>/^(DURACION_RONDA_|NUM_AUDICIONES_RONDA_|MINIMO_PASAR_RONDA_)/.test(p)&&String(P[p]===void 0?"":P[p])!==String(g)),m=F.length>0||G.length>0,u=i&&m;if(!(u&&!window.confirm("Cambiar las reglas reiniciará el sorteo, las respuestas y los resultados guardados de todas las rondas. ¿Continuar?"))){r.showLoading("Actualizando parámetros en Google Sheets...");try{await f.guardarConfigLote(n,u),P={...P,...n},v.syncFromBackend(P),i&&(U=[],Q=[]),u&&(G=[],F=[]);const p=b.get(),g=Number(p.rondaActual)||1,x=u||g>s?1:g;i&&b.set({rondaActual:x,rondaCerrada:!1,audicionActual:1,audicionesRonda:[],resultados:u?[]:(p.resultados||[]).filter(d=>Number(d.ronda)===x),respuestasAudicion:u?[]:[]}),Ze();const R=document.getElementById("select-ronda");R&&(R.value=String(x)),H(b.get()),z(b.get()),r.showToast("✅ Paso 1 guardado. Continúa con canciones y luego realiza el sorteo.","success",4500)}catch(p){r.showToast("Error al actualizar configuración: "+p.message,"error")}finally{r.hideLoading()}}})}function We(e,t){for(let a=1;a<=t;a++){const o=e.querySelector(`#cfg-dur-${a}`),s=e.querySelector(`#cfg-aud-${a}`),n=e.querySelector(`#cfg-min-${a}`),i=ae(a,t);o&&(P[`DURACION_RONDA_${i}`]=Number(o.value)),s&&(P[`NUM_AUDICIONES_RONDA_${i}`]=Number(s.value)),n&&(P[`MINIMO_PASAR_RONDA_${i}`]=Number(n.value))}}function Ze(){const e=document.getElementById("select-ronda");if(!e)return;const t=Number(e.value);e.innerHTML=Object.entries(v.ROUNDS).map(([a,o])=>`<option value="${a}">${I(o.nombre)} - ${o.audiciones} audiciones de ${o.duracion}s (mínimo: ${o.minimoPasar})</option>`).join(""),e.value=String(t<=v.TOTAL_RONDAS?t:1)}async function Ae(){r.init(),r.showLoading("Conectando con el certamen...");try{let e=[],t=[],a=[],o=[],s=[],n=1,i=!1;try{const[R,d,l,c]=await Promise.all([f.getConfig().catch(A=>(console.warn("[APP] No se pudo cargar configuración del backend:",A),{data:{}})),f.getCanciones().catch(()=>({data:[]})),f.getAlumnos().catch(()=>({data:[]})),f.getEstadoCertamen().catch(()=>({data:null}))]);v.syncFromBackend(R.data||{}),e=d.data||[],t=l.data||[],c&&c.data&&(n=c.data.rondaActual||1,i=!!c.data.rondaCerrada),v.ROUNDS[n]||(n=1);const[h,$,y]=await Promise.all([f.getAudicionesRonda(n).catch(()=>({data:[]})),f.getResultados(n).catch(()=>({data:[]})),f.getRespuestasRonda(n).catch(A=>(console.warn("[APP] Backend aún no expone las respuestas por audición:",A),{data:[]}))]);a=h.data||[],o=$.data||[],s=y.data||[]}catch(R){console.warn("[APP] Aviso de red al conectar backend Apps Script:",R),r.showToast("Modo sin conexión o URL de Apps Script pendiente. Cargando vista.","warning",4e3)}b.set({canciones:e,alumnos:t,rondaActual:n,rondaCerrada:i,audicionActual:1,audicionesRonda:a,resultados:o,respuestasAudicion:s,isLoading:!1});const m=r.get("audioPlayer"),u=r.get("timerDisplay"),p=new Pe(m,u,{onComplete:()=>console.log("[PLAYER] Audición finalizada")});ze(p),qe();const g=r.get("selectRonda");g&&(g.innerHTML=Object.entries(v.ROUNDS).map(([R,d])=>`<option value="${R}">${d.nombre} - ${d.audiciones} audiciones de ${d.duracion}s (mínimo: ${d.minimoPasar})</option>`).join(""),g.value=String(n));const x=(v.ROUNDS[n]||{}).duracion||40;oe(x,x),H(b.get()),z(b.get()),console.log("✅ Aplicación inicializada correctamente"),r.showToast("Certamen listo para audición","success",2500)}catch(e){console.error("❌ Error al inicializar:",e),r.showToast("Error al conectar con la base de datos de Google Sheets.","error",5e3)}finally{r.hideLoading()}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Ae):Ae();
