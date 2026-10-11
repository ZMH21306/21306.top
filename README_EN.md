# 🚀 21306.top

> ZMH's Personal Project Showcase · Open Source Tools · Student Newspaper

[![Project Status](https://img.shields.io/badge/Status-Active-success?style=flat-square&logo=github)](https://github.com/Zmh20121211/21306.top)
[![License](https://img.shields.io/badge/License-GPL--3.0-blue?style=flat-square&logo=gnu)](LICENSE)
[![Last Update](https://img.shields.io/badge/Last_Update-Oct_11,_2026-brightgreen?style=flat-square&logo=calendar)](README_EN.md)

[English](README_EN.md) | [中文](README.md)

---

## 📖 About

**21306.top** is ZMH's personal project showcase and open-source tools website, as well as the publishing platform for the "Chinese Language Class 6 Group 5" student newspaper. Main contents include:

- **Open Source Projects** — ClassIn-DL, LlamaUI, Blender Plugin Chinese Localization Collection
- **Online Utilities** — Analog Clock, WebGL Performance Test, Arduino Resource Distribution
- **Student Newspaper** — "Mysterious Newspaper of Chinese Group 5" & "Lingyun Zhufeng", supporting A4 landscape layout, print export, and multi-version index

Built entirely with frontend technologies, requiring no backend, deployable to any static hosting platform (e.g., GitHub Pages).

---

## ✨ Features

| Module | Description |
|--------|-------------|
| 🏠 **Homepage** | Project showcase & tool navigation, supports light/dark theme toggle |
| 📹 **ClassIn-DL** | ClassIn course video downloader with multi-threading (C# · Avalonia) |
| 🦙 **LlamaUI** | LLM local deployment desktop console (Rust · Tauri 2) |
| 🎨 **Blender ZH** | Chinese localization collection for 7 Blender plugins |
| ⏱️ **Analog Clock** | Fullscreen analog clock with responsive scaling and fullscreen button |
| ⚡ **Toadstool Benchmark** | WebGL Mandelbulb renderer to test device GPU performance |
| 🔌 **Arduino Resources** | NullLab AVR board package distribution and Arduino data files |
| 📰 **Mysterious Newspaper** | Student newspaper index page with version navigation |
| 📄 **Campus Daily (v1)** | Sports & Health Special, A4 landscape, four articles |
| 📄 **Lingyun Zhufeng (v2)** | Dual-page A4 landscape with images, dispatch section, reporter credits |
| 🚧 **404 Page** | Custom 404 error page |

---

## 🗂️ Project Structure

```
21306.top/
├── index.html          # Homepage (project showcase + tool entry)
├── 404.html            # 404 error page
├── clock/              # Analog clock module
│   └── index.html
├── vsbm/               # Toadstool WebGL Benchmark (Mandelbulb renderer)
│   └── index.html
├── arduino/            # Arduino development board resources
│   ├── 7c020fa3-...zip        # NullLab AVR board package
│   └── 963a656d-...json       # Arduino package manager manifest
├── np/                 # Student Newspaper module
│   ├── index.html       # Newspaper index (version navigation)
│   ├── v1/
│   │   └── index.html   # v1: Campus Daily · Sports & Health Special
│   └── v2/
│       ├── index.html   # v2: Lingyun Zhufeng (dual-page A4 landscape)
│       ├── 这是一张图.jpg
│       └── 这又是一张图.jpg
├── favicon.ico         # Site icon
├── CNAME               # Custom domain (21306.top)
├── gen_timeline.py     # Timeline generation script
├── reindex.py          # Version numbering reindex script
├── rewrite_manifest.py # Manifest rewriting script
├── export_index.py     # Newspaper version export (Git history fetcher)
├── README.md           # Project documentation (Chinese)
└── README_EN.md        # Project documentation (English)
```

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | HTML5 · CSS3 · Vanilla JavaScript |
| **Graphics** | WebGL 1.0 (Mandelbulb ray marching renderer) |
| **Fonts** | Google Fonts (Ma Shan Zheng, Noto Serif SC) |
| **Desktop Apps** | C# · Avalonia (ClassIn-DL); Rust · Tauri 2 (LlamaUI) |
| **Localization** | Python (Blender plugin Chinese translation) |
| **Hosting** | GitHub Pages (`https://21306.top`) |

---

## 📰 Student Newspaper

### Design Philosophy
- Real A4 landscape (297mm × 210mm) paper proportion, CSS zoom for responsive screen fitting
- Classic newspaper layout: double-line masthead, two-column text, KaiTi bylines, Songti body
- Native print support (`@media print` + `@page size: A4 landscape`)
- Fonts loaded via Google Fonts, subresource-split for fast first paint

### Version History

| Version | Title | Date | Description |
|---------|-------|------|-------------|
| v1 | Campus Daily · Sports & Health Special | 2026-10-08 | Issue 001, four articles, left/right column layout |
| v2 | Lingyun Zhufeng | 2026-10-09 | Dual-page A4 with inline images, dispatch section, reporter credits, full layout upgrade |
| v3 | (Planned) | — | Third version not yet completed |

### Build Tools
- **export_index.py** — Fetches all version index.html files from Git history, exports as timestamp-named files
- **reindex.py** — Auto-renames version numbers in chronological order (v0002→v0001, etc.)
- **rewrite_manifest.py** — Rewrites `_MANIFEST.txt` linking versions, timestamps, and Git commits
- **gen_timeline.py** — Timeline generation script (WIP)

---

## 🚀 Quick Start

### Local Preview

```bash
# Clone the repository
git clone https://github.com/Zmh20121211/21306.top.git
cd 21306.top

# Serve with any static server
python -m http.server 8080
# or
npx serve .
```

### Deploy to GitHub Pages

1. Enable GitHub Pages in repository Settings → Pages
2. Select the deployment branch (`main`) and root directory
3. Visit `https://21306.top` or `https://Zmh20121211.github.io/21306.top`

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit Issues and Pull Requests.

1. Fork this repository
2. Create a feature branch (`feature/description`)
3. Commit your changes
4. Push to the branch
5. Submit a Pull Request

---

## 📄 License

This project is distributed under the **GPL-3.0** license. See the [LICENSE](LICENSE) file for details.

---

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Zmh20121211/21306.top&type=Date)](https://star-history.com/#Zmh20121211/21306.top&Date)

---

<div align="right">
  <strong>Last Updated:</strong> Oct 11, 2026
</div>
