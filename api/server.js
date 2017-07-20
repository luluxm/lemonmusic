'use strict';
const express = require('express');
//解析post请求体数据
const bodyParser = require('body-parser');
//引入userController
let userConrtoller = require('./controllers/userController');

let server = express();

//路由对象
let router = express.Router();

//解析post请求体数据
server.use(bodyParser.urlencoded({ extended: false })); //挂载req.body的值

//使用中间件处理跨域
server.use('/api',(req,res,next)=>{
    //允许所有域访问我
    res.setHeader('Access-Control-Allow-Origin', '*');
    //允许相关的请求方式访问我
    res.setHeader('Access-Control-Allow-Methods', 'POST,DELETE,PUT,OPTIONS,GET');
    // 当跨域和post + application/json同时出现，也会自动携带一个头content-type
    res.setHeader('Access-Control-Allow-Headers', 'content-type,mytoken');
    //如果不next()就会一直卡住
    next();
});
//配置路由规则
router.post('/api/check/username',(req,res,next)=>{ //调用userController操作用户是否存在的事宜
    userConrtoller.checkUsername(req,res,next);
})
   .post('/api/register',(req,res,next)=>{ //注册
       userConrtoller.doRegister(req,res,next);
   })
   .post('/api/login',(req,res,next)=>{//登录
      userConrtoller.doLogin(req,res,next);
   })
   .get('/api/music/list',(req,res,next)=>{//音乐列表
      userConrtoller.getMusics(req,res,next);
   })
   .post('/api/music/upload',(req,res,next)=>{//上传音乐
      userConrtoller.uploadMusic(req,res,next);
   })
   .get('/api/music/:id',(req,res,next)=>{ //获取编辑ID
      userConrtoller.getMusic(req,res,next);
   })
   .put('/api/music/update',(req,res,next)=>{ //更新音乐
      userConrtoller.updateMusic(req,res,next);
   })
   .delete('/api/music/delete',(req,res,next)=>{ //删除音乐
      userConrtoller.deleteMusic(req,res,next);
   })
   .get('/public/getPic',(req,res,next)=>{//生成验证码
      userConrtoller.getPicture(req,res,next);
   })



//先给req.挂载user属性
server.use(function(req,res,next){
   //1：判断当前请求是否携带头信息mytoken
   if(req.headers.mytoken){
      //2：如果ok，将mytoken的值-> 毫秒值  作为key从global中取对象
      let currentUser = global[req.headers.mytoken];
      //3:给req.user 赋值以上对象
      req.user = currentUser;
   }
      next();//放行到路由中间件运行
});

//加入路由功能到中间件队列中
server.use(router);

//加入错误处理中间件
server.use(function (err,req,res,next) {
   console.log('出错啦',err.stack);
   next();//不要卡住
});


server.listen(12345, () => {
    console.log('服务器启动了')
});
