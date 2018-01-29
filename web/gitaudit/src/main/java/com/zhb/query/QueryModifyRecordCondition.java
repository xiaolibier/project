package com.zhb.query;

import com.zhb.core.ObjectBase;
import com.zhb.dao.Condition;
import com.zhb.dao.DaoPara;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by zhouhaibin on 2016/10/21.
 * 查询修改记录的查询条件
 */
public class QueryModifyRecordCondition {
    String createdFrom;
    String createdTo;
    int operation = -1;
    String targetTypes;
    String taskId;
    String moduleId;
    String targetId;
    String categoryId;
    String keywords;

    public String getTargetId() {
        return targetId;
    }

    public void setTargetId(String targetId) {
        this.targetId = targetId;
    }

    public String getTaskId() {
        return taskId;
    }

    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    public String getCreatedFrom() {
        return createdFrom;
    }

    public void setCreatedFrom(String createdFrom) {
        this.createdFrom = createdFrom;
    }

    public String getCreatedTo() {
        return createdTo;
    }

    public void setCreatedTo(String createdTo) {
        this.createdTo = createdTo;
    }

    public int getOperation() {
        return operation;
    }

    public void setOperation(int operation) {
        this.operation = operation;
    }

    public String getTargetTypes() {
        return targetTypes;
    }

    public void setTargetTypes(String targetTypes) {
        this.targetTypes = targetTypes;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public String getModuleId() {
        return moduleId;
    }

    public void setModuleId(String moduleId) {
        this.moduleId = moduleId;
    }

    public String getKeywords() {
        return keywords;
    }

    public void setKeywords(String keywords) {
        this.keywords = keywords;
    }

    boolean isEmpty(String value) {
        if (value == null)
            return true;
        if (value.isEmpty())
            return true;
        if (value.equals(ObjectBase.EMPTY_OBJECT))
            return true;
        return false;
    }

    public DaoPara buildDaoPara() {
        DaoPara daoPara = new DaoPara();
        if (!isEmpty(taskId))
            daoPara.addCondition(Condition.EQUAL("taskId", taskId));
        if (!isEmpty(targetId))
            daoPara.addCondition(Condition.EQUAL("targetId", targetId));
        if (!isEmpty(moduleId))
            daoPara.addCondition(Condition.EQUAL("moduleId", moduleId));
        if (!isEmpty(categoryId))
            daoPara.addCondition(Condition.EQUAL("categoryId", categoryId));
        if (!isEmpty(createdFrom))
            daoPara.addCondition(Condition.GREATER_EQUAL("created", createdFrom));
        if (!isEmpty(createdTo))
            daoPara.addCondition(Condition.LESS_EQUAL("created", createdTo));
        if (operation != -1)
            daoPara.addCondition(Condition.EQUAL("operation", operation));
        if (!isEmpty(targetTypes)) {
            String [] values = targetTypes.split(",");
            List list = new ArrayList();
            for (String value : values) {
                list.add(Integer.valueOf(value));
            }
            daoPara.addCondition(Condition.IN("targetType", list));
        }
        if (!isEmpty(keywords)) {
            String [] values = keywords.split(",");
            daoPara.addCondition(Condition.LIKE("fulltext", values[0]));
        }


        return daoPara;
    }
}
