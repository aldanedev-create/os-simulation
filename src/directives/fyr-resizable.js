// src/directives/fyr-resizable.js
import { Fyr } from '@aldane-dev-create/fyr';

/**
 * fyr-resizable directive
 * Makes an element resizable
 * 
 * Usage:
 *   <div fyr-resizable></div>
 *   <div fyr-resizable="{ edges: ['bottom-right'] }"></div>
 */
Fyr.directive('resizable', (element, expression, context) => {
  // Skip if already bound
  if (element._fyrResizableBound) return;
  element._fyrResizableBound = true;

  const edges = ['bottom-right', 'bottom', 'right'];
  let minWidth = 100;
  let minHeight = 80;

  // Parse expression
  if (expression && expression.trim()) {
    try {
      const config = JSON.parse(expression);
      if (config.edges) edges = config.edges;
      if (config.minWidth) minWidth = config.minWidth;
      if (config.minHeight) minHeight = config.minHeight;
    } catch {}
  }

  // Create resize handles
  edges.forEach(edge => {
    const handle = document.createElement('div');
    handle.className = `resize-handle resize-handle-${edge}`;
    handle.style.cssText = `
      position: absolute;
      ${edge.includes('bottom') ? 'bottom: -4px;' : 'top: -4px;'}
      ${edge.includes('right') ? 'right: -4px;' : 'left: -4px;'}
      width: 12px;
      height: 12px;
      background: var(--accent);
      border-radius: 50%;
      cursor: ${edge.includes('right') ? 'ew-resize' : 'ns-resize'};
      opacity: 0.6;
      z-index: 10;
      transition: opacity 0.2s;
    `;
    element.appendChild(handle);

    let isResizing = false;
    let startX = 0;
    let startY = 0;
    let startWidth = 0;
    let startHeight = 0;

    const onMouseDown = (e) => {
      e.stopPropagation();
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startWidth = element.offsetWidth;
      startHeight = element.offsetHeight;

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e) => {
      if (!isResizing) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (edge.includes('right')) {
        const newWidth = Math.max(minWidth, startWidth + dx);
        element.style.width = newWidth + 'px';
      }
      if (edge.includes('bottom')) {
        const newHeight = Math.max(minHeight, startHeight + dy);
        element.style.height = newHeight + 'px';
      }
    };

    const onMouseUp = () => {
      isResizing = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    handle.addEventListener('mousedown', onMouseDown);

    // Store cleanup
    const cleanup = () => {
      handle.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    if (!element._fyrCleanups) {
      element._fyrCleanups = [];
    }
    element._fyrCleanups.push(cleanup);
  });

  // Hover effect
  element.addEventListener('mouseenter', () => {
    const handles = element.querySelectorAll('.resize-handle');
    handles.forEach(h => h.style.opacity = '1');
  });

  element.addEventListener('mouseleave', () => {
    const handles = element.querySelectorAll('.resize-handle');
    handles.forEach(h => h.style.opacity = '0.6');
  });
});