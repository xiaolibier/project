var ProjectStageManager = function(){
    var f;
    var $container = $("#project-stage-container");
    var currentProject;
    return{
        init: function() {
            f = this;
            f.initTemplate();
            f.bindEvent();
        },

        initTemplate: function() {
            var projectStageTemplate =
                '<tr>' +
                    '<td>${name}</td>' +
                    '<td>${centerCount}</td>' +
                    '<td><a title="进入中心管理页面" class="to-center-manager" href="javascript:void(0)">${centerNames}</a></td>' +
                    '<td>${$item.getStatusString($item.data)}</td>' +
                    '<td>${leaderName}</td>' +
                    '<td>${projectCreated}</td>' +
                    '<td>' +
                        '<a title="阶段详情" href="javascript:void(0)" class="table-operation-icon to-center-manager"><i class="glyphicon glyphicon-list-alt"></i></a>' +
                        '{{if status != 4 && status != 3}}' +
                        '<a title="取消阶段" href="javascript:void(0)" class="cancel-stage table-operation-icon"><i class="glyphicon glyphicon-ban-circle"></i></a>' +
                        '<a title="关闭阶段" href="javascript:void(0)" class="close-stage table-operation-icon"><i class="glyphicon glyphicon-off"></i></a>' +
                        '{{/if}}' +
                        '{{if status == 4}}' +
                        '<a title="启动阶段" href="javascript:void(0)" class="start-stage table-operation-icon"><i class="glyphicon glyphicon-play-circle"></i></a>' +
                        '{{/if}}' +
                    '</td>' +
                '</tr>';
            $.template("projectStageTemplate", projectStageTemplate);

        },

        bindEvent: function() {
            //$("#add-project-page-nav a").on("hover", function() {
            //
            //});

            $("#to-project-manager").on("click", function() {
                ProjectManager.toProjectManager();
            });

            $container.on("click", ".to-center-manager", function() {
                var projectStage = $.tmplItem($(this)).data;
                StageCenterManager.load(currentProject, projectStage);
                ProjectManager.toCenterManager();
            });

            $container.on("click", ".close-stage", function() {
                var object = $.tmplItem($(this)).data;
                if (!window.confirm("您确定要关闭该阶段吗？"))
                    return;
                var reportId = currentProject.id + object.id;
                Ajax.call({
                    url: "closeReport",
                    p: {
                        type: "StageReport",
                        id: reportId
                    },
                    f: function(response) {
                        Notify.info("关闭阶段成功");
                        f.load(currentProject);
                    }
                });
            });
            $container.on("click", ".cancel-stage", function() {
                var projectStage = $.tmplItem($(this)).data;
                if (!window.confirm("您确定要取消该阶段吗？"))
                    return;
                Ajax.call({
                    url: "cancelProjectStage",
                    p: {
                        projectId: currentProject.id,
                        stageId: projectStage.id
                    },
                    f: function(response) {
                        Notify.info("取消阶段成功");
                        f.load(currentProject);
                    }
                });
            });
            $container.on("click", ".start-stage", function() {
                var projectStage = $.tmplItem($(this)).data;
                if (!window.confirm("您确定要启动该阶段吗？"))
                    return;
                Ajax.call({
                    url: "startProjectStage",
                    p: {
                        projectId: currentProject.id,
                        stageId: projectStage.id
                    },
                    f: function(response) {
                        Notify.info("启动阶段成功");
                        f.load(currentProject);
                    }
                });
            });
        },

        load: function(project) {
            currentProject = project;
            Ajax.call({
                url: "loadProjectStages",
                p: {
                    id: currentProject.id
                },
                f: function(response) {
                    f.render(response);
                }
            });
        },

        render: function(response) {
            $container.html($.tmpl("projectStageTemplate", response.list, {
                getStatusString: function (item) {
                    if (item.centerCount == 0)
                        return "";
                    return GlobalConstants.PROJECT_STAGE_STATUS[item.status];
                }
            }));
        },

        empty: null
    }
}();

$(document).ready(function() {
    ProjectStageManager.init();
});


