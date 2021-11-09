const mongoose = require('mongoose');
// const Joi = require('joi');



var ObjectId = mongoose.Schema.ObjectId;
// Mongoose Schema

const TokenSchema = mongoose.Schema({
  token:{
    type:String,
    default:''
  }

});



const user =  mongoose.model('token', TokenSchema,'Tokens');
module.exports = user;
