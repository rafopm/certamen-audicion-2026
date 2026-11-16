import{b as m,C as _,f as h}from"./formatters-NJ3LGy62.js";const b=new Map,E=new Map;function j(e){const t=String(e||"").trim();b.forEach((a,n)=>{n!==t&&(URL.revokeObjectURL(a),b.delete(n))})}async function J(e,t){const a=String(e||"").trim();if(!a)throw new Error("No se puede cargar audio sin un ID de archivo");if(typeof t!="function")throw new Error("Se requiere una función para cargar el audio");if(j(a),b.has(a))return b.get(a);if(E.has(a))return E.get(a);const n=(async()=>{const r=await t();if(typeof r!="string"||!r.startsWith("data:audio/"))throw new Error("El servidor no devolvió un audio válido");const i=await fetch(r);if(!i.ok)throw new Error("No se pudo preparar el audio para reproducción");const c=await i.blob();if(c.size===0)throw new Error("El archivo de audio está vacío");const g=URL.createObjectURL(c);return j(a),b.set(a,g),g})();E.set(a,n);try{return await n}finally{E.delete(a)}}function Q(e){return J(e,async()=>{const t=await m.getAudioUrl(e,!0),a=t&&t.data&&t.data.dataUri;return!a||typeof a!="string"?"":a.startsWith("data:video/")||a.startsWith("data:application/octet-stream")||a.startsWith("data:binary/")?a.replace(/^data:[^;]+;base64,/,"data:audio/mpeg;base64,"):a})}typeof window<"u"&&window.addEventListener("pagehide",e=>{e.persisted||(b.forEach(t=>URL.revokeObjectURL(t)),b.clear())});let N=null,M=null,Y=!1,W=!1,s=null,f=null,u=null,L=null,k=[],$=!1;const w=document.getElementById("proj-ronda-nombre"),D=document.getElementById("proj-ronda-detalle"),l=document.getElementById("proj-timer"),R=document.getElementById("proj-live-status"),o=document.getElementById("proj-audio"),B=document.getElementById("proj-audio-status"),y=document.getElementById("btn-audio-activate"),I=document.getElementById("view-modo-audicion"),A=document.getElementById("view-modo-clasificados"),C=document.getElementById("view-modo-ranking"),P=document.getElementById("proj-clasificados-grid"),F=document.getElementById("proj-clasificados-subtitulo"),U=document.getElementById("proj-podio"),z=document.getElementById("proj-ranking-table");async function X(){console.log("[PROYECTOR] Inicializando pantalla de auditorio..."),H(),setInterval(H,2e3);const e=document.getElementById("btn-fullscreen");e&&e.addEventListener("click",de),y&&y.addEventListener("click",()=>{W=!0,y.textContent="🔊 Audio activado",y.disabled=!0,y.classList.add("opacity-60","cursor-default"),q(!0),d("Audio del proyector activado; esperando la audición del jurado.")})}async function H(){try{const e=Date.now(),t=await m.getEstadoCertamen().catch(()=>null);if(t&&t.data){const a=Date.now(),n=t.data;oe(n),Z(n.reproduccionProyector,V(n.reproduccionProyector,e,a));const r=n.modoProyector||"AUDICION";re(r,n),R&&(R.innerHTML='<span class="inline-block w-3 h-3 bg-emerald-500 rounded-full animate-ping mr-2"></span> EN VIVO')}}catch(e){console.warn("[PROYECTOR] Error en sincronización:",e),R&&(R.innerHTML='<span class="inline-block w-3 h-3 bg-amber-500 rounded-full mr-2"></span> CONECTANDO...')}}function Z(e,t=0){if(!e||!e.commandId)return;const a=String(e.commandId);if(e.status==="loading"){s!==a&&(s=a,$=!1,ee(e).catch(n=>{console.error("[PROYECTOR] No se pudo preparar la pista:",n),O(a,n)}));return}a===s&&(e.status==="countdown"&&!u&&!f?G(e,t):(e.status==="cancelled"||e.status==="error"||e.status==="completed")&&(S(),e.status==="cancelled"&&d("Audición detenida desde el panel del jurado."),e.status==="error"&&d(`Error de audio: ${e.error||"no se pudo reproducir la pista."}`),e.status==="completed"&&d("Audición finalizada.")))}async function ee(e){const t=String(e.commandId);d(`⏳ Cargando archivo para la audición ${e.audicionNum}...`);try{const a=await Q(e.fileId);if(s!==t||(await te(a),d("Pista cargada. Activa el audio en esta computadora para continuar."),!await ae()||s!==t))return;const r=await m.getReproduccionProyector();if(!r.data||String(r.data.commandId)!==t||r.data.status!=="loading"){S();return}const i=Number(e.duration),c=Number(o.duration);if(!Number.isFinite(i)||i<1||!Number.isFinite(c)||c<i)throw new Error("La pista no tiene duración suficiente para esta audición.");const g=Number.isFinite(c)&&c>i?Math.floor(c-i):0,x=e.randomStart&&g>0?Math.floor(Math.random()*(g+1)):0,v=Date.now(),p=await m.actualizarReproduccionProyector({commandId:t,status:"countdown",startSec:x});s===t&&p.data&&G(p.data,V(p.data,v,Date.now()))}catch(a){if(s===t)throw a}}function te(e){return new Promise((t,a)=>{if(!o){a(new Error("No se encontró el reproductor de audio del proyector."));return}if(o.readyState>=2&&o.src===e){t();return}const n=setTimeout(()=>{r(),a(new Error("Se agotó el tiempo de espera al cargar el audio."))},3e4),r=()=>{clearTimeout(n),o.removeEventListener("canplay",i),o.removeEventListener("error",c)},i=()=>{r(),t()},c=()=>{r(),a(new Error("El navegador no pudo decodificar el archivo de audio."))};o.addEventListener("canplay",i,{once:!0}),o.addEventListener("error",c,{once:!0}),o.src=e,o.load(),o.readyState>=2&&i()})}function ae(){return W?Promise.resolve(!0):(d("Pista cargada. Haz clic en «Activar audio» en esta computadora."),new Promise(e=>k.push(e)))}function q(e){const t=k;k=[],t.forEach(a=>a(e))}function G(e,t=0){if(u||f)return;const a=String(e.commandId),n=Date.parse(e.startAt);if(!Number.isFinite(n)){O(a,new Error("El servidor devolvió una hora de inicio inválida."));return}l&&(l.dataset.running="true"),u=setInterval(()=>{if(s!==a){clearInterval(u),u=null;return}const r=Math.max(0,Math.ceil((n-Date.now()-t)/1e3));l&&(l.textContent=String(r||Number(e.duration))),d(r>0?`✅ Archivo cargado. La audición inicia en ${r}...`:"🔊 Iniciando reproducción..."),r<=0&&(clearInterval(u),u=null,ne(e,n,t).catch(i=>O(a,i)))},100)}async function ne(e,t,a){const n=String(e.commandId);if(!(s!==n||!o))try{if(o.currentTime=Number(e.startSec)||0,await o.play(),s!==n){o.pause();return}await m.actualizarReproduccionProyector({commandId:n,status:"playing"});const r=t-a+Number(e.duration)*1e3;d("🔊 Reproduciendo audición."),f=setInterval(()=>{const i=Math.max(0,Math.ceil((r-Date.now())/1e3));l&&(l.textContent=String(i)),i<=0&&T(n)},100),o.onended=()=>T(n)}catch(r){throw o.pause(),r}}async function T(e){if(!(s!==e||$)){$=!0,f&&clearInterval(f),f=null,o&&(o.pause(),o.onended=null);try{await m.actualizarReproduccionProyector({commandId:e,status:"completed"}),S(),d("Audición finalizada.")}catch(t){console.error("[PROYECTOR] No se pudo confirmar el fin de la audición:",t),d("Audición finalizada, pero no se pudo actualizar el estado del servidor."),$=!1,L=setTimeout(()=>T(e),3e3)}}}async function O(e,t){if(s===e){console.error("[PROYECTOR] Error de reproducción:",t),S(),d(`⚠️ Error de audio: ${t.message}`);try{await m.actualizarReproduccionProyector({commandId:e,status:"error",error:t.message})}catch(a){console.error("[PROYECTOR] No se pudo notificar el error al panel:",a)}}}function S(){s=null,u&&clearInterval(u),f&&clearInterval(f),L&&clearTimeout(L),u=null,f=null,L=null,q(!1),o&&(o.pause(),o.onended=null,o.removeAttribute("src"),o.load()),l&&delete l.dataset.running}function d(e){B&&(B.textContent=e)}function V(e,t,a){const n=Date.parse(e&&e.serverNow);return Number.isFinite(n)?n-(t+a)/2:0}function re(e,t){M!==e&&(console.log(`[PROYECTOR] Cambiando vista a: ${e}`),M=e),I&&I.classList.add("hidden"),A&&A.classList.add("hidden"),C&&C.classList.add("hidden"),e==="CLASIFICADOS"?(A&&A.classList.remove("hidden"),ie(t)):e==="RANKING_FINAL"?(C&&C.classList.remove("hidden"),ce(),Y||se()):I&&I.classList.remove("hidden")}function oe(e){const t=e.rondaActual||1,a=_.ROUNDS[t]||{duracion:40,nombre:`Ronda ${t}`};N!==null&&N!==t&&w&&w.parentElement&&(w.parentElement.classList.add("animate-bounce"),setTimeout(()=>w.parentElement.classList.remove("animate-bounce"),1e3)),N=t,w&&(w.textContent=a.nombre||`Ronda ${t}`),D&&(D.textContent=`${a.duracion}s por audición • Mínimo ${a.minimoPasar||2} aciertos para clasificar`),l&&!l.dataset.running&&(l.textContent=String(a.duracion))}function ie(e){if(!P)return;const t=e.rondaActual||1,a=e.clasificadosRonda||{clasificados:[]},n=a.clasificados||[];if(F&&(F.textContent=`Ronda ${t}: Mínimo requerido de ${a.minimoPasar||2} aciertos`),n.length===0){P.innerHTML=`
      <div class="col-span-full text-center py-8 bg-slate-900/60 rounded-xl border border-slate-800 text-slate-300">
        <p class="text-xl">Calculando resultados de la ronda...</p>
      </div>
    `;return}P.innerHTML=n.map(r=>`
    <div class="bg-gradient-to-b from-slate-900 to-slate-800/90 border border-emerald-500/50 rounded-xl p-4 shadow-xl flex items-center justify-between">
      <div>
        <p class="font-extrabold text-lg text-white font-display">${h(r.nombre)}</p>
        <p class="text-xs text-emerald-300">${r.grado||""}</p>
      </div>
      <div class="bg-emerald-950 border border-emerald-500 text-emerald-300 px-3 py-1.5 rounded-lg font-black text-sm">
        ✓ CLASIFICADO
      </div>
    </div>
  `).join("")}async function ce(e){let t=[];try{t=(await m.getRanking()).data||[]}catch{t=[]}if(!t||t.length===0)return;const a=t.slice(0,3),[n,r,i]=a;U&&(U.innerHTML=`
      <div class="flex justify-center items-end gap-6 max-w-4xl mx-auto mb-8">
        <!-- 2do -->
        <div class="flex-1 text-center">
          ${r?`
            <div class="bg-slate-800/80 border-2 border-slate-300 rounded-2xl p-4 shadow-xl">
              <span class="text-3xl">🥈</span>
              <p class="font-extrabold text-xl text-white truncate mt-1">${h(r.nombre)}</p>
              <p class="text-sm text-slate-300">${r.grado||""}</p>
              <p class="text-2xl font-black text-yellow-400 mt-2">${r.puntosTotal||0} pts</p>
              <div class="h-20 bg-slate-700 rounded-lg mt-3 flex items-center justify-center text-slate-300 font-bold text-xl">2° Lugar</div>
            </div>
          `:""}
        </div>

        <!-- 1ro -->
        <div class="flex-1 text-center transform -translate-y-4">
          ${n?`
            <div class="bg-gradient-to-b from-yellow-950/80 to-slate-900 border-4 border-yellow-400 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
              <span class="text-5xl animate-bounce inline-block">👑</span>
              <p class="font-black text-2xl text-yellow-300 truncate mt-1">${h(n.nombre)}</p>
              <p class="text-sm text-yellow-200/80">${n.grado||""}</p>
              <p class="text-4xl font-black text-yellow-400 mt-2">${n.puntosTotal||0} pts</p>
              <div class="h-28 bg-gradient-to-t from-yellow-600 to-yellow-400 text-slate-950 rounded-lg mt-3 flex items-center justify-center font-black text-2xl shadow-lg">🥇 1° Puesto</div>
            </div>
          `:""}
        </div>

        <!-- 3ro -->
        <div class="flex-1 text-center">
          ${i?`
            <div class="bg-slate-800/80 border-2 border-amber-600 rounded-2xl p-4 shadow-xl">
              <span class="text-3xl">🥉</span>
              <p class="font-extrabold text-xl text-white truncate mt-1">${h(i.nombre)}</p>
              <p class="text-sm text-slate-300">${i.grado||""}</p>
              <p class="text-2xl font-black text-yellow-400 mt-2">${i.puntosTotal||0} pts</p>
              <div class="h-16 bg-amber-800 rounded-lg mt-3 flex items-center justify-center text-amber-200 font-bold text-xl">3° Lugar</div>
            </div>
          `:""}
        </div>
      </div>
    `),z&&(z.innerHTML=t.map((c,g)=>{const x=g+1;let v=`${x}°`,p="border-slate-800 bg-slate-900/40";x===1?(v="🥇 1°",p="border-yellow-500/40 bg-yellow-500/10 font-bold"):x===2?(v="🥈 2°",p="border-slate-400/40 bg-slate-400/10"):x===3&&(v="🥉 3°",p="border-amber-600/40 bg-amber-600/10");const K=c.eliminado?`Eliminado en Ronda ${c.rondaEliminacion||1}`:`Clasificado (Ronda ${c.rondaMax||1})`;return`
        <tr class="border-b ${p} text-lg md:text-xl transition-colors">
          <td class="py-3 px-4 text-center font-black">${v}</td>
          <td class="py-3 px-4 font-semibold text-white">${h(c.nombre)}</td>
          <td class="py-3 px-4 text-slate-300">${c.grado||""}</td>
          <td class="py-3 px-4 text-center">
            <span class="px-3 py-1 rounded-full text-xs font-bold ${c.eliminado?"bg-rose-950 text-rose-300":"bg-emerald-950 text-emerald-300"}">
              ${K}
            </span>
          </td>
          <td class="py-3 px-4 text-right font-black text-yellow-400 text-2xl">${c.puntosTotal||0}</td>
        </tr>
      `}).join(""))}function se(){Y=!0,window.confetti&&window.confetti({particleCount:180,spread:120,origin:{y:.6}})}function de(){document.fullscreenElement?document.exitFullscreen&&document.exitFullscreen():document.documentElement.requestFullscreen().catch(e=>console.log(e))}document.addEventListener("DOMContentLoaded",X);
