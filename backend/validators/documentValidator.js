const { body } = require('express-validator');

const uploadDocumentValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Tiêu đề là bắt buộc')
    .isLength({ min: 3, max: 200 })
    .withMessage('Tiêu đề phải có từ 3-200 ký tự'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Mô tả không được quá 1000 ký tự'),
  
  body('subject')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Chủ đề không được quá 100 ký tự'),
  
  body('ispublic')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('Trạng thái công khai phải là true hoặc false'),
  
  body('keywords')
    .optional()
    .isString()
    .withMessage('Keywords phải là chuỗi'),
  
  body('tags')
    .optional()
    .isString()
    .withMessage('Tags phải là chuỗi')
];

const updateDocumentValidator = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Tiêu đề phải có từ 3-200 ký tự'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Mô tả không được quá 1000 ký tự'),
  
  body('subject')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Chủ đề không được quá 100 ký tự'),
  
  body('ispublic')
    .optional()
    .isBoolean()
    .withMessage('Trạng thái công khai phải là boolean'),
  
  body('keywords')
    .optional()
    .isString()
    .withMessage('Keywords phải là chuỗi'),
  
  body('tags')
    .optional()
    .isString()
    .withMessage('Tags phải là chuỗi')
];

module.exports = {
  uploadDocumentValidator,
  updateDocumentValidator
};
