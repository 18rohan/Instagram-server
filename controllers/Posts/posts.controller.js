// Library import
const express = require('express');
const router = express.Router();
const mongoose  = require('mongoose');
const MONGO = require('mongodb').MongoClient;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const base64 = require('base64url');


// Environment Variables
const uri = process.env.MONGO_URI;

// Importing models/Schema
const User = require('../../models/Users/user.model.js');

const Post = require('../../models/Posts/posts.model');
// const AppError = require('../../utils/AppError.class');

// Validation Schema
const Joi = require('@hapi/joi');
// const newRecruiter = require('../recruiters/recruiter_validate');



// exports.createPost = async (req, res)=>{
//     if(!req.body){
//         res.status(400).send({ message : "Content can not be emtpy!"});
//         return;
//     } 
//     const user = await User.findOne({_id:})
// }



// Method: Creating a Job
exports.createPost = async (req,res)=>{
    // if(!req.body){
    //     res.status(400).send({ message : "Content can not be emtpy!"});
    //     return;
    // }
    const base64String = req.headers.auth_token;
    console.log("BODY DATA: ",req.file);
    console.log("base64String: ",req.headers.auth_token);
    const dataString = base64String.split('.')[1];
    const decoded = JSON.parse(base64.decode(dataString));
    
    const user_id = decoded.user_id;
    const {post_image, body:{post_caption}} = req;
    console.log("POST IMAGE(SERVER):",post_image);
    console.log("POST CAPTION(SERVER):",post_caption);
    const ig_user = await User.findOne({_id:user_id});
    const datetime = new Date().toLocaleString('en-US', {timeZone: 'Asia/Kolkata'}); 
    const posted_img = 'uploads/' + req.file.originalname;
    const NewPost = new Post({
    post_image:posted_img,
    post_caption:req.body.post_caption,
    posted_by_username:req.body.posted_by_username,
    posted_by_dp:req.body.posted_by_dp,
    timestamp_created:datetime,
    });
   

    try{

        const result = await Post.create(NewPost);

        User.findByIdAndUpdate(user_id,
            {$push:{user_posts:result._id}},
            { useFindAndModify: false})
        .catch(err =>{
            res.send({ message : err.message})
        })
        res.send("Posted Successfully!");
    } catch(error){
        res.status(500).json({message:error.message});
    }


};

// Fetch All Posts 
exports.FetchAllPosts = async(req,res)=>{
    try{
        sort={'timestamp_created':-1}
        const result = await Post.find().sort(sort);
        res.send(result);
    }catch(err){
        console.log(err)
    }
}







// Like a Post functionality
// To like a post, we need to store the user_id in the 'likes' array of the post 
// We will need two things: 
// 1.User_id: To store the value in the 'likes' array of the post
// 2.Post_id: To refer to the post which was liked.

exports.LikePost = async(req,res) =>{
    try{
        const base64String = req.headers.auth_token;
        const auth_token = base64String.split('.')[1];
        const dataString = base64String.split('.')[1];
        const decoded = JSON.parse(base64.decode(dataString));
        //User_id: To be stored in the 'likes' array of the post
        const user_id = decoded.user_id;
        const user = await User.findOne({_id:user_id})
        console.log("USER: ",user);
        // Post_id: To refer to the post which was liked.
        const post_id = req.body.post_id;
        
        const currentPost = await Post.findOne({_id:post_id});
        await Post.findByIdAndUpdate(currentPost,
            {$push:{likes:user_id}},
            {useFindAndModify:false}
            )
        console.log("POST: ",currentPost);
        res.send("successfully");


    }catch(error){
        console.log(error.message);
    }
}

