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
    <title>稽查模块详情</title>
    <%@include file="jspbase.jsp" %>
</head>
<body class="page-header-fixed">
    <%@include file="header.jsp" %>
    <div class="container-fluid">
        <div class="page-container">
            <ol class="breadcrumb">
                <li>稽查管理</li>
                <li><a href="toTaskManager">稽查任务</a></li>
                <li><a href="toTaskDetail?id=${taskId}">稽查模块</a></li>
                <li class="active">稽查模块详情</li>
            </ol>
            <div id="task-module-detail">
                <div class="row">
                    <div class="col-md-12">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <div class="row">
                                    <div class="col-md-6">
                                        <span>稽查任务-</span>
                                        <span id="module-name"></span>
                                    </div>
                                    <div class="col-md-6 text-right">
                                        <span>记录编号</span>
                                        <span id="taskmodule-id"></span>
                                        <span>中心代码</span>
                                        <span id="taskmodule-centerId"></span>
                                        <a id="switch-to-horizon" href="javascript:void(0)">切换到横版模式</a>
                                        <a id="switch-to-vertical" href="javascript:void(0)">切换到竖版模式</a>
                                        <a id="back-task-detail" title="返回到模块列表页面" href="javascript:void(0)">返回</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div id="left-panel" class="col-md-8"><%--左侧模块记录--%>
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <span>记录</span>
                            </div>
                            <div class="panel-body">
                                <div id="module-record-container">
                                </div>
                            </div><%--pannel body--%>
                        </div><%--pannel--%>
                    </div><%--end 左侧模块记录--%>
                    <div id="right-panel" class="col-md-4"><%--右侧稽查发现--%>
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <div class="row">
                                    <div class="col-md-6">
                                        <span>稽查发现</span>
                                    </div>
                                    <div class="col-md-6 text-right">
                                        <span>参与人数：</span>
                                        <span id="task-member-count">0</span>
                                        <span>人</span>
                                    </div>
                                </div>
                            </div>
                            <div class="panel-body">
                                <div class="row">
                                    <div class="col-md-8">
                                        <ul id="discovery-nav" class="nav nav-pills" role="tablist">
                                            <li role="presentation" class="active" mode="only-mine" ><a href="javascript:void(0)">我的稽查发现</a></li>
                                            <li role="presentation" mode="all"><a href="javascript:void(0)">所有稽查发现</a></li>
                                        </ul>
                                    </div>
                                    <div class="col-md-4 text-right">
                                        <select id="discovery-orderby" class="form-control" style="width: 120px;">
                                            <option value="patientNo asc">受试者升序</option>
                                            <option value="patientNo desc">受试者降序</option>
                                            <option value="created asc">创建时间升序</option>
                                            <option value="created desc">创建时间降序</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="row"><%--稽查发现的工具条--%>
                                    <form class="navbar-form">
                                        <span class="form-group">
                                            <label class="control-label">分类</label>
                                            <select id="condition-category" class="form-control" style="width: 260px;">
                                            </select>
                                            <input id="condition-patientNo" type="text" placeholder="受试者编号/记录编号" class="form-control" style="width: 100px;">
                                            <button id="search-discovery" class="btn btn-default">搜索</button>
                                        </span>
                                    </form>
                                </div><%--end 稽查发现的工具条--%>
                                <%--<hr>--%>
                                <div id="discovery-container"><%--稽查发现记录--%>
                                </div>
                            </div>
                        </div>
                    </div><%--end 右侧稽查发现--%>
                </div>
            </div>
        </div>
    </div>
    <script src="js/template-util.js" type="text/javascript"></script>
    <script src="js/test.js" type="text/javascript"></script>
    <script src="js/discovery-manager.js" type="text/javascript"></script>
    <script src="js/task-module-detail.js" type="text/javascript"></script>
</body>
</html>
