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
    <%@include file="jspbase.jsp" %>
    <c:if test="${type == 'CenterReport'}">
        <title>单中心稽查报告详情</title>
    </c:if>
    <c:if test="${type == 'StageReport'}">
        <title>项目阶段稽查报告详情</title>
    </c:if>
    <style>
        .problem-list {
            list-style-type: none;
            counter-reset: elementcounter;
            padding-left: 0;
        }
        .problem-edit-control {
            margin-left: 20px;
        }

        .problem-index {
            margin-left: 20px;
        }

        .problem-detail-control {
            margin-left: 10px;
        }

        .patient-index {
            margin-left: 5px;
        }

        .patient-item {
            margin-left: 5px;
        }

        .description-index {
            margin-left: 5px;
        }

        .description-detail-control {
            margin-left: 5px;
        }

        .category-item {
            margin-left: 5px;
        }
        .reference-span2 {
            margin-left: 15px;
            display: inline-block;
        }
        .reference-span1 {
            margin-left: 5px;
            float: left;
        }
        .level2-item {
            margin-left: 5px;
        }

        .patient-list {
            list-style-type: none;
            counter-reset: elementcounter;
            padding-left: 0;
        }

        .description-list {
            list-style-type: none;
            counter-reset: elementcounter;
            padding-left: 0;
        }

        .font-time-new-roman-bold-24 {
            font-family: "Times New Roman";
            font-weight: bold;
            font-size: 24pt;
        }

        .font-hwfs-12 {
            font-family: 华文仿宋;
            font-size: 12pt;
        }

        .font-hwfs-10 {
            font-family: 华文仿宋;
            font-size: 10.5pt;
        }

        .font-hwfs-bold-15 {
            font-family: 华文仿宋;
            font-weight: bold;
            font-size: 15pt;
        }

        .font-hwfs-bold-12 {
            font-family: 华文仿宋;
            font-weight: bold;
            font-size: 12pt;
        }

        .font-hwxh-14 {
            font-family: 华文细黑;
            font-size: 14pt;
        }

        .font-hwxh-16 {
            font-family: 华文细黑;
            font-size: 16pt;
        }

        .font-hwxh-bold-12 {
            font-family: 华文细黑;
            font-weight: bold;
            font-size: 12pt;
        }

        .font-hwxh-bold-14 {
            font-family: 华文细黑;
            font-weight: bold;
            font-size: 14pt;
        }

        .font-hwxh-bold-15 {
            font-family: 华文细黑;
            font-weight: bold;
            font-size: 15pt;
        }

        .font-hwxh-bold-26 {
            font-family: 华文细黑;
            font-weight: bold;
            font-size: 26pt;
        }

    </style>
