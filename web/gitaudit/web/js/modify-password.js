/**
 * Created by zhouhaibin on 2016/9/19.
 */
var ModifyPassword = function(){
    var f;
    return{
        init: function() {
            f = this;
            f.bindEvent();
        },

        bindEvent: function() {
            $("#submit").on("click", function() {
                Ajax.call({
                    url: "modifyPassword",
                    p: {
                        oldPw: $("#old-pw").val(),
                        newPw: $("#new-pw").val(),
                        newPw2: $("#new-pw2").val()
                    },
                    f: function(response) {
                        alert("密码修改成功!");
                        window.open("logout", "_self");
                    }
                });
                return false;
            });
        },

        empty: null
    }
}();

$(document).ready(function() {
    ModifyPassword.init();
});

