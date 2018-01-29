/**
 * Created by zhouhaibin on 2016/9/19.
 */
var CategoryManager = function(){
    var PAGE_MODE_LIST = "list";
    var PAGE_MODE_ADD = "add";
    var PAGE_MODE_EDIT = "edit";
    var PAGE_MODE_DETAIL = "detail";
    var currentPageMode = PAGE_MODE_LIST;
    var f;
    var start = 0;
    var limit = 10;
    var $container = $("#category-container");
    var currentCategory;
    return{
        init: function() {
            f = this;
            Header.activeMenu("system-manager");
            f.onPageModeChange();
            f.initTemplate();
            f.bindEvent();
            f.initModule();
            f.load();
        },

        initModule: function() {
            $("#category-moduleId").html($.tmpl("moduleTemplate", Global.allModules));
            Global.initSelect($("#category-moduleId"));
            $("#category-moduleId").select2("val", "");

            $("#condition-module").append($.tmpl("moduleTemplate", Global.allModules));
            Global.initSelect($("#condition-module"));
            $("#condition-module").select2("val", "");
        },

        initTemplate: function() {
            var moduleTemplate =
                '<option value="${id}" itemId="${id}">${name}</option>';
            $.template("moduleTemplate", moduleTemplate);

            var categoryTemplate =
                '<tr id="{$id}">' +
                '<td>${$item.getModuleName($item.data)}</td>' +
                '<td>${moduleId}</td>' +
                '<td>${name}</td>' +
                '<td>${id}</td>' +
                '<td>' +
                    '<a title="编辑" href="javascript:void(0)" class="table-operation-icon edit-category"><i class="glyphicon glyphicon-pencil"></i></a>' +
                    '<a title="删除" href="javascript:void(0)" class="table-operation-icon delete-category"><i class="glyphicon glyphicon-remove-circle"></i></a>' +
                '</td>' +
                '</tr>';
            $.template("categoryTemplate", categoryTemplate);
        },

        bindEvent: function() {
            $("#search").on("click", function() {
                f.load();
                return false;
            });
            $("#add").on("click", function() {
                currentPageMode = PAGE_MODE_ADD;
                f.onPageModeChange();
                currentCategory = {};
                DataStructure.object2control(currentCategory, "Category");
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
            $container.on("click", ".delete-category", function() {
                var category = $.tmplItem($(this)).data;
                if (!window.confirm("您确定要删除该分类吗？"))
                    return;
                Ajax.call({
                    url: "deleteCategory",
                    p: {
                        id: category.id
                    },
                    f: function(response) {
                        Notify.info("删除成功");
                        f.load();
                    }
                });
            });
            $container.on("click", ".category-detail", function() {
                currentCategory = $.tmplItem($(this)).data;
                currentPageMode = PAGE_MODE_DETAIL;
                f.onPageModeChange();
                f.open();
            });
            $container.on("click", ".edit-category", function() {
                currentCategory = $.tmplItem($(this)).data;
                currentPageMode = PAGE_MODE_EDIT;
                f.onPageModeChange();
                f.open();
            });
        },

        open: function() {
            DataStructure.object2control(currentCategory, "Category");
        },

        load: function() {
            var moduleId = $("#condition-module").select2("val");
            Ajax.call({
                url: "loadCategories",
                p: {
                    moduleId: moduleId,
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
            $container.html($.tmpl("categoryTemplate", result.list, {
                getModuleName: function (item) {
                    for (var i = 0; i < Global.allModules.length; i ++) {
                        var module = Global.allModules[i];
                        if (module.id == item.moduleId)
                            return module.name;
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
                    $("#category-id").attr("readonly", true);
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
            DataStructure.control2object(currentCategory, "Category");
            var url;
            if (currentPageMode == PAGE_MODE_ADD)
                url = "addCategory";
            else
                url = "updateCategory";
            Ajax.call({
                url: url,
                p: {
                    category: currentCategory
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
    CategoryManager.init();
});


