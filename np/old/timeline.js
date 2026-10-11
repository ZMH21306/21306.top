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

// 全部版本仅引用这两张图片（同一 URL ⇒ 浏览器缓存复用，只下载一次）
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

// ========== 预缓存方案：所有版本提前加载进隐藏的 iframe 池 ==========
const IFRAME_POOL_SIZE = Math.min(6, N); // 同时预加载 6 个
const iframePool = []; // 存放所有预渲染的 iframe
const iframeReady = new Array(N).fill(false); // 标记每个版本是否就绪
let preloadedCount = 1; // 首帧已就绪
let pendingPoolCount = 0; // 当前正在预加载的数量
let poolLoadingDone = false; // 所有版本预加载完成

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
    iframe.style.opacity = '0'; // 初始隐藏
    iframe.style.pointerEvents = 'none';
    iframe.style.zIndex = '0';
    viewer.appendChild(iframe);
    iframePool[index] = iframe;

    return new Promise((resolve) => {
        iframe.onload = () => {
            iframeReady[index] = true;
            preloadedCount++;
            updatePreloadProgress();
            resolve();
        };
        iframe.onerror = () => {
            // 即使出错也标记为就绪，避免死锁
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

function markProgress(i) {
    // 简化版进度条，实际预渲染不依赖这个
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
}

// ========== 播放控制 ==========
function goTo(i) {
    if (i < 0 || i >= N) return;
    updateMeta(i);

    if (!iframeReady[i]) {
        // 如果该版本还没预渲染，直接跳转到对应 iframe 并显示
        if (!iframePool[i]) {
            createBufferedIframe(i);
        }
        iframePool[i].style.opacity = '1';
        iframePool[i].style.zIndex = '6';
        iframePool[i].style.pointerEvents = 'auto';
        // 隐藏旧帧
        if (iframePool[currentIndex] && currentIndex !== i) {
            iframePool[currentIndex].style.opacity = '0';
            iframePool[currentIndex].style.zIndex = '5';
            iframePool[currentIndex].style.pointerEvents = 'none';
        }
        viewerHint.classList.add('hidden');
        return;
    }

    // 预渲染完成：直接切换显示
    if (iframePool[i]) {
        iframePool[i].style.opacity = '1';
        iframePool[i].style.zIndex = '6';
        iframePool[i].style.pointerEvents = 'auto';
    }

    // 隐藏旧帧
    if (iframePool[currentIndex] && currentIndex !== i) {
        iframePool[currentIndex].style.opacity = '0';
        iframePool[currentIndex].style.zIndex = '5';
        iframePool[currentIndex].style.pointerEvents = 'none';
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

// ========== 初始化：预渲染所有版本 ==========
function init() {
    createBufferedIframe(0); // 首帧
    // 其余 1-5 号版本并发预加载
    for (let k = 1; k < Math.min(IFRAME_POOL_SIZE, N); k++) {
        createBufferedIframe(k);
    }
    // 继续预加载剩余版本（当有空位时）
    let next = IFRAME_POOL_SIZE;
    const loadNext = () => {
        if (next >= N || poolLoadingDone) return;
        createBufferedIframe(next++);
        if (next < N && !poolLoadingDone) {
            setTimeout(loadNext, 50); // 延迟 50ms 避免阻塞主线程
        }
    };
    // 每 100ms 加载一个（后台非阻塞）
    const loadInterval = setInterval(() => {
        if (poolLoadingDone || next >= N) {
            clearInterval(loadInterval);
            return;
        }
        loadNext();
    }, 100);
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

createBufferedIframe(0);
buildTrack();
updateMeta(0);
viewerHint.classList.add('hidden');
warmImages();
init();
