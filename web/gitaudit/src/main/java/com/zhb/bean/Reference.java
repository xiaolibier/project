package com.zhb.bean;

import com.zhb.core.ObjectBase;

/**
 * Created by zhouhaibin on 2016/10/5.
 * 依据
 */
public class Reference extends ObjectBase {
    String moduleId;//模块Id
    String categoryId;//分类Id
    String problemId;//问题归类Id

    public Reference() {

    }

    public Reference(String id, String name, String problemId) {
        this.id = id;
        this.name = name;
        this.problemId = problemId;
    }

    public String getModuleId() {
        return moduleId;
    }

    public void setModuleId(String moduleId) {
        this.moduleId = moduleId;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public String getProblemId() {
        return problemId;
    }

    public void setProblemId(String problemId) {
        this.problemId = problemId;
    }

    @Override
    public void copyForUpdate(ObjectBase object) {
        Reference reference = (Reference)object;
        moduleId = reference.getModuleId();
        categoryId = reference.getCategoryId();
        problemId = reference.getProblemId();
        name = reference.getName();
    }
}
