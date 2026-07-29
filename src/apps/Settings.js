// src/apps/Settings.js
import { Fyr } from '@aldane-dev-create/fyr';
import { toast } from '@aldane-dev-create/fyr/ui';

/**
 * Settings App
 * System settings: theme, wallpaper, preferences
 */
Fyr.controller('settings', {
  state: {
    theme: 'dark',
    wallpaper: 'default',
    accentColor: '#6ee7ff',
    animations: true,
    fontSize: 'medium',
    language: 'en',
    autoSave: true,
    telemetry: false
  },

  methods: {
    saveSettings() {
      // Save to localStorage
      localStorage.setItem('os-settings', JSON.stringify(this.state));
      toast.success('Settings saved!');

      // Apply theme
      document.documentElement.setAttribute('data-theme', this.state.theme);
      document.documentElement.style.setProperty('--accent', this.state.accentColor);
    },

    resetSettings() {
      if (confirm('Reset all settings to default?')) {
        this.state.theme = 'dark';
        this.state.wallpaper = 'default';
        this.state.accentColor = '#6ee7ff';
        this.state.animations = true;
        this.state.fontSize = 'medium';
        this.state.language = 'en';
        this.state.autoSave = true;
        this.state.telemetry = false;
        this.saveSettings();
        toast.info('Settings reset');
      }
    },

    loadSettings() {
      const saved = localStorage.getItem('os-settings');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          Object.assign(this.state, data);
          // Apply theme
          document.documentElement.setAttribute('data-theme', this.state.theme);
          document.documentElement.style.setProperty('--accent', this.state.accentColor);
        } catch {}
      }
    },

    applyWallpaper(wallpaper) {
      this.state.wallpaper = wallpaper;
      const body = document.querySelector('body');
      if (wallpaper === 'default') {
        body.style.background = '';
        body.style.backgroundImage = '';
      } else {
        body.style.background = `url('${wallpaper}') center/cover no-repeat`;
      }
    },

    toggleAnimations() {
      this.state.animations = !this.state.animations;
      document.documentElement.style.setProperty('--animations', this.state.animations ? '1' : '0');
    }
  },

  mounted() {
    this.loadSettings();
    console.log('⚙️ Settings mounted!');
  },


});