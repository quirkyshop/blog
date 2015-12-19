var path = require('path');
var postsModel = require('../model/posts.js');
var tagsModel = require('../model/tags.js');
var staticsModel = require('../model/statics.js');
var staticDir = path.join(__dirname,'../../public');

module.exports = {

    index: function*(){
        var page = parseInt(this.query.page || 0)
        var count = 10

        var begin = +new Date();
        var postArr = yield postsModel.find({},{
            sort:{"dateInfo":1},
            skip: page * count,
            limit: count
        });

        var d = new Date();

        // 搜索文章花的时间
        var searchTime = (+d - begin) / 1000;
        var dateInfo = d.getFullYear() +"-"+ (d.getMonth()+1) +"-"+ d.getDate();

        // 总pv和日pv
        yield staticsModel.update({"type":"pv"},{$inc:{count:1}},{upsert:true});   
        yield staticsModel.update({"time":dateInfo},{$inc:{pv:1}},{upsert:true});   

        yield this.render('index',{
        	"title":"首页",
        	"pageStyle":"index",
        	"staticDir":staticDir,
            "posts":postArr,
            "searchTime":searchTime
        });
    },

    about: function*(){
        yield this.render('about',{
        	"title":"更多页面",
        	"pageStyle":"about",
        	"staticDir":staticDir
        });
    }      
}