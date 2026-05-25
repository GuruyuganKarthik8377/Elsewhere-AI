document.addEventListener("DOMContentLoaded", () => {
  const outputRaw = localStorage.getItem('elsewhere_output');

  function showEmptyState() {
    const container = document.querySelector('.selves-container');
    if (container) container.style.display = 'none';

    const empty = document.createElement('main');
    empty.id = 'emptyState';
    empty.style.minHeight = '100vh';
    empty.style.display = 'flex';
    empty.style.flexDirection = 'column';
    empty.style.alignItems = 'center';
    empty.style.justifyContent = 'center';
    empty.style.gap = '28px';
    empty.style.padding = '0 24px';
    empty.style.textAlign = 'center';
    empty.style.position = 'relative';
    empty.style.zIndex = '1';

    const msg = document.createElement('div');
    msg.textContent = "No futures found. Begin your exploration.";
    msg.style.fontSize = '1.05rem';
    msg.style.fontStyle = 'italic';
    msg.style.color = 'rgba(220,210,255,0.8)';
    msg.style.maxWidth = '480px';
    msg.style.lineHeight = '1.6';

    const btn = document.createElement('a');
    btn.textContent = 'Begin';
    btn.href = 'index.html';
    btn.style.display = 'inline-block';
    btn.style.background = 'transparent';
    btn.style.border = '1px solid rgba(124,106,255,0.3)';
    btn.style.color = 'rgba(220,210,255,0.85)';
    btn.style.padding = '12px 32px';
    btn.style.borderRadius = '100px';
    btn.style.fontSize = '0.9rem';
    btn.style.fontFamily = "'Inter', sans-serif";
    btn.style.letterSpacing = '0.02em';
    btn.style.textDecoration = 'none';
    btn.style.cursor = 'pointer';
    btn.style.transition = 'border-color 0.3s, background 0.3s';
    btn.addEventListener('mouseenter', () => {
      btn.style.borderColor = 'rgba(124,106,255,0.6)';
      btn.style.background = 'rgba(124,106,255,0.05)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.borderColor = 'rgba(124,106,255,0.3)';
      btn.style.background = 'transparent';
    });

    empty.appendChild(msg);
    empty.appendChild(btn);
    document.body.appendChild(empty);
  }

  let selves;
  if (!outputRaw) {
    showEmptyState();
    return;
  }
  try {
    selves = JSON.parse(outputRaw);
    if (!Array.isArray(selves) || selves.length === 0) {
      showEmptyState();
      return;
    }
  } catch (e) {
    console.error('Failed to parse elsewhere_output:', e);
    showEmptyState();
    return;
  }

  selves.forEach((self, index) => {
    const card = document.querySelector(`.self-card[data-self="${index}"]`);
    if (!card) return;

    // Text fields
    const pathEl = card.querySelector('.self-path');
    if (pathEl) pathEl.textContent = self.path;

    const titleEl = card.querySelector('.self-title');
    if (titleEl) titleEl.textContent = self.identity_title;

    const yearEl = card.querySelector('.self-year');
    if (yearEl) yearEl.textContent = self.year;

    const summaryEl = card.querySelector('.self-summary');
    if (summaryEl) summaryEl.textContent = self.identity_summary;

    const diaryEl = card.querySelector('.self-diary');
    if (diaryEl) diaryEl.textContent = self.diary_entry;

    const quoteEl = card.querySelector('.self-quote');
    if (quoteEl) quoteEl.textContent = `"${self.closing_quote}"`;

    // Timeline
    const t1 = card.querySelector('.timeline-1');
    if (t1) t1.textContent = self.timeline.year_1;

    const t5 = card.querySelector('.timeline-5');
    if (t5) t5.textContent = self.timeline.year_5;

    const t10 = card.querySelector('.timeline-10');
    if (t10) t10.textContent = self.timeline.year_10;

    const t20 = card.querySelector('.timeline-20');
    if (t20) t20.textContent = self.timeline.year_20;

    // Horizontal timeline strip (Life Trajectory)
    const tTexts = card.querySelectorAll('.timeline-strip .t-text');
    if (tTexts.length === 4 && self.timeline) {
      tTexts[0].textContent = self.timeline.year_1  || '';
      tTexts[1].textContent = self.timeline.year_5  || '';
      tTexts[2].textContent = self.timeline.year_10 || '';
      tTexts[3].textContent = self.timeline.year_20 || '';
    }

    // Meters values
    const fulfillVal = card.querySelector('.meter-fulfillment-val');
    if (fulfillVal) fulfillVal.textContent = self.meters.fulfillment + '%';
    const fulfillBar = card.querySelector('.meter-fulfillment');

    const regretVal = card.querySelector('.meter-regret-val');
    if (regretVal) regretVal.textContent = self.meters.regret + '%';
    const regretBar = card.querySelector('.meter-regret');

    const freedomVal = card.querySelector('.meter-freedom-val');
    if (freedomVal) freedomVal.textContent = self.meters.freedom + '%';
    const freedomBar = card.querySelector('.meter-freedom');

    const connectionVal = card.querySelector('.meter-connection-val');
    if (connectionVal) connectionVal.textContent = self.meters.connection + '%';
    const connectionBar = card.querySelector('.meter-connection');

    // Setup card animation starting state
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 600ms ease-out, transform 600ms ease-out';

    // Set initial bar width to 0 and setup transition
    const bars = [fulfillBar, regretBar, freedomBar, connectionBar];
    bars.forEach(bar => {
      if (bar) {
        bar.style.width = '0%';
        bar.style.transition = 'width 1.2s ease-out';
      }
    });

    // Start card animation with stagger (index * 150ms)
    // Add small tick timeout so styles apply before animating
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 150 + 50);

    // Animate meter bars after 300ms delay
    setTimeout(() => {
      if (fulfillBar) fulfillBar.style.width = self.meters.fulfillment + '%';
      if (regretBar) regretBar.style.width = self.meters.regret + '%';
      if (freedomBar) freedomBar.style.width = self.meters.freedom + '%';
      if (connectionBar) connectionBar.style.width = self.meters.connection + '%';
    }, 300);
  });

  // --- Focus/Switcher Logic ---
  let focusedIndex = 0;
  const allCards = document.querySelectorAll('.self-card');
  const dots = document.querySelectorAll('.card-indicators .dot');

  // Apply default focus state after entrance animations complete
  setTimeout(() => {
    // Clear inline styles to hand over control to CSS classes
    allCards.forEach(c => {
      c.style.transition = '';
      c.style.transform = '';
      c.style.opacity = '';
    });
    updateFocus(0);
  }, 1000);

  function updateFocus(index) {
    focusedIndex = index;

    allCards.forEach((c, i) => {
      if (i === focusedIndex) {
        c.classList.add('focused');
        c.classList.remove('dimmed');
      } else {
        c.classList.remove('focused');
        c.classList.add('dimmed');
      }
    });

    dots.forEach((dot, i) => {
      if (i === focusedIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  // Click interaction on cards
  allCards.forEach((c, i) => {
    c.addEventListener('click', () => {
      allCards.forEach(card => {
        card.style.transition = '';
        card.style.transform = '';
        card.style.opacity = '';
      });
      updateFocus(i);
    });
  });

  // Click interaction on dots
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      allCards.forEach(card => {
        card.style.transition = '';
        card.style.transform = '';
        card.style.opacity = '';
      });
      updateFocus(i);
    });
  });

  // Keyboard navigation (disabled when expand modal is open)
  document.addEventListener('keydown', (e) => {
    const expandOpen = document.getElementById('expand-modal')?.classList.contains('open');
    if (expandOpen) return;
    if (e.key === 'ArrowRight') {
      const next = Math.min(focusedIndex + 1, allCards.length - 1);
      allCards.forEach(c => { c.style.transition = ''; c.style.transform = ''; c.style.opacity = ''; });
      updateFocus(next);
    } else if (e.key === 'ArrowLeft') {
      const prev = Math.max(focusedIndex - 1, 0);
      allCards.forEach(c => { c.style.transition = ''; c.style.transform = ''; c.style.opacity = ''; });
      updateFocus(prev);
    }
  });

  // Action Buttons
  const btnExplore = document.getElementById('btnExplore');
  if (btnExplore) {
    btnExplore.addEventListener('click', () => {
      localStorage.removeItem('elsewhere_input');
      localStorage.removeItem('elsewhere_output');
      window.location.href = 'intake.html';
    });
  }

  const btnRestart = document.getElementById('btnRestart');
  if (btnRestart) {
    btnRestart.addEventListener('click', () => {
      localStorage.removeItem('elsewhere_input');
      localStorage.removeItem('elsewhere_output');
      window.location.href = 'index.html';
    });
  }

  // --- Share Modal Logic ---
  const shareModal = document.getElementById('share-modal');
  const shareCard  = document.getElementById('share-card');

  function openShareModal(self) {
    // Populate text fields
    document.getElementById('sc-path').textContent  = self.path || '';
    document.getElementById('sc-title').textContent = self.identity_title || '';
    document.getElementById('sc-year').textContent  = self.year || '';
    document.getElementById('sc-quote').textContent = `"${self.closing_quote}"` || '';

    // Populate & reset meter bars to 0 first (so CSS transition plays)
    const meters = [
      { val: 'sc-fulfill-val',    bar: 'sc-fulfill-bar',    key: 'fulfillment' },
      { val: 'sc-regret-val',     bar: 'sc-regret-bar',     key: 'regret' },
      { val: 'sc-freedom-val',    bar: 'sc-freedom-bar',    key: 'freedom' },
      { val: 'sc-connection-val', bar: 'sc-connection-bar', key: 'connection' },
    ];

    meters.forEach(({ val, bar, key }) => {
      const pct = (self.meters && self.meters[key]) ? self.meters[key] : 0;
      document.getElementById(val).textContent = pct + '%';
      const barEl = document.getElementById(bar);
      barEl.style.transition = 'none';
      barEl.style.width = '0%';
    });

    // Show modal
    shareModal.classList.add('share-modal-open');
    document.body.style.overflow = 'hidden';

    // Animate bars after a tick (allow CSS reset to apply)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        meters.forEach(({ bar, key }) => {
          const pct = (self.meters && self.meters[key]) ? self.meters[key] : 0;
          const barEl = document.getElementById(bar);
          barEl.style.transition = 'width 1s ease-out';
          barEl.style.width = pct + '%';
        });
      });
    });
  }

  function closeShareModal() {
    shareModal.classList.remove('share-modal-open');
    document.body.style.overflow = '';
  }

  // Attach listeners to each share button
  document.querySelectorAll('.share-future-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent card focus toggle
      const idx = parseInt(btn.getAttribute('data-self'), 10);
      if (!isNaN(idx) && selves[idx]) {
        openShareModal(selves[idx]);
      }
    });
  });

  // Close on backdrop click (outside share card)
  shareModal.addEventListener('click', (e) => {
    if (e.target === shareModal) closeShareModal();
  });

  // Close button
  const btnCloseModal = document.getElementById('btn-close-modal');
  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', closeShareModal);
  }

  // Copy as Image button
  const btnCopyImage = document.getElementById('btn-copy-image');
  if (btnCopyImage) {
    btnCopyImage.addEventListener('click', () => {
      // Temporarily bump pixel density for a crisp screenshot
      html2canvas(document.getElementById('share-card'), {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'my-elsewhere-future.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    });
  }

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && shareModal.classList.contains('share-modal-open')) {
      closeShareModal();
    }
  });

  // --- Expand Modal Logic ---
  const expandModal   = document.getElementById('expand-modal');
  const expandContent = document.getElementById('expand-content');
  let expandIndex = 0;

  function populateExpand(self) {
    document.getElementById('ex-path').textContent  = self.path || '';
    document.getElementById('ex-title').textContent = self.identity_title || '';
    document.getElementById('ex-year').textContent  = self.year || '';
    document.getElementById('ex-diary').textContent = self.diary_entry || '';
    document.getElementById('ex-quote').textContent = self.closing_quote ? `"${self.closing_quote}"` : '';

    // Timeline points
    expandModal.querySelectorAll('.ex-tl-text').forEach(node => {
      const k = node.getAttribute('data-tl');
      node.textContent = (self.timeline && self.timeline['year_' + k]) || '';
    });

    // Meters — reset to 0, then animate
    const meters = [
      { val: 'ex-fulfill-val',    bar: 'ex-fulfill-bar',    key: 'fulfillment' },
      { val: 'ex-regret-val',     bar: 'ex-regret-bar',     key: 'regret' },
      { val: 'ex-freedom-val',    bar: 'ex-freedom-bar',    key: 'freedom' },
      { val: 'ex-connection-val', bar: 'ex-connection-bar', key: 'connection' },
    ];
    meters.forEach(({ val, bar, key }) => {
      const pct = (self.meters && self.meters[key]) ? self.meters[key] : 0;
      document.getElementById(val).textContent = pct + '%';
      const barEl = document.getElementById(bar);
      barEl.style.transition = 'none';
      barEl.style.width = '0%';
    });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        meters.forEach(({ bar, key }) => {
          const pct = (self.meters && self.meters[key]) ? self.meters[key] : 0;
          const barEl = document.getElementById(bar);
          barEl.style.transition = 'width 0.9s ease-out';
          barEl.style.width = pct + '%';
        });
      });
    });
  }

  function openExpandModal(idx) {
    expandIndex = idx;
    populateExpand(selves[expandIndex]);
    expandModal.classList.add('open');
    expandModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeExpandModal() {
    expandModal.classList.remove('open');
    expandModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function switchExpand(delta) {
    const next = (expandIndex + delta + selves.length) % selves.length;
    expandContent.classList.add('fading');
    setTimeout(() => {
      expandIndex = next;
      populateExpand(selves[expandIndex]);
      expandContent.classList.remove('fading');
      expandModal.scrollTop = 0;
    }, 200);
  }

  // Wire up "Read fully" buttons
  document.querySelectorAll('.expand-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.getAttribute('data-self'), 10);
      if (!isNaN(idx) && selves[idx]) openExpandModal(idx);
    });
  });

  // Close button
  expandModal.querySelector('.expand-close').addEventListener('click', closeExpandModal);

  // Arrows
  expandModal.querySelector('.expand-prev').addEventListener('click', () => switchExpand(-1));
  expandModal.querySelector('.expand-next').addEventListener('click', () => switchExpand(1));

  // Share from inside expand modal — reuses existing share modal flow
  const exShareBtn = document.getElementById('ex-share-btn');
  if (exShareBtn) {
    exShareBtn.addEventListener('click', () => {
      if (selves[expandIndex]) openShareModal(selves[expandIndex]);
    });
  }

  // Escape & arrow keys for expand modal
  document.addEventListener('keydown', (e) => {
    if (!expandModal.classList.contains('open')) return;
    if (e.key === 'Escape') closeExpandModal();
    else if (e.key === 'ArrowLeft')  switchExpand(-1);
    else if (e.key === 'ArrowRight') switchExpand(1);
  });

});
