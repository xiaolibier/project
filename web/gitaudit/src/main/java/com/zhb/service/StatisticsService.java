package com.zhb.service;

import com.zhb.bean.*;
import com.zhb.dao.Condition;
import com.zhb.dao.DaoPara;
import com.zhb.manager.MemoryCache;
import com.zhb.core.ObjectView;
import net.sf.json.JSONObject;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by zhouhaibin on 2016/11/1.
 */
@Service("StatisticsService")
public class StatisticsService extends AuditServiceBase {
    @javax.annotation.Resource(name="ProjectService")
    private ProjectService projectService;

    @javax.annotation.Resource(name="ModuleRecordService")
    private ModuleRecordService moduleRecordService;

    ObjectView lastView;
    String lastProjectId;
    //项目成员详细报表
    public List buildMemberReport(String dateFrom, String dateTo) {
        Map projectMap = new HashMap();
        DaoPara daoPara = new DaoPara();
        daoPara.setClazz(CenterReport.class);
        List conditionValues = new ArrayList();
        conditionValues.add(ReportBase.STATUS_SUBMITTED);
        conditionValues.add(ReportBase.STATUS_CLOSED);
        daoPara.addCondition(Condition.IN("status", conditionValues));
        if (!isValueEmpty(dateFrom)) {
            daoPara.addCondition(Condition.GREATER_EQUAL("submitTime", dateFrom));
        }
        if (!isValueEmpty(dateTo)) {
            daoPara.addCondition(Condition.LESS_EQUAL("submitTime", dateTo));
        }
        daoPara.addOrder("projectId");
        daoPara.addOrder("stageId");
        List viewList = new ArrayList();
        List list = dao.loadList(daoPara);
        lastView = null;
        lastProjectId = null;
        for (int i = 0; i < list.size(); i ++) {
            CenterReport centerReport = (CenterReport)list.get(i);
            ObjectView view = buildMemberReportRow(centerReport, projectMap);
            viewList.add(view);
        }
        daoPara.setClazz(StageReport.class);
        daoPara.getOrders().remove(1);
        list = dao.loadList(daoPara);
        lastView = null;
        lastProjectId = null;
        for (int i = 0; i < list.size(); i ++) {
            StageReport stageReport = (StageReport)list.get(i);
            ObjectView view = buildMemberReportRow(stageReport, projectMap);
            viewList.add(view);
        }
        return viewList;
    }

    private ObjectView buildMemberReportRow(CenterReport report, Map projectMap) {
        ObjectView view = new ObjectView(report);
        view.put("稽查项目编号", report.getProjectId());
        view.put("稽查项目", report.getProjectName());
        view.put("项目经理", MemoryCache.getUserName(report.getLeaderId()));
        if (lastView != null && report.getProjectId().equals(lastProjectId)) {
            int rowspan = (Integer)lastView.get("rowspan");
            lastView.put("rowspan", rowspan + 1);
            view.put("rowspan", 0);
        } else {
            lastView = view;
            lastProjectId = report.getProjectId();
            lastView.put("rowspan", 1);
        }
        Project project = (Project)projectMap.get(report.getProjectId());
        if (project == null) {
            project = projectService.loadProject(report.getProjectId());
            projectMap.put(project.getId(), project);
        }
        ProjectStage projectStage = project.findStage(report.getStageId());
        StageCenter stageCenter = projectStage.findCenter(report.getCenterId());
        view.put("稽查中心", report.getCenterName());
        view.put("项目阶段", report.getStageName());
        view.put("稽查组长", MemoryCache.getUserName(stageCenter.getLeaderId()));
        view.put("稽查员", MemoryCache.getUserNameList(stageCenter.getMemberIdList()));
        List moduleRecords = moduleRecordService.loadModuleRecordsByTaskIdAndModuleId(report.getTaskId(), Module.MODULE_ID_PROJECT_DESCRIPTION);
        if (moduleRecords.size() > 0) {
            ModuleRecord moduleRecord = (ModuleRecord)moduleRecords.get(0);
            JSONObject fieldValues = JSONObject.fromObject(moduleRecord.getContent());
            Timestamp startDate = parseDate((String)fieldValues.get("稽查开始时间"));
            Timestamp endDate = parseDate((String)fieldValues.get("稽查结束时间"));
            view.put("稽查开始日期", formatDate(startDate));
            view.put("稽查结束日期", formatDate(endDate));
            view.put("初稿计划递交日期", formatDate(calculateDate(startDate, 4)));
            view.put("初稿实际递交日期", formatDate(report.getSubmittedToCheckTime()));
            view.put("初稿递交时长", calculateDaysOffset(report.getSubmittedToCheckTime(), endDate));
            Timestamp internalReturnDate = calculateLatestDate(report.getCheckSubmittedTime(), report.getClassifySubmittedTime());
            view.put("内审批返日期", formatDate(internalReturnDate));
            Timestamp planningBusinessDate;
            if (internalReturnDate != null) {
                planningBusinessDate = calculateDate(internalReturnDate, 4);
            } else if (report.getSubmittedToCheckTime() != null) {
                planningBusinessDate = calculateDate(report.getSubmittedToCheckTime(), 6);
            } else {
                planningBusinessDate = calculateDate(endDate, 10);
            }
            view.put("计划递交商务日期", formatDate(planningBusinessDate));
            view.put("实际递交商务日期", formatDate(report.getSubmitTime()));
            view.put("递交商务时长", calculateDaysOffset(report.getSubmitTime(), internalReturnDate));
        }

        return view;
    }

