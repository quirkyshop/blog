var mongo = require('../lib/mongo.js');
var tags = mongo.collection('tags');
module.exports = tags;