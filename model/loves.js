var mongo = require('../lib/mongo.js');
var loves = mongo.collection('loves');
module.exports = loves;