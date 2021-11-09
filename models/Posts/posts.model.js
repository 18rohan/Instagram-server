const mongoose = require('mongoose');
// const Joi = require('joi');



var ObjectId = mongoose.Schema.ObjectId;
// Mongoose Schema


// Postid - objectId
// PostImage - String(url)
// PostCaption - String(text)
// Likes - array[](array of objectids of users who liked the post)
// comments - array[](array of objects:{user_id:objectId, commentDesc:comment_description})
// TimestampCreated - timestamp
// 

const PostSchema = mongoose.Schema({
    
    
    post_image:{
        type:String,
        default:''
    },
    post_caption:{
        type:String,
        default:''
    },
    posted_by_username:{
        type:String,
        default:''
    },
    posted_by_dp:{
        type:String,
        default:''
    },
    likes:[{
        type:ObjectId,
        default:''
    }],
    comments:[{
        user:ObjectId,
        comment_desc:String,
        default:[]
    }],
    timestamp_created:{
        type:String,
        default:''
    }

});



const post =  mongoose.model('posts', PostSchema,'posts');
module.exports = post;
