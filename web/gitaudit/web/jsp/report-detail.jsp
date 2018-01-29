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
                        <a id="word"  pid="WORD" class="btn btn-default">导出word</a>
                        <a id="word2" pid="WORD2" class="btn btn-default">导出capa</a>
                        <button id="back" class="btn btn-default">返回</button>
                    </c:if>
                    <c:if test="${type == 'StageReport'}">
                        <button id="detail" class="btn btn-default">阅读</button>
                        <button id="edit" pid="EDIT_STAGE_REPORT" class="btn btn-default">修改</button>
                        <button id="submit-to-check" pid="EDIT_STAGE_REPORT" class="btn btn-default">提交审阅</button>
                        <button id="submit" pid="EDIT_STAGE_REPORT" class="btn btn-default">提交报告</button>
                        <button id="check-submit" class="btn btn-default">提交</button>
                        <button id="show-discovery-not-in-report" pid="EDIT_STAGE_REPORT" class="btn btn-default">未入稽查发现</button>
                        <a id="word" pid="WORD" class="btn btn-default">导出word</a>
						<a id="word2" pid="WORD2" class="btn btn-default">导出capa</a>
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
				<!-- <div id="part4" style="display:none;">
						<h4 style="text-align:center">第二部分：稽查发现</h4>
						<div id="partContent">
						</div>
						<p><strong>项目经理：       签字日期：</strong></p>
						<p><strong>稽查经理：       签字日期：</strong></p>
				</div> -->
            </div>
        </div><%--page-container--%>
        </div>
    </div><%--container-fluid--%>

<!----------------------------------------------- new-capa-start ------------------------------>
<div id="newcapaReport">	
   <p class="MsoNormal"><span lang="EN-US">
     
      &nbsp;
     </span></p> 
   <h2 align="center" style="margin:0cm;margin-bottom:.0001pt;text-align:center;
line-height:25.0pt;mso-line-height-rule:exactly;layout-grid-mode:char"><span lang="EN-US" style="font-size:18.0pt;font-family:宋体;mso-bidi-font-family:宋体">
     
      &nbsp;
     </span></h2> 
   <h2 align="center" style="margin:0cm;margin-bottom:.0001pt;text-align:center;
line-height:25.0pt;mso-line-height-rule:exactly;layout-grid-mode:char"><span lang="EN-US" style="font-size:18.0pt;font-family:宋体;mso-bidi-font-family:宋体">
     
      &nbsp;
     </span></h2> 
   <p class="MsoNormal" style="line-height:25.0pt;mso-line-height-rule:exactly;
layout-grid-mode:char"><span lang="EN-US">
     
      &nbsp;
     </span></p> 
   <p class="MsoNormal" style="line-height:25.0pt;mso-line-height-rule:exactly;
layout-grid-mode:char"><span lang="EN-US">
     
      &nbsp;
     </span></p> 
   <h2 align="center" style="margin:0cm;font-weight:600;margin-bottom:17pt;text-align:center;
line-height:25.0pt;"><span style="font-size:22pt;font-family:华文仿宋;">CAPA表</span></h2>  

   <h1 align="center" style="margin-top:0cm;text-align:center;font-weight:600;line-height:25.0pt;
