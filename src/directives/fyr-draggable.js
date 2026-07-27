// src/directives/fyr-draggable.js
import { Fyr } from '@aldane-dev-create/fyr';

/**
 * fyr-draggable directive
 * Makes an element draggable
 * 
 * Usage:
 *   <div fyr-draggable></div>
 *   <div fyr-draggable="handle: .handle"></div>
 */
Fyr.directive('draggable', (element, expression, context) => {
  // Skip if already bound
  if (element._fyrDraggableBound) return;
  element._fyrDraggableBound = true;

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let offsetX = 0;
  let offsetY = 0;
  let handle = element;

  // Parse expression for handle selector
  if (expression && expression.trim()) {
    try {
      const config = JSON.parse(expression);
      if (config.handle) {
        const handleEl = element.querySelector(config.handle);
        if (handleEl) handle = handleEl;
      }
    } catch {
      // If not JSON, treat as selector
      const handleEl = element.querySelector(expression);
      if (handleEl) handle = handleEl;
    }
  }

  const onMouseDown = (e) => {
    if (e.target.closest('.winbox-close') || e.target.closest('.winbox-min') || e.target.closest('.winbox-max')) {
      return;
    }

    isDragging = true;
    const rect = element.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    offsetX = startX - rect.left;
    offsetY = startY - rect.top;

    element.style.cursor = 'grabbing';
    element.style.userSelect = 'none';
    element.style.position = 'absolute';
    element.style.zIndex = 1000;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    element.style.left = (element.offsetLeft + dx) + 'px';
    element.style.top = (element.offsetTop + dy) + 'px';

    startX = e.clientX;
    startY = e.clientY;
  };

  const onMouseUp = () => {
    isDragging = false;
    element.style.cursor = '';
    element.style.userSelect = '';
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  handle.addEventListener('mousedown', onMouseDown);

  // Cleanup
  const cleanup = () => {
    handle.removeEventListener('mousedown', onMouseDown);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    element._fyrDraggableBound = false;
  };

  // Store cleanup
  if (!element._fyrCleanups) {
    element._fyrCleanups = [];
  }
  element._fyrCleanups.push(cleanup);
});