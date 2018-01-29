package com.zhb.bean.page;

import com.zhb.core.ObjectBase;

/**
 * Created by zhouhaibin on 2016/11/10.
 * 表格里的列
 */
public class PageTableColumn extends ObjectBase {
    String width;//宽度

    public String getWidth() {
        return width;
    }

    public void setWidth(String width) {
        this.width = width;
    }

    @Override
    public void copyForUpdate(ObjectBase object) {

    }
}