mso-line-height-rule:exactly;layout-grid-mode:char"><span style="font-size:15.0pt;font-family:
华文仿宋;color:black">项目编号：<span class="project-id3"></span></span></h1>
   <p class="MsoNormal" style="line-height:25.0pt;">&nbsp;</p> 
   <p class="MsoNormal" style="line-height:25.0pt;">&nbsp;</p> 
   <p class="MsoNormal" style="line-height:25.0pt;">&nbsp;</p>
   <p class="MsoNormal" style="line-height:25.0pt;">&nbsp;</p>
   <p class="MsoNormal" style="line-height:25.0pt;">&nbsp;</p>
   <p class="MsoNormal" style="line-height:25.0pt;">&nbsp;</p>
   <p class="MsoNormal" style="line-height:25.0pt;">&nbsp;</p>
   <p class="MsoNormal" style="line-height:25.0pt;">&nbsp;</p>
   <p class="MsoNormal" style="line-height:25.0pt;">&nbsp;</p> 
   <p class="MsoNormal" style="line-height:25.0pt;">&nbsp;</p> 
   <p class="MsoNormal" style="line-height:25.0pt;">&nbsp;</p>
   <h1 style="margin-top:0cm;line-height:25.0pt;"><span lang="EN-US">&nbsp;</span></h1>
   <p class="MsoNormal" align="center" style="text-align:center;line-height:25.0pt;">
	<span style="font-size:14.0pt;font-family:华文细黑;mso-bidi-font-weight:bold">第一部分：稽查目的、范围、依据</span>
	</p> 
   <p class="MsoNormal" style="line-height:25.0pt;">&nbsp;</p>
    <p class="a" style="font-size:13pt;font-family:华文细黑;">
		<span lang="EN-US" style="">
			<span style="mso-list:Ignore">一、
				<span style="font:7.0pt &quot;Times New Roman&quot;">
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
				</span>
			</span>
		</span>
		 稽查目的
	</p> 
   <p class="a0" id="project-purpose3" style="line-height:25pt;font-size:12pt;font-family:华文仿宋;"></p> 
   <p class="MsoNormal" style="line-height:25.0pt;">&nbsp;</p> 
   <p class="a" style="font-size:13pt;font-family:华文细黑;">
     <span lang="EN-US" style="mso-bidi-font-family:华文细黑"><span style="mso-list:Ignore">二、<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span>
     稽查范围<span lang="EN-US">
     </span></p> 
   <p class="a0" id="project-range3" style="line-height:25pt;font-size:12pt;font-family:华文仿宋;"></p> 
   <p class="MsoNormal" style="line-height:25.0pt;">&nbsp;</p>  
   <p class="a" style="font-size:13pt;font-family:华文细黑;">
     <span lang="EN-US" style="mso-bidi-font-family:华文细黑"><span style="mso-list:Ignore">三、<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span>
     稽查依据<span class="MsoCommentReference"><span lang="EN-US" style="font-size:10.5pt">
      </span></span></p> 
   <p class="a0" id="project-foundation3" style="line-height:25pt;font-size:12pt;font-family:华文仿宋;"></p> 
   
   <p class="MsoNormal" style="line-height:25.0pt;">&nbsp;</p>  
   <p class="MsoNormal" style="line-height:25.0pt;">&nbsp;</p>   
	<div id="part4">
		<p class="MsoNormal" align="center" style="text-align:center;line-height:25.0pt;">
			<span style="font-size:14.0pt;font-family:华文细黑;mso-bidi-font-weight:bold">第二部分：稽查发现</span>
		</p> 
		<!-- <h4 style="text-align:center">第二部分：稽查发现</h4> -->
		<div id="partContent">
		</div>
		<p><strong>项目经理：       签字日期：</strong></p>
		<p><strong>稽查经理：       签字日期：</strong></p>
	</div>
</div>	
<!----------------------------------------------- new-capa-end ------------------------------>
	
<!----------------------------------------------- new-report-start ------------------------------>
	
	<div class="col-md-9" style="width:auto;display:none;" id="pagecontent">
			
			
<div class="Section1" style="layout-grid:16.3pt;color:#000;"> 
   <p class="MsoNormal"><span lang="EN-US">
     
      &nbsp;
     </span></p> 
   <h2 align="center" style="margin:0cm;margin-bottom:.0001pt;text-align:center;
line-height:25.0pt;mso-line-height-rule:exactly;layout-grid-mode:char"><span lang="EN-US" style="font-size:18.0pt;font-family:宋体;mso-bidi-font-family:宋体">
     
      &nbsp;
     </span></h2> 
   <h2 align="center" style="margin:0cm;margin-bottom:.0001pt;text-align:center;
line-height:25.0pt;mso-line-height-rule:exactly;layout-grid-mode:char"><span lang="EN-US" style="font-size:18.0pt;font-family:宋体;mso-bidi-font-family:宋体">
     
      &nbsp;
     </span></h2> 
   <p class="MsoNormal" style="line-height:25.0pt;mso-line-height-rule:exactly;
layout-grid-mode:char"><span lang="EN-US">
     
      &nbsp;
     </span></p> 
   <p class="MsoNormal" style="line-height:25.0pt;mso-line-height-rule:exactly;
layout-grid-mode:char"><span lang="EN-US">
     
      &nbsp;
     </span></p> 
   <h2 align="center" style="margin:0cm;font-weight:600;margin-bottom:17pt;text-align:center;
line-height:25.0pt;"><span style="font-size:26.0pt;font-family:华文细黑;">稽&nbsp;查&nbsp;报&nbsp;告</span></h2> 
   <p class="MsoNormal" align="center" style="font-weight:600;text-align:center;line-height:25.0pt;"><a style=""><span style="mso-bidi-font-weight:normal"><span lang="EN-US" style="font-size:24.0pt;font-family:&quot;Times New Roman&quot;,&quot;serif&quot;;
color:black;">AUDIT REPORT</span></span></a><span class="MsoCommentReference"><span lang="EN-US" style="font-size:10.5pt;">
      </span></span><span style="mso-bidi-font-weight:normal"><span lang="EN-US" style="font-size:24.0pt;
