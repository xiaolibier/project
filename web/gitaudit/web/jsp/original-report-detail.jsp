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
    <title>原始版稽查记录表详情</title>
    <%@include file="jspbase.jsp" %>
</head>
<body class="page-header-fixed">
    <%@include file="header.jsp" %>
    <div class="container-fluid">
        <div class="page-container">
            <ol class="breadcrumb">
                <li>稽查管理</li>
                <li>稽查记录表</li>
                <li class="active">原始版稽查记录表详情</li>
            </ol>
            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse">
                <form class="navbar-form navbar-right">
                    <button id="print" pid="PID_PRINT" class="btn btn-default">打印</button>
                </form>
            </div><!-- /.navbar-collapse -->
            <div>
                <div id="module-container"></div>
            </div>
        </div><%--page-container--%>
    </div><%--container-fluid--%>

    <script src="js/original-report-detail.js" type="text/javascript"></script>
</body>

</html>
