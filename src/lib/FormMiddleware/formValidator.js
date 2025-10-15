// middleware/validators/formValidator.js
import { body, validationResult } from 'express-validator';

// Hàm xử lý lỗi validation
const handleValidationErrors = (req, res, next) => {
    console.log('req trong validator', req)
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Dữ liệu không hợp lệ',
            errors: errors.array()
        });
    }
    next();
};

// Validator tái sử dụng
const createValidator = (validationRules) => {
    return [...validationRules, handleValidationErrors];
};

// Các rule validation cụ thể cho từng trường
const ValidatorRules = {
    email: body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Email không hợp lệ'),

    password: body('password')
        .trim()
        .isLength({ min: 8 })
        .withMessage('Mật khẩu phải có ít nhất 8 ký tự')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường và một số'),

    username: body('username')
        .trim()
        .isLength({ min: 8, max: 20 })
        .withMessage('Tài khoản người dùng phải ít nhất 8 ký tự')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Tài khoản người dùng chỉ được chứa chữ cái, số và dấu gạch dưới'),

    name: body('name')
        .trim()
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('Tên phải từ 2 đến 50 ký tự'),

    phone: body('phone')
        .trim()
        .optional()
        .isMobilePhone()
        .withMessage('Số điện thoại không hợp lệ')
};

// Các bộ validator cho từng trường hợp cụ thể
export const AuthValidators = {
    login: createValidator([
        ValidatorRules.username,
        ValidatorRules.password
    ]),

    register: createValidator([
        ValidatorRules.email,
        ValidatorRules.password,
        ValidatorRules.username,
        body('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Mật khẩu xác nhận không khớp');
            }
            return true;
        })
    ])
};

export const UserValidators = {
    updateProfile: createValidator([
        ValidatorRules.name,
        ValidatorRules.email.optional(),
        ValidatorRules.phone
    ]),

    changePassword: createValidator([
        ValidatorRules.password,
        body('newPassword')
            .isLength({ min: 6 })
            .withMessage('Mật khẩu mới phải có ít nhất 6 ký tự'),
        body('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Mật khẩu xác nhận không khớp');
            }
            return true;
        })
    ])
};

// Validator tùy chỉnh - có thể tạo validator mới với các rule riêng
export const createCustomValidator = (rules) => {
    return createValidator(rules);
};

export default createValidator;