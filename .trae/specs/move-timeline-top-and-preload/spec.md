# 时间轴置顶与全量预加载 Spec

## Why
当前版本时间轴页面（`np/old`）在切换/播放版本时通过重设 iframe 的 `src` 触发整页重新加载，导致白屏闪烁与卡顿；同时时间轴位于页面底部，不便于先选帧再查看。需要把时间轴移到上方，并做「完整预加载」，从根本上消除播放时的闪屏。

## What Changes
- **布局调整**：将时间轴栏（版本信息 + 轨道 + 播放控件）整体上移到 header 下方，版本视口（iframe 区域）填充下方剩余空间。
- **轨道标签方向调整**：原有位于 marker 上方的版本号标签、日期标签改为显示在轨道下方，避免移到顶部后与 header 重叠或越界被裁切。
- **全量预加载**：为全部 54 个版本各创建一个 iframe，绝对定位堆叠于视口内并常驻内存；启动时一次性全部加载。
- **零闪屏切换**：切换版本时只切换目标 iframe 的可见性（`opacity` / `visibility`），**不再重设 `src`**，因此不存在加载瞬时白屏。
- **加载遮罩（锁定）**：视口覆盖加载遮罩，实时显示进度 `n/54`；加载完成前禁用播放 / 跳转 / 键盘操作，完成后自动淡出解锁，并默认显示第一帧。
- **兜底健壮性**：每个 iframe 的 `onload` 计为就绪，另加超时兜底，避免个别外部资源（Google Fonts、`21306.top` 图片）阻塞预加载。
- **生成脚本同步**：`create_timeline.py` 生成的 `index.html` 需包含 `<script src="timeline.js">`，保持与手工版一致。

## Impact
- Affected specs: 时间轴控件、版本视口、预加载与加载态
- Affected code: `np/old/index.html`、`np/old/timeline.js`、`np/old/create_timeline.py`（生成器同步）

## ADDED Requirements

### Requirement: 时间轴置顶
系统 SHALL 将时间轴栏置于版本视口之上、header 之下。

#### Scenario: 初始加载（桌面端）
- **WHEN** 页面加载完成
- **THEN** 自上而下依次为 header、时间轴栏、版本视口

#### Scenario: 标签不被裁切
- **WHEN** 时间轴位于顶部
- **THEN** 版本号与日期标签显示在轨道下方，不越过轨道上边界被裁切、且不与 header 重叠

### Requirement: 全量预加载与零闪屏切换
系统 SHALL 将全部 54 个版本预加载为常驻的堆叠 iframe，切换时仅切换可见性。

#### Scenario: 切换版本
- **WHEN** 用户点击相邻帧 / 播放到下一帧 / 点击轨道标记
- **THEN** 目标帧即时显示，无白屏或加载闪烁

#### Scenario: 预加载进度可见
- **WHEN** 页面开始预加载
- **THEN** 遮罩显示「已就绪数量 / 总数」，并随各 iframe 的 `onload` 递增

### Requirement: 遮罩锁定交互
系统 SHALL 在预加载完成前锁定播放与跳转操作。

#### Scenario: 加载中操作
- **WHEN** 预加载未完成且用户尝试播放 / 上一帧 / 下一帧 / 点击标记 / 键盘操作
- **THEN** 操作被忽略，遮罩继续显示进度

#### Scenario: 预加载完成
- **WHEN** 所有版本 iframe 就绪（或达到超时兜底）
- **THEN** 遮罩淡出，播放与跳转控件解锁，默认显示第一帧

## MODIFIED Requirements

### Requirement: 播放控制
播放、暂停、上一帧 / 下一帧、速度切换、键盘快捷键（←/→/空格）等交互行为保持不变；实现方式由「重设 iframe `src`」改为「切换堆叠 iframe 的可见性」，并受遮罩锁定状态约束。

## REMOVED Requirements
无。