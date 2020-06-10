const express = require('express');
const morgan = require('morgan');

const apiRouter = require('./routes');

const app = express();

app.use(express.json());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.get('/', (req, res) => {
    res.json({
        message: 'Hello WORLD!'
    });
});

app.use('/api/v1', apiRouter);

app.use((err, req, res, next) => {
    console.log(err);
    return res.status(500).json({
        error: err
    });
});

module.exports = app;
