'use strict';

module.exports = function(app){

	return function *browserDetecion(next) {		
		var ua = this.request.header['user-agent'],
	    	isMobile;
	   	
		if (/mobile/i.test(ua)){
			isMobile = true;
		} else if(/Android/i.test(ua)){
			isMobile = true;
		} else if(/samsung/i.test(ua)){
			isMobile = true;
		} else if(/windows phone/i.test(ua)){
			isMobile = true;
		} else {
			isMobile = false;
		}
		
		this['is-mobile'] = isMobile;
		yield* next;
	}	
}