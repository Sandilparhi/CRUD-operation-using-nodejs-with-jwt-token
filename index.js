const user = require("./routes/user")
const express  = require('express');
const app      = express();
const http     = require('http');
const server   = http.createServer(app);
var bodyParser = require('body-parser');



require("dotenv").config();
// [path: path/filename]
//process.env.PORT
let port = process.env.PORT;
let host = process.env.HOST;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



// database connection
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mobilefirst', {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(() => {
    console.log('Connected to the Database successfully');
  }).catch((err)=>{
    console.log(err);
  })


app.use('/', user);
app.use('/images', express.static('images'));





//server connection
server.listen(port, host, () => {
  console.log(`server is listning  ${host}:${port}`);
});

 