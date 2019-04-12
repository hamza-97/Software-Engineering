const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

// Load User Model
require('../models/User');
const User = mongoose.model('users');

// Get Dashboard
// router.get('/', ensureAuthenticated, (req, res) => {
//   User.find({email: req.user.email})
//     .then(record => {
//       res.render('pages/dashboard', {
//         courses:req.user.courses,
//         allData:record
//     })
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