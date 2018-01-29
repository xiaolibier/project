/**
 * Created by zhouhaibin on 2016/9/27.
 */
var DiscoveryManager = function(){
    var STATUS_NEW = "new";
    var STATUS_DIRT = "dirt";
    var STATUS_EDITING = "editing";
    var STATUS_READONLY = "readonly";

    var f;
    var taskModuleId;
    var canEditDiscovery = true;
    var $container = $("#discovery-container");
    var itemOpening = false;
    return{
        init: function() {
            f = this;
            taskModuleId = Global.taskModuleId;
            f.bindEvent();

            Global.initSelect($("#discovery-orderby"));

            f.renderConditionCategory($("#condition-category"));
            $("#task-member-count").html(Global.taskMemberCount);

            $('#discovery-nav li[mode="only-mine"] a').trigger("click");
        },

        bindEvent: function() {
            if (!Global.readonly) {
                f.saveTimer = setInterval(function () {
                    f.autoSave();
                }, Global.autoSaveInterval); //每分钟保存一次
            }

            $("#discovery-container").on("change", ".field-control", function() {
                if (itemOpening)
                    return;//正在打开某个发现，此change非人工触发
                var $discovery = $(this).parents(".discovery");
                $discovery.attr("status", STATUS_DIRT);
            });

            $("#discovery-nav").on("click", "a", function() {
                $("#discovery-nav li").removeClass("active");
                $(this).parents("li").addClass("active");
                f.loadDiscoveries();
            });

            $("#discovery-orderby").on("change", function() {
                f.loadDiscoveries();
            });

            $("#discovery-category").on("change", function() {
                f.loadDiscoveries();
            });

            $("#search-discovery").on("click", function() {
                f.loadDiscoveries();
                return false;
            });

            $container.on("click", ".save-discovery", function() {
                if ($(this).attr("disabled"))
                    return false;
                var $discovery = $(this).parents(".discovery");
                f.save($discovery);
            });
            
            $container.on("click", ".edit-discovery", function() {
                if ($(this).attr("disabled"))
                    return false;
                var $discovery = $(this).parents(".discovery");
                var id = $discovery.attr("discoveryId");
                var $unsavedItem = f.getDiscoveryShouldBeSaved();
                if ($unsavedItem.length > 0) {
                    //正在编辑的是另外一条，先要保存那一条
                    f.save($unsavedItem, function () {
                        f.endEdit($unsavedItem);
                        f.prepareEdit(id, $discovery);
                    });
                } else {
                    var $lastEditing = $container.find('.discovery[status="' + STATUS_EDITING + '"]');
                    f.endEdit($lastEditing);
                    f.prepareEdit(id, $discovery);
                }
            });

            $container.on("click", ".add-discovery", function() {
                if ($(this).attr("disabled"))
                    return false;
                if ($container.find(".discovery[status=" + STATUS_NEW + "]").length > 0) {
                    Notify.info("只有保存其他新建的记录后才能再次新建");
                    return;
                }
                var $discovery = $(this).parents(".discovery");
                var $unsavedItem = f.getDiscoveryShouldBeSaved();
                if ($unsavedItem.length > 0) {
                    f.save($unsavedItem, function () {
                        f.endEdit($unsavedItem);
                        f.addEmpty($discovery);
                    });
                } else {
                    var $lastEditing = $container.find('.discovery[status="' + STATUS_EDITING + '"]');
                    f.endEdit($lastEditing);
                    f.addEmpty($discovery);
                }
            });
            $container.on("click", ".delete-discovery", function() {
                if ($(this).attr("disabled"))
                    return false;
                var $discovery = $(this).parents(".discovery");
                f.deleteDiscovery($discovery);
            });
            $container.on("change", ".discovery-category", function(event) {
                var categoryId = $(this).select2("val");
                var $discovery = $(this).parents(".discovery");
                $discovery.find(".discovery-problem").select2("destroy");
                var $problemSelect = $discovery.find(".discovery-problem");

                $problemSelect.empty();
                //根据分类来过滤问题归类选项
                for (var i = 0; i < Global.allProblems.length; i ++) {
                    var problem = Global.allProblems[i];
                    if (problem.categoryId == categoryId)
                        $problemSelect.append('<option value="' + problem.id + '">' + problem.name + '</option>');
                }
                Global.initSelect($problemSelect);
            });
        },

        //得到已修改尚未保存的稽查发现，这个稽查发现的描述不能为空，为空的不能进行保存
        getDiscoveryShouldBeSaved: function() {
            var $unsavedItem = $container.find('.discovery[status="' + STATUS_DIRT + '"]');
            for (var i = 0; i < $unsavedItem.length; i ++) {
                var $discovery = $($unsavedItem[i]);
                if ($discovery.find(".discovery-description").val() != '') {
                    return $discovery;
                }
            }
            return [];
        },

        endEdit: function($discovery) {
            if ($discovery.length == 0)
                return;
            $discovery.attr("status", STATUS_READONLY);
            if ($discovery.find(".discovery-code").html() == '')
                return;
            var discovery = $.tmplItem($discovery).data;
            Ajax.call({
                url: "endEditDiscovery",
                p: {
                    id: discovery.id
                },
                f: function(response) {

                }
            });
        },

        prepareEdit: function(id, $discovery) {
            //检查是否可以比编辑，是否被别人锁定
            Ajax.call({
                url: "startEditDiscovery",
                p: {
                    id: id
                },
                f: function(response) {
                    canEditDiscovery = response.success;
                    if (!canEditDiscovery) {
                        alert(response.message);
                        f.onStatusChanged();
                        return;
                    }

                    Ajax.call({
                        url: "loadDiscovery",
                        p: {
                            id: id
                        },
                        f: function (response) {
                            f.value2Control($discovery, response.item);
                            $discovery.attr("status", STATUS_EDITING);
                            f.onStatusChanged();
                        }
                    });
                }
            });

        },

        loadDiscoveries: function() {
            var orderBy = $("#discovery-orderby").select2("val");
            var mode = $("#discovery-nav li[class='active']").attr("mode");
            var onlyMine = (mode == "only-mine");
            var categoryId = $("#condition-category").select2("val");
            var patientNo = $("#condition-patientNo").val();
            Ajax.call({
                url: "loadDiscoveries",
                p: {
                    taskId: Global.taskId,
                    orderBy: orderBy,
                    onlyMine: onlyMine,
                    categoryId: categoryId,
                    patientNo: patientNo
                },
                f: function(response) {
                    f.render(response.list);
                    Global.refreshControlsByPrivilege();
                    TaskModuleDetail.refreshLayout();
                }
            })
        },

        render: function(discoveries) {
            $container.html($.tmpl("discoveryTemplate", discoveries));
            if (discoveries.length == 0) {
                f.addEmpty();
                return;
            }
            Global.initSelect($(".discovery-level"));
            f.renderCategory($(".discovery-category"));
            Global.initSelect($(".discovery-problem"));
            $container.find(".discovery").each(function() {
                var $discovery = $(this);
                var discovery = $.tmplItem($(this)).data;
                $discovery.attr("status", STATUS_READONLY);

                //set value
                f.value2Control($discovery, discovery);
            });
            f.onStatusChanged();
        },

        renderConditionCategory: function($select) {
            $select.append('<option value="-">所有分类</option>');
            f.renderCategory($select);
        },

        renderCategory: function($select) {
            for (var i = 0; i < Global.allCategories.length; i ++) {
                var category = Global.allCategories[i];
                if (category.moduleId == Global.moduleId)
                    $select.append('<option value="' + category.id + '">' + category.name + '</option>');
            }
            for (var i = 0; i < Global.allCategories.length; i ++) {
                var category = Global.allCategories[i];
                if (category.moduleId != Global.moduleId)
                    $select.append('<option value="' + category.id + '">' + category.name + '</option>');
            }
            Global.initSelectWithSearch($select);
        },

        onStatusChanged: function() {
            if (Global.readonly) {
                $(".add-discovery").remove();
                $(".save-discovery").remove();
                $(".edit-discovery").remove();
                $(".delete-discovery").remove();
                $(".discovery").attr("status", STATUS_READONLY);
            }
            $container.find(".discovery").each(function() {
                var $discovery = $(this);
                var status = $discovery.attr("status");
                $discovery.find(".add-discovery").removeAttr("disabled");
                $discovery.find(".edit-discovery").removeAttr("disabled");
                $discovery.find(".save-discovery").removeAttr("disabled");
                $discovery.find(".delete-discovery").removeAttr("disabled");
                if (status == STATUS_NEW) {
                    $discovery.find(".edit-discovery").attr("disabled", true);
                    $discovery.find(".add-discovery").attr("disabled", true);
                } else if (status == STATUS_EDITING) {
                    $discovery.find(".edit-discovery").attr("disabled", true);
                } else if (status == STATUS_DIRT) {
                    $discovery.find(".edit-discovery").attr("disabled", true);
                } else {//STATUS_READONLY
                    $discovery.find(".save-discovery").attr("disabled", true);
                }
                if (status == STATUS_READONLY) {
                    $discovery.find("input.field-control[type='checkbox']").attr("disabled", true);
                    $discovery.find("input.field-control[type='text']").attr("readonly", true);
                    $discovery.find("select.field-control").attr("disabled", true);
                    $discovery.find("textarea.field-control").attr("disabled", true);
                } else {
                    $discovery.find("input.field-control[type='checkbox']").removeAttr("disabled");
                    $discovery.find("input.field-control[type='text']").removeAttr("readonly");
                    $discovery.find("select.field-control").removeAttr("disabled");
                    $discovery.find("textarea.field-control").removeAttr("disabled");
                }
            });
        },

        autoSave: function() {
            var $unsavedItem = f.getDiscoveryShouldBeSaved();
            if ($unsavedItem.length > 0) {
                //问题描述为空，则不触发自动保存
                f.save($unsavedItem);
                console.log("自动保存稽查发现");
            }
        },

        save: function($discovery, callback) {
            var discovery = $.tmplItem($discovery).data;
            f.control2Value($discovery, discovery);
            var url;
            if ($discovery.attr("status") == STATUS_NEW || $discovery.find(".discovery-code").html() == '') {
                url = "addDiscovery";
            } else {
                discovery.code = $discovery.find(".discovery-code").html();
                url = "saveDiscovery";
            }

            Ajax.call({
                url: url,
                p: {
                    discovery: discovery
                },
                f: function(response) {
                    Notify.info("保存成功");
                    if ($discovery.attr("status") == STATUS_NEW || $discovery.find(".discovery-code").html() == '') {
                        var code = response.discoveryCode;
                        $discovery.find(".discovery-code").html(code);
                    }
                    $discovery.attr("status", STATUS_EDITING);
                    f.onStatusChanged();
                    if (callback)
                        callback();

                    Ajax.call({
                        url: "startEditDiscovery",
                        p: {
                            id: discovery.id
                        },
                        f: function() {
                        }
                    });
                }
            });
        },

        value2Control: function($discovery, discovery) {
            itemOpening = true;
            $discovery.find(".discovery-patientNo").val(discovery.patientNo);
            $discovery.find(".discovery-description").val(discovery.description);
            $discovery.find(".discovery-memo").val(discovery.memo);
            $discovery.find(".discovery-level").select2("val", discovery.level);
            $discovery.find(".discovery-category").select2("val", discovery.categoryId);
            $discovery.find(".discovery-category").trigger("change");
            $discovery.find(".discovery-problem").select2("val", discovery.problemId);
            $discovery.find(".discovery-inReport").prop("checked", discovery.inReport == 1);
            itemOpening = false;
        },

        control2Value: function($discovery, discovery) {
            discovery.patientNo = $discovery.find(".discovery-patientNo").val();
            discovery.description = $discovery.find(".discovery-description").val();
            discovery.memo = $discovery.find(".discovery-memo").val();
            discovery.level = $discovery.find(".discovery-level").select2("val");
            discovery.categoryId = $discovery.find(".discovery-category").select2("val");
            discovery.problemId = $discovery.find(".discovery-problem").select2("val");
            discovery.inReport = $discovery.find(".discovery-inReport").prop("checked") ? 1 : 0;
        },

        addEmpty: function($brother) {
            var id = Global.taskId + "F" + Utils.newGUID().substring(0, 3);
            var discovery = {
                id: id,
                code: "",
                taskId: Global.taskId,
                moduleId: Global.moduleId,
                taskModuleId: taskModuleId,
                inReport: 1
            };

            //if (Global.debugMode == true)
            //    Test.createEmptyDiscovery(discovery);

            var $discovery;
            if ($brother) {
                //插入到某条记录之后
                $discovery = $.tmpl("discoveryTemplate", discovery).insertAfter($brother);
            } else {
                //没有任何记录，这是第一条记录
                $container.html();
                $discovery = $.tmpl("discoveryTemplate", discovery).appendTo($container);
            }
            $discovery.attr("status", STATUS_NEW);
            Global.initSelect($discovery.find(".discovery-level"));
            f.renderCategory($discovery.find(".discovery-category"));
            Global.initSelect($discovery.find(".discovery-problem"));
            //set value
            f.value2Control($discovery, discovery);

            f.onStatusChanged();
            TaskModuleDetail.refreshLayout();
        },

        deleteDiscovery: function($discovery) {
            var discovery = $.tmplItem($discovery).data;
            if ($container.find(".discovery").length == 1) {
                alert("至少需要保留一条记录");
                return;
            }
            if ($discovery.attr("status") == STATUS_NEW || $discovery.find(".discovery-code").html() == '') {
                $discovery.remove();
                return;
            }
            if (!window.confirm("您确定要删除本条记录?")) {
                return;
            }
            Ajax.call({
                url: "deleteDiscovery",
                p: {
                    id: discovery.id
                },
                f: function(response) {
                    $discovery.remove();
                    Notify.info("删除成功");
                }
            });
        },

        empty: null
    }
}();

