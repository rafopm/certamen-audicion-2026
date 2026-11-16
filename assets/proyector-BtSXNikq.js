import{b as I,C as T,f as d}from"./formatters-CH_PCQn-.js";let b=null,v=null,R=!1;const s=document.getElementById("proj-ronda-nombre"),w=document.getElementById("proj-ronda-detalle"),g=document.getElementById("proj-timer"),x=document.getElementById("proj-live-status"),f=document.getElementById("view-modo-audicion"),u=document.getElementById("view-modo-clasificados"),p=document.getElementById("view-modo-ranking"),y=document.getElementById("proj-clasificados-grid"),$=document.getElementById("proj-clasificados-subtitulo"),E=document.getElementById("proj-podio"),h=document.getElementById("proj-ranking-table");async function j(){console.log("[PROYECTOR] Inicializando pantalla de auditorio..."),C(),setInterval(C,2e3);const e=document.getElementById("btn-fullscreen");e&&e.addEventListener("click",P)}async function C(){try{const e=await I.getEstadoCertamen().catch(()=>null);if(e&&e.data){const t=e.data;B(t);const n=t.modoProyector||"AUDICION";O(n,t),x&&(x.innerHTML='<span class="inline-block w-3 h-3 bg-emerald-500 rounded-full animate-ping mr-2"></span> EN VIVO')}}catch(e){console.warn("[PROYECTOR] Error en sincronización:",e),x&&(x.innerHTML='<span class="inline-block w-3 h-3 bg-amber-500 rounded-full mr-2"></span> CONECTANDO...')}}function O(e,t){v!==e&&(console.log(`[PROYECTOR] Cambiando vista a: ${e}`),v=e),f&&f.classList.add("hidden"),u&&u.classList.add("hidden"),p&&p.classList.add("hidden"),e==="CLASIFICADOS"?(u&&u.classList.remove("hidden"),M(t)):e==="RANKING_FINAL"?(p&&p.classList.remove("hidden"),A(),R||N()):f&&f.classList.remove("hidden")}function B(e){const t=e.rondaActual||1,n=T.ROUNDS[t]||{duracion:40,nombre:`Ronda ${t}`};b!==null&&b!==t&&s&&s.parentElement&&(s.parentElement.classList.add("animate-bounce"),setTimeout(()=>s.parentElement.classList.remove("animate-bounce"),1e3)),b=t,s&&(s.textContent=n.nombre||`Ronda ${t}`),w&&(w.textContent=`${n.duracion}s por audición • Mínimo ${n.minimoPasar||2} aciertos para clasificar`),g&&!g.dataset.running&&(g.textContent=String(n.duracion))}function M(e){if(!y)return;const t=e.rondaActual||1,n=e.clasificadosRonda||{clasificados:[]},a=n.clasificados||[];if($&&($.textContent=`Ronda ${t}: Mínimo requerido de ${n.minimoPasar||2} aciertos`),a.length===0){y.innerHTML=`
      <div class="col-span-full text-center py-8 bg-slate-900/60 rounded-xl border border-slate-800 text-slate-300">
        <p class="text-xl">Calculando resultados de la ronda...</p>
      </div>
    `;return}y.innerHTML=a.map(l=>`
    <div class="bg-gradient-to-b from-slate-900 to-slate-800/90 border border-emerald-500/50 rounded-xl p-4 shadow-xl flex items-center justify-between">
      <div>
        <p class="font-extrabold text-lg text-white font-display">${d(l.nombre)}</p>
        <p class="text-xs text-emerald-300">${l.grado||""}</p>
      </div>
      <div class="bg-emerald-950 border border-emerald-500 text-emerald-300 px-3 py-1.5 rounded-lg font-black text-sm">
        ✓ CLASIFICADO
      </div>
    </div>
  `).join("")}async function A(e){let t=[];try{t=(await I.getRanking()).data||[]}catch{t=[]}if(!t||t.length===0)return;const n=t.slice(0,3),[a,l,r]=n;E&&(E.innerHTML=`
      <div class="flex justify-center items-end gap-6 max-w-4xl mx-auto mb-8">
        <!-- 2do -->
        <div class="flex-1 text-center">
          ${l?`
            <div class="bg-slate-800/80 border-2 border-slate-300 rounded-2xl p-4 shadow-xl">
              <span class="text-3xl">🥈</span>
              <p class="font-extrabold text-xl text-white truncate mt-1">${d(l.nombre)}</p>
              <p class="text-sm text-slate-300">${l.grado||""}</p>
              <p class="text-2xl font-black text-yellow-400 mt-2">${l.puntosTotal||0} pts</p>
              <div class="h-20 bg-slate-700 rounded-lg mt-3 flex items-center justify-center text-slate-300 font-bold text-xl">2° Lugar</div>
            </div>
          `:""}
        </div>

        <!-- 1ro -->
        <div class="flex-1 text-center transform -translate-y-4">
          ${a?`
            <div class="bg-gradient-to-b from-yellow-950/80 to-slate-900 border-4 border-yellow-400 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
              <span class="text-5xl animate-bounce inline-block">👑</span>
              <p class="font-black text-2xl text-yellow-300 truncate mt-1">${d(a.nombre)}</p>
              <p class="text-sm text-yellow-200/80">${a.grado||""}</p>
              <p class="text-4xl font-black text-yellow-400 mt-2">${a.puntosTotal||0} pts</p>
              <div class="h-28 bg-gradient-to-t from-yellow-600 to-yellow-400 text-slate-950 rounded-lg mt-3 flex items-center justify-center font-black text-2xl shadow-lg">🥇 1° Puesto</div>
            </div>
          `:""}
        </div>

        <!-- 3ro -->
        <div class="flex-1 text-center">
          ${r?`
            <div class="bg-slate-800/80 border-2 border-amber-600 rounded-2xl p-4 shadow-xl">
              <span class="text-3xl">🥉</span>
              <p class="font-extrabold text-xl text-white truncate mt-1">${d(r.nombre)}</p>
              <p class="text-sm text-slate-300">${r.grado||""}</p>
              <p class="text-2xl font-black text-yellow-400 mt-2">${r.puntosTotal||0} pts</p>
              <div class="h-16 bg-amber-800 rounded-lg mt-3 flex items-center justify-center text-amber-200 font-bold text-xl">3° Lugar</div>
            </div>
          `:""}
        </div>
      </div>
    `),h&&(h.innerHTML=t.map((o,L)=>{const i=L+1;let c=`${i}°`,m="border-slate-800 bg-slate-900/40";i===1?(c="🥇 1°",m="border-yellow-500/40 bg-yellow-500/10 font-bold"):i===2?(c="🥈 2°",m="border-slate-400/40 bg-slate-400/10"):i===3&&(c="🥉 3°",m="border-amber-600/40 bg-amber-600/10");const k=o.eliminado?`Eliminado en Ronda ${o.rondaEliminacion||1}`:`Clasificado (Ronda ${o.rondaMax||1})`;return`
        <tr class="border-b ${m} text-lg md:text-xl transition-colors">
          <td class="py-3 px-4 text-center font-black">${c}</td>
          <td class="py-3 px-4 font-semibold text-white">${d(o.nombre)}</td>
          <td class="py-3 px-4 text-slate-300">${o.grado||""}</td>
          <td class="py-3 px-4 text-center">
            <span class="px-3 py-1 rounded-full text-xs font-bold ${o.eliminado?"bg-rose-950 text-rose-300":"bg-emerald-950 text-emerald-300"}">
              ${k}
            </span>
          </td>
          <td class="py-3 px-4 text-right font-black text-yellow-400 text-2xl">${o.puntosTotal||0}</td>
        </tr>
      `}).join(""))}function N(){R=!0,window.confetti&&window.confetti({particleCount:180,spread:120,origin:{y:.6}})}function P(){document.fullscreenElement?document.exitFullscreen&&document.exitFullscreen():document.documentElement.requestFullscreen().catch(e=>console.log(e))}document.addEventListener("DOMContentLoaded",j);
