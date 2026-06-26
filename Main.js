// ── STATE ─────────────────────────────────────────────────────────────────
//
// Persisted to localStorage as 'levelupcode_v1'.
// Shape: { completed: number[], xp: number, streak: { count: number, lastDate: string|null } }

function loadState() {
  try {
    const raw = localStorage.getItem('levelupcode_v1');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { completed: [], xp: 0, streak: { count: 0, lastDate: null } };
}

function saveState(s) {
  try {
    localStorage.setItem('levelupcode_v1', JSON.stringify(s));
  } catch (e) {}
}

let state = loadState();

// ── RANK ──────────────────────────────────────────────────────────────────

function getRank(xp) {
  let rank = RANKS[0];
  for (const r of RANKS) {
    if (xp >= r.xp) rank = r;
  }
  return rank.name;
}

// ── NODE STATUS ───────────────────────────────────────────────────────────

// Returns 'completed' | 'available' | 'locked'
function nodeStatus(levelId) {
  if (state.completed.includes(levelId)) return 'completed';
  if (levelId === 1 || state.completed.includes(levelId - 1)) return 'available';
  return 'locked';
}

// ── HUD ───────────────────────────────────────────────────────────────────

function updateHUD() {
  document.getElementById('hud-xp').textContent = state.xp;

  const streak = state.streak;
  const sBadge = document.getElementById('streak-badge');
  const sNum   = document.getElementById('hud-streak');

  if (streak.count === 0) {
    sBadge.classList.add('inactive');
    sNum.textContent = 'Start!';
    sBadge.setAttribute('aria-label', 'Start a streak by completing a level today');
  } else {
    sBadge.classList.remove('inactive');
    sNum.textContent = streak.count;
    sBadge.setAttribute('aria-label', streak.count + ' day streak');
  }

  document.getElementById('rank-pill').textContent = getRank(state.xp);
}

// ── PATH ──────────────────────────────────────────────────────────────────

function buildPath() {
  const wrap = document.getElementById('path-wrap');
  wrap.innerHTML = '';

  LEVELS.forEach((lvl, idx) => {
    const status = nodeStatus(lvl.id);
    const isLast = idx === LEVELS.length - 1;

    // Segment wrapper (handles the zigzag offset via CSS nth-child)
    const seg = document.createElement('div');
    seg.className = 'path-segment';
    seg.setAttribute('role', 'listitem');

    if (status === 'locked') {
      // Locked nodes are divs (not focusable)
      const node = document.createElement('div');
      node.className = `level-node locked${lvl.boss ? ' boss' : ''}`;
      node.setAttribute('aria-label', `Level ${lvl.id}: ${lvl.title} — locked`);
      node.innerHTML = `
        <span class="lock-icon" aria-hidden="true">🔒</span>
        <span class="node-label">${lvl.shortTitle}</span>
      `;
      seg.appendChild(node);
    } else {
      // Available / completed nodes are buttons (keyboard accessible)
      const node = document.createElement('button');
      node.className = `level-node ${status}${lvl.boss ? ' boss' : ''}`;
      node.setAttribute('aria-label', `Level ${lvl.id}: ${lvl.title} — ${status}`);

      if (status === 'completed') {
        node.innerHTML = `
          <span class="check-icon" aria-hidden="true">✓</span>
          <span class="node-label">${lvl.shortTitle}</span>
        `;
      } else {
        node.innerHTML = `
          <span class="node-num" aria-hidden="true">${lvl.id}</span>
          <span class="node-label">${lvl.shortTitle}</span>
        `;
      }

      node.addEventListener('click', () => openLevel(lvl.id));
      seg.appendChild(node);
    }

    wrap.appendChild(seg);

    // Connector line between nodes (not after the last one)
    if (!isLast) {
      const connector = document.createElement('div');
      connector.className = `path-connector${status === 'completed' ? ' active' : ''}`;
      connector.setAttribute('aria-hidden', 'true');
      wrap.appendChild(connector);
    }
  });
}

// ── LEVEL VIEW ────────────────────────────────────────────────────────────

let currentLevel = null;

function openLevel(id) {
  const lvl = LEVELS.find(l => l.id === id);
  if (!lvl) return;
  currentLevel = lvl;

  const isCompleted = state.completed.includes(id);

  // Switch views
  document.getElementById('path-view').style.display = 'none';
  const lv = document.getElementById('level-view');
  lv.style.display = 'block';
  window.scrollTo(0, 0);

  // Render level content
  document.getElementById('level-content').innerHTML = buildLevelHTML(lvl, isCompleted);

  // Wire up playground
  runPlayground();
  document.getElementById('run-btn').addEventListener('click', runPlayground);
  document.getElementById('pg-editor').addEventListener('input', () => {
    clearTimeout(window._pgDebounce);
    window._pgDebounce = setTimeout(runPlayground, 600);
  });

  // Wire up challenge checker (only if not already done)
  if (!isCompleted) {
    document.getElementById('check-btn').addEventListener('click', checkChallenge);
  }
}

function buildLevelHTML(lvl, isCompleted) {
  return `
    <div class="level-header">
      <div class="level-eyebrow">LEVEL ${lvl.id} OF ${LEVELS.length}</div>
      <h1 class="level-title">${lvl.emoji} ${lvl.title}</h1>
      <p class="level-subtitle">${lvl.hook}</p>
    </div>

    <div class="content-section">
      <div class="section-label">THE CONCEPT</div>
      <div class="section-body">${lvl.concept}</div>
      <div class="why-box">
        <div class="why-label">WHY THIS MATTERS</div>
        <div class="section-body">${lvl.why}</div>
      </div>
      <div class="mistake-box">
        <div class="mistake-label">COMMON MISTAKE</div>
        <div class="section-body">${lvl.mistake}</div>
      </div>
    </div>

    <div class="playground-section">
      <div class="playground-header">
        <div class="section-label">LIVE PLAYGROUND</div>
        <button class="run-btn" id="run-btn">▶ Run</button>
      </div>
      <div class="playground-panes">
        <div>
          <div class="pane-label">HTML / CSS / JS</div>
          <textarea
            class="code-editor"
            id="pg-editor"
            spellcheck="false"
            aria-label="Playground code editor"
          >${escHtml(lvl.playgroundCode)}</textarea>
        </div>
        <div>
          <div class="pane-label">PREVIEW</div>
          <iframe
            class="preview-frame"
            id="pg-frame"
            title="Live code preview"
            sandbox="allow-scripts"
          ></iframe>
        </div>
      </div>
    </div>

    <div class="challenge-section">
      <div class="section-label">
        YOUR CHALLENGE${isCompleted ? ' — COMPLETED ✓' : ''}
      </div>
      <div class="section-title">Prove you've got it</div>
      <div class="challenge-desc">${lvl.challengeDesc}</div>
      <div class="challenge-editor-wrap">
        <textarea
          class="challenge-editor"
          id="ch-editor"
          spellcheck="false"
          aria-label="Challenge code editor"
        >${escHtml(lvl.challengeStarter)}</textarea>
      </div>
      <button class="check-btn" id="check-btn" ${isCompleted ? 'disabled' : ''}>
        ${isCompleted ? '✓ Already completed' : 'Check my code'}
      </button>
      <div class="feedback-box" id="feedback-box"></div>
    </div>
  `;
}

// ── PLAYGROUND ────────────────────────────────────────────────────────────

function runPlayground() {
  const code  = document.getElementById('pg-editor').value;
  const frame = document.getElementById('pg-frame');
  const doc   = frame.contentDocument || frame.contentWindow.document;
  doc.open();
  doc.write(code);
  doc.close();
}

// ── CHALLENGE ─────────────────────────────────────────────────────────────

function checkChallenge() {
  const code   = document.getElementById('ch-editor').value;
  const result = currentLevel.validate(code);
  const fb     = document.getElementById('feedback-box');

  // Reset classes first
  fb.className = 'feedback-box';

  if (result.pass) {
    fb.className = 'feedback-box pass';
    fb.textContent = '✓ Perfect! You nailed it.';
    awardXP(currentLevel.id);
  } else {
    fb.className = 'feedback-box fail';
    fb.textContent = '→ ' + result.msg;
  }
}

// ── XP & STREAK ───────────────────────────────────────────────────────────

function awardXP(levelId) {
  // Guard: only award once
  if (state.completed.includes(levelId)) return;

  state.completed.push(levelId);
  state.xp += 20;
  updateStreak();
  saveState(state);
  updateHUD();
  showSuccess(levelId);
}

function updateStreak() {
  const today     = todayStr();
  const yesterday = yesterdayStr();
  const s         = state.streak;

  if (s.lastDate === today) {
    // Already counted today — no change
    return;
  } else if (s.lastDate === yesterday) {
    // Consecutive day
    s.count += 1;
  } else {
    // Missed a day (or first ever)
    s.count = 1;
  }

  s.lastDate = today;
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

// ── SUCCESS OVERLAY ───────────────────────────────────────────────────────

function showSuccess(levelId) {
  const nextLevel = LEVELS.find(l => l.id === levelId + 1);

  const msg = nextLevel
    ? `+20 XP earned! "${nextLevel.title}" is now unlocked.`
    : "You've completed every level. You're an Engineer! 🚀";

  document.getElementById('success-xp-text').textContent = '+20 XP';
  document.getElementById('success-msg').textContent = msg;
  document.getElementById('success-overlay').classList.add('show');

  // Continue button: go to next level or back to path
  document.getElementById('next-btn').onclick = () => {
    document.getElementById('success-overlay').classList.remove('show');
    if (nextLevel) {
      openLevel(nextLevel.id);
    } else {
      goBack();
    }
  };
}

// ── NAVIGATION ────────────────────────────────────────────────────────────

function goBack() {
  document.getElementById('level-view').style.display = 'none';
  document.getElementById('path-view').style.display = 'block';
  currentLevel = null;
  buildPath();
  window.scrollTo(0, 0);
}

// ── HELPERS ───────────────────────────────────────────────────────────────

// Escape HTML so playground/challenge starter code displays correctly in <textarea>
function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ── INIT ──────────────────────────────────────────────────────────────────

document.getElementById('back-btn').addEventListener('click', goBack);

document.getElementById('reset-btn').addEventListener('click', () => {
  if (confirm("Reset all your progress? This can't be undone.")) {
    state = { completed: [], xp: 0, streak: { count: 0, lastDate: null } };
    saveState(state);
    updateHUD();
    buildPath();
  }
});

// Boot
updateHUD();
buildPath();
