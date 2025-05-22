const express = require('express');
const router = express.Router();

const authRoute = require('./user/auth.router');

router.use('/auth', authRoute);

module.exports = router;
