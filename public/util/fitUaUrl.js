var path = require('path');
var staticDir = path.join(__dirname,'../../public/');
var mobileDir = path.join(__dirname,'../../public/mobile');

'use strict'

module.exports = function(isMobile){
	var staticPath;
    if(isMobile){
        staticPath = mobileDir;
        console.log('mobile>>',staticPath);
    }else{
        staticPath = staticDir;
        console.log('pc>>>');
    }
    return staticPath;
};