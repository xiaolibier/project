<%--
  Created by IntelliJ IDEA.
  User: zhouhaibin
  Date: 2016/9/19
  Time: 13:16
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!--[if IE 8]> <html lang="en" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9 no-js"> <![endif]-->
<html lang="en" class="no-js">
<head>
    <title>中心管理</title>
    <%@include file="jspbase.jsp" %>
</head>
<body class="page-header-fixed">
    <%@include file="header.jsp" %>
    <div class="container-fluid">
        <div class="page-container">
            <ol class="breadcrumb">
                <li>系统管理</li>
                <li class="active">中心管理</li>
            </ol>
            <div id="list-page">
                <form class="navbar-form navbar-left" onkeydown="if(event.keyCode==13)return false;" >
                    <div class="form-group margin-right-20">
                        <label class="control-label">省</label>
                        <select id="condition-province" class="form-control" style="width: 200px;"></select>
                    </div>
                    <div class="form-group margin-right-20">
                        <label class="control-label">市</label>
                        <select id="condition-city" class="form-control" style="width: 200px;"></select>
                    </div>
                    <div class="form-group margin-right-20">
                        <label class="control-label">区县</label>
                        <select id="condition-town" class="form-control" style="width: 200px;"></select>
                    </div>
                    <div class="form-group margin-right-20">
                        <input id="keywords" type="text" class="form-control" placeholder="输入搜索关键字">
                    </div>
                    <button id="search" class="btn btn-default">搜索</button>
                </form>
                <form class="navbar-form navbar-right" onkeydown="if(event.keyCode==13)return false;" >
                    <button id="add" class="btn btn-default">新增中心</button>
                </form>
                <div class="margin-top-10">
                    <table tableId="CenterManager" class="table table-striped table-bordered table-hover dataTable">
                        <thead>
                        <tr>
                            <th>医院名称</th>
                            <th>机构代码</th>
                            <th>医院网站</th>
                            <th>医院地址</th>
                            <th>机构类型</th>
                            <th>证书编号</th>
                            <th>科室</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody id="center-container">
                        </tbody>
                    </table>
                    <div id="pagination"></div>
                </div>
            </div>
            <div id="edit-page">
                <form class="form-horizontal" role="form">
                    <div class="form-group text-right">
                        <button id="back" class="btn btn-default">返回</button>
                        <button id="cancel" class="btn btn-default">取消</button>
                        <button id="save" class="btn btn-default">保存</button>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">机构代码</label>
                        <div class="col-sm-10">
                            <input id="center-id" type="text" class="form-control" placeholder="">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">医院名称</label>
                        <div class="col-sm-10">
                            <input id="center-name" type="text" class="form-control" placeholder="">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">机构类型</label>
                        <div class="col-sm-2">
                            <select id="center-type" class="form-control">
                                <option value="医院">医院</option>
                                <option value="公司">公司</option>
                                <option value="院校">院校</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">省/自治区/直辖市</label>
                        <div class="col-sm-2">
                            <select id="center-province" class="form-control"></select>
                        </div>
                        <label class="col-sm-2 control-label">市</label>
                        <div class="col-sm-2">
                            <select id="center-city" class="form-control"></select>
                        </div>
                        <label class="col-sm-2 control-label">区县</label>
                        <div class="col-sm-2">
                            <select id="center-town" class="form-control"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">医院网站</label>
                        <div class="col-sm-10">
                            <input id="center-website" type="text" class="form-control" placeholder="">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">医院地址</label>
                        <div class="col-sm-10">
                            <input id="center-address" type="text" class="form-control" placeholder="">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">联系方式</label>
                        <div class="col-sm-10">
                            <input id="center-contact" type="text" class="form-control" placeholder="">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">科室</label>
                        <div class="col-sm-10">
                            <input id="center-department" type="text" class="form-control" placeholder="">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">证书</label>
                        <div class="col-sm-10">
                            <input id="center-certificate" type="text" class="form-control" placeholder="">
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <script src="js/data-structure.js" type="text/javascript"></script>
    <script src="js/test.js" type="text/javascript"></script>
    <script src="js/center-manager.js" type="text/javascript"></script>
</body>

</html>
