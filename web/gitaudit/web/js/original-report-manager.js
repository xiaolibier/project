/**
 * Created by zhouhaibin on 2016/9/19.
 */
var OriginalReportManager = function(){
    var f;
    var start = 0;
    var limit = 10;
    var $container = $("#original-report-container");
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
            $("#search").on("click", function(){
                f.load();
            });
        },

        initTemplate: function() {
            var originalReportTemplate =
                '<tr id="${id}">' +
                    '<td>${projectId}</td>' +
                    '<td>${projectName}</td>' +
                    '<td>${stageName}</td>' +
                    '<td><a href="originalReportDetail?id=${id}" title="点击进入原始版稽查记录表详情">${centerName}</a></td>' +
                    '<td>${Global.getMemberNames($item.data.memberIds)}</td>' +
                    '<td>${Global.getUserName($item.data.creatorId)}</td>' +
                    '<td>${created}</td>' +
                    '<td>' +
                        '<a title="详情" href="originalReportDetail?id=${id}" class="table-operation-icon center-report-detail"><i class="glyphicon glyphicon-list-alt"></i></a>' +
                    '</td>' +
                '</tr>';
            $.template("originalReportTemplate", originalReportTemplate);
        },

        load: function() {
            Ajax.call({
                url: "loadOriginalReports",
                p: {
                    scoreStatus: -1,
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
            $container.html($.tmpl("originalReportTemplate", result.list));

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
    OriginalReportManager.init();
});

