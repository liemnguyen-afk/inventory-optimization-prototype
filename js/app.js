/* Inventory Optimization prototype — shared data store, global header, and UI helpers. */

const STORE_KEY = 'invopt-prototype-v1';

const WAREHOUSES = [
  'Central Hub', 'DT Headquarters', 'Hampton Bay 1A', 'New York City Hub', 'East Distribution',
  'West Processing', 'San Francisco Bay Area', 'South Warehouse', 'North Warehouse', 'Phoenix AZ Hub',
  'Warehouse 3', 'Warehouse 4', 'Warehouse 5', 'Warehouse 6', 'Warehouse 7', 'Warehouse 8',
  'Warehouse 9', 'Warehouse 10', 'Warehouse 11', 'Warehouse 12', 'Warehouse 13', 'Warehouse 14',
  'Warehouse 15', 'Warehouse 16', 'Warehouse 17',
];

const USERS = ['Sarah Chen', 'Emma Thompson', 'Lisa Anderson', 'Andrew Stanton', 'Frank Castle', 'Hugo Weaving'];
const CURRENT_USER = 'Andrew Stanton';

function seedState() {
  const job = (id, name, description, warehouses, every, repeats, owner, status, active, extra = {}) => ({
    id, name, description, warehouses, every, repeats, owner, status, active,
    lastExecuted: '04/25/2026', startOn: '2026-06-04', endType: 'never', occurrences: 1, endDate: '2026-06-04',
    ...extra,
  });
  return {
    nextJobId: 7,
    nextReportId: 49,
    jobs: [
      job(1, 'Packaging Collectives', 'Product changes and enhancements', ['DT Headquarters'], 1, true, 'Andrew Stanton', 'Scheduled', true, { showReport: true }),
      job(2, 'Reconciliation Report', 'Reconciliation across all warehouses', ['San Francisco Bay Area'], 1, true, 'Sarah Chen', 'Scheduled', true),
      job(3, 'Shipping Label Generation', 'Shipping labels for pending orders',
        ['South Warehouse', 'Hampton Bay 1A', 'East Distribution'], 3, false, 'Emma Thompson', 'Completed', false),
      job(4, 'Product Commitments', 'Outline product changes and enhancements', ['All'], 12, true, 'Lisa Anderson', 'Scheduled', true),
      job(5, 'Supplier Performance', 'Performance evaluation tracking delivery', ['North Warehouse', 'West Processing'], 6, false, 'Andrew Stanton', 'Failed', true),
      job(6, 'Compliance Audit Trail', 'Audit logs and compliance documentation', ['Phoenix AZ Hub'], 1, true, 'Sarah Chen', 'Scheduled', true),
    ],
    reports: [
      { id: 48, jobId: 1, executedOn: '04/25/2026' },
      { id: 47, jobId: 2, executedOn: '04/25/2026' },
      { id: 46, jobId: 3, executedOn: '04/25/2026' },
      { id: 45, jobId: 4, executedOn: '04/25/2026' },
      { id: 44, jobId: 5, executedOn: '04/25/2026' },
      { id: 43, jobId: 6, executedOn: '04/25/2026' },
    ],
  };
}

/* Item-warehouse settings shown on On-Hand Balances, Item Warehouse Optimization and Setup Preferences.
   `reco` is the AI replenishment recommendation for that item at that warehouse. */
