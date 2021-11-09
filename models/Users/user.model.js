const mongoose = require('mongoose');
// const Joi = require('joi');



var ObjectId = mongoose.Schema.ObjectId;
// Mongoose Schema


// User_id
// Profile Picture
// email_id
// password
// Display Name
// username
// followers(array[])
// following(array[])
// Posts(array[])
// SavedPosts(array[])
// // DateCreated
const RecruiterSchema = mongoose.Schema({
    
    profile_picture:{
        type:String,
        default:''
    },
    token:{
        type:String,
        default:''
    },
    display_name:{
        type:String,
        default:''
    },
    username:{
        type:String,
        default:''
    },
    email_id:{
        type:String,
        default:''
    },
    password:{
        type:String,
        default:''
    },
    followers:[{
        type:ObjectId,
        default:''
    }],
    following:[{
        type:ObjectId,
        default:''
    }],
    saved:[{
        type:ObjectId,
        default:''
    }],
    user_posts:[{
        type:ObjectId,
        default:''
    }],
    

});



const user =  mongoose.model('Users', RecruiterSchema,'Users');
module.exports = user;
