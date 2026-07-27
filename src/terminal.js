// src/terminal.js
import { Fyr } from '@aldane-dev-create/fyr';
import { fileSystem } from './filesystem.js';

/**
 * Terminal Controller
 * Handles: Terminal emulator, command execution
 */
Fyr.controller('terminal', {
  state: {
    history: [],
    currentCommand: '',
    currentDirectory: '/home/user',
    commandHistory: [],
    historyIndex: -1,
    isReady: false
  },

  methods: {
    /**
     * Initialize the terminal
     */
    initTerminal() {
      const container = this.$refs.terminalContainer;
      if (!container) return;

      // Create a simple terminal UI (without xterm.js for simplicity)
      // We'll use a custom terminal look
      this.state.isReady = true;
      this.printWelcome();

      // Focus on input
      setTimeout(() => {
        const input = this.$refs.terminalInput;
        if (input) input.focus();
      }, 100);
    },

    /**
     * Print welcome message
     */
    printWelcome() {
      this.appendOutput(`
╔══════════════════════════════════════════════════════════╗
║  Welcome to Fyr OS Terminal v1.0                        ║
║  Type 'help' for available commands                    ║
╚══════════════════════════════════════════════════════════╝
`);
      this.appendOutput('');
      this.printPrompt();
    },

    /**
     * Print the prompt
     */
    printPrompt() {
      const dir = this.state.currentDirectory.replace('/home/user', '~');
      this.appendOutput(`\x1b[32muser@fyr-os\x1b[0m:\x1b[34m${dir}\x1b[0m$ `, true);
    },

    /**
     * Append output to terminal
     */
    appendOutput(text, isPrompt = false) {
      const output = this.$refs.terminalOutput;
      if (!output) return;

      const line = document.createElement('div');
      line.className = isPrompt ? 'terminal-prompt' : 'terminal-output';
      line.innerHTML = text.replace(/\n/g, '<br>');
      output.appendChild(line);
      output.scrollTop = output.scrollHeight;
    },

    /**
     * Handle command execution
     */
    executeCommand(event) {
      if (event.key === 'Enter') {
        const command = this.state.currentCommand.trim();
        if (command) {
          this.state.commandHistory.push(command);
          this.state.historyIndex = this.state.commandHistory.length;
          this.runCommand(command);
        }
        this.state.currentCommand = '';
      }

      // Command history navigation
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (this.state.historyIndex > 0) {
          this.state.historyIndex--;
          this.state.currentCommand = this.state.commandHistory[this.state.historyIndex] || '';
        }
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (this.state.historyIndex < this.state.commandHistory.length - 1) {
          this.state.historyIndex++;
          this.state.currentCommand = this.state.commandHistory[this.state.historyIndex] || '';
        } else {
          this.state.historyIndex = this.state.commandHistory.length;
          this.state.currentCommand = '';
        }
      }

      // Auto-scroll to input
      setTimeout(() => {
        const input = this.$refs.terminalInput;
        if (input) input.focus();
      }, 0);
    },

    /**
     * Run a command
     */
    runCommand(command) {
      // Show the command
      const dir = this.state.currentDirectory.replace('/home/user', '~');
      this.appendOutput(`\x1b[32muser@fyr-os\x1b[0m:\x1b[34m${dir}\x1b[0m$ ${command}`);

      // Parse command
      const parts = command.split(' ');
      const cmd = parts[0];
      const args = parts.slice(1);

      // Execute built-in commands
      switch (cmd) {
        case 'help':
          this.showHelp();
          break;
        case 'ls':
          this.listDirectory(args);
          break;
        case 'cd':
          this.changeDirectory(args);
          break;
        case 'pwd':
          this.appendOutput(this.state.currentDirectory);
          break;
        case 'echo':
          this.appendOutput(args.join(' ') || '');
          break;
        case 'cat':
          this.catFile(args);
          break;
        case 'mkdir':
          this.makeDirectory(args);
          break;
        case 'touch':
          this.touchFile(args);
          break;
        case 'rm':
          this.removeFile(args);
          break;
        case 'clear':
        case 'cls':
          this.clearTerminal();
          break;
        case 'whoami':
          this.appendOutput('user');
          break;
        case 'hostname':
          this.appendOutput('fyr-os');
          break;
        case 'date':
          this.appendOutput(new Date().toString());
          break;
        case 'uptime':
          this.appendOutput('up 1h 23m (Fyr OS)');
          break;
        case 'tree':
          this.showTree();
          break;
        case 'open':
          this.openApp(args);
          break;
        case 'shutdown':
          this.shutdown();
          break;
        case '':
          break;
        default:
          this.appendOutput(`\x1b[31mCommand not found: ${cmd}\x1b[0m`);
          break;
      }

      this.printPrompt();
    },

    /**
     * Show help
     */
    showHelp() {
      this.appendOutput(`
Available commands:
  help              Show this help message
  ls [path]         List directory contents
  cd [path]         Change directory
  pwd               Print working directory
  echo [text]       Print text
  cat [file]        Display file contents
  mkdir [name]      Create a directory
  touch [file]      Create a file
  rm [path]         Delete a file or directory
  clear             Clear the terminal
  whoami            Display current user
  hostname          Display hostname
  date              Display current date
  uptime            Display system uptime
  tree              Display directory tree
  open [app]        Open an application (explorer, editor, calculator, settings)
  shutdown          Shutdown the system
`);
    },

    /**
     * List directory
     */
    listDirectory(args) {
      const path = args[0] || this.state.currentDirectory;
      const items = fileSystem.getChildren(path);
      if (items.length === 0) {
        this.appendOutput('(empty)');
        return;
      }

      const output = items.map(item => {
        const icon = item.type === 'folder' ? '📁' : '📄';
        const size = item.type === 'file' ? ` (${item.size || 0}B)` : '';
        return `${icon} ${item.name}${size}`;
      }).join('  ');
      this.appendOutput(output);
    },

    /**
     * Change directory
     */
    changeDirectory(args) {
      if (!args.length) {
        this.state.currentDirectory = '/home/user';
        return;
      }

      let path = args[0];
      if (path === '~') {
        path = '/home/user';
      } else if (path === '..') {
        const parts = this.state.currentDirectory.split('/');
        parts.pop();
        path = parts.join('/') || '/';
      } else if (!path.startsWith('/')) {
        path = `${this.state.currentDirectory}/${path}`;
      }

      const node = fileSystem.getFile(path);
      if (node && node.type === 'folder') {
        this.state.currentDirectory = path;
      } else {
        this.appendOutput(`\x1b[31mcd: ${args[0]}: No such directory\x1b[0m`);
      }
    },

    /**
     * Display file content
     */
    catFile(args) {
      if (!args.length) {
        this.appendOutput('cat: missing file operand');
        return;
      }

      let path = args[0];
      if (!path.startsWith('/')) {
        path = `${this.state.currentDirectory}/${path}`;
      }

      const file = fileSystem.getFile(path);
      if (file && file.type === 'file') {
        this.appendOutput(file.content || '(empty)');
      } else {
        this.appendOutput(`\x1b[31mcat: ${args[0]}: No such file\x1b[0m`);
      }
    },

    /**
     * Make directory
     */
    makeDirectory(args) {
      if (!args.length) {
        this.appendOutput('mkdir: missing operand');
        return;
      }

      const path = args[0];
      const parentPath = this.state.currentDirectory;
      const result = fileSystem.createFolder(parentPath, path);
      if (result.success) {
        this.appendOutput(`Directory created: ${path}`);
      } else {
        this.appendOutput(`\x1b[31m${result.error}\x1b[0m`);
      }
    },

    /**
     * Create file
     */
    touchFile(args) {
      if (!args.length) {
        this.appendOutput('touch: missing file operand');
        return;
      }

      const path = args[0];
      const parentPath = this.state.currentDirectory;
      const result = fileSystem.createFile(parentPath, path, '');
      if (result.success) {
        this.appendOutput(`File created: ${path}`);
      } else {
        this.appendOutput(`\x1b[31m${result.error}\x1b[0m`);
      }
    },

    /**
     * Remove file or directory
     */
    removeFile(args) {
      if (!args.length) {
        this.appendOutput('rm: missing operand');
        return;
      }

      let path = args[0];
      if (!path.startsWith('/')) {
        path = `${this.state.currentDirectory}/${path}`;
      }

      const result = fileSystem.delete(path);
      if (result.success) {
        this.appendOutput(`Removed: ${args[0]}`);
      } else {
        this.appendOutput(`\x1b[31m${result.error}\x1b[0m`);
      }
    },

    /**
     * Clear terminal
     */
    clearTerminal() {
      const output = this.$refs.terminalOutput;
      if (output) {
        output.innerHTML = '';
      }
    },

    /**
     * Show directory tree
     */
    showTree() {
      const tree = fileSystem.getTree(this.state.currentDirectory);
      this.appendOutput(tree);
    },

    /**
     * Open an app from terminal
     */
    openApp(args) {
      if (!args.length) {
        this.appendOutput('open: missing app name');
        this.appendOutput('Available: explorer, editor, calculator, settings');
        return;
      }

      const appId = args[0];
      const appMap = {
        'explorer': 'explorer',
        'files': 'explorer',
        'editor': 'editor',
        'calc': 'calculator',
        'calculator': 'calculator',
        'settings': 'settings',
        'terminal': 'terminal'
      };

      const mappedId = appMap[appId];
      if (mappedId) {
        const desktopEl = document.querySelector('[fyr-controller="desktop"]');
        if (desktopEl?.__fyrController) {
          desktopEl.__fyrController.openApp(mappedId);
          this.appendOutput(`Opening ${appId}...`);
        }
      } else {
        this.appendOutput(`\x1b[31mUnknown app: ${appId}\x1b[0m`);
      }
    },

    /**
     * Shutdown
     */
    shutdown() {
      this.appendOutput('Shutting down...');
      const taskbarEl = document.querySelector('[fyr-controller="taskbar"]');
      if (taskbarEl?.__fyrController) {
        setTimeout(() => {
          taskbarEl.__fyrController.shutdown();
        }, 500);
      }
    }
  },

  mounted() {
    // Initialize terminal after DOM render
    setTimeout(() => {
      this.initTerminal();
    }, 100);

    console.log('💻 Terminal controller mounted!');
  }
});