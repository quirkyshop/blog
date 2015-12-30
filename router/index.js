var index = require('../controller/index');
var posts = require('../controller/posts');
var loves = require('../controller/loves');
var archives = require('../controller/archives');
var tags = require('../controller/tags');
var path = require('path');
var staticDir = path.join(__dirname,'../../public');
module.exports = function(app){

    //首页
    app.get('/',index.index);

    //标签页
    app.get('/tags',tags.tags);
    app.get('/tags/:id',tags.singleTag);

    //存档页
    app.get('/archives',archives.archives);

    //文章页
    app.get('/posts/:id',posts.article);

    //上传页
    app.get('/upload',posts.upload);
    app.post('/upload/pic',posts.pic)

    //更多页面
    app.get('/about',index.about);

    // 上传文章
    app.post('/uploadPost',posts.uploadPost);

    // 上传照片
    app.get('/loves',loves.index)
    app.post('/uploadLoves',loves.uploadLoves);    
    app.get('/uploadLoves',loves.upload);    
    app.get('/loves/:id',loves.detail);
    

    app.use(function *notFound(next) {

      var device = this['device-detecion'].Mobile ? 'mobile':'pc';  
      if (this.status == 404) {
        yield this.render('404',{
            "title":"页面找不到了...",
            "pageStyle":"error",
            "device":device
        });
      } else {
        yield next;
      }
    });    

    app.use(function *sthErr(next) {

      var device = this['device-detecion'].Mobile ? 'mobile':'pc';  
      if (this.status >= 500) {
        yield this.render('500',{
            "title":"咦.好像出了点问题...",
            "pageStyle":"error",
            "device":device
        });
      } else {
        yield next;
      }
    });

};