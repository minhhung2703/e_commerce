const express = require('express');
const app = express();
const morgan = require('morgan');
const dbConnect = require('./config/dbConnect');
const authRouter = require('./routes/addRoute');
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;

dbConnect();

app.use(morgan('combined'));

app.use('/', (req, res) => {
    res.send('Hello')
});

app.use('api/v1/products', authRouter);

app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`)
})