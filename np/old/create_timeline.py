# -*- coding: utf-8 -*-
import os

base_path = r'D:\github\21306.top\np\old'

html_content = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>校园日报 · 版本时间轴</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#f5f2eb;--ink:#1a1714;--red:#a3211e;--muted:#6d675a;--rule:#c9c2b0;--paper:#faf7ef}
body{font-family:"Noto Serif SC","SimSun","宋体",serif;background:var(--bg);color:var(--ink);height:100vh;display:flex;flex-direction:column;overflow:hidden}
.header{padding:12px 20px;background:var(--paper);border-bottom:2px solid var(--ink);display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
.header-title{font-size:20px;font-weight:bold;letter-spacing:2px;color:var(--red)}
.header-meta{font-size:12px;color:var(--muted)}
.main{flex:1;display:flex;flex-direction:column;overflow:hidden}

/* ===== 时间轴（顶部） ===== */
.timeline-bar{background:var(--paper);border-bottom:1px solid var(--rule);padding:12px 20px 10px;flex-shrink:0}
.tl-head{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:6px}
.tl-current{display:flex;align-items:baseline;gap:10px;min-width:0;overflow:hidden}
.tl-id{font-size:16px;font-weight:bold;color:var(--red);letter-spacing:1px}
.tl-time{font-size:13px;color:var(--ink);white-space:nowrap}
.tl-count{font-size:11px;color:var(--muted);font-variant-numeric:tabular-nums;white-space:nowrap}
.tl-preload{font-size:11px;color:var(--muted);display:flex;align-items:center;gap:6px;white-space:nowrap;transition:opacity .5s ease}
.tl-preload .dot{width:6px;height:6px;border-radius:50%;background:var(--red);animation:tlpulse 1.2s ease-in-out infinite}
.tl-preload.done{opacity:0}
@keyframes tlpulse{0%,100%{opacity:.2}50%{opacity:1}}

.timeline-track{position:relative;height:64px;cursor:pointer;user-select:none;touch-action:none;overflow:hidden;border-radius:3px;background:rgba(26,23,20,.02)}
.timeline-track.scrubbing{cursor:grabbing}
.tl-band{position:absolute;top:0;bottom:0;z-index:0;background:rgba(163,33,30,.05);border-left:1px solid rgba(26,23,20,.07)}
.tl-band.alt{background:rgba(109,103,90,.055)}
.tl-band-label{position:absolute;top:4px;left:7px;font-size:10px;color:var(--muted);white-space:nowrap;letter-spacing:.5px}
.tl-band-label.right{left:auto;right:7px}
.tl-baseline{position:absolute;top:50%;left:9px;right:9px;height:2px;background:repeating-linear-gradient(90deg,var(--rule) 0 5px,transparent 5px 10px);transform:translateY(-50%);z-index:1}
.tl-progress{position:absolute;top:50%;left:9px;width:0;height:2px;background:var(--red);transform:translateY(-50%);transition:width .15s ease;z-index:2}
.tl-marker{position:absolute;top:50%;width:18px;height:18px;margin-left:-9px;transform:translateY(-50%);z-index:3;cursor:pointer;transition:transform .14s}
.tl-marker:hover{transform:translateY(-50%) scale(1.15)}
.tl-marker::after{content:"";position:absolute;top:50%;left:50%;width:9px;height:9px;margin:-4.5px 0 0 -4.5px;border-radius:50%;background:var(--paper);border:1.5px solid var(--rule);transition:background .14s,border-color .14s,width .14s,height .14s,margin .14s,box-shadow .14s}
.tl-marker:hover::after{border-color:var(--red)}
.tl-marker.active::after{background:var(--red);border-color:var(--red);width:13px;height:13px;margin:-6.5px 0 0 -6.5px;box-shadow:0 0 0 3px rgba(163,33,30,.18)}
.timeline-track.resizing .tl-progress{transition:none}
.tl-tip{position:absolute;top:100%;left:50%;transform:translateX(-50%);margin-top:1px;font-size:10px;color:var(--muted);white-space:nowrap;opacity:0;transition:opacity .14s;pointer-events:none}
.tl-marker:hover .tl-tip,.tl-marker.active .tl-tip{opacity:1;color:var(--red)}

.tl-foot{display:flex;align-items:center;gap:12px;margin-top:8px}
.tl-controls{display:flex;align-items:center;gap:6px}
.btn{padding:4px 12px;border:1px solid var(--rule);background:var(--paper);cursor:pointer;font-size:12px;font-family:inherit;color:var(--ink);transition:background .15s,color .15s,border-color .15s}
.btn:hover{background:var(--ink);color:var(--paper);border-color:var(--ink)}
.btn-play{width:30px;height:30px;padding:0;display:flex;align-items:center;justify-content:center;border-radius:50%;font-size:14px;line-height:1}
.btn-primary{background:var(--red);color:var(--paper);border-color:var(--red)}
.btn-primary:hover{background:var(--ink);border-color:var(--ink);color:var(--paper)}
.tl-hint{margin-left:auto;font-size:11px;color:var(--muted);white-space:nowrap}

/* ===== 版本视口（双缓冲） ===== */
.viewer{position:relative;flex:1;min-height:0;background:#d8d3c8;overflow:hidden}
.viewer .frame{position:absolute;top:0;left:0;width:100%;height:100%;border:none;display:block;background:#d8d3c8;opacity:0;pointer-events:none;transition:opacity .1s ease;z-index:1}
.viewer .frame.active{opacity:1;pointer-events:auto;z-index:2}
.viewer-hint{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:13px;color:var(--muted);background:#d8d3c8;z-index:3;transition:opacity .3s ease}
.viewer-hint.hidden{opacity:0;pointer-events:none}

</style>
</head>
<body>
<header class="header">
<div class="header-title">语文5组的神秘报纸 · 版本时间轴</div>
<div class="header-meta">共43个版本 · 2026/10/07 - 2026/10/11</div>
</header>
<div class="main">
<div class="timeline-bar">
<div class="tl-head">
<div class="tl-current">
<span class="tl-id" id="curVer">v0001</span>
<span class="tl-time" id="curTime">2026年10月7日 13:22</span>
<span class="tl-count" id="curCount">第 1 / 43 版</span>
</div>
<div class="tl-preload" id="preloadInfo"><span class="dot"></span><span id="preloadText">后台预加载 1 / 43</span></div>
</div>
<div class="timeline-track" id="track">
<div class="tl-baseline"></div>
<div class="tl-progress" id="progress"></div>
</div>
<div class="tl-foot">
<div class="tl-controls">
<button class="btn btn-play btn-primary" id="playBtn" title="播放 / 暂停（空格）">▶</button>
</div>
<div class="tl-hint">拖动轨道快速定位 · ←/→ 切换 · 空格播放 · Home/End 首尾</div>
</div>
</div>
<div class="viewer" id="viewer">
<div class="viewer-hint" id="viewerHint">正在载入…</div>
</div>
</div>
<script src="timeline.js"></script>
</body>
</html>'''

js_content = '''const versions = [
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

const N=versions.length;

// 全部版本仅引用这两张图片（同一 URL ⇒ 浏览器缓存复用，只下载一次）
const IMAGES=['这是一张图.jpg','这又是一张图.jpg'].map(n=>'https://21306.top/np/v2/'+encodeURIComponent(n));

let currentIndex=0,isPlaying=false,playTimer=null;const playSpeed=200;

const viewer=document.getElementById('viewer'),track=document.getElementById('track'),progress=document.getElementById('progress');
const curVer=document.getElementById('curVer'),curTime=document.getElementById('curTime'),curCount=document.getElementById('curCount');
const playBtn=document.getElementById('playBtn');
const viewerHint=document.getElementById('viewerHint'),preloadInfo=document.getElementById('preloadInfo'),preloadText=document.getElementById('preloadText');

const markers=[];
const buffers=[];
let front=0,frontVersion=-1,backVersion=-1,pending=-1,loadTimer=null,swapTimer=null,loading=false;

/* ---------- 工具：位置与时间格式化 ---------- */
const R=i=>i/(N-1);
function leftOf(i){return 'calc(9px + (100% - 18px) * '+R(i).toFixed(6)+')'}
function spanOf(a,b){return 'calc((100% - 18px) * '+Math.max(0,R(b)-R(a)).toFixed(6)+')'}

/* ---------- 预加载状态：驱动时间轴线路（已缓存=红色实线，未缓存=灰色虚线） ---------- */
const preloaded=new Array(N).fill(false);preloaded[0]=true;   // 第 0 版是首帧，视为已就绪
let plHead=0;                                                 // 已"连续"缓存到的最高版本索引
function markPreloaded(i){
    if(i<0||i>=N||preloaded[i])return;
    preloaded[i]=true;
    while(plHead+1<N&&preloaded[plHead+1])plHead++;
    progress.style.width=spanOf(0,plHead);
}
function parts(t){return{mo:t.slice(4,6),d:t.slice(6,8),h:t.slice(9,11),mi:t.slice(11,13)}}
function fullTime(t){const p=parts(t);return t.slice(0,4)+'年'+parseInt(p.mo,10)+'月'+parseInt(p.d,10)+'日 '+p.h+':'+p.mi}
function shortTime(t){const p=parts(t);return p.mo+'/'+p.d+' '+p.h+':'+p.mi}

/* ---------- 时间轴构建（百分比定位，窗口缩放天然自适应） ---------- */
function buildTrack(){
    const groups=[];let cur=null;
    versions.forEach((v,i)=>{
        const key=v.time.slice(4,6)+'/'+v.time.slice(6,8);
        if(!cur||cur.key!==key){cur={key,start:i,end:i};groups.push(cur)}else{cur.end=i}
    });
    groups.forEach((g,gi)=>{
        const band=document.createElement('div');
        band.className='tl-band'+(gi%2?' alt':'');
        band.style.left=leftOf(g.start);band.style.width=spanOf(g.start,g.end);
        const lb=document.createElement('span');
        lb.className='tl-band-label'+(gi===groups.length-1?' right':'');
        lb.textContent=g.key+' · '+(g.end-g.start+1)+'版';band.appendChild(lb);
        track.appendChild(band);
    });
    versions.forEach((v,i)=>{
        const m=document.createElement('div');
        m.className='tl-marker';m.style.left=leftOf(i);
        const tip=document.createElement('span');tip.className='tl-tip';
        tip.textContent=v.id+' · '+shortTime(v.time);m.appendChild(tip);
        m.addEventListener('click',e=>{e.stopPropagation();goTo(i)});
        track.appendChild(m);markers.push(m);
    });
}

function updateMeta(i){
    currentIndex=i;const v=versions[i];
    curVer.textContent=v.id;
    curTime.textContent=fullTime(v.time);
    curCount.textContent='第 '+(i+1)+' / '+N+' 版';
    markers.forEach((m,k)=>m.classList.toggle('active',k===i));
}

/* ---------- 双缓冲渲染：切换只做淡入淡出，避免白屏闪烁 ---------- */
function createBuffer(){
    const f=document.createElement('iframe');
    f.className='frame';f.setAttribute('allowfullscreen','');f.setAttribute('title','版本预览');
    viewer.appendChild(f);buffers.push(f);return f;
}

function goTo(i){
    if(i<0||i>=N)return;
    updateMeta(i);pending=i;
    if(frontVersion===i)return;      // 已在前台
    if(loading)return;               // 有加载在途：不打断，commit 后自动补载最新目标
    loadIntoBack(i);
}

function loadIntoBack(i){
    if(i<0||i>=N)return;
    const b=buffers[1-front];
    backVersion=i;loading=true;
    clearTimeout(loadTimer);
    b.onload=()=>{if(backVersion===i)commit(i)};
    b.onerror=()=>{if(backVersion===i)commit(i)};
    loadTimer=setTimeout(()=>{if(backVersion===i)commit(i)},1500);

    if(htmlCache[i]){
        // 缓存命中：直接写入，跳过网络请求与 HTML 解析
        const doc=b.contentDocument||b.contentWindow.document;
        doc.open();
        doc.write(htmlCache[i]);
        doc.close();
    } else {
        // 缓存未命中：正常加载
        b.src=versions[i].file;
    }
}

function commit(i){
    clearTimeout(loadTimer);loading=false;
    const nb=buffers[1-front],ob=buffers[front];
    /* 新帧置于上层淡入，旧帧保持不透明垫底：淡入过程中不会透出底色，避免忽明忽暗 */
    nb.style.zIndex=6;ob.style.zIndex=5;
    nb.classList.add('active');
    front=1-front;frontVersion=i;backVersion=-1;
    viewerHint.classList.add('hidden');
    clearTimeout(swapTimer);
    swapTimer=setTimeout(()=>{ob.classList.remove('active');ob.style.zIndex=''},120);
    if(pending!==i)loadIntoBack(pending);                    // 加载期间目标已变 → 立刻补载最新目标
    else if(isPlaying){clearTimeout(playTimer);playTimer=setTimeout(tick,playSpeed)}   // 本帧显示后再推进一版
}

/* ---------- 播放控制 ---------- */
function prev(){goTo(currentIndex-1)}
function next(){goTo(currentIndex+1)}
function tick(){
    if(!isPlaying)return;
    if(currentIndex>=N-1){
        // 播放完毕，停止
        isPlaying=false;
        playBtn.textContent='▶';
        clearTimeout(playTimer);
        return;
    }
    goTo(currentIndex+1);
}
function togglePlay(){
    isPlaying=!isPlaying;playBtn.textContent=isPlaying?'⏸':'▶';
    clearTimeout(playTimer);
    if(isPlaying)tick();
}

/* ---------- 拖动轨道快速定位 ---------- */
let scrubbing=false,scrubRaf=null,scrubX=0;
function indexFromX(clientX){
    const rect=track.getBoundingClientRect(),usable=rect.width-18;
    if(usable<=0)return 0;
    const r=(clientX-rect.left-9)/usable;
    return Math.max(0,Math.min(N-1,Math.round(r*(N-1))));
}
function queueScrub(x){
    scrubX=x;
    if(scrubRaf)return;
    scrubRaf=requestAnimationFrame(()=>{scrubRaf=null;goTo(indexFromX(scrubX))});
}
track.addEventListener('pointerdown',e=>{
    scrubbing=true;track.classList.add('scrubbing');
    try{if(track.setPointerCapture)track.setPointerCapture(e.pointerId)}catch(_){}
    queueScrub(e.clientX);
});
track.addEventListener('pointermove',e=>{if(scrubbing)queueScrub(e.clientX)});
function endScrub(){scrubbing=false;track.classList.remove('scrubbing')}
track.addEventListener('pointerup',endScrub);
track.addEventListener('pointercancel',endScrub);
track.addEventListener('lostpointercapture',endScrub);

/* ---------- 后台预加载（非阻塞） ---------- */
function warmImages(){
    IMAGES.forEach(u=>{
        const im=new Image();im.decoding='async';im.src=u;
        if(im.decode)im.decode().catch(()=>{});
    });
}
const htmlCache = new Array(N).fill(null);

function startWarmer(){
    const POOL=6;
    let next=1,loaded=1,finished=false;
    const pump=()=>{
        if(finished||next>=N)return;
        const idx=next++;
        const done=()=>{
            loaded++;markPreloaded(idx);
            preloadText.textContent='后台预加载 '+loaded+' / '+N;
            if(loaded>=N){finished=true;preloadText.textContent='后台预加载完成';preloadInfo.classList.add('done');return}
            setTimeout(pump,0);
        };
        fetch(versions[idx].file,{cache:'default'})
            .then(r=>r.text())
            .then(t=>{htmlCache[idx]=t;done()})
            .catch(done);
    };
    for(let k=0;k<Math.min(POOL,N-1);k++)pump();
}

/* ---------- 窗口缩放：临时关闭进度条过渡，避免拖影 ---------- */
let rzT;
window.addEventListener('resize',()=>{
    track.classList.add('resizing');
    clearTimeout(rzT);rzT=setTimeout(()=>track.classList.remove('resizing'),150);
});

/* ---------- 事件与初始化 ---------- */
playBtn.addEventListener('click',togglePlay);

document.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft')prev();
    else if(e.key==='ArrowRight')next();
    else if(e.key===' '){e.preventDefault();togglePlay()}
    else if(e.key==='Home'){e.preventDefault();goTo(0)}
    else if(e.key==='End'){e.preventDefault();goTo(N-1)}
});

createBuffer();createBuffer();
buildTrack();
frontVersion=0;pending=0;
buffers[0].onload=()=>viewerHint.classList.add('hidden');
setTimeout(()=>viewerHint.classList.add('hidden'),2500);   // 兜底：外部资源阻塞时不至于一直显示"载入中"
buffers[0].src=versions[0].file;      // 首帧立即显示，不做阻塞式等待
buffers[0].classList.add('active');
updateMeta(0);
warmImages();
setTimeout(startWarmer,800);
'''

with open(os.path.join(base_path, 'index.html'), 'w', encoding='utf-8', newline='\n') as f:
    f.write(html_content)

with open(os.path.join(base_path, 'timeline.js'), 'w', encoding='utf-8', newline='\n') as f:
    f.write(js_content)

print('Base HTML & timeline.js created')