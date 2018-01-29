/**
 * Created by zhouhaibin on 2016/9/19.
 */
var ProblemManager = function(){
    var PAGE_MODE_LIST = "list";
    var PAGE_MODE_ADD = "add";
    var PAGE_MODE_EDIT = "edit";
    var PAGE_MODE_DETAIL = "detail";
    var currentPageMode = PAGE_MODE_LIST;
    var f;
    var start = 0;
    var limit = 10;
    var $container = $("#problem-container");
    var currentProblem;
    return{
        init: function() {
            f = this;
            Header.activeMenu("system-manager");
            f.onPageModeChange();
            f.initTemplate();
            f.bindEvent();
            f.initModule();
            Global.initSelect($("#problem-categoryId"));
            Global.initSelect($("#condition-category"));
            f.load();
        },

        initModule: function() {
            $("#problem-moduleId").html($.tmpl("moduleTemplate", Global.allModules));
            Global.initSelect($("#problem-moduleId"));
            $("#problem-moduleId").select2("val", "");

            $("#condition-module").append($.tmpl("moduleTemplate", Global.allModules));
            Global.initSelect($("#condition-module"));
            $("#condition-module").select2("val", "");
        },

        initTemplate: function() {
            var moduleTemplate =
                '<option value="${id}" itemId="${id}">${name}</option>';
            $.template("moduleTemplate", moduleTemplate);

            var categoryTemplate =
                '<option value="${id}" itemId="${id}">${name}</option>';
            $.template("categoryTemplate", categoryTemplate);

            var problemTemplate =
                '<tr id="{$id}">' +
                '<td>${$item.getModuleName($item.data)}</td>' +
                '<td>${moduleId}</td>' +
                '<td>${$item.getCategoryName($item.data)}</td>' +
                '<td>${categoryId}</td>' +
                '<td>${name}</td>' +
                '<td>${id}</td>' +
                '<td>' +
                    '<a title="编辑" href="javascript:void(0)" class="table-operation-icon edit-problem"><i class="glyphicon glyphicon-pencil"></i></a>' +
                    '<a title="删除" href="javascript:void(0)" class="table-operation-icon delete-problem"><i class="glyphicon glyphicon-remove-circle"></i></a>' +
                '</td>' +
                '</tr>';
            $.template("problemTemplate", problemTemplate);
        },

        getCategoryListByModule: function($moduleSelect) {
            var categoryList = [];
            var moduleId = $moduleSelect.select2("val");
            if (moduleId == "")
                return categoryList;
            for (var i = 0; i < Global.allCategories.length; i ++) {
                var category = Global.allCategories[i];
                if (category.moduleId == moduleId)
                    categoryList.push(category);
            }
            return categoryList;
        },

        initCategory: function() {
            var categoryList = f.getCategoryListByModule($("#problem-moduleId"));
            var $select = $("#problem-categoryId");
            $select.select2("destroy");
            $select.html($.tmpl("categoryTemplate", categoryList));
            Global.initSelect($select);
            if (currentPageMode == PAGE_MODE_EDIT || currentPageMode == PAGE_MODE_DETAIL) {
                $select.select2("val", currentProblem.categoryId);
            } else {
                $select.select2("val", "");
            }
            if (currentPageMode == PAGE_MODE_DETAIL) {
                $select.attr("disabled", true);
            }
        },

        initConditionCategory: function() {
            var categoryList = f.getCategoryListByModule($("#condition-module"));
            var $select = $("#condition-category");
            $select.select2("destroy");
            $select.html($.tmpl("categoryTemplate", categoryList));
            Global.initSelect($select);
            $select.select2("val", "");
        },

        bindEvent: function() {
            $("#problem-moduleId").on("change", function() {
                f.initCategory();
            });

            $("#condition-module").on("change", function() {
                f.initConditionCategory();
            });

            $("#search").on("click", function() {
                f.load();
                return false;
            });
            $("#add").on("click", function() {
                currentPageMode = PAGE_MODE_ADD;
                f.onPageModeChange();
                currentProblem = {};
                DataStructure.object2control(currentProblem, "Problem");
                return false;
            });
            $("#save").on("click", function() {
                f.save();
                return false;
            });
            $("#cancel").on("click", function() {
                currentPageMode = PAGE_MODE_LIST;
                f.onPageModeChange();
                return false;
            });
            $("#back").on("click", function() {
                currentPageMode = PAGE_MODE_LIST;
                f.onPageModeChange();
                return false;
            });
            $container.on("click", ".delete-problem", function() {
                var problem = $.tmplItem($(this)).data;
                if (!window.confirm("您确定要删除该分类吗？"))
                    return;
                Ajax.call({
                    url: "deleteProblem",
                    p: {
                        id: problem.id
                    },
                    f: function(response) {
                        Notify.info("删除成功");
                        f.load();
                    }
                });
            });
            $container.on("click", ".problem-detail", function() {
                currentProblem = $.tmplItem($(this)).data;
                currentPageMode = PAGE_MODE_DETAIL;
                f.onPageModeChange();
                f.open();
            });
            $container.on("click", ".edit-problem", function() {
                currentProblem = $.tmplItem($(this)).data;
                currentPageMode = PAGE_MODE_EDIT;
                f.onPageModeChange();
                f.open();
            });
        },

        open: function() {
            DataStructure.object2control(currentProblem, "Problem");
            $("#problem-moduleId").trigger("change");
        },

        load: function() {
            var moduleId = $("#condition-module").select2("val");
            var categoryId = $("#condition-category").select2("val");
            Ajax.call({
                url: "loadProblems",
                p: {
                    moduleId: moduleId,
                    categoryId: categoryId,
                    keywords: $("#keywords").val(),
                    start: start,
                    limit: limit
                },
                f: function(response) {
                    f.render(response.result);
                }
            });
        },

        render: function(result) {
            $container.html($.tmpl("problemTemplate", result.list, {
                getModuleName: function (item) {
                    for (var i = 0; i < Global.allModules.length; i ++) {
                        var module = Global.allModules[i];
                        if (module.id == item.moduleId)
                            return module.name;
                    }
                    return "";
                },
                getCategoryName: function (item) {
                    for (var i = 0; i < Global.allCategories.length; i ++) {
                        var category = Global.allCategories[i];
                        if (category.id == item.categoryId)
                            return category.name;
                    }
                    return "";
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

        onPageModeChange: function() {
            $("#edit-page input").removeAttr("readonly");
            $("#edit-page select").removeAttr("disabled");
            switch(currentPageMode) {
                case PAGE_MODE_ADD:
                    $("#list-page").hide();
                    $("#add").hide();
                    $("#edit-page").show();
                    $("#save").show();
                    $("#cancel").show();
                    $("#back").hide();
                    break;
                case PAGE_MODE_EDIT:
                    $("#list-page").hide();
                    $("#add").hide();
                    $("#edit-page").show();
                    $("#save").show();
                    $("#cancel").show();
                    $("#back").hide();
                    $("#problem-id").attr("readonly", true);
                    break;
                case PAGE_MODE_LIST:
                    $("#list-page").show();
                    $("#add").show();
                    $("#edit-page").hide();
                    $("#save").hide();
                    $("#cancel").hide();
                    $("#back").hide();
                    break;
                case PAGE_MODE_DETAIL:
                    $("#list-page").hide();
                    $("#add").hide();
                    $("#edit-page").show();
                    $("#save").hide();
                    $("#cancel").hide();
                    $("#back").show();
                    $("#edit-page input").attr("readonly", true);
                    $("#edit-page select").attr("disabled", true);
                    break;
            }
        },

        save: function() {
            DataStructure.control2object(currentProblem, "Problem");
            var url;
            if (currentPageMode == PAGE_MODE_ADD)
                url = "addProblem";
            else
                url = "updateProblem";
            Ajax.call({
                url: url,
                p: {
                    problem: currentProblem
                },
                f: function(response) {
                    Notify.info("保存成功");
                    currentPageMode = PAGE_MODE_LIST;
                    f.onPageModeChange();
                    f.load();
                }
            });
        },

        empty: null
    }
}();

$(document).ready(function() {
    ProblemManager.init();
});


