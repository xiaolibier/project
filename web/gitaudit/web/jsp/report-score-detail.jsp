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
    <title>研究中心评价表详情</title>
    <%@include file="jspbase.jsp" %>

    <link href="thirdparty/bootstrap-star-rating/css/star-rating.css" media="all" rel="stylesheet" type="text/css" />
    <script src="thirdparty/bootstrap-star-rating/js/star-rating.js" type="text/javascript"></script>
</head>
<body class="page-header-fixed">
    <%@include file="header.jsp" %>
    <div class="container-fluid">
        <div class="page-container">
            <ol class="breadcrumb">
                <li>稽查管理</li>
                <li>研究中心评价表</li>
                <li class="active">研究中心评价表详情</li>
            </ol>
            <form class="navbar-form navbar-right">
                <button id="submit" pid="EDIT_REPORT_SCORE" class="btn btn-default">提交</button>
                <button id="save" pid="EDIT_REPORT_SCORE" class="btn btn-default">保存</button>
            </form>
            <div class="row">
                <H1 class="text-center">评价总分<span id="score">0</span></H1>
            </div>
            <div class="margin-top-10">
                <table tableId="ReportScoreDetail" class="table table-striped table-bordered table-hover dataTable">
                    <tbody id="score-container">
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <script src="js/report-score-detail.js" type="text/javascript"></script>
</body>

</html>
