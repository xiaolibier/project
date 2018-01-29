/**
 * Created by zhouhaibin on 2016/9/19.
 */
var ReportManager = function(){
    var STATUS_EDITING = 1;//报告填写中
    var STATUS_CHECKING = 2;//报告审阅中
    var STATUS_CORRECTING = 3;//审阅后修改
    var STATUS_SUBMITTED = 4;//报告已提交
    var STATUS_CLOSED = 5;//关闭
    var STATUS_SUBMITTED_MORE_THAN_48HOURS = 6;//提交超过48小时

    var f;
    var start = 0;
    var limit = 10;
    var $container = $("#report-container");
    return{
        init: function() {
            f = this;
            Global.initTableLayout();
            Header.activeMenu("task-manager");
            f.initTemplate();

            f.bindEvent();
            f.load();
        },

        bindEvent: function() {
            $("#search").on("click", function() {
                f.load();
            });
            $("#show-modify-records").on("click", function() {
                var url = "toModifyRecordManager?object=" + Global.type;
                window.open(url, "_blank");
                return false;
            });

            $container.on("click", ".submit-to-check", function() {
                var report = $.tmplItem($(this)).data;
                if (!window.confirm("确认要提交此报告审阅吗？"))
                    return;
                Ajax.call({
                    url: "submitReportToCheck",
                    p: {
                        type: Global.type,
                        id: report.id
                    },
                    f: function(response) {
                        Notify.info("提交报告审阅成功");
                        f.load();
                    }
                });
            });

            $container.on("click", ".submit-report", function() {
                var report = $.tmplItem($(this)).data;
                if (!window.confirm("确认要提交此报告吗？"))
                    return;
                Ajax.call({
                    url: "submitReport",
                    p: {
                        type: Global.type,
                        id: report.id
                    },
                    f: function(response) {
                        Notify.info("提交报告成功");
                        f.load();
                    }

                });
            });

            $container.on("click", ".submit-revoke", function() {
                var report = $.tmplItem($(this)).data;
                if (!window.confirm("确认要撤回提交吗？"))
                    return;
                Ajax.call({
                    url: "revokeReport",
                    p: {
                        type: Global.type,
                        id: report.id
                    },
                    f: function(response) {
                        Notify.info("撤回提交成功");
                        f.load();
                    }

                });
            });

            $container.on("click", ".close-report", function() {
                var report = $.tmplItem($(this)).data;
                if (!window.confirm("确认要关闭此报告吗？"))
                    return;
                Ajax.call({
                    url: "closeReport",
                    p: {
                        type: Global.type,
                        id: report.id
                    },
                    f: function(response) {
                        Notify.info("关闭报告成功");
                        f.load();
                    }
                });
            });
        },

        initTemplate: function() {
            var reportTemplate;
            if (Global.type == "CenterReport") {
                reportTemplate =
                    '<tr id="${id}">' +
                    '<td>${projectId}</td>' +
                    '<td>${projectName}</td>' +
                    '<td>${stageName}</td>' +
                    '<td><a href="reportDetail?id=${id}&type=' + Global.type + '">${centerName}</a></td>' +
                    '<td>${$item.getStatusString($item.data)}</td>' +
                    '<td>${Global.getMemberNames($item.data.memberIds)}</td>' +
                    '<td>${projectCreated}</td>' +
                    '<td>${Global.getUserName($item.data.creatorId)}</td>' +
                    '<td>${created}</td>' +
                    '<td>' +
                    '<a title="详情" href="reportDetail?id=${id}&type=' + Global.type + '" class="table-operation-icon report-detail"><i class="glyphicon glyphicon-list-alt"></i></a>' +
                    '{{if canceled == 0 && status != 5}}' +
                        '<a title="编辑" pid="EDIT_CENTER_REPORT" href="editReport?id=${id}&type=' + Global.type + '" class="table-operation-icon edit-report"><i class="glyphicon glyphicon-pencil"></i></a>' +
                        '{{if status != 7}}' +
                        '<a title="提交审阅" pid="EDIT_CENTER_REPORT" href="javascript:void(0)" class="table-operation-icon submit-to-check"><i class="glyphicon glyphicon-saved"></i></a>' +
                        '<a title="提交报告" pid="EDIT_CENTER_REPORT" href="javascript:void(0)" class="table-operation-icon submit-report"><i class="glyphicon glyphicon-open"></i></a>' +
                        '{{/if}}' +
                        '{{if status == 4}}' +
                        '<a title="撤回提交" pid="EDIT_CENTER_REPORT" href="javascript:void(0)" class="table-operation-icon submit-revoke"><i class="glyphicon glyphicon-backward"></i></a>' +
                        '{{/if}}' +
                        '<a title="打印" pid="PRINT" target="_blank" href="printReport?id=${id}&type=' + Global.type + '" class="table-operation-icon print-report"><i class="glyphicon glyphicon-print"></i></a>' +
                        '<a title="关闭" pid="EDIT_CENTER_REPORT" href="javascript:void(0)" class="table-operation-icon close-report"><i class="glyphicon glyphicon-off"></i></a>' +
                    '{{/if}}' +
                    '</td>' +
                    '</tr>';
            } else {
                reportTemplate =
                '<tr id="${id}">' +
                '<td>${projectId}</td>' +
                '<td><a href="reportDetail?id=${id}&type=' + Global.type + '">${projectName}</a></td>' +
                '<td>${stageName}</td>' +
                '<td>${$item.getStatusString($item.data)}</td>' +
                '<td>${Global.getUserName($item.data.leaderId)}</td>' +
                '<td>${created}</td>' +
                '<td>' +
                '<a title="详情" href="reportDetail?id=${id}&type=' + Global.type + '" class="table-operation-icon report-detail"><i class="glyphicon glyphicon-list-alt"></i></a>' +
                '{{if canceled == 0 && status != 5}}' +
                    '<a title="编辑" pid="EDIT_STAGE_REPORT" href="editReport?id=${id}&type=' + Global.type + '" class="table-operation-icon edit-report"><i class="glyphicon glyphicon-pencil"></i></a>' +
                    '{{if status != 7}}' +
                    '<a title="提交审阅" pid="EDIT_STAGE_REPORT" href="javascript:void(0)" class="table-operation-icon submit-to-check"><i class="glyphicon glyphicon-saved"></i></a>' +
                    '<a title="提交报告" pid="EDIT_STAGE_REPORT" href="javascript:void(0)" class="table-operation-icon submit-report"><i class="glyphicon glyphicon-open"></i></a>' +
                    '{{/if}}' +
                    '<a title="打印" pid="PRINT" target="_blank" href="printReport?id=${id}&type=' + Global.type + '" class="table-operation-icon print-report"><i class="glyphicon glyphicon-print"></i></a>' +
                    '<a title="关闭" pid="EDIT_STAGE_REPORT" href="javascript:void(0)" class="table-operation-icon close-report"><i class="glyphicon glyphicon-off"></i></a>' +
                '{{/if}}' +
                '</td>' +
                '</tr>';

            }
            $.template("reportTemplate", reportTemplate);
        },

        load: function() {
            Ajax.call({
                url: "loadReports",
                p: {
                    type: Global.type,
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
            $container.html($.tmpl("reportTemplate", result.list, {
                getStatusString: function (item) {
                    return GlobalConstants.REPORT_STATUS[item.status];
                }
            }));
            f.refreshButtonStatus();

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

        refreshButtonStatus: function() {
            $container.find("tr").each(function() {
                var $report = $(this);
                var report = $.tmplItem($report).data;
                switch(report.status) {
                    case STATUS_EDITING: {
                        $report.find(".submit-report").remove();
                        $report.find(".print-report").remove();
                        $report.find(".close-report").remove();
                    }
                        break;
                    case STATUS_CHECKING: {
                        $report.find(".edit-report").remove();
                        $report.find(".submit-to-check").remove();
                        $report.find(".submit-report").remove();
                        $report.find(".print-report").remove();
                        $report.find(".close-report").remove();
                    }
                        break;
                    case STATUS_CORRECTING: {
                        $report.find(".submit-to-check").remove();
                        $report.find(".print-report").remove();
                        $report.find(".close-report").remove();
                    }
                        break;
                    case STATUS_SUBMITTED: {
                        $report.find(".edit-report").remove();
                        $report.find(".submit-to-check").remove();
                        $report.find(".submit-report").remove();
                        $report.find(".print-report").remove();
                    }
                        break;
                    case STATUS_SUBMITTED_MORE_THAN_48HOURS: {
                        $report.find(".submit-to-check").remove();
                        $report.find(".submit-report").remove();
                        $report.find(".print-report").remove();
                    }
                        break;
                    case STATUS_CLOSED: {
                        $report.find(".edit-report").remove();
                        $report.find(".submit-to-check").remove();
                        $report.find(".submit-report").remove();
                        $report.find(".close-report").remove();
                    }
                        break;

                }
            });
        },

        empty: null
    }
}();

$(document).ready(function() {
    ReportManager.init();
});

