var mongo = require('../lib/mongo.js');
var statics = mongo.collection('statics');
module.exports = statics;