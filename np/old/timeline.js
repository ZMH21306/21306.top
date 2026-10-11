/* ==========================================================================
   语文5组的神秘报纸 · 版本时间轴
   — 重写 UI · 修复全部已知缺陷 · 全设备适配
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

const PLAY_SPEED  = 200;   // 每版停留 ms
const COMMIT_WAIT = 1500;  // 兜底提交 ms
const WARM_POOL   = 6;     // 预加载并发

const markers = [];
const buffers = [];
let front = 0, frontVersion = -1, backVersion = -1, pending = -1, loading = false;

const preloaded = new Array(N).fill(false);
preloaded[0] = true;
let plHead = 0;

const htmlCache = new Array(N).fill(null);

/* ==========================================================================
   工具函数
   ========================================================================== */

<<<<<<< HEAD
/* N=1 时 R(i) 退化为 0，避免除零 → NaN */
const R = i => (N <= 1 ? 0 : i / (N - 1));

const leftOf = i => `calc(9px + (100% - 18px) * ${R(i).toFixed(6)})`;
const spanOf = (a, b) =>
  `calc((100% - 18px) * ${Math.max(0, R(b) - R(a)).toFixed(6)})`;

function markPreloaded(i, ok) {
  if (i < 0 || i >= N || preloaded[i]) return;
  if (!ok) return;
  preloaded[i] = true;
  while (plHead + 1 < N && preloaded[plHead + 1]) plHead++;
  progress.style.width = spanOf(0, plHead);
=======
function markPreloaded(i) {
    if (i < 0 || i >= N || preloaded[i]) return;
    preloaded[i] = true;
    while (plHead + 1 < N && preloaded[plHead + 1]) plHead++;
    progress.style.width = spanOf(0, plHead);
>>>>>>> parent of 827ef38 (更新 timeline.js)
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
   时间轴构建
   ========================================================================== */
function buildTrack() {
  /* 日期分组背景带 */
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

  groups.forEach((g, gi) => {
    const band = document.createElement('div');
    band.className = 'tl-band' + (gi % 2 ? ' is-alt' : '');
    band.style.left  = leftOf(g.start);
    band.style.width = spanOf(g.start, g.end);

    const lb = document.createElement('span');
    lb.className = 'tl-band__label' + (gi === groups.length - 1 ? ' is-right' : '');
    lb.textContent = `${g.key} · ${g.end - g.start + 1}版`;
    band.appendChild(lb);

    track.appendChild(band);
  });

  /* 版本圆点 */
  versions.forEach((v, i) => {
    const m = document.createElement('div');
    m.className = 'tl-marker';
    m.style.left = leftOf(i);

    const tip = document.createElement('span');
    tip.className = 'tl-tip';
    tip.textContent = `${v.id} · ${shortTime(v.time)}`;
    m.appendChild(tip);

    /* 阻止 pointerdown 冒泡，避免点击标记时轨道也走一遍 scrub */
    m.addEventListener('pointerdown', e => e.stopPropagation());
    m.addEventListener('click', e => {
      e.stopPropagation();
      goTo(i);
    });

    track.appendChild(m);
    markers.push(m);
  });
}

function updateMeta(i) {
  currentIndex = i;
  const v = versions[i];

  curVer.textContent   = v.id;
  curTime.textContent  = fullTime(v.time);
  curCount.textContent = `第 ${i + 1} / ${N} 版`;

  markers.forEach((m, k) => m.classList.toggle('is-active', k === i));

  /* a11y：同步 slider 值 */
  track.setAttribute('aria-valuenow', String(i));
  track.setAttribute('aria-valuetext', `${v.id} · ${fullTime(v.time)}`);
}

/* ==========================================================================
   双缓冲渲染
   ========================================================================== */

/* iframe 内 keydown 转发：解决聚焦 iframe 后父页面快捷键失效 */
function attachFrameKeys(f) {
  try {
    const doc = f.contentDocument;
    if (!doc || doc.__keysBound) return;
    doc.__keysBound = true;
    doc.addEventListener('keydown', e => {
      const ev = new KeyboardEvent('keydown', {
        key: e.key,
        code: e.code,
        bubbles: true,
        cancelable: true
      });
      const notPrevented = document.dispatchEvent(ev);
      if (!notPrevented) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  } catch (_) { /* 跨域则静默忽略 */ }
}

function createBuffer() {
  const f = document.createElement('iframe');
  f.className = 'viewer__frame';
  f.setAttribute('allowfullscreen', '');
  f.setAttribute('title', '版本预览');
  f.setAttribute('scrolling', 'auto');
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
  if (frontVersion === i) return;   // 已在前台
  if (loading) return;              // 有加载在途，commit 后自动补载
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
    /* 缓存命中：直接写入，跳过网络请求 */
    const doc = b.contentDocument || b.contentWindow.document;
    doc.open();
    doc.write(htmlCache[i]);
    doc.close();
    attachFrameKeys(b);
    /* doc.write 不触发 load：双 rAF 等待布局完成再提交，避免闪白 */
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (backVersion === i) commit(i);
    }));
  } else {
    b.src = versions[i].file;
  }
}

