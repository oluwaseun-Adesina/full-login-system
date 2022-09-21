const express = require('express');
const morgan = require('morgan');
const app = express();
require('./config/db');

const port = process.env.PORT || 3000;
const userRouter = require('./api/User');

//middleware
//app.use(require('body-parser').json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/user", userRouter);
app.use(morgan('dev'));

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});