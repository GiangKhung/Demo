const { body } = require("express-validator");

const registerValidator = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Tên phải từ 2-50 ký tự"),
  body("email").isEmail().normalizeEmail().withMessage("Email không hợp lệ"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải ít nhất 6 ký tự"),
];

const loginValidator = [
  body("email").isEmail().normalizeEmail().withMessage("Email không hợp lệ"),
  body("password").notEmpty().withMessage("Mật khẩu không được để trống"),
];

const updateDetailsValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Tên phải từ 2-50 ký tự"),
  body("email")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Email không hợp lệ"),
];

const updatePasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Mật khẩu hiện tại không được để trống"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu mới phải ít nhất 6 ký tự"),
];

module.exports = {
  registerValidator,
  loginValidator,
  updateDetailsValidator,
  updatePasswordValidator,
};