font-family:&quot;Times New Roman&quot;,&quot;serif&quot;">
      </span></span></p> 
   <h1 align="center" style="margin-top:0cm;text-align:center;line-height:25.0pt;
mso-line-height-rule:exactly;layout-grid-mode:char"><span lang="EN-US" style="font-size:15.0pt;font-family:华文仿宋;color:black">
     
      &nbsp;
     </span></h1> 
   <h1 align="center" style="margin-top:0cm;text-align:center;font-weight:600;line-height:25.0pt;
mso-line-height-rule:exactly;layout-grid-mode:char"><span style="font-size:15.0pt;font-family:
华文仿宋;color:black">项目编号：<span class="project-id2"></span></span></h1>
   <p class="MsoNormal" style="line-height:25.0pt;">&nbsp;</p> 
   <p class="MsoNormal" style="line-height:25.0pt;">&nbsp;</p> 
   <!-- <p class="MsoNormal" style="line-height:25.0pt;">&nbsp;</p>  -->
   <!-- <p class="MsoNormal" style="line-height:25.0pt;">&nbsp;</p>  -->
   <!-- <p class="MsoNormal" style="line-height:25.0pt;">&nbsp;</p>  -->
   <!-- <p class="MsoNormal" style="line-height:25.0pt;">&nbsp;</p>  -->
   <!-- <p class="MsoNormal" style="line-height:25.0pt;">&nbsp;</p>  -->
   <!-- <p class="MsoNormal" style="line-height:25.0pt;">&nbsp;</p>  -->
   <p class="MsoNormal" style="line-height:25.0pt;">&nbsp;</p> 
   <p class="MsoNormal" style="line-height:25.0pt;">&nbsp;</p> 
   <p class="MsoNormal" align="left" style="line-height:25.0pt;"><span style="font-size:14.0pt;font-family:华文仿宋">法律声明</span></p> 
   <p class="MsoNormal" align="left" style="text-align:left;line-height:25.0pt;
mso-line-height-rule:exactly;layout-grid-mode:char"><span style="mso-comment-continuation:
4"><span lang="EN-US" style="font-size:14.0pt;font-family:华文仿宋">1</span></span><span style="mso-comment-continuation:4"><span style="font-size:14.0pt;font-family:
华文仿宋">．报告中相关信息涉及商业机密，非法律要求，不得泄露；</span></span></p> 
   <p class="MsoNormal" align="left" style="text-align:left;line-height:25.0pt;
mso-line-height-rule:exactly;layout-grid-mode:char"><span style="mso-comment-continuation:
4"><span lang="EN-US" style="font-size:14.0pt;font-family:华文仿宋">2</span></span><span style="mso-comment-continuation:4"><span style="font-size:14.0pt;font-family:
华文仿宋">．报告仅供注册申请机构参考使用；</span></span></p> 
   <p class="MsoNormal" align="left" style="text-align:left;line-height:25.0pt;
mso-line-height-rule:exactly;layout-grid-mode:char"><span style="mso-comment-continuation:
4"><span lang="EN-US" style="font-size:14.0pt;font-family:华文仿宋">3</span></span><span style="mso-comment-continuation:4"><span style="font-size:14.0pt;font-family:
华文仿宋">．报告中的信息，仅对本稽查时点和稽查范围的检查发现负责；</span></span></p> 
   <p class="MsoNormal" align="left" style="text-align:left;line-height:25.0pt;
