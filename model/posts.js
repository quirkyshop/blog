var mongo = require('../lib/mongo.js');
var posts = mongo.collection('posts');
module.exports = posts;