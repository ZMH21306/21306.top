/* ==========================================================================
   语文5组的神秘报纸 · 版本时间轴
   — 轨道贯穿屏幕横向 · 无 9px 内边距
   ========================================================================== */

const versions = [
  {"id":"v0001","file":"v0001-20261007132222.html","time":"20261007 132222"},
  {"id":"v0002","file":"v0002-20261007141220.html","time":"20261007 141220"},
  {"id":"v0003","file":"v0003-20261007141540.html","time":"20261007 141540"},
  {"id":"v0004","file":"v0004-20261007142056.html","time":"20261007 142056"},
  {"id":"v0005","file":"v0005-20261007142244.html","time":"20261007 142244"},
  {"id":"v0006","file":"v0006-20261007142449.html","time":"20261007 142449"},
  {"id":"v0007","file":"v0007-20261007142526.html","time":"20261007 142526"},
  {"id":"v0008","file":"v0008-20261007145325.html","time":"20261007 145325"},
  {"id":"v0009","file":"v0009-20261007150846.html","time":"20261007 150846"},
  {"id":"v0010","file":"v0010-20261007151308.html","time":"20261007 151308"},
  {"id":"v0011","file":"v0011-20261007151312.html","time":"20261007 151312"},
  {"id":"v0012","file":"v0012-20261007151314.html","time":"20261007 151314"},
  {"id":"v0013","file":"v0013-20261007151718.html","time":"20261007 151718"},
  {"id":"v0014","file":"v0014-20261007151721.html","time":"20261007 151721"},
  {"id":"v0015","file":"v0015-20261007151723.html","time":"20261007 151723"},
  {"id":"v0016","file":"v0016-20261007160034.html","time":"20261007 160034"},
  {"id":"v0017","file":"v0017-20261007160305.html","time":"20261007 160305"},
  {"id":"v0018","file":"v0018-20261007160452.html","time":"20261007 160452"},
  {"id":"v0019","file":"v0019-20261007160926.html","time":"20261007 160926"},
  {"id":"v0020","file":"v0020-20261007162302.html","time":"20261007 162302"},
  {"id":"v0021","file":"v0021-20261007162457.html","time":"20261007 162457"},
  {"id":"v0022","file":"v0022-20261007180019.html","time":"20261007 180019"},
  {"id":"v0023","file":"v0023-20261007180438.html","time":"20261007 180438"},
  {"id":"v0024","file":"v0024-20261007180713.html","time":"20261007 180713"},
  {"id":"v0025","file":"v0025-20261007180802.html","time":"20261007 180802"},
  {"id":"v0026","file":"v0026-20261007193707.html","time":"20261007 193707"},
  {"id":"v0027","file":"v0027-20261008071150.html","time":"20261008 071150"},
  {"id":"v0028","file":"v0028-20261008224205.html","time":"20261008 224205"},
  {"id":"v0029","file":"v0029-20261008224723.html","time":"20261008 224723"},
  {"id":"v0030","file":"v0030-20261009195132.html","time":"20261009 195132"},
  {"id":"v0031","file":"v0031-20261009200209.html","time":"20261009 200209"},
  {"id":"v0032","file":"v0032-20261009202341.html","time":"20261009 202341"},
  {"id":"v0033","file":"v0033-20261009203747.html","time":"20261009 203747"},
  {"id":"v0034","file":"v0034-20261009212000.html","time":"20261009 212000"},
  {"id":"v0035","file":"v0035-20261009213558.html","time":"20261009 213558"},
  {"id":"v0036","file":"v0036-20261009215137.html","time":"20261009 215137"},
  {"id":"v0037","file":"v0037-20261009220738.html","time":"20261009 220738"},
  {"id":"v0038","file":"v0038-20261009221059.html","time":"20261009 221059"},
  {"id":"v0039","file":"v0039-20261009221610.html","time":"20261009 221610"},
  {"id":"v0040","file":"v0040-20261009223845.html","time":"20261009 223845"},
  {"id":"v0041","file":"v0041-20261011091748.html","time":"20261011 091748"},
  {"id":"v0042","file":"v0042-20261011092350.html","time":"20261011 092350"},
  {"id":"v0043","file":"v0043-20261011092810.html","time":"20261011 092810"},
  {"id":"v0044","file":"v0044-20261011171803.html","time":"20261011 171803"}
];