mso-line-height-rule:exactly;mso-pagination:widow-orphan;layout-grid-mode:char"><span style="mso-comment-continuation:4"><span lang="EN-US" style="font-size:14.0pt;
font-family:华文仿宋">4</span></span><span style="mso-comment-continuation:4"><span style="font-size:14.0pt;font-family:华文仿宋">．报告版权及最终解释权归北京经纬传奇医药科技有限公司所有。</span></span><span class="MsoCommentReference"><span lang="EN-US" style="font-size:10.5pt">
      </span></span></p> 
   <!-- <p class="MsoNormal" style="line-height:25.0pt;">&nbsp;</p>  -->
   <h1 style="margin-top:0cm;line-height:25.0pt;"><span lang="EN-US">&nbsp;</span></h1> 
   <p class="MsoNormal" align="center" style="text-align:center;line-height:25.0pt;">
	<span style="font-size:16.0pt;font-family:华文细黑;mso-bidi-font-weight:bold">第一部分：稽查目的、范围、依据</span>
	</p> 
   <p class="MsoNormal" style="line-height:25.0pt;">&nbsp;</p>
   <p class="a" style="font-size:15pt;font-family:华文细黑;"><span lang="EN-US" style=""><span style="mso-list:Ignore">一、<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span>
     稽查目的</p> 
   <p class="a0" id="project-purpose2" style="line-height:25pt;font-size:14pt;font-family:华文仿宋;"></p> 
   <p class="MsoNormal" style="line-height:25.0pt;">&nbsp;</p> 
   <p class="a" style="font-size:15pt;font-family:华文细黑;">
     <span lang="EN-US" style="mso-bidi-font-family:华文细黑"><span style="mso-list:Ignore">二、<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span>
     稽查范围<span lang="EN-US">
     </span></p> 
   <p class="a0" id="project-range2" style="line-height:25pt;font-size:14pt;font-family:华文仿宋;"></p> 
   <p class="MsoNormal" style="line-height:25.0pt;">&nbsp;</p>  
   <p class="a" style="font-size:15pt;font-family:华文细黑;">
     <span lang="EN-US" style="mso-bidi-font-family:华文细黑"><span style="mso-list:Ignore">三、<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span>
     稽查依据<span class="MsoCommentReference"><span lang="EN-US" style="font-size:10.5pt">
      </span></span></p> 
   <p class="a0" id="project-foundation2" style="line-height:25pt;font-size:14pt;font-family:华文仿宋;"></p> 
   
   <p class="MsoNormal" style="line-height:25.0pt;">&nbsp;</p>  
   <p class="MsoNormal" style="line-height:25.0pt;">&nbsp;</p>   
   <p class="MsoNormal" align="center" style="text-align:center;line-height:25.0pt;">
	<span style="font-size:16.0pt;font-family:华文细黑;mso-bidi-font-weight:bold">第二部分：稽查内容</span>
	</p> 
   <p class="MsoNormal" style="line-height:25.0pt;">&nbsp;</p>  
   <p class="a"  style="font-size:15pt;font-family:华文细黑;">
     <span lang="EN-US" style="mso-bidi-font-family:华文细黑"><span style="mso-list:Ignore">一、<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span>
     稽查概要<span class="MsoCommentReference"><span lang="EN-US" style="mso-ansi-font-size:15.0pt;
mso-bidi-font-size:15.0pt">
      </span></span></p> 
   <p class="a0" id="report-overview2" style="line-height:25pt;font-size:14pt;font-family:华文仿宋;">
		<div class="row">
			<div class="col-md-12 detail-control detail-content"></div>
		</div>
   </p> 
   
   <p class="MsoNormal" id="report-overview-opinion2" style="line-height:25pt;font-size:14pt;font-family:华文仿宋;">
		<div class="row">
			<div class="col-md-12 detail-control detail-content"></div>
		</div>
   </p> 
   <p class="MsoNormal" align="center" style="font-weight:600;text-align:center;line-height:25.0pt;
