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
    <title>稽查发现分级</title>
    <%@include file="jspbase.jsp" %>
</head>
<body class="page-header-fixed">
    <%@include file="header.jsp" %>
    <div class="container-fluid">
        <div class="page-container">
            <ol class="breadcrumb">
                <li>评审任务</li>
                <li>单中心稽查报告分级</li>
                <li class="active">单中心稽查报告分级详情</li>
            </ol>
            <div class="collapse navbar-collapse">
                <form class="navbar-form navbar-left">
                    <div class="form-group">
                        <label class="control-label">分类</label>
                        <select id="discovery-category" class="form-control">
                        </select>
                    </div>
                    <div class="form-group">
                        <input id="discovery-patientNo" type="text" placeholder="受试者编号/记录编号" class="form-control">
                    </div>
                    <button id="search-discovery" class="btn btn-default">搜索</button>
                    <div class="form-group">
                        <label class="control-label">排序</label>
                        <select id="discovery-orderby" class="form-control">
                            <option value="patientNo asc">受试者升序</option>
                            <option value="patientNo desc">受试者降序</option>
                            <option value="created asc">创建时间升序</option>
                            <option value="created desc">创建时间降序</option>
                        </select>
                    </div>
                </form>
                <form class="navbar-form navbar-right">
                    <button id="save" class="btn btn-default">保存</button>
                    <button id="submit" class="btn btn-default">提交</button>
                </form>
            </div>
            <div id="discovery-container"><%--稽查发现记录--%>
            </div>
        </div>
    </div>

    <script src="js/classify-center-report.js" type="text/javascript"></script>
</body>

</html>
