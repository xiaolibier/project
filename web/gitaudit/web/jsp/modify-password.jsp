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
    <title>修改密码</title>
    <%@include file="jspbase.jsp" %>
</head>
<body class="page-header-fixed">
    <div class="container-fluid">
        <div class="page-container">
            <ol class="breadcrumb">
                <li class="active">修改密码</li>
            </ol>
            <form class="form-horizontal" role="form">
                <div class="form-group">
                    <label class="col-sm-2 control-label">旧密码</label>
                    <div class="col-sm-4">
                        <input id="old-pw" type="password" class="form-control" placeholder="">
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">新密码</label>
                    <div class="col-sm-4">
                        <input id="new-pw" type="password" class="form-control" placeholder="">
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">新密码校验</label>
                    <div class="col-sm-4">
                        <input id="new-pw2" type="password" class="form-control" placeholder="">
                    </div>
                </div>
                <div class="form-group">
                    <button id="submit" class="btn btn-default">提交</button>
                </div>
            </form>
        </div>
    </div>
    <script src="thirdparty/md5/md5.min.js" type="text/javascript"></script>
    <script src="js/modify-password.js" type="text/javascript"></script>
</body>

</html>
