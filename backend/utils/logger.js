const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log levels
const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

// Logger class
class Logger {
  constructor() {
    this.logFile = path.join(logsDir, 'app.log');
    this.errorFile = path.join(logsDir, 'error.log');
  }

  // Format log message
  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaString = Object.keys(meta).length > 0 ? ` | ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level}: ${message}${metaString}\n`;
  }

  // Write to file
  writeToFile(filename, content) {
    try {
      fs.appendFileSync(filename, content);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  // Log error
  error(message, meta = {}) {
    const formattedMessage = this.formatMessage(LOG_LEVELS.ERROR, message, meta);
    
    // Write to both general log and error log
    this.writeToFile(this.logFile, formattedMessage);
    this.writeToFile(this.errorFile, formattedMessage);
    
    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(formattedMessage.trim());
    }
  }

  // Log warning
  warn(message, meta = {}) {
    const formattedMessage = this.formatMessage(LOG_LEVELS.WARN, message, meta);
    this.writeToFile(this.logFile, formattedMessage);
    
    if (process.env.NODE_ENV === 'development') {
      console.warn(formattedMessage.trim());
    }
  }

  // Log info
  info(message, meta = {}) {
    const formattedMessage = this.formatMessage(LOG_LEVELS.INFO, message, meta);
    this.writeToFile(this.logFile, formattedMessage);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(formattedMessage.trim());
    }
  }

  // Log debug
  debug(message, meta = {}) {
    if (process.env.NODE_ENV === 'development') {
      const formattedMessage = this.formatMessage(LOG_LEVELS.DEBUG, message, meta);
      this.writeToFile(this.logFile, formattedMessage);
      console.log(formattedMessage.trim());
    }
  }

  // Log HTTP requests
  logRequest(req, res, responseTime) {
    const logData = {
      method: req.method,
      url: req.originalUrl || req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userId: req.user?.id || 'anonymous'
    };

    const message = `${req.method} ${req.originalUrl || req.url} - ${res.statusCode} - ${responseTime}ms`;
    
    if (res.statusCode >= 400) {
      this.error(message, logData);
    } else {
      this.info(message, logData);
    }
  }

  // Log authentication events
  logAuth(event, userId, ip, success = true, details = {}) {
    const message = `Auth ${event}: ${success ? 'SUCCESS' : 'FAILED'}`;
    const meta = {
      userId,
      ip,
      event,
      success,
      ...details
    };

    if (success) {
      this.info(message, meta);
    } else {
      this.warn(message, meta);
    }
  }

  // Log file operations
  logFileOperation(operation, filename, userId, success = true, error = null) {
    const message = `File ${operation}: ${filename} - ${success ? 'SUCCESS' : 'FAILED'}`;
    const meta = {
      operation,
      filename,
      userId,
      success
    };

    if (error) {
      meta.error = error.message;
    }

    if (success) {
      this.info(message, meta);
    } else {
      this.error(message, meta);
    }
  }

  // Clean old logs
  cleanOldLogs(daysToKeep = 30) {
    try {
      const files = fs.readdirSync(logsDir);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      files.forEach(file => {
        const filePath = path.join(logsDir, file);
        const stats = fs.statSync(filePath);

        if (stats.isFile() && stats.mtime < cutoffDate) {
          fs.unlinkSync(filePath);
          this.info(`Deleted old log file: ${file}`);
        }
      });
    } catch (error) {
      this.error('Failed to clean old logs', { error: error.message });
    }
  }
}

// Create singleton instance
const logger = new Logger();

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Override res.end to capture response time
  const originalEnd = res.end;
  res.end = function(...args) {
    const responseTime = Date.now() - start;
    logger.logRequest(req, res, responseTime);
    originalEnd.apply(this, args);
  };

  next();
};

module.exports = {
  logger,
  requestLogger,
  LOG_LEVELS
};
