require("dotenv").config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

// Importing Routers
const User = require("./routes/user/user.routes");
const Posts = require("./routes/posts/posts.routes");

// Importing Method
const Login = require("./controllers/Users/user.controller")

// Importing basic files
const connectDB = require('./config/dbConnect');

// Initialising the express server
var app = express();

// Connecting the to the MongoDb database
connectDB();

// CORS library
app.use(cors())


 



// CORS Middleware
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
  });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static("client/build"));




//   app.get("*",(req,res)=>{
//     res.sendFile(path.resolve(__dirname,'client','build','index.html'));
//   })


// app.use(express.static(path.join(__dirname, 'public')));

app.post('/login',Login.login);

app.use('/user',User);
// app.use('/jobseeker',Jobseeker);
app.use('/post',Posts);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


if(process.env.NODE_ENV === 'production'){    
    app.use(express.static('client/build'))  // set static folder 
    //returning frontend for any route other than api 
    app.get('*',(req,res)=>{     
        res.sendFile (path.resolve(__dirname,'client','build',         
                      'index.html' ));    
    });
}




// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
