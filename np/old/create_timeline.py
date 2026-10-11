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
.timeline-bar{background:var(--paper);border-bottom:1px solid var(--rule);padding:12px 20px;flex-shrink:0}
.timeline-info{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;font-size:13px}
.current-version{font-weight:bold;color:var(--red)}
.current-time{color:var(--muted);font-size:11px}
.timeline-track{position:relative;height:40px;cursor:pointer;user-select:none}
.timeline-line{position:absolute;top:50%;left:0;right:0;height:2px;background:var(--rule);transform:translateY(-50%)}
.timeline-progress{position:absolute;top:50%;left:0;height:2px;background:var(--red);transform:translateY(-50%);transition:width .1s ease}
.timeline-marker{position:absolute;top:50%;transform:translate(-50%,-50%);width:12px;height:12px;border-radius:50%;background:var(--paper);border:2px solid var(--rule);cursor:pointer;transition:all .15s ease;z-index:2}
.timeline-marker.active{background:var(--red);border-color:var(--red);transform:translate(-50%,-50%)scale(1.3)}
.timeline-marker:hover{border-color:var(--red);transform:translate(-50%,-50%)scale(1.2)}
.marker-label{position:absolute;top:100%;left:50%;transform:translateX(-50%);margin-top:5px;font-size:10px;color:var(--muted);white-space:nowrap;opacity:0;transition:opacity .15s;pointer-events:none}
.timeline-marker:hover .marker-label,.timeline-marker.active .marker-label{opacity:1;color:var(--red)}
.date-separator{position:absolute;top:0;bottom:0;width:1px;background:var(--muted);opacity:.3}
.date-label{position:absolute;top:calc(50% + 14px);font-size:9px;color:var(--muted);transform:translateX(-50%)}
.playback-controls{display:flex;align-items:center;gap:8px;margin-top:10px}
.btn{padding:4px 12px;border:1px solid var(--rule);background:var(--paper);cursor:pointer;font-size:12px;font-family:inherit;transition:all .15s}
.btn:hover{background:var(--ink);color:var(--paper);border-color:var(--ink)}
.btn-play{width:28px;height:28px;padding:0;display:flex;align-items:center;justify-content:center;border-radius:50%}
.speed-control{font-size:11px;color:var(--muted);margin-left:auto;cursor:pointer}
.viewer{position:relative;flex:1;min-height:0;background:#d8d3c8;overflow:hidden}
.viewer .frame{position:absolute;top:0;left:0;width:100%;height:100%;border:none;display:block;background:#d8d3c8;opacity:0;visibility:hidden;z-index:1}
.viewer .frame.active{opacity:1;visibility:visible;z-index:2}
.loading-mask{position:absolute;inset:0;z-index:20;display:flex;align-items:center;justify-content:center;background:var(--bg);transition:opacity .35s ease}
.loading-mask.hidden{opacity:0;pointer-events:none}
.loading-inner{width:min(320px,70%);text-align:center}
.loading-title{font-size:14px;letter-spacing:1px;color:var(--ink);margin-bottom:14px}
.loading-bar{height:4px;background:var(--rule);border-radius:2px;overflow:hidden}
.loading-bar-fill{height:100%;width:0;background:var(--red);transition:width .15s ease}
.loading-count{margin-top:10px;font-size:12px;color:var(--muted);font-variant-numeric:tabular-nums}
</style>
</head>
<body>
<header class="header">
<div class="header-title">语文5组的神秘报纸 · 版本时间轴</div>
<div class="header-meta">共54个版本 · 2026/10/07 - 2026/10/11</div>
</header>
<div class="main">
<div class="timeline-bar">
<div class="timeline-info">
<span class="current-version" id="curVer">v0001</span>
<span class="current-time" id="curTime">2026年10月7日 13:22</span>
</div>
<div class="timeline-track" id="track">
<div class="timeline-line"></div>
<div class="timeline-progress" id="progress"></div>
</div>
<div class="playback-controls">
<button class="btn btn-play" id="prevBtn" title="上一个版本">‹</button>
<button class="btn btn-play" id="playBtn" title="自动播放">▶</button>
<button class="btn btn-play" id="nextBtn" title="下一个版本">›</button>
<span class="speed-control" id="speedCtrl">速度: 快</span>
</div>
</div>
<div class="viewer" id="viewer">
<div class="loading-mask" id="loadingMask">
<div class="loading-inner">
<div class="loading-title">正在预加载全部版本…</div>
<div class="loading-bar"><div class="loading-bar-fill" id="maskBar"></div></div>
<div class="loading-count" id="maskText">0 / 54</div>
</div>
</div>
</div>
</div>
<script src="timeline.js"></script>
</body>
</html>'''

with open(os.path.join(base_path, 'index.html'), 'w', encoding='utf-8') as f:
    f.write(html_content)

print('Base HTML created')