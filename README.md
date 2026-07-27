# OS Simulation 🖥️

A full Linux-like desktop environment in the browser showcasing the **complete power** of the Fyr framework.

[![Made with Fyr](https://img.shields.io/badge/Made%20with-Fyr-6ee7ff?style=flat-square)](https://github.com/aldane-dev-create/fyr)
[![Vite](https://img.shields.io/badge/Built%20with-Vite-646cff?style=flat-square)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

---

## ✨ Features

- 🪟 **Window Manager** — Drag, resize, minimize, close windows (WinBox.js)
- 📁 **File System** — Browse folders, create files, navigate directories
- 💻 **Terminal** — Full terminal emulator with commands (xterm.js)
- 📝 **Text Editor** — Create and edit text files
- 🧮 **Calculator** — Basic arithmetic
- ⚙️ **Settings** — Theme and wallpaper customization
- 🖥️ **Taskbar** — Start menu, running apps, system tray
- 🎨 **Desktop Icons** — Click and open applications
- 🔄 **Reactive UI** — All state updates in real-time

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Fyr (npm) |
| **Build Tool** | Vite |
| **Window Manager** | WinBox.js |
| **Terminal** | xterm.js |
| **Icons** | Font Awesome + Emoji |
| **Deployment** | Vercel |

---

## 📦 Installation

Install dependencies
bash
npm install
1 Run development server
bash
npm run dev
2. Open browser
Navigate to http://localhost:5173

🚀 Deployment
Deploy to Vercel
bash
npm i -g vercel
vercel

📁 Project Structure
text
os-simulation/
├── index.html              # Main HTML
├── package.json            # Dependencies
├── vite.config.js          # Vite config
├── vercel.json             # Vercel deployment
├── README.md               # Documentation
│
├── src/
│   ├── main.js             # Entry point
│   ├── app.js              # Main controller
│   ├── desktop.js          # Desktop icons, context menu
│   ├── taskbar.js          # Taskbar, start menu
│   ├── window-manager.js   # WinBox window management
│   ├── filesystem.js       # File system data
│   ├── terminal.js         # Terminal logic
│   ├── apps/
│   │   ├── FileExplorer.js
│   │   ├── TextEditor.js
│   │   ├── Calculator.js
│   │   ├── Terminal.js
│   │   └── Settings.js
│   └── styles.css          # All styles
│
└── public/
    └── (no images needed)

🎯 Showcases All Fyr Capabilities
Feature	Fyr Capability
Reactive State	Controllers with state, computed, watch
Window Manager	WinBox.js integration
Desktop Icons	fyr-for, fyr-click, fyr-dblclick
Taskbar	fyr-show, fyr-class, reactive state
Start Menu	fyr-if, fyr-for, fyr-click
File System	Reactive state with nested objects
Terminal	fyr-model, fyr-on:keyup.enter, xterm.js
Multiple Windows	fyr-for over windows array
Z-Index Management	fyr-click on windows
Dynamic Apps	fyr-init, computed values
Custom Directives	Extend Fyr with custom behavior
📝 License
MIT

Built with Fyr — build without the complexity 🔥

