// src/window-manager.js
import { Fyr } from '@aldane-dev-create/fyr';
import { toast } from '@aldane-dev-create/fyr/ui';

// Store window references
const windows = new Map();

/**
 * Open a new window using WinBox.js
 * @param {string} appId - Unique app identifier
 * @param {string} title - Window title
 * @param {string} icon - Window icon
 * @param {object} options - Additional WinBox options
 * @returns {object} WinBox instance
 */
export function openWindow(appId, title, icon = '📄', options = {}) {
  // Check if window already exists
  if (windows.has(appId)) {
    const existing = windows.get(appId);
    if (existing && !existing.isClosed) {
      existing.focus();
      return existing;
    }
  }

  // Emit app open event
  document.dispatchEvent(new CustomEvent('fyr:app:open', {
    detail: { appId, name: title, icon }
  }));

  // Create the window
  const win = new WinBox({
    id: `win-${appId}`,
    title: `${icon} ${title}`,
    width: options.width || 600,
    height: options.height || 400,
    x: options.x || (window.innerWidth / 2 - 300 + Math.random() * 100),
    y: options.y || (window.innerHeight / 2 - 200 + Math.random() * 50),
    top: options.top || 40,
    onfocus: () => {
      document.dispatchEvent(new CustomEvent('fyr:app:focus', {
        detail: { appId }
      }));
    },
    onclose: () => {
      returnAppElement(appId);
      closeWindow(appId);
    },
    ...options
  });

  // Store reference
  windows.set(appId, win);

  // Set initial content (will be replaced by app-specific content)
  win.body.innerHTML = `
    <div style="padding:20px;color:#91a0bc;display:flex;align-items:center;justify-content:center;height:100%;">
      Loading ${title}...
    </div>
  `;

  // Load app content
  loadAppContent(appId, win);

  return win;
}

/**
 * Load app content into window
 */
function loadAppContent(appId, win) {
  // Find the already-mounted app element (lives in the hidden #app-templates container)
  const appEl = document.querySelector(`[fyr-controller="${appId}"]`);
  if (appEl) {
    // Move the real element into the window (don't clone — cloneNode() only
    // copies markup, it drops all of Fyr's event bindings/reactivity).
    appEl.style.display = 'block';
    win.body.innerHTML = '';
    win.body.appendChild(appEl);
  } else {
    // Fallback: show placeholder
    win.body.innerHTML = `
      <div style="padding:40px;color:#91a0bc;text-align:center;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;">
        <div style="font-size:48px;margin-bottom:16px;">${getAppIcon(appId)}</div>
        <h2>${getAppTitle(appId)}</h2>
        <p style="color:#6b7fa0;">App content will be rendered here.</p>
      </div>
    `;
  }
}

// Move an app's element back into the hidden template container so it
// survives the window being destroyed, and reopens with its state intact.
function returnAppElement(appId) {
  const appEl = document.querySelector(`[fyr-controller="${appId}"]`);
  const templates = document.getElementById('app-templates');
  if (appEl && templates) {
    appEl.style.display = 'none';
    templates.appendChild(appEl);
  }
}
function getAppIcon(appId) {
  const icons = {
    explorer: '📁',
    editor: '📝',
    calculator: '🧮',
    terminal: '💻',
    settings: '⚙️',
    about: 'ℹ️'
  };
  return icons[appId] || '📄';
}

function getAppTitle(appId) {
  const titles = {
    explorer: 'File Explorer',
    editor: 'Text Editor',
    calculator: 'Calculator',
    terminal: 'Terminal',
    settings: 'Settings',
    about: 'About'
  };
  return titles[appId] || 'Application';
}

/**
 * Focus a window
 */
export function focusWindow(appId) {
  const win = windows.get(appId);
  if (win && !win.isClosed) {
    win.focus();
  }
}

/**
 * Close a window
 */
export function closeWindow(appId) {
  const win = windows.get(appId);
  if (win && !win.isClosed) {
    win.close();
    windows.delete(appId);
  }

  document.dispatchEvent(new CustomEvent('fyr:app:close', {
    detail: { appId }
  }));
}

/**
 * Get window instance
 */
export function getWindow(appId) {
  return windows.get(appId);
}

/**
 * Get all open windows
 */
export function getOpenWindows() {
  const result = [];
  for (const [id, win] of windows) {
    if (!win.isClosed) {
      result.push({ id, win });
    }
  }
  return result;
}

/**
 * Close all windows
 */
export function closeAllWindows() {
  for (const [id, win] of windows) {
    if (!win.isClosed) {
      win.close();
    }
  }
  windows.clear();
}

// Export for use in controllers
export default {
  openWindow,
  focusWindow,
  closeWindow,
  getWindow,
  getOpenWindows,
  closeAllWindows
};