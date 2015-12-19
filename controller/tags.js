var path = require('path');
var tagsModel = require('../model/tags.js');
var postsModel = require('../model/posts.js');
var staticDir = path.join(__dirname,'../../public');


module.exports = {

    tags: function*(){
    	var tags = yield tagsModel.find({});
    	var posts = [];
    	if(tags.length > 0){
    		var reg = tags[0];
    		posts = yield postsModel.find({"tags":new RegExp(tags[0], "i")});
    	}
        yield this.render('tags',{
        	"title":"标签页",
        	"pageStyle":"tags",
        	"staticDir":staticDir,
        	"tags":tags,
        	"posts":posts
        });
    },

    singleTag:function *(){
    	var tag = yield tagsModel.find({name:this.params.id});
    	var postArr = yield postsModel.find({"tags":new RegExp(this.params.id, "i")});

    	yield this.render('tags',{
        	"title":"搜索"+tag,
        	"pageStyle":"tags",
        	"staticDir":staticDir,
        	"tags":tag,
        	"posts":postArr
        });
    } 

}