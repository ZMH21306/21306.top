const versions = [
  {"id":"v0001","file":"v0001-20261007132222.html","time":"20261007 132222"},
  {"id":"v0002","file":"v0002-20261007132224.html","time":"20261007 132224"},
  {"id":"v0003","file":"v0003-20261007132226.html","time":"20261007 132226"},
  {"id":"v0004","file":"v0004-20261007132518.html","time":"20261007 132518"},
  {"id":"v0005","file":"v0005-20261007132520.html","time":"20261007 132520"},
  {"id":"v0006","file":"v0006-20261007132525.html","time":"20261007 132525"},
  {"id":"v0007","file":"v0007-20261007134717.html","time":"20261007 134717"},
  {"id":"v0008","file":"v0008-20261007134720.html","time":"20261007 134720"},
  {"id":"v0009","file":"v0009-20261007134722.html","time":"20261007 134722"},
  {"id":"v0010","file":"v0010-20261007140933.html","time":"20261007 140933"},
  {"id":"v0011","file":"v0011-20261007140935.html","time":"20261007 140935"},
  {"id":"v0012","file":"v0012-20261007140939.html","time":"20261007 140939"},
  {"id":"v0013","file":"v0013-20261007141220.html","time":"20261007 141220"},
  {"id":"v0014","file":"v0014-20261007141540.html","time":"20261007 141540"},
  {"id":"v0015","file":"v0015-20261007142056.html","time":"20261007 142056"},
  {"id":"v0016","file":"v0016-20261007142244.html","time":"20261007 142244"},
  {"id":"v0017","file":"v0017-20261007142449.html","time":"20261007 142449"},
  {"id":"v0018","file":"v0018-20261007142526.html","time":"20261007 142526"},
  {"id":"v0019","file":"v0019-20261007145325.html","time":"20261007 145325"},
  {"id":"v0020","file":"v0020-20261007150846.html","time":"20261007 150846"},
  {"id":"v0021","file":"v0021-20261007151308.html","time":"20261007 151308"},
  {"id":"v0022","file":"v0022-20261007151312.html","time":"20261007 151312"},
  {"id":"v0023","file":"v0023-20261007151314.html","time":"20261007 151314"},
  {"id":"v0024","file":"v0024-20261007151718.html","time":"20261007 151718"},
  {"id":"v0025","file":"v0025-20261007151721.html","time":"20261007 151721"},
  {"id":"v0026","file":"v0026-20261007151723.html","time":"20261007 151723"},
  {"id":"v0027","file":"v0027-20261007160034.html","time":"20261007 160034"},
  {"id":"v0028","file":"v0028-20261007160305.html","time":"20261007 160305"},
  {"id":"v0029","file":"v0029-20261007160452.html","time":"20261007 160452"},
  {"id":"v0030","file":"v0030-20261007160926.html","time":"20261007 160926"},
  {"id":"v0031","file":"v0031-20261007162302.html","time":"20261007 162302"},
  {"id":"v0032","file":"v0032-20261007162457.html","time":"20261007 162457"},
  {"id":"v0033","file":"v0033-20261007180019.html","time":"20261007 180019"},
  {"id":"v0034","file":"v0034-20261007180438.html","time":"20261007 180438"},
  {"id":"v0035","file":"v0035-20261007180713.html","time":"20261007 180713"},
  {"id":"v0036","file":"v0036-20261007180802.html","time":"20261007 180802"},
  {"id":"v0037","file":"v0037-20261007193707.html","time":"20261007 193707"},
  {"id":"v0038","file":"v0038-20261008071150.html","time":"20261008 071150"},
  {"id":"v0039","file":"v0039-20261008224205.html","time":"20261008 224205"},
  {"id":"v0040","file":"v0040-20261008224723.html","time":"20261008 224723"},
  {"id":"v0041","file":"v0041-20261009195132.html","time":"20261009 195132"},
  {"id":"v0042","file":"v0042-20261009200209.html","time":"20261009 200209"},
  {"id":"v0043","file":"v0043-20261009202341.html","time":"20261009 202341"},
  {"id":"v0044","file":"v0044-20261009203747.html","time":"20261009 203747"},
  {"id":"v0045","file":"v0045-20261009212000.html","time":"20261009 212000"},
  {"id":"v0046","file":"v0046-20261009213558.html","time":"20261009 213558"},
  {"id":"v0047","file":"v0047-20261009215137.html","time":"20261009 215137"},
  {"id":"v0048","file":"v0048-20261009220738.html","time":"20261009 220738"},
  {"id":"v0049","file":"v0049-20261009221059.html","time":"20261009 221059"},
  {"id":"v0050","file":"v0050-20261009221610.html","time":"20261009 221610"},
  {"id":"v0051","file":"v0051-20261009223845.html","time":"20261009 223845"},
  {"id":"v0052","file":"v0052-20261011091748.html","time":"20261011 091748"},
  {"id":"v0053","file":"v0053-20261011092350.html","time":"20261011 092350"},
  {"id":"v0054","file":"v0054-20261011092810.html","time":"20261011 092810"}
];

