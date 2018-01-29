/**
 * Created by zhouhaibin on 2016/9/19.
 */
var TemplateUtil = function(){
    var initialized = false;
    return{
        init: function() {
            if (initialized)
                return;
            var url = "audit/html/template.html";
            var res = nunjucks.render(url);
            var $templates = $(res).find('.template');
            $templates.each(function() {
                var $template = $(this);
                $.template($template.attr("id"), $template.html());
            });
            initialized = true;
        },

        empty: null
    }
}();

