const express = require('express');
const mongoose = require('mongoose');

const users = require('./Routes/api/users');
const profile = require('./Routes/api/profile');
const posts = require('./Routes/api/posts');

const app = express();

//DB CONFIG
 const db = require('./config/keys').mongoURI;

 //CONNECT TO MONGODB USING MONGOOSE

 mongoose.connect(db).then(() => {
    console.log("Connection Succesffull");
 }).catch(err => {
    console.log("Error ocurred with sig: ",err);
    
 });


app.get('/', (request, response) => {
    response.send("Hello Servwr Computing World: How you loke me now haha");
   
});

//USES ROUTES

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts',posts);

const port = process.env.PORT || 5000


app.listen(port, () => console.log(`Server running on port: ${port}, How ya feel me now`));
 

 
