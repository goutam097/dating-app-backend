const express = require('express');
const router = express.Router();
const validate = require('../../../middlewares/validate');
const authController = require('../../../controllers/user/auth.controller');

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User Profile
 */

router.post('/update-profile', authController.updateProfile);

module.exports = router;
