package com.zhb.bean;

import com.zhb.core.ObjectBase;

import java.util.List;

/**
 * Created by zhouhaibin on 2016/11/22.
 * 主分类，用于在报告里的统计表格的第一列，是发现分类的上一级分类
 */
public class MainCategory extends ObjectBase {
    List<String> categoryIds;//此主分类包含的发现分类的ID

    List<String> categoryNames;//此主分类包含的发现分类的名字

    public List<String> getCategoryIds() {
        return categoryIds;
    }

    public void setCategoryIds(List<String> categoryIds) {
        this.categoryIds = categoryIds;
    }

    public List<String> getCategoryNames() {
        return categoryNames;
    }

    public void setCategoryNames(List<String> categoryNames) {
        this.categoryNames = categoryNames;
    }

    @Override
    public void copyForUpdate(ObjectBase object) {

    }
}
