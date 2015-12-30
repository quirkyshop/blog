'use strict';

module.exports = function(app){

	return function *browserDetecion(next) {		
		var ua = this.request.header['user-agent'],
	    device = {};

	if (/mobile/i.test(ua))
	    device.Mobile = true;

	if (/like Mac OS X/.test(ua)) {
	    device.iOS = /CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/.exec(ua)[2].replace(/_/g, '.');
	    device.iPhone = /iPhone/.test(ua);
	    device.iPad = /iPad/.test(ua);
	}

	if (/Android/.test(ua))
	    device.Android = /Android ([0-9\.]+)[\);]/.exec(ua)[1];

	if (/webOS\//.test(ua))
	    device.webOS = /webOS\/([0-9\.]+)[\);]/.exec(ua)[1];

	if (/(Intel|PPC) Mac OS X/.test(ua))
	    device.Mac = /(Intel|PPC) Mac OS X ?([0-9\._]*)[\)\;]/.exec(ua)[2].replace(/_/g, '.') || true;

	if (/Windows NT/.test(ua))
	    device.Windows = /Windows NT ([0-9\._]+)[\);]/.exec(ua)[1];
		
		this['device-detecion'] = device;
		yield* next;
	}	
}