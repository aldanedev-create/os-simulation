// src/apps/TextEditor.js
import { Fyr } from '@aldane-dev-create/fyr';
import { fileSystem } from '../filesystem.js';
import { toast } from '@aldane-dev-create/fyr/ui';

/**
 * Text Editor App
 * Create and edit text files
 */
Fyr.controller('editor', {
  state: {
    currentFile: null,
    currentPath: null,
    content: '',
    isDirty: false,
    wordCount: 0,
    lineCount: 0,
    fontSize: 14,
    wrapText: true
  },

  computed: {
    statusText() {
      const dirty = this.state.isDirty ? '●' : '○';
      const file = this.state.currentFile || 'Untitled';
      return `${dirty} ${file}  |  ${this.state.wordCount} words  |  ${this.state.lineCount} lines`;
    }
  },

  methods: {
    openFile(path) {
      const file = fileSystem.getFile(path);
      if (!file || file.type !== 'file') {
        toast.error('File not found');
        return;
      }

      this.state.currentFile = file.name;
      this.state.currentPath = path;
      this.state.content = file.content || '';
      this.state.isDirty = false;
      this.updateStats();

      // Update editor content
      const editor = this.$refs.editorContent;
      if (editor) {
        editor.value = this.state.content;
      }

      toast.info(`Opened ${file.name}`);
    },

    newFile() {
      const name = prompt('File name:');
      if (!name) return;

      this.state.currentFile = name;
      this.state.currentPath = null;
      this.state.content = '';
      this.state.isDirty = false;
      this.updateStats();

      const editor = this.$refs.editorContent;
      if (editor) {
        editor.value = '';
      }
    },

    saveFile() {
      if (!this.state.currentFile) {
        this.saveAs();
        return;
      }

      const content = this.$refs.editorContent?.value || '';

      if (this.state.currentPath) {
        // Update existing file
        const result = fileSystem.updateFile(this.state.currentPath, content);
        if (result.success) {
          this.state.content = content;
          this.state.isDirty = false;
          this.updateStats();
          toast.success('File saved');
        } else {
          toast.error('Failed to save');
        }
      } else {
        // Save as new file
        const result = fileSystem.createFile('/home/user/Documents', this.state.currentFile, content);
        if (result.success) {
          this.state.currentPath = `/home/user/Documents/${this.state.currentFile}`;
          this.state.content = content;
          this.state.isDirty = false;
          this.updateStats();
          toast.success('File saved');
        } else {
          toast.error('Failed to save');
        }
      }
    },

    saveAs() {
      const name = prompt('Save as:', this.state.currentFile || 'untitled.txt');
      if (!name) return;

      const content = this.$refs.editorContent?.value || '';
      const result = fileSystem.createFile('/home/user/Documents', name, content);
      if (result.success) {
        this.state.currentFile = name;
        this.state.currentPath = `/home/user/Documents/${name}`;
        this.state.content = content;
        this.state.isDirty = false;
        this.updateStats();
        toast.success(`Saved as ${name}`);
      } else {
        toast.error(result.error || 'Failed to save');
      }
    },

    onEdit() {
      const content = this.$refs.editorContent?.value || '';
      this.state.content = content;
      this.state.isDirty = true;
      this.updateStats();
    },

    updateStats() {
      const content = this.$refs.editorContent?.value || this.state.content || '';
      const words = content.trim().split(/\s+/).filter(w => w.length > 0);
      this.state.wordCount = words.length;
      this.state.lineCount = content.split('\n').length;
    },

    increaseFont() {
      this.state.fontSize = Math.min(this.state.fontSize + 2, 28);
    },

    decreaseFont() {
      this.state.fontSize = Math.max(this.state.fontSize - 2, 8);
    },

    toggleWrap() {
      this.state.wrapText = !this.state.wrapText;
    },

    formatDate(dateStr) {
      if (!dateStr) return '';
      return new Date(dateStr).toLocaleString();
    }
  },

  mounted() {
    // Check if file was passed from desktop
    const urlParams = new URLSearchParams(window.location.search);
    const filePath = urlParams.get('file');
    if (filePath) {
      this.openFile(filePath);
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        this.saveFile();
      }
    });

    console.log('📝 Text Editor mounted!');
  },


});