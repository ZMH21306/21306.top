/* ==========================================================================
   语文5组的神秘报纸 · 版本时间轴
   — 布局模型：每个版本占一"格" · 圆点居中 · 日期标尺独立成行
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
  {"id":"v0043","file":"v0043-20261011092810.html","time":"20261011 092810"}
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
const curTime      = document.getElementById('curTime');
const curCount     = document.getElementById('curCount');
const preloadInfo  = document.getElementById('preloadInfo');
const preloadText  = document.getElementById('preloadText');
const playBtn      = document.getElementById('playBtn');
const prevBtn      = document.getElementById('prevBtn');
const nextBtn      = document.getElementById('nextBtn');

/* ---------------- 状态 ---------------- */
let currentIndex = 0;
let isPlaying    = false;
let playTimer    = null;
let loadTimer    = null;
let swapTimer    = null;

const PLAY_SPEED  = 200;
const COMMIT_WAIT = 1500;
const WARM_POOL   = 6;

const markers = [];
const buffers = [];
let front = 0, frontVersion = -1, backVersion = -1, pending = -1, loading = false;

const preloaded = new Array(N).fill(false);
preloaded[0] = true;
let plHead = 0;

const htmlCache = new Array(N).fill(null);

/* ==========================================================================
   位置计算：每版一格，圆点在格心
   — 可用宽度 = 100% - 18px（左右各 9px 留白）
   — 第 i 版占 [i/N, (i+1)/N] 区间
   ========================================================================== */

/* 圆点中心：位于该格正中央 */
const markerLeft = i =>
  `calc(9px + (100% - 18px) * ${(((i + 0.5) / N).toFixed(6))})`;

/* 分段左边界：第 start 版格的左沿 */
const spanLeft = start =>
  `calc(9px + (100% - 18px) * ${((start / N).toFixed(6))})`;

/* 分段宽度：从 start 到 end（含）共占几格 */
const spanWidth = (start, end) =>
  `calc((100% - 18px) * ${(((end - start + 1) / N).toFixed(6))})`;

/* ==========================================================================
   工具
   ========================================================================== */
function markPreloaded(i, ok) {
  if (i < 0 || i >= N || preloaded[i]) return;
  if (!ok) return;
  preloaded[i] = true;
  while (plHead + 1 < N && preloaded[plHead + 1]) plHead++;
  /* 进度长度 = 已缓存前 plHead+1 个版本的总宽度 */
  progress.style.width = spanWidth(0, plHead);
}

function parts(t) {
  return {
    y:  t.slice(0, 4),
    mo: t.slice(4, 6),
    d:  t.slice(6, 8),
    h:  t.slice(9, 11),
    mi: t.slice(11, 13)
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
   时间轴构建（三段：背景带 / 圆点 / 日期标尺）
   ========================================================================== */

/* 按日期分组 */
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

/* 背景带：仅作视觉分组，无文字 */
function buildBands(groups) {
  groups.forEach((g, gi) => {
    const band = document.createElement('div');
    band.className = 'tl-band' + (gi % 2 ? ' is-alt' : '');
    band.style.left  = spanLeft(g.start);
    band.style.width = spanWidth(g.start, g.end);
    track.appendChild(band);
  });
}

/* 圆点 */
function buildMarkers() {
  versions.forEach((v, i) => {
    const m = document.createElement('div');
    m.className = 'tl-marker';
    m.style.left = markerLeft(i);

    const tip = document.createElement('span');
    tip.className = 'tl-tip';
    tip.textContent = `${v.id} · ${shortTime(v.time)}`;
    m.appendChild(tip);

    m.addEventListener('pointerdown', e => e.stopPropagation());
    m.addEventListener('click', e => {
      e.stopPropagation();
      goTo(i);
    });

    track.appendChild(m);
    markers.push(m);
  });
}

/* 日期标尺：独立行，永不与圆点重叠 */
function buildRuler(groups) {
  groups.forEach((g, gi) => {
    const item = document.createElement('div');
    item.className = 'tl-ruler__item' + (gi === 0 ? ' is-first' : '');
    item.style.left  = spanLeft(g.start);
    item.style.width = spanWidth(g.start, g.end);

    const total = g.end - g.start + 1;
    /* 优先显示 "10/07 · 26版"，若过窄则退化为 "10/07"，再窄则退化为 "07" */
    item.textContent = `${g.key} · ${total}版`;
    item.dataset.short = g.key;
    item.dataset.tiny  = g.key.slice(3);
    item.title = `${g.key} · 共 ${total} 版`;

    ruler.appendChild(item);
  });
}

function updateMeta(i) {
  currentIndex = i;
  const v = versions[i];

  curVer.textContent   = v.id;
  curTime.textContent  = fullTime(v.time);
  curCount.textContent = `第 ${i + 1} / ${N} 版`;

  markers.forEach((m, k) => m.classList.toggle('is-active', k === i));

  track.setAttribute('aria-valuenow', String(i));
  track.setAttribute('aria-valuetext', `${v.id} · ${fullTime(v.time)}`);
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
  f.addEventListener('load', () => attachFrameKeys(f));
  viewer.appendChild(f);
  buffers.push(f);
  return f;
}

function goTo(i) {
  if (i < 0 || i >= N) return;
  if (i === currentIndex && frontVersion === i) return;
  updateMeta(i);
  pending = i;
  if (frontVersion === i) return;
  if (loading) return;
  loadIntoBack(i);
}

function loadIntoBack(i) {
  if (i < 0 || i >= N) return;
  const b = buffers[1 - front];
  backVersion = i;
  loading = true;

  clearTimeout(loadTimer);
  b.onload  = () => { if (backVersion === i) commit(i); };
  b.onerror = () => { if (backVersion === i) commit(i); };
  loadTimer = setTimeout(() => { if (backVersion === i) commit(i); }, COMMIT_WAIT);

  if (htmlCache[i]) {
    const doc = b.contentDocument || b.contentWindow.document;
    doc.open();
    doc.write(htmlCache[i]);
    doc.close();
    attachFrameKeys(b);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (backVersion === i) commit(i);
    }));
  } else {
    b.src = versions[i].file;
  }
}

