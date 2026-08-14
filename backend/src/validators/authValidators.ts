import { body } from 'express-validator';

const passwordRule = (field: string) =>
  body(field)
    .isString()
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Za-z]/)
    .withMessage('Password must contain a letter')
    .matches(/\d/)
    .withMessage('Password must contain a number');

const emailRule = body('email').isEmail().withMessage('Enter a valid email address').trim().toLowerCase();

export const registerValidator = [
  body('firstName').trim().isLength({ min: 2, max: 80 }).withMessage('First name is too short'),
  body('lastName').trim().isLength({ min: 2, max: 80 }).withMessage('Last name is too short'),
  emailRule,
  body('phone').trim().isLength({ min: 7, max: 20 }).withMessage('Enter a valid phone number'),
  passwordRule('password')
];

export const loginValidator = [emailRule, body('password').isString().notEmpty()];

export const verifyOtpValidator = [
  emailRule,
  body('otp').isString().isLength({ min: 6, max: 6 }).withMessage('Enter the 6-digit verification code')
];

export const resetPasswordValidator = [
  body().custom((value) => {
    if (!value.token && !value.otp) {
      throw new Error('Verification code or reset token is required');
    }
    return true;
  }),
  passwordRule('password')
];

export const changePasswordValidator = [
  body('currentPassword').isString().notEmpty().withMessage('Enter your current password'),
  passwordRule('newPassword')
];
