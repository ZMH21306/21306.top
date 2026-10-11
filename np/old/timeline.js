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
const IMAGES = ['这是一张图.jpg','这又是一张图.jpg'].map(n => 'https://21306.top/np/v2/' + encodeURIComponent(n));

let currentIndex = 0, isPlaying = false, playTimer = null;
const playSpeed = 200;

const viewer = document.getElementById('viewer');
const track = document.getElementById('track');
const progress = document.getElementById('progress');
const curVer = document.getElementById('curVer');
const curTime = document.getElementById('curTime');
const curCount = document.getElementById('curCount');
const playBtn = document.getElementById('playBtn');
const viewerHint = document.getElementById('viewerHint');
const preloadInfo = document.getElementById('preloadInfo');
const preloadText = document.getElementById('preloadText');

const markers = [];

// ========== 预缓存方案 ==========
const CONCURRENCY = Math.min(8, N);
const iframePool = [];
const iframeReady = new Array(N).fill(false);
let preloadedCount = 0;
let poolLoadingDone = false;

function createBufferedIframe(index) {
    const iframe = document.createElement('iframe');
    iframe.className = 'frame';
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('title', '版本预览');
    iframe.style.position = 'absolute';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.display = 'block';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    iframe.style.zIndex = '0';
    viewer.appendChild(iframe);
    iframePool[index] = iframe;

    return new Promise(resolve => {
        iframe.onload = () => {
            iframeReady[index] = true;
            preloadedCount++;
            updatePreloadProgress();
            resolve();
        };
        iframe.onerror = () => {
            iframeReady[index] = true;
            preloadedCount++;
            updatePreloadProgress();
            resolve();
        };
        iframe.src = versions[index].file;
    });
}

function updatePreloadProgress() {
    preloadText.textContent = `后台预加载 ${preloadedCount} / ${N}`;
    if (preloadedCount >= N) {
        poolLoadingDone = true;
        preloadText.textContent = '后台预加载完成';
        preloadInfo.classList.add('done');
    }
}

// ========== 时间轴构建 ==========
const R = i => i / (N - 1);
function leftOf(i) { return 'calc(9px + (100% - 18px) * ' + R(i).toFixed(6) + ')'; }
function spanOf(a, b) { return 'calc((100% - 18px) * ' + Math.max(0, R(b) - R(a)).toFixed(6) + ')'; }

function buildTrack() {
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
        band.className = 'tl-band' + (gi % 2 ? ' alt' : '');
        band.style.left = leftOf(g.start);
        band.style.width = spanOf(g.start, g.end);
        const lb = document.createElement('span');
        lb.className = 'tl-band-label' + (gi === groups.length - 1 ? ' right' : '');
        lb.textContent = g.key + ' · ' + (g.end - g.start + 1) + '版';
        band.appendChild(lb);
        track.appendChild(band);
    });
    versions.forEach((v, i) => {
        const m = document.createElement('div');
        m.className = 'tl-marker';
        m.style.left = leftOf(i);
        const tip = document.createElement('span');
        tip.className = 'tl-tip';
        tip.textContent = v.id + ' · ' + shortTime(v.time);
        m.appendChild(tip);
        m.addEventListener('click', e => { e.stopPropagation(); goTo(i); });
        track.appendChild(m);
        markers.push(m);
    });
}

// ========== 工具函数 ==========
function parts(t) { return { mo: t.slice(4, 6), d: t.slice(6, 8), h: t.slice(9, 11), mi: t.slice(11, 13) }; }
function fullTime(t) {
    const p = parts(t);
    return t.slice(0, 4) + '年' + parseInt(p.mo, 10) + '月' + parseInt(p.d, 10) + '日 ' + p.h + ':' + p.mi;
}
function shortTime(t) {
    const p = parts(t);
    return p.mo + '/' + p.d + ' ' + p.h + ':' + p.mi;
}

function updateMeta(i) {
    currentIndex = i;
    const v = versions[i];
    curVer.textContent = v.id;
    curTime.textContent = fullTime(v.time);
    curCount.textContent = '第 ' + (i + 1) + ' / ' + N + ' 版';
    markers.forEach((m, k) => m.classList.toggle('active', k === i));
    const pct = (i / (N - 1)) * 100;
    progress.style.width = `calc(${pct}% - 9px)`;
}

