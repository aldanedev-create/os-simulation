// src/apps/Calculator.js
import { Fyr } from '@aldane-dev-create/fyr';

/**
 * Calculator App
 * Basic arithmetic operations
 */
Fyr.controller('calculator', {
  state: {
    display: '0',
    previousValue: null,
    operation: null,
    shouldResetDisplay: false,
    memory: 0,
    history: []
  },

  methods: {
    inputDigit(digit) {
      if (this.state.shouldResetDisplay) {
        this.state.display = digit;
        this.state.shouldResetDisplay = false;
      } else {
        this.state.display = this.state.display === '0' ? digit : this.state.display + digit;
      }
    },

    inputDecimal() {
      if (this.state.shouldResetDisplay) {
        this.state.display = '0.';
        this.state.shouldResetDisplay = false;
        return;
      }
      if (!this.state.display.includes('.')) {
        this.state.display += '.';
      }
    },

    clear() {
      this.state.display = '0';
      this.state.previousValue = null;
      this.state.operation = null;
      this.state.shouldResetDisplay = false;
    },

    clearEntry() {
      this.state.display = '0';
    },

    toggleSign() {
      if (this.state.display.startsWith('-')) {
        this.state.display = this.state.display.slice(1);
      } else if (this.state.display !== '0') {
        this.state.display = '-' + this.state.display;
      }
    },

    percent() {
      const value = parseFloat(this.state.display);
      if (!isNaN(value)) {
        this.state.display = String(value / 100);
      }
    },

    setOperation(op) {
      const current = parseFloat(this.state.display);
      if (!isNaN(current)) {
        if (this.state.previousValue !== null) {
          const result = this.calculate(this.state.previousValue, current, this.state.operation);
          this.state.display = String(result);
          this.state.previousValue = result;
        } else {
          this.state.previousValue = current;
        }
        this.state.operation = op;
        this.state.shouldResetDisplay = true;
      }
    },

    calculate(a, b, op) {
      switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return b !== 0 ? a / b : 'Error';
        default: return b;
      }
    },

    equals() {
      const current = parseFloat(this.state.display);
      if (!isNaN(current) && this.state.previousValue !== null && this.state.operation) {
        const result = this.calculate(this.state.previousValue, current, this.state.operation);
        this.state.display = String(result);
        this.state.previousValue = null;
        this.state.operation = null;
        this.state.shouldResetDisplay = true;

        // Add to history
        if (this.state.history.length > 10) {
          this.state.history.shift();
        }
      }
    },

    memoryStore() {
      this.state.memory = parseFloat(this.state.display) || 0;
    },

    memoryRecall() {
      this.state.display = String(this.state.memory);
    },

    memoryClear() {
      this.state.memory = 0;
    },

    memoryAdd() {
      this.state.memory += parseFloat(this.state.display) || 0;
    },

    handleKeydown(event) {
      const key = event.key;
      if (key >= '0' && key <= '9') {
        this.inputDigit(key);
      } else if (key === '.') {
        this.inputDecimal();
      } else if (key === 'Enter' || key === '=') {
        this.equals();
      } else if (key === 'Escape') {
        this.clear();
      } else if (key === 'Backspace') {
        this.state.display = this.state.display.slice(0, -1) || '0';
      } else if (key === '+') {
        this.setOperation('+');
      } else if (key === '-') {
        this.setOperation('-');
      } else if (key === '*') {
        this.setOperation('*');
      } else if (key === '/') {
        this.setOperation('/');
      } else if (key === '%') {
        this.percent();
      }
    }
  },

  mounted() {
    document.addEventListener('keydown', this.handleKeydown.bind(this));
    console.log('🧮 Calculator mounted!');
  },

});