function seedItems() {
  const item = (id, no, name, warehouse, type, min, max, uom2, supplier, segment, requestor, onHand, extra = {}) => ({
    id, no, name, warehouse, type, min, max, uom: 'Each', uom2, supplier, segment, requestor,
    reorderQty: 250, enabled: true, storage: 'HQ 6th Floor Storage', ...onHand, ...extra,
  });
  const oh = (qty, allocated, price) => ({ qty, allocated, available: allocated, price, openReq: 0, stockValue: 200000, currency: 'USD', aisle: 'A16' });
  return [
    item(1, '1RM12', 'Hyaluronic Acid', 'New York City', 'Reorder', 400, 5000, 'Box', 'Lifecore Biomedical', 'AX', 'Andrew Stanton', oh(400, 150, 254.00), {
      description: 'Sodium hyaluronate powder, pharmaceutical grade, 1.0–1.8 MDa molecular weight, 100 g sealed container.',
      reco: { type: 'Min / Max', min: 525, max: 6500,
        text: 'Based on lead time and historical demand to avoid stock out, change replenishment type to <b>Min / Max.</b>',
        banner: 'Based on lead time and historical demand to avoid stock out, consider to replenish with <b>Min/Max</b> with these amounts:' } }),
    item(2, '5YE66', 'Regulator, Nitrogen', 'New York City', 'Reorder', 200, 7500, 'Each', 'Roche Supplies', 'AX', 'Sarah Chen', oh(200, 50, 309.00), {
      description: 'Single-stage nitrogen regulator, CGA-580 inlet, 0–200 psi delivery, brass body.' }),
    item(3, '4WY81', 'Imager, Thermal', 'Philadelphia', 'Min / Max', 800, 7500, 'Case', 'Expedia', 'BX', 'Emma Thompson', oh(800, 600, 100.00), {
      description: 'Handheld thermal imager, 160 x 120 IR resolution, -20 to 550 °C range, rechargeable battery.',
      reco: { type: 'Min / Max', min: 700, max: 6200,
        text: 'Demand has been steady for 3 quarters. Keep <b>Min / Max</b> but lower the amounts to reduce excess stock.',
        banner: 'Demand has been steady for 3 quarters. Keep <b>Min/Max</b> and reduce excess stock with these amounts:' } }),
    item(4, '5YE68', 'Thermometer, Infrared', 'Philadelphia', 'Managed by Supplier', 950, 5500, 'Each', 'Tandem Consulting', 'CX', 'Lisa Anderson', oh(950, 850, 254.15), {
      description: 'Non-contact infrared thermometer, -50 to 800 °C, 12:1 distance-to-spot ratio.' }),
    item(5, '5YE69', 'Regulator, Nitrogen', 'Philadelphia', 'Reorder', 600, 3000, 'Each', 'Best Buy', 'AY', 'Andrew Stanton', oh(600, 350, 254.00), {
      description: 'Single-stage nitrogen regulator, CGA-580 inlet, 0–200 psi delivery, brass body.' }),
    item(6, '5YE70', 'Detector, Halogen Leak', 'Philadelphia', 'Min / Max', 700, 5500, 'Each', 'GothCorp', 'BZ', 'Sarah Chen', oh(700, 600, 99.99), {
      description: 'Heated-diode halogen leak detector, sensitivity 0.1 oz/yr, audible and visual alarm.' }),
    item(7, '4WY82', 'Glycolic Acid', 'Philadelphia', 'Reorder', 300, 2000, 'Each', 'Lifecore Biomedical', 'CY', 'Lisa Anderson', oh(1300, 600, 50.00), {
      description: 'Glycolic acid solution 70% in water, technical grade, 1 L bottle.', hideInOptimization: true }),
  ];
}

const Store = {
  get() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (!s.items) { s.items = seedItems(); this.set(s); }
        return s;
      }
    } catch (e) { /* fall through to seed */ }
    const s = { ...seedState(), items: seedItems() };
    this.set(s);
    return s;
  },
  set(s) { localStorage.setItem(STORE_KEY, JSON.stringify(s)); },
  update(fn) { const s = this.get(); fn(s); this.set(s); return s; },
  reset(empty = false) {
    const s = { ...seedState(), items: seedItems() };
    if (empty) { s.jobs = []; s.reports = []; }
    this.set(s);
  },
  job(id) { return this.get().jobs.find(j => j.id === Number(id)); },
  item(id) { return this.get().items.find(i => i.id === Number(id)); },
};

