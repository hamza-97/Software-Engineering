const express = require('express');
const path = require('path');
const exphbs  = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const favicon = require('serve-favicon')
const fs = require('fs') 
const http = require('http') 
const socketIO = require('socket.io')

const app = express();
app.use(favicon(__dirname + '/public/img/scripto.png'));

// Load routes
const users = require('./routes/users');
const pages = require('./routes/pages');

// Passport Config
require('./config/passport')(passport);
// DB Config
const db = require('./config/database');

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect(db.mongoURI, {
  useMongoClient: true
})
  .then(() => console.log('Connected to MongoDB Server'))
  .catch(err => console.log(err));

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'js')));

// Method override middleware
app.use(methodOverride('_method'));

// Express session midleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Use routes
app.use('/users', users);
app.use('/pages', pages);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/views/splashscreen.html'));
});

const port = process.env.PORT || 5000;
server=app.listen(port, () =>{
  console.log(`Server started on port ${port}`);
});

var io = require('socket.io').listen(server);

// 

// liveStud={}     ////Json object with key = Classname and pair is the student
// liveInst={}    //Json object with key = Classname and pair is the instructor