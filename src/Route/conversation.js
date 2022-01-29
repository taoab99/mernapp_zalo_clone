const express = require('express');
const router = express.Router();
const veryfiToken = require('../middleware/auth');
const ConverstationControler = require('../Controler/ConversationControler');


router.post('/', veryfiToken, ConverstationControler.create);

module.exports = router;