/* Tutorial engine — learning path navigation & interactive lessons */

const TUTORIAL_STORAGE_KEY = 'sqlTutorial_completed';

const MODULE_ICONS = {
  concepts: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  'query-types': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  ddl: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 17h7M14 20h7"/></svg>',
  practice: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
  playground: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M10 2v7.31"/><path d="M14 9.3V2"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/><path d="M5.52 16h12.96"/></svg>',
  'free-practice': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',
};

const Tutorial = {
  completed: new Set(),
  currentModule: null,
  currentLesson: null,
  currentView: 'home',

  init() {
    this.loadProgress();
    this.renderSidebar();
    this.showHome();
    this.bindEvents();
    this.updateProgressUI();
  },

  loadProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(TUTORIAL_STORAGE_KEY) || '[]');
      this.completed = new Set(saved);
    } catch {
      this.completed = new Set();
    }
  },

  saveProgress() {
    localStorage.setItem(TUTORIAL_STORAGE_KEY, JSON.stringify([...this.completed]));
    this.updateProgressUI();
    this.renderSidebar();
  },

  markComplete(lessonKey) {
    this.completed.add(lessonKey);
    this.saveProgress();
  },

  lessonKey(moduleId, lessonId) {
    return `${moduleId}/${lessonId}`;
  },

  getTotalLessons() {
    return TUTORIAL_PATH.reduce(
      (sum, m) => sum + (m.lessons ? m.lessons.length : 1),
      0
    );
  },

  getCompletedCount() {
    let count = 0;
    for (const mod of TUTORIAL_PATH) {
      if (mod.view) {
        if (this.completed.has(mod.id)) count++;
      } else if (mod.lessons) {
        for (const les of mod.lessons) {
          if (this.completed.has(this.lessonKey(mod.id, les.id))) count++;
        }
      }
    }
    return count;
  },

  updateProgressUI() {
    const total = this.getTotalLessons();
    const done = this.getCompletedCount();
    const pct = total ? Math.round((done / total) * 100) : 0;

    const bar = document.getElementById('tutProgressBar');
    const label = document.getElementById('tutProgressLabel');
    if (bar) bar.style.width = `${pct}%`;
    if (label) label.textContent = `${done}/${total} complete`;
  },

  escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  moduleIcon(moduleId) {
    return MODULE_ICONS[moduleId] || MODULE_ICONS.concepts;
  },

  showView(view) {
    this.currentView = view;
    /* Learn section only — lab is handled by AppNav */
  },

  showHome() {
    this.currentModule = null;
    this.currentLesson = null;
    this.currentView = 'home';
    const container = document.getElementById('tutorialContent');
    if (!container) return;

    container.innerHTML = `
      <div class="tut-home">
        <div class="tut-hero">
          <p class="tut-hero-label">Interactive SQL course</p>
          <h2>Master SQL step by step</h2>
          <p class="tut-lead">Start with core concepts, learn each query type with live examples, then practice on a real college database.</p>
        </div>
        <div class="tut-module-grid">
          ${TUTORIAL_PATH.map((mod) => this.renderModuleCard(mod)).join('')}
        </div>
      </div>`;

    container.querySelectorAll('[data-open-module]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const mod = TUTORIAL_PATH.find((m) => m.id === btn.dataset.openModule);
        if (mod?.view) this.openModuleView(mod);
        else if (mod?.lessons?.length) this.openLesson(mod.id, mod.lessons[0].id);
      });
    });

    this.renderSidebar();
  },

  renderModuleCard(mod) {
    const isView = !!mod.view;
    const lessonCount = isView ? 1 : mod.lessons.length;
    let done = 0;
    if (isView) {
      done = this.completed.has(mod.id) ? 1 : 0;
    } else {
      done = mod.lessons.filter((l) => this.completed.has(this.lessonKey(mod.id, l.id))).length;
    }
    const complete = done >= lessonCount;
    const pct = lessonCount ? Math.round((done / lessonCount) * 100) : 0;
    const unit = isView ? 'section' : done === 1 ? 'lesson' : 'lessons';
    const cta = isView ? 'Open SQL Lab' : complete ? 'Review' : 'Start learning';

    return `
      <button type="button" class="tut-module-card${complete ? ' complete' : ''}" data-open-module="${mod.id}">
        <div class="tut-module-card-head">
          <span class="tut-module-icon-wrap" aria-hidden="true">${this.moduleIcon(mod.id)}</span>
          ${complete ? '<span class="tut-module-badge done">Complete</span>' : `<span class="tut-module-badge">Step ${mod.step}</span>`}
        </div>
        <h3>${this.escapeHtml(mod.title)}</h3>
        <p>${this.escapeHtml(mod.summary)}</p>
        <div class="tut-module-footer">
          <div class="tut-module-progress">
            <span class="tut-module-progress-track" aria-hidden="true"><span class="tut-module-progress-fill" style="width:${pct}%"></span></span>
            <span class="tut-module-progress-label">${done}/${lessonCount} ${unit}</span>
          </div>
          <span class="tut-module-cta">${cta}<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
        </div>
      </button>`;
  },

  renderSidebar() {
    const nav = document.getElementById('learningNav');
    if (!nav) return;

    let html = `<button class="tut-nav-home${this.currentView === 'home' ? ' active' : ''}" type="button" id="tutNavHome">Overview</button>`;

    for (const mod of TUTORIAL_PATH) {
      if (mod.view) continue;
      const expanded = this.currentModule === mod.id;
      html += `<div class="tut-nav-module${expanded ? ' expanded' : ''}">`;
      html += `<button class="tut-nav-module-btn" type="button" data-module="${mod.id}">
        <span>${mod.icon} Step ${mod.step}: ${this.escapeHtml(mod.title)}</span>
        <span class="tut-nav-chevron">▸</span>
      </button>`;

      if (mod.lessons) {
        html += `<div class="tut-nav-lessons">`;
        for (const les of mod.lessons) {
          const key = this.lessonKey(mod.id, les.id);
          const active = this.currentModule === mod.id && this.currentLesson === les.id;
          html += `<button class="tut-nav-lesson${active ? ' active' : ''}${this.completed.has(key) ? ' done' : ''}"
            type="button" data-module="${mod.id}" data-lesson="${les.id}">${this.escapeHtml(les.title)}</button>`;
        }
        html += `</div>`;
      }
      html += `</div>`;
    }

    nav.innerHTML = html;

    document.getElementById('tutNavHome')?.addEventListener('click', () => this.showHome());

    nav.querySelectorAll('.tut-nav-module-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const modId = btn.dataset.module;
        const mod = TUTORIAL_PATH.find((m) => m.id === modId);
        if (mod?.lessons?.length) this.openLesson(modId, mod.lessons[0].id);
        else btn.parentElement.classList.toggle('expanded');
      });
    });

    nav.querySelectorAll('[data-lesson]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.openLesson(btn.dataset.module, btn.dataset.lesson);
      });
    });
  },

  openModuleView(mod) {
    this.currentModule = mod.id;
    this.currentLesson = null;
    if (mod.view === 'practice') {
      AppNav.openLab(mod.freeMode ? 'free' : 'practice');
    } else if (mod.view === 'playground') {
      AppNav.openLab('playground');
    }
    this.renderSidebar();
  },

  openLesson(moduleId, lessonId) {
    const mod = TUTORIAL_PATH.find((m) => m.id === moduleId);
    const lesson = mod?.lessons?.find((l) => l.id === lessonId);
    if (!lesson) return;

    this.currentModule = moduleId;
    this.currentLesson = lessonId;
    this.currentView = 'tutorial';
    ensurePracticeDb();

    this.renderLesson(mod, lesson);
    this.renderSidebar();
  },

  renderLesson(mod, lesson) {
    const container = document.getElementById('tutorialContent');
    if (!container) return;

    const idx = mod.lessons.indexOf(lesson);
    const prev = idx > 0 ? mod.lessons[idx - 1] : null;
    const next = idx < mod.lessons.length - 1 ? mod.lessons[idx + 1] : null;
    const nextMod = TUTORIAL_PATH[TUTORIAL_PATH.indexOf(mod) + 1];

    let sectionsHtml = lesson.sections
      .map(
        (s) =>
          `<div class="tut-section">
            <h3>${this.escapeHtml(s.heading)}</h3>
            ${s.body}
          </div>`
      )
      .join('');

    if (lesson.showSchema) {
      sectionsHtml += `<div class="tut-section tut-schema-preview">
        <h3>Database tables</h3>
        <pre class="er-diagram">${typeof ER_DIAGRAM !== 'undefined' ? ER_DIAGRAM : ''}</pre>
      </div>`;
    }

    let exampleHtml = '';
    if (lesson.exampleSql) {
      exampleHtml = `
        <div class="tut-code-block">
          <div class="tut-code-header">Example</div>
          <pre class="tut-code">${this.escapeHtml(lesson.exampleSql)}</pre>
          ${lesson.tryIt ? `<button class="btn btn-sm" type="button" data-load-example>Load into editor</button>` : ''}
        </div>`;
    }

    if (lesson.playgroundHint) {
      exampleHtml += `<div class="message info tut-playground-hint">
        Try this in <strong>SQL Lab → Playground</strong> — build tables visually with foreign keys.
      </div>`;
    }

    if (lesson.note) {
      exampleHtml += `<div class="message info">${this.escapeHtml(lesson.note)}</div>`;
    }

    let tryItHtml = '';
    if (lesson.tryIt || lesson.challenge) {
      const initialSql = lesson.challenge?.template || lesson.exampleSql || '';
      tryItHtml = `
        <div class="tut-tryit">
          <h3>Try it yourself</h3>
          ${lesson.challenge ? `<p class="tut-challenge-prompt">${this.escapeHtml(lesson.challenge.prompt)}</p>` : ''}
          <textarea id="tutSqlEditor" class="tut-sql-editor" spellcheck="false">${this.escapeHtml(initialSql)}</textarea>
          <div class="action-row">
            <button class="btn btn-primary btn-sm" id="tutBtnRun" type="button">▶ Run</button>
            ${lesson.challenge ? `<button class="btn btn-success btn-sm" id="tutBtnCheck" type="button">✓ Check Answer</button>` : ''}
            <button class="btn btn-sm" id="tutBtnResetDb" type="button">Reset DB</button>
          </div>
          <div id="tutQueryResult" class="tut-query-result"></div>
        </div>`;
    }

    container.innerHTML = `
      <article class="tut-lesson">
        <nav class="tut-breadcrumb">Step ${mod.step} · ${this.escapeHtml(mod.title)}</nav>
        <h2>${this.escapeHtml(lesson.title)}</h2>
        ${sectionsHtml}
        ${exampleHtml}
        ${tryItHtml}
        <div class="tut-lesson-nav">
          ${prev ? `<button class="btn btn-sm" type="button" data-prev="${prev.id}">← ${this.escapeHtml(prev.title)}</button>` : '<span></span>'}
          <button class="btn btn-sm" type="button" id="tutMarkComplete">Mark complete ✓</button>
          ${next ? `<button class="btn btn-sm btn-primary" type="button" data-next="${next.id}">${this.escapeHtml(next.title)} →</button>` : nextMod ? `<button class="btn btn-sm btn-primary" type="button" data-next-module="${nextMod.id}">Next: ${this.escapeHtml(nextMod.title)} →</button>` : '<span></span>'}
        </div>
      </article>`;

    container.querySelector('[data-load-example]')?.addEventListener('click', () => {
      const ed = document.getElementById('tutSqlEditor');
      if (ed) ed.value = lesson.exampleSql;
    });

    container.querySelector('[data-prev]')?.addEventListener('click', (e) => {
      this.openLesson(this.currentModule, e.target.dataset.prev);
    });

    container.querySelector('[data-next]')?.addEventListener('click', (e) => {
      this.markComplete(this.lessonKey(this.currentModule, this.currentLesson));
      this.openLesson(this.currentModule, e.target.dataset.next);
    });

    container.querySelector('[data-next-module]')?.addEventListener('click', (e) => {
      this.markComplete(this.lessonKey(this.currentModule, this.currentLesson));
      const nm = TUTORIAL_PATH.find((m) => m.id === e.target.dataset.nextModule);
      if (nm?.view) this.openModuleView(nm);
      else if (nm?.lessons?.length) this.openLesson(nm.id, nm.lessons[0].id);
    });

    document.getElementById('tutMarkComplete')?.addEventListener('click', () => {
      this.markComplete(this.lessonKey(this.currentModule, this.currentLesson));
      const btn = document.getElementById('tutMarkComplete');
      if (btn) {
        btn.textContent = 'Completed ✓';
        btn.disabled = true;
      }
    });

    document.getElementById('tutBtnRun')?.addEventListener('click', () => this.runTutorialSql(false));
    document.getElementById('tutBtnCheck')?.addEventListener('click', () => this.runTutorialSql(true));
    document.getElementById('tutBtnResetDb')?.addEventListener('click', () => {
      if (typeof resetDatabase === 'function') resetDatabase();
      document.getElementById('tutQueryResult').innerHTML = '<div class="message info">Database reset.</div>';
    });

    document.getElementById('tutSqlEditor')?.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        this.runTutorialSql(false);
      }
    });

    if (this.completed.has(this.lessonKey(this.currentModule, this.currentLesson))) {
      const btn = document.getElementById('tutMarkComplete');
      if (btn) {
        btn.textContent = 'Completed ✓';
        btn.disabled = true;
      }
    }
  },

  runTutorialSql(checkAnswer) {
    const sql = document.getElementById('tutSqlEditor')?.value.trim();
    const resultEl = document.getElementById('tutQueryResult');
    if (!sql || !resultEl) return;

    const mod = TUTORIAL_PATH.find((m) => m.id === this.currentModule);
    const lesson = mod?.lessons?.find((l) => l.id === this.currentLesson);

    try {
      const result = runQuery(sql);

      if (result.type === 'select') {
        const matrix = resultToMatrix(result.data);
        resultEl.innerHTML = `<p class="result-meta">${result.data.length} row(s) in ${result.elapsed}ms</p>${renderTable(matrix.columns, matrix.rows)}`;
      } else {
        resultEl.innerHTML = `<p class="message success">${result.affected} row(s) affected in ${result.elapsed}ms.</p>`;
      }

      if (checkAnswer && lesson?.challenge) {
        const userResult = result;
        resetDatabase();
        const expectedResult = runQuery(lesson.challenge.solution);

        let correct = false;
        if (userResult.type === 'modify' || expectedResult.type === 'modify') {
          correct = userResult.type === expectedResult.type;
        } else {
          correct = matricesEqual(resultToMatrix(userResult.data), resultToMatrix(expectedResult.data));
        }

        resetDatabase();

        if (correct) {
          this.markComplete(this.lessonKey(this.currentModule, this.currentLesson));
          resultEl.innerHTML += `<div class="message success" style="margin-top:0.75rem;">✓ Correct! Well done.</div>`;
        } else {
          resultEl.innerHTML += `<div class="message error" style="margin-top:0.75rem;">Not quite — check your query and try again.</div>`;
        }
      }
    } catch (err) {
      resultEl.innerHTML = `<div class="message error">${this.escapeHtml(err.message)}</div>`;
    }
  },

  bindEvents() {
    /* sidebar re-bound on each render */
  },
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('learningNav')) Tutorial.init();
});