exports.UnlikePost = async(req,res)=>{
    try{    
        const base64String = req.headers.auth_token;
        const dataString = base64String.split('.')[1];
        const decoded = JSON.parse(base64.decode(dataString));
        //User_id: To be stored in the 'likes' array of the post
        const user_id = decoded.user_id;
        const user = await User.findOne({_id:user_id})
        // Post_id: To refer to the post which was liked.
        const post_id = req.body.post_id;
        
        const currentPost = await Post.findOne({_id:post_id});
        await Post.findByIdAndUpdate(currentPost,
            {$pull:{likes:user_id}},
            {useFindAndModify:false}
            )
        res.send("successfully removed")
    } catch(err) {
        console.log(err);
    }
}

// Method: Updating Job
exports.updateJob = async(req,res)=>{
const job_id = req.params.job_id;

try{
    const result = await Job.findByIdAndUpdate(job_id,req.body,{useFindAndModify:false});
    if(!result){
        return next(new AppError('No job with that id found',404));
    }
    res.send("Job Updated Successfully!");
} catch(err){
    res.send(500).send({message:err.message});
}




}

// Method: Apply job for jobseekers
exports.ApplyJob = async(req,res)=>{
    const base64String = req.headers.auth_token;
    const dataString = base64String.split('.')[1];
    const decoded = JSON.parse(base64.decode(dataString));
    console.log("DECODED: ",decoded);
    const job_id = req.params.job_id;
    console.log("JOB ID: ",job_id);
    const applicant = await jobseeker.findOne({_id:decoded.user._id});
    console.log("APPLICANT: ",applicant);
    const currentjob = await Job.findOne({_id:job_id})
    console.log("CURRENT JOB: ",currentjob)

    if(currentjob.applicants.includes(applicant._id )){
        res.send("user has already applied");
    }
    try{
        await Job.findByIdAndUpdate(job_id,
            {$push : {applicants:decoded.user._id}},
            {useFindAndModify:false});

        await jobseeker.findByIdAndUpdate(applicant,
            {$push:{applied_jobs:job_id}},
            {useFindAndModify:false}
            )

            res.send("User applied successfully");
     } catch(err){
        res.status(500).send({message:err.message})
     }





};

// Method: Delete Job
exports.deleteJob = async(req,res)=>{
    const base64String = req.headers.auth_token;
    const dataString = base64String.split('.')[1];
    const decoded = JSON.parse(base64.decode(dataString));

    const job_id = req.params.job_id;


    try{
        const user_id = decoded._id;
        const job = await Job.findOneAndDelete({_id:job_id});
        res.send("Job deleted successfully!!");

    } catch(err){
        res.status(500).send({message:err.message});
    }
}

// Method: Fetch All Jobs
exports.fetchJobs = async(req,res)=>{
  // res.send("We are in jobs");
    const base64String = req.headers.auth_token;
    const dataString = base64String.split('.')[1];
    const decoded = JSON.parse(base64.decode(dataString));
    if(!base64String){
      res.status(403).send("User not authorized.");
    }
    try{
        const user_id = decoded.user._id;
        console.log(user_id);
        const result = await Job.find({recruiter_id:user_id});
        if(!result){
            return next(new AppError('No job with that id found',404));
        }
        res.send(result);
    } catch(err){
        res.status(400).send(err);
    }
}



// Method: Get All jobs
exports.getJobs = async(req,res,next)=>{
    const job_id = req.params.id;

    try{
        if(job_id){
            const result = await Job.findOne({_id:job_id});
            if(!result){
                return next(new AppError('No job with that id found',404));
            }
            res.send(result);
        }else{
            const result = await Job.find();
            res.send(result);
        }

    } catch(err){
        res.status(500).send({message:err.message});
    }
}




// ------------ Filtered Job Searches ------------

// Method: Get Latest Jobs
exports.getLatestJobs = async(req,res)=>{

    try{
            const result = await Job.find().sort({"created_at": -1});
            const arr = Object.keys(result).map((key)=>[key,result[key]]);
            if(arr.length == 0){
                return next(new AppError(`No jobs found`,404));

            }
            res.send(result);


    } catch(err){
        res.status(500).send({message:err.message});
    }
}