function commit(i) {
  clearTimeout(loadTimer);

  if (frontVersion === i) {
    loading = false;
    backVersion = -1;
    if (pending !== i) {
      loadIntoBack(pending);
    } else if (isPlaying) {
      clearTimeout(playTimer);
      playTimer = setTimeout(tick, PLAY_SPEED);
    }
    return;
  }

  loading = false;
  const nb = buffers[1 - front];
  const ob = buffers[front];

  nb.style.zIndex = '6';
  ob.style.zIndex = '5';
  nb.classList.add('is-active');

  front = 1 - front;
  frontVersion = i;
  backVersion = -1;
  viewerHint.classList.add('is-hidden');

  clearTimeout(swapTimer);
  swapTimer = setTimeout(() => {
    ob.classList.remove('is-active');
    ob.style.zIndex = '';
  }, 120);

  if (pending !== i) {
    loadIntoBack(pending);
  } else if (isPlaying) {
    clearTimeout(playTimer);
    playTimer = setTimeout(tick, PLAY_SPEED);
  }
}

/* ==========================================================================
   播放控制
   ========================================================================== */
function prev() { goTo(currentIndex - 1); }
function next() { goTo(currentIndex + 1); }

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

/* ==========================================================================
   轨道拖动定位
   ========================================================================== */
let scrubbing = false, scrubRaf = null, scrubX = 0;

/* 每版一格：r 落在哪格就是哪版 */
function indexFromX(clientX) {
  const rect = track.getBoundingClientRect();
  const usable = rect.width - 18;
  if (usable <= 0) return 0;
  const r = (clientX - rect.left - 9) / usable;
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
  let nextIdx   = 1;
  let loaded    = 1;
  let attempted = 1;
  let finished  = false;

  const updateLabel = () => {
    if (attempted >= N) {
      preloadText.textContent = loaded >= N
        ? '后台预加载完成'
        : `预加载完成（${loaded} / ${N}，部分失败）`;
    } else {
      preloadText.textContent = `后台预加载 ${loaded} / ${N}`;
    }
  };

  const pump = () => {
    if (finished || nextIdx >= N) return;
    const idx = nextIdx++;

    fetch(versions[idx].file, { cache: 'default' })
      .then(r => r.text())
      .then(t => {
        htmlCache[idx] = t;
        loaded++;
        markPreloaded(idx, true);
      })
      .catch(() => {})
      .finally(() => {
        attempted++;
        updateLabel();
        if (attempted >= N) {
          finished = true;
          preloadInfo.classList.add('is-done');
        } else {
          setTimeout(pump, 0);
        }
      });
  };

  for (let k = 0; k < Math.min(WARM_POOL, N - 1); k++) pump();
  updateLabel();
}

/* ==========================================================================
   响应式布局
   — 圆点尺寸随宽度自适应；标尺文字按组宽度分级降级
   ========================================================================== */
function updateTrackLayout() {
  const w = track.offsetWidth;
  if (w <= 0) return;

  const usable = w - 18;
  const gap = usable / Math.max(1, N);

  /* 圆点尺寸：格宽的 72%，钳制 4–16px */
  const ms = Math.max(4, Math.min(16, gap * 0.72));
  const th = Math.max(32, Math.min(52, ms * 3.5));

  track.style.height = th + 'px';
  track.style.setProperty('--ms', ms + 'px');

  /* 日期标尺文字分级降级，避免过窄被截成省略号 */
  const items = ruler.children;
  for (let k = 0; k < items.length; k++) {
    const el = items[k];
    const wpx = parseFloat(getComputedStyle(el).width) || 0;
    if (wpx >= 78) {
      el.textContent = el.title.split(' · ')[0] + ' · ' + el.title.match(/共 (\d+) 版/)[1] + '版';
    } else if (wpx >= 42) {
      el.textContent = el.dataset.short;
    } else {
      el.textContent = el.dataset.tiny;
    }
  }
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
function init() {
  createBuffer();
  createBuffer();

  const groups = groupByDay();
  buildBands(groups);
  buildMarkers();
  buildRuler(groups);

  updateTrackLayout();

  frontVersion = 0;
  pending = 0;

  buffers[0].addEventListener('load', () => {
    attachFrameKeys(buffers[0]);
    viewerHint.classList.add('is-hidden');
  });

  setTimeout(() => viewerHint.classList.add('is-hidden'), 2500);

  buffers[0].src = versions[0].file;
  buffers[0].classList.add('is-active');
  updateMeta(0);

  warmImages();
  setTimeout(startWarmer, 800);
}

if (N > 0) {
  init();
} else {
  viewerHint.textContent = '暂无版本数据';
}