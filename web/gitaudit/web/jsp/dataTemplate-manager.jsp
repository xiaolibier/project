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
    <title>
        数据模板管理
    </title>
    <%@include file="jspbase.jsp" %>
</head>
<body class="page-header-fixed">
    <%@include file="header.jsp" %>
    <div class="container-fluid">
        <div class="page-container">
        <ol class="breadcrumb">
            <li>系统管理</li>
            <li class="active">数据模板管理</li>
        </ol>
            <ul class="nav nav-pills" role="tablist">
                <li role="presentation"><a href="toCategoryManager">分类管理</a></li>
                <li role="presentation"><a href="toProblemManager">问题归类管理</a></li>
                <li role="presentation"><a href="toReferenceManager">依据管理</a></li>
                <li role="presentation" type="Project"><a href="toDataTemplateManager?type=Project">目的范围依据</a></li>
                <li role="presentation" type="CenterReport"><a href="toDataTemplateManager?type=CenterReport">单中心报告稽查概述</a></li>
                <li role="presentation" type="StageReport"><a href="toDataTemplateManager?type=StageReport">项目阶段报告稽查概述</a></li>
                <li role="presentation" type="Company"><a href="toDataTemplateManager?type=Company">公司基本信息</a></li>
            </ul>
            <div class="container">
            <div class="margin-top-10">
                <form class="form-horizontal" role="form">
                    <c:if test="${type == 'Project'}">
                        <div class="form-group">
                            <label class="col-sm-2 control-label text-left">稽查目的</label>
                            <div class="col-md-10 col-sm-12">
                                <textarea id="ProjectPurpose" class="form-control data-item" style="height: 120px;"></textarea>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label text-left">稽查范围</label>
                            <div class="col-md-10 col-sm-12">
                                <textarea id="ProjectRange" class="form-control data-item" style="height: 120px;"></textarea>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label text-left">稽查依据</label>
                            <div class="col-md-10 col-sm-12">
                                <textarea id="ProjectFoundation" class="form-control data-item" style="height: 120px;"></textarea>
                            </div>
                        </div>
                    </c:if>
                    <c:if test="${type == 'CenterReport'}">
                        <div class="form-group">
                            <label class="col-sm-2 control-label text-left">单中心报告稽查概述</label>
                            <div class="col-md-10 col-sm-12">
                                <textarea id="CenterReportOverview" class="form-control data-item" style="height: 420px;"></textarea>
                            </div>
                        </div>
                    </c:if>
                    <c:if test="${type == 'StageReport'}">
                        <div class="form-group">
                            <label class="col-sm-2 control-label text-left">项目阶段报告稽查概述</label>
                            <div class="col-md-10 col-sm-12">
                                <textarea id="StageReportOverview" class="form-control data-item" style="height: 420px;"></textarea>
                            </div>
                        </div>
                    </c:if>
                    <c:if test="${type == 'Company'}">
                        <div class="form-group">
                            <label class="col-sm-2 control-label">受托方</label>
                            <div class="col-sm-10">
                                <input id="Assignee" type="text" class="form-control data-item">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">地址</label>
                            <div class="col-sm-10">
                                <input id="Address" type="text" class="form-control data-item">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">联系方式</label>
                            <div class="col-sm-10">
                                <input id="Telephone" type="text" class="form-control data-item">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">手机</label>
                            <div class="col-sm-10">
                                <input id="Mobilephone" type="text" class="form-control data-item">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">微信公众号</label>
                            <div class="col-sm-10">
                                <input id="Wechat" type="text" class="form-control data-item">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">网址</label>
                            <div class="col-sm-10">
                                <input id="Url" type="text" class="form-control data-item">
                            </div>
                        </div>
                    </c:if>
                    <c:if test="${type == 'Config'}">
                        <div class="form-group">
                            <label class="col-sm-3 control-label">定时保存时间间隔（分钟）</label>
                            <div class="col-sm-9">
                                <input id="AudoSaveInterval" type="text" class="form-control data-item">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-3 control-label">session超时时间（分钟）</label>
                            <div class="col-sm-9">
                                <input id="SessionTimeout" type="text" class="form-control data-item">
                            </div>
                        </div>
                    </c:if>
                    <div class="text-right">
                        <button id="save" class="btn default" type="button">保存</button>
                    </div>
                </form>
            </div>
        </div>
        </div>
    </div>

    <script src="js/dataTemplate-manager.js" type="text/javascript"></script>
</body>

</html>
