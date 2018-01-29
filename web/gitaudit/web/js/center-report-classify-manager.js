/**
 * Created by zhouhaibin on 2016/9/19.
 */
var CenterReportClassifyManager = function(){
    var STATUS_CLOSED = 5;//关闭

    var CLASSIFY_STATUS_UNREADY = 0;//未进入分级
    var CLASSIFY_STATUS_UNASSIGNED = 1;//未分级（未领取）
    var CLASSIFY_STATUS_ASSIGNED = 2;//分级中（已领取）
    var CLASSIFY_STATUS_SUBMITTED = 3;//已分级

    var f;
    var start = 0;
    var limit = 10;
    var mode;
    var $container = $("#report-container");
    return{
        init: function() {
            f = this;
            Global.initTableLayout();
            Header.activeMenu("check-manager");
            f.initTemplate();
            mode = Global.mode;
            if (mode == "all" && !Global.isUserSystemAdmin()) {
                //在待审区模式下，如果不是管理员，则只能看到待分配的
                $("#classify-status-select option[value='-1']").remove();
                $("#classify-status-select option[value='2']").remove();
                $("#classify-status-select option[value='3']").remove();
            }
            Global.initSelect($("#classify-status-select"));
            f.bindEvent();
            if (mode == "all") {
                $("#classify-status-select").select2("val", 1);
            } else {
                $("#classify-status-select").select2("val", 2);
            }
            f.load();
        },

        bindEvent: function() {
            $container.on("click", ".center-name", function () {
                var report = $.tmplItem($(this)).data;
                if (mode == "all" && report.classifyStatus == CLASSIFY_STATUS_UNASSIGNED && !Global.isUserSystemAdmin() && report.canceled == 0 && report.status != STATUS_CLOSED) {
                    alert("未领用状态下无法查看详情");
                    return;
                }
                ////1 如果是待审区，是未领用的，是非管理员，则询问是否领用
                //if (mode == "all" && report.classifyStatus == CLASSIFY_STATUS_UNASSIGNED && !Global.isUserSystemAdmin() && report.canceled == 0 && report.status != STATUS_CLOSED) {
                //    f.receiveReport(report);
                //    return;
                //}
                ////2 如果是我的项目，是待评审的，是非管理员，则进入评审页面
                //if (mode == "onlyMine" && report.classifyStatus == CLASSIFY_STATUS_ASSIGNED && !Global.isUserSystemAdmin() && report.canceled == 0 && report.status != STATUS_CLOSED){
                //    var url = "classifyCenterReport?id=" + report.id + "&type=" + Global.type;
                //    window.open(url, "_self");
                //    return;
                //}
                ////3 其他情况，都进入详情页面
                var url = "classifyDetailCenterReport?id=" + report.id + "&type=" + Global.type;
                window.open(url, "_self");
            });

            $("#search").on("click", function() {
                f.load();
            });
            $("#classify-status-select").on("change", function() {
                f.load();
            });
            $container.on("click", ".receive-center-report", function() {
                var report = $.tmplItem($(this)).data;
                f.receiveReport(report);
            });

            $container.on("click", ".sendback-center-report", function() {
                var report = $.tmplItem($(this)).data;
                if (!window.confirm("确认要退领此分级任务吗？"))
                    return;
                Ajax.call({
                    url: "sendbackClassifyCenterReport",
                    p: {
                        type: Global.type,
                        id: report.id
                    },
                    f: function(response) {
                        Notify.info("退领任务成功");
                        f.load();
                    }
                });
            });
        },

        initTemplate: function() {
            var centerReportTemplate =
                '<tr id="${id}">' +
                    '<td>${projectId}</td>' +
                    '<td>${projectName}</td>' +
                    '<td>${stageName}</td>' +
                    '<td>' +
                        '<a href="javascript:void(0)" class="center-name">${centerName}</a>' +
                    '</td>' +
                    '<td>${$item.getClassifyStatusString($item.data)}</td>' +
                    '<td>${Global.getUserName($item.data.classifyUserId)}</td>' +
                    '<td>${submittedToCheckTime}</td>' +
                    '<td>${classifyAssignedTime}</td>' +
                    '<td>${classifySubmittedTime}</td>' +
                    '<td>' +
                        '{{if classifyStatus == 1 && canceled == 0 && status != 5}}' +
                        '<a title="领取" href="javascript:void(0)" class="table-operation-icon receive-center-report"><i class="glyphicon glyphicon-download-alt"></i></a>' +
                        '{{/if}}' +
                        '{{if classifyStatus == 2 && canceled == 0 && status != 5}}' +
                        '<a title="退领" href="javascript:void(0)" class="table-operation-icon sendback-center-report"><i class="glyphicon glyphicon-transfer"></i></a>' +
                        '<a title="分级" href="classifyCenterReport?id=${id}&type=' + Global.type + '" class="table-operation-icon classify-center-report"><i class="glyphicon glyphicon-check"></i></a>' +
                        '{{/if}}' +
                        //'{{if classifyStatus == 3}}' +
                        '<a title="详情" href="classifyDetailCenterReport?id=${id}&type=' + Global.type + '" class="report-detail table-operation-icon"><i class="glyphicon glyphicon-list-alt"></i></a>' +
                        //'{{/if}}' +
                    '</td>' +
                '</tr>';
            $.template("centerReportTemplate", centerReportTemplate);
        },

        receiveReport: function(report) {
            if (!window.confirm("确认要领取此分级任务吗？"))
                return;
            Ajax.call({
                url: "receiveClassifyCenterReport",
                p: {
                    type: Global.type,
                    id: report.id
                },
                f: function(response) {
                    Notify.info("领取任务成功");
                    f.load();
                }
            });
        },

        load: function() {
            //var projectId = GlobalConstants.EMPTY_OBJECT;
            //var stageId = GlobalConstants.EMPTY_OBJECT;
            //var centerId = GlobalConstants.EMPTY_OBJECT;
            var classifyStatus = parseInt($("#classify-status-select").select2("val"));
            Ajax.call({
                url: "loadCenterReportsToClassify",
                p: {
                    //projectId: projectId,
                    //stageId: stageId,
                    //centerId: centerId,
                    type: Global.type,
                    keywords: $("#keywords").val(),
                    mode: mode,
                    classifyStatus: classifyStatus,
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
            $container.html($.tmpl("centerReportTemplate", result.list, {
                getClassifyStatusString: function (item) {
                    return GlobalConstants.CENTER_REPORT_CLASSIFY_STATUS[item.classifyStatus];
                }
            }));
            if (mode == "all") {
                //待审区模式下，没有分级和退领按钮
                $(".sendback-center-report.table-operation-icon").remove();
                $(".classify-center-report.table-operation-icon").remove();
                //如果不是分级员，则不能领用
                if (!Global.userHasPrivilege("CLASSIFY"))
                    $(".receive-center-report.table-operation-icon").remove();
            } else {
                $(".receive-center-report.table-operation-icon").remove();
            }
            //如果不是管理员，则不能看详情
            if (!Global.isUserSystemAdmin() && mode != 'onlyMine') {
                $(".report-detail.table-operation-icon").remove();
            }


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
    CenterReportClassifyManager.init();
});

