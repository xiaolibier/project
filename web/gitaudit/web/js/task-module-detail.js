/**
 * Created by zhouhaibin on 2016/9/27.
 */
var TaskModuleDetail = function(){
    var STATUS_NEW = "new";
    var STATUS_DIRT = "dirt";
    var STATUS_EDITING = "editing";
    var STATUS_READONLY = "readonly";

    var f;
    var taskModuleId;
    var currentTable;
    var canEditModuleRecord = true;
    var currentModule;
    var displayMode = 0;//0横版模式，1竖版模式
    return{
        init: function() {
            f = this;
            taskModuleId = Global.taskModuleId;
            f.initTemplate();
            DiscoveryManager.init();
            f.bindEvent();
            f.refreshLayout();

            if (!Global.readonly) {
                //如果不是只读模式，则需要先锁定资源
                Ajax.call({
                    url: "startEditTaskModule",
                    p: {
                        taskModuleId: taskModuleId
                    },
                    f: function(response) {
                        canEditModuleRecord = response.success;
                        if (!canEditModuleRecord) {
                            alert(response.message);
                        }
                        f.loadModuleTable();
                    }
                });
            } else {
                canEditModuleRecord = false;
                f.loadModuleTable();
            }
        },

        changeToVerticalLayout: function() {
        },

        refreshLayout: function() {
            if (displayMode == 0) {
                $("#left-panel").addClass("col-md-8");
                $("#left-panel").removeClass("col-md-12");
                $("#right-panel").addClass("col-md-4");
                $("#right-panel").removeClass("col-md-12");
                $("#switch-to-horizon").hide();
                $("#switch-to-vertical").show();
                $("#discovery-category-container").outerWidth(260);
                $("#s2id_condition-category").outerWidth(260);
                $("#condition-patientNo").outerWidth(100);
                $("#module-record-container .control-label").removeClass("col-md-4").addClass("col-md-6");
                $("#module-record-container .field-control-container").removeClass("col-md-8").addClass("col-md-6");
                $("#module-record-container .field-control-container textarea").each(function() {
                    var $parent = $(this).parents(".field-container");
                    var $label = $parent.find(".control-label");
                    var $controlContainer = $parent.find(".field-control-container");
                    $label.removeClass("col-md-6").removeClass("col-md-2").addClass("col-md-3");
                    $controlContainer.removeClass("col-md-6").removeClass("col-md-10").addClass("col-md-9");
                });
                $("#discovery-container .control-label").removeClass("col-md-1").addClass("col-md-3");
                $("#discovery-container .field-control-container").removeClass("col-md-11").addClass("col-md-9");
            } else {
                $("#switch-to-horizon").show();
                $("#switch-to-vertical").hide();
                $("#left-panel").removeClass("col-md-8");
                $("#left-panel").addClass("col-md-12");
                $("#right-panel").removeClass("col-md-4");
                $("#right-panel").addClass("col-md-12");
                $("#discovery-category-container").outerWidth(460);
                $("#s2id_condition-category").outerWidth(460);
                $("#condition-patientNo").outerWidth(460);
                $("#module-record-container .control-label").removeClass("col-md-6").addClass("col-md-4");
                $("#module-record-container .field-control-container").removeClass("col-md-6").addClass("col-md-8");

                $("#module-record-container .field-control-container textarea").each(function() {
                    var $parent = $(this).parents(".field-container");
                    var $label = $parent.find(".control-label");
                    var $controlContainer = $parent.find(".field-control-container");
                    $label.removeClass("col-md-4").removeClass("col-md-3").addClass("col-md-2");
                    $controlContainer.removeClass("col-md-8").removeClass("col-md-9").addClass("col-md-10");
                });
                $("#discovery-container .control-label").removeClass("col-md-3").addClass("col-md-1");
                $("#discovery-container .field-control-container").removeClass("col-md-9").addClass("col-md-11");
            }
        },

        bindEvent: function() {
            if (!Global.readonly) {
                window.onbeforeunload = function(event){
                    if (canEditModuleRecord) {
                        var $moduleRecord = $("#module-record-container .module-record[status='" + STATUS_DIRT + "']");
                        var $unsavedDiscovery = DiscoveryManager.getDiscoveryShouldBeSaved();
                        if ($moduleRecord.length > 0 || $unsavedDiscovery.length > 0) {
                            f.autoSave();
                            DiscoveryManager.autoSave();
                            return '系统正在自动保存数据';
                        }
                    }
                };

                f.saveTimer = setInterval(function(){
                    if (canEditModuleRecord)
                        f.autoSave();
                }, Global.autoSaveInterval); //每分钟保存一次
            }

            $("#back-task-detail").on("click", function() {
                Ajax.call({
                    url: "endEditTaskModule",
                    p: {
                        taskModuleId: taskModuleId
                    },
                    f: function(response) {
                        var $discovery = $('.discovery[status="' + STATUS_DIRT + '"]');
                        if ($discovery.length == 0)
                            $discovery = $('.discovery[status="' + STATUS_EDITING + '"]');
                        if ($discovery.length > 0) {
                            var discovery = $.tmplItem($discovery).data;
                            Ajax.call({
                                url: "endEditDiscovery",
                                p: {
                                    id: discovery.id
                                },
                                f: function (response) {
                                    var url = "toTaskDetail?id=" + Global.taskId;
                                    window.open(url, "_self");
                                }
                            });
                        } else {
                            var url = "toTaskDetail?id=" + Global.taskId;
                            window.open(url, "_self");
                        }
                    }
                });
            });

            $("#switch-to-horizon").on("click", function() {
                displayMode = 0;
                f.refreshLayout();
            });
            $("#switch-to-vertical").on("click", function() {
                displayMode = 1;
                f.refreshLayout();
            });
            $("#module-record-container").on("change", ".field-control", function() {
                var $moduleRecord = $(this).parents(".module-record");
                //if ($moduleRecord.attr("status") == STATUS_EDITING || )
                    $moduleRecord.attr("status", STATUS_DIRT);
            });

            $("#module-record-container").on("click", ".save-record", function() {
                if ($(this).attr("disabled"))
                    return false;
                var $moduleRecord = $(this).parents(".module-record");
                f.saveModuleRecord($moduleRecord);
            });

            $("#module-record-container").on("click", ".edit-record", function() {
                if ($(this).attr("disabled"))
                    return false;
                var $moduleRecord = $(this).parents(".module-record");
                var $unsavedItem = $('#module-record-container .module-record[status="' + STATUS_DIRT + '"]');
                if ($unsavedItem.length > 0) {
                    //正在编辑的是另外一条，先要保存那一条
                    f.saveModuleRecord($unsavedItem, function() {
                        $unsavedItem.attr("status", STATUS_READONLY);
                        $moduleRecord.attr("status", STATUS_EDITING);
                        f.onModuleRecordStatusChanged();
                    });
                } else {
                    $('#module-record-container .module-record[status="' + STATUS_EDITING + '"]').attr("status", STATUS_READONLY);
                    $moduleRecord.attr("status", STATUS_EDITING);
                    f.onModuleRecordStatusChanged();
                }
            });

            $("#module-record-container").on("click", ".add-record", function() {
                if ($(this).attr("disabled"))
                    return false;
                var $moduleRecord = $(this).parents(".module-record");
                var $lastEditing = $ ('#module-record-container .module-record[status="' + STATUS_DIRT + '"]');
                if ($lastEditing.length > 0) {
                    f.saveModuleRecord($lastEditing, function () {
                        $lastEditing.attr("status", STATUS_READONLY);
                        f.addEmptyModuleRecord($moduleRecord);
                    });
                } else {
                    f.addEmptyModuleRecord($moduleRecord);
                }
            });

            $("#module-record-container").on("click", ".delete-record", function() {
                if ($(this).attr("disabled"))
                    return false;
                var $moduleRecord = $(this).parents(".module-record");
                f.deleteModuleRecord($moduleRecord);
            });
        },

        initTemplate: function() {
            TemplateUtil.init();
            var fieldTemplate =
                '<div class="col-md-6 field-container" fieldId="${id}" readonly="${readonly}">' +
                    '<div class="form-group">' +
                        '<label class="col-md-6 control-label">${name}</label>' +
                        '<div class="col-md-6 field-control-container">' +
                            '{{if type == 0}}' +//字符串
                                '<input type="text" class="form-control field-control" fieldtype="${type}" fieldId="${id}">' +
                            '{{/if}}' +
                            '{{if type == 3}}' +//整数
                                '<input type="text" class="form-control field-control" fieldtype="${type}" fieldId="${id}">' +
                            '{{/if}}' +
                            '{{if type == 2}}' +//受控词
                                '<select class="form-control field-control" fieldtype="${type}" fieldId="${id}">' +
                                '{{each(i, word) limitedWord.words}}' +
                                    '<option value="${word}">${word}</option>' +
                                '{{/each}}' +
                                '</select>' +
                            '{{/if}}' +
                            '{{if type == 4}}' +//文本
                                '<textarea class="form-control field-control" fieldtype="${type}" fieldId="${id}"></textarea>' +
                            '{{/if}}' +
                            '{{if type == 5}}' +//多选
                                '<select class="form-control field-control" fieldtype="${type}" fieldId="${id}" multiple>' +
                                '{{each(i, word) limitedWord.words}}' +
                                    '<option value="${word}">${word}</option>' +
                                '{{/each}}' +
                                '</select>' +
                            '{{/if}}' +
                            '{{if type == 1}}' +//日期
                                '<div class="input-group date date-picker">' +
                                    '<input type="text" size="16" readonly class="form-control field-control" fieldtype="${type}">' +
                                    '<span class="input-group-btn">' +
                                        '<button class="btn default date-set" type="button">' +
                                           '<i class="fa fa-calendar"></i>' +
                                        '</button>' +
                                    '</span>' +
                                '</div>' +
                            '{{/if}}' +
                        '</div>' +
                    '</div>' +
                '</div>';
            $.template("fieldTemplate", fieldTemplate);
        },

        loadModuleTable: function() {
            Ajax.call({
                url: "loadModuleTable",
                p: {
                    moduleId: Global.moduleId
                },
                f: function(response) {
                    currentModule = response.module;
                    f.renderTaskModule(response.table);
                }
            });
        },

        renderTaskModule: function(table) {
            //render task module
            $("#taskmodule-id").html(taskModuleId);
            $("#taskmodule-centerId").html(Global.centerId);
            $("#module-name").html(Global.moduleName);

            if (!table || table == null) {
                $("#left-panel").remove();
                $("#switch-to-horizon").remove();
                displayMode = 1;
                f.refreshLayout();
                return;
            }
            currentTable = table;

            //render module records
            f.loadModuleRecords();
        },

        loadModuleRecords: function() {
            Ajax.call({
                url: "loadModuleRecords",
                p: {
                    taskModuleId: taskModuleId
                },
                f: function(response) {
                    f.renderModuleRecords(response);
                }
            })
        },

        renderModuleRecords: function(response) {
            var moduleRecords = response.list;
            if (moduleRecords.length == 0) {
                f.addEmptyModuleRecord();
                if (currentModule.multipleRecord == 0) {
                    $(".add-record").remove();
                    $(".delete-record").remove();
                }
                return;
            }
            $("#module-record-container").html($.tmpl("moduleRecordTemplate", moduleRecords));
            $("#module-record-container .module-record").each(function() {
                var $moduleRecord = $(this);
                var moduleRecord = $.tmplItem($(this)).data;
                $moduleRecord.attr("status", STATUS_READONLY);
                var $fieldsContainer = $moduleRecord.find(".fields-container");
                f.renderModuleRecord($fieldsContainer);

                //set value
                f.moduleRecordValue2Control($moduleRecord, moduleRecord);
            });
            if (currentModule.multipleRecord == 0) {
                $(".add-record").remove();
                $(".delete-record").remove();
            }
            f.onModuleRecordStatusChanged();
        },

        renderModuleRecord: function($container) {
            $container.html($.tmpl("fieldTemplate", currentTable.fields));
            $container.find("textarea").each(function() {
                var $parent = $(this).parents(".field-container");
                var $label = $parent.find(".control-label");
                var $controlContainer = $parent.find(".field-control-container");
                $parent.removeClass("col-md-6").addClass("col-md-12");
                $label.removeClass("col-md-6").addClass("col-md-3");
                $controlContainer.removeClass("col-md-6").addClass("col-md-9");
            });

            Global.initSelect($container.find("select.field-control"));
            Global.initDatePicker($container.find(".date-picker"));
        },

        onModuleRecordStatusChanged: function() {
            if (Global.readonly) {
                $(".add-record").remove();
                $(".delete-record").remove();
                $(".save-record").remove();
                $(".edit-record").remove();
                $(".module-record").attr("status", STATUS_READONLY);
            }
            $("#module-record-container .module-record").each(function() {
                var $moduleRecord = $(this);
                if (!canEditModuleRecord) {
                    $moduleRecord.find(".save-record").attr("disabled", true);
                    $moduleRecord.find(".delete-record").attr("disabled", true);
                    $moduleRecord.find(".add-record").attr("disabled", true);
                    $moduleRecord.find(".edit-record").attr("disabled", true);
                    $moduleRecord.find("input").attr("readonly", true);
                    $moduleRecord.find("select").attr("disabled", true);
                    $moduleRecord.find("textarea").attr("readonly", true);
                } else {
                    var status = $moduleRecord.attr("status");
                    $moduleRecord.find(".add-record").removeAttr("disabled");
                    $moduleRecord.find(".edit-record").removeAttr("disabled");
                    $moduleRecord.find(".save-record").removeAttr("disabled");
                    $moduleRecord.find(".delete-record").removeAttr("disabled");
                    if (status == STATUS_NEW) {
                        $moduleRecord.find(".edit-record").attr("disabled", true);
                        $moduleRecord.find(".add-record").attr("disabled", true);
                    } else if (status == STATUS_EDITING) {
                        $moduleRecord.find(".edit-record").attr("disabled", true);
                    } else if (status == STATUS_DIRT) {
                        $moduleRecord.find(".edit-record").attr("disabled", true);
                    } else {//STATUS_READONLY
                        $moduleRecord.find(".save-record").attr("disabled", true);
                    }
                    if (status == STATUS_READONLY) {
                        $moduleRecord.find("input").attr("readonly", true);
                        $moduleRecord.find("select").attr("disabled", true);
                        $moduleRecord.find("textarea").attr("readonly", true);
                    } else {
                        $moduleRecord.find("input").removeAttr("readonly");
                        $moduleRecord.find("select").removeAttr("disabled");
                        $moduleRecord.find("textarea").removeAttr("readonly");
                    }
                }
            });

            $(".module-record .field-container[readonly='true']").each(function() {
                var $fieldContainer = $(this);
                $fieldContainer.find("input").attr("readonly", true);
                $fieldContainer.find("select").attr("disabled", true);
                $fieldContainer.find("textarea").attr("readonly", true);
            });

        },

        autoSave: function() {
            var $moduleRecord = $("#module-record-container .module-record[status='" + STATUS_DIRT + "']");
            if ($moduleRecord.length > 0) {
                f.saveModuleRecord($moduleRecord);
                console.log("自动保存模块记录");
            }
        },

        saveModuleRecord: function($moduleRecord, callback) {
            var moduleRecord = $.tmplItem($moduleRecord).data;
            if (!f.moduleRecordControl2Value($moduleRecord, moduleRecord))
                return;
            var url;
            if (moduleRecord.id == '') {
                moduleRecord.id = $moduleRecord.attr("moduleRecordId");
            }
            if ($moduleRecord.attr("status") == STATUS_NEW || moduleRecord.id == '') {
                url = "addModuleRecord";
            } else {
                url = "saveModuleRecord";
            }

            Ajax.call({
                url: url,
                p: {
                    moduleRecord: moduleRecord
                },
                f: function(response){
                    Notify.info("保存成功");
                    if ($moduleRecord.attr("status") == STATUS_NEW || moduleRecord.id == '') {
                        var id = response.moduleRecordId;
                        $moduleRecord.find(".module-record-id").html(id);
                        $moduleRecord.attr("moduleRecordId", id);
                    }
                    $moduleRecord.attr("status", STATUS_EDITING);
                    f.onModuleRecordStatusChanged();
                    if (callback)
                        callback();
                }
            });
        },

        moduleRecordValue2Control: function($moduleRecord, moduleRecord) {
            if (!moduleRecord.content)
                moduleRecord.content = '{}';
            var content;
            if (typeof moduleRecord.content === 'string' )
                content = JSON.parse(moduleRecord.content);
            else
                content = moduleRecord.content;
            $moduleRecord.find(".field-control").each(function() {
                var $control = $(this);
                var field = $.tmplItem($control).data;
                var value = content[field.id];
                if (!value) {
                    if (field.type == GlobalConstants.FIELD_TYPE_DATE) {
                        $control.val('');
                    } else if (field.type == GlobalConstants.FIELD_TYPE_LIMITEDWORD || field.type == GlobalConstants.FIELD_TYPE_MULTISELECT) {
                        $control.select2("val", '');
                    } else
                        $control.val('');
                } else {
                    if (field.type == GlobalConstants.FIELD_TYPE_DATE) {
                        $control.val(value);
                    } else if (field.type == GlobalConstants.FIELD_TYPE_LIMITEDWORD || field.type == GlobalConstants.FIELD_TYPE_MULTISELECT) {
                        $control.select2("val", value);
                    } else
                        $control.val(value);
                }

            });
        },

        moduleRecordControl2Value: function($moduleRecord, moduleRecord) {
            var content = {};
            var $fieldControls = $moduleRecord.find(".field-control");
            for (var i = 0; i < $fieldControls.length; i ++) {
                var $control = $($fieldControls[i]);
                var field = $.tmplItem($control).data;
                if (field.type == GlobalConstants.FIELD_TYPE_DATE) {
                    content[field.id] = $control.val();
                } else if (field.type == GlobalConstants.FIELD_TYPE_LIMITEDWORD || field.type == GlobalConstants.FIELD_TYPE_MULTISELECT) {
                    content[field.id] = $control.select2("val");
                } else {
                    content[field.id] = $control.val();
                }
            }
            moduleRecord.content = JSON.stringify(content);
            return true;
        },

        addEmptyModuleRecord: function($brother) {
            var moduleRecord = {
                id: "",
                taskId: Global.taskId,
                moduleId: Global.moduleId,
                taskModuleId: taskModuleId,
                content: {}
            };

            var $moduleRecord;
            if ($brother) {
                //插入到某条记录之后
                $moduleRecord = $.tmpl("moduleRecordTemplate", moduleRecord).insertAfter($brother);
            } else {
                //没有任何记录，这是第一条记录
                $("#module-record-container").html();
                $moduleRecord = $.tmpl("moduleRecordTemplate", moduleRecord).appendTo($("#module-record-container"));
            }
            $moduleRecord.attr("status", STATUS_NEW);
            var $fieldsContainer = $moduleRecord.find(".fields-container");
            f.renderModuleRecord($fieldsContainer);

            f.onModuleRecordStatusChanged();

            if (currentTable.inheritable) {
                Ajax.call({
                    url: "loadInheritMetadata",
                    p: {
                        taskId: Global.taskId,
                        moduleId: Global.moduleId
                    },
                    f: function(response) {
                        var content = response.content;
                        moduleRecord.content = JSON.stringify(content);
                        f.moduleRecordValue2Control($moduleRecord, moduleRecord);
                    }
                });
            } else {
                if (Global.debugMode == true)
                    Test.createEmptyModuleRecord(moduleRecord, currentTable);
                //set value
                f.moduleRecordValue2Control($moduleRecord, moduleRecord);
            }
        },

        deleteModuleRecord: function($moduleRecord) {
            var moduleRecord = $.tmplItem($moduleRecord).data;
            if ($("#module-record-container .module-record").length == 1) {
                alert("至少需要保留一条记录");
                return;
            }
            if ($moduleRecord.attr("status") == STATUS_NEW) {
                $moduleRecord.remove();
                return;
            }
            if (!window.confirm("您确定要删除本条记录?")) {
                return;
            }
            Ajax.call({
                url: "deleteModuleRecord",
                p: {
                    id: moduleRecord.id
                },
                f: function(response) {
                    $moduleRecord.remove();
                    Notify.info("删除成功");
                }
            });
        },

        empty: null
    }
}();

$(document).ready(function() {
    TaskModuleDetail.init();
});
