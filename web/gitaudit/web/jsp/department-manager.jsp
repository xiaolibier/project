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
    <title>部门管理</title>
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
                <li role="presentation" class="active"><a href="javascript:void(0)">部门管理</a></li>
                <li role="presentation"><a href="toRoleManager">角色管理</a></li>
            </ul>
            <div class="margin-top-10">
                <ul id="department-container" class="list-group">
                </ul>
            </div>
        </div>
    </div>

    <script src="js/edit-department-dialog.js" type="text/javascript"></script>
    <script src="js/department-manager.js" type="text/javascript"></script>
</body>

</html>
