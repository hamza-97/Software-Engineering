const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();
const url = require('url');    


require('../models/User');
const User = mongoose.model('users');
// require('./models/Posts');
// require('./models/Comments');
    
console.log("Ok")

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
var id = ""
var filers = ""
var name = ""
var writer_details 
// Create mongo connection
const conn = mongoose.createConnection(mongoURI);
// User main page
router.get('/home', (req, res) => {
  res.render('users/Home');
});
// Payment Route


router.get('/writer', (req, res) => {
  res.render('users/writer',{name});
});

router.get('/producer', (req, res) => {
  res.render('users/producer',{name});
});
// User Login Route
router.get('/login', (req, res) => {
  res.render('users/login');
});

// User Register Route
router.get('/signup', (req, res) => {
  res.render('users/register');
});


// router.get('/producer', (req, res) => {
//   res.render('pages/producer');
// });

router.get('/editprofw', (req, res) => {
  res.render('users/editprof',{
    conditionwp: true
    // conditionwp: True
  });
});

router.get('/editprofp', (req, res) => {
  res.render('users/editprof',{
    conditionwp: false
  });
});

router.get('/loggedout', (req, res) => {
  writer_details = "";
  req.logout();
  res.render('users/loggedout');
});
// Edit profie

router.post('/edit_form/:writerdetails', (req, res) => {
    if(req.body.Password != req.body.ConfirmPassword){
        console.log("Passwords not matched")
        req.flash('error_msg', 'New passwords do not match!');
          res.redirect("/users/editprof");
      }else{

    User.findOne({username: req.body.username}, function(err, user){
      if(user == null){
        req.flash('error_msg', 'Please enter your correct old password!');
        res.redirect("/users/editprof");
      }
      else{
        bcrypt.compare(req.body.oldPassword, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch){
         bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(req.body.Password, salt, (err, hash) => { 
                if(err) throw err;
                user.password = hash;
                user.contact = req.body.Contact;
                user.save(function(err){
                // if(err)return handleErr(err);
                //user has been updated
                });
                
              })
            });
       }

        else {
          console.log("Edit Credentials wrong");
          req.flash('error_msg', 'Please enter your correct old password!');
          res.redirect("/users/editprof");
        }
        });

      }
     // if(err)return handleErr(err);
     
     });
  }
  if (req.params.writerdetails == "true"){
    res.redirect('/users/writer')
  }else{
    res.redirect('/users/producer')
  }

});
// router.get('/', (req, res) => {
//   res.render('pages/writer',{
//      names:name

//   });
// });

// router.get('/edit_form', (req, res) => {
//   res.render('pages/writer');
// });
// LOGIN FROM POST

router.post('/submit_login_form', (req, res, next) => {
  User.findOne({ username: req.body.username}, function(err, user) {
    console.log(user)
    if(user == null) {
      req.flash('error_msg', 'Please enter valid username or password!');
      res.redirect("/users/login")
    }else{
      bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
      // if(err) res.redirect("/users/login");
      if(isMatch){
        writer_details = user;
        id = user.username;
        name = user.name
        // console.log(name)
        if(user.user == "Writer"){
          // console.log(user.user)
          res.redirect('/users/writer')
        }
        if(user.user == "Producer"){
          // console.log(user.user)

          res.redirect('/users/producer')

        }


      }
      else {
        console.log("Credentials wrong");
        req.flash('error_msg', 'Please enter valid username or password!');
        res.redirect("/users/login");
      }
    });

    }
      
  });
});



