import{C as S,f as G,a as be,b as x}from"./formatters-BdfdXB5n.js";class pe{constructor(){this.state={rondaActual:1,audicionActual:0,alumnos:[],canciones:[],configRonda:null,resultados:{},isLoading:!1,error:null},this.listeners=[]}get(){return{...this.state}}set(t){this.state={...this.state,...t},this.notify()}subscribe(t){return this.listeners.push(t),()=>{this.listeners=this.listeners.filter(a=>a!==t)}}notify(){this.listeners.forEach(t=>t(this.state))}}const p=new pe;class ge{constructor(t,a={}){this.display=t,this.onTick=a.onTick||(()=>{}),this.onComplete=a.onComplete||(()=>{}),this.intervalId=null,this.timeLeft=0}start(t){this.stop(),this.timeLeft=t,this._updateDisplay(),this.intervalId=setInterval(()=>{this.timeLeft--,this._updateDisplay(),this.onTick(this.timeLeft),this.timeLeft<=0&&(this.stop(),this.onComplete())},1e3)}stop(){this.intervalId&&(clearInterval(this.intervalId),this.intervalId=null)}reset(){this.stop(),this.timeLeft=0,this._updateDisplay()}_updateDisplay(){this.display&&(this.display.textContent=this.timeLeft)}}class xe{constructor(t,a,o={}){this.audio=t,this.timerDisplay=a,this.onComplete=o.onComplete||(()=>{}),this.onError=o.onError||(()=>{}),this.timer=new ge(a,{onComplete:()=>this.stop()}),this.playbackInfo={startSec:0,endSec:0,duration:0},this._setupAudioEvents()}_setupAudioEvents(){this.audio.addEventListener("error",()=>{const t=this.audio.error,a=t?`Error ${t.code}: ${t.message||"Error de audio"}`:"Error al cargar el audio";this.onError(a)})}async play(t,a,o={}){return new Promise((s,r)=>{this.audio.pause(),this.audio.currentTime=0;let l=!1;const u=()=>{this.audio.removeEventListener("canplay",w),this.audio.removeEventListener("error",c),this.audio.removeEventListener("loadedmetadata",C)},m=()=>{const f=this.audio.duration;if(o.customStart!==void 0&&o.customStart!==null)return Math.max(0,Number(o.customStart)||0);if(o.randomStart&&isFinite(f)&&f>a){const d=Math.max(0,Math.floor(f-a));return Math.floor(Math.random()*(d+1))}return 0},g=()=>{if(l)return;l=!0,u();const f=m(),d=f+a;this.playbackInfo={startSec:f,endSec:d,duration:a};try{f>0&&(this.audio.currentTime=f)}catch(i){console.warn("[PLAYER] Aviso al posicionar segundo de inicio:",i)}this.audio.play().then(()=>{this.timer.start(a),s(this.playbackInfo)}).catch(i=>{this.onError("Error al iniciar reproducción: "+i.message),r(i)})},w=()=>{g()},C=()=>{this.audio.readyState>=2&&g()},c=()=>{if(l)return;l=!0,u();const f=this.audio.error,d=f?`Error (${f.code}) al cargar audio`:"Error de reproducción";this.onError(d),r(new Error(d))};this.audio.addEventListener("loadedmetadata",C),this.audio.addEventListener("canplay",w),this.audio.addEventListener("error",c),this.audio.src=t,this.audio.load(),this.audio.readyState>=3&&g()})}stop(){try{this.audio.pause()}catch{}this.timer.stop(),this.onComplete()}pause(){this.audio.pause()}resume(){this.audio.play()}}const n={elements:{},init(){return this._ensureFeedbackElements(),this.elements={selectRonda:document.getElementById("select-ronda"),audicionNumero:document.getElementById("audicion-numero"),audioPlayer:document.getElementById("audio-player"),timerDisplay:document.getElementById("timer-display"),btnPlay:document.getElementById("btn-play"),listaAlumnos:document.getElementById("lista-alumnos"),btnGuardarAciertos:document.getElementById("btn-guardar-aciertos"),btnFinalizarRonda:document.getElementById("btn-finalizar-ronda"),btnResetRonda:document.getElementById("btn-reset-ronda"),btnVerRanking:document.getElementById("btn-ver-ranking"),rankingSection:document.getElementById("ranking-section"),rankingContent:document.getElementById("ranking-content"),loadingOverlay:document.getElementById("loading-overlay"),toast:document.getElementById("toast")},this.elements},_ensureFeedbackElements(){if(!document.getElementById("loading-overlay")){const e=document.createElement("div");e.id="loading-overlay",e.className="fixed inset-0 bg-black/75 z-50 flex flex-col items-center justify-center transition-opacity duration-300 hidden",e.innerHTML=`
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400 mb-4"></div>
        <p id="loading-text" class="text-white text-xl font-semibold tracking-wide">Cargando...</p>
      `,document.body.appendChild(e)}if(!document.getElementById("toast")){const e=document.createElement("div");e.id="toast",e.className="fixed bottom-5 right-5 z-50 max-w-md px-6 py-4 rounded-xl shadow-2xl text-white font-medium transform transition-all duration-300 translate-y-20 opacity-0 pointer-events-none flex items-center space-x-3",document.body.appendChild(e)}},get(e){return this.elements[e]||(this.elements[e]=document.getElementById(e)),this.elements[e]},showLoading(e="Procesando..."){const t=this.get("loadingOverlay");if(t){const a=document.getElementById("loading-text");a&&(a.textContent=e),t.classList.remove("hidden"),setTimeout(()=>t.classList.remove("opacity-0"),10)}},hideLoading(){const e=this.get("loadingOverlay");e&&(e.classList.add("opacity-0"),setTimeout(()=>e.classList.add("hidden"),250))},showToast(e,t="info",a=3500){const o=this.get("toast");if(!o)return;const s={success:"bg-emerald-600 border border-emerald-400",error:"bg-rose-600 border border-rose-400",warning:"bg-amber-600 border border-amber-400",info:"bg-blue-600 border border-blue-400"},r={success:"✓",error:"✕",warning:"⚠",info:"ℹ"};o.className=`fixed bottom-5 right-5 z-50 max-w-md px-6 py-4 rounded-xl shadow-2xl text-white font-medium transform transition-all duration-300 flex items-center space-x-3 ${s[t]||s.info}`,o.innerHTML=`
      <span class="text-2xl font-bold">${r[t]||"ℹ"}</span>
      <span class="flex-1">${e}</span>
    `,o.classList.remove("translate-y-20","opacity-0","pointer-events-none"),o.classList.add("translate-y-0","opacity-100"),this._toastTimer&&clearTimeout(this._toastTimer),this._toastTimer=setTimeout(()=>{o.classList.add("translate-y-20","opacity-0","pointer-events-none"),o.classList.remove("translate-y-0","opacity-100")},a)}};function K(e){if(!e||typeof e!="string")return"";const t=e.trim();if(t.startsWith("[")&&t.endsWith("]")||t.toLowerCase()==="file_id"||t==="")return"";const a=t.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);if(a&&a[1])return a[1];const o=t.match(/[?&]id=([a-zA-Z0-9_-]+)/);if(o&&o[1])return o[1];const s=t.match(/\/d\/([a-zA-Z0-9_-]+)/);return s&&s[1]?s[1]:(/^[a-zA-Z0-9_-]{20,60}$/.test(t),t)}function fe(e,t=5){const a=Number(e);return Number.isInteger(a)&&a>=1&&a<=t}function he(e){const t=K(e);return t?/^[a-zA-Z0-9_-]{20,60}$/.test(t):!1}function P(e){return e==null?"":String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function M(e,t){let a=[],o=[],s=1,r=4,l=1;if(e&&Array.isArray(e.alumnos))a=e.alumnos||[],o=Array.isArray(e.resultados)?e.resultados:Object.values(e.resultados||{}),s=e.rondaActual||1,l=e.audicionActual||1,r=(S.ROUNDS[s]||{audiciones:4}).audiciones;else{a=Array.isArray(e)?e:[],o=Array.isArray(t)?t:[];const c=n.get("selectRonda");c&&(s=parseInt(c.value,10)||1);const f=n.get("audicionNumero");f&&(l=parseInt(f.textContent,10)||1),r=(S.ROUNDS[s]||{audiciones:4}).audiciones}const u=n.get("listaAlumnos");if(!u)return;if(a.length===0){u.innerHTML=`
      <div class="col-span-full text-center py-8 text-blue-200">
        <p class="text-lg">No hay alumnos registrados o activos para este certamen.</p>
      </div>
    `;return}const m={},g={};o.forEach(c=>{if(parseInt(c.ronda,10)===s&&(m[String(c.alumnoId)]=c),c.eliminado){const f=c.rondaEliminacion||c.ronda;(!g[String(c.alumnoId)]||f<g[String(c.alumnoId)])&&(g[String(c.alumnoId)]=f)}});const C=(S.ROUNDS[s]||{minimoPasar:2}).minimoPasar;u.innerHTML=a.map(c=>{const f=m[String(c.id)],d=f?parseInt(f.aciertos,10):0,i=c.rondaEliminacion||g[String(c.id)],b=i&&i<s,y=f?f.eliminado:!1,v=G(c.nombre);let h="bg-blue-900/60 text-blue-200 border border-blue-400/30",R="En competencia";b?(h="bg-rose-950 text-rose-300 border border-rose-800",R=`❌ Eliminado en Ronda ${i}`):y?(h="bg-red-900/80 text-red-200 border border-red-500",R=`Eliminado en Ronda ${s}`):d>=C&&(h="bg-emerald-900/80 text-emerald-200 border border-emerald-500",R=`Clasificado (${d}/${r})`);let I="";for(let N=1;N<=r;N++){const L=N<=d,$=N===l;I+=`
        <label class="flex flex-col items-center justify-center cursor-pointer p-1.5 rounded-lg border transition select-none ${$?"bg-yellow-500/20 border-yellow-400 shadow-md ring-1 ring-yellow-400":"bg-blue-950/60 hover:bg-blue-900 border-blue-700/50"}">
          <span class="text-xs ${$?"text-yellow-300 font-extrabold":"text-slate-300"} mb-1">Aud ${N}</span>
          <input 
            type="checkbox" 
            class="checkbox-acierto w-5 h-5 text-yellow-500 bg-blue-900 rounded border-gray-400 focus:ring-yellow-400 focus:ring-2 cursor-pointer"
            data-alumno-id="${c.id}"
            data-audicion="${N}"
            ${L?"checked":""}
            ${b?"disabled":""}
          />
        </label>
      `}return`
      <div class="alumno-card bg-slate-800/90 border border-slate-700 rounded-xl p-4 shadow-md transition hover:border-yellow-500/50 ${b?"opacity-40 bg-slate-950 cursor-not-allowed":""}" data-alumno-card="${c.id}">
        <div class="flex items-start justify-between mb-2">
          <div>
            <h3 class="font-bold text-base md:text-lg text-white">${P(v)}</h3>
            <p class="text-xs text-slate-300">${P(c.grado||"")} ${P(c.nivel||"")}</p>
          </div>
          <span class="text-xs px-2.5 py-1 rounded-full font-medium ${h}">
            ${R}
          </span>
        </div>

        <!-- Checkboxes de audiciones -->
        <div class="mt-2">
          <div class="text-xs text-slate-400 mb-1.5 flex justify-between items-center">
            <span>Aciertos Ronda ${s}:</span>
            <span class="font-bold text-yellow-400"><span id="aciertos-count-${c.id}">${d}</span> / ${r}</span>
          </div>
          <div class="grid grid-cols-${Math.min(r,4)} gap-1.5">
            ${I}
          </div>
        </div>

        <!-- Entrada rápida de respuesta de pizarra para el jurado -->
        ${b?"":`
          <div class="mt-3 pt-2 border-t border-slate-700/60 flex items-center gap-2">
            <span class="text-xs text-slate-400 whitespace-nowrap">✏️ Pizarra:</span>
            <input 
              type="text" 
              placeholder="Código escrito (ej: TP2380)"
              class="input-pizarra-alumno bg-slate-950 text-yellow-300 border border-slate-700 uppercase font-mono text-xs px-2.5 py-1 rounded-lg w-full focus:ring-1 focus:ring-yellow-400 focus:outline-none"
              data-alumno-id="${c.id}"
              data-audicion="${l}"
            />
          </div>
        `}
      </div>
    `}).join("")}function j(e,t){let a=[],o=1,s=1;if(e&&e.rondaActual!==void 0)o=e.rondaActual,a=e.audicionesRonda||e.audiciones||[],s=e.audicionActual||1;else{a=Array.isArray(e)?e:[],o=1;const c=n.get("audicionNumero");c&&(s=parseInt(c.textContent,10)||1)}const r=n.get("audicionNumero");r&&(r.textContent=String(s));const l=a.find(c=>c.audicionNum===s)||a[s-1],u=document.getElementById("admin-cancion-nombre"),m=document.getElementById("admin-cancion-codigo"),g=document.getElementById("admin-seg-duracion"),w=S.ROUNDS[o]||{duracion:40,audiciones:4};u&&(u.textContent=l?l.cancionNombre||`Composición #${l.cancionId}`:"Composición no asignada"),m&&(m.textContent=l&&l.cancionCodigo||"----"),g&&(g.textContent=String(w.duracion||40));const C=document.getElementById("ronda-info-detalles");C&&(C.innerHTML=`
      <div class="flex flex-wrap items-center justify-between text-xs md:text-sm bg-blue-950/70 p-3 rounded-lg border border-blue-700/60 mt-3 gap-2">
        <span>⏱ <strong>Duración:</strong> ${w.duracion||40}s por audición</span>
        <span>🎯 <strong>Mínimo para clasificar:</strong> ${w.minimoPasar||2} aciertos</span>
        <span>🎼 <strong>Total audiciones:</strong> ${w.audiciones||4}</span>
      </div>
    `)}function Q(e){const t=n.get("rankingContent");if(!t)return;if(!e||e.length===0){t.innerHTML=`
      <div class="text-center py-6 text-slate-300">
        <p>Aún no hay puntajes registrados en el certamen.</p>
      </div>
    `;return}const a=e.slice(0,3),o=ye(a),s=e.map((r,l)=>{const u=l+1;let m=`<span class="font-bold text-slate-300">${be(u)}</span>`,g="hover:bg-slate-700/50";u===1?(m='<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500 text-slate-950 font-black shadow-lg">🥇 1°</span>',g="bg-yellow-500/10 hover:bg-yellow-500/20 border-l-4 border-yellow-500"):u===2?(m='<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-300 text-slate-950 font-black shadow-lg">🥈 2°</span>',g="bg-slate-300/10 hover:bg-slate-300/20 border-l-4 border-slate-300"):u===3&&(m='<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-700 text-amber-100 font-black shadow-lg">🥉 3°</span>',g="bg-amber-700/10 hover:bg-amber-700/20 border-l-4 border-amber-600");const w=r.eliminado?`Eliminado en Ronda ${r.rondaEliminacion||1}`:`Activo (Ronda ${r.rondaMax||1})`;return`
      <tr class="border-b border-slate-700/60 ${g} transition-colors">
        <td class="p-3 text-center">${m}</td>
        <td class="p-3 font-semibold text-white">
          ${P(G(r.nombre))}
          ${r.premio?`<span class="block text-xs text-yellow-400 font-normal">🎁 ${r.premio}</span>`:""}
        </td>
        <td class="p-3 text-slate-300 text-sm">${P(r.grado||"")} ${P(r.nivel||"")}</td>
        <td class="p-3 text-center">
          <span class="inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${r.eliminado?"bg-rose-950 text-rose-300 border border-rose-800":"bg-emerald-950 text-emerald-300 border border-emerald-800"}">
            ${w}
          </span>
        </td>
        <td class="p-3 text-right font-bold text-yellow-400 text-lg">
          ${r.puntosTotal||0}
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
  `}function ye(e){if(!e||e.length===0)return"";const[t,a,o]=e;return`
    <div class="podium-container flex justify-center items-end gap-3 md:gap-6 my-8 px-2 max-w-2xl mx-auto">
      
      <!-- 2do Puesto -->
      <div class="flex-1 text-center order-1 transform transition hover:-translate-y-1">
        ${a?`
          <div class="bg-slate-800/90 border-2 border-slate-300 rounded-t-2xl p-4 shadow-xl flex flex-col items-center">
            <div class="w-12 h-12 rounded-full bg-slate-300 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg mb-2">
              🥈
            </div>
            <p class="font-bold text-white text-sm md:text-base line-clamp-1">${P(G(a.nombre))}</p>
            <p class="text-xs text-slate-300 mb-2">${P(a.grado||"")}</p>
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
            <p class="font-extrabold text-yellow-300 text-base md:text-lg line-clamp-1">${P(G(t.nombre))}</p>
            <p class="text-xs text-yellow-200/80 mb-2">${P(t.grado||"")}</p>
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
            <p class="font-bold text-white text-sm md:text-base line-clamp-1">${P(G(o.nombre))}</p>
            <p class="text-xs text-slate-300 mb-2">${P(o.grado||"")}</p>
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
  `}function Z(e,t=40){const a=n.get("timerDisplay");a&&(a.textContent=e,e<=3&&e>0?a.className="text-7xl md:text-8xl font-black text-red-500 mb-4 animate-ping":e<=5&&e>0?a.className="text-7xl md:text-8xl font-black text-red-400 mb-4 animate-pulse":e<=10&&e>0?a.className="text-7xl md:text-8xl font-bold text-amber-400 mb-4":a.className="text-7xl md:text-8xl font-bold text-yellow-400 mb-4")}let F=!1,A=1,J=null,B=null,T={startSec:0,endSec:40,duration:40};const X={};function ve(e){return!e||typeof e!="string"?"":e.startsWith("data:video/")||e.startsWith("data:application/octet-stream")||e.startsWith("data:binary/")?e.replace(/^data:[^;]+;base64,/,"data:audio/mpeg;base64,"):e}function we(e){n.init();const t=n.get("btnPlay");t&&t.addEventListener("click",async()=>{if(F){te(e,!1),e.stop(),ne();return}const d=p.get(),i=d.rondaActual||1,b=S.ROUNDS[i]||{duracion:40};let y=d.audicionesRonda||[];if(!y||y.length===0){n.showLoading("Obteniendo audición configurada...");try{y=(await x.getAudicionesRonda(i)).data||[],p.set({audicionesRonda:y})}catch($){console.warn("[AUDIO] No se pudieron cargar audiciones desde backend:",$)}finally{n.hideLoading()}}const v=y.find($=>$.audicionNum===A)||y[A-1]||{};B=v;const h=v.driveId||v.archivoDriveId||null,R=K(h),I=b.duracion,N=document.getElementById("chk-random-start"),L=N?N.checked:!0;ae(!0);try{let $=!1;if(J=new Date,h&&(h.startsWith("http://")||h.startsWith("https://")||h.startsWith("/"))&&!h.includes("drive.google.com"))try{console.log(`[AUDIO] Reproduciendo URL directa: ${h}`),T=await se(e,h,I,{randomStart:L})||{startSec:0,endSec:I,duration},U(T.startSec,T.endSec),$=!0}catch(E){console.warn("[AUDIO] Falló URL directa personalizada:",E)}if(!$&&he(R)){let E=X[R];if(!E){n.showLoading("Cargando pista de audio desde Google Drive...");try{const k=await x.getAudioUrl(R,!0);k&&k.data&&k.data.dataUri&&(E=ve(k.data.dataUri),X[R]=E)}catch(k){console.warn("[AUDIO] Error al consultar API de audio:",k)}finally{n.hideLoading()}}if(E)try{T=await se(e,E,I,{randomStart:L})||{startSec:0,endSec:I,duration},U(T.startSec,T.endSec),$=!0}catch(k){console.warn("[AUDIO] Error al reproducir Data URI:",k)}}if(!$){const E=L?Math.floor(Math.random()*40):0,k=E+I;T={startSec:E,endSec:k,duration},U(E,k),n.showToast(`Audición ${A}: ${R?"Reproduciendo sonido de prueba":"Archivo no asignado"} (de ${E}s a ${k}s).`,"info",3500),re(e,I)}F=!0,oe(!0)}catch($){console.error("[AUDIO ERROR GENERAL]",$);const E=L?Math.floor(Math.random()*30):0;T={startSec:E,endSec:E+I,duration},U(E,E+I),re(e,I),F=!0,oe()}finally{ae(!1)}});const a=e.onComplete;if(e.onComplete=()=>{te(e,!0),ne(),n.showToast(`Audición ${A} finalizada y registrada`,"info",2500);const d=p.get(),i=S.ROUNDS[d.rondaActual]||{audiciones:4};A<i.audiciones&&(A++,V(A)),a&&a()},e.timer){const d=e.timer.onTick;e.timer.onTick=i=>{const b=p.get(),y=S.ROUNDS[b.rondaActual]||{duracion:40};Z(i,y.duracion),d&&d(i)}}const o=document.getElementById("btn-prev-audicion"),s=document.getElementById("btn-next-audicion");o&&o.addEventListener("click",()=>{A>1&&(A--,V(A))}),s&&s.addEventListener("click",()=>{const d=p.get(),i=S.ROUNDS[d.rondaActual]||{audiciones:4};A<i.audiciones&&(A++,V(A))});const r={AUDICION:document.getElementById("btn-modo-audicion"),CLASIFICADOS:document.getElementById("btn-modo-clasificados"),RANKING_FINAL:document.getElementById("btn-modo-ranking")};Object.entries(r).forEach(([d,i])=>{i&&i.addEventListener("click",async()=>{ee(d,r),n.showToast(`Proyector configurado en: ${d}`,"info",2e3);try{await x.actualizarModoProyector(d)}catch(b){console.warn("Error al sincronizar modo proyector:",b)}})});const l=n.get("selectRonda");l&&l.addEventListener("change",async d=>{const i=parseInt(d.target.value,10);if(!fe(i)){n.showToast("Ronda inválida","error");return}n.showLoading(`Cargando Ronda ${i}...`);try{A=1,x.actualizarRondaActual(i).catch(R=>console.warn("Aviso backend ronda:",R));const[b,y,v]=await Promise.all([x.getAudicionesRonda(i).catch(()=>({data:[]})),x.getResultados(i).catch(()=>({data:[]})),x.getAlumnos().catch(()=>({data:[]}))]);p.set({rondaActual:i,audicionActual:1,audicionesRonda:b.data||[],resultados:y.data||[],alumnos:v.data||[]}),j(p.get()),M(p.get());const h=S.ROUNDS[i]||{duracion:40};Z(h.duracion,h.duracion),U(0,h.duracion),n.showToast(`Secuencia: Ronda ${i} activada`,"success")}catch(b){console.error("Error al cambiar ronda:",b),n.showToast("Error al cambiar de ronda: "+b.message,"error")}finally{n.hideLoading()}});const u=n.get("listaAlumnos");u&&(u.addEventListener("input",d=>{if(d.target&&d.target.classList.contains("input-pizarra-alumno")){const i=d.target.dataset.alumnoId,b=d.target.value.trim().toUpperCase(),v=p.get().audicionesRonda||[],h=v.find($=>$.audicionNum===A)||v[A-1]||{},R=(h.cancionCodigo||"").toUpperCase(),I=(h.cancionNombre||"").toUpperCase(),N=document.querySelector(`[data-alumno-card="${i}"]`);if(!N)return;const L=N.querySelector(`.checkbox-acierto[data-audicion="${A}"]`);R&&(b===R||b.length>=3&&I.includes(b))?(d.target.classList.remove("border-slate-700","border-rose-500"),d.target.classList.add("border-emerald-400","bg-emerald-950/60"),L&&!L.checked&&(L.checked=!0,W(N,i))):b===""?(d.target.classList.remove("border-emerald-400","bg-emerald-950/60","border-rose-500"),d.target.classList.add("border-slate-700")):(d.target.classList.remove("border-emerald-400","bg-emerald-950/60"),d.target.classList.add("border-slate-700"))}}),u.addEventListener("change",d=>{if(d.target&&d.target.classList.contains("checkbox-acierto")){const i=d.target.dataset.alumnoId,b=document.querySelector(`[data-alumno-card="${i}"]`);b&&W(b,i)}}));const m=document.getElementById("btn-marcar-todos");m&&m.addEventListener("click",()=>{const d=document.querySelectorAll("[data-alumno-card]:not(.opacity-40)");let i=0;d.forEach(b=>{const y=b.querySelector(`.checkbox-acierto[data-audicion="${A}"]`);if(y&&!y.disabled){y.checked=!0;const v=b.getAttribute("data-alumno-card");W(b,v),i++}}),n.showToast(`Acierto marcado para ${i} alumnos en Audición ${A}`,"info",2e3)});const g=n.get("btnGuardarAciertos");g&&g.addEventListener("click",async()=>{const i=p.get().rondaActual||1,b=document.querySelectorAll("[data-alumno-card]"),y={};b.forEach(v=>{const h=v.getAttribute("data-alumno-card"),R=v.querySelectorAll(".checkbox-acierto:checked").length;y[h]=R}),n.showLoading("Guardando aciertos en Google Sheets...");try{await x.guardarAciertosLote({ronda:i,aciertos:y});const v=await x.getResultados(i);p.set({resultados:v.data||[]}),M(p.get()),n.showToast("✅ Aciertos guardados exitosamente en la nube","success")}catch(v){console.error("Error al guardar aciertos:",v),n.showToast("❌ Error al guardar aciertos: "+v.message,"error")}finally{n.hideLoading()}});const w=n.get("btnFinalizarRonda");w&&w.addEventListener("click",async()=>{const i=p.get().rondaActual||1,b=S.ROUNDS[i]||{minimoPasar:2};if(window.confirm(`¿Desea FINALIZAR la Ronda ${i}?

• Mínimo exigido: ${b.minimoPasar} aciertos
• Los alumnos con menos de ${b.minimoPasar} aciertos quedarán marcados como ELIMINADOS EN RONDA ${i}.
• El proyector pasará automáticamente al modo CLASIFICADOS.

¿Continuar?`)){n.showLoading("Finalizando ronda y calculando clasificación...");try{const h=(await x.finalizarRonda(i)).data||{};n.showToast(`Ronda ${i} Finalizada: ${h.pasanCount||0} clasifican, ${h.eliminadosCount||0} eliminados`,"success",5e3);const[R,I,N]=await Promise.all([x.getResultados(i),x.getRanking(),x.getAlumnos()]);p.set({resultados:R.data||[],ranking:I.data||[],alumnos:N.data||[]}),M(p.get()),ee(i===5?"RANKING_FINAL":"CLASIFICADOS",r);const L=n.get("rankingSection");if(L&&!L.classList.contains("hidden")&&Q(I.data||[]),h.siguienteRonda&&h.siguienteRonda!==i&&h.siguienteRonda<=5&&window.confirm(`¿Desea avanzar a la Ronda ${h.siguienteRonda}?`)){const E=n.get("selectRonda");E&&(E.value=String(h.siguienteRonda),E.dispatchEvent(new Event("change")))}}catch(v){console.error("Error al finalizar ronda:",v),n.showToast("Error al finalizar ronda: "+v.message,"error")}finally{n.hideLoading()}}});const C=n.get("btnResetRonda");C&&C.addEventListener("click",async()=>{const i=p.get().rondaActual||1;if(window.confirm(`⚠️ ATENCIÓN: ¿Está seguro de RESETEAR la Ronda ${i}?

Esta acción borrará todos los aciertos registrados para esta ronda en Google Sheets.`)){n.showLoading(`Reseteando datos de la Ronda ${i}...`);try{await x.resetRonda(i);const[y,v]=await Promise.all([x.getResultados(i),x.getAlumnos()]);p.set({resultados:y.data||[],alumnos:v.data||[]}),M(p.get()),n.showToast(`Ronda ${i} ha sido reseteada correctamente`,"warning")}catch(y){console.error("Error al resetear ronda:",y),n.showToast("Error al resetear ronda: "+y.message,"error")}finally{n.hideLoading()}}});const c=n.get("btnVerRanking"),f=n.get("rankingSection");c&&f&&c.addEventListener("click",async()=>{if(f.classList.contains("hidden")){n.showLoading("Calculando tabla de posiciones y ranking...");try{const b=(await x.getRanking()).data||[];p.set({ranking:b}),Q(b),f.classList.remove("hidden"),c.textContent="✕ Ocultar Ranking",c.classList.replace("bg-purple-700","bg-purple-900"),f.scrollIntoView({behavior:"smooth"})}catch(i){console.error("Error al obtener ranking:",i),n.showToast("Error al obtener ranking: "+i.message,"error")}finally{n.hideLoading()}}else f.classList.add("hidden"),c.textContent="🏆 Ver Ranking",c.classList.replace("bg-purple-900","bg-purple-700")})}function V(e){p.set({audicionActual:e}),j(p.get()),M(p.get());const t=p.get(),a=S.ROUNDS[t.rondaActual]||{duracion:40};U(0,a.duracion)}function U(e,t){const a=document.getElementById("badge-rango-reproduccion");a&&(a.textContent=`📍 Rango: de ${e}s a ${t}s`)}function W(e,t){const a=e.querySelectorAll(".checkbox-acierto:checked").length,o=document.getElementById(`aciertos-count-${t}`);o&&(o.textContent=a);const s=p.get(),r=S.ROUNDS[s.rondaActual]||{minimoPasar:2},l=e.querySelector("span.rounded-full");l&&!l.textContent.includes("Eliminado")&&(a>=r.minimoPasar?(l.className="text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-900/80 text-emerald-200 border border-emerald-500",l.textContent=`Clasificado (${a})`):(l.className="text-xs px-2.5 py-1 rounded-full font-medium bg-blue-900/60 text-blue-200 border border-blue-400/30",l.textContent="En competencia"))}function ee(e,t){Object.entries(t).forEach(([a,o])=>{o&&(a===e?o.className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition border border-yellow-500 bg-yellow-500 text-slate-950 cursor-pointer shadow":o.className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition border border-slate-700 bg-slate-800 text-slate-300 hover:text-white cursor-pointer")})}function te(e,t){if(!J||!B)return;const o=p.get().rondaActual||1,s=S.ROUNDS[o]||{duracion:40},r=T&&T.startSec!==void 0?T.startSec:0;let l=T&&T.endSec!==void 0?T.endSec:r+s.duracion;if(!t&&e.timer&&e.timer.timeLeft!==void 0){const m=s.duracion-e.timer.timeLeft;l=r+Math.max(1,m)}const u=Math.max(1,l-r);x.registrarReproduccion({ronda:o,audicionNum:A,cancionId:B.cancionId||"",cancionNombre:B.cancionNombre||"",cancionCodigo:B.cancionCodigo||"",segundoInicio:r,segundoFin:l,duracion:u}).then(m=>{console.log("[AUDITORIA] Registrado en Google Sheets:",m.data);const g=document.getElementById("admin-log-status");g&&m.data&&(g.innerHTML=`✅ Registrado en Google Sheets: de ${r}s a ${l}s (${u}s) a las ${m.data.fechaHora.split(" ")[1]}`)}).catch(m=>{console.warn("[AUDITORIA ERROR]",m)}),J=null}function ae(e){const t=n.get("btnPlay");t&&e&&(t.disabled=!0,t.textContent="⏳ Cargando audio...",t.className="bg-yellow-600 text-white text-xl md:text-2xl px-10 py-4 rounded-xl shadow-lg cursor-not-allowed opacity-80")}function oe(e){const t=n.get("btnPlay");t&&(t.disabled=!1,t.textContent="⏹ DETENER AUDICIÓN",t.className="bg-red-600 hover:bg-red-700 text-white text-xl md:text-2xl font-black px-10 py-4 rounded-xl shadow-xl transition animate-pulse cursor-pointer",document.body.classList.add("is-playing"))}function ne(){F=!1,document.body.classList.remove("is-playing");const e=n.get("btnPlay");e&&(e.disabled=!1,e.textContent="▶ REPRODUCIR AUDICIÓN",e.className="bg-emerald-600 hover:bg-emerald-500 text-white text-xl md:text-2xl font-black px-10 py-4 rounded-xl shadow-xl transition transform active:scale-95 inline-flex items-center space-x-3 cursor-pointer")}async function se(e,t,a,o={}){return new Promise((s,r)=>{const l=setTimeout(()=>{r(new Error("Tiempo de espera agotado al reproducir fuente de audio"))},8e3);e.play(t,a,o).then(u=>{clearTimeout(l),s(u)}).catch(u=>{clearTimeout(l),r(u)})})}function re(e,t){try{const a=window.AudioContext||window.webkitAudioContext;if(!a)throw new Error("No Web Audio API");const o=new a,s=[293.66,369.99,440],r=[];s.forEach(l=>{const u=o.createOscillator(),m=o.createGain();u.type="triangle",u.frequency.setValueAtTime(l,o.currentTime),m.gain.setValueAtTime(.001,o.currentTime),m.gain.exponentialRampToValueAtTime(.15,o.currentTime+.1),m.gain.exponentialRampToValueAtTime(.001,o.currentTime+t),u.connect(m),m.connect(o.destination),u.start(),r.push(u)}),e.timer.start(t),setTimeout(()=>{try{r.forEach(l=>l.stop()),o.close()}catch{}},t*1e3)}catch{e.timer.start(t)}}let _=null,ce="sorteo",O=[],z=[],D=[],q={};function Ee(){ue();const e=document.getElementById("btn-abrir-config");e&&e.addEventListener("click",Ae)}function ue(){if(document.getElementById("modal-configuracion"))return;const e=document.createElement("div");e.id="modal-configuracion",e.className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 transition-opacity duration-300 hidden opacity-0",e.innerHTML=`
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
        <button class="tab-btn px-4 py-3 border-b-2 border-yellow-400 text-yellow-300 flex items-center space-x-2 whitespace-nowrap cursor-pointer" data-tab="sorteo">
          <span>🎲</span>
          <span>Sorteo de Canciones</span>
        </button>
        <button class="tab-btn px-4 py-3 border-b-2 border-transparent text-slate-400 hover:text-white flex items-center space-x-2 whitespace-nowrap cursor-pointer" data-tab="canciones">
          <span>🎵</span>
          <span>Canciones</span>
        </button>
        <button class="tab-btn px-4 py-3 border-b-2 border-transparent text-slate-400 hover:text-white flex items-center space-x-2 whitespace-nowrap cursor-pointer" data-tab="participantes">
          <span>👥</span>
          <span>Participantes (Carga Masiva)</span>
        </button>
        <button class="tab-btn px-4 py-3 border-b-2 border-transparent text-slate-400 hover:text-white flex items-center space-x-2 whitespace-nowrap cursor-pointer" data-tab="rondas">
          <span>⏱</span>
          <span>Rondas y Reglas</span>
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
  `,document.body.appendChild(e),_=e,e.querySelector("#btn-cerrar-config").addEventListener("click",ie),e.querySelector("#btn-cerrar-config-footer").addEventListener("click",ie),e.querySelectorAll(".tab-btn").forEach(t=>{t.addEventListener("click",a=>{const o=a.currentTarget.dataset.tab;Re(o)})})}async function Ae(){_||ue(),n.showLoading("Cargando configuraciones...");try{const[e,t,a,o]=await Promise.all([x.getConfig().catch(()=>({data:{}})),x.getCanciones().catch(()=>({data:[]})),x.getAlumnos().catch(()=>({data:[]})),x.getAudicionesRonda(1).catch(()=>({data:[]}))]);q=e.data||{},O=t.data||[],D=a.data||[];const s=[];for(let r=1;r<=5;r++)try{((await x.getAudicionesRonda(r)).data||[]).forEach(u=>s.push(u))}catch{}z=s,_.classList.remove("hidden"),setTimeout(()=>_.classList.remove("opacity-0"),10),me()}catch(e){console.error("Error al abrir configuración:",e),n.showToast("Error al cargar datos de configuración","error")}finally{n.hideLoading()}}function ie(){_&&(_.classList.add("opacity-0"),setTimeout(()=>_.classList.add("hidden"),250))}function Re(e){ce=e,_.querySelectorAll(".tab-btn").forEach(t=>{t.dataset.tab===e?t.className="tab-btn px-4 py-3 border-b-2 border-yellow-400 text-yellow-300 flex items-center space-x-2 whitespace-nowrap cursor-pointer":t.className="tab-btn px-4 py-3 border-b-2 border-transparent text-slate-400 hover:text-white flex items-center space-x-2 whitespace-nowrap cursor-pointer"}),me()}function me(){const e=document.getElementById("config-tab-content");if(e)switch(ce){case"sorteo":Se(e);break;case"canciones":Y(e);break;case"participantes":H(e);break;case"rondas":Ie(e);break}}function Se(e){const t=O.filter(a=>a.activa!==!1);e.innerHTML=`
    <div class="space-y-4">
      <div class="bg-blue-950/60 border border-blue-800 p-4 rounded-xl">
        <h3 class="font-bold text-base text-yellow-300 flex items-center gap-2">
          <span>🎲</span> Sorteo Aleatorio de Repertorio por Rondas
        </h3>
        <p class="text-xs text-slate-300 mt-1">
          Distribuye al azar las canciones disponibles en cada una de las 5 rondas, garantizando que no se repitan dentro de la misma ronda. Puedes pulsar el botón tantas veces como quieras para ver diferentes combinaciones y guardar la definitiva.
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
        <span>Total audiciones programadas: <strong class="text-white">${z.length||17}</strong></span>
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
            ${le(z)}
          </tbody>
        </table>
      </div>
    </div>
  `,e.querySelector("#btn-generar-sorteo").addEventListener("click",()=>{if(t.length===0){n.showToast("No hay canciones activas para sortear","error");return}const a=q,o=[];let s=1;for(let r=1;r<=5;r++){const l=r===5?"FINAL":String(r),u=a[`NUM_AUDICIONES_RONDA_${l}`]||(r<=2?4:3),m=[...t].sort(()=>Math.random()-.5);for(let g=1;g<=u;g++){const w=m[(g-1)%m.length];o.push({ronda:r,audicionNum:g,cancionId:w.id,cancionNombre:w.nombre,cancionCodigo:w.codigo,orden:s++})}}z=o,document.getElementById("sorteo-preview-body").innerHTML=le(o),n.showToast("¡Nuevo sorteo aleatorio generado con éxito!","success",2500)}),e.querySelector("#btn-guardar-sorteo").addEventListener("click",async()=>{if(z.length===0){n.showToast("Genera un sorteo antes de guardar","warning");return}n.showLoading("Guardando orden de audiciones en Google Sheets...");try{await x.guardarAudicionesRonda(z);const o=p.get().rondaActual||1,s=await x.getAudicionesRonda(o);p.set({audicionesRonda:s.data||[]}),j(p.get()),n.showToast("✅ Sorteo de canciones guardado correctamente en la nube","success")}catch(a){console.error("Error al guardar sorteo:",a),n.showToast("Error al guardar sorteo: "+a.message,"error")}finally{n.hideLoading()}})}function le(e){if(!e||e.length===0)return'<tr><td colspan="5" class="p-4 text-center text-slate-500">No hay sorteo cargado. Pulsa "Generar Nuevo Sorteo Aleatorio".</td></tr>';const t={1:"40s",2:"20s",3:"10s",4:"5s",5:"2s"};return e.map((a,o)=>`
    <tr class="border-b border-slate-800/80 hover:bg-slate-800/40">
      <td class="p-2.5 text-center font-bold text-yellow-400">R${a.ronda}</td>
      <td class="p-2.5 text-center text-slate-300">Aud ${a.audicionNum}</td>
      <td class="p-2.5 font-semibold text-white">${a.cancionNombre||`Composición #${a.cancionId}`}</td>
      <td class="p-2.5 text-center font-mono font-bold text-yellow-300">${a.cancionCodigo||"----"}</td>
      <td class="p-2.5 text-center text-slate-400">${t[a.ronda]||"40s"}</td>
    </tr>
  `).join("")}function Y(e){e.innerHTML=`
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
        <span class="text-slate-400">Total canciones en repertorio: <strong class="text-white">${O.length}</strong></span>
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
            ${O.map((t,a)=>`
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
  `,e.querySelector("#btn-add-cancion").addEventListener("click",()=>{const t=e.querySelector("#add-cancion-nombre").value.trim(),a=e.querySelector("#add-cancion-codigo").value.trim(),o=e.querySelector("#add-cancion-drive").value.trim(),s=K(o);if(!t){n.showToast("Ingresa el nombre de la obra","warning");return}const r=O.length>0?Math.max(...O.map(l=>Number(l.id)||0))+1:1;O.push({id:r,nombre:t.toUpperCase(),codigo:a.toUpperCase()||`ST${r.toString().padStart(4,"0")}`,driveId:s,archivoDriveId:s,anio:2026,activa:!0}),Y(e),n.showToast(`Obra "${t}" agregada a la lista`,"info",2e3)}),e.querySelectorAll(".btn-eliminar-cancion").forEach(t=>{t.addEventListener("click",a=>{const o=a.currentTarget.dataset.id;O=O.filter(s=>String(s.id)!==String(o)),Y(e)})}),e.querySelector("#btn-guardar-todas-canciones").addEventListener("click",async()=>{n.showLoading("Guardando lista de canciones en Google Sheets...");try{await x.guardarCanciones(O),p.set({canciones:O}),n.showToast("✅ Lista de canciones guardada exitosamente en la nube","success")}catch(t){n.showToast("Error al guardar canciones: "+t.message,"error")}finally{n.hideLoading()}})}function H(e){e.innerHTML=`
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
        <span class="text-slate-400">Total participantes registrados: <strong class="text-white">${D.length}</strong></span>
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
            ${D.map((t,a)=>`
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
  `,e.querySelector("#btn-importar-masivo").addEventListener("click",()=>{const t=e.querySelector("#textarea-alumnos-masivo").value.trim();if(!t){n.showToast("Pega al menos una línea con datos de alumnos","warning");return}const a=e.querySelector("#chk-reemplazar-alumnos").checked,o=t.split(`
`),s=[];let r=a?1:D.length>0?Math.max(...D.map(l=>Number(l.id)||0))+1:1;o.forEach(l=>{const u=l.trim();if(!u)return;const m=u.includes("	")?u.split("	"):u.split(","),g=(m[0]||"").trim(),w=(m[1]||"").trim(),C=(m[2]||"").trim();g&&s.push({id:r++,nombre:g,grado:w||"",nivel:C||"",anio:2026,activo:!0})}),a?D=s:D=[...D,...s],H(e),n.showToast(`Se procesaron ${s.length} participantes`,"success")}),e.querySelector("#btn-vaciar-alumnos").addEventListener("click",()=>{confirm("¿Deseas vaciar la lista temporal de participantes?")&&(D=[],H(e))}),e.querySelectorAll(".btn-eliminar-alumno").forEach(t=>{t.addEventListener("click",a=>{const o=a.currentTarget.dataset.id;D=D.filter(s=>String(s.id)!==String(o)),H(e)})}),e.querySelector("#btn-guardar-alumnos-cloud").addEventListener("click",async()=>{n.showLoading("Guardando participantes en Google Sheets...");try{await x.guardarAlumnosLote(D,!0),p.set({alumnos:D}),M(p.get()),n.showToast("✅ Participantes guardados exitosamente en la nube","success")}catch(t){n.showToast("Error al guardar participantes: "+t.message,"error")}finally{n.hideLoading()}})}function Ie(e){const t=q;e.innerHTML=`
    <div class="space-y-4">
      
      <!-- Datos Generales del Evento -->
      <div class="bg-blue-950/60 border border-blue-800 p-4 rounded-xl">
        <h3 class="font-bold text-sm text-yellow-300 mb-3">🏛 Datos Oficiales del Evento</h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="block text-xs text-slate-300 mb-1">Nombre Oficial del Evento:</label>
            <input type="text" id="cfg-nombre-evento" value="${t.NOMBRE_EVENTO||"Certamen Audición Musical 2026"}" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white">
          </div>
          <div>
            <label class="block text-xs text-slate-300 mb-1">Compositor Homenajeado:</label>
            <input type="text" id="cfg-homenajeado" value="${t.HOMENAJEADO||"Johann Strauss"}" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white">
          </div>
          <div>
            <label class="block text-xs text-slate-300 mb-1">Año del Certamen:</label>
            <input type="number" id="cfg-anio" value="${t.ANIO_CERTAMEN||2026}" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white">
          </div>
        </div>
      </div>

      <!-- Configuración de las 5 Rondas -->
      <div class="bg-blue-950/60 border border-blue-800 p-4 rounded-xl">
        <h3 class="font-bold text-sm text-yellow-300 mb-2">⏱ Configuración de Parámetros por Ronda</h3>
        <p class="text-xs text-slate-400 mb-3">Define la duración en segundos, cantidad de audiciones y mínimo de aciertos para clasificar en cada fase.</p>

        <div class="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          ${[1,2,3,4,5].map(a=>{const o=a===5?"FINAL":String(a),s=t[`DURACION_RONDA_${o}`]||(a===1?40:a===2?20:a===3?10:a===4?5:2),r=t[`NUM_AUDICIONES_RONDA_${o}`]||(a<=2?4:3),l=t[`MINIMO_PASAR_RONDA_${o}`]||(a===5?3:2);return`
              <div class="bg-slate-900/90 border border-slate-700 p-3 rounded-xl space-y-2">
                <span class="font-bold text-yellow-400 block text-center border-b border-slate-700 pb-1">
                  ${a===5?"Ronda Final":`Ronda ${a}`}
                </span>
                <div>
                  <label class="text-[10px] text-slate-400 block">Duración (seg):</label>
                  <input type="number" id="cfg-dur-${a}" value="${s}" class="w-full bg-slate-950 border border-slate-700 rounded p-1 text-center font-bold text-white">
                </div>
                <div>
                  <label class="text-[10px] text-slate-400 block">Audiciones:</label>
                  <input type="number" id="cfg-aud-${a}" value="${r}" class="w-full bg-slate-950 border border-slate-700 rounded p-1 text-center font-bold text-white">
                </div>
                <div>
                  <label class="text-[10px] text-slate-400 block">Mínimo clasificar:</label>
                  <input type="number" id="cfg-min-${a}" value="${l}" class="w-full bg-slate-950 border border-slate-700 rounded p-1 text-center font-bold text-yellow-300">
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
            <input type="text" id="cfg-premio-1" value="${t.PREMIOS_PRIMER_PUESTO||"Diploma, medalla y premio sorpresa"}" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white">
          </div>
          <div>
            <label class="block text-slate-400 mb-1">🥈 Segundo Puesto:</label>
            <input type="text" id="cfg-premio-2" value="${t.PREMIOS_SEGUNDO_PUESTO||"Diploma, medalla y premio sorpresa"}" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white">
          </div>
          <div>
            <label class="block text-slate-400 mb-1">🥉 Tercer Puesto:</label>
            <input type="text" id="cfg-premio-3" value="${t.PREMIOS_TERCER_PUESTO||"Diploma y medalla"}" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white">
          </div>
        </div>
      </div>

      <div class="flex justify-end pt-2">
        <button id="btn-guardar-reglas-cloud" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg transition flex items-center space-x-2 cursor-pointer text-xs">
          <span>💾</span>
          <span>Guardar Configuración en Google Sheets</span>
        </button>
      </div>

    </div>
  `,e.querySelector("#btn-guardar-reglas-cloud").addEventListener("click",async()=>{const a={NOMBRE_EVENTO:e.querySelector("#cfg-nombre-evento").value.trim(),HOMENAJEADO:e.querySelector("#cfg-homenajeado").value.trim(),ANIO_CERTAMEN:parseInt(e.querySelector("#cfg-anio").value,10)||2026,PREMIOS_PRIMER_PUESTO:e.querySelector("#cfg-premio-1").value.trim(),PREMIOS_SEGUNDO_PUESTO:e.querySelector("#cfg-premio-2").value.trim(),PREMIOS_TERCER_PUESTO:e.querySelector("#cfg-premio-3").value.trim()};[1,2,3,4,5].forEach(o=>{const s=o===5?"FINAL":String(o);a[`DURACION_RONDA_${s}`]=parseInt(e.querySelector(`#cfg-dur-${o}`).value,10),a[`NUM_AUDICIONES_RONDA_${s}`]=parseInt(e.querySelector(`#cfg-aud-${o}`).value,10),a[`MINIMO_PASAR_RONDA_${s}`]=parseInt(e.querySelector(`#cfg-min-${o}`).value,10),S.ROUNDS[o]&&(S.ROUNDS[o].duracion=a[`DURACION_RONDA_${s}`],S.ROUNDS[o].audiciones=a[`NUM_AUDICIONES_RONDA_${s}`],S.ROUNDS[o].minimoPasar=a[`MINIMO_PASAR_RONDA_${s}`])}),n.showLoading("Actualizando parámetros en Google Sheets...");try{await x.guardarConfigLote(a),q={...q,...a},j(p.get()),M(p.get()),n.showToast("✅ Parámetros de rondas actualizados exitosamente en Google Sheets","success")}catch(o){n.showToast("Error al actualizar configuración: "+o.message,"error")}finally{n.hideLoading()}})}async function de(){n.init(),n.showLoading("Conectando con el certamen...");try{let e=[],t=[],a=[],o=[],s=1;try{const[w,C,c]=await Promise.all([x.getCanciones().catch(()=>({data:[]})),x.getAlumnos().catch(()=>({data:[]})),x.getEstadoCertamen().catch(()=>({data:null}))]);if(e=w.data||[],t=C.data||[],c&&c.data)s=c.data.rondaActual||1,a=c.data.audicionesRonda||[],o=c.data.resultadosRonda||[];else{const[f,d]=await Promise.all([x.getAudicionesRonda(s).catch(()=>({data:[]})),x.getResultados(s).catch(()=>({data:[]}))]);a=f.data||[],o=d.data||[]}}catch(w){console.warn("[APP] Aviso de red al conectar backend Apps Script:",w),n.showToast("Modo sin conexión o URL de Apps Script pendiente. Cargando vista.","warning",4e3)}p.set({canciones:e,alumnos:t,rondaActual:s,audicionesRonda:a,resultados:o,isLoading:!1});const r=n.get("audioPlayer"),l=n.get("timerDisplay"),u=new xe(r,l,{onComplete:()=>console.log("[PLAYER] Audición finalizada")});we(u),Ee();const m=n.get("selectRonda");m&&(m.value=String(s));const g=(S.ROUNDS[s]||{}).duracion||40;Z(g,g),j(p.get()),M(p.get()),console.log("✅ Aplicación inicializada correctamente"),n.showToast("Certamen listo para audición","success",2500)}catch(e){console.error("❌ Error al inicializar:",e),n.showToast("Error al conectar con la base de datos de Google Sheets.","error",5e3)}finally{n.hideLoading()}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",de):de();
