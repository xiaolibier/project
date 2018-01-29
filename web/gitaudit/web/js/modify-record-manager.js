/**
 * Created by zhouhaibin on 2016/9/19.
 */
var ObjectManager = function(){
    var f;
    var start = 0;
    var limit = 10;
    var $container = $("#modifyRecord-container");
    return{
        init: function() {
            f = this;
            Global.initTableLayout();
            Header.activeMenu("task-manager");
            f.initTemplate();
            f.initControls();
            f.bindEvent();
            f.load();
        },

        initControls: function() {
            var $target = $("#target");
            if (Global.object == "Task") {
                for (var i = 0; i < Global.allModules.length; i++) {
                    var module = Global.allModules[i];
                    $target.append('<option value="' + module.id + '">' + module.name + '</option>');
                }
            }
            $target.append('<option value="overview">稽查概述</option>');
            $target.append('<option value="problem">问题归类</option>');
            $target.append('<option value="reference">依据</option>');

            var $category = $("#category");
            for (var i = 0; i < Global.allCategories.length; i ++) {
                var category = Global.allCategories[i];
                $category.append('<option value="' + category.id + '">' + category.name + '</option>');
            }

            Global.initSelect($("#target"));
            Global.initSelect($("#operation"));
            Global.initSelectWithSearch($("#category"));
            Global.initDatePicker($(".date-picker"));
        },

        initTemplate: function() {
            var modifyRecordTemplate =
                '<tr id="{$id}">' +
                    '<td>${index}</td>' +
                    '<td>${projectId}</td>' +
                    '<td>${projectName}</td>' +
                    '<td>${stageName}</td>' +
                    '<td>${centerName}</td>' +
                    '<td>${$item.getTargetId($item.data)}</td>' +
                    '<td>${patientNo}</td>' +
                    '<td>${$item.getOperationString($item.data)}</td>' +
                    '<td>${fieldName}</td>' +
                    '<td>${oldValue}</td>' +
                    '<td>${newValue}</td>' +
                    '<td>${Global.getUserName($item.data.userId)}</td>' +
                    '<td>${created}</td>' +
                '</tr>';
            $.template("modifyRecordTemplate", modifyRecordTemplate);

        },

        bindEvent: function() {
            $("#search").on("click", function() {
                f.load();
                return false;
            });
            //$container.on("click", ".", function() {
            //    var modifyRecord = $.tmplItem($(this)).data;
            //    if (!window.confirm("您确定要吗？"))
            //        return;
            //    Ajax.call({
            //        url: "",
            //        p: {
            //            id: modifyRecord.id
            //        },
            //        f: function(response) {
            //            Notify.info("成功");
            //        }
            //    });
            //});
        },

        load: function() {
            var createdFrom = $("#createdFrom").val();
            var createdTo = $("#createdTo").val();
            var keywords = $("#keywords").val();
            var operation = parseInt($("#operation").select2("val"));
            var targetTypes = "";
            if (Global.object == "Task")
                targetTypes = "0,1";
            if (Global.object == "CenterReport")
                targetTypes = "1,2";
            if (Global.object == "StageReport")
                targetTypes = "1,3";
            var categoryId = $("#category").select2("val");
            var targetId = $("#target").select2("val");
            Ajax.call({
                url: "loadModifyRecords",
                p: {
                    condition: {
                        createdFrom: createdFrom,
                        createdTo: createdTo,
                        keywords: keywords,
                        operation: operation,
                        targetTypes: targetTypes,
                        categoryId: categoryId,
                        targetId: targetId
                    },
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
            $container.html($.tmpl("modifyRecordTemplate", result.list, {
                getOperationString: function (item) {
                    return GlobalConstants.MODIFY_RECORD_OPERATION[item.operation];
                },
                getTargetId: function (item) {
                    var targetId = item.targetId;
                    if (targetId == "overview" || targetId == "problem" || targetId == "reference")
                        return "";
                    return targetId;
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
    ObjectManager.init();
});

