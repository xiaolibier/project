package com.jwcq.config;

/**
 * Created by liuma on 2017/6/7.
 */
public class Config {
    public final static String ADMIN="admin";//管理员，所有数据都能看
    public final static String USER="user";//商务部普通用户
    public final static String VIEWER="viewer";//未登录的用户
    public final static String REVIEWER="reviewer";//审核员
    public final static String NOTIFY="notify";//知会者，给他发短信
    public final static String PASSBY="passby";//路人甲，什么都能看

    //1.暂存、2.审核中，3.审核通过4.审核驳回，
    public final static String TEMP="暂存";
    public final static String REVIEWING="审核中";
    public final static String PASS="审核通过";
    public final static String REJECT="审核驳回";
}
