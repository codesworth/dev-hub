const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const users = require('./Routes/api/users');
const passport = require('passport');
const profile = require('./Routes/api/profile');
const posts = require('./Routes/api/posts');

const app = express();

//Body Parser MiddleWare

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//DB CONFIG
 const db = require('./config/keys').mongoURI;

 //CONNECT TO MONGODB USING MONGOOSE

 mongoose.connect(db).then(() => {
    console.log("Connection Succesfulll");
 }).catch(err => {
    console.log("Error ocurred with sig: ",err);
    
 });


//PASSPORT MIDDLEWARE
app.use(passport.initialize());

//Passport Config
require('./config/passport.js')(passport)

//USES ROUTES

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts',posts);

const port = process.env.PORT || 5000


app.listen(port, () => console.log(`Server running on port: ${port}, How ya feel me now`));
 

 
