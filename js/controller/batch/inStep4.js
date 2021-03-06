/**
 * Created by peter on 2017/1/20.
 */
"use strict";
var app = require("../../ngcommon");

app.config(["$routeProvider",function($routeProvider){
    $routeProvider.when("/batch/in/step4",{
        controller:"batchStep4Controller",
        template:require("./html/in/step4.html")
    });
}]);

app.controller("batchStep4Controller",["$scope","$rootScope","$http","$location","batchInStep","$templateCache","$webcam","Upload",function ($scope,$rootScope,$http,$location,Step,$tpc,$webcam,Upload) {
    // 获取后台缓存数据
    Step.get({step:"step4"},function (step4,header) {
        $scope.imgs= step4.images
    })
    //摄像头
    $webcam.show("280px","160px")
    $webcam.setRangeType(0)
    //相册
    $scope.imgs = []
    $scope.myInterval = 0
    $scope.noWrapSlides = false
    $scope.active = 0
    $scope.goto = function (index) {
        $scope.active = index
    }
    $scope.nextImg = function () {
        if($scope.active >= $scope.imgs.length - 1){
            return
        }
        $scope.active++
    }
    $scope.prevImg = function () {
        if($scope.active <= 0){
            return
        }
        $scope.active--
    }
    //删除当前图片
    $scope.remove = function (index) {
        if(index){
            index--
        }
        else{
            index = $scope.active
        }
        $scope.imgs.splice(index,1)
        if($scope.active >= $scope.imgs.length - 1 && $scope.active > 0) $scope.active--
    }
    //显示图片
    $scope.imgSrc = function (path) {
        return "/common/download/temp?file=" + path
    }
    //拍照
    $scope.snapshot = function () {
        $webcam.upload(function (success,filename) {
            $scope.$apply(function(){
                if(success){
                    $scope.imgs.push(filename)
                    setTimeout(function(){
                        $scope.$apply(function(){
                            $scope.active = $scope.imgs.length-1
                        })
                    },500)
                }
            })
        })
    }
    //上传
    $scope.upload = function($file){
        Upload.upload({
            url:"/common/upload/single",
            file:$file
        }).then(function (ret) {
                $scope.imgs.push(ret.data)
                setTimeout(function(){
                    $scope.$apply(function(){
                        $scope.active = $scope.imgs.length-1
                    })
                },500)
            },
            function (err) {
                console.log(err)
            },
            function (evt) {
                console.log(evt)
            }
        )
    }
    //下一步
    $scope.next = function () {
        $scope.submiting = true
        var step = new Step({images:$scope.imgs})
        step.$save({step:"finally"}).then(function(result){
            $scope.submiting = false
            $location.path("/batch/in/complate/123456789");
            window.scrollTo(0,0)
        },function (err) {
            $scope.submiting = false
            $rootScope.viewMask = false
        })
    }
    //返回上一步
    $scope.prev = function () {
        var step = new Step({images:$scope.imgs})
        step.$save({step:"step4"})
        $location.path("/batch/in/step3")
        window.scrollTo(0,0)
    }

}]);