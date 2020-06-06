const mongoose = require('mongoose');
const app = require('./app');

mongoose
    .connect(process.env.MONGO_DB_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Database connected successfully...');
    })
    .catch((err) => {
        console.log(err.message);
    });

app.listen(process.env.PORT, () => {
    console.log(`Server listening on PORT ${process.env.PORT}...`);
});
