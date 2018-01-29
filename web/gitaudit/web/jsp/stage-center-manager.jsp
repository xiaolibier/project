<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<form class="navbar-form navbar-left" onkeydown="if(event.keyCode==13)return false;">
    <div class="form-group margin-right-20">
        <div class="form-group margin-right-20">
            <label class="control-label">项目编号：</label>
            <label class="project-id control-label">项目编号</label>
        </div>
        <div class="form-group margin-right-20">
            <label class="control-label">项目名称：</label>
            <label class="project-name control-label"></label>
        </div>
    </div>
</form>
<form class="navbar-form navbar-right" onkeydown="if(event.keyCode==13)return false;" >
    <a href="javascript:void(0)" id="to-stage-manager">返回</a>
</form>
<div class="margin-top-10">
    <table tableId="StageCenterManager" class="table table-striped table-bordered table-hover dataTable">
        <thead>
        <tr>
            <th>中心编号</th>
            <th>中心名称</th>
            <th>项目阶段</th>
            <th>报告状态</th>
            <th>项目组长</th>
            <th>创建日期</th>
            <th>操作</th>
        </tr>
        </thead>
        <tbody id="stage-center-container">
        </tbody>
    </table>
</div>
