const express = require('express');
const router = express.Router();
const validate = require('../../../middlewares/validate');
const authValidation = require('../../../validations/auth.validation');
const authController = require('../../../controllers/user/auth.controller');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 *  /auth/get-otp:
 *    post:
 *      summary: Get OTP
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - phone
 *              properties:
 *                phone:
 *                  type: string
 *                  format: phone
 *                  description: must be unique
 *              example:
 *                phone: "1234567890"
 *      responses:
 *        "200":
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *        "400":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 */
router.post('/get-otp', validate(authValidation.getOtp), authController.getOtp);

/**
 * @swagger
 *  /auth/verify-otp:
 *    post:
 *      summary: Verify OTP
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - phone
 *                - otp
 *              properties:
 *                phone:
 *                  type: string
 *                otp:
 *                  type: string
 *              example:
 *                phone: 8798756765
 *                otp: 8123
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *        "400":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 */
router.post('/verify-otp', validate(authValidation.verifyOtp), authController.verifyOtp);


module.exports = router;
