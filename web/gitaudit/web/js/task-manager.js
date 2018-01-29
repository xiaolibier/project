/**
 * Created by zhouhaibin on 2016/9/19.
 */
var TaskManager = function(){
    var f;
    var start = 0;
    var limit = 10;
    return{
        init: function() {
            f = this;
            Global.initTableLayout();
            Header.activeMenu("task-manager");
            f.initTemplate();

            Global.initSelect($("select"));
            f.bindEvent();

            f.load();
        },

        bindEvent: function() {
            $("#show-modify-records").on("click", function() {
                var url = "toModifyRecordManager?object=Task";
                window.open(url, "_blank");
                return false;
            });
            $("#search").on("click", function() {
                f.load();
            });
            $("#task-container").on("click", ".create-original-report", function() {
                var task = $.tmplItem($(this)).data;
                if (!window.confirm("您确定要生成原始记录表吗？"))
                    return;
                Ajax.call({
                    url: "createOriginalReport",
                    p: {
                        id: task.id
                    },
                    f: function(response) {
                        Notify.info("生成原始记录表成功");
                    }
                });
            });
            $("#task-container").on("click", ".create-center-report", function() {
                var task = $.tmplItem($(this)).data;
                if (!window.confirm("您确定要生成单中心报告吗？"))
                    return;
                Ajax.call({
                    url: "createCenterReport",
                    p: {
                        id: task.id
                    },
                    f: function(response) {
                        Notify.info("生成单中心报告成功");
                        f.load();
                    }
                });

            });
            $("#task-container").on("click", ".create-stage-report", function() {
                var task = $.tmplItem($(this)).data;
                if (!window.confirm("您确定要生成项目阶段报告吗？"))
                    return;
                Ajax.call({
                    url: "createStageReport",
                    p: {
                        id: task.id
                    },
                    f: function(response) {
                        Notify.info("生成项目阶段报告成功");
                    }
                });

            });
        },

        initTemplate: function() {
            var taskTemplate =
                '<tr id="{$id}">' +
                    '<td>${projectId}</td>' +
                    '<td>${projectName}</td>' +
                    '<td>${stageName}</td>' +
                    '<td><a target="_blank" title="进入稽查模块列表页面" href="toTaskDetail?id=${id}">${centerName}</a></td>' +
                    '<td>${$item.getStatusString($item.data)}</td>' +
                    '<td>${Global.getMemberNames($item.data.memberIds)}</td>' +
                    '<td>${projectCreated}</td>' +
                    '<td>' +
                        '<a title="详情" href="toTaskDetail?id=${id}" class="table-operation-icon task-detail"><i class="glyphicon glyphicon-list-alt"></i></a>' +
                        '{{if canceled == 0 && status != 5}}' +
                            '<a title="生成原始版稽查记录表" pid="EDIT_TASK" href="javascript:void(0)" class="table-operation-icon create-original-report"><i class="glyphicon glyphicon-th-list"></i></a>' +
                            '<a title="生成单中心报告" pid="EDIT_TASK" href="javascript:void(0)" class="table-operation-icon create-center-report"><i class="glyphicon glyphicon-file"></i></a>' +
                        '{{/if}}' +
                    '</td>' +
                '</tr>';
            $.template("taskTemplate", taskTemplate);

        },

        load: function() {
            Ajax.call({
                url: "loadTasks",
                p: {
                    projectId: "",
                    stageId: "",
                    centerId: "",
                    keywords: $("#keywords").val(),
                    start: start,
                    limit: limit
                },
                f: function(response) {
                    f.render(response.result);
                    Global.refreshControlsByPrivilege();
                }
            })
        },

        render: function(result) {
            $("#task-container").html($.tmpl("taskTemplate", result.list, {
                getStatusString: function (item) {
                    if (item.canceled)
                        return GlobalConstants.REPORT_STATUS[6];
                    return GlobalConstants.REPORT_STATUS[item.status];
                }
            }));
            $("#pagination").MyPagination({
                currentPage: result.currentPage,
                resultsPerPage: result.limit,
                totalPage: result.totalPage,
                totalCount: result.totalCount,
                callback: {
                    onGotoPage:function(para) {
                        limit = para.limit;
                        start = (para.page - 1) * limit;
                        f.load();
                    }
                }
            });
        },


        empty: null
    }
}();

$(document).ready(function() {
    TaskManager.init();
});

