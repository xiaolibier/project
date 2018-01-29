package com.zhb.bean;

import com.zhb.core.ObjectBase;

/**
 * Created by zhouhaibin on 2016/9/27.
 * 任务模块
 */
public class TaskModule extends ObjectBase {
    String moduleId;//模块Id

    public TaskModule() {

    }

    @Override
    public void copyForUpdate(ObjectBase object) {

    }

    public String getModuleId() {
        return moduleId;
    }

    public void setModuleId(String moduleId) {
        this.moduleId = moduleId;
    }
}