const N = versions.length;
const IMAGES = ['这是一张图.jpg','这又是一张图.jpg']
  .map(n => 'https://21306.top/np/v2/' + encodeURIComponent(n));

/* ---------------- DOM ---------------- */
const viewer       = document.getElementById('viewer');
const viewerHint   = document.getElementById('viewerHint');
const track        = document.getElementById('track');
const ruler        = document.getElementById('ruler');
const progress     = document.getElementById('progress');
const curVer       = document.getElementById('curVer');
const curTimeShort = document.getElementById('curTimeShort');
const curTimeFull  = document.getElementById('curTimeFull');
const preloadInfo  = document.getElementById('preloadInfo');
const preloadText  = document.getElementById('preloadText');
const playBtn      = document.getElementById('playBtn');
const prevBtn      = document.getElementById('prevBtn');
const nextBtn      = document.getElementById('nextBtn');
const globalTip    = document.getElementById('globalTip');

/* ---------------- 状态 ---------------- */
let currentIndex = 0;
let isPlaying    = false;
let playTimer    = null;
let swapTimer    = null;
let loading      = false;

const PLAY_SPEED = 200;
const WARM_POOL  = 8;

const markers = [];
const buffers = [];
let front = 0, frontVersion = -1, pending = -1;

const preloaded = new Array(N).fill(false);
preloaded[0] = true;
let plHead = 0;

const htmlCache = new Array(N).fill(null);
const inflight  = new Map();

/* ==========================================================================
   位置计算：每版一格，圆点在格心
   — 关键：从 100% 全长计算，不再预留左右 9px 内边距
   ========================================================================== */
const markerLeft = i =>
  `calc(100% * ${(((i + 0.5) / N).toFixed(6))})`;

const spanLeft = start =>
  `calc(100% * ${((start / N).toFixed(6))})`;

const spanWidth = (start, end) =>
  `calc(100% * ${(((end - start + 1) / N).toFixed(6))})`;

/* ==========================================================================
   统一加载入口
   ========================================================================== */
function fetchHTML(i) {
  if (htmlCache[i]) return Promise.resolve(htmlCache[i]);
  if (inflight.has(i)) return inflight.get(i);

  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 8000);

  const p = fetch(versions[i].file, { cache: 'default', signal: ctrl.signal })
    .then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.text();
    })
    .then(t => {
      htmlCache[i] = t;
      markPreloaded(i, true);
      return t;
    })
    .finally(() => {
      clearTimeout(timeout);
      inflight.delete(i);
    });

  inflight.set(i, p);
  return p;
}

/* ==========================================================================
   全局 tooltip
   ========================================================================== */
let tipTarget = null;
let tipHideTimer = null;

function showTip(target, text) {
  clearTimeout(tipHideTimer);
  tipTarget = target;
  globalTip.textContent = text;
  globalTip.classList.add('is-visible');
  globalTip.setAttribute('aria-hidden', 'false');
  positionTip(target);
}

function positionTip(target) {
  if (!target) return;
  const tr = target.getBoundingClientRect();
  const pr = globalTip.getBoundingClientRect();

  const GAP = 10;
  const EDGE = 4;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let below = false;
  let top = tr.top - pr.height - GAP;
  if (top < EDGE) {
    top = tr.bottom + GAP;
    below = true;
  }
  if (top + pr.height > vh - EDGE) {
    top = Math.max(EDGE, vh - pr.height - EDGE);
    below = top > tr.top;
  }

  let left = tr.left + tr.width / 2 - pr.width / 2;
  if (left < EDGE) left = EDGE;
  if (left + pr.width > vw - EDGE) left = vw - pr.width - EDGE;

  globalTip.style.top  = top  + 'px';
  globalTip.style.left = left + 'px';
  globalTip.classList.toggle('is-below', below);
}

function hideTip() {
  tipTarget = null;
  globalTip.classList.remove('is-visible');
  globalTip.setAttribute('aria-hidden', 'true');
}

function repositionTip() {
  if (tipTarget && globalTip.classList.contains('is-visible')) {
    positionTip(tipTarget);
  }
}

/* ==========================================================================
   工具
   ========================================================================== */
function markPreloaded(i, ok) {
  if (i < 0 || i >= N || preloaded[i]) return;
  if (!ok) return;
  preloaded[i] = true;
  while (plHead + 1 < N && preloaded[plHead + 1]) plHead++;
  progress.style.width = spanWidth(0, plHead);
}

