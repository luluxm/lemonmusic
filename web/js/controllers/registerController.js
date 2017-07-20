(function(angular) {
    angular.module('music.register', [])
        .controller('registerController', ['$scope', '$http', 'host', '$state', function($scope, $http, host, $state) {

            $http.jsonp(host + '/myJsonp?callback=JSON_CALLBACK')
                .then(function(res) {
                    console.log(res);
                }, function(err) {
                    console.log(err);
                })


            //挂载onblur 事件的函数
            $scope.checkUsername = function(uname) {






                //判断是否为空
                if (!uname || uname.trim() === '') return;

                $http.post(host + '/api/check/username', {
                            username: uname
                        }
                        //不可能一个请求设置一次，多次很麻烦，在client.js中做了统一默认的设置
                        //,
                        // {    
                        //     //设置头
                        //     headers: {
                        //         'content-type': 'application/x-www-form-urlencoded'
                        //     },
                        //     transformRequest: function(data) {
                        //             var tmp = '';
                        //             for (var key in data) {
                        //                 tmp += key + '=' + data[key] + '&'
                        //             }
                        //             //去除&
                        //             return tmp.substr(0, tmp.length - 1);
                        //         }
                        //         //转换数据
                        // }

                    )
                    .then(function(res) {
                        if (res.data.code === '001') {
                            //成功
                            $scope.msg = res.data.msg; //挂载显示信息
                        } else {
                            $scope.msg = res.data.msg; //挂载显示信息
                        }
                    }, function(err) {
                        console.log(err);
                    });
            }

            //挂载注册提交的函数
            $scope.doRegister = function() {
                $http.post(host + '/api/register', $scope.data)
                    .then(function(res) {
                        if (res.data.code === '001') {
                            //成功页面跳转
                            $state.go('login');
                        } else {
                            //清空所有的数据 $scope.data = {};
                            $scope.data = {};
                            //如果不成功，给予提示，继续注册
                            alert(res.data.msg)
                        }


                    }, function(err) {
                        console.log(err);
                    })
            }

        }])
})(angular);
