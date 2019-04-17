
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

// Load User Model
require('../models/User');
const User = mongoose.model('users');

// User main page
router.get('/home', (req, res) => {
  res.render('users/Home');
});


// User Login Route
router.get('/login', (req, res) => {
  res.render('users/login');
});

// User Register Route
router.get('/signup', (req, res) => {
  res.render('users/register');
});

// Login Form POST
router.post('/submit_login_form', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect:'/pages',
    failureRedirect: '/users/register',
    failureFlash: true
    // console.log("Vert good bro")
  })(req, res, next);
  console.log("Very good")
});



// router.post('/submit_login_form', (req, res, next) => {
	
// 	var query = {
//     	username: req.body.Username,
//     	password: req.body.Password
// 	};
// 	MongoClient.connect(url, function (err, client) {
// 		var db = client.db('scriptomania');
//     	assert.equal(null, err);
//    		db.collection('users').findOne({ email: req.body.username}, function(err, user) {
//            	if(user ===null){
//                res.end("Login invalid");
//             }else if (user.email === req.body.username && user.password === req.body.password){
//             res.end("Login Successful");
//           } else {
//             console.log("Credentials wrong");
//             res.end("Login invalid");
//           }
//    });
//  });
// });
//   passport.authenticate('local', {
//     successRedirect:'/pages',
//     failureRedirect: '/users/login',
//     failureFlash: true
//   })(req, res, next);
// });





// Register Form POST
// router.post('/submit_signup_form', function(req, res, next) {
//   var item = {
//     name: req.body.Name,
//     email: req.body.email,
//     contact: req.body.Contact,
//     cnic: req.body.CNIC,
//     date: req.body.date,
//     username: req.body.Username,
//     password: req.body.Password,
//     writer: req.body.Writer,
//     producer: req.body.Producer
//   };




//   MongoClient.connect(url, function(err, client) {
//   	var db = client.db('Scriptomania');
//     assert.equal(null, err);
//     // if (err) throw err;
//     db.collection('users').insertOne(item, function(err, result) {
//       // if (err) throw err;
//       assert.equal(null, err);
//       console.log('Item inserted');
//       client.close();
//     });
//   });

//   res.redirect('/users/login');
// });




// // Register Form POST
router.post('/submit_signup_form', (req, res) => {
  let errors = [];

  // if(req.body.password != req.body.ConfirmPassword){
  // 	console.log("Passwords not matched")
  //   errors.push({text:'Passwords do not match'});
  // }

  // if(req.body.password.length < 4){
  //   errors.push({text:'Password must be at least 4 characters'});
  // }

  if(errors.length > 0){
    res.render('users/register', {
       errors: errors,
       name: req.body.Name,
       email: req.body.email,
       contact: req.body.Contact,
       CNIC: req.body.CNIC,
       date: req.body.date,
       username: req.body.Username,
       password: req.body.Password

       // writer: req.body.Writer,
       // producer: req.body.Producer
    });
  } else {
    User.findOne({email: req.body.email})
      .then(user => {
        if(user){
          req.flash('error_msg', 'Email already regsitered');
          res.redirect('/users/register');
        } else {
          const newUser = new User({
           name: req.body.Name,
	       email: req.body.email,
	       contact: req.body.Contact,
	       CNIC: req.body.CNIC,
	       date: req.body.date,
	       username: req.body.Username,
	       password: req.body.Password


	       // writer: req.body.Writer,
	       // producer: req.body.Producer
          });
          
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if(err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'You are now registered and can log in');
                  res.redirect('/users/login');
                })
                .catch(err => {
                  console.log(err);
                  return;
                });
            });
          });
        }
      });
  }
});

// // Logout User
// router.get('/logout', (req, res) => {
//   req.logout();
//   req.flash('success_msg', 'You are logged out');
//   res.redirect('/users/login');
// });

module.exports = router;