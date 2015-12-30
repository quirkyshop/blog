var path = require('path');
var fs = require('fs');
var os = require('os');
var marked = require('marked');
var postsModel = require('../model/posts.js');
var tagsModel = require('../model/tags.js');
var archivesModel = require('../model/archives.js');
var parse = require('co-busboy');
var config = require('../config/config.js');

marked.setOptions({
  highlight: function (code, lang, callback) {
    require('pygmentize-bundled')({ lang: 'js', format: 'html' }, code, function (err, result) {
      callback(err, result.toString());
    });
  }
});

function markDown(str){
     return function(fn){
       marked(str,function(err,result){
            if (err) return fn(err);
            fn(null, result);
       });
    };
}

module.exports = {

    // 读入文章页面
    article: function*(next){
        var post = yield postsModel.findOne({post_id:this.params.id});
        
        if(!post){
            this.status = 500;
            yield next;
            return;
        }

        var device = this['device-detecion'].Mobile ? 'mobile':'pc';
        post.tags = post.tags.length > 0 ? (post.tags).toString().split(',') : [];
        var p_id = this.request.query.id;
        yield postsModel.update({post_id:this.params.id},{$inc:{pv:1}},{upsert:true});
        var url = "http://www.quirkyvar.com/posts/" + post.post_id;    
        yield this.render('article',{
            "id":post.post_id,
            "title":post.title,
        	"pageStyle":"article",
            "device":device,            
            "post":post,
            "url":url
        });
    },     

    // 上传文章get
    upload: function*(){
        yield this.render('upload',{
        	"title":"上传页面",
        	"pageStyle":"upload"
        });
    }, 

    pic: function*(next){
        console.log(this.request.body);
        var pic = this.request.body.files.image;        
        var imagepath = "";
        console.log("pic:",pic);
        if(pic.size>0){
            var tmpath = pic['path'];
            var tmparr = pic['name'].split('.');
            var ext = tmparr[tmparr.length-1];
            var realPath = config.staticDir + '/upload/' + tmparr[tmparr.length-2] + "." + ext;
            imagepath = '/upload/' + tmparr[tmparr.length-2] + "." + ext; 
            var writer = fs.createWriteStream(realPath);
            var reader = fs.createReadStream(tmpath);

            reader.pipe(writer,{end:false}); 

            reader.on('end', function() {
              writer.end('');
            });            

        }

        console.log("ima:",imagepath);
        this.status = 200;
        this.body = JSON.stringify({
            data:{
                url:imagepath,
                name:tmparr[0]
            }
        });
        return;
    },

    // 上传文章post
    uploadPost: function*(next){
        // 处理markdown
        var mark = this.request.body.fields.content;
        var markOut = yield markDown(mark); 
        
        // 处理上传封面图片
        var albumImage = this.request.body.files.image;
        var imagepath = "";
        if(albumImage.size>0){
            var tmpath = albumImage['path'];
            var tmparr = albumImage['name'].split('.');
            var ext = tmparr[tmparr.length-1];
            var realPath = config.staticDir + '/upload/' + tmparr[tmparr.length-2] + "." + ext;
            imagepath = '/upload/' + tmparr[tmparr.length-2] + "." + ext; 
            var stream = fs.createWriteStream(realPath);
            fs.createReadStream(tmpath).pipe(stream);
        }

        var d = new Date();
        var dateInfo = d.getFullYear() +"-"+ (d.getMonth()+1) +"-"+ d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

        var post_id = (d.getTime() * Math.random()).toString().substring(0,7);

        // tags 
        var tags = this.request.body.fields.tags;
        console.log("tttttt->>>>>",(tags || []));

        // 最终上传
        var post = {
            title:this.request.body.fields.title,
            author:'小恐龙',
            tags:tags || [],
            content:markOut,
            rawContent:this.request.body.fields.content,
            image:imagepath,
            dateInfo:dateInfo,
            rawDate:d.getTime(),
            post_id:post_id,
            pv:0
        };

        // 插入博文
        yield postsModel.insert(post);

        // 更新标签数量
        var tagsArr = tags.split(',');
        for(var i =0,ln = tagsArr.length;i<ln;i++){
            yield tagsModel.update({"name":tagsArr[i]},{$inc:{count:1}},{upsert:true});    
        }

        // 更新日期数量
        yield archivesModel.update({'year':d.getFullYear(),'month':(d.getMonth()+1)},{$inc:{count:1}},{upsert:true});
        

        this.redirect('/');

    }

}