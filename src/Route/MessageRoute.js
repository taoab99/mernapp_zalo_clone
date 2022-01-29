const express = require('express');
const router = express.Router();
const MessageControler = require('../Controler/MessageControler');
const veryfiToken = require('../middleware/auth');

router.post('/', veryfiToken, MessageControler.postMessages);
router.get('/', veryfiToken, MessageControler.getMessage);

module.exports = router;