router.get('/view', function(req, res) {
  // console.log("finding ",id)
  // console.log(id)
  User.findOne({username:id}, function(err, Users){
    // if (err)
    //  console.log("Best")
    //     return done(err);

    if (Users) {

      console.log(Users.username)
      // console.log("Users count : " + U.length);
      if (Users.user == "Writer"){
      res.render('users/viewprof', {
       name:Users.name,
       email:Users.email,
       contact:Users.contact,
       CNIC:Users.CNIC,
       date:Users.date,
       user:Users.user,
       conditionwp : true
        // usersArray: Users

        
      });
  }
    if (Users.user == "Producer"){

      res.render('users/viewprof', {
       name:Users.name,
       email:Users.email,
       contact:Users.contact,
       CNIC:Users.CNIC,
       date:Users.date,
       user:Users.user,
       conditionwp : false
        // usersArray: Users

        
      });
  }
    }
  });
});





let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});
var genre = ""
// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        // const filename = buf.toString('hex') + path.extname(file.originalname);
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          metadata: {additional_data:req.body, writer_details:writer_details, status:"unsold", helpername: "noname"},
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

var truefilearray = []
var truefilterarray = []
// @route GET /
// @desc Loads form
router.get('/up', (req, res) => {

  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {

      res.render('users/script_upload', { files: false });
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
      // console.log(files[0].metadata.writer_details.username)
      truefilearray = []
      for(var i = 0; i < files.length;i++){
        // console.log(files[i].metadata.writer_details.username)
        // console.log(writer_details.username)
        // console.log(writer_details.username)
        if (files[i].metadata.writer_details.username == writer_details.username){
              truefilearray.push(files[i])
          
            }
          }

          res.render('users/script_upload', { files:truefilearray });
        }
            })
  });



router.get('/s_writer', (req, res) => {

  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {

      res.render('users/submitted_writer', { files: false });
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
      // console.log(files[0].metadata.writer_details.username)
      truefilearray = []
      for(var i = 0; i < files.length;i++){
        // console.log(files[i].metadata.writer_details.username)
        // console.log(writer_details.username)
        // console.log(writer_details.username)
        if (files[i].metadata.writer_details.username == writer_details.username && files[i].metadata.status == "unsold"){
              truefilearray.push(files[i])
          
            }
          }

          res.render('users/submitted_writer', { files:truefilearray });
        }
            })
  });

router.get('/th_writer', (req, res) => {

  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {

      res.render('users/thistory_writer', { files: false });
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
      // console.log(files[0].metadata.writer_details.username)
      truefilearray = []
      for(var i = 0; i < files.length;i++){
        // console.log(files[i].metadata.writer_details.username)
        // console.log(writer_details.username)
        // console.log(writer_details.username)
        if (files[i].metadata.writer_details.username == writer_details.username && files[i].metadata.status == "sold"){
              truefilearray.push(files[i])
          
            }
          }

          res.render('users/thistory_writer', { files:truefilearray });
        }
            })
  });



router.get('/th_producer', (req, res) => {

  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {

      res.render('users/thistory_producer', { files: false });
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
      // console.log(files[0].metadata.writer_details.username)
      truefilearray = []
      for(var i = 0; i < files.length;i++){
        // console.log(files[i].metadata.writer_details.username)
        // console.log(writer_details.username)
        // console.log(writer_details.username)
        if (files[i].metadata.helpername == writer_details.username  && files[i].metadata.status == "sold"){
              truefilearray.push(files[i])
          
            }
          }

          res.render('users/thistory_producer', { files:truefilearray });
        }
            })
  });




router.post('/filter', (req, res) => {

  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {

      res.render('users/submitted_writer', { files: false });
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
      // console.log(req.body)
      // console.log(files[0].metadata.writer_details.username)
      truefilterarray = []
      if (req.body.genref != "All")
        for(var i = 0; i < files.length;i++){
          // console.log(files[i].metadata.writer_details.username)
          // console.log(writer_details.username)
          // console.log(writer_details.username)
          if (files[i].metadata.writer_details.username == writer_details.username && files[i].metadata.additional_data.genre == req.body.genref ){
                truefilterarray.push(files[i])
            
              }
            
            }
        else{
          for(var i = 0; i < files.length;i++){
          // console.log(files[i].metadata.writer_details.username)
          // console.log(writer_details.username)
          // console.log(writer_details.username)
          if (files[i].metadata.writer_details.username == writer_details.username  ){
                truefilterarray.push(files[i])
            
              }
            
            }
        }
        res.render('users/submitted_writer', { files:truefilterarray });
        }
            })
  });          

        
    
        

    












