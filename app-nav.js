/* App navigation — sections, hamburger sidebars, lab tabs */

const AppNav = {
  section: 'learn',
  labTab: 'practice',
  learnSidebarOpen: true,
  labLeftOpen: true,
  labRightOpen: true,

  init() {
    this.bindEvents();
    this.applySection('learn');
    document.querySelectorAll('.lab-tab').forEach((t) => {
      t.classList.toggle('active', t.dataset.labTab === 'practice');
    });
    this.syncLayout();
  },

  bindEvents() {
    document.getElementById('btnHamburger')?.addEventListener('click', () => this.togglePrimarySidebar());
    document.getElementById('btnCloseLearnSidebar')?.addEventListener('click', () => this.setLearnSidebar(false));
    document.getElementById('btnToggleRight')?.addEventListener('click', () => this.toggleLabRight());
    document.getElementById('sidebarBackdrop')?.addEventListener('click', () => this.closeAllSidebars());

    document.querySelectorAll('.section-tab').forEach((tab) => {
      tab.addEventListener('click', () => this.switchSection(tab.dataset.section));
    });

    document.querySelectorAll('.lab-tab').forEach((tab) => {
      tab.addEventListener('click', () => this.switchLabTab(tab.dataset.labTab));
    });

    document.querySelectorAll('.lab-link-btn').forEach((btn) => {
      btn.addEventListener('click', () => this.openLab(btn.dataset.lab));
    });

    window.addEventListener('resize', () => this.syncLayout());
  },

  switchSection(section) {
    this.section = section;
    this.applySection(section);
    this.syncLayout();
  },

  applySection(section) {
    document.querySelectorAll('.section-tab').forEach((t) => {
      t.classList.toggle('active', t.dataset.section === section);
    });

    document.getElementById('learnSection')?.classList.toggle('hidden', section !== 'learn');
    document.getElementById('labSection')?.classList.toggle('hidden', section !== 'lab');
    document.querySelector('.learn-meta')?.classList.toggle('hidden', section !== 'learn');
    document.querySelector('.lab-meta')?.classList.toggle('hidden', section !== 'lab');

    if (section === 'lab') this.activateLab();
  },

  switchLabTab(tab) {
    this.labTab = tab;
    this.applyLabTab(tab);
  },

  applyLabTab(tab) {
    document.querySelectorAll('.lab-tab').forEach((t) => {
      t.classList.toggle('active', t.dataset.labTab === tab);
    });

    const isPlayground = tab === 'playground';
    document.getElementById('labPracticeWrap')?.classList.toggle('hidden', isPlayground);
    document.getElementById('labPlaygroundWrap')?.classList.toggle('hidden', !isPlayground);
    document.getElementById('btnToggleRight')?.classList.toggle('hidden', tab !== 'practice');

    if (tab === 'playground') {
      ensurePlaygroundDb();
    } else {
      ensurePracticeDb();
      if (tab === 'free') {
        this.labRightOpen = false;
        const editor = document.getElementById('sqlEditor');
        if (editor) {
          editor.value = '-- Free SQL — experiment on the college database\nSELECT * FROM college_students LIMIT 5;';
        }
      } else {
        this.labRightOpen = true;
        if (activeTable) showTableData(activeTable);
      }
    }
    this.syncLayout();
  },

  openLab(mode) {
    this.switchSection('lab');
    if (mode === 'playground') this.switchLabTab('playground');
    else if (mode === 'free') this.switchLabTab('free');
    else this.switchLabTab('practice');

    if (mode === 'practice') Tutorial.markComplete('practice');
    if (mode === 'playground') Tutorial.markComplete('playground');
    if (mode === 'free') Tutorial.markComplete('free-practice');
  },

  activateLab() {
    if (this.labTab === 'playground') ensurePlaygroundDb();
    else ensurePracticeDb();
  },

  togglePrimarySidebar() {
    if (this.section === 'learn') this.setLearnSidebar(!this.learnSidebarOpen);
    else this.setLabLeft(!this.labLeftOpen);
  },

  setLearnSidebar(open) {
    this.learnSidebarOpen = open;
    document.getElementById('learnSidebar')?.classList.toggle('open', open);
    this.syncLayout();
  },

  setLabLeft(open) {
    this.labLeftOpen = open;
    const id = this.labTab === 'playground' ? 'pgSidebarLeft' : 'labSidebarLeft';
    document.getElementById(id)?.classList.toggle('open', open);
    this.syncLayout();
  },

  toggleLabRight() {
    if (this.labTab !== 'practice') return;
    this.labRightOpen = !this.labRightOpen;
    document.getElementById('labSidebarRight')?.classList.toggle('open', this.labRightOpen);
    this.syncLayout();
  },

  closeAllSidebars() {
    if (this.section === 'learn') {
      this.setLearnSidebar(false);
    } else {
      this.setLabLeft(false);
      if (this.labTab === 'practice') {
        this.labRightOpen = false;
        document.getElementById('labSidebarRight')?.classList.remove('open');
        this.syncLayout();
      }
    }
  },

  getActiveLabWrap() {
    return this.labTab === 'playground'
      ? document.getElementById('labPlaygroundWrap')
      : document.getElementById('labPracticeWrap');
  },

  syncLayout() {
    const mobile = window.innerWidth <= 1024;

    const learnSection = document.getElementById('learnSection');
    learnSection?.classList.toggle('sidebar-closed', !this.learnSidebarOpen);

    const wrap = this.getActiveLabWrap();
    if (wrap) {
      wrap.classList.toggle('left-open', this.labLeftOpen);
      wrap.classList.toggle('left-closed', !this.labLeftOpen);
      wrap.classList.toggle('right-open', this.labRightOpen);
      wrap.classList.toggle('right-closed', !this.labRightOpen);
    }

    document.getElementById('learnSidebar')?.classList.toggle('open', this.learnSidebarOpen);
    document.getElementById('labSidebarLeft')?.classList.toggle('open', this.labLeftOpen);
    document.getElementById('pgSidebarLeft')?.classList.toggle('open', this.labLeftOpen);
    document.getElementById('labSidebarRight')?.classList.toggle('open', this.labRightOpen);
    document.getElementById('pgSidebarRight')?.classList.add('open');

    const backdrop = document.getElementById('sidebarBackdrop');
    const showBackdrop =
      mobile &&
      ((this.section === 'learn' && this.learnSidebarOpen) ||
        (this.section === 'lab' && (this.labLeftOpen || (this.labTab === 'practice' && this.labRightOpen))));
    backdrop?.classList.toggle('hidden', !showBackdrop);
  },
};

document.addEventListener('DOMContentLoaded', () => AppNav.init());