    private ObjectView buildMemberReportRow(StageReport report, Map projectMap) {
        ObjectView view = new ObjectView(report);
        view.put("稽查项目编号", report.getProjectId());
        view.put("稽查项目", report.getProjectName());
        view.put("项目经理", MemoryCache.getUserName(report.getLeaderId()));
        if (lastView != null && report.getProjectId().equals(lastProjectId)) {
            int rowspan = (Integer)lastView.get("rowspan");
            lastView.put("rowspan", rowspan + 1);
            view.put("rowspan", 0);
        } else {
            lastView = view;
            lastProjectId = report.getProjectId();
            lastView.put("rowspan", 1);
        }
        Project project = (Project)projectMap.get(report.getProjectId());
        if (project == null) {
            project = projectService.loadProject(report.getProjectId());
            projectMap.put(project.getId(), project);
        }
        view.put("稽查中心", "项目阶段汇总报告");
        view.put("项目阶段", report.getStageName());
        view.put("稽查组长", "");
        view.put("稽查员", "");
        Timestamp startDate = report.getCreated();
        Timestamp endDate = report.getCreated();
        view.put("稽查开始日期", formatDate(startDate));
        view.put("稽查结束日期", formatDate(endDate));
        view.put("初稿计划递交日期", formatDate(calculateDate(startDate, 4)));
        view.put("初稿实际递交日期", formatDate(report.getSubmittedToCheckTime()));
        view.put("初稿递交时长", calculateDaysOffset(report.getSubmittedToCheckTime(), endDate));
        Timestamp internalReturnDate = report.getCheckSubmittedTime();
        view.put("内审批返日期", formatDate(internalReturnDate));
        Timestamp planningBusinessDate;
        if (internalReturnDate != null) {
            planningBusinessDate = calculateDate(internalReturnDate, 4);
        } else if (report.getSubmittedToCheckTime() != null) {
            planningBusinessDate = calculateDate(report.getSubmittedToCheckTime(), 6);
        } else {
            planningBusinessDate = calculateDate(endDate, 10);
        }
        view.put("计划递交商务日期", formatDate(planningBusinessDate));
        view.put("实际递交商务日期", formatDate(report.getSubmitTime()));
        view.put("递交商务时长", calculateDaysOffset(report.getSubmitTime(), internalReturnDate));
        return view;
    }

    private Timestamp calculateDate(Timestamp date, int spanDays) {
        if (date == null)
            return null;
        long time = date.getTime() + spanDays * 24 * 3600000;
        return new Timestamp(time);
    }

    private String calculateDaysOffset(Timestamp date1, Timestamp date2) {
        if (date1 == null || date2 == null)
            return "0";
        long timeOffset = date1.getTime() - date2.getTime();
        int daysOffset = (int)(timeOffset / (3600000 * 24));
        return String.valueOf(daysOffset);
    }

    private Timestamp calculateLatestDate(Timestamp date1, Timestamp date2) {
        if (date1 == null)
            return date2;
        if (date2 == null)
            return date1;
        if (date1.getTime() > date2.getTime())
            return date1;
        return date2;
    }

    private Timestamp parseDate(String dateString) {
        if (dateString == null)
            return null;
        if (dateString.isEmpty())
            return null;
        try {
            return new Timestamp(dateFormat.parse(dateString).getTime());
        } catch (ParseException e) {
            return null;
        }
    }

