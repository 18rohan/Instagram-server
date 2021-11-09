const express = require('express');
const router = express.Router();
const User = require('../../controllers/Users/user.controller');
const Post = require('../../controllers/Posts/posts.controller');
const auth = require('../../utils/verify-token');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req,res,cb){
        cb(null,'public/uploads/');
    },
    filename: function (req, file, cb){
        cb(null ,file.originalname);
    },
});
const fileFilter = (req,file,cb)=>{
    // reject a file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
        cb(null,true);
    }else{
        cb(new Error("incorrect file type"), false);
    }


};
const upload = multer({
    storage:storage,
    limits:{
    fileSize:1024*1024*10
    },
    fileFilter:fileFilter


});


// Route: Create Posts
router.post('/create', upload.single('post_image'),Post.createPost);

// Route: Fetch All Posts
router.get('/', Post.FetchAllPosts);

// Route: Like a Post
router.post('/like', Post.LikePost);

// Route:Unlike a Post
router.post('/unlike', Post.UnlikePost);

//Route: Fetch all jobs by a specific recruiter
// router.get('/fetch/jobs',jobs.fetchJobs);

// Route: Apply Job
// router.patch('/apply-job/:job_id',auth,jobs.ApplyJob);


// Route: Update Specific Recruiter
// router.patch('/update', auth,recruiter.update);

// Route: Delete Specific Recruiter
// router.delete('/delete/:id', recruiter.delete);

// Route: refresh Token router
// router.post('/auth/refresh/',recruiter.createAccessToken);




//----------- Jobs route -----------------


// Route: Create Jobs
// router.post('/post-job',auth,job.createJob);

// Route: Fetch All Jobs posted by a recruiter
// router.get('/get/jobs',auth,job.fetchJobs);

// Route: Fetch all jobs
// router.get('/fetch-jobs',job.getJobs);

// Route: Fetch a specific job
// router.get('/fetch-jobs/:id',job.getJobs);

// Route: Update Jobs
// router.patch('/update-job/:job_id',auth,job.updateJob)


// Route: Delete Job
// router.delete('/delete-job/:job_id',auth,job.deleteJob);




module.exports = router;
