/**
 * Created by zhouhaibin on 2016/9/19.
 */
var UserManager = function(){
    var PAGE_MODE_LIST = "list";
    var PAGE_MODE_ADD = "add";
    var PAGE_MODE_EDIT = "edit";
    var PAGE_MODE_DETAIL = "detail";
    var currentPageMode = PAGE_MODE_LIST;
    var f;
    var start = 0;
    var limit = 10;
    var $container = $("#user-container");
    var currentUser;
    return{
        init: function() {
            f = this;
            Header.activeMenu("system-manager");
            f.onPageModeChange();
            f.initTemplate();
            f.bindEvent();
            f.initDepartment();
            f.initRole();
            f.load();
        },

        initDepartment: function() {
            $("#user-departmentId").html($.tmpl("departmentTemplate", Global.allDepartments));
            Global.initSelect($("#user-departmentId"));
            $("#user-departmentId").select2("val", "");
        },

        initRole: function() {
            $("#user-roleIds").html($.tmpl("roleTemplate", Global.allRoles));
            Global.initSelect($("#user-roleIds"));
            $("#user-roleIds").select2("val", "");
        },

        initTemplate: function() {
            var departmentTemplate =
                '<option value="${id}"">${fullPathName}</option>';
            $.template("departmentTemplate", departmentTemplate);

            var roleTemplate =
                '<option value="${id}"">${name}</option>';
            $.template("roleTemplate", roleTemplate);

            var userTemplate =
                '<tr id="{$id}">' +
                    '<td>${id}</td>' +
                    '<td>${name}</td>' +
                    '<td>${$item.getStatusString($item.data)}</td>' +
                    '<td>${$item.getDepartment($item.data)}</td>' +
                    '<td>${$item.getRoles($item.data)}</td>' +
                    '<td>${contact}</td>' +
                    '<td>${projectCount}</td>' +
                    '<td>${centerCount}</td>' +
                    '<td>' +
                        '{{if status == 0}}' +
                            '<a title="停用" href="javascript:void(0)" class="table-operation-icon stop-user"><i class="glyphicon glyphicon-exclamation-sign"></i></a>' +
                        '{{else}}' +
                            '<a title="启用" href="javascript:void(0)" class="table-operation-icon start-user"><i class="glyphicon glyphicon-user"></i></a>' +
                        '{{/if}}' +
                        '<a title="详情" href="javascript:void(0)" class="table-operation-icon user-detail"><i class="glyphicon glyphicon-list-alt"></i></a>' +
                        '<a title="编辑" href="javascript:void(0)" class="table-operation-icon edit-user"><i class="glyphicon glyphicon-pencil"></i></a>' +
                        '<a title="删除" href="javascript:void(0)" class="table-operation-icon delete-user"><i class="glyphicon glyphicon-remove-circle"></i></a>' +
                        '<a title="重置密码" href="javascript:void(0)" class="table-operation-icon reset-password"><i class="glyphicon glyphicon-flash"></i></a>' +
                    '</td>' +
                '</tr>';
            $.template("userTemplate", userTemplate);

            var userProjectTemplate =
                '<tr id="{$id}">' +
                    '<td>${id}</td>' +
                    '<td>${name}</td>' +
                    '<td>${$item.getStatusString($item.data)}</td>' +
                    '<td>${created}</td>' +
                    '<td>${$item.getInChargeStatusString($item.data)}</td>' +
                    '<td>' +
                        '{{if inChargeStatus == 0}}' +
                            '<a title="交接给" href="javascript:void(0)" class="table-operation-icon handover-project">交接给</a>' +
                        '{{/if}}' +
                    '</td>' +
                '</tr>';
            $.template("userProjectTemplate", userProjectTemplate);

            var userCenterTemplate =
                '<tr id="{$id}">' +
                    '<td>${projectId}</td>' +
                    '<td>${centerName}</td>' +
                    '<td>${projectName}</td>' +
                    '<td>${stageName}</td>' +
                    '<td>${projectCreated}</td>' +
                    '<td>${$item.getInChargeStatusString($item.data)}</td>' +
                    '<td>' +
                        '{{if inChargeStatus == 0}}' +
                            '<a title="交接给" href="javascript:void(0)" class="table-operation-icon handover-center">交接给</a>' +
                        '{{/if}}' +
                    '</td>' +
                '</tr>';
            $.template("userCenterTemplate", userCenterTemplate);
        },

        bindEvent: function() {
            $("#search").on("click", function() {
                f.load();
                return false;
            });
            $("#add").on("click", function() {
                currentPageMode = PAGE_MODE_ADD;
                f.onPageModeChange();
                currentUser = {};
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
            $container.on("click", ".delete-user", function() {
                var user = $.tmplItem($(this)).data;
                if (!window.confirm("您确定要删除该用户吗？"))
                    return;
                Ajax.call({
                    url: "deleteUser",
                    p: {
                        id: user.id
                    },
                    f: function(response) {
                        Notify.info("删除成功");
                        f.load();
                    }
                });
            });
            $container.on("click", ".stop-user", function() {
                var user = $.tmplItem($(this)).data;
                if (!window.confirm("您确定要停用该用户吗？"))
                    return;
                Ajax.call({
                    url: "stopUser",
                    p: {
                        id: user.id
                    },
                    f: function(response) {
                        Notify.info("停用成功");
                        f.load();
                    }
                });
            });
            $container.on("click", ".start-user", function() {
                var user = $.tmplItem($(this)).data;
                if (!window.confirm("您确定要启用该用户吗？"))
                    return;
                Ajax.call({
                    url: "startUser",
                    p: {
                        id: user.id
                    },
                    f: function(response) {
                        Notify.info("启用成功");
                        f.load();
                    }
                });
            });
            $container.on("click", ".reset-password", function() {
                var user = $.tmplItem($(this)).data;
                if (!window.confirm("您确定要重置该用户的密码吗？"))
                    return;
                Ajax.call({
                    url: "resetPassword",
                    p: {
                        id: user.id
                    },
                    f: function(response) {
                        Notify.info("重置密码成功");
                    }
                });
            });

            $("#project-container").on("click", ".handover-project", function() {
                var project = $.tmplItem($(this)).data;
                HandoverDialog.show({
                    projectName: project.name,
                    selectedUserIdList: [],
                    singleSelect: "true",
                    callback: function(selectedUsers, callbackPara) {
                        var toUserId = selectedUsers[0].id;
                        Ajax.call({
                            url: "handoverProject",
                            p: {
                                projectId: project.id,
                                fromUserId: currentUser.id,
                                toUserId: toUserId
                            },
                            f: function(response) {
                                Notify.info("交接成功");
                                f.loadUserResources();
                            }
                        });
                    },
                    callbackPara: ''
                });
            });

            $("#center-container").on("click", ".handover-center", function() {
                var task = $.tmplItem($(this)).data;
                HandoverDialog.show({
                    projectName: task.projectName,
                    centerName: task.centerName,
                    selectedUserIdList: [],
                    singleSelect: "true",
                    callback: function(selectedUsers, callbackPara) {
                        var toUserId = selectedUsers[0].id;
                        Ajax.call({
                            url: "handoverProjectCenter",
                            p: {
                                projectId: task.projectId,
                                stageId: task.stageId,
                                taskId: task.id,
                                fromUserId: currentUser.id,
                                toUserId: toUserId
                            },
                            f: function(response) {
                                Notify.info("交接成功");
                                f.loadUserResources();
                            }
                        });
                    },
                    callbackPara: ''
                });
            });

            $container.on("click", ".user-detail", function() {
                currentUser = $.tmplItem($(this)).data;
                currentPageMode = PAGE_MODE_DETAIL;
                f.onPageModeChange();
                f.open();
                f.loadUserResources();
            });
            $container.on("click", ".edit-user", function() {
                currentUser = $.tmplItem($(this)).data;
                currentPageMode = PAGE_MODE_EDIT;
                f.onPageModeChange();
                f.open();
            });
        },

        open: function() {
            DataStructure.object2control(currentUser, "User");
            var roleIdList = currentUser.roleIds.split(",");
            $("#user-roleIds").select2("val", roleIdList);
        },

        load: function() {
            Ajax.call({
                url: "loadUsers",
                p: {
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
            $container.html($.tmpl("userTemplate", result.list, {
                getStatusString: function(item) {
                    return GlobalConstants.USER_STATUS[item.status];
                },
                getDepartment: function (item) {
                    for (var i = 0; i < Global.allDepartments.length; i ++) {
                        if (Global.allDepartments[i].id == item.departmentId)
                            return Global.allDepartments[i].name;
                    }
                    return item.departmentId;
                },
                getRoles: function (item) {
                    var roleIdList = item.roleIds.split(",");
                    var roles = [];
                    for (var i = 0; i < roleIdList.length; i ++) {
                        var roleId = roleIdList[i];
                        for (var j = 0; j < Global.allRoles.length; j ++) {
                            if (Global.allRoles[j].id == roleId) {
                                roles.push(Global.allRoles[j].name);
                                break;
                            }
                        }
                    }
                    return roles.join(',');
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
                    $("#user-projects").hide();
                    $("#user-centers").hide();
                    break;
                case PAGE_MODE_EDIT:
                    $("#list-page").hide();
                    $("#add").hide();
                    $("#edit-page").show();
                    $("#save").show();
                    $("#cancel").show();
                    $("#back").hide();
                    $("#user-id").attr("readonly", true);
                    $("#user-projects").hide();
                    $("#user-centers").hide();
                    break;
                case PAGE_MODE_LIST:
                    $("#list-page").show();
                    $("#add").show();
                    $("#edit-page").hide();
                    $("#save").hide();
                    $("#cancel").hide();
                    $("#back").hide();
                    $("#user-projects").hide();
                    $("#user-centers").hide();
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
                    $("#user-projects").show();
                    $("#user-centers").show();
                    break;
            }
        },

        save: function() {
            DataStructure.control2object(currentUser, "User");
            currentUser.roleIds = currentUser.roleIds.join(',');
            var url;
            if (currentPageMode == PAGE_MODE_ADD)
                url = "addUser";
            else
                url = "updateUser";
            Ajax.call({
                url: url,
                p: {
                    user: currentUser
                },
                f: function(response) {
                    if (currentPageMode == PAGE_MODE_ADD) {
                        alert(response.successMessage);
                    } else {
                        Notify.info("保存成功");
                    }
                    currentPageMode = PAGE_MODE_LIST;
                    f.onPageModeChange();
                    f.load();
                }
            });
        },

        loadUserResources: function() {
            Ajax.call({
                url: "loadUserResources",
                p: {
                    id: currentUser.id
                },
                f: function (response) {
                    $("#project-container").html($.tmpl("userProjectTemplate", response.projects, {
                        getStatusString: function (item) {
                            return GlobalConstants.PROJECT_STATUS[item.status];
                        },
                        getInChargeStatusString: function (item) {
                            if (item.inChargeStatus == 0)
                                return "负责中";
                            else
                                return "已交接给" + Global.getUserName(item.handoverTo);
                        }
                    }));
                    $("#center-container").html($.tmpl("userCenterTemplate", response.centers, {
                        //getStatusString: function (item) {
                        //    return GlobalConstants.PROJECT_STATUS[item.status];
                        //},
                        getInChargeStatusString: function (item) {
                            if (item.inChargeStatus == 0)
                                return "负责中";
                            else
                                return "已交接给" + Global.getUserName(item.handoverTo);
                        }
                    }));
                }
            });
        },

        empty: null
    }
}();

$(document).ready(function() {
    UserManager.init();
});


