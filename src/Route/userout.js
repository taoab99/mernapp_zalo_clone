const express = require('express');
const router = express.Router();
const UserController = require('../Controler/UserController');
const verifyToken = require('../middleware/auth');

router.get('/getuser', verifyToken, UserController.getuser);
router.post('/refeshToken', UserController.refeshToken);
router.post('/checkmail', UserController.checkmail);
router.post('/signup', UserController.signup);
router.post('/signin', UserController.signin);

module.exports = router;