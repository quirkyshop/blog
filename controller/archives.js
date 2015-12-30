var path = require('path');
var archivesModel = require('../model/archives.js');
var postsModel = require('../model/posts.js');


module.exports = {

    archives: function*(){

    	var archives = yield archivesModel.find({});
    	var tmpYear = [];
    	var archArr = [];
    	var item,idx;
    	for(var i = 0,ln=archives.length;i<ln;i++){
    		item = archives[i];
    		idx = tmpYear.indexOf(item.year);
    		if(idx==-1){
    			tmpYear.push(item.year);
    			archArr.push({
    				year:item.year,
    				arr:[]
    			});
    			idx = archArr.length-1;
    		}
    		console.log(">>>>",idx,archArr);
    		archArr[idx].arr.push(item);
    	}


    	console.log(archArr);


    	var posts = [];
    	if(archives.length > 0){
    		posts = yield postsModel.find({"dateInfo":new RegExp(archives[0].year+"-"+archives[0].month, "i")});
    	}


        var device = this['device-detecion'].Mobile ? 'mobile':'pc';
        yield this.render('archives',{
        	"title":"存档页",
        	"pageStyle":"archives",
            "device":device,            
        	"archives":archArr,
        	"posts":posts
        });
    },
}