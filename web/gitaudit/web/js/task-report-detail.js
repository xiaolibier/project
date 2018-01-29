/**
 * Created by zhouhaibin on 2016/9/19.
 */
var TaskReportDetail = function(){
    var f;
    return{
        init: function() {
            f = this;
            f.initTemplate();
            f.bindEvent();
            f.load();
        },

        initTemplate: function() {
            var url = "audit/html/task-report-template.html";
            var res = nunjucks.render(url);
            var $templates = $(res).find('.template');
            $templates.each(function() {
                var $template = $(this);
                $.template($template.attr("id"), $template.html());
            });

            var moduleRecordFieldTemplate =
                '<div class="col-md-6 field-container">' +
                    '<div class="form-group">' +
                        '<label class="col-sm-4 control-label">${name}</label>' +
                        '<div class="col-sm-8 field-control-container">' +
                            '{{if type == 4}}' +//文本
                                '<textarea class="form-control field-control" fieldtype="${type}" fieldId="${id}" readonly></textarea>' +
                            '{{else}}' +
                                '<input type="text" class="form-control field-control" fieldtype="${type}" fieldId="${id}" readonly>' +
                            '{{/if}}' +
                        '</div>' +
                    '</div>' +
                '</div>';
            $.template("moduleRecordFieldTemplate", moduleRecordFieldTemplate);
        },

        bindEvent: function() {
        },

        load: function() {
            Ajax.call({
                url: "loadTaskReport",
                p: {
                    id: Global.reportId
                },
                f: function(response) {
                    f.render(response);
                    Global.refreshControlsByPrivilege();
                }
            });

        },

        render: function(response) {
            f.categoryMap = response.categoryMap;
            f.problemMap = response.problemMap;
            response.task.taskModules.push({
                name: "未分类稽查发现",
                moduleId: "-"
            });

            $("#module-container").html($.tmpl("taskModuleTemplate", response.task.taskModules));
            f.renderModuleRecords(response);
            f.renderDiscoveries(response);
        },

        renderModuleRecords: function(response) {
            for (var i = 0; i < response.moduleRecords.length; i ++) {
                var moduleRecord = response.moduleRecords[i];
                var module = response.moduleMap[moduleRecord.moduleId];
                var table = response.tableMap[module.tableId];
                var $container = $(".module[moduleId='" + moduleRecord.moduleId + "']").find(".module-record-container");
                f.renderModuleRecord($container, table, moduleRecord);
            }
        },

        renderModuleRecord: function($container, table, moduleRecord) {
            var $moduleRecord = $.tmpl("moduleRecordTemplate", moduleRecord).appendTo($container);

            var $fieldsContainer = $moduleRecord.find(".fields-container");
            $fieldsContainer.html($.tmpl("moduleRecordFieldTemplate", table.fields));

            $container.find("textarea").each(function() {
                var $parent = $(this).parents(".field-container");
                var $label = $parent.find(".control-label");
                var $controlContainer = $parent.find(".field-control-container");
                $parent.removeClass("col-md-6").addClass("col-md-12");
                $label.removeClass("col-md-4").addClass("col-md-2");
                $controlContainer.removeClass("col-md-8").addClass("col-md-10");
            });
            //set value
            f.moduleRecordValue2Control($moduleRecord, moduleRecord);
        },

        moduleRecordValue2Control: function($moduleRecord, moduleRecord) {
            if (!moduleRecord.content)
                moduleRecord.content = '{}';
            var content = JSON.parse(moduleRecord.content);
            $moduleRecord.find(".field-control").each(function() {
                var $control = $(this);
                var field = $.tmplItem($control).data;
                var value = content[field.id];
                if (!value) {
                    $control.val('');
                } else {
                    $control.val(value);
                }
            });
        },

        renderDiscoveries: function(response) {
            for (var i = 0; i < response.discoveries.length; i ++) {
                var discovery = response.discoveries[i];
                var category = response.categoryMap[discovery.categoryId];
                var moduleId = "-";
                if (category) {
                    moduleId = category.moduleId;
                } else {
                    moduleId = "-";
                }
                var $container = $(".module[moduleId='" + moduleId + "']").find(".discovery-container");
                f.renderDiscovery($container, discovery);
            }
        },

        renderDiscovery: function($container, discovery) {
            var $discovery = $.tmpl("discoveryTemplate", discovery).appendTo($container);
            f.discoveryControl2Value($discovery, discovery);
        },

        discoveryControl2Value: function($discovery, discovery) {
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
    TaskReportDetail.init();
});

