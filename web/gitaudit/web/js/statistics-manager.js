/**
 * Created by zhouhaibin on 2016/9/19.
 */
var StatisticsManager = function(){
    var f;
    return{
        init: function() {
            f = this;
            Global.initTableLayout();
            Header.activeMenu("system-manager");
            f.initTemplate();
            f.bindEvent();
            $("#report-nav li[report='member-report'] a").trigger("click");
        },

        initTemplate: function() {
            var objectTemplate =
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
                '<a title="生成原始版稽查记录表" href="javascript:void(0)" class="table-operation-icon create-original-report"><i class="glyphicon glyphicon-th-list"></i></a>' +
                '<a title="生成单中心报告" href="javascript:void(0)" class="table-operation-icon create-center-report"><i class="glyphicon glyphicon-file"></i></a>' +
                '<a title="删除" href="javascript:void(0)" class="table-operation-icon delete-task"><i class="glyphicon glyphicon-remove-circle"></i></a>' +
                    //'<a title="生成项目阶段报告" href="javascript:void(0)" style="display:inline-block;margin-right:6px;" class="create-stage-report"><i class="glyphicon glyphicon-duplicate"></i></a>' +
                    //'<a title="查看稽查记录表" href="toTaskReport?id=${id}" style="display:inline-block;margin-right:6px;" class="view-task-report"><i class="glyphicon glyphicon-eye-open"></i></a>' +
                '</td>' +
                '</tr>';
            $.template("objectTemplate", objectTemplate);

        },

        bindEvent: function() {
            $("#report-nav li a").on("click", function() {
                $("#report-nav li").removeClass("active");
                $(this).parent().addClass("active");
                $(".report").hide();
                $(".report[report='" + $(this).parent().attr("report") + "']").show();
                f.load();
            });

            $("#search").on("click", function() {
                f.load();
            });
        },

        load: function() {
            var dateFrom = $("#dateFrom").val();
            var dateTo = $("#dateTo").val();
            var reportType = $("#report-nav li.active").attr("report");
            if (reportType == "member-report") {
                Ajax.call({
                    url: "loadMemberReport",
                    p: {
                        dateFrom: dateFrom,
                        dateTo: dateTo
                    },
                    f: function(response) {
                        f.renderMemberReport(response);
                    }
                });
            } else if (reportType == "checker-report") {
                Ajax.call({
                    url: "loadCheckerReport",
                    p: {
                        dateFrom: dateFrom,
                        dateTo: dateTo
                    },
                    f: function(response) {
                        f.renderCheckerReport(response);
                    }
                });

            }
        },

        renderMemberReport: function(response) {
            var columns = [];
            $("#member-report th").each(function() {
                columns.push({
                    id: $(this).html(),
                    merge: $(this).attr("merge") == "true"
                });
            });
            var html = [];
            var $container = $("#member-report-container");
            var list = response.list;
            for (var i = 0; i < list.length; i ++) {
                var view = list[i];
                html.push('<tr>');
                for (var j = 0; j < columns.length; j++) {
                    var column = columns[j];
                    if (column.merge) {
                        if (view.rowspan > 0) {
                            html.push('<td rowspan="' + view.rowspan + '">');
                            html.push(view[column.id]);
                            html.push('</td>');
                        }
                    } else {
                        html.push('<td>');
                        html.push(view[column.id]);
                        html.push('</td>');
                    }
                }
                html.push('</tr>');
            }
            $container.html(html.join(''));
        },

        renderCheckerReport: function(response) {
            var columns = [];
            $("#checker-report th").each(function() {
                columns.push({
                    id: $(this).html()
                });
            });
            var html = [];
                var $container = $("#checker-report-container");
            var list = response.list;
            for (var i = 0; i < list.length; i ++) {
                var view = list[i];
                html.push('<tr>');
                for (var j = 0; j < columns.length; j++) {
                    var column = columns[j];
                    html.push('<td>');
                    html.push(view[column.id]);
                    html.push('</td>');
                }
                html.push('</tr>');
            }
            $container.html(html.join(''));
        },
        empty: null
    }
}();

$(document).ready(function() {
    StatisticsManager.init();
});

