const { body } = require("express-validator");

class AuthValidator {
    registerValidator = [
        body("name")
            .notEmpty().withMessage("Tên người dùng là bắt buộc")
            .bail()
            .trim()
            .isLength({ min: 2, max: 100 }).withMessage("Tên người dùng phải từ 2 đến 100 ký tự"),
        body("email")
            .notEmpty().withMessage("Email là bắt buộc")
            .bail()
            .trim()
            .isEmail().withMessage("Email không đúng định dạng")
            .normalizeEmail(),
        body("password")
            .notEmpty().withMessage("Mật khẩu là bắt buộc")
            .bail()
            .isLength({ min: 6, max: 50 }).withMessage("Mật khẩu phải từ 6 đến 50 ký tự"),
        body("role")
            .optional()
            .isIn(["user", "admin", "shop"]).withMessage("Vai trò không hợp lệ"),
        body("age")
            .optional()
            .isInt({ min: 1, max: 120 }).withMessage("Tuổi phải là số nguyên từ 1 đến 120"),
        body("phoneNumber")
            .optional()
            .trim()
            .isMobilePhone("vi-VN").withMessage("Số điện thoại không hợp lệ"),
        body("avatar")
            .optional()
            .trim()
            .isURL().withMessage("Avatar phải là một đường dẫn URL hợp lệ"),
    ];

    loginValidator = [
        body("email")
            .notEmpty().withMessage("Email là bắt buộc")
            .bail()
            .trim()
            .isEmail().withMessage("Email không đúng định dạng")
            .normalizeEmail(),
        body("password")
            .notEmpty().withMessage("Mật khẩu là bắt buộc")
            .bail()
            .isLength({ min: 6, max: 50 }).withMessage("Mật khẩu phải từ 6 đến 50 ký tự"),
    ];
}

module.exports = new AuthValidator();
