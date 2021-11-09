const express = require('express');
const router = express.Router();
const recruiter = require('../../controllers/recruiters/recruiter.controller');
const jobseeker = require('../../controllers/jobseekers/jobseeker.controller');
// const job = require('../../controllers/jobs/jobs.controller');
const auth = require('../../utils/verify-token');



// Route: Create Recruiter
router.post('/create', jobseeker.create);

// Route: Find Recruiter
router.get('/', jobseeker.find);

// Route: Find Specific Recruiter
router.get('/:id', recruiter.find);

// Route: Update Specific Recruiter
router.patch('/update', auth,jobseeker.update);

// Route: Delete Specific Recruiter
router.delete('/delete/:id', recruiter.delete);

// Route: refresh Token router
router.post('/auth/refresh/',recruiter.createAccessToken);




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