mso-line-height-rule:exactly;layout-grid-mode:char"><span style="mso-bidi-font-weight:normal"><span style="font-size:14.0pt;font-family:华文细黑">稽查发现问题统计</span></span><span class="MsoCommentReference"><span lang="EN-US" style="font-size:10.5pt">
      </span></span><span style="mso-bidi-font-weight:normal"><span lang="EN-US" style="font-size:14.0pt;font-family:华文细黑">
      </span></span></p> 
   <table class="MsoTableGrid" border="1" cellspacing="0" cellpadding="0" width="595" style="font-size:14pt;width:100%;border-collapse:collapse;border:none;"> 
    <thead>
     <tr style="mso-yfti-irow:0;mso-yfti-firstrow:yes">
      <td width="113" rowspan="2" style="width:84.8pt;border:solid windowtext 1.0pt;
  mso-border-alt:solid windowtext .5pt;padding:0cm 5.4pt 0cm 5.4pt"> <p class="MsoNormal" align="center" style="text-align:center;line-height:25.0pt;
  mso-line-height-rule:exactly;layout-grid-mode:char"><strong><span style="mso-bidi-font-weight:
  normal"><span style="font-family:华文细黑">类别
           </span></span></strong></p> </td> 
      <td width="300" rowspan="2" style="width:200pt;border:solid windowtext 1.0pt;
  border-left:none;mso-border-left-alt:solid windowtext .5pt;mso-border-alt:
  solid windowtext .5pt;padding:0cm 5.4pt 0cm 5.4pt"> <p class="MsoNormal" align="center" style="text-align:center;line-height:25.0pt;
  mso-line-height-rule:exactly;layout-grid-mode:char"><strong><span style="mso-bidi-font-weight:
  normal"><span style="font-family:华文细黑">子类
           </span></span></strong></p> </td> 
      <td width="156" colspan="3" valign="top" style="width:117.15pt;border:solid windowtext 1.0pt;
  border-left:none;mso-border-left-alt:solid windowtext .5pt;mso-border-alt:
  solid windowtext .5pt;padding:0cm 5.4pt 0cm 5.4pt"> <p class="MsoNormal" align="center" style="text-align:center;line-height:25.0pt;
  mso-line-height-rule:exactly;layout-grid-mode:char"><strong><span style="mso-bidi-font-weight:
  normal"><span style="font-family:华文细黑">发现分级
           </span></span></strong></p> </td> 
     </tr> 
     <tr style="mso-yfti-irow:1"> 
      <td width="50" valign="top" style="width:38pt;border-top:none;border-left:
  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext .5pt;
  mso-border-alt:solid windowtext .5pt;padding:0cm 5.4pt 0cm 5.4pt"> <p class="MsoNormal" align="center" style="text-align:center;line-height:25.0pt;
  mso-line-height-rule:exactly;layout-grid-mode:char"><strong><span style="mso-bidi-font-weight:
  normal"><span style="font-family:华文细黑">严重问题
           </span></span></strong></p> </td> 
      <td width="50" valign="top" style="width:38pt;border-top:none;border-left:
  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext .5pt;
  mso-border-alt:solid windowtext .5pt;padding:0cm 5.4pt 0cm 5.4pt"> <p class="MsoNormal" align="center" style="text-align:center;line-height:25.0pt;
  mso-line-height-rule:exactly;layout-grid-mode:char"><strong><span style="mso-bidi-font-weight:
  normal"><span style="font-family:华文细黑">主要问题
           </span></span></strong></p> </td> 
      <td width="52" valign="top" style="width:42pt;border-top:none;border-left:
  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext .5pt;
  mso-border-alt:solid windowtext .5pt;padding:0cm 5.4pt 0cm 5.4pt"> <p class="MsoNormal" align="center" style="text-align:center;line-height:25.0pt;
  mso-line-height-rule:exactly;layout-grid-mode:char"><strong><span style="mso-bidi-font-weight:
  normal"><span style="font-family:华文细黑">一般问题
           </span></span></strong></p> </td> 
     </tr> 
	</thead>
    <tbody id="discovery-count-container2"></tbody>
   </table> 
   <p class="MsoNormal" style="line-height:25.0pt;mso-line-height-rule:exactly;
layout-grid-mode:char"><span style="font-size:10.5pt;font-family:华文仿宋">（备注：严重、主要、一般问题定义见附录<span lang="EN-US">1</span>）<span lang="EN-US">
      </span></span></p> 
   <span><span lang="EN-US" style="font-size:16.0pt;font-family:华文细黑;mso-bidi-font-family:
&quot;Times New Roman&quot;;mso-font-kerning:1.0pt;mso-ansi-language:EN-US;mso-fareast-language:
ZH-CN;mso-bidi-language:AR-SA"></span></span> 
   <p class="MsoNormal" align="center" style="text-align:center;line-height:25.0pt;">
	<span style="font-size:16.0pt;font-family:华文细黑;mso-bidi-font-weight:bold">第三部分：稽查发现</span>
	</p> 
    <p class="MsoNormal" id="discovery-container2" style="line-height:25pt;margin-left:0cm;;font-family:华文仿宋;font-size:14pt;">
   </p> 
   <p class="MsoNormal" style="line-height:25.0pt;">&nbsp;</p> 
   <p class="MsoNormal" style="line-height:25.0pt;">&nbsp;</p> 
   <p class="MsoNormal" align="left" style="text-align:left;line-height:25.0pt;
mso-line-height-rule:exactly;mso-pagination:widow-orphan;layout-grid-mode:char">
<span style="font-size:15.0pt;font-family:华文细黑">附录<span lang="EN-US">1</span>：</span><span class="MsoCommentReference"><span lang="EN-US" style="font-size:15.0pt;font-family:
华文细黑">
      </span></span><span lang="EN-US" style="font-size:15.0pt;
font-family:华文细黑">
     </span></p> 
   <p class="MsoNormal" align="left" style="text-align:left;line-height:25.0pt;
mso-line-height-rule:exactly;mso-pagination:widow-orphan;layout-grid-mode:char"><span lang="EN-US" style="font-size:15.0pt;font-family:宋体">
     
      &nbsp;
     </span></p> 
   <h1 align="center" style="margin-top:0cm;text-align:center;line-height:25.0pt;
