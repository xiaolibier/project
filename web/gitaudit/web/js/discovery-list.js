/**
 * Created by zhouhaibin on 2016/9/19.
 */
var DiscoveryList = function(){
    var f;
    var $container = $("#discovery-container");
    return{
        init: function() {
            f = this;
            TemplateUtil.init();
            f.bindEvent();
            f.load();
        },

        bindEvent: function() {
            $container.on("click", ".discovery-inReport", function() {
                var discovery = $.tmplItem($(this)).data;
                if ($(this).prop("checked") == true) {
                    if (discovery.level == '' || discovery.level == null || discovery.categoryId == '' || discovery.categoryId == null
                        || discovery.problemId == '' || discovery.problemId == null) {
                        $(this).prop("checked", false);
                        alert("您必须填写分级，分类和问题归类，才能将此发现入报告");
                        f.editDiscovery(discovery);
                        return;
                    }
                }
                var inReport = $(this).prop("checked") ? 1 : 0;
                var discoveryId = $(this).parents(".discovery").attr("discoveryId");
                Ajax.call({
                    url: "updateDiscoveryInReport",
                    p: {
                        id: discoveryId,
                        inReport: inReport
                    },
                    f: function() {
                        Notify.info("保存成功");
                    }
                });
            });
        },

        editDiscovery: function(discovery) {
            EditDiscoveryDialog.show({
                discovery: discovery,
                callback: function(discovery) {
                    Ajax.call({
                        url: "saveDiscoveryFromReport",
                        p: {
                            reportId: discovery.taskId,
                            reportType: Global.type,
                            discovery: discovery
                        },
                        f: function(response) {
                            Notify.info("保存成功");
                            f.load();
                        }
                    });
                }
            });
        },

        load: function() {
            Ajax.call({
                url: "loadDiscoveriesNoInReport",
                p: {
                    taskId: Global.taskId
                },
                f: function(response) {
                    f.render(response);
                    Global.refreshControlsByPrivilege();
                }
            });
        },

        render: function(response) {
            var discoveries = response.list;
            f.categoryMap = response.categoryMap;
            f.problemMap = response.problemMap;
            $container.html($.tmpl("discoveryNotInReportTemplate", discoveries));
            $container.find(".discovery").each(function() {
                var $discovery = $(this);
                var discovery = $.tmplItem($(this)).data;

                //set value
                f.value2Control($discovery, discovery);
            });
        },

        value2Control: function($discovery, discovery) {
            $discovery.find(".discovery-patientNo").val(discovery.patientNo);
            $discovery.find(".discovery-description").val(discovery.description);
            $discovery.find(".discovery-memo").val(discovery.memo);
            $discovery.find(".discovery-level").val(discovery.level);
            var category = f.categoryMap[discovery.categoryId];
            if (category)
                $discovery.find(".discovery-category").val(category.name);
            var problem = f.problemMap[discovery.problemId];
            if (problem)
                $discovery.find(".discovery-problem").val(problem.name);
        },

        empty: null
    }
}();

$(document).ready(function() {
    DiscoveryList.init();
});

