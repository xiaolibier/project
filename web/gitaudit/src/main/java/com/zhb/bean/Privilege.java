package com.zhb.bean;

import com.zhb.core.ObjectBase;

/**
 * Created by zhouhaibin on 2016/10/24.
 * 功能级权限
 */
public class Privilege extends ObjectBase {
    public static final int TYPE_PRIVILEGE = 0;//类型为权限
    public static final int TYPE_GROUP = 1;//类型为权限组
    public static final String PRIVILEGE_ID_SYSTEM_ADMIN = "SYSTEM_ADMIN";//系统管理
    public static final String PRIVILEGE_ID_BUSINESS_ADMIN = "BUSINESS_ADMIN";//业务管理
    public static final String PRIVILEGE_ID_PRINT = "PRINT";//打印
    public static final String PRIVILEGE_ID_CHECK = "CHECK";//报告评审
    public static final String PRIVILEGE_ID_CLASSIFY = "CLASSIFY";//报告分级

    int type = TYPE_PRIVILEGE;//权限类型
    String groupId = EMPTY_OBJECT;//权限组Id
    String description;//权限描述

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public String getGroupId() {
        return groupId;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public void copyForUpdate(ObjectBase object) {

    }
}
