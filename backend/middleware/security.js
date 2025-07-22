const rateLimit = require('express-rate-limit');

// Advanced security middleware
const securityHeaders = (req, res, next) => {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Remove server information
  res.removeHeader('X-Powered-By');
  
  next();
};

// IP whitelist middleware (for admin routes)
const ipWhitelist = (allowedIPs = []) => {
  return (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    
    if (allowedIPs.length > 0 && !allowedIPs.includes(clientIP)) {
      return res.status(403).json({
        success: false,
        error: 'IP không được phép truy cập'
      });
    }
    
    next();
  };
};

// Request size limiter
const requestSizeLimiter = (maxSize = '10mb') => {
  return (req, res, next) => {
    const contentLength = parseInt(req.get('Content-Length') || '0');
    const maxBytes = parseSize(maxSize);
    
    if (contentLength > maxBytes) {
      return res.status(413).json({
        success: false,
        error: 'Request quá lớn'
      });
    }
    
    next();
  };
};

// Parse size string to bytes
const parseSize = (size) => {
  const units = {
    'b': 1,
    'kb': 1024,
    'mb': 1024 * 1024,
    'gb': 1024 * 1024 * 1024
  };
  
  const match = size.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)?$/);
  if (!match) return 0;
  
  const value = parseFloat(match[1]);
  const unit = match[2] || 'b';
  
  return Math.floor(value * units[unit]);
};

// Suspicious activity detector
const suspiciousActivityDetector = (req, res, next) => {
  const suspiciousPatterns = [
    /(\<|\%3C)script(\>|\%3E)/i,
    /(\<|\%3C)iframe(\>|\%3E)/i,
    /javascript:/i,
    /vbscript:/i,
    /onload\s*=/i,
    /onerror\s*=/i,
    /eval\s*\(/i,
    /expression\s*\(/i,
    /union\s+select/i,
    /drop\s+table/i,
    /insert\s+into/i,
    /delete\s+from/i
  ];
  
  const checkString = (str) => {
    return suspiciousPatterns.some(pattern => pattern.test(str));
  };
  
  const checkObject = (obj) => {
    if (typeof obj === 'string') {
      return checkString(obj);
    }
    
    if (Array.isArray(obj)) {
      return obj.some(checkObject);
    }
    
    if (obj && typeof obj === 'object') {
      return Object.values(obj).some(checkObject);
    }
    
    return false;
  };
  
  // Check URL, query params, and body
  const url = req.originalUrl || req.url;
  if (checkString(url) || checkObject(req.query) || checkObject(req.body)) {
    console.warn(`Suspicious activity detected from IP: ${req.ip}, URL: ${url}`);
    
    return res.status(400).json({
      success: false,
      error: 'Request không hợp lệ'
    });
  }
  
  next();
};

// File upload security
const fileUploadSecurity = (req, res, next) => {
  if (req.file) {
    const file = req.file;
    
    // Check file size
    const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return res.status(400).json({
        success: false,
        error: 'File quá lớn'
      });
    }
    
    // Check file extension
    const allowedExtensions = (process.env.ALLOWED_FILE_TYPES || 'pdf,doc,docx,txt,ppt,pptx,xls,xlsx').split(',');
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      return res.status(400).json({
        success: false,
        error: 'Loại file không được hỗ trợ'
      });
    }
    
    // Check for suspicious file names
    const suspiciousNames = [
      /\.php$/i,
      /\.jsp$/i,
      /\.asp$/i,
      /\.exe$/i,
      /\.bat$/i,
      /\.cmd$/i,
      /\.scr$/i,
      /\.vbs$/i,
      /\.js$/i
    ];
    
    if (suspiciousNames.some(pattern => pattern.test(file.originalname))) {
      return res.status(400).json({
        success: false,
        error: 'Tên file không hợp lệ'
      });
    }
  }
  
  next();
};

// API key validation (for future use)
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API key bị thiếu'
    });
  }
  
  // In production, validate against database
  const validApiKeys = process.env.VALID_API_KEYS?.split(',') || [];
  
  if (validApiKeys.length > 0 && !validApiKeys.includes(apiKey)) {
    return res.status(401).json({
      success: false,
      error: 'API key không hợp lệ'
    });
  }
  
  next();
};

module.exports = {
  securityHeaders,
  ipWhitelist,
  requestSizeLimiter,
  suspiciousActivityDetector,
  fileUploadSecurity,
  validateApiKey
};
