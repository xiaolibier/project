/**
 * Created by zhouhaibin on 2016/9/19.
 */
var DataTemplateManager = function(){
    var f;
    //var start = 0;
    //var limit = 10;
    //var $container = $("#object-container");
    return{
        init: function() {
            f = this;
            Header.activeMenu("system-manager");
            f.initTemplate();
            f.bindEvent();
            f.load();
            $(".nav li[type='" + Global.type + "']").addClass("active");
            $(".nav li[type='" + Global.type + "'] a").attr("href", "javascript:void(0)");
        },

        initTemplate: function() {
            //var dataTemplateTemplate =
            //    '<li stageid="${id}" role="presentation">' +
            //        '<a href="javascript:void(0)">' +
            //            '${name}' +
            //        '</a>' +
            //    '</li>';
            //$.template("dataTemplateTemplate", dataTemplateTemplate);

        },

        bindEvent: function() {
            $("#save").on("click", function() {
                var dataTemplates = [];
                $(".data-item").each(function() {
                    var $control = $(this);
                    dataTemplates.push({
                        id: $control.attr("id"),
                        content: $control.val()
                    });
                });
                Ajax.call({
                    url: "updateDataTemplates",
                    p: {
                        dataTemplates: dataTemplates
                    },
                    f: function(response) {
                        Notify.info("保存成功");
                    }
                })
            });
        },

        load: function() {
            Ajax.call({
                url: "loadDataTemplates",
                p: {
                },
                f: function(response) {
                    f.render(response.dataTemplates);
                }
            });
        },

        render: function(dataTemplates) {
            $(".data-item").each(function() {
                var $control = $(this);
                var dataTemplate = dataTemplates[$control.attr("id")];
                $control.val(dataTemplate.content);
            })
        },

        empty: null
    }
}();

$(document).ready(function() {
    DataTemplateManager.init();
});

