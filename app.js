const express = require('express');
const router = require('./routes');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Hello WORLD!'
    });
});

app.use('/messages', router.message);

module.exports = app;
