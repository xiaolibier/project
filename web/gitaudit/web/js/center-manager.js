/**
 * Created by zhouhaibin on 2016/9/19.
 */
var CenterManager = function(){
    var PAGE_MODE_LIST = "list";
    var PAGE_MODE_ADD = "add";
    var PAGE_MODE_EDIT = "edit";
    var PAGE_MODE_DETAIL = "detail";
    var currentPageMode = PAGE_MODE_LIST;
    var f;
    var start = 0;
    var limit = 10;
    var $container = $("#center-container");
    var currentCenter;
    return{
        init: function() {
            f = this;
            Global.initTableLayout();
            Header.activeMenu("system-manager");
            Global.initSelect($("#center-type"));
            f.onPageModeChange();
            f.initTemplate();
            f.bindEvent();
            f.initProvince();
            f.initConditionProvince();
            Global.initSelect($("#center-city"));
            Global.initSelect($("#center-town"));
            Global.initSelect($("#condition-city"));
            Global.initSelect($("#condition-town"));
        },

        initProvince: function() {
            Ajax.call({
                url: "loadProvince",
                p: {},
                f: function(response) {
                    $("#center-province").html($.tmpl("selectTemplate", response.list));
                    Global.initSelect($("#center-province"));
                    $("#center-province").select2("val", "");
                }
            });
        },

        initConditionProvince: function() {
            Ajax.call({
                url: "loadProvince",
                p: {},
                f: function(response) {
                    $("#condition-province").html($.tmpl("selectTemplate", response.list));
                    Global.initSelect($("#condition-province"));
                    $("#condition-province").select2("val", "");
                    f.load();
                }
            });
        },

        initCity: function() {
            var province = $("#center-province").select2("val");
            if (province == "")
                return;
            Ajax.call({
                url: "loadCity",
                p: {
                    province: province
                },
                f: function(response) {
                    $("#center-city").select2("destroy");
                    $("#center-town").select2("destroy");
                    Global.initSelect($("#center-town"));
                    $("#center-city").html($.tmpl("selectTemplate", response.list));
                    Global.initSelect($("#center-city"));
                    $("#center-city").on("change", function() {
                        f.initTown();
                    });

                    if (currentPageMode == PAGE_MODE_EDIT || currentPageMode == PAGE_MODE_DETAIL) {
                        $("#center-city").select2("val", currentCenter.city);
                    } else {
                        $("#center-city").select2("val", "");
                    }
                    if (currentPageMode == PAGE_MODE_DETAIL) {
                        $("#center-city").attr("disabled", true);
                    }
                    $("#center-city").trigger("change");
                }
            });
        },

        initConditionCity: function() {
            var province = $("#condition-province").select2("val");
            if (!province || province == "")
                return;
            Ajax.call({
                url: "loadCity",
                p: {
                    province: province
                },
                f: function(response) {
                    $("#condition-city").select2("destroy");
                    $("#condition-town").select2("destroy");
                    Global.initSelect($("#condition-town"));
                    $("#condition-city").html($.tmpl("selectTemplate", response.list));
                    Global.initSelect($("#condition-city"));
                    $("#condition-city").on("change", function() {
                        f.initConditionTown();
                    });
                    $("#condition-city").trigger("change");
                }
            });
        },

        initTown: function() {
            var province = $("#center-province").select2("val");
            if (province == "")
                return;
            var city = $("#center-city").select2("val");
            if (city == "")
                return;
            Ajax.call({
                url: "loadTown",
                p: {
                    province: province,
                    city: city
                },
                f: function(response) {
                    $("#center-town").select2("destroy");
                    $("#center-town").html($.tmpl("selectTemplate", response.list));
                    Global.initSelect($("#center-town"));
                    if (currentPageMode == PAGE_MODE_EDIT || currentPageMode == PAGE_MODE_DETAIL) {
                        $("#center-town").select2("val", currentCenter.town);
                    } else {
                        $("#center-town").select2("val", "");
                    }
                    if (currentPageMode == PAGE_MODE_DETAIL) {
                        $("#center-town").attr("disabled", true);
                    }
                }
            });
        },

        initConditionTown: function() {
            var province = $("#condition-province").select2("val");
            if (!province || province == "")
                return;
            var city = $("#condition-city").select2("val");
            if (city == "")
                return;
            Ajax.call({
                url: "loadTown",
                p: {
                    province: province,
                    city: city
                },
                f: function(response) {
                    $("#condition-town").select2("destroy");
                    $("#condition-town").html($.tmpl("selectTemplate", response.list));
                    Global.initSelect($("#condition-town"));
                }
            });
        },

        initTemplate: function() {
            var selectTemplate =
                '<option value="${name}" itemId="${id}">${name}</option>';
            $.template("selectTemplate", selectTemplate);

            var centerTemplate =
                '<tr id="{$id}">' +
                '<td>${name}</td>' +
                '<td>${id}</td>' +
                '<td>${website}</td>' +
                '<td>${address}</td>' +
                '<td>${type}</td>' +
                '<td>${certificate}</td>' +
                '<td>${department}</td>' +
                '<td>' +
                    '<a title="详情" href="javascript:void(0)" class="table-operation-icon center-detail"><i class="glyphicon glyphicon-list-alt"></i></a>' +
                    '<a title="编辑" href="javascript:void(0)" class="table-operation-icon edit-center"><i class="glyphicon glyphicon-pencil"></i></a>' +
                    '<a title="删除" href="javascript:void(0)" class="table-operation-icon delete-center"><i class="glyphicon glyphicon-remove-circle"></i></a>' +
                '</td>' +
                '</tr>';
            $.template("centerTemplate", centerTemplate);
        },

        bindEvent: function() {
            $("#search").on("click", function() {
                f.load();
                return false;
            });
            $("#center-province").on("change", function() {
                f.initCity();
            });
            $("#condition-province").on("change", function() {
                f.initConditionCity();
            });
            $("#add").on("click", function() {
                currentPageMode = PAGE_MODE_ADD;
                f.onPageModeChange();
                currentCenter = {};
                if (Global.debugMode == true)
                    Test.createEmptyCenter(currentCenter);
                DataStructure.object2control(currentCenter, "Center");
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
            $container.on("click", ".delete-center", function() {
                var center = $.tmplItem($(this)).data;
                if (!window.confirm("您确定要删除该中心吗？"))
                    return;
                Ajax.call({
                    url: "deleteCenter",
                    p: {
                        id: center.id
                    },
                    f: function(response) {
                        Notify.info("删除成功");
                        f.load();
                    }
                });
            });
            $container.on("click", ".center-detail", function() {
                currentCenter = $.tmplItem($(this)).data;
                currentPageMode = PAGE_MODE_DETAIL;
                f.onPageModeChange();
                f.open();
            });
            $container.on("click", ".edit-center", function() {
                currentCenter = $.tmplItem($(this)).data;
                currentPageMode = PAGE_MODE_EDIT;
                f.onPageModeChange();
                f.open();
            });
        },

        open: function() {
            DataStructure.object2control(currentCenter, "Center");
            $("#center-province").trigger("change");
        },

        load: function() {
            var city = $("#condition-city").select2("val");
            var town = $("#condition-town").select2("val");
            var province = $("#condition-province").select2("val");
            Ajax.call({
                url: "loadCenters",
                p: {
                    province: province,
                    city: city,
                    town: town,
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
            $container.html($.tmpl("centerTemplate", result.list));
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
                    $("#center-id").attr("readonly", true);
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
            DataStructure.control2object(currentCenter, "Center");
            var url;
            if (currentPageMode == PAGE_MODE_ADD)
                url = "addCenter";
            else
                url = "updateCenter";
            Ajax.call({
                url: url,
                p: {
                    center: currentCenter
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
    CenterManager.init();
});


