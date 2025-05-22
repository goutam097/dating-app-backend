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
 *  /auth/register:
 *    post:
 *      summary: Register
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - first_name
 *                - email
 *                - phone
 *                - password
 *              properties:
 *                first_name:
 *                  type: string
 *                last_name:
 *                  type: string
 *                email:
 *                  type: string
 *                  format: email
 *                  description: must be unique
 *                phone:
 *                  type: string
 *                  format: phone
 *                  description: must be unique
 *                dob:
 *                  type: string
 *                gender:
 *                  type: string
 *                password:
 *                  type: string
 *                  format: password
 *                  minLength: 8
 *                  description: At least one number and one letter
 *              example:
 *                first_name: John
 *                last_name: Doe
 *                email: johndoe@gmail.com
 *                phone: "1234567890"
 *                dob: "16/12/1995"
 *                gender: male/female
 *                password: Password@123
 *      responses:
 *        "201":
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
router.post('/register', validate(authValidation.register), authController.register);
/**
 * @swagger
 *  /auth/login:
 *    post:
 *      summary: Login
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - email
 *                - password
 *              properties:
 *                email:
 *                  type: string
 *                  format: email
 *                password:
 *                  type: string
 *                  format: password
 *              example:
 *                email: johndoe@gmail.com
 *                password: Password@123
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *        "401":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 */
router.post('/login', validate(authValidation.login), authController.login);


module.exports = router;
