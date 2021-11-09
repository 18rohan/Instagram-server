const express = require('express');
const router = express.Router();
const User = require('../../controllers/Users/user.controller');
// const job = require('../../controllers/jobs/jobs.controller');
const auth = require('../../utils/verify-token');



// Route: Create Recruiter
router.post('/create', User.create);

// Route: Find Recruiter
// router.get('/', User.find);

// Route: Find Specific Recruiter
// router.get('/:id', recruiter.find);

// Route: Update Specific Recruiter
// router.patch('/update', auth,recruiter.update);

// Route: Delete Specific Recruiter
// router.delete('/delete/:id', recruiter.delete);

// Route: refresh Token router
// router.post('/auth/refresh/',recruiter.createAccessToken);
// router.get('/protected/profile',auth,(req,res)=>{
  // res.json({"message":"we are on protected Route"});
// })



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

// Route: Apply Job
// router.patch('/apply-job/:job_id',auth,job.ApplyJob);

// Route: Delete Job
// router.delete('/delete-job/:job_id',auth,job.deleteJob);




module.exports = router;
