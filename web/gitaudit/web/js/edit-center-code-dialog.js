/**
 * Created by zhouhaibin on 2016/9/22.
 */
var EditCenterCodeDialog = function(){
    var f;
    var dialog;
    return{
        init: function() {
            f = this;
        },

        show: function(options) {
            f.options = options;
            if (dialog == undefined) {
                var url = "audit/html/edit-center-code-dialog.html";
                var res = nunjucks.render(url);
                $('body').append(res);
                dialog = $('#dialog-edit-center-code');
                dialog.on("click", ".dialog-ok", function(e) {
                    var data = {};
                    data.code = dialog.find(".center-code-input").val();
                    data.principal = dialog.find(".center-principal-input").val();
                    data.operateDepartment = dialog.find(".center-operateDepartment-input").val();
                    data.researcher = dialog.find(".center-researcher-input").val();
                    if (f.options.callback != undefined) {
                        f.options.callback(data, f.options.callbackPara);
                    }
                });
            }
            f.showDialog();
            var data = options.data;
            dialog.find(".center-code-input").val(data.code);
            dialog.find(".center-principal-input").val(data.principal);
            dialog.find(".center-operateDepartment-input").val(data.operateDepartment);
            dialog.find(".center-researcher-input").val(data.researcher);
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
    EditCenterCodeDialog.init();
});

