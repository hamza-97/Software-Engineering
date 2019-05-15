const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

// Load User Model
require('../models/User');
const User = mongoose.model('users');

// Get Dashboard
router.get('/', ensureAuthenticated, (req, res) => {
  User.find({username: req.user.username})
    .then(record => {
      res.render('pages')
  });
});

router.get('/writer', (req, res) => {
  res.render('pages/writer',{query});
});

router.get('/producer', (req, res) => {
  res.render('pages/producer');
});

router.get('/admin', (req, res) => {
  res.render('users/admin');
});


router.get('/buy', (req, res) => {
  res.render('users/buy');
});

// router.get('/view', (req, res) => {
//   res.render('pages/viewprof');

// });


// router.get('/view', function(req, res) {
// 	console.log("finding")
//   User.findOne({username: req.body.username}, function(err, Users){
//     // if (err)
//     // 	console.log("Best")
//     //     return done(err);

//     if (Users) {
//     	console.log(Users)
//       // console.log("Users count : " + U.length);
//       res.render('pages/viewprof', {
//         usersArray: Users
        
//       });
//     }
//   });
// });



// User Register Route
// router.get('/In', (req, res) => {
//   var scripts = [{ script:'/js/countdown.js'}, { script:'/js/checklist.js'}, { script:'/js/lib.js'}, { script:'/js/inst.js'}];
//   res.render('pages/In',{scripts:scripts});
// });

// router.get('/dashboard',ensureAuthenticated, (req, res) => {
//   User.find({email: req.user.email})
//     .then(record => {
//       res.render('pages/dashboard', {
//         courses:req.user.courses,
//         allData:record
//     })
//   });
// });

// router.get('/st', (req, res) => {
//   var scripts = [{ script:'/js/countdown.js'}, { script:'/js/checklist.js'}, { script:'/js/lib.js'}, { script:'/js/stud.js'}];
//   res.render('pages/st',{scripts:scripts});
// });

module.exports = router;