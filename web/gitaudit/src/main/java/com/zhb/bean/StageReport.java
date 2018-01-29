package com.zhb.bean;

/**
 * Created by zhouhaibin on 2016/10/27.
 * 阶段报告
 */
public class StageReport extends ReportBase {
    public StageReport() {

    }

    public StageReport(Project project, Stage stage) {
        id = project.getId() + stage.getId();
        projectId = project.getId();
        stageId = stage.getId();
        projectName = project.getName();
        stageName = stage.getName();
        projectCreated = project.getCreated();
        leaderId = project.getLeaderId();
        status = STATUS_EDITING;
        fulltext = project.getName();
    }

    public void copyMetadata(Project project) {
        projectName = project.getName();
        leaderId = project.getLeaderId();
    }

}
