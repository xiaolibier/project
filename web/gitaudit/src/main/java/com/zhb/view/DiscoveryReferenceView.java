package com.zhb.view;

/**
 * Created by zhouhaibin on 2017/1/20.
 */
public class DiscoveryReferenceView {
    String id;
    String level;
    String problemId;
    String referenceId;
    String name;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getReferenceId() {
        return referenceId;
    }

    public void setReferenceId(String referenceId) {
        this.referenceId = referenceId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getProblemId() {
        return problemId;
    }

    public void setProblemId(String problemId) {
        this.problemId = problemId;
    }

    public void parseId() {
        String[] temp = id.split("_");
        if(temp.length == 3) {
            level = temp[0];
            problemId = temp[1];
            referenceId = temp[2];
        }
        if (temp.length == 1)
            referenceId = temp[0];
    }

    public void formatId() {
        id = level + "_" + problemId + "_" + referenceId;
    }
}
