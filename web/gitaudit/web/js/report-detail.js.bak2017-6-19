/**
 * Created by zhouhaibin on 2016/9/19.
 * 单中心报告的详情页，评审页，编辑页
 */
var ReportDetail = function(){
    var STATUS_EDITING = 1;//报告填写中
    var STATUS_CHECKING = 2;//报告审阅中
    var STATUS_CORRECTING = 3;//审阅后修改
    var STATUS_SUBMITTED = 4;//报告已提交
    var STATUS_CLOSED = 5;//关闭
    var STATUS_CANCELED = 6;//取消，内存状态，非数据库状态
    var STATUS_SUBMITTED_MORE_THAN_48HOURS = 7;//提交超过48小时

    var CHECK_STATUS_UNREADY = 0;//未进入评审
    var CHECK_STATUS_UNASSIGNED = 1;//未评审（未领取）
    var CHECK_STATUS_ASSIGNED = 2;//评审中（已领取）
    var CHECK_STATUS_SUBMITTED = 3;//已评审

    var MODE_DETAIL = "detail";
    var MODE_EDIT = "edit";
    var MODE_CHECK = "check";
    var MODE_EDIT_AFTER_CHECK = "editAfterCheck";

    var LETTER = "0abcdefghijklmnopqrstuvwxyz";

    var mode;
    var f;
    var taskId;
    var status;
    var checkStatus;
    var canEditReport = true;

    return{
        init: function() {
            f = this;
            mode = Global.mode;
            canEditReport = Global.canEditReport;
            if (Global.message) {//如果有警告信息，先显示信息
                Notify.info(Global.message);
            }
            $(".navbar-form").hide();

            ReportTemplate.initTemplate();
            f.bindEvent();
            f.load();
        },

        bindEvent: function() {
            $("#back").on("click", function() {
                f.unlock(function() {
                    var url = "toReportManager?type=" + Global.type;
                    if (mode == MODE_CHECK)
                        url = "toMyReportCheckManager?type=" + Global.type;
                    window.open(url, "_self");
                });
                return false;
            });

            $("#print").on("click", function() {
                var url = "printReport/" + Global.type + "/" + Global.reportId;
                window.open(url, '_blank');
                return false;
            });

            $("#submit").on("click", function() {
                f.saveCurrentEditingFirst(function() {
                    if (!window.confirm("确认要提交此报告吗？"))
                        return false;
                    Ajax.call({
                        url: "submitReport",
                        p: {
                            type: Global.type,
                            id: Global.reportId
                        },
                        f: function(response) {
                            window.open("toReportManager?type=" + Global.type, "_self");
                        }

                    });
                    return false;
                });
                return false;
            });

            $("#submit-to-check").on("click", function() {
                f.saveCurrentEditingFirst(function() {
                    f.submitToCheck();
                    return false;
                });
                return false;
            });

            $("#check-submit").on("click", function() {
                f.saveCurrentEditingFirst(function() {
                    if (!window.confirm("确认完成全部评审后进行提交，确认提交后，将无法再次输入审评意见"))
                        return false;
                    Ajax.call({
                        url: "checkSubmitReport",
                        p: {
                            type: Global.type,
                            id: Global.reportId
                        },
                        f: function(response) {
                            window.open("toMyReportCheckManager?type=" + Global.type, "_self");
                        }
                    });
                    return false;
                });
                return false;
            });

            $("#edit").on("click", function() {
                var url = "editReport?id=" + Global.reportId + "&type=" + Global.type;
                window.open(url, "_self");
                return false;
            });

            $("#show-discovery-not-in-report").on("click", function() {
                var url = "toDiscoveryList?taskId=" + taskId + "&type=" + Global.type;
                window.open(url, "_blank");
                return false;
            });

            $("#detail").on("click", function() {
                f.unlock(function() {
                    var url = "reportDetail?id=" + Global.reportId + "&type=" + Global.type;
                    window.open(url, "_self");
                });
                return false;
            });

            //修改发现（弹出对话框）
            $(".page-container").on("click", ".edit-discovery", function() {
                var id = $(this).parents(".discovery-item").attr("id");
                f.saveCurrentEditingFirst(function() {
                    f.editDiscovery(id);
                });
            });

            //建议已处理
            $(".page-container").on("click", ".editable .opinion-accepted", function() {
                var $checkbox = $(this);
                var $parent = $(this).parents(".editable");
                f.saveCurrentEditingFirst(function() {
                    var itemId = $parent.attr("itemId");
                    var fieldId = $parent.attr("fieldId");
                    var opinionAccepted = $checkbox.prop("checked");
                    Ajax.call({
                        url: "saveOpinionAccepted",
                        p: {
                            type: Global.type,
                            reportId: Global.reportId,
                            itemId: itemId,
                            fieldId: fieldId,
                            opinionAccepted: opinionAccepted
                        },
                        f: function(response) {
                            f.renderOpinionColor();
                        }
                    });
                });
            });

            //编辑
            $(".page-container").on("click", ".editable .edit-button", function() {
                var $thisElement = $(this).parents(".editable");
                f.saveCurrentEditingFirst(function() {
                    f.edit($thisElement);
                });
            });

            //添加依据
            $(".page-container").on("click", ".add-reference", function() {
                var $container = $(this).parent().find(".reference-container");
                f.saveCurrentEditingFirst(function() {
                    f.addReference($container);
                });
            });

            //删除依据
            $(".page-container").on("click", ".editable .delete-reference", function() {
                var $parent = $(this).parents(".editable");
                f.saveCurrentEditingFirst(function() {
                    f.deleteReference($parent);
                });
            });

            //重置问题归类
            $(".page-container").on("click", ".reset-button", function() {
                var $parent = $(this).parents(".editable");
                f.saveCurrentEditingFirst(function() {
                    var itemId = $parent.attr("itemId");
                    var fieldId = $parent.attr("fieldId");
                    Ajax.call({
                        url: "resetProblem",
                        p: {
                            type: Global.type,
                            reportId: Global.reportId,
                            itemId: itemId
                        },
                        f: function(response) {
                            var problemName = response.problemName;
                            $parent.find(".detail-content").html(problemName);
                        }
                    });
                });
            });

            //保存
            $(".page-container").on("click", ".editable .save-button", function() {
                var $parent = $(this).parents(".editable");
                f.save($parent);
            });
        },

        unlock: function(callback) {
            Ajax.call({
                url: "endEditReport",
                p: {
                    id: Global.reportId
                },
                f: function(response) {
                    if (callback)
                        callback();
                }
            });
        },

        edit: function($element) {
            $element.find(".detail-control").hide();
            $element.find(".edit-control").show();
            $element.attr("mode", MODE_EDIT);
            var html = $element.find(".detail-content").html();
            var text = f.convertMultiLineHtmlToText(html);
            $element.find(".edit-content").val(text).focus();
        },

        submitToCheck: function() {
            if (!window.confirm("确认要提交此报告审阅吗？"))
                return;
            Ajax.call({
                url: "submitReportToCheck",
                p: {
                    type: Global.type,
                    id: Global.reportId
                },
                f: function(response) {
                    window.open("toReportManager?type=" + Global.type, "_self");
                }
            });
        },

        saveCurrentEditingFirst: function(callback, callbackPara) {
            var $lastEditingElement = $(".editable[mode='" + MODE_EDIT + "']");
            if ($lastEditingElement.length > 0) {
                f.save($lastEditingElement, callback, callbackPara);
            } else {
                if (callback)
                    callback(callbackPara);
            }
        },

        save: function($element, callback, callbackPara) {
            var itemId = $element.attr("itemId");
            var fieldId = $element.attr("fieldId");
            var opinion = $element.attr("opinion") == "true";
            var value = $element.find(".edit-control").val();
            var text = f.convertMultiLineHtmlToText($element.find(".detail-content").html());
            if (value == text) {
                $element.find(".detail-control").show();
                $element.find(".edit-control").hide();
                $element.attr("mode", MODE_DETAIL);
                if (callback)
                    callback(callbackPara);
                return;
            }
            Ajax.call({
                url: "saveReportValue",
                p: {
                    type: Global.type,
                    reportId: Global.reportId,
                    itemId: itemId,
                    fieldId: fieldId,
                    opinion: opinion,
                    value: value
                },
                f: function(response) {
                    $element.find(".detail-control").show();
                    $element.find(".edit-control").hide();
                    var value = $element.find(".edit-content").val();
                    if (value != '')
                        $element.find(".opinion-label").show();
                    else
                        $element.find(".opinion-label").hide();
                    f.renderMultiLineText($element.find(".detail-content"), value);
                    $element.attr("mode", MODE_DETAIL);
                    if (callback)
                        callback(callbackPara);
                }
            });
        },

        editDiscovery: function(id) {
            Ajax.call({
                url: "loadDiscovery",
                p: {
                    type: Global.type,
                    id: id
                },
                f: function(response) {
                    EditDiscoveryDialog.show({
                        discovery: response.item,
                        callback: function(discovery) {
                            Ajax.call({
                                url: "saveDiscoveryFromReport",
                                p: {
                                    reportId: Global.reportId,
                                    reportType: Global.type,
                                    discovery: discovery
                                },
                                f: function(response) {
                                    Notify.info("保存成功,修改的数据需要刷新页面才能显示");
                                }
                            });
                        }
                    });

                }
            });
        },

        addReference: function($container) {
            var $problem = $container.parents(".problem-item");
            var problemId = $problem.attr("problemId");
            SelectReferenceDialog.show({
                problemId: problemId,
                callback: function(selectedReferences, $container) {
                    var references = [];
                    for (var i = 0; i < selectedReferences.length; i ++) {
                        var referenceId = selectedReferences[i].id;
                        if ($container.find(".reference-item[referenceId='" + referenceId + "']").length > 0) {
                            alert("选择的参考依据已经在报告中，请重新选择。");
                            return;
                        }
                        references.push({
                            id: $problem.attr("id") + "_" + referenceId,
                            referenceId: referenceId,
                            name: selectedReferences[i].name
                        });
                    }
                    $.tmpl("referenceTemplate", references).appendTo($container);
                    $container.find(".edit-control").hide();
                    $container.find(".detail-control").show();
                    f.saveReferences($container, function() {
                    });
                },
                callbackPara: $container
            });
        },

        saveReferences: function($container, callback) {
            var references = [];
            $(".reference-item").each(function() {
                var id = $(this).attr("itemId");
                var name = $(this).find(".detail-content").html();
                references.push({
                    id: id,
                    name: name
                });
            });
            Ajax.call({
                url: "saveReferences",
                p: {
                    type: Global.type,
                    reportId: Global.reportId,
                    references: references
                },
                f: function(response) {
                    if (callback)
                        callback();
                }
            });

        },

        deleteReference: function($reference) {
            var $container = $reference.parents(".reference-container");
            $reference.remove();
            f.saveReferences($container, function() {
                Notify.info("删除成功");
            });
        },

        refreshButtons: function() {
            if (!canEditReport) {
                $("#submit").remove();
                $("#check-submit").remove();
                $("#submit-to-check").remove();
                $("#show-discovery-not-in-report").remove();
                $("#back").remove();
            }
            switch(status) {
                case STATUS_EDITING: {
                    $("#submit").remove();
                    $("#check-submit").remove();
                    $("#print").remove();
                    if (mode == MODE_DETAIL) {
                        $("#detail").remove();
                    } else {
                        $("#edit").remove();
                    }
                }
                    break;
                case STATUS_CHECKING: {
                    $("#detail").remove();
                    $("#edit").remove();
                    $("#submit-to-check").remove();
                    $("#submit").remove();
                    $("#show-discovery-not-in-report").remove();
                    $("#print").remove();
                    if (mode == MODE_DETAIL) {
                        $("#check-submit").remove();
                    }
                    if (checkStatus == CHECK_STATUS_SUBMITTED) {
                        $("#check-submit").remove();
                    }
                }
                    break;
                case STATUS_CORRECTING: {
                    $("#submit-to-check").remove();
                    $("#check-submit").remove();
                    if (mode == MODE_DETAIL) {
                        $("#detail").remove();
                    } else if (mode == MODE_EDIT_AFTER_CHECK) {
                        $("#edit").remove();
                    } else if (mode == MODE_CHECK) {
                        $("#detail").remove();
                        $("#edit").remove();
                        $("#submit").remove();
                        $("#show-discovery-not-in-report").remove();
                        $("#print").remove();
                    }
                }
                    break;
                case STATUS_SUBMITTED:
                case STATUS_CLOSED: {
                    $("#detail").remove();
                    $("#edit").remove();
                    $("#submit-to-check").remove();
                    $("#submit").remove();
                    $("#check-submit").remove();
                    $("#show-discovery-not-in-report").remove();
                    $("#back").remove();
                    if (mode == MODE_CHECK)
                        $("#print").remove();
                }
                    break;
                case STATUS_SUBMITTED_MORE_THAN_48HOURS: {
                    $("#submit-to-check").remove();
                    $("#submit").remove();
                    $("#check-submit").remove();
                    if (mode == MODE_DETAIL) {
                        $("#detail").remove();
                    } else if (mode == MODE_EDIT_AFTER_CHECK){
                        $("#edit").remove();
                    } else if (mode == MODE_CHECK) {
                        $("#detail").remove();
                        $("#edit").remove();
                        $("#print").remove();
                        $("#show-discovery-not-in-report").remove();
                    }
                }
                    break;
            }
            $(".navbar-form").show();
        },

        refreshControlStatus: function() {
            $(".editable .edit-control").hide();
            $(".editable .save-button").hide();
            if ( mode == MODE_DETAIL) {
                $(".edit-button").remove();
                $(".edit-discovery").remove();
                $(".reset-button").remove();
                $(".opinion-accepted").remove();
                $(".opinion-flag").remove();
                $(".add-reference").remove();
                $(".delete-reference").remove();
                $(".editable[opinion='true']").remove();
                $(".level2").remove();
            } else if (mode == MODE_EDIT) {
                $(".opinion-accepted").remove();
                $(".opinion-flag").remove();
                $(".editable[opinion='true']").remove();
                //$(".level2").remove();
            } else if (mode == MODE_CHECK) {
                $(".editable[opinion='false'] .edit-button").remove();
                $(".edit-discovery").remove();
                $(".reset-button").remove();
                $(".opinion-accepted").remove();
                $(".opinion-flag").remove();
                $(".add-reference").remove();
                $(".delete-reference").remove();
                if (checkStatus == CHECK_STATUS_SUBMITTED || Global.readonly || !canEditReport) {
                    $(".editable[opinion='true'] .edit-button").remove();
                }
                $(".level2").remove();
            } else if (mode == MODE_EDIT_AFTER_CHECK) {
                $(".editable[opinion='true'] .edit-button").remove();
                //没有评审意见的，不显示“建议已处理”
                $(".editable[opinion=true] .detail-content").each(function() {
                    var opinion = $(this).html();
                    if (opinion == '') {
                        var $parent = $(this).parents(".editable");
                        var itemId = $parent.attr("itemId");
                        var $parent2 = $(".editable[itemId='" + itemId + "'][opinion='false']");
                        $parent2.find(".opinion-accepted").remove();
                        $parent2.find(".opinion-flag").remove();
                    }
                });
            }

            $(".opinion-label").each(function() {
                var $parent = $(this).parents(".editable");
                var opinion = $parent.find(".detail-content").html();
                if (opinion == '')
                    $(this).hide();
                else
                    $(this).show();
            });
        },

        load: function() {
            Ajax.call({
                url: "loadReport",
                p: {
                    type: Global.type,
                    id: Global.reportId,
                    mode: Global.mode
                },
                f: function(response) {
                    f.render(response);
                    Global.refreshControlsByPrivilege();
                }
            });

        },

        renderMultiLineText: function($control, text) {
            if (!text)
                $control.html('');
            else {
                text = text.replaceAll('\r\n', '<br>');
                text = text.replaceAll('\n', '<br>');
                $control.html(text);
            }
        },

        convertMultiLineHtmlToText: function(html) {
            if (!html)
                return "";
            var text = html;
            text = text.replaceAll('<br>', '\n');
            return text;
        },

        render: function(response) {
            taskId = response.taskId;
            status = response.status;
            checkStatus = response.checkStatus;
            f.refreshButtons();
            var view = response.view;
            $(".project-id").html(view.projectId);
            f.renderMultiLineText($("#project-purpose"), view.purpose);
            f.renderMultiLineText($("#project-range"), view.range);
            f.renderMultiLineText($("#project-foundation"), view.foundation);
            f.renderMultiLineText($("#report-overview .detail-content"), view.overview);
            f.renderMultiLineText($("#report-overview-opinion .detail-content"), view.overviewOpinion);
            $("#report-overview").attr("itemId", view.id);
            $("#report-overview-opinion").attr("itemId", view.id);

            f.renderDiscoveries(view);
            f.renderDiscoveriesCount(view, response.mainCategories);
            f.renderOpinionAccepted(response);
            f.renderOpinionColor();
            if (Global.type == "CenterReport")
                $(".stage").remove();

            f.refreshControlStatus();
        },

        renderOpinionAccepted: function(response) {
            var opinionAcceptedMap = response.opinionAcceptedMap
            $(".opinion-accepted").each(function() {
                var itemId = $(this).parents(".editable").attr("itemId");
                var fieldId = $(this).parents(".editable").attr("fieldId");
                if (fieldId != "description") {
                    var opinionAccepted = opinionAcceptedMap[itemId];
                    $(this).prop("checked", opinionAccepted == "true");
                }
            });
        },

        //模板里用到的函数
        getHanziNumber: function(index) {
            var hanziNumber = ["", "一", "二", "三"];
            return hanziNumber[index];
        },

        //模板里用到的函数
        getCenterCode: function(discovery) {
            if (Global.type == "StageReport")
                return "（" + discovery.centerCode + "中心）";
            else
                return "";
        },

        //模板里用到的函数
        getLetter: function(index) {
            return LETTER.substring(index, index + 1);
        },

        renderDiscoveries: function(view) {
            $("#discovery-container").html($.tmpl("discoveryTemplate", view.levelViews));
            for (var i = 0; i < view.levelViews.length; i ++) {
                var levelView = view.levelViews[i];
                for (var j = 0; j < levelView.problemViews.length; j ++) {
                    var problemView = levelView.problemViews[j];
                    for (var k = 0; k < problemView.patientViews.length; k ++) {
                        var patientView = problemView.patientViews[k];
                        for (var l = 0; l < patientView.discoveryViews.length; l ++) {
                            var discovery = patientView.discoveryViews[l];
                            var $discovery = $("#" + discovery.id);
                            f.renderMultiLineText($discovery.find(".discovery-description"), discovery.description);
                            f.renderMultiLineText($discovery.find(".discovery-description-opinion"), discovery.descriptionOpinion);
                            var color;
                            $discovery.find(".opinion-accepted").prop("checked", discovery.descriptionOpinionAccepted == 1);

                            if (discovery.level == discovery.level2) {
                                color = "green";
                            } else {
                                if (discovery.level2Accepted) {
                                    color = "orange";
                                } else {
                                    color = "red";
                                }
                            }
                            $discovery.find(".level2").css("color", color);
                            if (discovery.level2 == undefined || discovery.level2 == null || discovery.level2 == "") {
                                $discovery.find(".level2").hide();
                            }
                        }
                    }
                }
            }
        },

        renderOpinionColor: function() {
            $(".opinion-accepted").each(function() {
                var opinionAccepted = $(this).prop("checked");
                var $parent = $(this).parents(".editable");
                var itemId = $parent.attr("itemId");
                var fieldId = $parent.attr("fieldId");
                var $opinion = $(".editable[opinion='true'][fieldId='" + fieldId + "'][itemId='" + itemId + "'] .detail-content");
                var color = opinionAccepted ? "green" : "red";
                $opinion.css("color", color);
            });
        },

        renderDiscoveriesCount: function(view, mainCategories) {
            var html = [];
            for (var i = 0; i < mainCategories.length; i ++) {
                var mainCategory = mainCategories[i];
                for (var j = 0; j < mainCategory.categoryIds.length; j ++) {
                    html.push('<tr>');
                    if (j == 0) {
                        html.push('<td rowspan="' + mainCategory.categoryIds.length + '" align="center" class="font-hwfs-10">' + mainCategory.name + '</td>');
                    }
                    var categoryId = mainCategory.categoryIds[j];
                    html.push('<td align="center" class="font-hwfs-10">' + mainCategory.categoryNames[j] + '</td>');
                    html.push('<td class="discovery-count font-hwfs-10" categoryId="' + categoryId + '" level="严重问题" align="center"></td>');
                    html.push('<td class="discovery-count font-hwfs-10" categoryId="' + categoryId + '" level="主要问题" align="center"></td>');
                    html.push('<td class="discovery-count font-hwfs-10" categoryId="' + categoryId + '" level="一般问题" align="center"></td>');
                    if (Global.type == "StageReport") {
                        html.push('<td class="center-type" categoryId="' + categoryId + '" align="center" class="font-hwfs-10"></td>');
                    }
                    html.push('</tr>');
                }

            }
            $("#discovery-count-container").html(html.join(''));
            $(".discovery-count").each(function() {
                var $td = $(this);
                var categoryId = $td.attr("categoryId");
                var level = $td.attr("level");
                var count = "/";
                if (view.categoryLevelCountMap[categoryId] != undefined) {
                    if (view.categoryLevelCountMap[categoryId].levelCountMap[level] != undefined)
                        count = view.categoryLevelCountMap[categoryId].levelCountMap[level];
                }
                $td.html(count);
            });
            $(".center-type").each(function() {
                var $td = $(this);
                var categoryId = $td.attr("categoryId");
                var centerType = '';
                if (view.categoryLevelCountMap[categoryId] != undefined) {
                    centerType = view.categoryLevelCountMap[categoryId].centerType;
                }
                $td.html(centerType);
            });
            $(".level-count").each(function() {
                var level = $(this).attr("level");
                var count = 0;
                if (view.levelCountMap[level] != undefined) {
                    count = view.levelCountMap[level];
                }
                $(this).html(count);
            });
        },

        empty: null
    }
}();

$(document).ready(function() {
    ReportDetail.init();
});

