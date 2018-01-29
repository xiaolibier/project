/**
 * Created by zhouhaibin on 2016/9/27.
 */
var TaskDetail = function(){
    var f;
    var currentTask;
    return{
        init: function() {
            f = this;
            f.initTemplate();
            f.bindEvent();
            f.loadTask();
        },
        bindEvent: function() {
            $("#task-module-container").on("click", ".edit-task-module", function() {
                var taskModule = $.tmplItem($(this)).data;
                var url = "toTaskModuleDetail?id=" + taskModule.id + "&taskId=" + currentTask.id;
                window.open(url, "_self");
            });
        },

        loadTask: function() {
            Ajax.call({
                url: "loadTask",
                p: {
                    id: Global.taskId
                },
                f: function(response) {
                    f.renderTask(response);
                }
            });

        },

        renderTask: function(response) {
            currentTask = response.item;
            if (!currentTask)
                return;

            var $moduleContainer = $("#task-module-container");
            $moduleContainer.html();
            for (var i = 0; i < currentTask.taskModules.length; i ++) {
                var taskModule = currentTask.taskModules[i];
                if (i % 4 == 0)
                    $moduleContainer.append('<div class="row">');
                var html = $.tmpl("taskModuleTemplate", taskModule);
                $moduleContainer.append(html);
                if ((i + 1) % 4 == 0)
                    $moduleContainer.append('</div><hr>');
                f.loadModifyRecords(taskModule);
            }
            $(".scroller").slimScroll({
                height: '120px',
                color: "rgb(221,221,221)"
            });
            Global.refreshControlsByPrivilege();
        },

        loadModifyRecords: function(taskModule) {
            Ajax.call({
                url: "loadModifyRecords",
                p: {
                    condition: {
                        taskId: currentTask.id,
                        moduleId: taskModule.moduleId,
                        targetTypes: "0,1"
                    },
                    start: 0,
                    limit: 5
                },
                f: function(response) {
                    f.renderModifyRecords(taskModule.id, response);
                }
            });
        },

        renderModifyRecords: function(taskModuleId, response) {
            var $modifyRecordContainer = $('.task-module[taskModuleId="' + taskModuleId + '"] .modify-record-container');
            $modifyRecordContainer.html($.tmpl("modifyRecordTemplate", response.result.list));
        },

        initTemplate: function() {
            TemplateUtil.init();
        },

        empty: null
    }
}();

$(document).ready(function() {
    TaskDetail.init();
});
