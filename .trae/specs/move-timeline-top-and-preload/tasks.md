# Tasks

- [x] Task 1: 重构布局，将时间轴移到顶部
  - [x] SubTask 1.1: 调整 `index.html` 结构顺序为 header → timeline-bar → viewer（时间轴栏移到视口上方）
  - [x] SubTask 1.2: 调整 CSS：时间轴栏改为顶部样式（改为 `border-bottom`、移除 `border-top`），视口在下方填充剩余空间
  - [x] SubTask 1.3: 将 marker 版本号标签、日期标签由轨道上方改为轨道下方，避免被裁切/与 header 重叠

- [x] Task 2: 实现全量预加载的堆叠 iframe
  - [x] SubTask 2.1: 在 `timeline.js` 中为每个版本创建一个 iframe，绝对定位堆叠于视口容器内，默认隐藏
  - [x] SubTask 2.2: 为每个 iframe 绑定 `onload` 统计就绪数量，并加入超时兜底
  - [x] SubTask 2.3: 改造切换逻辑：`updateViewer` 仅切换目标帧可见性，不再设置 `frame.src`

- [x] Task 3: 加载遮罩与锁定
  - [x] SubTask 3.1: 在视口内添加加载遮罩（进度文本 `n/54` + 进度条）
  - [x] SubTask 3.2: 预加载完成前禁用播放 / 上一帧 / 下一帧 / 标记点击 / 键盘操作
  - [x] SubTask 3.3: 预加载完成后遮罩淡出、控件解锁，默认显示并高亮第一帧

- [x] Task 4: 同步生成脚本
  - [x] SubTask 4.1: `create_timeline.py` 生成的 `index.html` 包含 `<script src="timeline.js">`，结构与手工版一致

- [x] Task 5: 本地验证
  - [x] SubTask 5.1: 用浏览器打开 `np/old/index.html`，确认时间轴在顶部、标签无裁切
  - [x] SubTask 5.2: 观察遮罩进度到达 `54/54`；播放各速度档位，确认无白屏/闪屏

# Task Dependencies
- Task 2 依赖 Task 1（结构就绪后再挂载堆叠 iframe）
- Task 3 依赖 Task 2（基于就绪计数与 iframe 显隐）
- Task 4 可与 Task 2 / Task 3 并行（仅改动 `create_timeline.py`）
- Task 5 依赖 Task 1 ~ Task 4