router.get('/read', (req, res) => {

  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {

      res.render('users/script_producers', { files: false });
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
      truefilterarray = []
      for(var i = 0; i < files.length;i++){
        if (files[i].metadata.status == "unsold" ){
              truefilterarray.push(files[i])
          
            }
          }

      res.render('users/script_producers', { files: truefilterarray });
    }
  });

});




router.post('/filter_producer', (req, res) => {

  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {

      res.render('users/script_producers', { files: false });
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
      // console.log(req.body)
      // console.log(files[0].metadata.writer_details.username)
      truefilterarray = []
      if (req.body.genref != "All")
        for(var i = 0; i < files.length;i++){
          // console.log(files[i].metadata.writer_details.username)
          // console.log(writer_details.username)
          // console.log(writer_details.username)
          if (files[i].metadata.additional_data.genre == req.body.genref && files[i].metadata.status == "unsold" ){
                truefilterarray.push(files[i])
            
              }
            
            }
        else{
          for(var i = 0; i < files.length;i++){
          // console.log(files[i].metadata.writer_details.username)
          // console.log(writer_details.username)
          // console.log(writer_details.username)
          if (files[i].metadata.status == "unsold" ){
                truefilterarray.push(files[i])
            
              }
            
            }
        }

          res.render('users/script_producers', { files:truefilterarray });
        }
            })
  });          

// @route POST /upload
// @desc  Uploads file to DB
router.post('/upload', upload.single('file'), (req, res) => {
// });
    
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
router.get('/producer/files', (req, res) => {
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
router.get('/producer/files/:filename', (req, res) => {
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


router.get('/producer/image/:filename', (req, res) => {
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

    res.redirect('/users/s_writer');
  });
});

var file_id
var masterfile
// Edit Form POST
// gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
router.get('/producers/files/:id', (req, res) => {
  // console.log(req.params.id)
  gfs.files.find().toArray((err, files) => {
    console.log(files)
      for(var i = 0; i < files.length;i++){
        if (files[i]._id == req.params.id){
          file_id = files[i]._id;
          masterfile= files[i];
          price = files[i].price;
          // console.log(files[i].metadata)
          // console.log(masterfile)

        }
  }
    res.redirect('/users/buy');
  });
});

// router.get('opentab', (req, res) => {
//   res.render('users/buy' , {file:masterfile});
// });

router.get('/buy', (req, res) => {
  // res.render('users/buy' );
  // res.redirect('/users/opentab',target ="_blank");
  res.render('users/buy' , {file:masterfile});
  
});


// POST FORM PAYMENT
var download_file
router.post('/buy_form/:id', (req, res,next) => {
    /** First check if file exists */

     gfs.files.find().toArray((err, files) => {
      for(var i = 0; i < files.length;i++){
        if (files[i]._id == req.params.id){
          download_file= files[i]
          gfs.files.update(
              { _id: files[i]._id },
              { $set: {
                'metadata.status': "sold",
                'metadata.helpername': writer_details.username
                } })
           
        }
      }
        // create read stream
        var readstream = gfs.createReadStream({
            _id: download_file._id,
            root: "uploads"
        });
        // set the proper content type 
        res.set('Content-Type', download_file.contentType)
        // Return response
        return readstream.pipe(res);
        // res.redirect('/users/up');
    });
});
  // res.end("Payment successful")
  // res.redirect("/users/producer")



// // Login Form POST
router.post('/submit_signup_form', (req, res) => {
  let errors = [];

  if(req.body.Password != req.body.ConfirmPassword){
   console.log("Passwords not matched")
    errors.push({text:'Passwords do not match'});
  }


  // if(req.body.Password.length < 4){
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