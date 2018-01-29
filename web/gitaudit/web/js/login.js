/**
 * Created by zhouhaibin on 2016/9/19.
 */
var Login = function(){
    var f;
    return{
        init: function() {
            f = this;
            f.bindEvent();
        },

        bindEvent: function() {
            $("#login").on("click", function() {
                var userId = $("#userId").val();
                var pw = $("#pw").val();
                var hash = md5(pw);
                var token = $.cookie("ip_token");
                if (!token || token == "") {
                    token = Utils.newGUID();
                }
                $.cookie('ip_token', token, { expires: 1 });

                Ajax.call({
                    url: "userLogin",
                    p: {
                        userId: userId,
                        pw: hash,
                        token: token
                    },
                    f: function(response) {
                        if (response.result != true) {
                            $("#message").html(response.loginMessage);
                            return false;
                        }
                        window.open("toProjectManager", "_self");
                    }
                });
                return false;
            });
        },

        empty: null
    }
}();

$(document).ready(function() {
    Login.init();
});

