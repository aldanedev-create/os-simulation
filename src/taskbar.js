// src/taskbar.js
import { Fyr } from '@aldane-dev-create/fyr';
import { toast } from '@aldane-dev-create/fyr/ui';
import { focusWindow, closeWindow } from './window-manager.js';

/**
 * Taskbar Controller
 * Handles: Start menu, running apps, system tray
 */
Fyr.controller('taskbar', {
  state: {
    runningApps: [],
    activeAppId: null,
    startMenuOpen: false,
    allApps: [
      { id: 'explorer', name: 'File Explorer', icon: '📁' },
      { id: 'editor', name: 'Text Editor', icon: '📝' },
      { id: 'calculator', name: 'Calculator', icon: '🧮' },
      { id: 'terminal', name: 'Terminal', icon: '💻' },
      { id: 'settings', name: 'Settings', icon: '⚙️' },
      { id: 'about', name: 'About', icon: 'ℹ️' }
    ],
    currentTime: new Date().toLocaleTimeString()
  },

  methods: {
    toggleStartMenu() {
      this.state.startMenuOpen = !this.state.startMenuOpen;
    },

    closeStartMenu() {
      this.state.startMenuOpen = false;
    },

    openApp(appId) {
      // Find the app
      const app = this.state.allApps.find(a => a.id === appId);
      if (!app) return;

      // Check if already running
      const existing = this.state.runningApps.find(a => a.id === appId);
      if (existing) {
        this.focusApp(appId);
        this.closeStartMenu();
        return;
      }

      // Add to running apps
      this.state.runningApps.push({
        ...app,
        windowId: `win-${appId}-${Date.now()}`
      });
      this.state.activeAppId = appId;
      this.closeStartMenu();

      // Open the window (handled by window-manager)
      const desktopEl = document.querySelector('[fyr-controller="desktop"]');
      if (desktopEl?.__fyrController) {
        desktopEl.__fyrController.openApp(appId);
      }
    },

    focusApp(appId) {
      this.state.activeAppId = appId;
      focusWindow(appId);
    },

    closeApp(appId) {
      const app = this.state.runningApps.find(a => a.id === appId);
      if (app) {
        this.state.runningApps = this.state.runningApps.filter(a => a.id !== appId);
        if (this.state.activeAppId === appId) {
          this.state.activeAppId = this.state.runningApps[0]?.id || null;
        }
        closeWindow(appId);
        toast.info(`Closed ${app.name}`);
      }
    },

    shutdown() {
      if (confirm('Shutdown the system?')) {
        toast.info('Shutting down...');
        setTimeout(() => {
          document.body.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#0a0f1a;color:#6ee7ff;font-size:24px;flex-direction:column;gap:20px;">
              <div>⏻ System Shutdown</div>
              <div style="font-size:14px;color:#91a0bc;">Click to restart</div>
            </div>
          `;
          document.body.addEventListener('click', () => location.reload());
        }, 2000);
      }
    },

    updateTime() {
      this.state.currentTime = new Date().toLocaleTimeString();
    }
  },

  mounted() {
    // Update time every second
    setInterval(() => {
      this.updateTime();
    }, 1000);

    // Listen for app open/close events
    document.addEventListener('fyr:app:open', (e) => {
      const { appId, name, icon } = e.detail;
      if (!this.state.runningApps.find(a => a.id === appId)) {
        this.state.runningApps.push({ id: appId, name, icon, windowId: `win-${appId}` });
        this.state.activeAppId = appId;
      }
    });

    document.addEventListener('fyr:app:close', (e) => {
      const { appId } = e.detail;
      this.state.runningApps = this.state.runningApps.filter(a => a.id !== appId);
      if (this.state.activeAppId === appId) {
        this.state.activeAppId = this.state.runningApps[0]?.id || null;
      }
    });

    document.addEventListener('fyr:app:focus', (e) => {
      this.state.activeAppId = e.detail.appId;
    });

    console.log('📋 Taskbar controller mounted!');
  }
});