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
    <title>未入报告稽查发现</title>
    <%@include file="jspbase.jsp" %>
</head>
<body class="page-header-fixed">
    <%@include file="header.jsp" %>
    <div class="container-fluid">
        <div class="page-container">
            <ol class="breadcrumb">
                <li>稽查管理</li>
                <li>单中心稽查报告</li>
                <li class="active">未入稽查报告稽查发现</li>
            </ol>
            <div id="discovery-container">
            </div>
        </div>
    </div>

    <script src="js/template-util.js" type="text/javascript"></script>
    <script src="js/edit-discovery-dialog.js" type="text/javascript"></script>
    <script src="js/discovery-list.js" type="text/javascript"></script>
</body>

</html>
