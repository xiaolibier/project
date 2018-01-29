<%@ page import="com.zhb.util.PageUtil" %><%--
  Created by IntelliJ IDEA.
  User: zhouhaibin
  Date: 2016/9/19
  Time: 13:18
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<meta charset="utf-8"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<meta content="" name="description"/>
<meta content="" name="author"/>
<script type="text/javascript">
    var href = location.href;
    var protocol = location.protocol;
    var host = location.host;
    var contextPath = '<%=request.getContextPath()%>';
    var baseHref = '<base href="' + protocol + '//' + host + contextPath + '/' + '">';
    var basePath = protocol + '//' + host + contextPath + '/';
    document.write(baseHref);
</script>
<!-- Bootstrap -->
<link href="css/bootstrap.min.css" rel="stylesheet">
<link href="css/font-awesome.css" rel="stylesheet" type="text/css"/>
<link href="css/default.css" rel="stylesheet" type="text/css"/>
<link href="css/style.css" rel="stylesheet" type="text/css"/>
<link href="css/style-metronic.css" rel="stylesheet" type="text/css"/>
<link href="css/style-responsive.css" rel="stylesheet" type="text/css"/>
<link href="css/uniform.default.css" rel="stylesheet" type="text/css"/>
<link href="css/plugins.css" rel="stylesheet" type="text/css"/>
<link href="thirdparty/bootstrap-select/bootstrap-select.min.css" rel="stylesheet" type="text/css" />
<link href="thirdparty/select2/select2.css" rel="stylesheet" type="text/css"/>
<link href="thirdparty/select2/select2-metronic.css" rel="stylesheet" type="text/css"/>
<link href="thirdparty/jquery-multi-select/css/multi-select.css" rel="stylesheet" type="text/css" />
<link href="thirdparty/pnotify/jquery.pnotify.default.css" rel="stylesheet" type="text/css" />
<link href="thirdparty/pnotify/jquery.pnotify.default.icons.css" rel="stylesheet" type="text/css" />
<link href="thirdparty/typeahead/typeahead.css" rel="stylesheet" type="text/css" />

<link href="js/pagination/pagination.css" rel="stylesheet" type="text/css" />
<link href="css/audit.css" rel="stylesheet" type="text/css" />

<script type="text/javascript" src="thirdparty/jquery/jquery-1.10.2.min.js"></script>
<script type="text/javascript" src="thirdparty/uniform/jquery.uniform.min.js" ></script>
<script type="text/javascript" src="thirdparty/bootstrap/js/bootstrap.min.js" ></script>

<script type="text/javascript" src="thirdparty/bootstrap-datetimepicker/js/bootstrap-datetimepicker.js"></script>
<script type="text/javascript" src="thirdparty/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js"></script>
<script type="text/javascript" src="thirdparty/select2/select2.js"></script>
<script type="text/javascript" src="thirdparty/jquery-multi-select/js/jquery.multi-select.js"></script>
<script type="text/javascript" src="thirdparty/jquery.quicksearch/jquery.quicksearch.js"></script><%--用于配合multiSelect使用，用于过滤--%>
<script type="text/javascript" src="thirdparty/pnotify/jquery.pnotify.js"></script>
<script type="text/javascript" src="thirdparty/jquery-slimscroll/jquery.slimscroll.js"></script>

<script type="text/javascript" src="thirdparty/nunjucks.js"></script>
<script type="text/javascript" src="thirdparty/json2.js"></script>
<script type="text/javascript" src="thirdparty/jquery.tmpl.min.js"></script>
<script type="text/javascript" src="thirdparty/jquery.cookie.js"></script>

<script type="text/javascript" src="js/util/prototype-patch.js"></script>
<script type="text/javascript" src="js/util/Notify.js"></script>
<script type="text/javascript" src="js/util/ajax.js"></script>
<script type="text/javascript" src="js/util/utils.js"></script>
<script type="text/javascript" src="js/util/global.js"></script>
<script type="text/javascript" src="js/pagination/pagination.js"></script>

<script type="text/javascript" src="js/global-constants.js"></script>
<script type="text/javascript" src="js/header.js"></script>

<script type="text/javascript">
    //全局静态数据初始化
    var globalAttributes = Global.string2json('<%=PageUtil.buildAttributes(request)%>') || {};
    Global.cloneAttributes(globalAttributes);
</script>
