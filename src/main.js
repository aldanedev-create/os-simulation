// src/main.js
import { Fyr } from '@aldane-dev-create/fyr';
import { toast } from '@aldane-dev-create/fyr/ui';

import './app.js';
import './desktop.js';
import './taskbar.js';
import './window-manager.js';
import './filesystem.js';
import './terminal.js';

// Import apps
import './apps/FileExplorer.js';
import './apps/TextEditor.js';
import './apps/Calculator.js';
import './apps/Settings.js';

// Configure Fyr
Fyr.configure({
  apiBaseUrl: '/api',
  credentials: 'include'
});

// Start the app
document.addEventListener('DOMContentLoaded', () => {
  Fyr.start('os');
});

console.log('🖥️ OS Simulation loaded!');
