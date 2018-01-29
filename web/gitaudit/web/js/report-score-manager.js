/**
 * Created by zhouhaibin on 2016/9/19.
 */
var ReportScoreManager = function(){
    var f;
    var start = 0;
    var limit = 10;
    var $container = $("#report-container");
    return{
        init: function() {
            f = this;
            Global.initTableLayout();
            Header.activeMenu("task-manager");
            Global.initSelect($("#score-status"));
            f.initTemplate();
            f.bindEvent();
            f.load();
        },

        initTemplate: function() {
            var reportTemplate =
                '<tr id="{$id}">' +
                    '<td>${projectId}</td>' +
                    '<td>${projectName}</td>' +
                    '<td>${stageName}</td>' +
                    '<td><a target="_self" title="进入研究中心评价表详情页面" href="toReportScoreDetail?id=${id}">${centerName}</a></td>' +
                    '<td>${score}</td>' +
                    '<td>${$item.getScoreStatusString($item.data)}</td>' +
                    '<td>${Global.getUserName($item.data.scoreUserId)}</td>' +
                    '<td>${scoreTime}</td>' +
                    '<td>' +
                        '{{if canceled == 0 && closed == 0}}' +
                            '<a title="评估" pid="EDIT_REPORT_SCORE" href="toReportScoreDetail?id=${id}" class="table-operation-icon task-detail"><i class="glyphicon glyphicon-thumbs-up"></i></a>' +
                        '{{/if}}' +
                    '</td>' +
                '</tr>';
            $.template("reportTemplate", reportTemplate);

        },

        bindEvent: function() {
            $("#search").on("click", function() {
                f.load();
            });
        },

        load: function() {
            var scoreStatus = parseInt($("#score-status").select2("val"));
            Ajax.call({
                url: "loadOriginalReportsForScoring",
                p: {
                    scoreStatus: scoreStatus,
                    keywords: $("#keywords").val(),
                    start: start,
                    limit: limit
                },
                f: function(response) {
                    f.render(response.result);
                    Global.refreshControlsByPrivilege();
                }
            });
        },

        render: function(result) {
            $container.html($.tmpl("reportTemplate", result.list, {
                getScoreStatusString: function (item) {
                    return GlobalConstants.REPORT_SCORE_STATUS[item.scoreStatus];
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
    ReportScoreManager.init();
});

