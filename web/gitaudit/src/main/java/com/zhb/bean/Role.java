package com.zhb.bean;

import com.zhb.core.ObjectBase;

/**
 * Created by zhouhaibin on 2016/9/19.
 * 角色
 */
public class Role extends ObjectBase {
    String privilegeIds = "";//权限Id数组

    public String getPrivilegeIds() {
        return privilegeIds;
    }

    public void setPrivilegeIds(String privilegeIds) {
        this.privilegeIds = privilegeIds;
    }

    @Override
    public void copyForUpdate(ObjectBase object) {
        Role role = (Role)object;
        name = role.getName();
        privilegeIds = role.getPrivilegeIds();
    }
}
