/* ═══════════════════════════════════════════════════════════════
 * English Mastery — Enhancement Layer
 * Adds: localStorage progress · dark mode · multi-accept fill-ins
 *       · wrong-answer review · best-score banner · cross-trilha dashboard
 * ═══════════════════════════════════════════════════════════════ */
(function() {
  'use strict';

  // ─── Detect current trilha from filename ─────────────────────
  const TRILHA_ID = (() => {
    const path = location.pathname.toLowerCase();
    const m = path.match(/(0[0-6])_([a-z0-9]+)_/);
    if (!m) return null;
    const code = m[2].toUpperCase();
    if (['A1','A2','B1','B2','C1','C2'].includes(code)) return code;
    if (path.includes('prea1')) return 'PreA1';
    return null;
  })();

  const STORAGE_KEY_PREFIX = 'em_progress_';
  const GLOBAL_KEY = 'em_global';
  const THEME_KEY = 'em_theme';
  const REVIEW_KEY = 'em_review_mode';

  // ─── Progress storage helpers ────────────────────────────────
  function getProgress(id) {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY_PREFIX + id) || '{}'); }
    catch(e) { return {}; }
  }
  function saveProgress(id, data) {
    try { localStorage.setItem(STORAGE_KEY_PREFIX + id, JSON.stringify(data)); }
    catch(e) {}
    // Mirror to global
    try {
      const g = JSON.parse(localStorage.getItem(GLOBAL_KEY) || '{}');
      g[id] = data;
      localStorage.setItem(GLOBAL_KEY, JSON.stringify(g));
    } catch(e) {}
  }
  function getAllProgress() {
    try { return JSON.parse(localStorage.getItem(GLOBAL_KEY) || '{}'); }
    catch(e) { return {}; }
  }

  // ─── DARK MODE ───────────────────────────────────────────────
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-em-theme', theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch(e) {}
  }
  // Apply on load (before paint)
  const savedTheme = (function() { try { return localStorage.getItem(THEME_KEY) || 'light'; } catch(e) { return 'light'; } })();
  applyTheme(savedTheme);

  function buildThemeToggle() {
    const btn = document.createElement('button');
    btn.className = 'em-theme-toggle';
    btn.setAttribute('aria-label', 'Alternar tema');
    btn.title = 'Alternar tema (claro/escuro)';
    btn.innerHTML = '<span class="em-icon-sun">☀</span><span class="em-icon-moon">☾</span>';
    btn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-em-theme') || 'light';
      applyTheme(cur === 'light' ? 'dark' : 'light');
    });
    return btn;
  }

  function buildSearchButton() {
    const btn = document.createElement('a');
    btn.className = 'em-search-toggle';
    btn.setAttribute('aria-label', 'Buscar');
    btn.title = 'Buscar (cross-trilha)';
    btn.href = 'search.html';
    btn.innerHTML = '⌕';
    return btn;
  }

  // ─── BEST SCORE BANNER ───────────────────────────────────────
  function buildBestScoreBanner() {
    if (!TRILHA_ID) return null;
    const data = getProgress(TRILHA_ID);
    if (!data.bestScore || data.bestScore === 0) return null;
    const banner = document.createElement('div');
    banner.className = 'em-best-banner';
    banner.innerHTML = `
      <span class="em-best-icon">★</span>
      <span class="em-best-text">Seu melhor: <strong>${data.bestScore}/${data.total || '?'}</strong> · ${data.visits || 1} visita(s) · última: ${formatRelative(data.lastVisit)}</span>
      <button class="em-best-reset" title="Resetar progresso desta trilha">↺</button>
    `;
    banner.querySelector('.em-best-reset').addEventListener('click', () => {
      if (confirm('Resetar progresso desta trilha?')) {
        try { localStorage.removeItem(STORAGE_KEY_PREFIX + TRILHA_ID); } catch(e) {}
        try {
          const g = JSON.parse(localStorage.getItem(GLOBAL_KEY) || '{}');
          delete g[TRILHA_ID];
          localStorage.setItem(GLOBAL_KEY, JSON.stringify(g));
        } catch(e) {}
        location.reload();
      }
    });
    return banner;
  }

  function formatRelative(iso) {
    if (!iso) return '—';
    const now = Date.now();
    const then = new Date(iso).getTime();
    const diff = now - then;
    const min = 60*1000, hr = 60*min, day = 24*hr;
    if (diff < min) return 'agora';
    if (diff < hr) return `${Math.floor(diff/min)} min atrás`;
    if (diff < day) return `${Math.floor(diff/hr)} h atrás`;
    if (diff < 7*day) return `${Math.floor(diff/day)} dia(s) atrás`;
    return new Date(iso).toLocaleDateString('pt-BR');
  }

  // ─── PROGRESS AUTO-SAVE (poll the score widget) ──────────────
  function startProgressTracking() {
    if (!TRILHA_ID) return;
    let lastSavedScore = 0;
    const tick = () => {
      const scoreEl = document.getElementById('scoreNum');
      const totalEl = document.getElementById('scoreTotal');
      if (!scoreEl) return;
      const s = parseInt(scoreEl.textContent, 10) || 0;
      const t = parseInt((totalEl||{}).textContent, 10) || 0;
      if (s > lastSavedScore && t > 0) {
        const prev = getProgress(TRILHA_ID);
        const newData = {
          bestScore: Math.max(prev.bestScore || 0, s),
          total: t,
          lastVisit: new Date().toISOString(),
          visits: (prev.visits || 0) + (lastSavedScore === 0 ? 1 : 0)
        };
        saveProgress(TRILHA_ID, newData);
        lastSavedScore = s;
      }
    };
    setInterval(tick, 3000);
    // Save once on page unload too
    window.addEventListener('beforeunload', tick);
  }

  // ─── MULTI-ACCEPT FILL-INS ───────────────────────────────────
  // Patches window.checkFillIns to support `data-answer="X|Y|Z"` accepting any.
  function patchMultiAccept() {
    const tryPatch = () => {
      if (typeof window.checkFillIns !== 'function') return false;
      window.checkFillIns = function(exId) {
        const ex = document.querySelector('[data-ex="' + exId + '"]');
        if (!ex) return;
        ex.querySelectorAll('.fill-input').forEach(input => {
          if (input.dataset.checked) return;
          const acceptedRaw = input.dataset.answer || '';
          const accepted = acceptedRaw.split('|').map(s =>
            s.toLowerCase().trim().replace(/[.,!?;:'"]/g, '')
          );
          const got = (input.value || '').toLowerCase().trim().replace(/[.,!?;:'"]/g, '');
          const q = input.closest('.q');
          const fb = q ? q.querySelector('.feedback') : null;
          const isMatch = accepted.includes(got);
          if (isMatch) {
            input.classList.add('correct');
            if (typeof window.score !== 'undefined') window.score++;
            if (fb && typeof window.showFeedback === 'function') {
              window.showFeedback(fb, true, q.dataset.q);
            }
          } else {
            input.classList.add('wrong');
            if (fb && typeof window.showFeedback === 'function') {
              window.showFeedback(fb, false, q.dataset.q, acceptedRaw.split('|')[0]);
            }
          }
          input.dataset.checked = 'true';
        });
        if (typeof window.updateScore === 'function') window.updateScore();
      };
      return true;
    };
    // checkFillIns may be defined inline at end of body. Try multiple times.
    if (!tryPatch()) {
      let tries = 0;
      const iv = setInterval(() => {
        if (tryPatch() || ++tries > 50) clearInterval(iv);
      }, 100);
    }
  }

  // ─── WRONG-ANSWER REVIEW MODE ────────────────────────────────
  function buildReviewButton() {
    const btn = document.createElement('button');
    btn.className = 'em-review-btn';
    btn.innerHTML = '↻ revisar erros';
    btn.title = 'Pular pra próxima questão errada';
    btn.addEventListener('click', () => {
      const wrongs = Array.from(document.querySelectorAll(
        '.q .opt.wrong:not(.em-reviewed), .q .fill-input.wrong:not(.em-reviewed), .q .word-clickable.wrong:not(.em-reviewed)'
      ));
      if (wrongs.length === 0) {
        alert('Nenhum erro pendente pra revisar 🎉\nResete a página pra fazer de novo (F5).');
        return;
      }
      const target = wrongs[0];
      target.classList.add('em-reviewed');
      const q = target.closest('.q');
      if (q) q.scrollIntoView({behavior: 'smooth', block: 'center'});
    });
    return btn;
  }

  // ─── CROSS-TRILHA DASHBOARD (inject if landing) ──────────────
  function isLandingPage() {
    const path = location.pathname.toLowerCase();
    return /english-mastery\/?(index\.html)?$/.test(path);
  }
  function buildDashboard() {
    if (!isLandingPage()) return null;
    const all = getAllProgress();
    const trilhas = ['A1','A2','B1','B2','C1','C2'];
    const labels = { A1:'Foundations', A2:'Elementary', B1:'Intermediate', B2:'Upper Int.', C1:'Advanced', C2:'Mastery' };
    const colors = { A1:'#ff5722', A2:'#06b6d4', B1:'#fb7185', B2:'#fbbf24', C1:'#d4af37', C2:'#ec4899' };
    const hasAny = trilhas.some(t => all[t] && all[t].bestScore > 0);
    if (!hasAny) return null;
    const root = document.createElement('section');
    root.className = 'em-dashboard';
    let html = `
      <div class="em-dash-label">★ SEU PROGRESSO</div>
      <h2 class="em-dash-title">Você já trilhou parte do <em>caminho</em>.</h2>
      <p class="em-dash-intro">Progresso salvo localmente no seu browser. Continue de onde parou.</p>
      <div class="em-dash-grid">
    `;
    trilhas.forEach(t => {
      const d = all[t] || {};
      const pct = d.total ? Math.round((d.bestScore / d.total) * 100) : 0;
      html += `
        <a href="0${trilhaIdx(t)}_${t}_Trilha.html" class="em-dash-card" style="--em-c:${colors[t]}">
          <div class="em-dash-code">${t}</div>
          <div class="em-dash-name">${labels[t]}</div>
          <div class="em-dash-bar"><div class="em-dash-fill" style="width:${pct}%"></div></div>
          <div class="em-dash-meta">${d.bestScore || 0}/${d.total || '—'} · ${pct}% · ${d.visits || 0} visitas</div>
        </a>
      `;
    });
    html += `
      </div>
      <button class="em-dash-reset">Resetar TODO o progresso</button>
    `;
    root.innerHTML = html;
    root.querySelector('.em-dash-reset').addEventListener('click', () => {
      if (!confirm('Apagar TODO o progresso de TODAS as trilhas? Essa ação não pode ser desfeita.')) return;
      try {
        localStorage.removeItem(GLOBAL_KEY);
        trilhas.forEach(t => localStorage.removeItem(STORAGE_KEY_PREFIX + t));
      } catch(e) {}
      location.reload();
    });
    return root;
  }
  function trilhaIdx(code) {
    return ({A1:'1',A2:'2',B1:'3',B2:'4',C1:'5',C2:'6'})[code] || '0';
  }

  // ─── DOM-READY HOOKUP ────────────────────────────────────────
  function init() {
    // Theme toggle + search button (always, top-right)
    document.body.appendChild(buildThemeToggle());
    if (!location.pathname.includes('search.html')) {
      document.body.appendChild(buildSearchButton());
    }

    // Best-score banner (only on trilha pages with prior data)
    if (TRILHA_ID) {
      const banner = buildBestScoreBanner();
      const main = document.querySelector('main');
      if (banner && main) main.insertBefore(banner, main.firstChild);
    }

    // Review button on score widget
    const scoreDisplay = document.querySelector('.score-display');
    if (scoreDisplay) scoreDisplay.appendChild(buildReviewButton());

    // Dashboard (landing only)
    const dash = buildDashboard();
    if (dash) {
      const levels = document.querySelector('.levels');
      if (levels && levels.parentNode) levels.parentNode.insertBefore(dash, levels);
    }

    // Multi-accept patch
    patchMultiAccept();

    // Progress tracking
    startProgressTracking();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
