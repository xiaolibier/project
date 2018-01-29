/**
 * Created by zhouhaibin on 2016/9/19.
 */
var ClassifyCenterReport = function(){
    var CLASSIFY_STATUS_UNREADY = 0;//未进入分级
    var CLASSIFY_STATUS_UNASSIGNED = 1;//未分级（未领取）
    var CLASSIFY_STATUS_ASSIGNED = 2;//分级中（已领取）
    var CLASSIFY_STATUS_SUBMITTED = 3;//已分级

    var f;
    var $container = $("#discovery-container");
    var canEditReport = true;
    return{
        init: function() {
            f = this;
            f.initTemplate();
            f.bindEvent();

            Global.initSelect($("#discovery-orderby"));
            f.renderCategory($("#discovery-category"));

            f.load();
            f.refreshButtons();
        },

        renderCategory: function($select) {
            $select.append('<option value="-">所有分类</option>');
            for (var i = 0; i < Global.allCategories.length; i ++) {
                var category = Global.allCategories[i];
                $select.append('<option value="' + category.id + '">' + category.name + '</option>');
            }
            $select.select2({
                formatNoMatches: function() {
                    return "没有选项";
                },
                placeholder: "请选择..."
                //minimumResultsForSearch: -1,//去掉搜索框
                //allowClear: true
            });
        },


        initTemplate: function() {
            var url = "audit/html/classify-center-report-template.html";
            var res = nunjucks.render(url);
            var $templates = $(res).find('.template');
            $templates.each(function() {
                var $template = $(this);
                $.template($template.attr("id"), $template.html());
            });
        },

        bindEvent: function() {
            $("#discovery-orderby").on("change", function() {
                f.loadDiscoveries();
            });

            $("#discovery-category").on("change", function() {
                f.loadDiscoveries();
            });

            $("#search-discovery").on("click", function() {
                f.loadDiscoveries();
            });
            $("#save").on("click", function() {
                f.save(function() {
                    Notify.info("保存成功");
                });
                return false;
            });

            $("#submit").on("click", function() {
                if (!window.confirm("确定要提交分级结果吗？"))
                    return false;
                f.save(function() {
                    Ajax.call({
                        url: "classifySubmitCenterReport",
                        p: {
                            type: Global.type,
                            id: Global.reportId
                        },
                        f: function(response) {
                            window.open("toMyCenterReportClassifyManager?type=" + Global.type, "_self");
                        }
                    });
                });
                return false;
            });
        },

        save: function(callback) {
            var classifyResult = [];
            $(".discovery-level").each(function() {
                var level2 = $(this).select2("val");
                if (level2 == "" || level2 == null)
                    return;
                var discoveryId = $(this).parents(".discovery").attr("discoveryId");
                classifyResult.push({
                    discoveryId: discoveryId,
                    level2: level2
                });
            });
            Ajax.call({
                url: "saveClassifyResult",
                p: {
                    type: Global.type,
                    id: Global.reportId,
                    classifyResult: classifyResult
                },
                f: function(response) {
                    if (callback)
                        callback();
                }
            });
        },

        load: function() {
            var orderBy = $("#discovery-orderby").select2("val");
            var categoryId = $("#discovery-category").select2("val");
            var patientNo = $("#discovery-patientNo").val();
            Ajax.call({
                url: "loadDiscoveriesInReport",
                p: {
                    taskId: Global.taskId,
                    orderBy: orderBy,
                    categoryId: categoryId,
                    patientNo: patientNo
                },
                f: function(response) {
                    canEditReport = response.canEditReport;
                    f.render(response);
                    Global.refreshControlsByPrivilege();
                }
            })
        },

        render: function(response) {
            var discoveries = response.list;
            f.categoryMap = response.categoryMap;
            f.problemMap = response.problemMap;
            if (discoveries.length == 0) {
                return;
            }
            $container.html($.tmpl("discoveryTemplate", discoveries));
            $container.find(".discovery").each(function() {
                var $discovery = $(this);
                Global.initSelect($discovery.find(".discovery-level"));
                var discovery = $.tmplItem($(this)).data;
                //set value
                f.value2Control($discovery, discovery);
            });
        },

        value2Control: function($discovery, discovery) {
            $discovery.find(".discovery-patientNo").val(discovery.patientNo);
            $discovery.find(".discovery-description").val(discovery.description);
            $discovery.find(".discovery-memo").val(discovery.memo);
            $discovery.find(".discovery-level").select2("val", discovery.level2);
            var category = f.categoryMap[discovery.categoryId];
            if (category)
                $discovery.find(".discovery-category").val(category.name);
            var problem = f.problemMap[discovery.problemId];
            if (problem)
                $discovery.find(".discovery-problem").val(problem.name);
        },

        refreshButtons: function() {
            if (!canEditReport) {
                $("#submit").remove();
                $("#save").remove();
                $(".discovery-level").attr("disabled", true);
            }
            //switch(Global.classifyStatus) {
            //    case CLASSIFY_STATUS_UNREADY:
            //    case CLASSIFY_STATUS_UNASSIGNED:
            //    case CLASSIFY_STATUS_SUBMITTED: {
            //        $("#submit").remove();
            //        $("#save").remove();
            //        $(".discovery-level").attr("disabled", true);
            //    }
            //        break;
            //}
            $(".navbar-form").show();
        },
        empty: null
    }
}();

$(document).ready(function() {
    ClassifyCenterReport.init();
});

