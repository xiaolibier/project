var StageCenterManager = function(){
    var f;
    var $container = $("#stage-center-container");
    var currentProject;
    var currentProjectStage;
    return{
        init: function() {
            f = this;
            f.initTemplate();
            f.bindEvent();
        },

        initTemplate: function() {
            var stageCenterManagerTemplate =
                '<tr>' +
                '<td>${code}</td>' +
                '<td>${name}</td>' +
                '<td>${stageName}</td>' +
                '<td>${$item.getStatusString($item.data)}</td>' +
                '<td>${leaderName}</td>' +
                '<td>${projectCreated}</td>' +
                '<td>' +
                '{{if status != 6 && status != 5}}' +
                '<a title="取消中心" href="javascript:void(0)" class="cancel-stage-center table-operation-icon"><i class="glyphicon glyphicon-ban-circle"></i></a>' +
                '<a title="关闭报告" href="javascript:void(0)" class="close-report table-operation-icon"><i class="glyphicon glyphicon-off"></i></a>' +
                '{{/if}}' +
                '{{if status == 6}}' +
                '<a title="启动中心" href="javascript:void(0)" class="start-stage-center table-operation-icon"><i class="glyphicon glyphicon-play-circle"></i></a>' +
                '{{/if}}' +
                '</td>' +
                '</tr>';
            $.template("stageCenterManagerTemplate", stageCenterManagerTemplate);

        },

        bindEvent: function() {
            $("#to-stage-manager").on("click", function() {
                ProjectManager.toStageManager();
            });

            $container.on("click", ".close-report", function() {
                var stageCenter = $.tmplItem($(this)).data;
                if (!window.confirm("您确定要关闭该报告吗？"))
                    return;
                var reportId = stageCenter.Id;
                Ajax.call({
                    url: "closeReport",
                    p: {
                        type: "CenterReport",
                        id: reportId
                    },
                    f: function(response) {
                        Notify.info("关闭报告成功");
                        f.load(currentProject, currentProjectStage);
                    }
                });
            });
            $container.on("click", ".cancel-stage-center", function() {
                var stageCenter = $.tmplItem($(this)).data;
                if (!window.confirm("您确定要取消该中心吗？"))
                    return;
                Ajax.call({
                    url: "cancelStageCenter",
                    p: {
                        projectId: currentProject.id,
                        stageId: currentProjectStage.id,
                        centerId: stageCenter.centerId
                    },
                    f: function(response) {
                        Notify.info("取消中心成功");
                        f.load(currentProject, currentProjectStage);
                    }
                });
            });
            $container.on("click", ".start-stage-center", function() {
                var stageCenter = $.tmplItem($(this)).data;
                if (!window.confirm("您确定要启动该中心吗？"))
                    return;
                Ajax.call({
                    url: "startStageCenter",
                    p: {
                        projectId: currentProject.id,
                        stageId: currentProjectStage.id,
                        centerId: stageCenter.centerId
                    },
                    f: function(response) {
                        Notify.info("启动中心成功");
                        f.load(currentProject, currentProjectStage);
                    }
                });
            });
        },

        load: function(project, projectStage) {
            currentProject = project;
            currentProjectStage = projectStage;
            Ajax.call({
                url: "loadStageCenters",
                p: {
                    projectId: currentProject.id,
                    stageId: currentProjectStage.id,
                },
                f: function(response) {
                    f.render(response);
                }
            });
        },

        render: function(response) {
            $container.html($.tmpl("stageCenterManagerTemplate", response.list, {
                getStatusString: function (item) {
                    return GlobalConstants.REPORT_STATUS[item.status];
                }
            }));
        },

        empty: null
    }
}();

$(document).ready(function() {
    StageCenterManager.init();
});


