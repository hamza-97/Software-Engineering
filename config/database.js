// if(process.env.NODE_ENV === 'production'){
//   module.exports = {mongoURI: 'mongodb://lecturelink:johnybravo@ds121730.mlab.com:21730/lecturelink'}
// } else {
// 	  module.exports = {mongoURI: 'mongodb://lecturelink:johnybravo@ds121730.mlab.com:21730/lecturelink'}

//   // module.exports = {mongoURI: 'mongodb://localhost/lecturelink'}
// }
// // var MongoClient = require('mongodb').MongoClient;
// // var url = "mongodb://localhost:27017/database";

// // MongoClient.connect(url, function(err, db) {
// //   if (err) throw err;
// //   console.log("Database created!");
// //   db.close();
// // });

// Scriptomania@5
// mongodb+srv://hamza.hu97@gmail.com:Scriptomania@5@cluster0-yi1vo.mongodb.net/test?retryWrites=true
if(process.env.NODE_ENV === 'production'){
// mongodb+srv://scriptomania:group23@script-6wmwk.mongodb.net/test?retryWrites=true
  module.exports = {mongoURI: 'mongodb+srv://scriptomania:group23@script-6wmwk.mongodb.net/test?retryWrites=true'}
} else {
// mongodb+srv://scriptomania:group23@script-6wmwk.mongodb.net/test?retryWrites=true
	  module.exports = {mongoURI: 'mongodb+srv://scriptomania:group23@script-6wmwk.mongodb.net/test?retryWrites=true'}

  // module.exports = {mongoURI: 'mongodb://localhost/lecturelink'}
}

// mongodb+srv://scriptomania:group23@script-6wmwk.mongodb.net/test?retryWrites=true

// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/database";

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   console.log("Database created!");
//   db.close();
// });

// Scriptomania@5
// mongodb+srv://hamza.hu97@gmail.com:Scriptomania@5@cluster0-yi1vo.mongodb.net/test?retryWrites=true
