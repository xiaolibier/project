
/**
 * Created by zhouhaibin on 2016/9/19.
 */
var RoleManager = function(){
    var PAGE_MODE_LIST = "list";
    var PAGE_MODE_ADD = "add";
    var PAGE_MODE_EDIT = "edit";
    var PAGE_MODE_DETAIL = "detail";
    var currentPageMode = PAGE_MODE_LIST;
    var f;
    var $container = $("#role-container");
    var currentRole;
    return{
        init: function() {
            f = this;
            Header.activeMenu("system-manager");
            f.onPageModeChange();
            f.initTemplate();
            f.bindEvent();
            f.initPrivilege();
            f.load();
        },

        initPrivilege: function() {
            $("#role-privilegeIds").html($.tmpl("privilegeTemplate", Global.allPrivileges));
            Global.initSelect($("#role-privilegeIds"));
            $("#role-privilegeIds").select2("val", "");
        },

        initTemplate: function() {
            var privilegeTemplate =
                '<option value="${id}"">${name}</option>';
            $.template("privilegeTemplate", privilegeTemplate);

            var roleTemplate =
                '<tr id="{$id}">' +
                     '<td>${id}</td>' +
                    '<td>${name}</td>' +
                    '<td>${$item.getStatusString($item.data)}</td>' +
                    '<td>' +
                        '<a title="详情" href="javascript:void(0)" class="table-operation-icon role-detail"><i class="glyphicon glyphicon-list-alt"></i></a>' +
                        '<a title="编辑" href="javascript:void(0)" class="table-operation-icon edit-role"><i class="glyphicon glyphicon-pencil"></i></a>' +
                        '<a title="删除" href="javascript:void(0)" class="table-operation-icon delete-role"><i class="glyphicon glyphicon-remove-circle"></i></a>' +
                    '</td>' +
                '</tr>';
            $.template("roleTemplate", roleTemplate);
        },

        bindEvent: function() {
            $("#search").on("click", function() {
                f.load();
                return false;
            });
            $("#add").on("click", function() {
                currentPageMode = PAGE_MODE_ADD;
                f.onPageModeChange();
                currentRole = {};
                return false;
            });
            $("#save").on("click", function() {
                try {
                    f.save();
                } catch(e) {
                    console.error(e);
                }
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
            $container.on("click", ".delete-role", function() {
                var role = $.tmplItem($(this)).data;
                if (!window.confirm("您确定要删除该角色吗？"))
                    return;
                Ajax.call({
                    url: "deleteRole",
                    p: {
                        id: role.id
                    },
                    f: function(response) {
                        Notify.info("删除成功");
                        f.load();
                    }
                });
            });
            $container.on("click", ".role-detail", function() {
                currentRole = $.tmplItem($(this)).data;
                currentPageMode = PAGE_MODE_DETAIL;
                f.onPageModeChange();
                f.open();
            });
            $container.on("click", ".edit-role", function() {
                currentRole = $.tmplItem($(this)).data;
                currentPageMode = PAGE_MODE_EDIT;
                f.onPageModeChange();
                f.open();
            });
        },

        open: function() {
            DataStructure.object2control(currentRole, "Role");
            var privilegeIdList = currentRole.privilegeIds.split(",");
            $("#role-privilegeIds").select2("val", privilegeIdList);
        },

        load: function() {
            Ajax.call({
                url: "loadRoles",
                p: {
                },
                f: function(response) {
                    f.render(response);
                }
            });
        },

        render: function(response) {
            $container.html($.tmpl("roleTemplate", response.list, {
                getStatusString: function (item) {
                    return "";
                }
            }));
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
                    $("#role-id").attr("readonly", true);
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
            DataStructure.control2object(currentRole, "Role");
            currentRole.privilegeIds = currentRole.privilegeIds.join(',');
            var url;
            if (currentPageMode == PAGE_MODE_ADD)
                url = "addRole";
            else
                url = "updateRole";
            Ajax.call({
                url: url,
                p: {
                    role: currentRole
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
    RoleManager.init();
});


