/**
 * Created by zhouhaibin on 2016/9/27.
 */
var ModuleRecordManager = function(){
    var f;
    return{
        init: function() {
            f = this;
            f.initTemplate();
        },

        empty: null
    }
}();

$(document).ready(function() {
    ModuleRecordManager.init();
});
