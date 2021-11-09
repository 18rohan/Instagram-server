const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const MONGO = require("mongodb").MongoClient;
const uri = process.env.MONGO_URI;
const access_token_key = process.env.SECRET_TOKEN;
const refresh_token_key = process.env.REFRESH_TOKEN_KEY;
const User = require("../../models/Users/user.model");
// const jobseeker = require("../../model/jobseeker/Jobseeker_model");
// const Job = require("../../model/jobs/jobs.model");
// const Joi = require("@hapi/joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const base64 = require("base64url");
// const AppError = require("../../utils/AppError.class");
const TokenSchema = require("../../models/tokens/token.model");




// Create recruiter
exports.create = async (req, res) => {
  // validate request
  // if (!req.body) {
  //   res.status(400).send({ message: "Content can not be emtpy!" });
  //   return;
  // }

  // Validate request body content
  // const { error } = newRecruiter.validate(req.body);
  // if (error) {
  //   res.status(400).send(error.details[0].message);
  // }

  console.log(req.body);
  // Hash function for password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  console.log(hashedPassword);
  // new Recruiter
  const NewUser = new User({
    email_id: req.body.email_id,
    password: hashedPassword,
    username:req.body.username,
    display_name:req.body.display_name
  });
  

  // save user in the database
  try{
        const result = await User.create(NewUser);
        console.log("CREATED USER: ",result);
        res.send(result);
    } catch(error){
        res.status(500).json({message:error.message});
    }







};




// Login recruiter method
exports.login = async (req, res) => {
  // const { error } = newRecruiter.validate(req.body);
  // if (error) {
  //   res.status(400).json(error.details[0].message);
  // }

  try {
    const CurrentUser = await User.findOne({
      email_id: req.body.email_id,
    });

    if (CurrentUser && (await bcrypt.compare(req.body.password, CurrentUser.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: CurrentUser._id },
        access_token_key,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      CurrentUser.token = token;

      // user
      res.setHeader('auth-token',token);
      res.status(200).json(CurrentUser);

    }else{
      res.status(403).send("Invalid Credentials");
      }
    
  } catch (err) {
    console.log(err);
  }
   
};



// Method: To refresh the access token
exports.createAccessToken = async (req, res) => {
  try {
    // get the old refresh token from the user
    const { token } = req.body;
    const refreshToken = token;

    // Send error if no refreshToken is sendStatus
    if (!refreshToken) {
      res.status(403).json({ error: "Access denied, token missing!" });
    } else {
      // query for token to validate
      const tokenDoc = await TokenSchema.findOne({ token: refreshToken });

      // send error if no token found
      if (!tokenDoc) {
        return res.status(401).json({ error: "Token expired" });
      } else {
        // extract the payload from refresh token to generate new access token
        const payload = jwt.verify(
          tokenDoc.token,
          refresh_token_key
        );
        // Creating new access token
        const accessToken = jwt.sign(
          { user: payload },
          refresh_token_key,
          { expiresIn: "20s" }
        );
        res.status(200).json(accessToken);
      }
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};






// retrieve and return all users/ retrive and return a single user
exports.find = async (req, res, next) => {
  const id = req.params.id;

  try {
    if (id) {
      const result = await Recruiter.findOne({ _id: id });
      if (!result) {
        return next(new AppError("No recruiter with this id found", 404));
      }
      res.json(result);
    }
    const result = await Recruiter.find({ user_type: "recruiter" });
    res.json(result);
  } catch (err) {
    res
      .status(500)
      .send({ message: err.message || "Error occured while fetching data" });
  }
};





// Update a new idetified user by user id
exports.update = async(req, res) => {
  // if (!req.body) {
  //   return res.status(400).send({ message: "Data to update can not be empty" });
  // }
  const base64String = req.headers.auth_token;
  const dataString = base64String.split('.')[1];
  const decoded = JSON.parse(base64.decode(dataString));
  const recruiter_id = decoded.user._id;
  const recruiter = await Recruiter.findOne({_id:recruiter_id});

  // const id = req.params.id;
  Recruiter.findByIdAndUpdate(recruiter_id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({
            message: `Cannot Update user`,
          });
      } else {
        res.send("User updated successfully");
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

// Delete a user with specified user id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  // res.status(200).send(id);
  Recruiter.findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({ message: `Cannot Delete with id ${id}. Maybe id is wrong` });
      } else {
        res.send({
          message: "User deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

// Filtered Fetches for recruiters

// Method: Recruiter who has posted more than 2 jobs
exports.TopRecruiter = async (req, res) => {
  try {
    const result = await Recruiter.find({ jobs_posted: { $gt: 1 } });
    res.json(result);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
