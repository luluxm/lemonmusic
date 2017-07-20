(function(angular) {

    angular.module('music.edit', [])
        .controller('editMusicController', ['$scope', '$http', 'host', '$state', function($scope, $http, host, $state) {
            //获取路由参数
            var id = $state.params.id;


            $http.get(host + '/api/music/' + id)
                .then(function(res) {
                    if (res.data.code === '001') {
                        $scope.music = res.data.music;
                    } else {
                        alert(res.data.msg);
                    }
                }, function(err) {
                    console.log(err);
                });


            //挂载保存函数
            $scope.doSave = function(data) {
                var fd = new FormData();
                fd.append('_id', $scope.music._id);
                //歌名
                fd.append('title', data.title);
                //时长
                fd.append('time', data.time);
                //歌手
                fd.append('singer', data.singer);
                // // angular.element  也可以使用angular.element(DOM)  jqlite对象功能不强大，还需要先获取到DOM元素
                // $('file') 更为简单
                // document.document.getElementById('file') //直接获取DOM元素也能操作
                fd.append('file', $('#file').get(0).files[0]);
                fd.append('filelrc', $('#filelrc').get(0).files[0]);


                //发起请求 fd就是数据
                $http.put(host + '/api/music/update', fd, {
                        headers: {
                            'content-type': undefined //针对包含文件上传 multipart/form-data
                        },
                        transformRequest: function(data) { //原样输出
                            return data;
                        }
                    })
                    .then(function(res) {
                        if (res.data.code === '001') {
                            $state.go('music.list');
                        } else {
                            alert(res.data.msg);
                        }
                    }, function(err) {
                        console.log(err);
                    })


            }

        }])

})(angular);
