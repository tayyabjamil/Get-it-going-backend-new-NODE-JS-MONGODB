const mongoose = require('mongoose')
const express = require ('express')
var router =express.Router();
const multer = require("multer");
var path = require("path");
const RegisterHall = require("../models/registerHall")
const UserAccount = require("../models/userAccount");

const fileimageFilter = (req, file, cb) => {
    var campaignImage = path.extname(file.originalname);
    if (
      campaignImage !== ".png" &&
      campaignImage !== ".jpg" &&
      campaignImage !== ".gif" &&
      campaignImage !== ".jpeg"
    ) {
      {
        console.log("Error");
        cb(null, false);
        return cb(new Error("Only images are allowed"));
      }
    } else {
      console.log("image uploaded");
      cb(null, true);
    }
  };
  
  const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, "./public/uploads/");
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname);
    }
  });
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileimageFilter
  });
  router.post('/multipleFiles', upload.array('files'), (req, res, next) => {
    const files = req.files;
    console.log(files);
    if (!files) {
      const error = new Error('No File')
      error.httpStatusCode = 400
      return next(error)
    }
      res.send({sttus:  'ok'});
  })
  router.post("/",upload.single('mainImage'), (req, res, next) => {

 
    UserAccount.findById(req.body.userAccountId)
      .exec()
      .then(userAccount => {
        if (!userAccount) {
          return res.status(404).json({  
            message: "Account not found"
          });
        }
        const registerHall = new RegisterHall({
          _id: new mongoose.Types.ObjectId(),
          name: req.body.name,
          email:req.body.email,
          location: req.body.location,
          startBookingAmount: req.body.startBookingAmount,
          about: req.body.about,
          contact: req.body.contact,
          services: req.body.services,
          mainImage:req.body.mainImage,
          multipleImages:req.body.multipleImages,
          userAccount: req.body.userAccountId
        });
        return registerHall.save();
      })
      .then(registerHall => {
        res.send(registerHall);
        res.status(201).json({
          message: "HALL Registered "
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });
  
// router.post("/:registerHallId/venueImages", uploadImage.single('mainImage'),async (req, res) => {
//   //find User Account
//   const registerHall = await registerHall.findOne({ _id: req.params.registerHallId});

//   // // // Start new Campaign
//   const venue = new venue();

//   venue.title = req.body.title,
//     venue.tagline = req.body.tagline,
//     // venue.image= req.file.path,
//     venue.amount = req.body.amount,
//     venue.description = req.body.description;
//     venue.pledgeAmount = req.body.pledgeAmount,
//     venue.rewardDetails = req.body.rewardDetails;
//     venue.mainImage = req.file.filename;
    

//   venue.registerHall = registerHall._id;
//   await venue.save();

//   // // //associate registerHall with course
//   registerHall.venues.push(venue._id);
//   await registerHall.save();

//   res.send(venue);
// });
// router.post('/',(req,res)=>{
// var registerHallData = new RegisterHall({
//     name:req.body.name,
//     location: req.body.location,
//     booking:req.body.booking
  
  
// })
// registerHallData.
// save((error, registerHallData) => {
//     if (error) {
//       console.log(error);
//     } else {
//       res.status(200).send({registerHallData});
 
//     }
//   });

// })
router.get("/", (req, res) => {
    RegisterHall.find().select('name startBookingAmount location mainImage')
      .exec()
      .then(user => {
        if (user.length < 1) {
          return res.status(404).json({
            message: "No campaigns Posted"
          });
        } else {
          res.send(user);
        }
      })
  });
  router.get("/hallDetails/:id", async(req, res) => { 
    await RegisterHall.findOne({_id:req.params.id})
      .exec()
      .then(user => {
        if (user.length < 1) {
          return res.status(404).json({
            message: "No Hall Registered"
          });
        } else {
          res.send(user);
        }
      }).catch(err=>{
        console.log(err)
      });
  });
  router.get("/:id", (req, res) => {
    RegisterHall.find({ userAccount: req.params.id })
      .exec()
      .then(user => {
        if (user.length < 1) {
          return res.status(404).json({
            message: "No Venuew Registered"
          });
        } else {
          res.send(user);
        }
      });
  });
module.exports=router;
