// src/apps/FileExplorer.js
import { Fyr } from '@aldane-dev-create/fyr';
import { fileSystem } from '../filesystem.js';
import { toast } from '@aldane-dev-create/fyr/ui';

/**
 * File Explorer App
 * Browse files and folders
 */
Fyr.controller('explorer', {
  state: {
    currentPath: '/home/user',
    items: [],
    breadcrumbs: [],
    selectedItem: null,
    viewMode: 'list' // list, grid
  },

  computed: {
    pathDisplay() {
      return this.state.currentPath.replace('/home/user', '~');
    }
  },

  methods: {
    navigate(path) {
      const node = fileSystem.getFile(path);
      if (node && node.type === 'folder') {
        this.state.currentPath = path;
        this.loadDirectory();
        this.updateBreadcrumbs();
      } else {
        toast.error('Folder not found');
      }
    },

    loadDirectory() {
      const items = fileSystem.getChildren(this.state.currentPath);
      this.state.items = items.map(item => ({
        ...item,
        icon: item.type === 'folder' ? '📁' : '📄',
        sizeDisplay: item.type === 'file' ? `${item.size || 0} B` : ''
      }));
    },

    updateBreadcrumbs() {
      const parts = this.state.currentPath.split('/').filter(p => p);
      this.state.breadcrumbs = parts.map((p, i) => ({
        name: p,
        path: '/' + parts.slice(0, i + 1).join('/')
      }));
      // Add root
      this.state.breadcrumbs.unshift({ name: '🏠', path: '/' });
    },

    goHome() {
      this.navigate('/home/user');
    },

    goBack() {
      const parts = this.state.currentPath.split('/');
      parts.pop();
      const parent = parts.join('/') || '/';
      this.navigate(parent);
    },

    selectItem(name) {
      this.state.selectedItem = name;
    },

    openItem(name) {
      const item = this.state.items.find(i => i.name === name);
      if (!item) return;

      if (item.type === 'folder') {
        const path = this.state.currentPath === '/' 
          ? `/${name}` 
          : `${this.state.currentPath}/${name}`;
        this.navigate(path);
      } else if (item.type === 'file') {
        const path = this.state.currentPath === '/' 
          ? `/${name}` 
          : `${this.state.currentPath}/${name}`;
        // Open in editor
        const desktopEl = document.querySelector('[fyr-controller="desktop"]');
        if (desktopEl?.__fyrController) {
          desktopEl.__fyrController.openFile(path);
        }
      }
    },

    createFolder() {
      const name = prompt('Folder name:');
      if (!name) return;

      const result = fileSystem.createFolder(this.state.currentPath, name);
      if (result.success) {
        toast.success(`Folder "${name}" created`);
        this.loadDirectory();
      } else {
        toast.error(result.error || 'Failed to create folder');
      }
    },

    createFile() {
      const name = prompt('File name:');
      if (!name) return;

      const result = fileSystem.createFile(this.state.currentPath, name, '');
      if (result.success) {
        toast.success(`File "${name}" created`);
        this.loadDirectory();
      } else {
        toast.error(result.error || 'Failed to create file');
      }
    },

    deleteItem(name) {
      if (!confirm(`Delete "${name}"?`)) return;

      const path = this.state.currentPath === '/' 
        ? `/${name}` 
        : `${this.state.currentPath}/${name}`;
      const result = fileSystem.delete(path);
      if (result.success) {
        toast.success(`"${name}" deleted`);
        this.loadDirectory();
      } else {
        toast.error(result.error || 'Failed to delete');
      }
    },

    toggleView() {
      this.state.viewMode = this.state.viewMode === 'list' ? 'grid' : 'list';
    },

    formatSize(bytes) {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
  },

  mounted() {
    this.loadDirectory();
    this.updateBreadcrumbs();

    // Listen for navigation events from desktop
    document.addEventListener('fyr:explorer:navigate', (e) => {
      this.navigate(e.detail.path);
    });

    console.log('📁 File Explorer mounted!');
  },

});