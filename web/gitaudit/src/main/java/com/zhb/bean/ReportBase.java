package com.zhb.bean;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.zhb.core.ObjectBase;
import com.zhb.util.JsonTimestampSerializer;
import net.sf.json.JSONObject;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by zhouhaibin on 2016/9/19.
 * 报告基类，单中心报告和阶段报告都由此类继承
 */
public abstract class ReportBase extends ObjectBase {
    public static final int STATUS_UNREADY = 0;//模块填写中
    public static final int STATUS_EDITING = 1;//报告填写中
    public static final int STATUS_CHECKING = 2;//报告审阅中
    public static final int STATUS_CORRECTING = 3;//审阅后修改
    public static final int STATUS_SUBMITTED = 4;//报告已提交
    public static final int STATUS_CLOSED = 5;//关闭
    public static final int STATUS_CANCELED = 6;//取消，内存状态，非数据库状态
    public static final int STATUS_SUBMITTED_MORE_THAN_48HOURS = 7;//报告提交超过48小时，内存状态，非数据库状态

    public static final int CHECK_STATUS_UNREADY = 0;//未进入评审
    public static final int CHECK_STATUS_UNASSIGNED = 1;//未评审（未领取）
    public static final int CHECK_STATUS_ASSIGNED = 2;//评审中（已领取）
    public static final int CHECK_STATUS_SUBMITTED = 3;//已评审

    String projectId = EMPTY_OBJECT;//项目Id
    String stageId = EMPTY_OBJECT;//阶段Id
    String creatorId = EMPTY_OBJECT;//分类Id
    String leaderId = EMPTY_OBJECT;//项目经理
    String checkUserId = EMPTY_OBJECT;//评审人
    String memberIds = EMPTY_JSON_ARRAY;
    int status = STATUS_UNREADY;//报告状态
    int checkStatus = CHECK_STATUS_UNREADY;
    String projectName;//项目名称
    String stageName;//阶段名称
    String content = EMPTY_JSON_OBJECT;

    Timestamp created;
    Timestamp submitTime;//提交（审阅后修改后提交）时间
    Timestamp lastModify;//最后修改时间
    Timestamp lastCheckModify;//最后评审修改时间
    Timestamp submittedToCheckTime;//提交评审时间
    Timestamp checkAssignedTime;//评审领用时间
    Timestamp checkSubmittedTime;//评审提交时间
    Timestamp projectCreated;//项目创建时间
    int canceled = 0;//是否被取消
    String fulltext;//全文内容，用于检索

    //以下内容为报告里修改的内容，以JSON方式存储在content字段里
    String overview;//稽查概述
    String overviewOpinion; //稽查概述的评审意见
    Map<String, String> referenceMap = new HashMap<>();//参考依据Map
    Map<String, String> problemMap = new HashMap<>();//用于记录报告里的问题归类
    Map<String, String> problemOpinionMap = new HashMap<>();//用于记录报告里的问题归类的评审意见
    Map<String, String> descriptionOpinionMap = new HashMap<>();//用于记录报告里的问题描述的评审意见
    Map<String, String> opinionAcceptedMap = new HashMap<>();//用于记录报告里的"意见已修改"的标志

    public void list2Content() {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("overview", overview);
        jsonObject.put("overviewOpinion", overviewOpinion);
        jsonObject.put("problemMap", problemMap);
        jsonObject.put("problemOpinionMap", problemOpinionMap);
        jsonObject.put("descriptionOpinionMap", descriptionOpinionMap);
        jsonObject.put("referenceMap", referenceMap);
        jsonObject.put("opinionAcceptedMap", opinionAcceptedMap);
        content = jsonObject.toString();
    }

    public void content2List() {
        JSONObject jsonObject = JSONObject.fromObject(content);
        if (jsonObject.containsKey("overview"))
            overview = jsonObject.getString("overview");
        if (jsonObject.containsKey("overviewOpinion"))
            overviewOpinion = jsonObject.getString("overviewOpinion");
        problemMap  = convertJSONObjectToMap(jsonObject.getJSONObject("problemMap"));
        problemOpinionMap  = convertJSONObjectToMap(jsonObject.getJSONObject("problemOpinionMap"));
        descriptionOpinionMap  = convertJSONObjectToMap(jsonObject.getJSONObject("descriptionOpinionMap"));
        referenceMap  = convertJSONObjectToMap(jsonObject.getJSONObject("referenceMap"));
        opinionAcceptedMap  = convertJSONObjectToMap(jsonObject.getJSONObject("opinionAcceptedMap"));
    }

