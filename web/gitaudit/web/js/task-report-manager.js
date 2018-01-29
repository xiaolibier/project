/**
 * Created by zhouhaibin on 2016/9/19.
 */
var TaskReportManager = function(){
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

            $("#search").trigger("click");
        },

        bindEvent: function() {
            $("#search").on("click", function() {
                f.load();
            });
            $("#task-report-container").on("click", ".create-original-report", function() {
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

        },

        initTemplate: function() {
            var taskReportTemplate =
                '<tr id="{$id}">' +
                    '<td>${projectId}</td>' +
                    '<td>${projectName}</td>' +
                    '<td>${stageName}</td>' +
                    '<td><a target="_blank" title="进入稽查记录表页面" href="taskReportDetail?id=${id}">${centerName}</a></td>' +
                    '<td>${$item.getStatusString($item.data)}</td>' +
                    '<td>${Global.getMemberNames($item.data.memberIds)}</td>' +
                    '<td>${projectCreated}</td>' +
                    '<td>' +
                        '<a title="详情" href="taskReportDetail?id=${id}" class="table-operation-icon"><i class="glyphicon glyphicon-list-alt"></i></a>' +
                        '{{if canceled == 0 && status != 5}}' +
                            '<a title="生成原始版稽查记录表" pid="EDIT_TASK_REPORT" href="javascript:void(0)" class="table-operation-icon create-original-report"><i class="glyphicon glyphicon-th-list"></i></a>' +
                        '{{/if}}' +
                    '</td>' +
                '</tr>';
            $.template("taskReportTemplate", taskReportTemplate);

        },

        load: function() {
            Ajax.call({
                url: "loadTasks",
                p: {
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
            $("#task-report-container").html($.tmpl("taskReportTemplate", result.list, {
                getStatusString: function (item) {
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
    TaskReportManager.init();
});

