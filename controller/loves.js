var path = require('path');
var fs = require('fs');
var os = require('os');
var parse = require('co-busboy');
var lovesModel = require('../model/loves.js');
var parse = require('co-busboy');
var config = require('../config/config.js');
var staticDir = path.join(__dirname,'../../public');

module.exports = {

    // 上传文章get
    index: function*(){

        var page = parseInt(this.query.page || 0)
        var count = 10

        var lovesArr = yield lovesModel.find({},{
            sort:{"dateInfo":1},
            skip: page * count,
            limit: count
        });

        console.log("输出losv:",lovesArr);

        yield this.render('love_index',{
        	"title":"上传页面",
        	"pageStyle":"upload",
        	"staticDir":staticDir,
            "lovesArr":lovesArr
        });
    }, 


        // 读入文章页面
    detail: function*(next){
        var love = yield lovesModel.findOne({love_id:this.params.id});
        console.log("search for love:",love);

        if(!love){
            this.status = 500;
            yield next;
            return;
        }

        yield this.render('love_detail',{
            "id":love.love_id,
            "title":love.title,
            "pageStyle":"detail",
            "love":love,
            "staticDir":staticDir
        });
    },     

    upload: function*(){
        yield this.render('loveUpload',{
            "title":"上传页面",
            "pageStyle":"upload",
            "staticDir":staticDir
        });
    },

    // 上传文章loves
    uploadLoves: function*(next){
    
        var d = new Date();
        var dateInfo = d.getFullYear() +"-"+ (d.getMonth()+1) +"-"+ d.getDate();

        var love_id = (d.getTime() * Math.random()).toString().substring(0,7);

        console.log(this.request.body.fields.realImage);
        var imageArr = JSON.parse(this.request.body.fields.realImage);


        // 最终上传
        var love = {
            title:this.request.body.fields.title,
            dateInfo:dateInfo,
            rawDate:d.getTime(),
            love_id:love_id,
            imageArr:imageArr
        };

        console.log("最终上传",love);
        // 插入博文
        yield lovesModel.insert(love);

        this.redirect('/loves');

    }

}