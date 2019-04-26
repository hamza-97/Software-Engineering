
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();



require('../models/User');
const User = mongoose.model('users');
// require('./models/Posts');
// require('./models/Comments');
    


const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

// Load User Model
// require('../models/User');
// const User = mongoose.model('users');
// Mongo URI
const mongoURI = 'mongodb+srv://scriptomania:group23@script-6wmwk.mongodb.net/test?retryWrites=true';

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);
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

router.get('/up', (req, res) => {
  res.render('users/script_upload');
});
// LOGIN FROM POST
router.post('/submit_login_form', (req, res, next) => {
  passport.authenticate('local', {
    successFlash:'Welcome!',
    successRedirect:'/pages/writer',
    // cons
    // successRedirect:('/pages',{user: req.body.user}),

    failureRedirect: '/users/login',
    failureFlash: true
    // console.log("hey" + username)

  })(req, res, next);
  // console.log(user.user)
  console.log(res.user)
  // console.log(req.body.user)
   
  // console.log(req.user)
    
    // successRedirect:('/pages',{user: req.body.user}),

  // router.get('/pages', function(req, res){
  // res.render('pages', { username: req.body.Username});
});


// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

// @route GET /
// @desc Loads form
router.get('/', (req, res) => {
  console.log(req.body)
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      res.render('index', { files: false });
    } else {
      files.map(file => {
        if (
          file.contentType === 'image/jpeg' ||
          file.contentType === 'image/png'
        ) {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
      res.render('index', { files: files });
    }
  });

});

// @route POST /upload
// @desc  Uploads file to DB
router.post('/upload', upload.single('file'), (req, res) => {
  // console.log(req.body)
  // res.json({ file: req.file });
  	 // res.render('you successfully submitted the script')
  	 res.redirect('/users/up');
});

// @route GET /files
// @desc  Display all files in JSON
router.get('/files', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      });
    }

    // Files exist
    return res.json(files);
  });
});

// @route GET /files/:filename
// @desc  Display single file object
router.get('/files/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    // File exists
    return res.json(file);
  });
});

// @route GET /image/:filename
// @desc Display Image
router.get('/image/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
});

// @route DELETE /files/:id
// @desc  Delete file
router.delete('/files/:id', (req, res) => {
  gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }

    res.redirect('/users/up');
  });
});
// Edit Form POST
// router.post('/edit_form', (req, res) => {
//    User.findOneAndUpdate({username:req.body.username})
//    .then(user=> {
//     if(user){
//       contact: req.body.Contact,
//       password: req.body.Password

//     }
//    }
//     )

// });


// // Login Form POST
router.post('/submit_signup_form', (req, res) => {
  let errors = [];

  // if(req.body.password != req.body.ConfirmPassword){
  //  console.log("Passwords not matched")
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
       user: req.body.user,
       username: req.body.Username,
       password: req.body.Password

       // writer: req.body.Writer,
       // producer: req.body.Producer
    });
  } else {
    User.findOne({username: req.body.Username})
      .then(user => {
        if(user){
          req.flash('error_msg', 'username already regsitered');
          res.redirect('/users/signup');
        } else {
          const newUser = new User({
         name: req.body.Name,
         email: req.body.email,
         contact: req.body.Contact,
         CNIC: req.body.CNIC,
         date: req.body.date,
         username: req.body.Username,
         password: req.body.Password,
         user: req.body.user


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
// router.post('/login', (req, res, next) => {
//   passport.authenticate('local', {
//     successRedirect:'/pages',
//     failureRedirect: '/users/login',
//     failureFlash: true
//   })(req, res, next);
// });

// // Register Form POST
// router.post('/signup', (req, res) => {
//   let errors = [];

//   if(req.body.password != req.body.password2){
//     errors.push({text:'Passwords do not match'});
//   }

//   if(req.body.password.length < 4){
//     errors.push({text:'Password must be at least 4 characters'});
//   }

//   if(errors.length > 0){
//     res.render('users/register', {
//       errors: errors,
//       name: req.body.name,
//       email: req.body.email,
//       password: req.body.password,
//       password2: req.body.password2
//     });
//   } else {
//     User.findOne({email: req.body.email})
//       .then(user => {
//         if(user){
//           req.flash('error_msg', 'Email already regsitered');
//           res.redirect('/users/register');
//         } else {
//           const newUser = new User({
//             name: req.body.name,
//             email: req.body.email,
//             password: req.body.password,
//             type: req.body.type
//           });
          
//           bcrypt.genSalt(10, (err, salt) => {
//             bcrypt.hash(newUser.password, salt, (err, hash) => {
//               if(err) throw err;
//               newUser.password = hash;
//               newUser.save()
//                 .then(user => {
//                   req.flash('success_msg', 'You are now registered and can log in');
//                   res.redirect('/users/login');
//                 })
//                 .catch(err => {
//                   console.log(err);
//                   return;
//                 });
//             });
//           });
//         }
//       });
//   }
// });

// // Logout User
// router.get('/logout', (req, res) => {
//   req.logout();
//   req.flash('success_msg', 'You are logged out');
//   res.redirect('/users/login');
// });

module.exports = router;