let currentIndex=0,isPlaying=false,playInterval=null,playSpeed=800;
const speeds=[2000,1200,800,400],labels=['慢','较少','快','极快'];let speedIdx=2;
const viewer=document.getElementById('viewer'),track=document.getElementById('track'),progress=document.getElementById('progress');
const curVer=document.getElementById('curVer'),curTime=document.getElementById('curTime');
const playBtn=document.getElementById('playBtn'),prevBtn=document.getElementById('prevBtn');
const nextBtn=document.getElementById('nextBtn'),speedCtrl=document.getElementById('speedCtrl');
const loadingMask=document.getElementById('loadingMask'),maskBar=document.getElementById('maskBar'),maskText=document.getElementById('maskText');

const frames=[];                 // 每个版本一个常驻 iframe（堆叠）
const ready=new Array(versions.length).fill(false);
let readyCount=0,preloadDone=false;
const LOAD_TIMEOUT=8000;         // 单个 iframe 加载兜底超时，避免外部资源阻塞

function initTimeline(){
    const mw=12,sp=(track.offsetWidth-mw)/(versions.length-1);
    let lastDate='';
    versions.forEach((v,i)=>{
        const m=document.createElement('div');
        m.className='timeline-marker';m.style.left=(i*sp+mw/2)+'px';
        const l=document.createElement('span');l.className='marker-label';l.textContent=v.id;m.appendChild(l);
        m.addEventListener('click',()=>goTo(i));track.appendChild(m);
        const ds=v.time.match(/(\d{4})(\d{2})(\d{2})/);
        const dateKey=ds?ds[2]+'/'+ds[3]:'';
        if(dateKey!==lastDate){
            const s=document.createElement('div');s.className='date-separator';s.style.left=(i*sp)+'px';track.appendChild(s);
            const dl=document.createElement('span');dl.className='date-label';dl.style.left=(i*sp)+'px';
            dl.textContent=dateKey;track.appendChild(dl);lastDate=dateKey;
        }
    });
}

// 全量预加载：为每个版本创建常驻 iframe，全部加载完成后才解锁
function buildFrames(){
    versions.forEach((v,i)=>{
        const f=document.createElement('iframe');
        f.className='frame';f.setAttribute('allowfullscreen','');f.dataset.index=i;
        let timer=setTimeout(()=>markReady(i),LOAD_TIMEOUT);
        f.addEventListener('load',()=>{clearTimeout(timer);markReady(i);});
        f.src=v.file;
        viewer.appendChild(f);
        frames.push(f);
    });
}

function markReady(i){
    if(ready[i])return;
    ready[i]=true;readyCount++;
    maskBar.style.width=(readyCount/versions.length*100)+'%';
    maskText.textContent=readyCount+' / '+versions.length;
    if(readyCount===versions.length)finishPreload();
}

function finishPreload(){
    if(preloadDone)return;
    preloadDone=true;
    loadingMask.classList.add('hidden');
    setTimeout(()=>{loadingMask.style.display='none'},400);
    goTo(0);
}

function updateViewer(index){
    currentIndex=index;const v=versions[index];
    frames.forEach((f,i)=>f.classList.toggle('active',i===index));
    curVer.textContent=v.id;
    const t=v.time.replace(/(\d{4})(\d{2})(\d{2})/,'$1-$2-$3').replace(/(\d{2})(\d{2})(\d{2})/,'$1:$2:$3');
    const d=new Date(t.replace(/(\d{2}):(\d{2}):(\d{2})/,'$1:$2'));
    curTime.textContent=(d.getMonth()+1)+'月'+d.getDate()+'日 '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
    progress.style.width=(index/(versions.length-1)*100)+'%';
    document.querySelectorAll('.timeline-marker').forEach((m,i)=>{m.classList.toggle('active',i===index)});
}

function goTo(i){if(!preloadDone)return;if(i<0||i>=versions.length)return;updateViewer(i)}
function prev(){goTo(currentIndex-1)}
function next(){goTo(currentIndex+1)}
function togglePlay(){
    if(!preloadDone)return;
    isPlaying=!isPlaying;playBtn.textContent=isPlaying?'⏸':'▶';
    if(isPlaying){playInterval=setInterval(()=>{currentIndex<versions.length-1?next():goTo(0)},playSpeed)}
    else{clearInterval(playInterval)}
}
function cycleSpeed(){
    speedIdx=(speedIdx+1)%speeds.length;playSpeed=speeds[speedIdx];
    speedCtrl.textContent='速度: '+labels[speedIdx];
    if(isPlaying){clearInterval(playInterval);playInterval=setInterval(()=>{currentIndex<versions.length-1?next():goTo(0)},playSpeed)}
}
prevBtn.addEventListener('click',prev);nextBtn.addEventListener('click',next);
playBtn.addEventListener('click',togglePlay);speedCtrl.addEventListener('click',cycleSpeed);
document.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft')prev();else if(e.key==='ArrowRight')next();
    else if(e.key===' '){e.preventDefault();togglePlay()}
});
initTimeline();buildFrames();