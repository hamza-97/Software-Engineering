if(process.env.NODE_ENV === 'production'){
  module.exports = {mongoURI: 'mongodb://lecturelink:johnybravo@ds121730.mlab.com:21730/lecturelink'}
} else {
  module.exports = {mongoURI: 'mongodb://localhost/lecturelink'}
}
// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/database";

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   console.log("Database created!");
//   db.close();
// });