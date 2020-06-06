const { Router } = require('express');
const { message } = require('../controllers');

const router = Router();

// GET /messages
router.get('/', message.index);

// GET /messages/:id
router.get('/:id', message.show);

// POST /messages
router.post('/', message.create);

// POST /messages/:id/reply
router.post('/:id/reply', message.reply);

// PATCH /messades/:id
router.patch('/:id', message.update);

// DELETE /messades/:id
router.delete('/:id', message.remove);

module.exports = router;
