package com.zhb.bean;

import com.zhb.core.ObjectBase;

/**
 * Created by zhouhaibin on 2016/9/19.
 * 模块
 */
public class Module extends ObjectBase {
    public static final String MODULE_ID_PROJECT_DESCRIPTION = "90";//项目简介模块的Id
    String tableId = EMPTY_OBJECT;//模块对应的Table的Id
    int multipleRecord = 0;//此模块是否允许有多条记录，0不允许，1允许

    public int getMultipleRecord() {
        return multipleRecord;
    }

    public void setMultipleRecord(int multipleRecord) {
        this.multipleRecord = multipleRecord;
    }

    public String getTableId() {
        return tableId;
    }

    public void setTableId(String tableId) {
        this.tableId = tableId;
    }

    @Override
    public void copyForUpdate(ObjectBase object) {

    }
}
