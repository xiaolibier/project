package com.zhb.bean;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.zhb.core.ObjectBase;
import com.zhb.util.JsonTimestampSerializer;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by zhouhaibin on 2016/9/19.
 * 稽查任务
 */
public class Task extends ObjectBase {
    public static final int STATUS_MODULE_EDITING = 0;//模块填写中
    public static final int STATUS_EDITING = 1;//报告填写中
    public static final int STATUS_CHECKING = 2;//报告审阅中
    public static final int STATUS_CORRECTING = 3;//审阅后修改
    public static final int STATUS_SUBMITTED = 4;//报告已提交
    public static final int STATUS_CLOSED = 5;//关闭

    Timestamp created;//创建时间
    Timestamp lastModify;//最后修改时间
    String projectId = EMPTY_OBJECT;//项目Id
    String centerId = EMPTY_OBJECT;//中心Id
    String stageId = EMPTY_OBJECT;//阶段Id
    int status = STATUS_MODULE_EDITING;//状态
    int canceled = 0;//是否被取消

    String leaderId = EMPTY_OBJECT;//项目经理
    String memberIds = EMPTY_JSON_ARRAY;//项目成员

    List<TaskModule> taskModules;//任务包含的模块

    String projectName;//项目名称
    String stageName;//阶段名称
    String centerName;//中心名称
    String content;//内容，大字段存储JSON格式的数据
    Timestamp projectCreated;//项目创建时间
    String fulltext;//全文，用于检索

    public int getCanceled() {
        return canceled;
    }

    public void setCanceled(int canceled) {
        this.canceled = canceled;
    }

    public Timestamp getLastModify() {
        return lastModify;
    }

    public void setLastModify(Timestamp lastModify) {
        this.lastModify = lastModify;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getStageName() {
        return stageName;
    }

    public void setStageName(String stageName) {
        this.stageName = stageName;
    }

    public String getCenterName() {
        return centerName;
    }

    public void setCenterName(String centerName) {
        this.centerName = centerName;
    }

    public String getLeaderId() {
        return leaderId;
    }

    public void setLeaderId(String leaderId) {
        this.leaderId = leaderId;
    }

    public String getMemberIds() {
        return memberIds;
    }

    public void setMemberIds(String memberIds) {
        this.memberIds = memberIds;
    }

    @JsonSerialize(using=JsonTimestampSerializer.class)
    public Timestamp getCreated() {
        return created;
    }

    public void setCreated(Timestamp created) {
        this.created = created;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getCenterId() {
        return centerId;
    }

    public void setCenterId(String centerId) {
        this.centerId = centerId;
    }

    public String getStageId() {
        return stageId;
    }

    public void setStageId(String stageId) {
        this.stageId = stageId;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public List<TaskModule> getTaskModules() {
        return taskModules;
    }

    public void setTaskModules(List<TaskModule> modules) {
        this.taskModules = modules;
    }

    public String getFulltext() {
        return fulltext;
    }

    public void setFulltext(String fulltext) {
        this.fulltext = fulltext;
    }

    @JsonSerialize(using=JsonTimestampSerializer.class)
    public Timestamp getProjectCreated() {
        return projectCreated;
    }

    public void setProjectCreated(Timestamp projectCreated) {
        this.projectCreated = projectCreated;
    }

    @Override
    public void copyForUpdate(ObjectBase object) {

    }

    public void list2Content() {
        JSONArray jsonArray = JSONArray.fromObject(taskModules);
        content = jsonArray.toString();
    }

    public void content2List() {
        JSONArray jsonArray = JSONArray.fromObject(content);
        taskModules = new ArrayList<>();
        for (int i = 0; i < jsonArray.size(); i ++) {
            JSONObject jsonObject = (JSONObject)jsonArray.get(i);
            TaskModule taskModule = (TaskModule) JSONObject.toBean(jsonObject, TaskModule.class);
            taskModules.add(taskModule);
        }
    }

    public TaskModule findTaskModule(String taskModuleId) {
        for (TaskModule taskModule : taskModules) {
            if (taskModule.getId().equals(taskModuleId))
                return taskModule;
        }
        return null;
    }

    public int findTotalMemberCount() {
        JSONArray jsonArray = JSONArray.fromObject(memberIds);
        return jsonArray.size();//包括组员和组长的人数
    }

    public void buildFulltext() {
        fulltext = projectName + "," + centerName;
    }
}
