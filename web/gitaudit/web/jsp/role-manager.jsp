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
    <title>角色管理</title>
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
                <li role="presentation"><a href="toUserManager">用户管理</a></li>
                <li role="presentation"><a href="toDepartmentManager">部门管理</a></li>
                <li role="presentation" class="active"><a href="javascript:void(0)">角色管理</a></li>
            </ul>
            <div id="list-page">
                <form class="navbar-form navbar-right" onkeydown="if(event.keyCode==13)return false;" >
                    <button id="add" class="btn btn-default">新增角色</button>
                </form>
                <div class="margin-top-10">
                    <table class="table table-striped table-bordered table-hover dataTable">
                        <thead>
                        <tr>
                            <th>角色编号</th>
                            <th>角色名称</th>
                            <th>状态</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody id="role-container">
                        </tbody>
                    </table>
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
                        <label class="col-sm-2 control-label">角色编号</label>
                        <div class="col-sm-4">
                            <input id="role-id" type="text" class="form-control" placeholder="">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">角色名称</label>
                        <div class="col-sm-4">
                            <input id="role-name" type="text" class="form-control" placeholder="">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">角色权限</label>
                        <div class="col-sm-4">
                            <select id="role-privilegeIds" class="form-control" multiple>
                            </select>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <script src="js/data-structure.js" type="text/javascript"></script>
    <script src="js/test.js" type="text/javascript"></script>
    <script src="js/role-manager.js" type="text/javascript"></script>
</body>

</html>
