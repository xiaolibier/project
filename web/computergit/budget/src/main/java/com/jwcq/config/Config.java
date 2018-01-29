package com.jwcq.config;

/**
 * Created by liuma on 2017/6/7.
 */
public class Config {
    public final static String ADMIN="admin";//管理员
    public final static String USER="user";//商务部普通用户
    public final static String VIEWER="viewer";//未登录的用户
    public final static String REVIEWER="reviewer";//审核员
    public final static String NOTIFY="notify";//知会者，给他发短信

    //1.暂存、2.审核中，3.审核通过4.审核驳回，
    public final static String TEMP="暂存";
    public final static String REVIEWING="审核中";
    public final static String PASS="审核通过";
    public final static String REJECT="审核驳回";

    //产品名称:云通信短信API产品,开发者无需替换
    public static final String product = "Dysmsapi";
    //产品域名,开发者无需替换
    public static final String domain = "dysmsapi.aliyuncs.com";

    // TODO 此处需要替换成开发者自己的AK(在阿里云访问控制台寻找)
    public static final String accessKeyId = "LTAIVOXlqmsbrEBj";
    public static final String accessKeySecret = "Y2RIQYevo5nBEwzoOM8sla1WIcLWEB";
}