/* Simulated optimization runs: jobs in "Processing" complete a few seconds after starting. */
const RUN_MS = 6000;
function startRun(jobId) {
  Store.update(s => {
    const j = s.jobs.find(x => x.id === Number(jobId));
    if (j) { j.status = 'Processing'; j.runStartedAt = Date.now(); }
  });
}
function settleRuns() {
  let changed = false;
  Store.update(s => {
    s.jobs.forEach(j => {
      if (j.status === 'Processing' && j.runStartedAt && Date.now() - j.runStartedAt >= RUN_MS) {
        j.status = 'Completed';
        j.lastExecuted = todayStr();
        j.showReport = true;
        delete j.runStartedAt;
        s.reports.unshift({ id: s.nextReportId++, jobId: j.id, executedOn: j.lastExecuted, fresh: true });
        changed = true;
      }
    });
  });
  return changed;
}

function todayStr(d = new Date()) {
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
}
function isoToUs(iso) { const [y, m, d] = iso.split('-'); return `${m}/${d}/${y}`; }

function esc(str) {
  return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* ---------------------------------------------------------------- Icons not exported as Figma assets */
const ICON = {
  caret: '<svg class="caret" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>',
  building: '<svg class="lead" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 21V4.5h9V21M13 9h7v12M2.5 21h19"/><path d="M6.5 7.5h1.5M9.5 7.5H11M6.5 10.5h1.5M9.5 10.5H11M6.5 13.5h1.5M9.5 13.5H11M6.5 16.5h1.5M9.5 16.5H11M15.5 12.5h2M15.5 15.5h2"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M9.5 16.2L5.3 12l-1.4 1.4 5.6 5.6 11-11-1.4-1.4z"/></svg>',
  calendar: '<svg viewBox="0 0 24 24"><path d="M5.3 21.5c-.5 0-.9-.2-1.3-.5-.3-.4-.5-.8-.5-1.3V6.3c0-.5.2-.9.5-1.3.4-.3.8-.5 1.3-.5h1.4V2.4h1.5v2.1h7.7V2.4h1.4v2.1h1.4c.5 0 .9.2 1.3.5.3.4.5.8.5 1.3v13.4c0 .5-.2.9-.5 1.3-.4.3-.8.5-1.3.5H5.3zm0-1.5h13.4c.1 0 .2 0 .2-.1l.1-.2V10.3H5v9.4l.1.2.2.1zM5 8.8h14V6.3l-.1-.2-.2-.1H5.3l-.2.1-.1.2v2.5zm3 4.7h3.5V17H8v-3.5z"/></svg>',
  error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16v.5" stroke-linecap="round"/></svg>',
  info: '<svg class="info" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.5v.5" stroke-linecap="round"/></svg>',
  kebab: '<svg viewBox="0 0 24 24"><circle cx="12" cy="5.5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="18.5" r="1.6"/></svg>',
  plus: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
};

/* ---------------------------------------------------------------- Global header */
function renderHeader({ primary = 'Inventory', sub = 'Optimization Scheduler' } = {}) {
  const primaryLinks = [
    ['Travel & Expenses'], ['Requests'], ['Orders'], ['Invoices'], ['Community'], ['Payments'],
    ['Inventory', 'scheduler.html'], ['Setup', 'index.html'],
  ];
  const subLinks = primary === 'Setup'
    ? [['All Setup Items', 'index.html'], ['Company Info'], ['Accounts'], ['Users'], ['Approvals'], ['Budget Periods'], ['Budget Lines']]
    : [['Overview'], ['Workbench'], ['On-Hand Balances', 'ohb.html'], ['Optimization Scheduler', 'scheduler.html'], ['Fulfillment'], ['Picklists']];
  const sel = primary === 'Setup' ? 'All Setup Items' : sub;
  const link = ([label, href], selected) =>
    `<a href="${href || '#'}" ${href ? '' : 'data-stub'} class="${selected ? 'selected' : ''}">${esc(label)}</a>`;

  const html = `
  <header class="gh">
    <div class="gh-top">
      <a class="gh-logo" href="index.html" aria-label="Coupa home">
        <img class="icon" src="assets/coupa-logo-icon.svg" alt="">
        <img class="type" src="assets/coupa-logotype.svg" alt="coupa">
      </a>
      <label class="gh-search">
        <img src="assets/magnifying-glass.svg" width="16" height="16" alt="">
        <input placeholder="What do you need?">
      </label>
      <button class="gh-write" data-stub aria-label="Write a request">
        <img class="ring" src="assets/write-request-btn.svg" alt="">
        <img class="ic" src="assets/ic-write-request.svg" alt="">
      </button>
      <div class="gh-right">
        <span class="gh-avatar">RR</span>
        <button class="gh-circle" data-stub aria-label="Notifications"><img src="assets/bell.svg" alt=""></button>
        <button class="gh-circle" data-stub aria-label="Cart"><img src="assets/cart.svg" alt=""></button>
        <button class="gh-circle help" data-stub aria-label="Help"><img src="assets/help.svg" alt=""></button>
      </div>
    </div>
    <nav class="gh-nav">
      <a class="home selected" href="index.html" aria-label="Home"><img src="assets/home.svg" alt=""></a>
      ${primaryLinks.map(l => link(l, l[0] === primary)).join('')}
    </nav>
    <nav class="gh-subnav">${subLinks.map(l => link(l, l[0] === sel)).join('')}</nav>
  </header>`;
  document.body.insertAdjacentHTML('afterbegin', html);
}

/* ---------------------------------------------------------------- Toast */
function toast(msg) {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('show'), 2600);
}
function flashOnLoad() {
  const msg = sessionStorage.getItem('invopt-flash');
  if (msg) { sessionStorage.removeItem('invopt-flash'); setTimeout(() => toast(msg), 150); }
}
function go(href, flash) {
  if (flash) sessionStorage.setItem('invopt-flash', flash);
  location.href = href;
}

