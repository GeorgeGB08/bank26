const express = require('express');
const userMiddleware = require('../middlewares/user.middleware');

const userController = require('../controllers/user.controller');

module.exports = require('./../middlewares/user.middleware');

const router = express.Router();

router.post('/signup', userController.signup);
router.post('/login', userMiddleware.validUser, userController.login);

module.exports = router;
