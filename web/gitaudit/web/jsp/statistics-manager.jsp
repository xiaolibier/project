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
    <title>报表统计</title>
    <%@include file="jspbase.jsp" %>
</head>
<body class="page-header-fixed">
    <%@include file="header.jsp" %>
    <div class="container-fluid">
        <div class="page-container">
            <ol class="breadcrumb">
                <li>系统管理</li>
                <li class="active">报表统计</li>
            </ol>
            <div class="row">
                <div class="col-md-12">
                    <ul id="report-nav" class="nav nav-pills" role="tablist">
                        <li role="presentation" report="member-report"><a href="javascript:void(0)">项目成员详细报表</a></li>
                        <li role="presentation" report="checker-report"><a href="javascript:void(0)">评审员详细报表</a></li>
                    </ul>
                </div>
            </div>
            <form class="navbar-form navbar-right" onkeydown="if(event.keyCode==13)return false;" >
                <div class="form-group margin-right-20">
                    <label class="control-label">日期</label>
                    <div class="input-group date date-picker">
                        <input id="dateFrom" type="text" size="16" class="form-control">
                        <span class="input-group-btn">
                            <button class="btn default date-set" type="button">
                                <i class="fa fa-calendar"></i>
                            </button>
                        </span>
                    </div>
                    -
                    <div class="input-group date date-picker">
                        <input id="dateTo" type="text" size="16" class="form-control">
                        <span class="input-group-btn">
                            <button class="btn default date-set" type="button">
                                <i class="fa fa-calendar"></i>
                            </button>
                        </span>
                    </div>
                </div>
                <button id="search" class="btn btn-default">搜索</button>
            </form>
            <div id="member-report" report="member-report" class="report margin-top-10">
                <table tableId="MemberReport" class="table table-striped table-bordered table-hover dataTable">
                    <thead>
                    <tr>
                        <th merge="true">稽查项目编号</th>
                        <th merge="true">稽查项目</th>
                        <th merge="true">项目经理</th>
                        <th>稽查中心</th>
                        <th>项目阶段</th>
                        <th>稽查组长</th>
                        <th>稽查员</th>
                        <th>稽查开始日期</th>
                        <th>稽查结束日期</th>
                        <th>初稿计划递交日期</th>
                        <th>初稿实际递交日期</th>
                        <th>初稿递交时长</th>
                        <th>内审批返日期</th>
                        <th>计划递交商务日期</th>
                        <th>实际递交商务日期</th>
                        <th>递交商务时长</th>
                    </tr>
                    </thead>
                    <tbody id="member-report-container">
                    </tbody>
                </table>
            </div>
            <div id="checker-report" report="checker-report" class="report margin-top-10">
                <table tableId="CheckerReport" class="table table-striped table-bordered table-hover dataTable">
                    <thead>
                    <tr>
                        <th>序号</th>
                        <th>用户</th>
                        <th>项目名称</th>
                        <th>中心名称</th>
                        <th>项目阶段</th>
                        <th>提交审阅时间</th>
                        <th>审阅完成时间</th>
                        <th>工作时间</th>
                        <th>超时时间</th>
                        <th>类别</th>
                    </tr>
                    </thead>
                    <tbody id="checker-report-container">
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <script src="js/statistics-manager.js" type="text/javascript"></script>
</body>

</html>
