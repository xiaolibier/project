/**
 * Created by IntelliJ IDEA.
 * User: zoujuan
 * Date: 12-2-19
 * Time: 下午8:10
 * To change this template use File | Settings | File Templates.
 */
var GlobalConstants = function(){
    return{
        init:function(){
            // 空对象id
            this.EMPTY_OBJECT = "-";
            this.PROJECT_STATUS = {
                "0": "项目计划",
                "1": "项目实施",
                "2": "项目跟踪",
                "3": "项目结束",
                "4": "项目关闭",
                "5": "项目删除",
                "canceled": "项目取消"
            };

            this.PROJECT_STAGE_STATUS = {
                "0": "阶段计划",
                "1": "阶段实施",
                "2": "阶段跟踪",
                "3": "阶段关闭",
                "4": "阶段取消"
            };

            this.REPORT_STATUS = {
                "0": "模块填写中",
                "1": "报告填写中",
                "2": "报告审阅中",
                "3": "审阅后修改",
                "4": "报告已提交",
                "5": "关闭",
                "6": "取消",
                "7": "报告已提交"//提交超过48小时
            };

            this.CENTER_REPORT_CHECK_STATUS = {
                "0": "未进入评审",
                "1": "待评审",
                "2": "评审中",
                "3": "已评审"
            };

            this.CENTER_REPORT_CLASSIFY_STATUS = {
                "0": "未进入分级",
                "1": "待分级",
                "2": "分级中",
                "3": "已分级"
            };

            this.MODIFY_RECORD_OPERATION = {
                "0": "增加",
                "1": "修改",
                "2": "删除",
                "3": "建议已处理",
                "4": "分级已处理"
            };

            this.REPORT_SCORE_STATUS = {
                "0": "未评价",
                "1": "已评价"
            };

            this.USER_STATUS = {
                "0": "正常",
                "1": "停用"
            };

            this.FIELD_TYPE_STRING = 0;
            this.FIELD_TYPE_DATE = 1;
            this.FIELD_TYPE_LIMITEDWORD = 2;
            this.FIELD_TYPE_INT = 3;
            this.FIELD_TYPE_TEXT = 4;
            this.FIELD_TYPE_MULTISELECT = 5;
        }
    };
}();

$(GlobalConstants.init());
