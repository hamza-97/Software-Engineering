if(process.env.NODE_ENV === 'production'){
  module.exports = {mongoURI: 'mongodb://lecturelink:johnybravo@ds121730.mlab.com:21730/lecturelink'}
} else {
  module.exports = {mongoURI: 'mongodb://localhost/lecturelink'}
}