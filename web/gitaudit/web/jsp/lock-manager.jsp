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
    <title>资源锁管理</title>
    <%@include file="jspbase.jsp" %>
</head>
<body class="page-header-fixed">
    <div class="container-fluid">
        <div class="page-container">
            <div class="margin-top-10">
                <table class="table table-striped table-bordered table-hover dataTable">
                    <thead>
                    <tr>
                        <th>被锁资源id</th>
                        <th>用户Id</th>
                        <th>用户名称</th>
                        <th>资源类型</th>
                        <th>最后更新时间</th>
                        <th>Session</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody id="lock-container">
                    </tbody>
                </table>
            </div>
            <div class="margin-top-10">
                <table class="table table-striped table-bordered table-hover dataTable">
                    <thead>
                    <tr>
                        <th>登陆用户ID</th>
                        <th>登陆用户名称</th>
                        <th>IP</th>
                        <th>最后登陆时间</th>
                        <th>Session</th>
                        <th>Token</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody id="online-user-container">
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <script src="js/lock-manager.js" type="text/javascript"></script>
</body>

</html>