    //审阅员详细报表
    public List buildCheckerReport(String dateFrom, String dateTo) {
        List viewList = new ArrayList();
        DaoPara daoPara = new DaoPara();
        daoPara.setClazz(CenterReport.class);
        if (!isValueEmpty(dateFrom)) {
            daoPara.addCondition(Condition.GREATER_EQUAL("submitTime", dateFrom));
        }
        if (!isValueEmpty(dateTo)) {
            daoPara.addCondition(Condition.LESS_EQUAL("submitTime", dateTo));
        }
        daoPara.addCondition(Condition.EQUAL("checkStatus", ReportBase.CHECK_STATUS_SUBMITTED));
        List list = dao.loadList(daoPara);
        for (int i = 0; i < list.size(); i ++) {
            CenterReport centerReport = (CenterReport)list.get(i);
            ObjectView view = buildCheckerReportRowWithCheckType(centerReport);
            viewList.add(view);
        }

        daoPara = new DaoPara();
        daoPara.setClazz(CenterReport.class);
        if (!isValueEmpty(dateFrom)) {
            daoPara.addCondition(Condition.GREATER_EQUAL("submitTime", dateFrom));
        }
        if (!isValueEmpty(dateTo)) {
            daoPara.addCondition(Condition.LESS_EQUAL("submitTime", dateTo));
        }
        daoPara.addCondition(Condition.EQUAL("classifyStatus", CenterReport.CLASSIFY_STATUS_SUBMITTED));
        list = dao.loadList(daoPara);
        for (int i = 0; i < list.size(); i ++) {
            CenterReport centerReport = (CenterReport)list.get(i);
            ObjectView view = buildCheckerReportRowWithClassifyType(centerReport);
            viewList.add(view);
        }

        daoPara = new DaoPara();
        daoPara.setClazz(StageReport.class);
        if (!isValueEmpty(dateFrom)) {
            daoPara.addCondition(Condition.GREATER_EQUAL("submitTime", dateFrom));
        }
        if (!isValueEmpty(dateTo)) {
            daoPara.addCondition(Condition.LESS_EQUAL("submitTime", dateTo));
        }
        daoPara.addCondition(Condition.EQUAL("checkStatus", ReportBase.CHECK_STATUS_SUBMITTED));
        list = dao.loadList(daoPara);
        for (int i = 0; i < list.size(); i ++) {
            StageReport stageReport = (StageReport)list.get(i);
            ObjectView view = buildCheckerReportRowWithCheckType(stageReport);
            viewList.add(view);
        }

        //排序
        for (int i = 0; i < viewList.size(); i ++) {
            ObjectView view1 = (ObjectView)viewList.get(i);
            String time1 = (String)view1.get("审阅完成时间");
            for (int j = 0; j < viewList.size(); j ++) {
                ObjectView view2 = (ObjectView)viewList.get(i);
                String time2 = (String)view2.get("审阅完成时间");
                if (time1.compareTo(time2) < 0) {
                    viewList.set(i, view2);
                    viewList.set(j, view1);
                    view1 = view2;
                    time1 = time2;
                }
            }
        }
        //分配序号
        for (int i = 0; i < viewList.size(); i ++) {
            ObjectView view = (ObjectView)viewList.get(i);
            view.put("序号", i + 1);
        }
        return viewList;
    }

    private ObjectView buildCheckerReportRowWithCheckType(CenterReport report) {
        ObjectView view = new ObjectView(report);
        view.put("用户", MemoryCache.getUserName(report.getCheckUserId()));
        view.put("项目名称", report.getProjectName());
        view.put("中心名称", report.getCenterName());
        view.put("项目阶段", report.getStageName());
        view.put("提交审阅时间", formatDate(report.getSubmittedToCheckTime()));
        view.put("审阅完成时间", formatDate(report.getCheckSubmittedTime()));
        int workDays = Integer.valueOf(calculateDaysOffset(report.getClassifySubmittedTime(), report.getSubmittedToCheckTime()));
        view.put("工作时间", workDays);
        view.put("超时时间", workDays - 2);
        view.put("类别", "评审");
        return view;
    }

    private ObjectView buildCheckerReportRowWithClassifyType(CenterReport report) {
        ObjectView view = new ObjectView(report);
        view.put("用户", MemoryCache.getUserName(report.getClassifyUserId()));
        view.put("项目名称", report.getProjectName());
        view.put("中心名称", report.getCenterName());
        view.put("项目阶段", report.getStageName());
        view.put("提交审阅时间", formatDate(report.getSubmittedToCheckTime()));
        view.put("审阅完成时间", formatDate(report.getClassifySubmittedTime()));
        int workDays = Integer.valueOf(calculateDaysOffset(report.getClassifySubmittedTime(), report.getSubmittedToCheckTime()));
        view.put("工作时间", workDays);
        view.put("超时时间", workDays - 2);
        view.put("类别", "分级");
        return view;
    }

    private ObjectView buildCheckerReportRowWithCheckType(StageReport report) {
        ObjectView view = new ObjectView(report);
        view.put("用户", MemoryCache.getUserName(report.getCheckUserId()));
        view.put("项目名称", report.getProjectName());
        view.put("中心名称", "项目阶段汇总报告");
        view.put("项目阶段", report.getStageName());
        view.put("提交审阅时间", formatDate(report.getSubmittedToCheckTime()));
        view.put("审阅完成时间", formatDate(report.getCheckSubmittedTime()));
        int workDays = Integer.valueOf(calculateDaysOffset(report.getCheckSubmittedTime(), report.getSubmittedToCheckTime()));
        view.put("工作时间", workDays);
        view.put("超时时间", workDays - 2);
        view.put("类别", "评审");
        return view;
    }

}
