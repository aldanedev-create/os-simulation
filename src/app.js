// src/app.js
import { Fyr } from '@aldane-dev-create/fyr';

/**
 * Main OS Controller
 * Handles: Global state, app registry, system info
 */
Fyr.controller('app', {
  state: {
    systemName: 'Fyr OS',
    version: '1.0.0',
    username: 'user',
    hostname: 'fyr-os',
    theme: 'dark',
    wallpaper: 'default',
    bootTime: Date.now()
  },

  computed: {
    uptime() {
      const diff = Date.now() - this.state.bootTime;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    }
  },

  methods: {
    getAppById(id) {
      return this.state.installedApps?.find(a => a.id === id);
    },

    getRunningApp(id) {
      return this.state.runningApps?.find(a => a.id === id);
    }
  },

  mounted() {
    console.log('🖥️ OS mounted!');
  }
});