# 🚀 21306.top

> ZMH 的个人项目展示站 · 开源工具 · 学生报纸

[![项目状态](https://img.shields.io/badge/项目状态-活跃中-success?style=flat-square&logo=github)](https://github.com/Zmh20121211/21306.top)
[![许可证](https://img.shields.io/badge/许可证-GPL--3.0-blue?style=flat-square&logo=gnu)](LICENSE)
[![最后更新](https://img.shields.io/badge/最后更新-2026年10月11日-brightgreen?style=flat-square&logo=calendar)](README.md)

[English](README_EN.md) | [中文](README.md)

---

## 📖 项目简介

**21306.top** 是 ZMH 的个人项目展示与开源工具网站，同时承载「语文 6 班 5 组」学生报纸的发布平台。主要内容包括：

- **开源项目展示** — ClassIn-DL、LlamaUI、Blender 插件汉化合集等独立项目
- **实用在线工具** — 模拟时钟、WebGL 性能测试、Arduino 资源分发
- **学生报纸平台** — 「语文 5 组的神秘报纸」& 「凌云逐风」，支持横版 A4 排版、打印导出、多版本索引

项目采用纯前端技术栈构建，无需后端服务，可直接部署到任意静态托管平台（如 GitHub Pages）。

---

## ✨ 功能模块

| 模块 | 说明 |
|------|------|
| 🏠 **主页** | 项目展示与工具导航入口，支持亮/暗主题切换 |
| 📹 **ClassIn-DL** | ClassIn 课程视频多线程下载器（C# · Avalonia） |
| 🦙 **LlamaUI** | LLM 本地部署桌面控制台（Rust · Tauri 2） |
| 🎨 **Blender 汉化** | Blender 插件简体中文汉化合集（7 款插件） |
| ⏱️ **模拟时钟** | 全屏模拟时钟，支持多端自适应与全屏显示 |
| ⚡ **毒蘑菇性能测试** | WebGL Mandelbulb 渲染，测试设备 GPU 性能 |
| 🔌 **Arduino 资源** | NullLab AVR 开发板包分发与 Arduino 数据文件 |
| 📰 **语文 5 组的神秘报纸** | 学生报纸索引页，三版本导航 |
| 📄 **校园日报（第一版）** | 体育健康特刊，横版 A4 布局 |
| 📄 **凌云逐风（第二版）** | 双页横版 A4，含图文混排与组员通讯 |
| 🚧 **404 页面** | 自定义 404 错误页面 |

---

## 🗂️ 项目结构

```
21306.top/
├── index.html          # 主页面（项目展示 + 工具入口）
├── 404.html            # 404 错误页面
├── clock/              # 模拟时钟模块
│   └── index.html
├── vsbm/               # 毒蘑菇性能测试（WebGL Mandelbulb）
│   └── index.html
├── arduino/            # Arduino 开发板包资源
│   ├── 7c020fa3-...zip        # NullLab AVR 开发板包
│   └── 963a656d-...json       # Arduino 包管理器 manifest
├── np/                 # 学生报纸模块
│   ├── index.html       # 报纸索引页（版本导航）
│   ├── v1/
│   │   └── index.html   # 第一版：校园日报 · 体育健康特刊
│   └── v2/
│       ├── index.html   # 第二版：凌云逐风（双页横版 A4）
│       ├── 这是一张图.jpg
│       └── 这又是一张图.jpg
├── favicon.ico         # 站点图标
├── CNAME               # 自定义域名配置（21306.top）
├── gen_timeline.py     # 时间线生成脚本
├── reindex.py          # 版本号重排脚本
├── rewrite_manifest.py # Manifest 重写脚本
├── export_index.py     # 报纸版本导出脚本（Git 历史抓取）
├── README.md           # 项目说明（中文）
└── README_EN.md        # 项目说明（英文）
```

---

## 🛠️ 技术栈

| 类型 | 技术 |
|------|------|
| **前端** | HTML5 · CSS3 · Vanilla JavaScript |
| **图形渲染** | WebGL 1.0（毒蘑菇 Mandelbulb 渲染） |
| **字体** | Google Fonts（Ma Shan Zheng、Noto Serif SC） |
| **桌面应用** | C# · Avalonia（ClassIn-DL）；Rust · Tauri 2（LlamaUI） |
| **汉化** | Python（Blender 插件汉化） |
| **托管** | GitHub Pages（`https://21306.top`） |

---

## 📰 学生报纸开发

### 设计理念
- 横版 A4（297mm × 210mm）真实纸媒比例，CSS zoom 自适应屏幕宽度
- 经典报刊排版：报头双线、两栏正文、楷体署名、宋体正文
- 原生打印支持（`@media print` + `@page size: A4 landscape`）
- 字体通过 Google Fonts 加载，按需分片，首屏极快

### 版本历史

| 版本 | 名称 | 日期 | 说明 |
|------|------|------|------|
| v1 | 校园日报 · 体育健康特刊 | 2026-10-08 | 总第 001 期，四篇文章，左栏双篇 / 右栏双篇 |
| v2 | 凌云逐风 | 2026-10-09 | 双页横版，含配图、组员通讯、记者署名，排版全面升级 |
| v3 | （规划中） | — | 第三版尚未完成 |

### 生成工具
- **export_index.py** — 从 Git 历史抓取所有版本 index.html，导出为时间戳命名文件
- **reindex.py** — 自动按时间顺序重命名版本号（v0002→v0001 等）
- **rewrite_manifest.py** — 重写 `_MANIFEST.txt`，关联版本、时间戳与 Git commit
- **gen_timeline.py** — 时间线生成脚本（当前待完善）

---

## 🚀 快速开始

### 本地预览

```bash
# 克隆仓库
git clone https://github.com/Zmh20121211/21306.top.git
cd 21306.top

# 使用任意静态服务器预览
python -m http.server 8080
# 或
npx serve .
```

### 部署到 GitHub Pages

1. 在仓库 Settings → Pages 中启用 GitHub Pages
2. 选择部署分支（`main`）和根目录
3. 访问 `https://21306.top` 或 `https://Zmh20121211.github.io/21306.top`

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建功能分支（`feature/描述`）
3. 提交更改
4. 推送到分支
5. 提交 Pull Request

---

## 📄 许可证

本项目基于 **GPL-3.0** 许可证分发。详见 [LICENSE](LICENSE) 文件。

---

## ⭐ Star 历史

[![Star History Chart](https://api.star-history.com/svg?repos=Zmh20121211/21306.top&type=Date)](https://star-history.com/#Zmh20121211/21306.top&Date)

---

<div align="right">
  <strong>最后更新:</strong> 2026年10月11日
</div>