// ========== 播放控制 ==========
function goTo(i) {
    if (i < 0 || i >= N) return;
    // 保存旧索引（在updateMeta更新currentIndex之前）
    const prevIdx = currentIndex;
    updateMeta(i);

    if (!iframePool[i]) {
        createBufferedIframe(i);
    }

    // 新帧淡入
    iframePool[i].style.opacity = '1';
    iframePool[i].style.zIndex = '6';
    iframePool[i].style.pointerEvents = 'auto';

    // 旧帧延迟隐藏，避免闪烁
    if (prevIdx !== i && iframePool[prevIdx]) {
        const oldFrame = iframePool[prevIdx];
        setTimeout(() => {
            oldFrame.style.opacity = '0';
            oldFrame.style.zIndex = '5';
            oldFrame.style.pointerEvents = 'none';
        }, 50);
    }

    viewerHint.classList.add('hidden');
}

function prev() { goTo(currentIndex - 1); }
function next() { goTo(currentIndex + 1); }

function tick() {
    if (!isPlaying) return;
    if (currentIndex >= N - 1) {
        isPlaying = false;
        playBtn.textContent = '▶';
        clearTimeout(playTimer);
        return;
    }
    goTo(currentIndex + 1);
    playTimer = setTimeout(tick, playSpeed);
}

function togglePlay() {
    isPlaying = !isPlaying;
    playBtn.textContent = isPlaying ? '⏸' : '▶';
    clearTimeout(playTimer);
    if (isPlaying) tick();
}

// ========== 拖动轨道快速定位 ==========
let scrubbing = false, scrubRaf = null, scrubX = 0;
function indexFromX(clientX) {
    const rect = track.getBoundingClientRect(), usable = rect.width - 18;
    if (usable <= 0) return 0;
    const r = (clientX - rect.left - 9) / usable;
    return Math.max(0, Math.min(N - 1, Math.round(r * (N - 1))));
}
function queueScrub(x) {
    scrubX = x;
    if (scrubRaf) return;
    scrubRaf = requestAnimationFrame(() => { scrubRaf = null; goTo(indexFromX(scrubX)); });
}
track.addEventListener('pointerdown', e => {
    scrubbing = true;
    track.classList.add('scrubbing');
    try { if (track.setPointerCapture) track.setPointerCapture(e.pointerId); } catch (_) { }
    queueScrub(e.clientX);
});
track.addEventListener('pointermove', e => { if (scrubbing) queueScrub(e.clientX); });
function endScrub() { scrubbing = false; track.classList.remove('scrubbing'); }
track.addEventListener('pointerup', endScrub);
track.addEventListener('pointercancel', endScrub);
track.addEventListener('lostpointercapture', endScrub);

// ========== 预热图片缓存 ==========
function warmImages() {
    IMAGES.forEach(u => {
        const im = new Image();
        im.decoding = 'async';
        im.src = u;
        if (im.decode) im.decode().catch(() => { });
    });
}

// ========== 初始化 ==========
function init() {
    // 1. 立即创建首帧iframe（src赋值后浏览器立即开始加载，页面继续渲染）
    //    首帧onload后立即淡入显示并隐藏hint，确保内容渲染完成才可见
    createBufferedIframe(0).then(() => {
        iframePool[0].style.opacity = '1';
        iframePool[0].style.zIndex = '6';
        iframePool[0].style.pointerEvents = 'auto';
        viewerHint.classList.add('hidden');
    });

    // 2. 立即更新元数据（标题/时间/进度条），用户马上看到文字信息
    updateMeta(0);

    // 3. 并发预加载其余版本（后台进行，不影响首帧显示）
    for (let k = 1; k < CONCURRENCY && k < N; k++) {
        createBufferedIframe(k);
    }

    let next = CONCURRENCY;
    const loadInterval = setInterval(() => {
        if (poolLoadingDone || next >= N) {
            clearInterval(loadInterval);
            return;
        }
        for (let i = 0; i < 3 && next < N; i++) {
            createBufferedIframe(next++);
        }
    }, 50);
}

// ========== 窗口缩放 ==========
let rzT;
window.addEventListener('resize', () => {
    track.classList.add('resizing');
    clearTimeout(rzT);
    rzT = setTimeout(() => track.classList.remove('resizing'), 150);
});

// ========== 事件与初始化 ==========
playBtn.addEventListener('click', togglePlay);

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') prev();
    else if (e.key === 'ArrowRight') next();
    else if (e.key === ' ') { e.preventDefault(); togglePlay(); }
    else if (e.key === 'Home') { e.preventDefault(); goTo(0); }
    else if (e.key === 'End') { e.preventDefault(); goTo(N - 1); }
});

document.addEventListener('touchstart', e => {
    if (e.touches.length > 1) e.preventDefault();
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', e => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) e.preventDefault();
    lastTouchEnd = now;
}, { passive: false });

buildTrack();
viewerHint.classList.remove('hidden'); // 先显示hint（加载中状态）
warmImages();
init();
