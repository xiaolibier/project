/**
 * Created by zhouhaibin on 2016/9/19.
 */
var ReferenceManager = function(){
    var PAGE_MODE_LIST = "list";
    var PAGE_MODE_ADD = "add";
    var PAGE_MODE_EDIT = "edit";
    var PAGE_MODE_DETAIL = "detail";
    var currentPageMode = PAGE_MODE_LIST;
    var f;
    var start = 0;
    var limit = 10;
    var $container = $("#reference-container");
    var currentReference;
    return{
        init: function() {
            f = this;
            Global.initTableLayout();
            Header.activeMenu("system-manager");
            f.onPageModeChange();
            f.initTemplate();
            f.bindEvent();
            f.initModule();
            Global.initSelect($("#reference-categoryId"));
            Global.initSelect($("#condition-category"));
            Global.initSelect($("#reference-problemId"));
            Global.initSelect($("#condition-problem"));
            f.load();
        },

        initModule: function() {
            $("#reference-moduleId").html($.tmpl("moduleTemplate", Global.allModules));
            Global.initSelect($("#reference-moduleId"));
            $("#reference-moduleId").select2("val", "");

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
                '<option value="${id}" itemId="${id}">${name}</option>';
            $.template("problemTemplate", problemTemplate);

            var referenceTemplate =
                '<tr id="{$id}">' +
                '<td>${$item.getModuleName($item.data)}</td>' +
                '<td>${$item.getCategoryName($item.data)}</td>' +
                '<td>${$item.getProblemName($item.data)}</td>' +
                '<td>${name}</td>' +
                '<td>' +
                    '<a title="编辑" href="javascript:void(0)" class="table-operation-icon edit-reference"><i class="glyphicon glyphicon-pencil"></i></a>' +
                    '<a title="删除" href="javascript:void(0)" class="table-operation-icon delete-reference"><i class="glyphicon glyphicon-remove-circle"></i></a>' +
                '</td>' +
                '</tr>';
            $.template("referenceTemplate", referenceTemplate);
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

        getProblemListByCategory: function($categorySelect) {
            var problemList = [];
            var categoryId = $categorySelect.select2("val");
            if (categoryId == "")
                return categoryList;
            for (var i = 0; i < Global.allProblems.length; i ++) {
                var problem = Global.allProblems[i];
                if (problem.categoryId == categoryId)
                    problemList.push(problem);
            }
            return problemList;
        },

        initCategory: function() {
            var categoryList = f.getCategoryListByModule($("#reference-moduleId"));
            var $select = $("#reference-categoryId");
            var $problemSelect = $("#reference-problemId");
            $select.select2("destroy");
            $problemSelect.select2("destroy");
            $problemSelect.html();
            $select.html($.tmpl("categoryTemplate", categoryList));
            Global.initSelect($select);
            Global.initSelect($problemSelect);
            if (currentPageMode == PAGE_MODE_EDIT || currentPageMode == PAGE_MODE_DETAIL) {
                $select.select2("val", currentReference.categoryId);
            } else {
                $select.select2("val", "");
            }
            if (currentPageMode == PAGE_MODE_DETAIL) {
                $select.attr("disabled", true);
            }
            $select.trigger("change");
        },

        initConditionCategory: function() {
            var categoryList = f.getCategoryListByModule($("#condition-module"));
            categoryList.push({
                id: "-",
                name: "所有分类"
            });
            var $select = $("#condition-category");
            var $problemSelect = $("#condition-problem");
            $select.select2("destroy");
            $problemSelect.select2("destroy");
            $problemSelect.html();
            $select.html($.tmpl("categoryTemplate", categoryList));
            Global.initSelect($select);
            Global.initSelect($problemSelect);
            $select.select2("val", "");
        },

        initProblem: function() {
            var problemList = f.getProblemListByCategory($("#reference-categoryId"));
            var $select = $("#reference-problemId");
            $select.select2("destroy");
            $select.html($.tmpl("problemTemplate", problemList));
            Global.initSelect($select);
            if (currentPageMode == PAGE_MODE_EDIT || currentPageMode == PAGE_MODE_DETAIL) {
                $select.select2("val", currentReference.problemId);
            } else {
                $select.select2("val", "");
            }
            if (currentPageMode == PAGE_MODE_DETAIL) {
                $select.attr("disabled", true);
            }
        },

        initConditionProblem: function() {
            var problemList = f.getProblemListByCategory($("#condition-category"));
            var $select = $("#condition-problem");
            $select.select2("destroy");
            $select.html($.tmpl("problemTemplate", problemList));
            Global.initSelect($select);
            $select.select2("val", "");
        },

        bindEvent: function() {
            $("#reference-moduleId").on("change", function() {
                f.initCategory();
            });

            $("#condition-module").on("change", function() {
                f.initConditionCategory();
            });

            $("#reference-categoryId").on("change", function() {
                f.initProblem();
            });

            $("#condition-category").on("change", function() {
                f.initConditionProblem();
            });

            $("#search").on("click", function() {
                f.load();
                return false;
            });
            $("#add").on("click", function() {
                currentPageMode = PAGE_MODE_ADD;
                f.onPageModeChange();
                currentReference = {};
                DataStructure.object2control(currentReference, "Reference");
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
            $container.on("click", ".delete-reference", function() {
                var reference = $.tmplItem($(this)).data;
                if (!window.confirm("您确定要删除该依据吗？"))
                    return;
                Ajax.call({
                    url: "deleteReference",
                    p: {
                        id: reference.id
                    },
                    f: function(response) {
                        Notify.info("删除成功");
                        f.load();
                    }
                });
            });
            $container.on("click", ".reference-detail", function() {
                currentReference = $.tmplItem($(this)).data;
                currentPageMode = PAGE_MODE_DETAIL;
                f.onPageModeChange();
                f.open();
            });
            $container.on("click", ".edit-reference", function() {
                currentReference = $.tmplItem($(this)).data;
                currentPageMode = PAGE_MODE_EDIT;
                f.onPageModeChange();
                f.open();
            });
        },

        open: function() {
            DataStructure.object2control(currentReference, "Reference");
            $("#reference-moduleId").trigger("change");
        },

        load: function() {
            var moduleId = $("#condition-module").select2("val");
            var categoryId = $("#condition-category").select2("val");
            var problemId = $("#condition-problem").select2("val");
            Ajax.call({
                url: "loadReferences",
                p: {
                    moduleId: moduleId,
                    categoryId: categoryId,
                    problemId: problemId,
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
            $container.html($.tmpl("referenceTemplate", result.list, {
                getModuleName: function (item) {
                    for (var i = 0; i < Global.allModules.length; i ++) {
                        var module = Global.allModules[i];
                        if (module.id == item.moduleId)
                            return module.name;
                    }
                    return item.moduleId;
                },
                getCategoryName: function (item) {
                    for (var i = 0; i < Global.allCategories.length; i ++) {
                        var category = Global.allCategories[i];
                        if (category.id == item.categoryId)
                            return category.name;
                    }
                    return item.categoryId;
                },
                getProblemName: function (item) {
                    for (var i = 0; i < Global.allProblems.length; i ++) {
                        var problem = Global.allProblems[i];
                        if (problem.id == item.problemId)
                            return problem.name;
                    }
                    return item.problemId;
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
                    $("#reference-id").attr("readonly", true);
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
            DataStructure.control2object(currentReference, "Reference");
            var url;
            if (currentPageMode == PAGE_MODE_ADD)
                url = "addReference";
            else
                url = "updateReference";
            Ajax.call({
                url: url,
                p: {
                    reference: currentReference
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
    ReferenceManager.init();
});


