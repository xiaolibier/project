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
    <title>修改记录管理</title>
    <%@include file="jspbase.jsp" %>
</head>
<body class="page-header-fixed">
    <%@include file="header.jsp" %>
    <div class="container-fluid">
        <div class="page-container">
            <ol class="breadcrumb">
                <li>稽查管理</li>
                <c:if test="${object == 'Task'}">
                    <li>稽查任务</li>
                    <li class="active">稽查模块修改记录</li>
                </c:if>
                <c:if test="${object == 'CenterReport'}">
                    <li>单中心稽查报告</li>
                    <li class="active">修改记录</li>
                </c:if>
            </ol>
            <form class="navbar-form navbar-left">
                <div class="form-group margin-right-20">
                    <label class="control-label">操作</label>
                    <select id="operation" class="form-control" style="width: 120px;">
                        <option value="-1">全部</option>
                        <option value="0">新增</option>
                        <option value="1">修改</option>
                        <option value="2">删除</option>
                        <c:if test="${object == 'CenterReport'}">
                            <option value="3">建议已处理</option>
                            <option value="4">分级已处理</option>
                        </c:if>
                    </select>
                </div>
                <div class="form-group margin-right-20">
                    <label class="control-label">位置</label>
                    <select id="target" class="form-control" style="width: 200px;">
                        <option value="">全部</option>
                    </select>
                </div>
                <div class="form-group margin-right-20">
                    <label class="control-label">稽查发现分类</label>
                    <select id="category" class="form-control" style="width: 260px;">
                        <option value="">全部</option>
                    </select>
                </div>
                <div class="form-group margin-right-20">
                    <label class="control-label">日期</label>
                    <div class="input-group date date-picker">
                        <input id="createdFrom" type="text" size="16" class="form-control">
                        <span class="input-group-btn">
                            <button class="btn default date-set" type="button">
                                <i class="fa fa-calendar"></i>
                            </button>
                        </span>
                    </div>
                    -
                    <div class="input-group date date-picker">
                        <input id="createdTo" type="text" size="16" class="form-control">
                        <span class="input-group-btn">
                            <button class="btn default date-set" type="button">
                                <i class="fa fa-calendar"></i>
                            </button>
                        </span>
                    </div>
                </div>
            </form>
            <form class="navbar-form navbar-right" onkeydown="if(event.keyCode==13)return false;" >
                <div class="form-group">
                    <input id="keywords" type="text" class="form-control" placeholder="输入搜索关键字">
                </div>
                <button id="search" class="btn btn-default">搜索</button>
            </form>
            <div class="margin-top-10">
                <table tableId="ModifyRecordManager" class="table table-striped table-bordered table-hover dataTable">
                    <thead>
                    <tr>
                        <th>序号</th>
                        <th>项目编号</th>
                        <th>项目名称</th>
                        <th>项目阶段</th>
                        <th>中心名称</th>
                        <th>内容编号</th>
                        <th>受试者编号</th>
                        <th>操作</th>
                        <th>修改位置</th>
                        <th>原信息</th>
                        <th>修改后信息</th>
                        <th>修改人</th>
                        <th>修改时间</th>
                    </tr>
                    </thead>
                    <tbody id="modifyRecord-container">
                    </tbody>
                </table>
                <div id="pagination"></div>
            </div>
        </div>
    </div>

    <script src="js/modify-record-manager.js" type="text/javascript"></script>
</body>

</html>
