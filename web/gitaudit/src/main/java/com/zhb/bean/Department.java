package com.zhb.bean;

import com.zhb.core.ObjectBase;
import com.zhb.core.ObjectNameComparator;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by zhouhaibin on 2016/9/19.
 * 部门（用户所属部门）
 */
public class Department extends ObjectBase {
    String parentId;//父部门Id
    String fullPathName;//含父部门的名称
    List<Department> children = new ArrayList<>();//子部门

    public void addChild(Department child) {
        children.add(child);
    }

    public List<Department> getChildren() {
        return children;
    }

    public void setChildren(List<Department> children) {
        this.children = children;
    }

    public String getFullPathName() {
        return fullPathName;
    }

    public void setFullPathName(String fullPathName) {
        this.fullPathName = fullPathName;
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    @Override
    public void copyForUpdate(ObjectBase object) {

    }

    public void sortChildren() {
        Collections.sort(children, new ObjectNameComparator());
        for (Department child : children)
            child.sortChildren();
    }
}
