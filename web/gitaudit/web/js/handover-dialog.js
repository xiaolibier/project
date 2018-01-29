/**
 * Created by zhouhaibin on 2016/9/22.
 */
var HandoverDialog = function(){
    var f;
    var dialog;
    return{
        init: function() {
            f = this;
            var selectUserTemplate =
                '<optgroup label="${fullPathName}">' +
                    '{{each(i, user) users}}' +
                    '<option value="${user.id}">${user.name}</option>' +
                    '{{/each}}' +
                '</optgroup>';
            $.template("selectUserTemplate", selectUserTemplate);
        },

        show: function(options) {
            f.options = options;
            f.singleSelectUser = f.options.singleSelect;
            if (dialog == undefined) {
                var url = "audit/html/handover-dialog.html";
                var res = nunjucks.render(url);
                $('body').append(res);
                dialog = $('#dialog-handover');
                f.initHandoverDialog();
                f.doNothingAfterSelect = false;
                dialog.find(".multi-select-user").multiSelect( {
                    afterSelect: function(values) {
                        if (!f.doNothingAfterSelect) {
                            f.doNothingAfterSelect = true;
                            if (f.singleSelectUser == "true") {
                                dialog.find(".multi-select-user").multiSelect('deselect_all');
                                dialog.find(".multi-select-user").multiSelect('select', values);
                            }
                            f.doNothingAfterSelect = false;
                        }
                    },
                    selectableOptgroup: false
                });
                dialog.on("click", ".dialog-ok", function(e) {
                    selectedUsers = [];
                    if (f.options.callback != undefined) {
                        var $selectedUsers = dialog.find("option:selected");
                        $selectedUsers.each(function(index, $selectedUser){
                            var user = {
                                id: $($selectedUser).prop("value"),
                                name: $($selectedUser).html()
                            };
                            selectedUsers.push(user);
                        });
                        f.options.callback(selectedUsers, f.options.callbackPara);
                    }
                });
            }
            f.showDialog();
            if (f.options.selectedUserIdList != undefined && f.options.selectedUserIdList.length > 0) {
                f.doNothingAfterSelect = true;
                dialog.find(".multi-select-user").multiSelect('select', f.options.selectedUserIdList);
                f.doNothingAfterSelect = false;
            } else {
                dialog.find(".multi-select-user").multiSelect('deselect_all');
            }
            if (f.options.projectName)
                dialog.find(".project-name").html(f.options.projectName);
            if (f.options.centerName)
                dialog.find(".center-name").html(f.options.centerName);
        },

        initHandoverDialog: function() {
            f.buildDepartmentUser();
            dialog.find(".multi-select-user").html($.tmpl("selectUserTemplate", Global.allDepartments));
        },

        buildDepartmentUser: function() {
            for (var i = 0; i < Global.allDepartments.length; i ++) {
                var department = Global.allDepartments[i];
                department.users = [];
                for (var j = 0; j < Global.allUsers.length; j ++) {
                    var user = Global.allUsers[j];
                    if (user.departmentId == department.id) {
                        department.users.push(user);
                    }
                }
            }
        },

        showDialog: function() {
            dialog.modal({
                backdrop:'static',
                keyboard:true,
                show:true
            });
        },

        empty: null
    }
}();

$(document).ready(function() {
    HandoverDialog.init();
});

