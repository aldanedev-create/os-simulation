// src/filesystem.js
import { Fyr } from '@aldane-dev-create/fyr';

/**
 * File System Data
 * Simulates a Linux-like file system
 */
export const fileSystem = {
  root: {
    type: 'folder',
    name: '/',
    children: {
      home: {
        type: 'folder',
        name: 'home',
        children: {
          user: {
            type: 'folder',
            name: 'user',
            children: {
              Documents: {
                type: 'folder',
                name: 'Documents',
                children: {
                  'notes.txt': {
                    type: 'file',
                    name: 'notes.txt',
                    content: 'Welcome to Fyr OS!\n\nThis is a sample text file.',
                    size: 45
                  },
                  'project.md': {
                    type: 'file',
                    name: 'project.md',
                    content: '# Fyr OS Project\n\nBuilding a desktop in the browser.',
                    size: 56
                  }
                }
              },
              Downloads: {
                type: 'folder',
                name: 'Downloads',
                children: {
                  'image.png': {
                    type: 'file',
                    name: 'image.png',
                    content: '[Image data]',
                    size: 1024
                  }
                }
              },
              Pictures: {
                type: 'folder',
                name: 'Pictures',
                children: {
                  'wallpaper.jpg': {
                    type: 'file',
                    name: 'wallpaper.jpg',
                    content: '[Image data]',
                    size: 2048
                  }
                }
              },
              Desktop: {
                type: 'folder',
                name: 'Desktop',
                children: {}
              }
            }
          }
        }
      },
      bin: {
        type: 'folder',
        name: 'bin',
        children: {
          'ls': { type: 'file', name: 'ls', content: '#!/bin/bash\nls -la', size: 12 },
          'pwd': { type: 'file', name: 'pwd', content: '#!/bin/bash\npwd', size: 6 },
          'echo': { type: 'file', name: 'echo', content: '#!/bin/bash\necho $1', size: 18 }
        }
      },
      etc: {
        type: 'folder',
        name: 'etc',
        children: {
          'config.json': {
            type: 'file',
            name: 'config.json',
            content: JSON.stringify({ theme: 'dark', wallpaper: 'default' }, null, 2),
            size: 42
          }
        }
      }
    }
  },

  /**
   * Get a file or folder by path
   */
  getFile(path) {
    if (path === '/' || path === '') {
      return this.root;
    }

    const parts = path.split('/').filter(p => p);
    let current = this.root;

    for (const part of parts) {
      if (current.children && current.children[part]) {
        current = current.children[part];
      } else {
        return null;
      }
    }

    return current;
  },

  /**
   * Get children of a folder
   */
  getChildren(path) {
    const node = this.getFile(path);
    if (!node || node.type !== 'folder') {
      return [];
    }

    return Object.keys(node.children || {}).map(name => ({
      name,
      ...node.children[name]
    }));
  },

  /**
   * Create a new folder
   */
  createFolder(path, name) {
    const parentPath = path.split('/').slice(0, -1).join('/') || '/';
    const parent = this.getFile(parentPath);

    if (!parent || parent.type !== 'folder') {
      return { success: false, error: 'Parent folder not found' };
    }

    if (parent.children && parent.children[name]) {
      return { success: false, error: 'Folder already exists' };
    }

    parent.children = parent.children || {};
    parent.children[name] = {
      type: 'folder',
      name: name,
      children: {}
    };

    return { success: true };
  },

  /**
   * Create a new file
   */
  createFile(path, name, content = '') {
    const parentPath = path.split('/').slice(0, -1).join('/') || '/';
    const parent = this.getFile(parentPath);

    if (!parent || parent.type !== 'folder') {
      return { success: false, error: 'Parent folder not found' };
    }

    if (parent.children && parent.children[name]) {
      return { success: false, error: 'File already exists' };
    }

    parent.children = parent.children || {};
    parent.children[name] = {
      type: 'file',
      name: name,
      content: content,
      size: content.length
    };

    return { success: true };
  },

  /**
   * Update file content
   */
  updateFile(path, content) {
    const file = this.getFile(path);
    if (!file || file.type !== 'file') {
      return { success: false, error: 'File not found' };
    }

    file.content = content;
    file.size = content.length;
    return { success: true };
  },

  /**
   * Delete a file or folder
   */
  delete(path) {
    if (path === '/' || path === '') {
      return { success: false, error: 'Cannot delete root' };
    }

    const parts = path.split('/').filter(p => p);
    const name = parts.pop();
    const parentPath = parts.join('/') || '/';
    const parent = this.getFile(parentPath);

    if (!parent || parent.type !== 'folder') {
      return { success: false, error: 'Parent folder not found' };
    }

    if (parent.children && parent.children[name]) {
      delete parent.children[name];
      return { success: true };
    }

    return { success: false, error: 'File not found' };
  },

  /**
   * Get file system tree as string (for terminal)
   */
  getTree(path = '/', indent = '') {
    const node = this.getFile(path);
    if (!node) return '';

    let result = '';
    if (node.type === 'folder') {
      result += `${indent}📁 ${node.name}/\n`;
      const children = this.getChildren(path);
      for (const child of children) {
        const childPath = path === '/' ? `/${child.name}` : `${path}/${child.name}`;
        result += this.getTree(childPath, indent + '  ');
      }
    } else {
      result += `${indent}📄 ${node.name} (${node.size || 0} bytes)\n`;
    }
    return result;
  }
};

export default fileSystem;