mso-line-height-rule:exactly;layout-grid-mode:char"><span style="font-size:15.0pt;font-family:
华文细黑;font-weight:600;color:windowtext">稽查发现问题程度分级</span><span class="MsoCommentReference"><span lang="EN-US" style="font-size:15.0pt;font-family:华文细黑;color:windowtext;
font-weight:normal">
      </span></span></h1> 
   <p class="MsoNormal"><span lang="EN-US">
     
      &nbsp;
     </span></p> 
   <p class="MsoNormal" align="left" style="text-align:left;;
mso-char-indent-count:2.0;line-height:25.0pt;mso-line-height-rule:exactly;
layout-grid-mode:char"><span style="font-weight:600;"><span style="font-family:
华文仿宋">严重问题<span lang="EN-US">(Critical finding)</span></span></span><span class="MsoCommentReference"><span lang="EN-US" style="mso-ansi-font-size:12.0pt;
mso-bidi-font-size:12.0pt">
      
      </span></span><span style="mso-bidi-font-weight:normal"><span lang="EN-US" style="font-family:华文仿宋">–</span></span><span style="font-family:华文仿宋">发现的问题严重偏离<span lang="EN-US">/</span>触犯了相应的法规和<span lang="EN-US">GCP</span>，严重影响数据的真实完整、受试者的安全、隐私和权益；该问题的发生显示存在系统性的违规。该问题完全不能被接受，可能导致研究中心的关闭，并影响试验产品的最后批准。如：涉及造假、数据伪造、数据的可靠性差或缺乏源文件<span lang="EN-US">/</span>记录、既往的严重问题或主要问题未采取及时的纠正措施、一系列典型同一类型的主要问题、（任何需要向卫生监管部门报告或通知的）多个不依从频繁<span lang="EN-US">/</span>有趋势成为频繁的未报告<span lang="EN-US">/</span>延迟报告等。</span><span class="MsoCommentReference"><span lang="EN-US" style="mso-ansi-font-size:12.0pt;
mso-bidi-font-size:12.0pt">
      </span></span></p> 
   <p class="MsoNormal" style=";mso-char-indent-count:2.0;
line-height:25.0pt;mso-line-height-rule:exactly;mso-hyphenate:none;layout-grid-mode:
char"><span style="font-weight:600;"><span style="font-family:华文仿宋">主要问题<span lang="EN-US">(Major finding)–</span></span></span><span lang="EN-US" style="font-family:
华文仿宋"> </span><span style="font-family:华文仿宋">发现的问题偏离<span lang="EN-US">/</span>触犯了相应的法规和<span lang="EN-US">GCP</span>，可能影响受试者的安全，隐私和权益；数据质量受到影响，但不影响数据的真实完整；该问题的发生可能源于系统性的违规，如不及时有效解决，具有较高风险发展成严重问题。可能需要采取正式的改进措施和书面记录，研究中心的操作需要改进。如：跨职能领域依从性差，但没有造成系统管理的质量问题、（任何需要向卫生监管部门报告或通知的）单个不依从未报告或延迟报告。<span lang="EN-US">
      </span></span></p> 
   <p class="MsoNormal" style=";mso-char-indent-count:2.0;
line-height:25.0pt;mso-line-height-rule:exactly;mso-hyphenate:none;layout-grid-mode:
char"><span style="font-weight:600;"><span style="font-family:华文仿宋">一般问题<span lang="EN-US"> (Minor finding)</span></span></span><span lang="EN-US" style="font-family:
华文仿宋">– </span><span style="font-family:华文仿宋">发现的问题与相应的法规和<span lang="EN-US">GCP</span>规定偏移，尚未对流程、临床试验数据或系统造成后续的影响；一般不会影响受试者的安全，隐私和权益、数据的真实完整，但有进一步完善和提高的需要。建议对研究中心培训或完善研究中心操作方式。同一类型的一般问题频繁发生，可能提示研究中心对<span lang="EN-US">GCP</span>的理解和依从存在问题，可能造成问题程度的加重。<span lang="EN-US" style="color:#0432FF">
      </span></span></p> 
  </div>   
			
	    </div>
	
	<!-- <script type="text/javascript" src="js/exportjs/jquery-2.1.1.min.js"></script> -->
	<script type="text/javascript" src="js/exportjs/FileSaver.js"></script>
	<script type="text/javascript" src="js/exportjs/jquery.wordexport.js"></script>
	
	<!-- capa-end -->
    <script src="js/report-template.js" type="text/javascript"></script>
    <script src="js/select-reference-dialog.js" type="text/javascript"></script>
    <script src="js/edit-discovery-dialog.js" type="text/javascript"></script>
    <script src="js/report-detail.js" type="text/javascript"></script>
	
	
</body>
	<!-- <script type="text/javascript" src="js/jquery.min.js"></script> -->
	<!-- <script type="text/javascript" src="js/FileSaver.js"></script> -->
	<!-- <script type="text/javascript" src="js/jquery.wordexport.js"></script> -->
	
