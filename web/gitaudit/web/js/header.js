/**
 * Created by zhouhaibin on 2016/9/19.
 */
var Header = function(){

    return{
        init: function() {
            $("#current-login-user-name").html(Global.userName);
            Global.refreshControlsByPrivilege();
        },

        activeMenu: function(menuId) {
            $("#" + menuId).parents("li").addClass("active");
            $("#" + menuId).append('<span class="selected"></span>');
        },

        empty: null
    }
}();

$(document).ready(function() {
    Header.init();
});

