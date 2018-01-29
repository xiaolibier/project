/**
 * Created by zhouhaibin on 2016/9/22.
 */
var SelectReferenceDialog = function(){
    var f;
    var dialog;
    return{
        init: function() {
            f = this;
            var selectReferenceTemplate =
                '<tr>' +
                    '<td><input type="checkbox" referenceId="${id}"></td>' +
                    '<td>${categoryId}</td>' +
                    '<td>${problemId}</td>' +
                    '<td>${name}</td>' +
                '</tr>';
            $.template("selectReferenceTemplate", selectReferenceTemplate);
        },

        show: function(options) {
            f.problemId = options.problemId;
            f.options = options;
            if (dialog == undefined) {
                var url = "audit/html/select-reference-dialog.html";
                var res = nunjucks.render(url);
                $('body').append(res);
                dialog = $('#dialog-select-reference');
                dialog.on("click", ".dialog-ok", function(e) {
                    var selectedReferences = [];
                    if (f.options.callback != undefined) {
                        var $selectedReferences = dialog.find("tbody input:checked");
                        $selectedReferences.each(function(){
                            var reference = $.tmplItem($(this)).data;
                            selectedReferences.push(reference);
                        });
                        f.options.callback(selectedReferences, f.options.callbackPara);
                    }
                });
            }
            f.initSelectReferenceDialog();
            f.showDialog();
        },

        initSelectReferenceDialog: function() {
            var references = [];
            for (var i = 0; i < Global.allReferences.length; i ++) {
                var reference = Global.allReferences[i];
                if (reference.problemId == f.problemId)
                    references.push(reference);
            }
            dialog.find(".reference-container").html($.tmpl("selectReferenceTemplate", references));
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
    SelectReferenceDialog.init();
});

