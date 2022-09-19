require('dotenv').config();
const mongoose =  require('mongoose');

mongoose.connect(process.env.mongodb_uri, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to database');
}).catch(err => console.log(err));