</head>
<body class="page-header-fixed">
    <%@include file="header.jsp" %>
    <div class="container-fluid">
        <div class="container">
        <div class="page-container">
            <ol class="breadcrumb">
                <li>稽查管理</li>
                <c:if test="${type == 'CenterReport'}">
                    <li>单中心稽查报告</li>
                    <c:if test="${mode == 'detail'}">
                        <li class="active">单中心稽查报告详情</li>
                    </c:if>
                    <c:if test="${mode == 'check'}">
                        <li class="active">项目阶段稽查报告评审详情</li>
                    </c:if>
                </c:if>
                <c:if test="${type == 'StageReport'}">
                    <li>项目阶段稽查报告</li>
                    <c:if test="${mode == 'detail'}">
                        <li class="active">单中心稽查报告详情</li>
                    </c:if>
                    <c:if test="${mode == 'check'}">
                        <li class="active">项目阶段稽查报告评审详情</li>
                    </c:if>
                </c:if>
            </ol>
            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse">
                <form class="navbar-form navbar-right">
                    <c:if test="${type == 'CenterReport'}">
                        <button id="detail" class="btn btn-default">阅读</button>
                        <button id="edit" pid="EDIT_CENTER_REPORT" class="btn btn-default">修改</button>
                        <button id="submit-to-check" pid="EDIT_CENTER_REPORT" class="btn btn-default">提交审阅</button>
                        <button id="submit" pid="EDIT_CENTER_REPORT" class="btn btn-default">提交报告</button>
                        <button id="check-submit" class="btn btn-default">提交</button>
                        <button id="show-discovery-not-in-report" pid="EDIT_CENTER_REPORT" class="btn btn-default">未入稽查发现</button>
                        <button id="print" pid="PRINT" class="btn btn-default">打印</button>
                        <button id="word"  class="btn btn-default">导出word</button>
                        <button id="back" class="btn btn-default">返回</button>
                    </c:if>
                    <c:if test="${type == 'StageReport'}">
                        <button id="detail" class="btn btn-default">阅读</button>
                        <button id="edit" pid="EDIT_STAGE_REPORT" class="btn btn-default">修改</button>
                        <button id="submit-to-check" pid="EDIT_STAGE_REPORT" class="btn btn-default">提交审阅</button>
                        <button id="submit" pid="EDIT_STAGE_REPORT" class="btn btn-default">提交报告</button>
                        <button id="check-submit" class="btn btn-default">提交</button>
                        <button id="show-discovery-not-in-report" pid="EDIT_STAGE_REPORT" class="btn btn-default">未入稽查发现</button>
                        <button id="word"  class="btn btn-default">导出word</button>
						<button id="print" pid="PRINT" class="btn btn-default">打印</button>
                    </c:if>
                </form>
            </div><!-- /.navbar-collapse -->
            <div id="cover">
                <div class="text-center">
                    <c:if test="${type == 'CenterReport'}">
                        <div class="text-center font-hwxh-bold-26">稽 查 报 告</div>
                        <div class="text-center font-time-new-roman-bold-24">AUDIT REPORT</div>
                        <div class="text-center font-hwfs-bold-15">项目编号：<span class="project-id"></span></div>
                    </c:if>
                    <c:if test="${type == 'StageReport'}">
                        <div class="text-center font-hwxh-bold-26">稽 查 汇 总 报 告</div>
                        <div class="text-center font-time-new-roman-bold-24">AUDIT SUMMARY REPORT</div>
                        <div class="text-center font-hwfs-bold-15">项目编号：<span class="project-id"></span></div>
                    </c:if>
                </div>
            </div>
            <%--<hr>--%>
            <div>
                <br>
                <div id="part1">
                    <div class="text-center font-hwxh-16">第一部分：稽查目的、范围、依据</div>
                    <div class="font-hwxh-14">一、稽查目的：</div>
                    <br>
                    <div id="project-purpose" class="font-hwfs-12"></div>
                    <br>
                    <br>
                    <div class="font-hwxh-14">二、稽查范围：</div>
                    <br>
                    <div id="project-range" class="font-hwfs-12"></div>
                    <br>
                    <br>
                    <div class="font-hwxh-14">三、稽查依据：</div>
                    <br>
                    <div id="project-foundation" class="font-hwfs-12"></div>
                    <br>
                </div><%--part1--%>
                <div id="part2">
                    <div class="text-center font-hwxh-16">第二部分：稽查内容</div>
                    <div class="font-hwxh-14">一、稽查概要</div>
                    <div id="report-overview" mode="detail" class="editable" fieldId="overview" opinion="false" itemId="">
                        <div class="row">
                            <div class="col-md-12 detail-control detail-content"></div>
                            <textarea class="col-md-12 edit-control edit-content" style="height: 200px; display: none;"></textarea>
                        </div>
                        <div class="row">
                            <div class="text-right">
                                <button class="btn btn-success edit-button detail-control">修改</button>
                                <button class="btn btn-success save-button edit-control">保存</button>
                                <input type="checkbox" class="detail-control opinion-accepted"><span class="detail-control opinion-flag">建议已处理</span>
                            </div>
                        </div>
                    </div>
                    <div id="report-overview-opinion" mode="detail" class="editable" fieldId="overview" opinion="true" itemId="">
                        <div class="row">
                            <div class="opinion-label">评审意见</div>
                        </div>
                        <div class="row">
                            <div class="col-md-12 detail-control detail-content"></div>
                            <textarea class="col-md-12 edit-control edit-content" style="height: 200px; display: none;"></textarea>
                        </div>
                        <div class="row">
                            <div class="text-right">
                                <button class="btn btn-success edit-button detail-control">编辑评审意见</button>
                                <button class="btn btn-success save-button edit-control">保存</button>
                            </div>
                        </div>
                    </div>
                    <%--<div>--%>
                        <%--本次稽查发现--%>
                        <%--严重问题<span class="level-count" level="严重问题"></span>个，--%>
                        <%--主要问题<span class="level-count" level="主要问题"></span>个，--%>
                        <%--一般问题<span class="level-count" level="一般问题"></span>个，具体情况如下：--%>
                    <%--</div>--%>
                    <div class="text-center font-hwxh-bold-14">稽查发现问题统计</div>
                    <table class="table table-striped table-bordered table-hover dataTable font-hwxh-bold-12">
                        <thead>
                            <tr>
                                <td rowspan="2" align="center" style="vertical-align: middle;">类别</td>
                                <td rowspan="2" align="center" style="vertical-align: middle;">子类</td>
                                <td colspan="3" align="center">发现分级</td>
                                <td class="stage" rowspan="2" align="center">地点</td>
                            </tr>
                            <tr>
                                <td align="center">严重问题</td>
                                <td align="center">主要问题</td>
                                <td align="center">一般问题</td>
                            </tr>
                        </thead>
                        <tbody id="discovery-count-container">
                        </tbody>
                    </table>
                    <div>（备注：严重、主要、一般问题定义见附录；）</div>
                </div><%--part2--%>

                <div id="part3">
                    <div class="text-center font-hwxh-16">第三部分：稽查发现</div>
                    <hr>
                    <div id="discovery-container">
                    </div>
                </div><%--part3--%>
            </div>
        </div><%--page-container--%>
        </div>
    </div><%--container-fluid--%>

    <script src="js/report-template.js" type="text/javascript"></script>
    <script src="js/select-reference-dialog.js" type="text/javascript"></script>
    <script src="js/edit-discovery-dialog.js" type="text/javascript"></script>
    <script src="js/report-detail.js" type="text/javascript"></script>
	
	
</body>
	<!-- <script type="text/javascript" src="js/jquery.min.js"></script> -->
	<script type="text/javascript" src="js/FileSaver.js"></script>
	<script type="text/javascript" src="js/jquery.wordexport.js"></script>
<script>
$(function() {
	$("#word").click(function(event) {
		$('button,textarea,.navbar-collapse,.breadcrumb,.problem-index,.patient-index').remove();
		$(".page-container").wordExport();
		$('ol,li').css('list-style-type','none');
		var url = "printReport/" + Global.type + "/" + Global.reportId;
        window.open(url, '_blank');
		location.reload();
	});
});
</script>
</html>
