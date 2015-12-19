var mongo = require('../lib/mongo.js');
var archives = mongo.collection('archives');
module.exports = archives;