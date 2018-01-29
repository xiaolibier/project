package com.zhb.bean;

import com.zhb.core.ObjectBase;

import java.util.List;

/**
 * Created by zhouhaibin on 2016/9/27.
 * 任务模块对应的表结构
 */
public class Table extends ObjectBase {
    List<Field> fields;
    int inheritable = 0;

    public int getInheritable() {
        return inheritable;
    }

    public void setInheritable(int inheritable) {
        this.inheritable = inheritable;
    }

    public List<Field> getFields() {
        return fields;
    }

    public void setFields(List<Field> fields) {
        this.fields = fields;
    }

    @Override
    public void copyForUpdate(ObjectBase object) {

    }
}
