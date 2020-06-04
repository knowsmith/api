const express = require('express');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Hello WORLD!'
    });
});

module.exports = app;
