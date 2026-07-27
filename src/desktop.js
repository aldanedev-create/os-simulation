// src/desktop.js
import { Fyr } from '@aldane-dev-create/fyr';
import { toast } from '@aldane-dev-create/fyr/ui';
import { openWindow } from './window-manager.js';
import { fileSystem } from './filesystem.js';

/**
 * Desktop Controller
 * Handles: Desktop icons, context menu, file operations
 */
Fyr.controller('desktop', {
  state: {
    desktopApps: [
      { id: 'explorer', name: 'File Explorer', icon: '📁' },
      { id: 'editor', name: 'Text Editor', icon: '📝' },
      { id: 'calculator', name: 'Calculator', icon: '🧮' },
      { id: 'terminal', name: 'Terminal', icon: '💻' },
      { id: 'settings', name: 'Settings', icon: '⚙️' },
      { id: 'about', name: 'About', icon: 'ℹ️' }
    ],
    selectedIcon: null,
    contextMenu: {
      visible: false,
      x: 0,
      y: 0
    }
  },

  methods: {
    openApp(appId) {
      const app = this.state.desktopApps.find(a => a.id === appId);
      if (!app) return;

      // Check if app is already running
      const taskbarEl = document.querySelector('[fyr-controller="taskbar"]');
      const taskbar = taskbarEl?.__fyrController;
      if (taskbar) {
        const running = taskbar.state.runningApps.find(a => a.id === appId);
        if (running) {
          taskbar.focusApp(appId);
          return;
        }
      }

      // Open the app
      openWindow(appId, app.name, app.icon);
      toast.info(`Opening ${app.name}...`);
    },

    selectIcon(appId) {
      this.state.selectedIcon = appId;
    },

    openFile(path) {
      const file = fileSystem.getFile(path);
      if (!file) {
        toast.error('File not found');
        return;
      }

      if (file.type === 'folder') {
        // Open file explorer at this path
        this.openApp('explorer');
        // Pass path to explorer
        setTimeout(() => {
          const explorerEl = document.querySelector('[fyr-controller="explorer"]');
          if (explorerEl?.__fyrController) {
            explorerEl.__fyrController.navigate(path);
          }
        }, 100);
      } else if (file.type === 'file') {
        // Open with appropriate app
        if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
          this.openApp('editor');
          setTimeout(() => {
            const editorEl = document.querySelector('[fyr-controller="editor"]');
            if (editorEl?.__fyrController) {
              editorEl.__fyrController.openFile(path);
            }
          }, 100);
        } else {
          toast.info(`Cannot open ${file.name}`);
        }
      }
    },

    // ===== CONTEXT MENU =====
    showContextMenu(event) {
      event.preventDefault();
      this.state.contextMenu.visible = true;
      this.state.contextMenu.x = event.clientX;
      this.state.contextMenu.y = event.clientY;
    },

    hideContextMenu() {
      this.state.contextMenu.visible = false;
    },

    contextAction(action) {
      this.hideContextMenu();
      switch (action) {
        case 'refresh':
          toast.info('Desktop refreshed');
          break;
        case 'newFolder':
          this.createNewFolder();
          break;
        case 'openTerminal':
          this.openApp('terminal');
          break;
        case 'settings':
          this.openApp('settings');
          break;
        default:
          break;
      }
    },

    createNewFolder() {
      const name = prompt('Folder name:', 'New Folder');
      if (name) {
        const result = fileSystem.createFolder('/home/user/Desktop', name);
        if (result.success) {
          toast.success(`Folder "${name}" created`);
        } else {
          toast.error(result.error || 'Failed to create folder');
        }
      }
    }
  },

  mounted() {
    // Close context menu on click outside
    document.addEventListener('click', () => {
      this.hideContextMenu();
    });

    // Right-click on desktop
    const desktop = document.querySelector('.desktop');
    if (desktop) {
      desktop.addEventListener('contextmenu', this.showContextMenu.bind(this));
    }

    console.log('🖥️ Desktop controller mounted!');
  }
});