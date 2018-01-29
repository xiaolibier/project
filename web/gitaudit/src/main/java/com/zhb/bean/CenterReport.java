package com.zhb.bean;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.zhb.core.ObjectBase;
import com.zhb.util.JsonTimestampSerializer;

import java.sql.Timestamp;

/**
 * Created by zhouhaibin on 2016/9/19.
 * 单中心报告
 */
public class CenterReport extends ReportBase {
    public static final int CLASSIFY_STATUS_UNREADY = 0;//未进入分级
    public static final int CLASSIFY_STATUS_UNASSIGNED = 1;//未分级（未领取）
    public static final int CLASSIFY_STATUS_ASSIGNED = 2;//分级中（已领取）
    public static final int CLASSIFY_STATUS_SUBMITTED = 3;//已分级

    String centerId = EMPTY_OBJECT;//中心Id
    String taskId = EMPTY_OBJECT;//任务Id
    String classifyUserId = EMPTY_OBJECT;//分级人
    int classifyStatus = CLASSIFY_STATUS_UNREADY;//分级状态
    String centerName;//中心名称
    Timestamp lastClassifyModify;//最后分级修改时间
    Timestamp classifyAssignedTime;//分级领用时间
    Timestamp classifySubmittedTime;//分级提交时间

    public CenterReport() {

    }

    public CenterReport(Task task) {
        id = task.getId();
        projectId = task.getProjectId();
        stageId = task.getStageId();
        centerId = task.getCenterId();
        taskId = task.getId();
        memberIds = task.getMemberIds();
        projectName = task.getProjectName();
        centerName = task.getCenterName();
        stageName = task.getStageName();
        projectCreated = task.getProjectCreated();
        leaderId = task.getLeaderId();
        fulltext = task.getFulltext();
        status = STATUS_EDITING;
    }

    public String getCenterName() {
        return centerName;
    }

    public void setCenterName(String centerName) {
        this.centerName = centerName;
    }

    public int getClassifyStatus() {
        return classifyStatus;
    }

    public void setClassifyStatus(int classifyStatus) {
        this.classifyStatus = classifyStatus;
    }

    public String getCenterId() {
        return centerId;
    }

    public void setCenterId(String centerId) {
        this.centerId = centerId;
    }

    public String getTaskId() {
        return taskId;
    }

    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    @JsonSerialize(using=JsonTimestampSerializer.class)
    public Timestamp getClassifyAssignedTime() {
        return classifyAssignedTime;
    }

    public void setClassifyAssignedTime(Timestamp classifyAssignedTime) {
        this.classifyAssignedTime = classifyAssignedTime;
    }

    @JsonSerialize(using=JsonTimestampSerializer.class)
    public Timestamp getClassifySubmittedTime() {
        return classifySubmittedTime;
    }

    public void setClassifySubmittedTime(Timestamp classifySubmittedTime) {
        this.classifySubmittedTime = classifySubmittedTime;
    }

    public String getClassifyUserId() {
        return classifyUserId;
    }

    public void setClassifyUserId(String classifyUserId) {
        this.classifyUserId = classifyUserId;
    }

    public Timestamp getLastClassifyModify() {
        return lastClassifyModify;
    }

    public void setLastClassifyModify(Timestamp lastLevelModify) {
        this.lastClassifyModify = lastLevelModify;
    }

    @Override
    public void copyForUpdate(ObjectBase object) {
        super.copyForUpdate(object);
    }
}
