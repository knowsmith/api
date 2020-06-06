const { Router } = require('express');
const message = require('./message');

const router = Router();

router.use('/messages', message);

module.exports = router;
