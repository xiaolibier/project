<%--
  Created by IntelliJ IDEA.
  User: zhouhaibin
  Date: 2016/9/19
  Time: 13:16
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<div class="header navbar navbar-fixed-top mega-menu">
    <!-- BEGIN TOP NAVIGATION BAR -->
    <div class="header-inner">
        <!-- BEGIN LOGO -->
        <a class="navbar-brand" href="javascript:void(0)">
            <%--<img src="css/logo.png" alt="logo" class="img-responsive"/>--%>
        </a>
        <!-- END LOGO -->
        <!-- BEGIN HORIZANTAL MENU -->
        <div class="hor-menu hidden-sm hidden-xs">
            <ul class="nav navbar-nav">
                <li class="classic-menu-dropdown">
                    <a id="project-manager" href="toProjectManager" class="nva-item">
                        项目管理
                    </a>
                </li>
                <li class="classic-menu-dropdown">
                    <a id="task-manager" data-toggle="dropdown" data-hover="dropdown" data-close-others="true" href="">
                        稽查管理
                        <i class="fa fa-angle-down"></i>
                    </a>
                    <ul class="dropdown-menu pull-right">
                        <li><a class="nav-item" href="toTaskManager">稽查任务管理</a></li>
                        <li><a class="nav-item" href="toTaskReportManager">稽查记录表</a></li>
                        <li><a class="nav-item" href="toReportManager?type=CenterReport">单中心稽查报告</a></li>
                        <li><a class="nav-item" href="toReportManager?type=StageReport">项目阶段稽查报告</a></li>
                        <li><a class="nav-item" href="toReportScoreManager">研究中心评价表</a></li>
                    </ul>
                </li>
                <li class="classic-menu-dropdown">
                    <a id="check-manager" data-toggle="dropdown" data-hover="dropdown" data-close-others="true" href="">
                        评审任务
                        <i class="fa fa-angle-down"></i>
                    </a>
                    <ul class="dropdown-menu pull-right">
                        <li><a class="nav-item" pid="CHECK" href="toReportCheckManager?type=CenterReport">单中心稽查报告评审</a></li>
                        <li><a class="nav-item" pid="CHECK" href="toMyReportCheckManager?type=CenterReport">我的单中心稽查报告评审</a></li>
                        <li><a class="nav-item" pid="CLASSIFY" href="toCenterReportClassifyManager?type=CenterReport">单中心稽查报告分级</a></li>
                        <li><a class="nav-item" pid="CLASSIFY" href="toMyCenterReportClassifyManager?type=CenterReport">我的单中心稽查报告分级</a></li>
                        <li><a class="nav-item" pid="CHECK" href="toReportCheckManager?type=StageReport">项目阶段稽查报告评审</a></li>
                        <li><a class="nav-item" pid="CHECK" href="toMyReportCheckManager?type=StageReport">我的项目阶段稽查报告评审</a></li>
                    </ul>
                </li>
                <li class="classic-menu-dropdown">
                    <a id="system-manager" data-toggle="dropdown" data-hover="dropdown" data-close-others="true" href="">
                        系统管理
                        <i class="fa fa-angle-down"></i>
                    </a>
                    <ul class="dropdown-menu pull-right">
                        <li><a class="nav-item" pid="SYSTEM_ADMIN" href="toCenterManager">中心管理</a></li>
                        <li><a class="nav-item" pid="SYSTEM_ADMIN" href="toUserManager">用户管理</a></li>
                        <li><a class="nav-item" pid="SYSTEM_ADMIN" href="toStatisticsManager">报表统计</a></li>
                        <li><a class="nav-item" pid="SYSTEM_ADMIN" href="toCategoryManager">稽查基础数据管理</a></li>
                        <li><a class="nav-item" pid="SYSTEM_ADMIN" href="toDataTemplateManager?type=Config">系统设置</a></li>
                    </ul>
                </li>
            </ul>
        </div>
        <!-- END HORIZANTAL MENU -->
        <!-- BEGIN TOP NAVIGATION MENU -->
        <ul class="nav navbar-nav pull-right">
            <!-- BEGIN USER LOGIN DROPDOWN -->
            <li class="dropdown user">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                    <%--<img alt="" src="css/logo.png"/>--%>
                        <span id="current-login-user-name" class="username hidden-1024"></span>
                    <i class="fa fa-angle-down"></i>
                </a>
                <ul class="dropdown-menu">
                    <li>
                        <a href="toModifyPassword">
                            <i class="fa fa-key"></i>修改密码
                        </a>
                    </li>
                    <li>
                        <a href="logout">
                            <i class="fa fa-key"></i>退出
                        </a>
                    </li>
                </ul>
            </li>
            <!-- END USER LOGIN DROPDOWN -->
        </ul>
        <!-- END TOP NAVIGATION MENU -->
    </div>
    <!-- END TOP NAVIGATION BAR -->
</div>
<!-- END HEADER -->
<script src="js/header.js" type="text/javascript"></script>