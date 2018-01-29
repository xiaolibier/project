/**
 * Created by zhouhaibin on 2016/9/19.
 */
var ReportScoreDetail = function(){
    var STATUS_CLOSED = 5;//关闭
    var f;
    var $container = $("#score-container");
    var $ratingControls = [];
    return{
        init: function() {
            f = this;
            Global.initTableLayout();
            Header.activeMenu("task-manager");
            f.initTemplate();
            f.bindEvent();
            f.load();
        },

        initTemplate: function() {
        },

        bindEvent: function() {
            $("#submit").on("click", function() {
                if (!window.confirm("您确定要提交评价结果吗？"))
                    return;
                var score = parseInt($("#score").html());
                var itemScore = [];
                for (var i = 0; i < $ratingControls.length; i ++) {
                    var value = $ratingControls[i].val();
                    if (value != "")
                        itemScore.push(parseInt(value) * 2);
                    else
                        itemScore.push(0);
                }

                Ajax.call({
                    url: "submitReportScore",
                    p: {
                        id: Global.reportId,
                        score: score,
                        itemScore: JSON.stringify(itemScore)
                    },
                    f: function(response) {
                        Notify.info("提交成功");
                        window.open("toReportScoreManager", "_self");
                        return false;
                    }
                });
                return false;
            });

            $("#save").on("click", function() {
                var score = parseInt($("#score").html());
                var itemScore = [];
                for (var i = 0; i < $ratingControls.length; i ++) {
                    var value = $ratingControls[i].val();
                    if (value != "")
                        itemScore.push(parseInt(value) * 2);
                    else
                        itemScore.push(0);
                }

                Ajax.call({
                    url: "updateReportScore",
                    p: {
                        id: Global.reportId,
                        score: score,
                        itemScore: JSON.stringify(itemScore)
                    },
                    f: function(response) {
                        Notify.info("保存成功");
                        return false;
                    }
                });
                return false;
            });

            $container.on('rating.change', function(event, value, caption) {
                f.calculate();
            });
            $container.on('rating.clear', function(event, value, caption) {
                f.calculate();
            });
        },

        calculate: function() {
            var score = 0;
            for (var i = 0; i < $ratingControls.length; i ++) {
                var value = $ratingControls[i].val();
                if (value != "")
                    score += (parseInt(value) * 2);
            }
            $("#score").html(score);
        },

        load: function() {
            Ajax.call({
                url: "loadOriginalReportForScoring",
                p: {
                    id: Global.reportId
                },
                f: function(response) {
                    f.render(response);
                    var report= response.report
                    if (report.canceled == 1 || report.closed == 1) {
                        $("#submit").remove();
                        $("#save").remove();
                    }
                    Global.refreshControlsByPrivilege();
                }
            });
        },

        render: function(response) {
            $("#score").html(response.report.score);
            var html = [];
            for (var i = 0; i < response.scoreItems.length; i ++) {
                var scoreItem = response.scoreItems[i];
                var tr =
                    '<tr>' +
                        '<td>' + scoreItem.name + '</td>' +
                        '<td>' +
                            '<div class="rating-container">' +
                                '<input itemId="' + scoreItem.id + '" type="number" class="rating">' +
                            '</div>' +
                        '</td>' +
                    '</tr>';
                html.push(tr);
                for (var j = 0; j < scoreItem.questions.length; j ++) {
                    var question = scoreItem.questions[j];
                    tr =
                        '<tr>' +
                            '<td>' + question + '</td>' +
                            '<td></td>' +
                        '</tr>';
                    html.push(tr);
                }
            }
            $container.html(html.join(''));
            var itemScore = JSON.parse(response.report.itemScore);
            $(".rating").each(function(i) {
                var $rating = $(this).rating({
                    min: 0,
                    max: 5,
                    step: 1,
                    size: 'xs',
                    //showClear: false,
                    clearCaption: '0',
                    starCaptions: function(val) {
                        return val * 2;
                    }
                });
                var score = itemScore.length > i ? parseInt(itemScore[i]) / 2 : 0;
                $rating.rating('update', score);
                $ratingControls.push($rating);
            });
        },

        empty: null
    }
}();

$(document).ready(function() {
    ReportScoreDetail.init();
});

