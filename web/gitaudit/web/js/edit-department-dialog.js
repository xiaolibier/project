/**
 * Created by zhouhaibin on 2016/9/22.
 */
var EditDepartmentDialog = function(){
    var f;
    var dialog;
    return{
        init: function() {
            f = this;
        },

        show: function(options) {
            f.options = options;
            if (dialog == undefined) {
                var url = "audit/html/edit-department-dialog.html";
                var res = nunjucks.render(url);
                $('body').append(res);
                dialog = $('#dialog-edit-department');
                dialog.on("click", ".dialog-ok", function(e) {
                    var name = dialog.find(".department-name").val();
                    if (f.options.callback != undefined) {
                        f.options.callback(name, f.options.callbackPara);
                    }
                });
            }
            f.showDialog();
            dialog.find(".department-name").val(f.options.name);
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
    EditDepartmentDialog.init();
});