function parts(t) {
  return {
    y:  t.slice(0, 4), mo: t.slice(4, 6), d: t.slice(6, 8),
    h:  t.slice(9, 11), mi: t.slice(11, 13)
  };
}
function fullTime(t) {
  const p = parts(t);
  return `${p.y}年${parseInt(p.mo,10)}月${parseInt(p.d,10)}日 ${p.h}:${p.mi}`;
}
function shortTime(t) {
  const p = parts(t);
  return `${p.mo}/${p.d} ${p.h}:${p.mi}`;
}

/* ==========================================================================
   时间轴构建
   ========================================================================== */
function groupByDay() {
  const groups = [];
  let cur = null;
  versions.forEach((v, i) => {
    const key = v.time.slice(4, 6) + '/' + v.time.slice(6, 8);
    if (!cur || cur.key !== key) {
      cur = { key, start: i, end: i };
      groups.push(cur);
    } else {
      cur.end = i;
    }
  });
  return groups;
}

function buildBands(groups) {
  groups.forEach((g, gi) => {
    const band = document.createElement('div');
    band.className = 'tl-band' + (gi % 2 ? ' is-alt' : '');
    band.style.left  = spanLeft(g.start);
    band.style.width = spanWidth(g.start, g.end);
    track.appendChild(band);
  });
}

function buildMarkers() {
  versions.forEach((v, i) => {
    const m = document.createElement('div');
    m.className = 'tl-marker';
    m.style.left = markerLeft(i);
    m.setAttribute('role', 'button');
    m.setAttribute('aria-label', `${v.id} · ${fullTime(v.time)}`);

    const label = `${v.id} · ${shortTime(v.time)}`;

    m.addEventListener('pointerenter', e => {
      if (e.pointerType === 'mouse') showTip(m, label);
    });
    m.addEventListener('pointerleave', e => {
      if (e.pointerType === 'mouse') hideTip();
    });
    m.addEventListener('pointerdown', e => {
      e.stopPropagation();
      if (e.pointerType !== 'mouse') showTip(m, label);
    });
    m.addEventListener('click', e => {
      e.stopPropagation();
      goTo(i);
      if (e.pointerType !== 'mouse') {
        clearTimeout(tipHideTimer);
        tipHideTimer = setTimeout(hideTip, 1500);
      }
    });

    track.appendChild(m);
    markers.push(m);
  });
}

function buildRuler(groups) {
  groups.forEach((g, gi) => {
    const item = document.createElement('div');
    item.className = 'tl-ruler__item' + (gi === 0 ? ' is-first' : '');
    item.style.left  = spanLeft(g.start);
    item.style.width = spanWidth(g.start, g.end);

    const total = g.end - g.start + 1;
    item.dataset.full  = `${g.key} · ${total}版`;
    item.dataset.short = g.key;
    item.dataset.tiny  = g.key.slice(3);
    item.title = `${g.key} · 共 ${total} 版`;
    item.textContent = item.dataset.full;

    ruler.appendChild(item);
  });
}

function updateMeta(i) {
  currentIndex = i;
  const v = versions[i];

  curVer.textContent       = v.id;
  curTimeShort.textContent = shortTime(v.time);
  curTimeFull.textContent  = fullTime(v.time);

  markers.forEach((m, k) => m.classList.toggle('is-active', k === i));

  track.setAttribute('aria-valuenow', String(i));
  track.setAttribute('aria-valuetext', `${v.id} · ${fullTime(v.time)}`);

  repositionTip();
}

/* ==========================================================================
   双缓冲渲染
   ========================================================================== */
function attachFrameKeys(f) {
  try {
    const doc = f.contentDocument;
    if (!doc || doc.__keysBound) return;
    doc.__keysBound = true;
    doc.addEventListener('keydown', e => {
      const ev = new KeyboardEvent('keydown', {
        key: e.key, code: e.code, bubbles: true, cancelable: true
      });
      const notPrevented = document.dispatchEvent(ev);
      if (!notPrevented) { e.preventDefault(); e.stopPropagation(); }
    }, true);
  } catch (_) {}
}

function createBuffer() {
  const f = document.createElement('iframe');
  f.className = 'viewer__frame';
  f.setAttribute('allowfullscreen', '');
  f.setAttribute('title', '版本预览');
  viewer.appendChild(f);
  buffers.push(f);
  return f;
}

