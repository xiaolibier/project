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
    <title>项目管理</title>
    <%@include file="jspbase.jsp" %>
</head>
<!-- BEGIN BODY -->
<body class="page-header-fixed">
    <%@include file="header.jsp" %>
    <div class="container-fluid">
        <div class="page-container">
            <ol class="breadcrumb">
                <li class="active">项目管理</li>
            </ol>
            <div id="project-manager-page">
                <div class="row">
                    <div class="col-md-6 col-sm-12">
                        <div class="input-group input-medium">
                            <input id="keywords" type="text" placeholder="输入相关信息进行检索" class="form-control">
                            <span id="search" class="input-group-addon">
                                <i class="fa fa-search"></i>
                            </span>
                        </div>
                    </div>
                    <div class="col-md-6 col-sm-12 text-right">
                        <button id="add" pid="ADD_PROJECT" class="btn default" type="button">新建项目</button>
                    </div>
                </div>
                <div class="margin-top-10">
                    <table tableId="ProjectManager" class="table table-striped table-bordered table-hover dataTable">
                        <thead>
                        <tr>
                            <th>项目编号</th>
                            <th>项目名称</th>
                            <th>项目阶段</th>
                            <th>项目状态</th>
                            <th>项目经理</th>
                            <th>创建日期</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody id="project-container">
                        </tbody>
                    </table>
                    <div id="pagination"></div>
                </div>
            </div>
            <div id="add-project-page">
                <div class="row">
                    <div class="col-md-6 col-sm-12">
                        <span>新建项目</span>
                    </div>
                    <div class="col-md-6 col-sm-12 text-right">
                        <ul id="add-project-page-nav" class="nav nav-pills" role="tablist">
                            <li role="presentation" class="active" page="1"><a href="javascript:void(0)" style="cursor: default;"><span class="badge">1</span> 项目基本信息</a></li>
                            <li role="presentation" page="2"><a href="javascript:void(0)" style="cursor: default;"><span class="badge">2</span> 目的范围依据</a></li>
                            <li role="presentation" page="3"><a href="javascript:void(0)" style="cursor: default;"><span class="badge">3</span> 项目设置</a></li>
                        </ul>
                    </div>
                </div>
                <hr>
                <div class="row">
                    <div class="col-md-10 col-md-offset-1 project-property-page" page="1">
                        <form class="form-horizontal" role="form" onkeydown="if(event.keyCode==13)return false;">
                            <div class="row">
                                <div class="col-md-8 col-sm-12">
                                    <div class="form-group">
                                        <label class="col-sm-3 control-label">委托方</label>
                                        <div class="col-sm-9">
                                            <input id="project-principal" type="text" class="form-control" placeholder="">
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4 col-sm-12">
                                    <div class="form-group">
                                        <label class="col-sm-6 control-label">项目编号</label>
                                        <div class="col-sm-6">
                                            <input id="project-id" type="text" class="form-control" placeholder="">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">项目名称</label>
                                <div class="col-sm-10">
                                    <input id="project-name" type="text" class="form-control" placeholder="">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">项目经理</label>
                                <div class="col-sm-2">
                                    <select id="project-leaderId" class="form-control">
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">稽查类型</label>
                                <div class="col-sm-2">
                                    <select id="project-auditType" class="form-control">
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">项目简介</label>
                                <div class="col-sm-10">
                                    <textarea id="project-description" class="form-control"></textarea>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">题目</label>
                                <div class="col-sm-10">
                                    <input id="project-title" type="text" class="form-control" placeholder="">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4 col-sm-12">
                                    <div class="form-group">
                                        <label class="col-sm-6 control-label">受托方</label>
                                        <div class="col-sm-6">
                                            <input id="project-assignee" type="text" class="form-control" readonly>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4 col-sm-12">
                                    <div class="form-group">
                                        <label class="col-sm-6 control-label">地址</label>
                                        <div class="col-sm-6">
                                            <input id="project-address" type="text" class="form-control" readonly>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4 col-sm-12">
                                    <div class="form-group">
                                        <label class="col-sm-6 control-label">联系方式</label>
                                        <div class="col-sm-6">
                                            <input id="project-telephone" type="text" class="form-control" readonly>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4 col-sm-12">
                                    <div class="form-group">
                                        <label class="col-sm-6 control-label">手机</label>
                                        <div class="col-sm-6">
                                            <input id="project-mobilephone" type="text" class="form-control" readonly>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4 col-sm-12">
                                    <div class="form-group">
                                        <label class="col-sm-6 control-label">微信公众号</label>
                                        <div class="col-sm-6">
                                            <input id="project-wechat" type="text" class="form-control" readonly>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4 col-sm-12">
                                    <div class="form-group">
                                        <label class="col-sm-6 control-label">网址</label>
                                        <div class="col-sm-6">
                                            <input id="project-url" type="text" class="form-control" readonly>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12 col-sm-12">
                                    <div class="form-group">
                                        <label class="col-sm-2 control-label">药物名称</label>
                                        <div class="col-sm-10">
                                            <input id="project-medicine" type="text" class="form-control">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="col-sm-2 control-label">适应症</label>
                                        <div class="col-sm-10">
                                            <input id="project-disease" type="text" class="form-control">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="col-sm-2 control-label">注册分类</label>
                                        <div class="col-sm-10">
                                            <input id="project-registerCategory" type="text" class="form-control">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <hr>
                        <div id="project-center" class="center-selection">
                            <div class="row">
                                <span>请选择本项目需要参与的中心</span>
                            </div>
                            <div class="row">
                                <ul class="center-filter nav nav-pills">
                                </ul>
                            </div>
                            <div>
                                <form class="navbar-form navbar-left search-center" onkeydown="if(event.keyCode==13)return false;" >
                                    <div class="form-group margin-right-20">
                                        <input type="text" placeholder="输入相关信息进行检索" class="form-control search-center-keywords">
                                    </div>
                                    <button class="btn btn-default search-center-button">搜索</button>
                                </form>
                                <form class="navbar-form navbar-right" onkeydown="if(event.keyCode==13)return false;" >
                                    <span>已选中心</span>
                                    <span class="selected-center-count">0</span>
                                    <span>个</span>
                                </form>
                            </div>
                            <div class="row">
                                <table tableId="ProjectCenterInProjectDetail" class="center-table table table-striped table-bordered table-hover dataTable">
                                    <thead>
                                    <th><input type="checkbox"></th>
                                    <th>中心编号</th>
                                    <th>中心名称</th>
                                    <th>机构代码</th>
                                    <th>中心地址</th>
                                    <th>机构负责人</th>
                                    <th>实施科室</th>
                                    <th>主要研究者</th>
                                    <th>操作</th>
                                    </thead>
                                    <tbody class="center-container">
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <%--end of center selection--%>
                    </div>
                    <%--end of page1--%>
                    <div class="col-md-10 col-md-offset-1 project-property-page" page="2">
                        <form class="form-horizontal" role="form">
                            <div class="form-group">
                                <label class="col-sm-2 control-label text-left">稽查目的</label>
                                <div class="col-md-10 col-sm-12">
                                    <textarea id="project-purpose" class="form-control"></textarea>
                                </div>
                            </div>
                            <hr>
                            <div class="form-group">
                                <label class="col-sm-2 control-label text-left">稽查范围</label>
                                <div class="col-md-10 col-sm-12">
                                    <textarea id="project-range" class="form-control"></textarea>
                                </div>
                            </div>
                            <hr>
                            <div class="form-group">
                                <label class="col-sm-2 control-label text-left">稽查依据</label>
                                <div class="col-md-10 col-sm-12">
                                    <textarea id="project-foundation" class="form-control"></textarea>
                                </div>
                            </div>
                            <hr>
                            <div class="row">
                                <div class="col-md-6 col-sm-12">
                                    <div class="form-group">
                                        <label class="col-sm-4 control-label">《试验方案》版本号：</label>
                                        <div class="col-sm-8">
                                            <input id="project-versionno" type="text" class="form-control">
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6 col-sm-12">
                                    <div class="form-group">
                                        <label class="col-sm-4 control-label">版本日期：</label>
                                        <div class="col-sm-8">
                                            <div class="input-group date date-picker">
                                                <input id="project-versiondate" type="text" size="16" readonly class="form-control">
                                                <span class="input-group-btn">
                                                    <button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
                                                </span>
                                            </div>
                                            <%--<input type="text" class="form-control date-picker">--%>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 col-sm-12">
                                    <div class="form-group">
                                        <label class="col-sm-4 control-label">项目SOP版本号：</label>
                                        <div class="col-sm-8">
                                            <input id="project-sopno" type="text" class="form-control">
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6 col-sm-12">
                                    <div class="form-group">
                                        <label class="col-sm-4 control-label">版本日期：</label>
                                        <div class="col-sm-8">
                                            <div class="input-group date date-picker">
                                                <input id="project-sopdate" type="text" size="16" readonly class="form-control">
                                                <span class="input-group-btn">
                                                    <button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <%--end of page2--%>
                    <div class="col-md-10 col-md-offset-1 project-property-page" page="3">
                        <div class="row">
                            <span>请选择合适的项目阶段或添加新的项目阶段</span>
                        </div>
                        <div class="row">
                            <ul id="stage-container" class="nav nav-pills" role="tablist"></ul>
                        </div>
                        <hr>
                        <div id="stage-center" class="center-selection">
                            <div class="row">
                                <span>请选择本项目该阶段需要参与的中心及各中心参与人员</span>
                            </div>
                            <div class="row">
                                <ul class="center-filter nav nav-pills">
                                </ul>
                            </div>
                            <div class="row">
                                <div class="col-md-6 col-sm-12">
                                    <form class="navbar-form navbar-left search-center" onkeydown="if(event.keyCode==13)return false;" >
                                        <div class="form-group margin-right-20">
                                            <input type="text" placeholder="输入相关信息进行检索" class="form-control search-center-keywords">
                                        </div>
                                        <button class="btn btn-default search-center-button">搜索</button>
                                    </form>
                                </div>
                                <div class="col-md-6 col-sm-12 text-right">
                                    <span>已选中心</span>
                                    <span class="selected-center-count">0</span>
                                    <span>个</span>
                                </div>
                            </div>
                            <div class="row">
                                <table tableId="StageCenterInProjectDetail" class="center-table table table-striped table-bordered table-hover dataTable">
                                    <thead>
                                        <th><input type="checkbox"></th>
                                        <th>机构代码</th>
                                        <th>中心名称</th>
                                        <th>中心地址</th>
                                        <th>机构负责人</th>
                                        <th>实施科室</th>
                                        <th>主要研究者</th>
                                        <th>组长</th>
                                        <th>组员</th>
                                    </thead>
                                    <tbody class="center-container">
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <%--end of center selection--%>
                        <hr>
                        <div class="row">
                            <span>请选择本项目本阶段需要启用的稽查模块</span>
                        </div>
                        <div class="row">
                            <table class="table table-striped table-bordered table-hover dataTable">
                                <tbody id="all-module-container">
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <%--end of page3--%>
                </div>
                <hr>
                <div id="buttons" class="row text-center">
                    <button id="back-edit" class="btn default" type="button">返回编辑</button>
                    <button id="prev-step" class="btn default" type="button">上一步</button>
                    <button id="next-step" class="btn default" type="button">下一步</button>
                    <button id="preview" class="btn default" type="button">预览</button>
                    <button id="save" class="btn default" type="button">添加</button>
                    <button id="cancel" class="btn default" type="button">取消</button>
                    <button id="back-list" class="btn default" type="button">返回</button>
                </div>
            </div>
            <div id="stage-manager-page">
                <%@include file="project-stage-manager.jsp" %>
            </div>
            <div id="center-manager-page">
                <%@include file="stage-center-manager.jsp" %>
            </div>
        </div>
    </div>
    <div class="clearfix"></div>
    <script src="js/select-user-dialog.js" type="text/javascript"></script>
    <script src="js/edit-center-code-dialog.js" type="text/javascript"></script>
    <script src="js/data-structure.js" type="text/javascript"></script>
    <script src="js/test.js" type="text/javascript"></script>
    <script src="js/stage-center-manager.js" type="text/javascript"></script>
    <script src="js/project-stage-manager.js" type="text/javascript"></script>
    <script src="js/project-manager.js" type="text/javascript"></script>
</body>

</html>
