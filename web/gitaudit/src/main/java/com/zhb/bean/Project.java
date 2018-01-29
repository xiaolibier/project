package com.zhb.bean;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.zhb.core.ObjectBase;
import com.zhb.util.JsonTimestampSerializer;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by zhouhaibin on 2016/9/19.
 * 项目
 */
public class Project extends ObjectBase {
    public static final int STATUS_PLANNING = 0;//项目计划
    public static final int STATUS_RUNNING = 1;//项目实施
    public static final int STATUS_TRACING = 2;//项目跟踪
    public static final int STATUS_CLOSED = 3;//项目关闭

    List<ProjectCenter> centers;//项目包含的中心
    List<ProjectStage> stages;//项目包含的阶段
    int stageCount;//阶段数量
    int status = STATUS_PLANNING;//状态
    String leaderId;//项目经理
    Timestamp created;//创建时间

    String principal;//委托方
    String description;//项目简介
    String title;//试验题目
    String assignee;//受托方
    String address;//地址
    String telephone;//联系方式
    String mobilephone;//手机
    String wechat;//微信公众号
    String url;//网址
    String purpose;//稽查目的
    String range;//稽查范围
    String foundation;//稽查依据
    String versionno;//《试验方案》版本号
    Timestamp versiondate;//版本日期
    String sopno;//项目SOP版本号
    Timestamp sopdate;//版本日期
    String centerContent = EMPTY_JSON_ARRAY;//中心内容
    String stageContent = EMPTY_JSON_ARRAY;//阶段内容

    String medicine;//药物名称
    String disease;//适应症
    String registerCategory;//注册分类
    String auditType;//稽查类型

    int canceled = 0;//是否被取消
    int deleted = 0;//是否被删除

    public String getAuditType() {
        return auditType;
    }

    public void setAuditType(String auditType) {
        this.auditType = auditType;
    }

    public int getCanceled() {
        return canceled;
    }

    public void setCanceled(int canceled) {
        this.canceled = canceled;
    }

    public String getMedicine() {
        return medicine;
    }

    public void setMedicine(String medicine) {
        this.medicine = medicine;
    }

    public String getDisease() {
        return disease;
    }

    public void setDisease(String disease) {
        this.disease = disease;
    }

    public String getRegisterCategory() {
        return registerCategory;
    }

    public void setRegisterCategory(String registerCategory) {
        this.registerCategory = registerCategory;
    }

    public String getPrincipal() {
        return principal;
    }

    public void setPrincipal(String principal) {
        this.principal = principal;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAssignee() {
        return assignee;
    }

    public void setAssignee(String assignee) {
        this.assignee = assignee;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getMobilephone() {
        return mobilephone;
    }

    public void setMobilephone(String mobilephone) {
        this.mobilephone = mobilephone;
    }

    public String getWechat() {
        return wechat;
    }

    public void setWechat(String wechat) {
        this.wechat = wechat;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public String getRange() {
        return range;
    }

    public void setRange(String range) {
        this.range = range;
    }

    public String getFoundation() {
        return foundation;
    }

    public void setFoundation(String foundation) {
        this.foundation = foundation;
    }

    public String getVersionno() {
        return versionno;
    }

    public void setVersionno(String versionno) {
        this.versionno = versionno;
    }

    public String getSopno() {
        return sopno;
    }

    public void setSopno(String sopno) {
        this.sopno = sopno;
    }

    @JsonSerialize(using=JsonTimestampSerializer.class)
    public Timestamp getVersiondate() {
        return versiondate;
    }

    public void setVersiondate(Timestamp versiondate) {
        this.versiondate = versiondate;
    }

    @JsonSerialize(using=JsonTimestampSerializer.class)
    public Timestamp getSopdate() {
        return sopdate;
    }

    public void setSopdate(Timestamp sopdate) {
        this.sopdate = sopdate;
    }

    public String getCenterContent() {
        return centerContent;
    }

    public void setCenterContent(String centerContent) {
        this.centerContent = centerContent;
    }

    public List<ProjectCenter> getCenters() {
        return centers;
    }

    public void setCenters(List<ProjectCenter> centers) {
        this.centers = centers;
    }

    public List<ProjectStage> getStages() {
        return stages;
    }

    public void setStages(List<ProjectStage> stages) {
        this.stages = stages;
    }

    public int getStageCount() {
        return stageCount;
    }

    public void setStageCount(int stageCount) {
        this.stageCount = stageCount;
    }

    public String getLeaderId() {
        return leaderId;
    }

    public void setLeaderId(String leaderId) {
        this.leaderId = leaderId;
    }

    @JsonSerialize(using=JsonTimestampSerializer.class)
    public Timestamp getCreated() {
        return created;
    }

    public void setCreated(Timestamp created) {
        this.created = created;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getStageContent() {
        return stageContent;
    }

    public void setStageContent(String stageContent) {
        this.stageContent = stageContent;
    }

    public int getDeleted() {
        return deleted;
    }

    public void setDeleted(int deleted) {
        this.deleted = deleted;
    }

    @Override
    public void copyForUpdate(ObjectBase object) {

    }

    public void list2Content() {
        JSONArray jsonArray = JSONArray.fromObject(centers);
        centerContent = jsonArray.toString();

        jsonArray = JSONArray.fromObject(stages);
        stageContent = jsonArray.toString();
    }

    public void content2List() {
        Map classMap = new HashMap();
        classMap.put("centers", ProjectCenter.class);
        classMap.put("stageCenters", StageCenter.class);
        classMap.put("stages", ProjectStage.class);

        JSONArray jsonArray = JSONArray.fromObject(centerContent);
        centers = new ArrayList<>();
        for (int i = 0; i < jsonArray.size(); i ++) {
            JSONObject jsonObject = (JSONObject)jsonArray.get(i);
            ProjectCenter center = (ProjectCenter)JSONObject.toBean(jsonObject, ProjectCenter.class);
            centers.add(center);
        }

        jsonArray = JSONArray.fromObject(stageContent);
        stages = new ArrayList<>();
        for (int i = 0; i < jsonArray.size(); i ++) {
            JSONObject jsonObject = (JSONObject)jsonArray.get(i);
            ProjectStage projectStage = (ProjectStage)JSONObject.toBean(jsonObject, ProjectStage.class, classMap);
            stages.add(projectStage);
        }
    }

    public ProjectStage findStage(String stageId) {
        for (ProjectStage projectStage : stages) {
            if (projectStage.getId().equals(stageId))
                return projectStage;
        }
        return null;
    }

    public ProjectCenter findCenter(String centerId) {
        for (ProjectCenter projectCenter : centers) {
            if (projectCenter.getId().equals(centerId))
                return projectCenter;
        }
        return null;
    }

    public String findCenterCode(String centerId) {
        for (ProjectCenter projectCenter : centers){
            if (projectCenter.getId().equals(centerId))
                return projectCenter.getCode();
        }
        return centerId;
    }
}
