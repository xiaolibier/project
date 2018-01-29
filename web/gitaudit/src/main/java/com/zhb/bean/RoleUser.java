package com.zhb.bean;

import com.zhb.core.ObjectBase;

/**
 * Created by zhouhaibin on 2016/9/19.
 * 角色包含的用户
 */
public class RoleUser extends ObjectBase {
    String roleId;//角色Id
    String userId;//用户Id

    public String getRoleId() {
        return roleId;
    }

    public void setRoleId(String roleId) {
        this.roleId = roleId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    @Override
    public void copyForUpdate(ObjectBase object) {

    }
}