// Method: Get Jobs by location
exports.getLocationJobs = async(req,res,next)=>{
    const location = req.params.location
    var regex = new RegExp(["^", location, "$"].join(""), "i");
    // res.send(location);
    try{
        const result = await Job.find({ job_location: { $in:regex }});
        const arr = Object.keys(result).map((key)=>[key,result[key]]);
        const arr_length = arr.length;
        console.log("array length: ",arr_length);
        if(arr.length == 0){
                return next(new AppError(`No jobs found in ${location}`,404));

        }
            res.send(result);


    } catch(err){
        res.status(500).send({message:err.messsage});
    }
}


// Method: Get Jobs by skill tag
exports.getSkillJobs = async(req,res,next)=>{
    const skill = req.params.skills;
    var regex = new RegExp(["^", skill, "$"].join(""), "i");
    try{
        const result = await Job.find({job_keywords:{$in:regex}});
        const arr = Object.keys(result).map((key)=>[key,result[key]]);
        if(arr.length == 0){
                return next(new AppError(`No jobs found for ${skill}`,404));

        }
        res.send(result);
    } catch(err){
        res.status(500).send({message:err.message})
    }
}

// Method: Get Jobs by Industry
exports.getIndustryJobs = async(req,res,next)=>{
    const industry = req.params.industry;
    var regex = new RegExp(["^", industry, "$"].join(""), "i");
    try{
        const result = await Job.find({industry_name:{$in:regex}});
        const arr = Object.keys(result).map((key)=>[key,result[key]]);
        if(arr.length == 0){
                return next(new AppError(`No ${industry} jobs found.`,404));

        }

        res.send(result);
    } catch(err){
        res.status(500).send({message:err.message});
    }
}

// Method: Get jobs by Designation
exports.getDesginationJobs = async(req,res,next)=>{
    const designation = req.params.designation;

    try{
        const result = await Job.find({job_title:{$regex:designation}});
        const arr = Object.keys(result).map((key)=>[key,result[key]]);
        if(arr.length == 0){
                return next(new AppError(`No ${designation} jobs found.`,404));

        }
        res.send(result);
    } catch(err){
        res.status(500).send({message:err.message});
    }
}

// Method: Get Jobs by Company
exports.getCompanyJobs = async(req,res,next)=>{
    const company = req.params.company;
    if(!company){
        res.send({message:"Input parameter is require."});
    }
    var regex = new RegExp(["^", company, "$"].join(""), "i");


    try{
        const result = await Job.find({company_name:{$in:regex}});
        const arr = Object.keys(result).map((key)=>[key,result[key]]);
        if(arr.length == 0){
                return next(new AppError(`No jobs found at ${designation}.`,404));

        }
        res.send(result);
    } catch(err){
        res.status(500).send({message:err.message});
    }
}

// Method: Get jobs by type
exports.getJobsType = async(req,res,next)=>{
    const type = req.params.type;
    var regex = new RegExp(["^", type, "$"].join(""), "i");

    try{
        const result = await Job.find({employment_type:{$in:regex}});
        const arr = Object.keys(result).map((key)=>[key,result[key]]);
        if(arr.length == 0){
                return next(new AppError(`No ${type} jobs found.`,404));
        }
        res.send(result);
    } catch(err){
        res.status(400).send({message:err.message});
    }


}


// Method: Get jobs by experience
exports.getJobsByExperience = async(req,res,next)=>{
    const type = req.params.experience_type;
    if(!type){
        res.status(400).send({message:"Input parameter is require."});
    }

    var regex = new RegExp(["^", type, "$"].join(""), "i");

    try{
        if(type === "fresher"){
            const result = await Job.find({exp_max:{$lt:2}});
            console.log(result)
            if(result.length === 0){
                res.status(400).send("incorrect input");
                return;
            }
            res.status(200).send(result);
        } else if(type === "experienced"){
            console.log('here')
            const result = await Job.find({exp_max:{$gt:2}});
            console.log(result)
            res.status(200).send(result);
        } else {

            return next(new AppError(`No jobs found.`,404));
        }



    } catch(err){
        res.status(500).send({message:err.message});
    }
}
