/**
 * Created by zhouhaibin on 2016/9/19.
 */
var DepartmentManager = function(){
    var f;
    var $container = $("#department-container");
    return{
        init: function() {
            f = this;
            Header.activeMenu("system-manager");
            f.initTemplate();
            f.bindEvent();
            f.load();
        },

        initTemplate: function() {
            var departmentTemplate =
                '<li id="{$id}" class="list-group-item">' +
                    '<span class="" style="margin-left: ${margin}px;">' +
                        '<i class="glyphicon glyphicon-triangle-bottom"></i>' +
                        '${name}' +
                        '<a title="添加子部门" href="javascript:void(0)" class="toolbar-icon add-child"><i class="glyphicon glyphicon-plus"></i></a>' +
                        '{{if id != "-"}}' +
                            '<a title="编辑" href="javascript:void(0)" class="table-operation-icon edit-department"><i class="glyphicon glyphicon-pencil"></i></a>' +
                            '<a title="删除" href="javascript:void(0)" class="table-operation-icon delete-department"><i class="glyphicon glyphicon-remove-circle"></i></a>' +
                        '{{/if}}' +
                    '</span>' +
                '</li>';
            $.template("departmentTemplate", departmentTemplate);

        },

        bindEvent: function() {
            $container.on("click", ".add-child", function() {
                var parent = $.tmplItem($(this)).data;
                EditDepartmentDialog.show({
                    name: "",
                    callback: function(name, parent) {
                        Ajax.call({
                            url: "addDepartment",
                            p:{
                                parentId: parent.id,
                                name: name
                            },
                            f: function(response) {
                                f.load();    
                            } 
                        })
                    },
                    callbackPara: parent
                });
            });
            $container.on("click", ".delete-department", function() {
                var object = $.tmplItem($(this)).data;
                var $department = $(this).parents("li");
                if (object.id == "-") {
                    return;
                }
                    
                if (!window.confirm("您确定要删除这个部门吗？"))
                    return;
                Ajax.call({
                    url: "deleteDepartment",
                    p: {
                        id: object.id
                    },
                    f: function(response) {
                        Notify.info("删除成功");
                        $department.remove();
                    }
                });
            });
            $container.on("click", ".edit-department", function() {
                var department = $.tmplItem($(this)).data;
                EditDepartmentDialog.show({
                    name: department.name,
                    callback: function(name) {
                        Ajax.call({
                            url: "updateDepartment",
                            p:{
                                id: department.id,
                                name: name
                            },
                            f: function(response) {
                                f.load();
                            }
                        })
                    }
                });
            });
        },

        load: function() {
            Ajax.call({
                url: "loadDepartments",
                p: {},
                f: function(response) {
                    f.render(response);
                }
            });
        },

        render: function(response) {
            $container.html($.tmpl("departmentTemplate", response.list));
        },

        empty: null
    }
}();

$(document).ready(function() {
    DepartmentManager.init();
});

