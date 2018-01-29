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
    <a href="javascript:void(0)" id="to-project-manager">返回</a>
</form>
<div class="margin-top-10">
    <table tableId="ProjectStageManager" class="table table-striped table-bordered table-hover dataTable">
        <thead>
        <tr>
            <th>项目阶段</th>
            <th>中心数量</th>
            <th>中心名称</th>
            <th>阶段状态</th>
            <th>项目经理</th>
            <th>创建日期</th>
            <th>操作</th>
        </tr>
        </thead>
        <tbody id="project-stage-container">
        </tbody>
    </table>
</div>