function writeToBuffer(buf, html) {
  const doc = buf.contentDocument || buf.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();
  attachFrameKeys(buf);
}

function swapBuffers(i) {
  const nb = buffers[1 - front];
  const ob = buffers[front];

  nb.style.zIndex = '6';
  ob.style.zIndex = '5';
  nb.classList.add('is-active');

  front = 1 - front;
  frontVersion = i;
  viewerHint.classList.add('is-hidden');

  clearTimeout(swapTimer);
  swapTimer = setTimeout(() => {
    ob.classList.remove('is-active');
    ob.style.zIndex = '';
  }, 150);
}

const nextFrame = () => new Promise(r => requestAnimationFrame(r));

/* ==========================================================================
   核心加载流程
   ========================================================================== */
async function processLoad(startI) {
  let i = startI;

  while (true) {
    if (frontVersion === i) {
      loading = false;
      if (pending === i && isPlaying) scheduleNextTick();
      return;
    }

    let html;
    try {
      html = await fetchHTML(i);
    } catch (e) {
      loading = false;
      return;
    }

    if (pending !== i) { i = pending; continue; }

    const nb = buffers[1 - front];
    writeToBuffer(nb, html);

    await nextFrame();
    await nextFrame();

    if (frontVersion === i) {
      loading = false;
      if (pending === i && isPlaying) scheduleNextTick();
      return;
    }

    swapBuffers(i);

    if (pending === i) {
      loading = false;
      if (isPlaying) scheduleNextTick();
      return;
    }
    i = pending;
  }
}

function goTo(i) {
  if (i < 0 || i >= N) return;
  if (i === currentIndex && frontVersion === i) return;

  updateMeta(i);
  pending = i;

  if (frontVersion === i) return;
  if (loading) return;

  loading = true;
  processLoad(i);
}

/* ==========================================================================
   播放控制
   ========================================================================== */
function scheduleNextTick() {
  clearTimeout(playTimer);
  playTimer = setTimeout(tick, PLAY_SPEED);
}

function tick() {
  if (!isPlaying) return;
  if (currentIndex >= N - 1) {
    isPlaying = false;
    playBtn.textContent = '▶';
    playBtn.setAttribute('aria-label', '播放');
    clearTimeout(playTimer);
    return;
  }
  goTo(currentIndex + 1);
}

function togglePlay() {
  isPlaying = !isPlaying;
  playBtn.textContent = isPlaying ? '⏸' : '▶';
  playBtn.setAttribute('aria-label', isPlaying ? '暂停' : '播放');
  clearTimeout(playTimer);
  if (isPlaying) tick();
}

function prev() { goTo(currentIndex - 1); }
function next() { goTo(currentIndex + 1); }

/* ==========================================================================
   轨道拖动定位
   ========================================================================== */
let scrubbing = false, scrubRaf = null, scrubX = 0;

/* 关键：直接按轨道全宽（100%）映射，无左右内边距 */
function indexFromX(clientX) {
  const rect = track.getBoundingClientRect();
  const usable = rect.width;
  if (usable <= 0) return 0;
  const r = (clientX - rect.left) / usable;
  return Math.max(0, Math.min(N - 1, Math.floor(r * N)));
}

function queueScrub(x) {
  scrubX = x;
  if (scrubRaf) return;
  scrubRaf = requestAnimationFrame(() => {
    scrubRaf = null;
    goTo(indexFromX(scrubX));
  });
}

track.addEventListener('pointerdown', e => {
  scrubbing = true;
  track.classList.add('is-scrubbing');
  try { if (track.setPointerCapture) track.setPointerCapture(e.pointerId); } catch (_) {}
  queueScrub(e.clientX);
});
track.addEventListener('pointermove', e => { if (scrubbing) queueScrub(e.clientX); });

function endScrub() {
  scrubbing = false;
  track.classList.remove('is-scrubbing');
}
track.addEventListener('pointerup', endScrub);
track.addEventListener('pointercancel', endScrub);
track.addEventListener('lostpointercapture', endScrub);

/* ==========================================================================
   图片预热
   ========================================================================== */
function warmImages() {
  IMAGES.forEach(u => {
    const im = new Image();
    im.decoding = 'async';
    im.src = u;
    if (im.decode) im.decode().catch(() => {});
  });
}

/* ==========================================================================
   后台预加载
   ========================================================================== */
