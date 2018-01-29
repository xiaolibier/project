package com.zhb.bean;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.zhb.core.ObjectBase;
import com.zhb.util.JsonTimestampSerializer;

import java.sql.Timestamp;

/**
 * Created by zhouhaibin on 2016/9/19.
 * 稽查发现
 */
public class Discovery extends ObjectBase {
    String code;//发现编号
    String taskId = EMPTY_OBJECT;//任务Id
    String patientNo;//受试者编号
    String description;//问题描述
    String level = EMPTY_OBJECT;//分级
    String categoryId = EMPTY_OBJECT;//分类
    String problemId = EMPTY_OBJECT;//问题归类
    String memo;//备注
    String creatorId = EMPTY_OBJECT;//创建者Id
    Timestamp created;//创建时间
    String editorId = EMPTY_OBJECT;//修改者Id
    Timestamp editTime;//修改时间
    int inReport;//是否入报告，0不入，1入
    String level2 = "";//分级员分级
    String descriptionOpinion;//问题描述评审建议
    int descriptionOpinionAccepted = 0;//问题描述评审建议已处理
    int level2Accepted = 0;//分级员分级已处理
    String centerId = EMPTY_OBJECT;//中心Id

    //如下数据，用于在渲染阶段报告时使用。
    String centerName;//中心名称
    String centerType;//机构类型
    String centerCode;//中心编号
    int index = 0;//用于报告显示的时候的序号

    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }

    public String getCenterType() {
        return centerType;
    }

    public void setCenterType(String centerType) {
        this.centerType = centerType;
    }

    public String getCenterId() {
        return centerId;
    }

    public void setCenterId(String centerId) {
        this.centerId = centerId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getCenterName() {
        return centerName;
    }

    public void setCenterName(String centerName) {
        this.centerName = centerName;
    }

    public String getDescriptionOpinion() {
        return descriptionOpinion;
    }

    public void setDescriptionOpinion(String descriptionOpinion) {
        this.descriptionOpinion = descriptionOpinion;
    }

    public int getDescriptionOpinionAccepted() {
        return descriptionOpinionAccepted;
    }

    public void setDescriptionOpinionAccepted(int descriptionOpinionAccepted) {
        this.descriptionOpinionAccepted = descriptionOpinionAccepted;
    }

    public String getCenterCode() {
        return centerCode;
    }

    public void setCenterCode(String centerCode) {
        this.centerCode = centerCode;
    }

    public int getLevel2Accepted() {
        return level2Accepted;
    }

    public void setLevel2Accepted(int level2Accepted) {
        this.level2Accepted = level2Accepted;
    }

    public String getLevel2() {
        return level2;
    }

    public void setLevel2(String level2) {
        this.level2 = level2;
    }

    public String getTaskId() {
        return taskId;
    }

    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    public String getPatientNo() {
        return patientNo;
    }

    public void setPatientNo(String patientNo) {
        this.patientNo = patientNo;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String category) {
        this.categoryId = category;
    }

    public String getProblemId() {
        return problemId;
    }

    public void setProblemId(String problem) {
        this.problemId = problem;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    public String getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(String creatorId) {
        this.creatorId = creatorId;
    }

    @JsonSerialize(using=JsonTimestampSerializer.class)
    public Timestamp getCreated() {
        return created;
    }

    public void setCreated(Timestamp created) {
        this.created = created;
    }

    public String getEditorId() {
        return editorId;
    }

    public void setEditorId(String editor) {
        this.editorId = editor;
    }

    @JsonSerialize(using= JsonTimestampSerializer.class)
    public Timestamp getEditTime() {
        return editTime;
    }

    public void setEditTime(Timestamp editTime) {
        this.editTime = editTime;
    }

    public int getInReport() {
        return inReport;
    }

    public void setInReport(int inReport) {
        this.inReport = inReport;
    }

    @Override
    public void copyForUpdate(ObjectBase object) {
        Discovery discovery = (Discovery)object;
        patientNo = discovery.getPatientNo();
        description = discovery.getDescription();
        level = discovery.getLevel();
        categoryId = discovery.getCategoryId();
        problemId = discovery.getProblemId();
        memo = discovery.getMemo();
        editorId = discovery.getEditorId();
        editTime = discovery.getEditTime();
        inReport = discovery.getInReport();
        level2 = discovery.getLevel2();
        descriptionOpinion = discovery.getDescriptionOpinion();
        descriptionOpinionAccepted = discovery.getDescriptionOpinionAccepted();
        level2Accepted = discovery.getLevel2Accepted();
    }
}