/* ---------------------------------------------------------------- Popover */
let openPopover = null;
function closePopover() { if (openPopover) { openPopover.remove(); openPopover = null; } }
function showPopover(anchor, html, { className = '', align = 'left', offsetY = 6 } = {}) {
  closePopover();
  const pop = document.createElement('div');
  pop.className = `popover ${className}`;
  pop.innerHTML = html;
  document.body.appendChild(pop);
  const r = anchor.getBoundingClientRect();
  let left = align === 'center' ? r.left + r.width / 2 - pop.offsetWidth / 2 : r.left;
  left = Math.max(8, Math.min(left, window.innerWidth - pop.offsetWidth - 8));
  pop.style.left = `${left + window.scrollX}px`;
  pop.style.top = `${r.bottom + window.scrollY + offsetY}px`;
  openPopover = pop;
  return pop;
}
document.addEventListener('mousedown', e => {
  if (openPopover && !openPopover.contains(e.target) && !e.target.closest('[data-popover-trigger]')) closePopover();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePopover(); });

/* Warehouse cell: first name + "+N" badge that opens the remaining list. */
function warehouseCell(list) {
  if (list.length === 1 && list[0] === 'All') return 'All';
  const [first, ...rest] = list;
  return `<span class="wh-cell">
    <button class="link" data-popover-trigger data-wh='${esc(JSON.stringify(list))}'>${esc(first)}</button>
    ${rest.length ? `<button class="count-badge" data-popover-trigger data-wh='${esc(JSON.stringify(rest))}'>+${rest.length}</button>` : ''}
  </span>`;
}
document.addEventListener('click', e => {
  const t = e.target.closest('[data-wh]');
  if (!t) return;
  const list = JSON.parse(t.dataset.wh);
  if (openPopover && openPopover._anchor === t) { closePopover(); return; }
  const pop = showPopover(t, `<ul>${list.map(w => `<li>${esc(w)}</li>`).join('')}</ul>`, { className: 'list' });
  pop._anchor = t;
});

