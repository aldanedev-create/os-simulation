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

  template: `
    <div class="settings-app">
      <h2>System Settings</h2>

      <div class="settings-section">
        <h3>Appearance</h3>
        <div class="setting-row">
          <label>Theme</label>
          <select fyr-model="theme" fyr-on:change="saveSettings()">
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="system">System</option>
          </select>
        </div>

        <div class="setting-row">
          <label>Accent Color</label>
          <input type="color" fyr-model="accentColor" fyr-on:input="saveSettings()" />
        </div>

        <div class="setting-row">
          <label>Wallpaper</label>
          <div class="wallpaper-options">
            <button class="wallpaper-btn" fyr-click="applyWallpaper('default')">Default</button>
            <button class="wallpaper-btn" fyr-click="applyWallpaper('https://picsum.photos/1920/1080?random=1')">🌄 Nature</button>
            <button class="wallpaper-btn" fyr-click="applyWallpaper('https://picsum.photos/1920/1080?random=2')">🌃 City</button>
            <button class="wallpaper-btn" fyr-click="applyWallpaper('https://picsum.photos/1920/1080?random=3')">🎨 Abstract</button>
          </div>
        </div>
      </div>

      <div class="settings-section">
        <h3>System</h3>
        <div class="setting-row">
          <label>Animations</label>
          <input type="checkbox" fyr-model="animations" fyr-on:change="toggleAnimations()" />
        </div>

        <div class="setting-row">
          <label>Font Size</label>
          <select fyr-model="fontSize" fyr-on:change="saveSettings()">
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <div class="setting-row">
          <label>Auto-save</label>
          <input type="checkbox" fyr-model="autoSave" fyr-on:change="saveSettings()" />
        </div>

        <div class="setting-row">
          <label>Language</label>
          <select fyr-model="language" fyr-on:change="saveSettings()">
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>

        <div class="setting-row">
          <label>Telemetry</label>
          <input type="checkbox" fyr-model="telemetry" fyr-on:change="saveSettings()" />
        </div>
      </div>

      <div class="settings-actions">
        <button class="btn-primary" fyr-click="saveSettings()">Save Settings</button>
        <button class="btn-secondary" fyr-click="resetSettings()">Reset</button>
      </div>
    </div>
  `
});