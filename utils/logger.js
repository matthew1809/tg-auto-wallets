// utils/logger.js
export class CustomLogger {
    static logs = [];
    static maxLogs = 50; // Keep last 50 logs
    static listeners = new Set();
  
    static createLogDisplay() {
      const logDiv = document.createElement('div');
      logDiv.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        max-height: 200px;
        overflow-y: auto;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        font-family: monospace;
        font-size: 12px;
        z-index: 9999;
        padding: 10px;
      `;
      document.body.appendChild(logDiv);
      return logDiv;
    }
  
    static log(...args) {
      const logEntry = {
        type: 'log',
        timestamp: new Date().toISOString(),
        message: args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ')
      };
      
      this.addLog(logEntry);
    }
  
    static error(...args) {
      const logEntry = {
        type: 'error',
        timestamp: new Date().toISOString(),
        message: args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ')
      };
      
      this.addLog(logEntry);
    }
  
    static addLog(logEntry) {
      this.logs.push(logEntry);
      if (this.logs.length > this.maxLogs) {
        this.logs.shift();
      }
      this.notifyListeners();
    }
  
    static subscribe(callback) {
      this.listeners.add(callback);
      return () => this.listeners.delete(callback);
    }
  
    static notifyListeners() {
      this.listeners.forEach(listener => listener(this.logs));
    }
  
    static init() {
      if (typeof window === 'undefined') return;
  
      // Override console methods
      const originalConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn,
        info: console.info
      };
  
      console.log = (...args) => {
        originalConsole.log.apply(console, args);
        this.log(...args);
      };
  
      console.error = (...args) => {
        originalConsole.error.apply(console, args);
        this.error(...args);
      };
  
      console.warn = (...args) => {
        originalConsole.warn.apply(console, args);
        this.log(...args);
      };
  
      console.info = (...args) => {
        originalConsole.info.apply(console, args);
        this.log(...args);
      };
    }
  }