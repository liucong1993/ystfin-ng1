/**
 * Created by 扬 on 2016/12/2.
 */
"use strict"

var app = require("../../ngcommon")

app.config(["$routeProvider",function($routeProvider){
    $routeProvider.when("/pay/order/query",{
        controller:"queryOrderController",
        template:require("./html/order/query.html")
    })
}])

app.controller("queryOrderController",["$scope","TransRecord","Order","$location","$routeParams",function ($scope,TransRecord,Order,$location,$routeParams) {
    $scope.filter = {"orderNo":$routeParams.orderNo};
    $scope.accountId = $routeParams.accountId;
    $scope.balance = $routeParams.balance;
    $scope.tableColumns = [
        {title:"订单号",template:"{{row.orderNo}}", width:20,thClass:"text-center",tdClass:"text-center"},
        {title:"金额",template:"{{row.amount/100 | currency:'￥'}}",thClass:"text-right",tdClass:"text-right", width:20},
        {title:"状态",template:"<ng-convert code='order_status' value='{{row.status}}' ></ng-convert>",width:20,thClass:"text-center",tdClass:"text-center"},
        {title:"创建时间",template:"{{row.createTime | date:'yyyy-MM-dd HH:mm:ss'}}",width:20,thClass:"text-center",tdClass:"text-center"},
        {title:"",template:"<a href='/ng#/pay/order/{{row.id}}/pay'>{{row.status==\"01\"?'收款':'查看'}}</a>",width:20}
    ]
    $scope.rowClass = function (row) {
        switch(row.status){
            case "01":return "warning"
            case "02":return "success"
            default: return "danger"
        }
    }

}])