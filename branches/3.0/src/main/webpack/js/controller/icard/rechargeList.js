/**
 * Created by 10973 on 2017/6/2.
 */
/**
 * Created by 10973 on 2017/6/1.
 */

"use strict"
var app = require("../../ngcommon")
var $ = require("jquery")

app.config(["$routeProvider",function($routeProvider){
    $routeProvider.when('/icard/rechargelist',{
        template:require("./html/rechargeList.html"),
        controller:"rechargeList"
    })
}]);
app.controller("rechargeList", ["$scope","$convert","$q","$filter","$location","$routeParams","$http" ,function ($scope,$convert,$q,$filter,$location,$routeParams,$http) {
    //页面跳转
    $scope.jump=function(path){
        $location.path(path);
    };
    //从后台获取商户
    $scope.shanghu=function(){
        //bill /getDealers
        $http.get('bill/getDealers').success(function(data){
            console.log("获取商户信息");
            $scope.merchant=data;
            console.log(data);
        })
    };
    $scope.shanghu();

    //点击查询获取后台数据
$scope.searchdate=function(){
    if($scope.cardTime&&$scope.cardTimeEnd){
        $scope.month=$filter('date')($scope.cardTime,'yyyy-MM-dd');//成交起始日期
        $scope.monthEnd=$filter('date')($scope.cardTimeEnd,'yyyy-MM-dd');//成交起始日期
        $http({
            method:'POST',
            url:'/bill/account',
            params:{startDate:$scope.month,endDate:$scope.monthEnd,name:$scope.company},
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(function(data){
            console.log(data);
            $scope.cardData=data;
        })
    }else if($scope.cardTime==null&&$scope.cardTimeEnd){
        alert("请选择开始时间");
    }else if($scope.cardTime&&$scope.cardTimeEnd==null){
        alert("请选择截止日期");
    }else{
        alert("请选择日期");
    }
};
    //导出excel表
    $scope.exportOrder = function () {
        $scope.month=$filter('date')($scope.cardTime,'yyyy-MM-dd');//成交起始日期
        $scope.monthEnd=$filter('date')($scope.cardTimeEnd,'yyyy-MM-dd');//成交起始日期
        $http({
            url: 'bill/export/account',
            method: "POST",
            params:{startDate:$scope.month,endDate:$scope.monthEnd,name:$scope.company},
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            responseType: 'arraybuffer'
        }).success(function (data) {
            var blob = new Blob([data], {type: "application/vnd.ms-excel"});
            var objectUrl = URL.createObjectURL(blob);
            var filename="武汉爱之家长丰旧机动车交易市场充值报表"+'.xls';
            if (window.navigator.msSaveOrOpenBlob) {// For IE:
                navigator.msSaveBlob(blob, filename);
            }else{ // For other browsers:
                URL.revokeObjectURL(objectUrl);
            }
        }).error(function(data){
            alert(data.message);
        });
    };
}]);