    public int getCanceled() {
        return canceled;
    }

    public void setCanceled(int canceled) {
        this.canceled = canceled;
    }

    public String getLeaderId() {
        return leaderId;
    }

    public void setLeaderId(String leaderId) {
        this.leaderId = leaderId;
    }

    public Map<String, String> getOpinionAcceptedMap() {
        return opinionAcceptedMap;
    }

    public void setOpinionAcceptedMap(Map<String, String> opinionAcceptedMap) {
        this.opinionAcceptedMap = opinionAcceptedMap;
    }

    public String getOverviewOpinion() {
        return overviewOpinion;
    }

    public void setOverviewOpinion(String overviewOpinion) {
        this.overviewOpinion = overviewOpinion;
    }

    public Map<String, String> getProblemOpinionMap() {
        return problemOpinionMap;
    }

    public void setProblemOpinionMap(Map<String, String> problemOpinionMap) {
        this.problemOpinionMap = problemOpinionMap;
    }

    public Map<String, String> getDescriptionOpinionMap() {
        return descriptionOpinionMap;
    }

    public void setDescriptionOpinionMap(Map<String, String> descriptionOpinionMap) {
        this.descriptionOpinionMap = descriptionOpinionMap;
    }

    public Map<String, String> getProblemMap() {
        return problemMap;
    }

    public void setProblemMap(Map<String, String> problemMap) {
        this.problemMap = problemMap;
    }

    public String getMemberIds() {
        return memberIds;
    }

    public void setMemberIds(String memberIds) {
        this.memberIds = memberIds;
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

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
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

    public String getOverview() {
        return overview;
    }

    public void setOverview(String overview) {
        this.overview = overview;
    }

    public Map<String, String> getReferenceMap() {
        return referenceMap;
    }

    public void setReferenceMap(Map<String, String> referenceMap) {
        this.referenceMap = referenceMap;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getStageId() {
        return stageId;
    }

    public void setStageId(String stageId) {
        this.stageId = stageId;
    }

    @JsonSerialize(using=JsonTimestampSerializer.class)
    public Timestamp getSubmittedToCheckTime() {
        return submittedToCheckTime;
    }

    public void setSubmittedToCheckTime(Timestamp submittedToCheckTime) {
        this.submittedToCheckTime = submittedToCheckTime;
    }

    @JsonSerialize(using=JsonTimestampSerializer.class)
    public Timestamp getCheckAssignedTime() {
        return checkAssignedTime;
    }

    public void setCheckAssignedTime(Timestamp checkAssignedTime) {
        this.checkAssignedTime = checkAssignedTime;
    }

    @JsonSerialize(using=JsonTimestampSerializer.class)
    public Timestamp getCheckSubmittedTime() {
        return checkSubmittedTime;
    }

    public void setCheckSubmittedTime(Timestamp checkSubmittedTime) {
        this.checkSubmittedTime = checkSubmittedTime;
    }

    @JsonSerialize(using=JsonTimestampSerializer.class)
    public Timestamp getProjectCreated() {
        return projectCreated;
    }

    public void setProjectCreated(Timestamp projectCreated) {
        this.projectCreated = projectCreated;
    }

    public int getCheckStatus() {
        return checkStatus;
    }

    public void setCheckStatus(int checkStatus) {
        this.checkStatus = checkStatus;
    }

    public String getCheckUserId() {
        return checkUserId;
    }

    public void setCheckUserId(String checkUserId) {
        this.checkUserId = checkUserId;
    }

    public Timestamp getLastModify() {
        return lastModify;
    }

    public void setLastModify(Timestamp lastModify) {
        this.lastModify = lastModify;
    }

    public Timestamp getLastCheckModify() {
        return lastCheckModify;
    }

    public void setLastCheckModify(Timestamp lastCheckModify) {
        this.lastCheckModify = lastCheckModify;
    }

    public Timestamp getSubmitTime() {
        return submitTime;
    }

    public void setSubmitTime(Timestamp submitted) {
        this.submitTime = submitted;
    }

    @Override
    public void copyForUpdate(ObjectBase object) {
        ReportBase centerReport = (ReportBase) object;
        content = centerReport.getContent();
    }

    public String getCenterName() {
        return "";
    }

    public String getFulltext() {
        return fulltext;
    }

    public void setFulltext(String fulltext) {
        this.fulltext = fulltext;
    }


}