function startWarmer() {
  let cursor   = 1;
  let active   = 0;
  let done     = 1;
  let finished = false;

  const updateLabel = () => {
    if (finished) {
      preloadText.textContent = done >= N
        ? '全部就绪'
        : `就绪 ${done} / ${N}`;
    } else {
      preloadText.textContent = `预加载 ${done} / ${N}`;
    }
  };

  const pump = () => {
    if (finished) return;
    if (cursor >= N) {
      if (active === 0) {
        finished = true;
        updateLabel();
        preloadInfo.classList.add('is-done');
      }
      return;
    }
    const idx = cursor++;
    active++;

    fetchHTML(idx)
      .catch(() => {})
      .finally(() => {
        active--;
        done++;
        updateLabel();
        pump();
      });
  };

  for (let i = 0; i < WARM_POOL; i++) pump();
  updateLabel();
}

/* ==========================================================================
   响应式布局
   ========================================================================== */
function updateTrackLayout() {
  const w = track.offsetWidth;
  if (w <= 0) return;

  /* 关键：轨道宽度即全宽，无内边距扣除 */
  const usable = w;
  const gap = usable / Math.max(1, N);

  const ms = Math.max(5, Math.min(16, gap * 0.72));
  const th = Math.max(40, Math.min(56, ms * 3.6));

  track.style.height = th + 'px';
  track.style.setProperty('--ms', ms + 'px');

  const items = ruler.children;
  for (let k = 0; k < items.length; k++) {
    const el = items[k];
    const wpx = parseFloat(getComputedStyle(el).width) || 0;
    if (wpx >= 82)      el.textContent = el.dataset.full;
    else if (wpx >= 44) el.textContent = el.dataset.short;
    else                el.textContent = el.dataset.tiny;
  }

  repositionTip();
}

/* ==========================================================================
   窗口尺寸变化
   ========================================================================== */
let rzT;
function onResize() {
  track.classList.add('is-resizing');
  clearTimeout(rzT);
  rzT = setTimeout(() => {
    updateTrackLayout();
    track.classList.remove('is-resizing');
  }, 120);
}
window.addEventListener('resize', onResize);
window.addEventListener('orientationchange', onResize);
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', onResize);
}
window.addEventListener('scroll', repositionTip, { passive: true, capture: true });

/* ==========================================================================
   事件绑定
   ========================================================================== */
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', prev);
nextBtn.addEventListener('click', next);

document.addEventListener('keydown', e => {
  const t = e.target;
  if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;

  switch (e.key) {
    case 'ArrowLeft':  e.preventDefault(); prev(); break;
    case 'ArrowRight': e.preventDefault(); next(); break;
    case ' ':
    case 'Spacebar':
      e.preventDefault(); togglePlay(); break;
    case 'Home': e.preventDefault(); goTo(0); break;
    case 'End':  e.preventDefault(); goTo(N - 1); break;
  }
});

document.addEventListener('pointerdown', e => {
  if (globalTip.classList.contains('is-visible')) {
    if (!e.target.closest || !e.target.closest('.tl-marker')) hideTip();
  }
}, true);

let lastTouchEnd = 0;
document.addEventListener('touchend', e => {
  const now = Date.now();
  if (now - lastTouchEnd <= 300 && e.touches.length === 0) e.preventDefault();
  lastTouchEnd = now;
}, { passive: false });

document.addEventListener('touchmove', e => {
  if (e.touches.length > 1) e.preventDefault();
}, { passive: false });

/* ==========================================================================
   初始化
   ========================================================================== */
async function init() {
  createBuffer();
  createBuffer();

  const groups = groupByDay();
  buildBands(groups);
  buildMarkers();
  buildRuler(groups);
  updateTrackLayout();

  frontVersion = 0;
  pending = 0;
  updateMeta(0);

  try {
    const html = await fetchHTML(0);
    writeToBuffer(buffers[0], html);
    buffers[0].classList.add('is-active');

    await nextFrame();
    await nextFrame();
    viewerHint.classList.add('is-hidden');
  } catch (e) {
    buffers[0].src = versions[0].file;
    buffers[0].classList.add('is-active');
    buffers[0].addEventListener('load', () => {
      attachFrameKeys(buffers[0]);
      viewerHint.classList.add('is-hidden');
    });
    setTimeout(() => viewerHint.classList.add('is-hidden'), 2500);
  }

  warmImages();
  startWarmer();
}

if (N > 0) {
  init();
} else {
  viewerHint.textContent = '暂无版本数据';
}