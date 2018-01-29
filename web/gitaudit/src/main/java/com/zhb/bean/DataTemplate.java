package com.zhb.bean;

import com.zhb.core.ObjectBase;

/**
 * Created by zhouhaibin on 2016/9/19.
 * 数据模板
 */
public class DataTemplate extends ObjectBase {
    public static final String ID_AUTO_SAVE_INTERVAL = "AudoSaveInterval";
    String content;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @Override
    public void copyForUpdate(ObjectBase object) {

    }
}
