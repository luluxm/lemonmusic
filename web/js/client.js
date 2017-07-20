(function(angular) {
    //

    // 主模块
    angular.module('music', ['ngSanitize',
        'ui.router',
        'music.register', //注册
        'music.checkpwdDirective', //密码强度指令
        'music.login', //登录
        'music.httpFactory', //拦截器的具体操作
        'music.list', //音乐列表
        'music.scrollLrcDirective', //滚动歌词指令
        'music.footerDirective', //底部组件
        'music.headerDirective', //头部组件
        'music.userService', //操作用户数据
        'music.logout', //退出
        'music.add', //添加音乐
        'music.edit', //编辑音乐
    ]).
    config(['$httpProvider', function($httpProvider) {
            $httpProvider.defaults.headers.post = {
                'content-type': 'application/x-www-form-urlencoded'
            };
            $httpProvider.defaults.transformRequest = function(data) {
                var tmp = '';
                for (var key in data) {
                    tmp += key + '=' + data[key] + '&'
                }
                //去除&
                return tmp.substr(0, tmp.length - 1);
            };
            //配置每次请求，如果有自定义的头token，通过拦截器自动加入到请求头中
            $httpProvider.interceptors.push('httpFactory');

        }])
        .constant('host', 'http://192.168.131.59:12345')
        .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
            //默认进入login
            $urlRouterProvider.otherwise('login');
            $stateProvider.state('register', { //注册
                    url: '/register',
                    templateUrl: '../views/register.html',
                    controller: 'registerController',
                })
                .state('login', { //登录
                    url: '/login',
                    templateUrl: '../views/login.html',
                    controller: 'loginController',
                })
                .state('music', { //音乐父级路由
                    url: '/music',
                    templateUrl: '../views/music.html'
                })
                .state('music.list', { //音乐子集路由
                    url: '/list',
                    templateUrl: '../views/list.html',
                    controller: 'listController'
                })
                .state('logout', { //退出页面
                    url: '/logout',
                    templateUrl: '../views/logout.html',
                    controller: 'logoutController'
                })
                .state('music.add', { //添加音乐页面
                    url: '/add',
                    templateUrl: '../views/add.html',
                    controller: 'addMusicController'
                })
                .state('music.edit', { //编辑页面
                    url: '/edit?id',
                    templateUrl: '../views/edit.html',
                    controller: 'editMusicController'
                })

        }])
        .config(['$transitionsProvider', '$sceDelegateProvider', function($transitionsProvider, $sceDelegateProvider) {

            $sceDelegateProvider.resourceUrlWhitelist(['http://192.168.131.59:12345/myJsonp', 'self']);


            //配置当路由的改变开始
            //第一个参数对象有from 和to的属性设置
            $transitionsProvider.onStart({ to: 'music.**' }, function(s) {
                // var permissions = ['/list']
                //     // console.log(s.to());
                // if (permissions.indexOf(s.to().url) != -1) {
                //     //让你访问
                //     return true;
                // } else {
                //     //不让通行，取消当前锚点改变的行为
                //     return false;
                // }
                console.log(s.to().url);
                // 获取注入器
                var userService = s.injector().get('userService');
                return userService.hasPermissions(s.to().url);

            });
        }])

})(angular);