function commit(i) {
  /* 无论如何先清掉计时器，防止残留空回调 */
  clearTimeout(loadTimer);

  /* 目标已在前台：不交换，但必须把播放/加载流水线接回去 */
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

function indexFromX(clientX) {
  const rect = track.getBoundingClientRect();
  const usable = rect.width - 18;
  if (usable <= 0) return 0;
  const r = (clientX - rect.left - 9) / usable;
  return Math.max(0, Math.min(N - 1, Math.round(r * (N - 1))));
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
   — 用 attempted 判定完成，任一版失败也不会让计数停滞
   ========================================================================== */
function startWarmer() {
<<<<<<< HEAD
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
      .catch(() => { /* 失败不计入连续进度 */ })
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
=======
    const POOL = 6;
    let nextIdx = 1, loaded = 1, finished = false;
    const pump = () => {
        if (finished || nextIdx >= N) return;
        const idx = nextIdx++;
        const done = () => {
            loaded++;
            markPreloaded(idx);
            preloadText.textContent = '后台预加载 ' + loaded + ' / ' + N;
            if (loaded >= N) {
                finished = true;
                preloadText.textContent = '后台预加载完成';
                preloadInfo.classList.add('done');
            } else {
                setTimeout(pump, 0);
            }
        };
        fetch(versions[idx].file, { cache: 'default' })
            .then(r => r.text())
            .then(t => { htmlCache[idx] = t; done(); })
            .catch(done);
    };
    for (let k = 0; k < Math.min(POOL, N - 1); k++) pump();
>>>>>>> parent of 827ef38 (更新 timeline.js)
}

/* ==========================================================================
   响应式布局
   — marker 只作锚点，尺寸由 --ms 决定；位置由 left 决定
   ========================================================================== */
function updateTrackLayout() {
  const w = track.offsetWidth;
  if (w <= 0) return;

  const usable = w - 18;
  const gap = usable / Math.max(1, N - 1);

  /* 圆点尺寸：间距的 75%，钳制在 4–16px */
  const ms = Math.max(4, Math.min(16, gap * 0.75));
  /* 轨道高度：随圆点尺寸微调，32–52px */
  const th = Math.max(32, Math.min(52, ms * 3.5));

  track.style.height = th + 'px';
  track.style.setProperty('--ms', ms + 'px');
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

/* visualViewport：移动端地址栏伸缩 */
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
  /* 忽略输入框内的按键 */
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

/* 移动端双击缩放抑制（保留单指操作与双指缩放） */
let lastTouchEnd = 0;
document.addEventListener('touchend', e => {
  const now = Date.now();
  if (now - lastTouchEnd <= 300 && e.touches.length === 0) {
    e.preventDefault();
  }
  lastTouchEnd = now;
}, { passive: false });

/* 阻止 iOS 橡皮筋 */
document.addEventListener('touchmove', e => {
  if (e.touches.length > 1) e.preventDefault();
}, { passive: false });

/* ==========================================================================
   初始化
   ========================================================================== */
function init() {
  createBuffer();
  createBuffer();
  buildTrack();
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

  /* 延迟启动预加载，避免阻塞首帧 */
  setTimeout(startWarmer, 800);
}

if (N > 0) {
  init();
} else {
  viewerHint.textContent = '暂无版本数据';
}