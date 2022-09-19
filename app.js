const express = require('express');
const app = express();
require('./config/db');

const port = process.env.PORT || 3000;
const userRouter = require('./api/User');

//middleware
// app.use(require('body-parser').json());
// express.urlencoded([options])
app.use(express.urlencoded({ extended: true }));
app.use("/", userRouter);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});