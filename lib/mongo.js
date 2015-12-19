var monk =require('monk');
var wrap = require('co-monk');

var config = require('../config/config.js');

var db = monk(config.mongo);

function collection(name) {
  return wrap(db.get(name));
}

module.exports = {collection:collection};

