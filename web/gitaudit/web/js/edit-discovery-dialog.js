/**
 * Created by zhouhaibin on 2016/9/22.
 */
var EditDiscoveryDialog = function(){
    var f;
    var dialog;
    return{
        init: function() {
            //这句话用于解决select2在modal里显示的问题，否则出不来搜索框
            $.fn.modal.Constructor.prototype.enforceFocus = function() {};
            f = this;
        },

        show: function(options) {
            f.options = options;
            f.discovery = options.discovery;
            if (dialog == undefined) {
                var url = "audit/html/edit-discovery-dialog.html";
                var res = nunjucks.render(url);
                $('body').append(res);
                dialog = $('#dialog-edit-discovery');
                f.bindEvent();
                Global.initSelect(dialog.find(".discovery-level"));
                f.renderCategory(dialog.find(".discovery-category"));
            }
            f.initEditDiscoveryDialog();
            f.showDialog();
        },

        bindEvent: function() {
            dialog.on("click", ".discovery-inReport", function() {
                var discovery = f.discovery;
                f.control2Value(dialog, discovery);
                if (discovery.inReport == 1) {
                    if (discovery.level == '' || discovery.level == null || discovery.categoryId == '' || discovery.categoryId == null
                        || discovery.problemId == '' || discovery.problemId == null) {
                        $(this).prop("checked", false);
                        alert("您必须填写分级，分类和问题归类，才能将此发现入报告");
                    }
                }
            });
            dialog.on("click", ".dialog-ok", function(e) {
                var discovery = f.discovery;
                f.control2Value(dialog, discovery);

                if (discovery.description == '') {
                    alert("问题描述不能为空");
                    return false;
                }
                if (f.options.callback) {
                    dialog.modal('hide');
                    f.options.callback(f.discovery);
                }
            });
            dialog.on("change", ".discovery-category", function(event) {
                var categoryId = $(this).select2("val");
                dialog.find(".discovery-problem").select2("destroy");
                var $problemSelect = dialog.find(".discovery-problem");

                $problemSelect.empty();
                //根据分类来过滤问题归类选项
                for (var i = 0; i < Global.allProblems.length; i ++) {
                    var problem = Global.allProblems[i];
                    if (problem.categoryId == categoryId)
                        $problemSelect.append('<option value="' + problem.id + '">' + problem.name + '</option>');
                }
                Global.initSelectWithSearch($problemSelect);
            });
        },

        //renderLimitedWord: function() {
        //    var $select = dialog.find("select.discovery-category");
        //    f.renderCategory($select);
        //    $("select.discovery-level").select2({
        //        formatNoMatches: function() {
        //            return "没有选项";
        //        },
        //        minimumResultsForSearch: -1,//去掉搜索框
        //        //allowClear: true
        //        placeholder: "请选择..."
        //    });
        //},
        //
        renderCategory: function($select) {
            $select.append('<option value="-">所有分类</option>');
            for (var i = 0; i < Global.allCategories.length; i ++) {
                var category = Global.allCategories[i];
                if (category.moduleId == Global.moduleId)
                    $select.append('<option value="' + category.id + '">' + category.name + '</option>');
            }
            for (var i = 0; i < Global.allCategories.length; i ++) {
                var category = Global.allCategories[i];
                if (category.moduleId != Global.moduleId)
                    $select.append('<option value="' + category.id + '">' + category.name + '</option>');
            }
            Global.initSelectWithSearch($select);
        },


        value2Control: function($discovery, discovery) {
            $discovery.find(".discovery-id").html(discovery.code);
            $discovery.find(".discovery-patientNo").val(discovery.patientNo);
            $discovery.find(".discovery-description").val(discovery.description);
            $discovery.find(".discovery-memo").val(discovery.memo);
            $discovery.find(".discovery-level").select2("val", discovery.level);
            $discovery.find(".discovery-category").select2("val", discovery.categoryId);
            $discovery.find(".discovery-category").trigger("change");
            $discovery.find(".discovery-problem").select2("val", discovery.problemId);
            $discovery.find(".discovery-inReport").prop("checked", discovery.inReport == 1);
            $discovery.find(".discovery-descriptionOpinionAccepted").prop("checked", discovery.descriptionOpinionAccepted == 1);
            $discovery.find(".discovery-level2Accepted").prop("checked", discovery.level2Accepted == 1);
            $discovery.find(".discovery-level2").val(discovery.level2);
            $discovery.find(".discovery-descriptionOpinion").val(discovery.descriptionOpinion);
            var creatorName = Global.getUserName(discovery.creatorId);
            $discovery.find(".discovery-creator").val(creatorName);
            $discovery.find(".discovery-created").val(discovery.created);
            var editorName = Global.getUserName(discovery.editorId);
            $discovery.find(".discovery-editor").val(editorName);
            $discovery.find(".discovery-editTime").val(discovery.editTime);

            var color;
            if (discovery.descriptionOpinionAccepted == 1) {
                color = "green";
            } else {
                color = "red";
            }
            $discovery.find(".discovery-descriptionOpinion").css("color", color);

            if (discovery.level == discovery.level2) {
                color = "green";
            } else {
                if (discovery.level2Accepted) {
                    color = "orange";
                } else {
                    color = "red";
                }
            }
            $discovery.find(".discovery-level2").css("color", color);
        },

        control2Value: function($discovery, discovery) {
            discovery.patientNo = $discovery.find(".discovery-patientNo").val();
            discovery.description = $discovery.find(".discovery-description").val();
            discovery.memo = $discovery.find(".discovery-memo").val();
            discovery.level = $discovery.find(".discovery-level").select2("val");
            discovery.categoryId = $discovery.find(".discovery-category").select2("val");
            discovery.problemId = $discovery.find(".discovery-problem").select2("val");
            discovery.inReport = $discovery.find(".discovery-inReport").prop("checked") ? 1 : 0;
            discovery.descriptionOpinionAccepted = $discovery.find(".discovery-descriptionOpinionAccepted").prop("checked") ? 1 : 0;
            discovery.level2Accepted = $discovery.find(".discovery-level2Accepted").prop("checked") ? 1 : 0;
        },

        initEditDiscoveryDialog: function() {
            f.value2Control(dialog, f.discovery);
            if (f.discovery.descriptionOpinion == '') {
                dialog.find(".discovery-descriptionOpinionAccepted-container").hide();
            } else {
                dialog.find(".discovery-descriptionOpinionAccepted-container").show();
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
    EditDiscoveryDialog.init();
});

