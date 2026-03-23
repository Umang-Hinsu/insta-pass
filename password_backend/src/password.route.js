const express = require('express');
const router = express.Router();
const passwordController = require('./password.controller');

router.post('/change', passwordController.changePassword);

module.exports = router;