/* AI recommendation popover. `reco` = { text, min, max, unit }; `detailsHref` wires "See Details". */
function showRecoPopover(trigger, reco, { detailsHref, applied } = {}) {
  if (openPopover && openPopover._anchor === trigger) { closePopover(); return; }
  const pop = showPopover(trigger, `
    <div class="reco">
      <div class="reco-head"><img src="assets/ai-sparkle.svg" alt="">${applied ? 'Recommendation applied' : 'Recommendation'}
        <button class="x" aria-label="Close"><img src="assets/close-small.svg" alt=""></button></div>
      <p>${reco.text}</p>
      <div class="qty">
        <div><div class="lbl">Minumum Qty</div>${reco.min} (${reco.unit})</div>
        <div><div class="lbl">Maximum Qty</div>${reco.max} (${reco.unit})</div>
      </div>
      ${applied ? `<div class="applied">Applied on ${applied}</div>`
        : `<a class="btn btn-primary" ${detailsHref ? `href="${detailsHref}"` : 'href="#" data-stub'}>See Details</a>`}
    </div>`, { offsetY: 4 });
  pop._anchor = trigger;
  pop.style.background = 'transparent';
  pop.querySelector('.x').addEventListener('click', closePopover);
}

/* Links/buttons outside this flow */
document.addEventListener('click', e => {
  const stub = e.target.closest('[data-stub]');
  if (stub) { e.preventDefault(); toast('Not part of this prototype flow'); }
});

/* ---------------------------------------------------------------- Prototype navigator */
function renderProtoNav() {
  const html = `
  <div class="proto">
    <div class="panel">
      <div class="actor">ACTOR: Inventory Admin</div>
      <h4>Screens</h4>
      <a href="index.html">1. Setup</a>
      <a href="settings.html">1a. Optimization Settings</a>
      <a href="scheduler.html">2. Optimization Scheduler</a>
      <a href="job.html">3. New Scheduler Job</a>
      <a href="job.html?id=1">4. Edit Scheduler Job</a>
      <a href="reports.html">5. Item Warehouse Optimization Reports</a>
      <a href="report.html?id=46">6. Optimization Report (with recommendation)</a>
      <h4>On-Hand Balances flow</h4>
      <a href="ohb.html">7. On-Hand Balances</a>
      <a href="iwo.html">8. Item Warehouse Optimization</a>
      <a href="prefs.html?id=1">9. Setup Preferences (Hyaluronic Acid)</a>
      <h4>Data</h4>
      <button data-reset="empty">Show empty state (no programs)</button>
      <button data-reset="seed">Reset sample data</button>
    </div>
    <button type="button" class="proto-toggle">Prototype ▾</button>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
  const root = document.querySelector('.proto');
  root.querySelector('.proto-toggle').addEventListener('click', () => root.classList.toggle('open'));
  root.querySelectorAll('[data-reset]').forEach(b => b.addEventListener('click', () => {
    Store.reset(b.dataset.reset === 'empty');
    go('scheduler.html', b.dataset.reset === 'empty' ? 'Cleared all programs' : 'Sample data restored');
  }));
}

function aiFab() {
  document.body.insertAdjacentHTML('beforeend',
    '<button class="ai-fab" data-stub aria-label="Coupa AI"><img src="assets/sparkle.svg" alt=""></button>');
}

function pagerHtml() {
  return `<div class="hscroll-bar"></div>
  <div class="pager">
    <div class="per">Items per page: <button class="on">15</button><button>45</button><button>90</button></div>
    <div class="pages"><span class="muted">Prev</span><span class="cur">1</span><span>2</span><span>3</span><span>…</span><span>17</span><span>Next</span></div>
  </div>`;
}

function initPage(headerOpts) {
  renderHeader(headerOpts);
  renderProtoNav();
  flashOnLoad();
}
