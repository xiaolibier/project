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
    <title>用户管理</title>
    <%@include file="jspbase.jsp" %>
</head>
<body class="page-header-fixed">
    <%@include file="header.jsp" %>
    <div class="container-fluid">
        <div class="page-container">
            <ol class="breadcrumb">
                <li>系统管理</li>
                <li class="active">用户管理</li>
            </ol>
            <ul class="nav nav-pills" role="tablist">
                <li role="presentation" class="active"><a href="javascript:void(0)">用户管理</a></li>
                <li role="presentation"><a href="toDepartmentManager">部门管理</a></li>
                <li role="presentation"><a href="toRoleManager">角色管理</a></li>
            </ul>
            <div id="list-page">
                <form class="navbar-form navbar-left" onkeydown="if(event.keyCode==13)return false;" >
                    <div class="form-group margin-right-20">
                        <input id="keywords" type="text" class="form-control" placeholder="输入搜索关键字">
                    </div>
                    <button id="search" class="btn btn-default">搜索</button>
                </form>
                <form class="navbar-form navbar-right" onkeydown="if(event.keyCode==13)return false;" >
                    <button id="add" class="btn btn-default">新增用户</button>
                </form>
                <div class="margin-top-10">
                    <table class="table table-striped table-bordered table-hover dataTable">
                        <thead>
                        <tr>
                            <th>编号</th>
                            <th>姓名</th>
                            <th>状态</th>
                            <th>所属部门</th>
                            <th>所属角色</th>
                            <th>联系方式</th>
                            <th>负责项目数</th>
                            <th>负责中心数</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody id="user-container">
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
                        <label class="col-sm-2 control-label">用户编号</label>
                        <div class="col-sm-4">
                            <input id="user-id" type="text" class="form-control" placeholder="">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">用户名称</label>
                        <div class="col-sm-4">
                            <input id="user-name" type="text" class="form-control" placeholder="">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">所属部门</label>
                        <div class="col-sm-4">
                            <select id="user-departmentId" class="form-control"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">所属角色</label>
                        <div class="col-sm-4">
                            <select id="user-roleIds" class="form-control" multiple></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">联系方式</label>
                        <div class="col-sm-4">
                            <input id="user-contact" type="text" class="form-control" placeholder="">
                        </div>
                    </div>
                </form>
                <div id="user-projects" class="margin-top-10">
                    <H3>负责项目</H3>
                    <table class="table table-striped table-bordered table-hover dataTable">
                        <thead>
                            <tr>
                                <th>项目编号</th>
                                <th>项目名称</th>
                                <th>项目状态</th>
                                <th>创建日期</th>
                                <th>负责状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody id="project-container">
                        </tbody>
                    </table>
                </div>
                <div id="user-centers" class="margin-top-10">
                    <H3>负责中心</H3>
                    <table class="table table-striped table-bordered table-hover dataTable">
                        <thead>
                            <tr>
                                <th>项目编号</th>
                                <th>中心名称</th>
                                <th>项目名称</th>
                                <th>项目阶段</th>
                                <th>创建日期</th>
                                <th>负责状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody id="center-container">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <script src="js/data-structure.js" type="text/javascript"></script>
    <script src="js/test.js" type="text/javascript"></script>
    <script src="js/handover-dialog.js" type="text/javascript"></script>
    <script src="js/user-manager.js" type="text/javascript"></script>
</body>

</html>