<script>
$(function() {
	partDataShow();
	//加载part3数据
	function partDataShow(){
		var condi = {};
		//condi.type = Global.type;
        //condi.id = Global.reportId;
        //condi.mode = Global.mode;
		condi.para = '{"type":"'+Global.type+'","id":"'+Global.reportId+'","mode":"'+Global.mode+'"}';
		var url = "loadReport";
		$.ajax({
			url:url,
			data:condi,
			timeout: 30000, //超时时间设置，单位毫秒
			type:"POST",
			dataType:'json',
			context:this,
			success: function(data){
				var view = data.view || [];
				var html = '';
				for (var i = 0; i < view.levelViews.length; i ++) {
					var levelView = view.levelViews[i];
					var btitle = levelView.level || '';//大标题 严重问题 等等
					var as = ['一','二','三'];
					// html+='<h3>'+as[i]+'、'+btitle+'</h3>';
					html+='<p class="a" style="font-size:13pt;font-family:华文细黑;">'
						+'<span lang="EN-US" style="">'
							+'<span style="mso-list:Ignore">'+as[i]+'、'
								+'<span style="font:7.0pt &quot;Times New Roman&quot;">'
								+'	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; '
								+'</span>'
							+'</span>'
						+'</span>'
						+' '+btitle+''
					+'</p> ';
					for (var j = 0; j < levelView.problemViews.length; j ++) {
						var jjj = j +1 ;
						var problemView = levelView.problemViews[j];
						var problemName = problemView.problemName || '';//标题
						var category = problemView.category || '';//分类
						var references = problemView.references || [];//依据数组
						var sds = '';//依据
						var miaoshu = '';//描述
						for(var s=0,lens=references.length;s<lens;s++){
							var _na = references[s].name || '';
							sds = _na + '<br/>' + sds;
						}
						for (var k = 0; k < problemView.patientViews.length; k ++) {
							var patientView = problemView.patientViews[k];
							for (var l = 0; l < patientView.discoveryViews.length; l ++) {
								var discovery = patientView.discoveryViews[l];
								var description = discovery.description || '';
								var patientNo = discovery.patientNo || '';
								patientNo = patientNo == '' || patientNo == '_' ? '' : '受试者'+patientNo+'：';
								miaoshu = miaoshu + (k+1)+')'+patientNo+ description+'<br/>';
								
							}
						}
						html+=''
						+'<br/><table cellspacing="0" cellpadding="0">'
						  +'<tr>'
							+'<td style="padding:3px;border:1px solid #c0c0c0;border-bottom:none;font-size:11pt;" width="49" valign="top">'+jjj+'</td>'
						+'	<td style="padding:3px;border:1px solid #c0c0c0;border-left:none;border-bottom:none;font-size:11pt;" width="564" colspan="4" valign="top"><p><strong>分类:</strong>'+category+'</p></td>'
						+'  </tr>'
						+'  <tr>'
						+'	<td style="padding:3px;background-color:#eeece1;border:1px solid #000000;font-size:11pt;" width="104" colspan="2"><p><strong>依据:</strong></p></td>'
						+'	<td style="padding:3px;background-color:#eeece1;border:1px solid #000000;border-left:none;font-size:11pt;" width="509" colspan="3"><p>'+sds+'</p></td>'
						 +' </tr>'
						 +'  <tr>'
						+'	<td style="padding:3px;border:1px solid #c0c0c0;border-top:none;border-bottom:none;font-size:11pt;" width="104" colspan="2"><p><strong>问题归纳:</strong></p></td>'
						+'	<td style="padding:3px;border:1px solid #c0c0c0;border-top:none;border-bottom:none;border-left:none;font-size:11pt;" width="509" colspan="3"><p>'+problemName+'</p></td>'
						 +' </tr>'
						 +' <tr>'
						+'	<td style="padding:3px;border:1px solid #c0c0c0;border-bottom:none;font-size:11pt;" width="104" colspan="2" valign="top"><p><strong>发现:</strong></p></td>'
						+'	<td style="padding:3px;border:1px solid #c0c0c0;border-bottom:none;border-left:none;font-size:11pt;" width="509" colspan="3" valign="top"><p>'+miaoshu+'</p></td>'
						+'  </tr>'
						+'  <tr>'
						+'	<td style="padding:3px;border:1px solid #000000;font-size:11pt;" width="104" colspan="2" rowspan="2" valign="top"><p><strong>回复</strong><strong> </strong></p></td>'
						+'	<td style="padding:3px;border:1px solid #000000;border-left:none;font-size:11pt;" width="509" colspan="3" valign="top"><p>CA（纠正措施）: </p></td>'
						+'  </tr>'
						+'  <tr>'
						+'	<td style="padding:3px;border:1px solid #000000;border-top:none;border-left:none;font-size:11pt;" width="509" colspan="3" valign="top"><p>PA（预防措施）： </p></td>'
						+'  </tr>'
						+'  <tr>'
						+'	<td style="padding:3px;border:1px solid #000000;font-size:11pt;" width="104" colspan="2" valign="top"><p><strong>回复人</strong><strong> </strong></p></td>'
						+'	<td style="padding:3px;border:1px solid #000000;border-top:none;border-left:none;font-size:11pt;" width="198" valign="top"><p>&nbsp;</p></td>'
						+'	<td style="padding:3px;border:1px solid #000000;border-top:none;border-left:none;font-size:11pt;" width="113" valign="top"><p align="right"><strong>项目角色</strong><strong> </strong></p></td>'
						+'	<td style="padding:3px;border:1px solid #000000;border-top:none;border-left:none;font-size:11pt;" width="198" valign="top"><p>&nbsp;</p></td>'
						+'  </tr>'
						+'  <tr>'
						+'	<td style="padding:3px;border:1px solid #000000;border-top:none;font-size:11pt;" width="302" colspan="3" valign="top"><p><strong>计划完成时间</strong><strong> </strong></p></td>'
						+'	<td style="padding:3px;border:1px solid #000000;border-top:none;border-left:none;font-size:11pt;" width="311" colspan="2" valign="top"><p>&nbsp;</p></td>'
						+'  </tr>'
						+'</table>';
						
					}
				}
				$('#partContent').html(html);
				
			},
			error:function(data,status){
				
			}
		});
	}
	
	$("#word").click(function(event) {
		
		$("#pagecontent").find('button,textarea,.navbar-collapse').remove();
		//css
		$("#pagecontent").find('.font-hwxh-14').css({'font-family':'华文细黑','font-size':'14pt'});
		$("#pagecontent").find('.font-hwfs-bold-12').css({'font-family':'华文仿宋','font-size':'12pt','font-weight':'bold'});
		$("#pagecontent").find('.font-hwfs-10').css({'font-family':'华文仿宋','font-size':'12pt','line-height':'25pt'});
		$("#pagecontent").find('.row,.patient-list').css({'list-style-type':'none','line-height':'25pt'});
		var num = $('.project-id2').html() || '';
		var myDate = new Date();
		var date = myDate.toLocaleDateString();
		//console.log(date);
		date = date.split('/').join('');
		var num2 = '3AUDIT'+date+'-AR';
		num = num == '' ? num2 : num+'-AR' ;
		
		$("#pagecontent").wordExport(num);
		//var url = "printReport/" + Global.type + "/" + Global.reportId;
       // window.open(url, '_blank');
		//location.reload();

		//return false;
		//$('button,textarea,.navbar-collapse,.breadcrumb,.problem-index,.patient-index,#part4').remove();
		//$(".page-container").wordExport('audit-report');
		//$('ol,li').css('list-style-type','none');
		//var url = "printReport/" + Global.type + "/" + Global.reportId;
       // window.open(url, '_blank');
		//location.reload();
	});
	$("#word2").click(function(event) {
		
		$("#newcapaReport").find('button,textarea,.navbar-collapse').remove();
		//css
		$("#newcapaReport").find('.font-hwxh-14').css({'font-family':'华文细黑','font-size':'14pt'});
		$("#newcapaReport").find('.font-hwfs-bold-12').css({'font-family':'华文仿宋','font-size':'12pt','font-weight':'bold'});
		$("#newcapaReport").find('.font-hwfs-10').css({'font-family':'华文仿宋','font-size':'12pt','line-height':'25pt'});
		$("#newcapaReport").find('.row,.patient-list').css({'list-style-type':'none','line-height':'25pt'});
		var num = $('.project-id3').html() || '';
		var myDate = new Date();
		var date = myDate.toLocaleDateString();
		//console.log(date);
		date = date.split('/').join('');
		var num2 = '3AUDIT'+date+'-AR';
		num = num == '' ? num2 : num+'-AR' ;
		
		$("#newcapaReport").wordExport('3audit-capa');
		//$('button,textarea,.navbar-collapse,.breadcrumb,.problem-index,.patient-index,#part2,#part3').remove();
		//$('#part4').show();
		//$(".page-container").wordExport('audit-capa');
		//$('ol,li').css('list-style-type','none');
		//var url = "printReport/" + Global.type + "/" + Global.reportId;
        //window.open(url, '_blank');
		//location.reload();
	});
});
</script>
</html>
