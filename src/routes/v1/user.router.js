const express = require('express');
const router = express.Router();

const authRoute = require('./user/auth.router');
const profileRoute = require('./user/profile.router');

router.use('/auth', authRoute);
router.use('/profile', profileRoute);

module.exports = router;
