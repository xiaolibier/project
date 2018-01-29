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
    <title>分类管理</title>
    <%@include file="jspbase.jsp" %>
</head>
<body class="page-header-fixed">
    <%@include file="header.jsp" %>
    <div class="container-fluid">
        <div class="page-container">
            <ol class="breadcrumb">
                <li>系统管理</li>
                <li class="active">稽查基础数据管理</li>
            </ol>
            <ul class="nav nav-pills" role="tablist">
                <li role="presentation" class="active"><a href="javascript:void(0)">分类管理</a></li>
                <li role="presentation"><a href="toProblemManager">问题归类管理</a></li>
                <li role="presentation"><a href="toReferenceManager">依据管理</a></li>
                <li role="presentation"><a href="toDataTemplateManager?type=Project">目的范围依据</a></li>
                <li role="presentation"><a href="toDataTemplateManager?type=CenterReport">单中心报告稽查概述</a></li>
                <li role="presentation"><a href="toDataTemplateManager?type=StageReport">项目阶段报告稽查概述</a></li>
                <li role="presentation"><a href="toDataTemplateManager?type=Company">公司基本信息</a></li>
            </ul>
            <div id="list-page">
                <form class="navbar-form navbar-left" onkeydown="if(event.keyCode==13)return false;" >
                    <div class="form-group margin-right-20">
                        <label class="control-label">所属模块</label>
                        <select id="condition-module" class="form-control" style="width: 200px;">
                            <option value="-">所有模块</option>
                        </select>
                    </div>
                    <div class="form-group margin-right-20">
                        <input id="keywords" type="text" class="form-control" placeholder="输入搜索关键字">
                    </div>
                    <button id="search" class="btn btn-default">搜索</button>
                </form>
                <form class="navbar-form navbar-right" onkeydown="if(event.keyCode==13)return false;" >
                    <button id="add" class="btn btn-default">新增分类</button>
                </form>
                <div class="margin-top-10">
                    <table class="table table-striped table-bordered table-hover dataTable">
                        <thead>
                        <tr>
                            <th>模块</th>
                            <th>模块ID</th>
                            <th>分类</th>
                            <th>分类ID</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody id="category-container">
                        </tbody>
                    </table>
                    <div id="pagination"></div>
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
                        <label class="col-sm-2 control-label">分类ID</label>
                        <div class="col-sm-4">
                            <input id="category-id" type="text" class="form-control" placeholder="">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">所属模块</label>
                        <div class="col-sm-4">
                            <select id="category-moduleId" class="form-control">
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">分类名称</label>
                        <div class="col-sm-4">
                            <input id="category-name" type="text" class="form-control" placeholder="">
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <script src="js/data-structure.js" type="text/javascript"></script>
    <%--<script src="js/test.js" type="text/javascript"></script>--%>
    <script src="js/category-manager.js" type="text/javascript"></script>
</body>

</html>
