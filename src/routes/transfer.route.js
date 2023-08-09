const transferController = require('../controllers/transfer.controller');
const express = require('express');

const authMiddleware = require("../middlewares/auth.middleware")

const router = express.Router();

router.use(authMiddleware.protect)

router.post('/', transferController.transfer)

module.exports = router