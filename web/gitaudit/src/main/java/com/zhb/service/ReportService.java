package com.zhb.service;

import com.zhb.bean.*;
import com.zhb.core.ObjectBase;
import com.zhb.dao.Condition;
import com.zhb.dao.DaoPara;
import com.zhb.manager.LockManager;
import com.zhb.manager.MemoryCache;
import com.zhb.manager.ResourceLock;
import com.zhb.query.QueryResult;
import com.zhb.view.DiscoveryReferenceView;
import com.zhb.view.ReportView;
import com.zhb.view.DiscoveryLevelView;
import com.zhb.view.DiscoveryProblemView;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * Created by zhouhaibin on 2016/7/20.
 */

@Service("ReportService")
public class ReportService extends AuditServiceBase {
    @javax.annotation.Resource(name="ProjectService")
    private ProjectService projectService;

    @javax.annotation.Resource(name="DiscoveryService")
    private DiscoveryService discoveryService;

    @javax.annotation.Resource(name="TaskService")
    private TaskService taskService;

    @javax.annotation.Resource(name="ModifyRecordService")
    private ModifyRecordService modifyRecordService;

    @javax.annotation.Resource(name="OriginalReportService")
    private OriginalReportService originalReportService;

    private Class currentReportClass;//当前报告的Class，可能是CenterReport或StageReport
    private String currentReportClassName;//当前报告的类名
    private boolean isCenterReport;//当前报告的类型是否是中心报告

    //设置当前的报告类型
    public void setReportClassByType(String type) {
        currentReportClassName = type;
        if (type.equals("CenterReport")) {
            currentReportClass = CenterReport.class;
            isCenterReport = true;
        } else {
            currentReportClass = StageReport.class;
            isCenterReport = false;
        }
    }
    
    public QueryResult loadReports(int start, int limit, String userId, String keywords) {
        DaoPara daoPara = buildDaoPara(start, limit, userId, null, null, null, keywords);
        daoPara.setClazz(currentReportClass);
        daoPara.addOrder("lastModify", "desc");
        int totalCount = dao.getTotalCount(daoPara);
        List list = dao.loadList(daoPara);
        for (int i = 0; i < list.size(); i ++) {
            ReportBase report = (ReportBase)list.get(i);
            int status = getReportStatus(report);
            report.setStatus(status);
        }
        QueryResult queryResult = QueryResult.buildResult(start, limit, totalCount, list);
        return queryResult;
    }

    //为评审加载报告列表
    public QueryResult loadReportsToCheck(int start, int limit, int checkStatus, String userId, String keywords, String mode) {
        DaoPara daoPara = buildDaoPara(start, limit, null, null, null, null, keywords);
        if (mode.equals("all")) {
            if (checkStatus == -1) {
                List values = new ArrayList();
                values.add(ReportBase.CHECK_STATUS_UNASSIGNED);
                values.add(ReportBase.CHECK_STATUS_ASSIGNED);
                values.add(ReportBase.CHECK_STATUS_SUBMITTED);
                daoPara.addCondition(Condition.IN("checkStatus", values));
            } else {
                daoPara.addCondition(Condition.EQUAL("checkStatus", checkStatus));
            }
            daoPara.addOrder("submittedToCheckTime");
        } else {
            if (checkStatus == -1) {
                List values = new ArrayList();
                values.add(ReportBase.CHECK_STATUS_ASSIGNED);
                values.add(ReportBase.CHECK_STATUS_SUBMITTED);
                daoPara.addCondition(Condition.IN("checkStatus", values));
            } else {
                daoPara.addCondition(Condition.EQUAL("checkStatus", checkStatus));
            }
            daoPara.addCondition(Condition.EQUAL("checkUserId", userId));
            daoPara.addOrder("lastCheckModify", "desc");
        }
        daoPara.setClazz(currentReportClass);
        int totalCount = dao.getTotalCount(daoPara);
        List list = dao.loadList(daoPara);
        QueryResult queryResult = QueryResult.buildResult(start, limit, totalCount, list);
        return queryResult;
    }

    //为分级加载报告列表
    public QueryResult loadCenterReportsToClassify(int start, int limit, int classifyStatus, String userId, String keywords, String mode) {
        DaoPara daoPara = buildDaoPara(start, limit, null, null, null, null, keywords);
        if (mode.equals("all")) {
            if (classifyStatus == -1) {
                List values = new ArrayList();
                values.add(CenterReport.CLASSIFY_STATUS_UNASSIGNED);
                values.add(CenterReport.CLASSIFY_STATUS_ASSIGNED);
                values.add(CenterReport.CLASSIFY_STATUS_SUBMITTED);
                daoPara.addCondition(Condition.IN("classifyStatus", values));
            } else {
                daoPara.addCondition(Condition.EQUAL("classifyStatus", classifyStatus));
            }
            daoPara.addOrder("submittedToCheckTime");
        } else {
            if (classifyStatus == -1) {
                List values = new ArrayList();
                values.add(CenterReport.CLASSIFY_STATUS_ASSIGNED);
                values.add(CenterReport.CLASSIFY_STATUS_SUBMITTED);
                daoPara.addCondition(Condition.IN("checkStatus", values));
            } else {
                daoPara.addCondition(Condition.EQUAL("classifyStatus", classifyStatus));
            }
            daoPara.addCondition(Condition.EQUAL("classifyUserId", userId));
            daoPara.addOrder("lastClassifyModify", "desc");
        }
        daoPara.setClazz(CenterReport.class);
        int totalCount = dao.getTotalCount(daoPara);
        List list = dao.loadList(daoPara);
        QueryResult queryResult = QueryResult.buildResult(start, limit, totalCount, list);
        return queryResult;
    }

    public CenterReport createCenterReport(Task task, String creatorId) {
        CenterReport centerReport = new CenterReport(task);
        DataTemplate overview = (DataTemplate)MemoryCache.getObject(DataTemplate.class, "CenterReportOverview");
        centerReport.setOverview(overview.getContent());
        centerReport.setCreatorId(creatorId);
        centerReport.setCreated(new Timestamp(System.currentTimeMillis()));
        centerReport.setLastModify(centerReport.getCreated());
        centerReport.list2Content();
        dao.save(centerReport);
        taskService.updateTaskStatus(task.getId());
        return centerReport;
    }

    public StageReport createStageReport(String projectId, String stageId, String creatorId) {
        DataTemplate overview = (DataTemplate)MemoryCache.getObject(DataTemplate.class, "StageReportOverview");
        Project project = projectService.loadProject(projectId);
        Stage stage = (Stage)MemoryCache.getObject(Stage.class, stageId);
        StageReport stageReport = new StageReport(project, stage);
        stageReport.setOverview(overview.getContent());
        stageReport.setCreatorId(creatorId);
        stageReport.setCreated(new Timestamp(System.currentTimeMillis()));
        stageReport.setLastModify(stageReport.getCreated());
        stageReport.list2Content();
        dao.save(stageReport);

        createDiscoveriesForStageReport(projectId, stageId, stageReport.getId());
        return stageReport;
    }

    //创建阶段报告时，复制所有的发现
    public void createDiscoveriesForStageReport(String projectId, String stageId, String reportId) {
        String sql = "from CenterReport where projectId=? and stageId=?";
        List reports = dao.loadList(sql, 0, 1000, new Object[]{projectId, stageId});
        for (int i = 0; i < reports.size(); i ++) {
            CenterReport report = (CenterReport)reports.get(i);
            sql = "from Discovery where taskId=?";
            List discoveries = dao.loadList(sql, 0, 1000, new Object[]{report.getId()});
            for (int j = 0; j < discoveries.size(); j ++) {
                Discovery discovery = (Discovery)discoveries.get(j);
                discovery.setTaskId(reportId);
                discovery.setId(ObjectBase.generateID());
                discovery.setDescriptionOpinion(null);
                discovery.setDescriptionOpinionAccepted(0);
                discovery.setLevel2("");
                discovery.setLevel2Accepted(0);
                dao.save(discovery);
            }
        }
    }


    public boolean reportExist(String id, Class clazz) {
        ReportBase report = (ReportBase)loadObjectById(id, clazz);
        if (report == null)
            return false;
        return true;
    }

    public ReportBase loadReport(String id) {
        ReportBase report = (ReportBase)loadObjectById(id, currentReportClass);
        if (report == null)
            return null;
        report.content2List();
        return report;
    }

    public ReportBase loadReport(Class clazz, String id) {
        ReportBase report = (ReportBase)loadObjectById(id, clazz);
        if (report == null)
            return null;
        report.content2List();
        return report;
    }

    //为报告的显示，渲染所有的报告的发现
    public void renderDiscoveriesForReport(Project project, List discoveries, ReportView reportView) {
        LimitedWord levels = (LimitedWord)MemoryCache.getObject(LimitedWord.class, LimitedWord.ID_DISCOVERY_LEVEL);
        for (int i = 0; i < levels.getWords().size(); i ++) {
            reportView.addLevelView(new DiscoveryLevelView(levels.getWords().get(i)));
        }

        Map centers = MemoryCache.getObjectMap(Center.class);
        for (int i = 0; i < discoveries.size(); i ++) {
            Discovery discovery = (Discovery)discoveries.get(i);
            if (discovery.getInReport() == 0)
                continue;
            Center center = (Center)centers.get(discovery.getCenterId());
            if (center != null) {
                discovery.setCenterName(center.getName());
                discovery.setCenterType(center.getType());
                discovery.setCenterCode(project.findCenterCode(discovery.getCenterId()));
            }
            reportView.addDiscovery(discovery);
        }
    }

    //为报告的显示，渲染依据
    public void renderReferences(Map<String, String> referenceMap, ReportView reportView) {
        Map allReferenceMap = MemoryCache.getObjectMap(Reference.class);
        for (Iterator iterator = referenceMap.keySet().iterator(); iterator.hasNext(); ) {
            String id = (String)iterator.next();
            String name = referenceMap.get(id);
            DiscoveryReferenceView  referenceView = new DiscoveryReferenceView();
            referenceView.setId(id);
            referenceView.setName(name);
            referenceView.parseId();
            if (referenceView.getProblemId() == null) {
                Reference reference = (Reference) allReferenceMap.get(referenceView.getReferenceId());
                if (reference == null)
                    continue;
                referenceView.setProblemId(reference.getProblemId());
            }
            reportView.addReference(referenceView);
        }
    }

    //为报告的显示，渲染报告
    public ReportView renderReportView(ReportBase report, Project project, List discoveries) {
        ReportView reportView = new ReportView();
        reportView.setCenterReport(isCenterReport);
        reportView.setId(report.getId());
        reportView.setProjectId(project.getId());
        reportView.setPurpose(project.getPurpose());
        reportView.setRange(project.getRange());
        reportView.setFoundation(project.getFoundation());
        reportView.setOverview(report.getOverview());
        reportView.setOverviewOpinion(report.getOverviewOpinion());
        renderDiscoveriesForReport(project, discoveries, reportView);
        renderReferences(report.getReferenceMap(), reportView);

        //如果报告里保存了被修改过的问题归类描述，则用此替换原有的问题归类描述
        Map<String, String> problemMap = report.getProblemMap();
        for (DiscoveryLevelView levelView : reportView.getLevelViews()) {
            for (DiscoveryProblemView problemView : levelView.getProblemViews()) {
                String problem = problemMap.get(problemView.getId());
                if (problem != null) {
                    problemView.setProblemName(problem);
                }
                String problemOpinion = report.getProblemOpinionMap().get(problemView.getId());
                if (problemOpinion == null)
                    problemOpinion = report.getProblemOpinionMap().get(problemView.getProblemId());//这个写法是兼容一下以前的报告格式
                if (problemOpinion != null)
                    problemView.setProblemOpinion(problemOpinion);
            }
        }

        //如果一个分级下没有任何发现，则移除这个分级，不需要显示在报告里
        for (int i = reportView.getLevelViews().size() - 1; i >= 0; i --) {
            DiscoveryLevelView levelView = reportView.getLevelViews().get(i);
            if  (levelView.getProblemViews().size() == 0) {
                reportView.getLevelViews().remove(i);
            }
        }

        for (int i = 0; i < reportView.getLevelViews().size(); i ++) {
            DiscoveryLevelView levelView = reportView.getLevelViews().get(i);
            levelView.setIndex(i + 1);
        }
        return reportView;
    }

    //更新报告的内容
    public void saveReportValue(String reportId, String fieldId, String itemId, String value, boolean opinion, String userId) {
        ReportBase report = loadReport(reportId);
        if (fieldId.equals("overview")) {//更新稽查概述
            if (opinion)
                report.setOverviewOpinion(value);
            else {
                String oldValue = report.getOverview();
                modifyRecordService.onCenterReportValueChanged(report, ModifyRecord.FIELD_NAME_OVERVIEW, oldValue, value, userId);
                report.setOverview(value);
            }
        } else if (fieldId.equals("problem")) {//更新问题归类
            if (opinion)
                report.getProblemOpinionMap().put(itemId, value);
            else {
                String oldValue = report.getProblemMap().get(itemId);
                if (oldValue == null) {
                    String problemId = DiscoveryProblemView.parseProblemId(itemId);
                    Problem problem = (Problem)MemoryCache.getObject(Problem.class, problemId);
                    oldValue = problem.getName();
                }
                modifyRecordService.onCenterReportValueChanged(report, ModifyRecord.FIELD_NAME_PROBLEM, oldValue, value, userId);
                report.getProblemMap().put(itemId, value);
            }
        } else if (fieldId.equals("description")) {//更新问题简介
            Discovery discovery = discoveryService.loadDiscovery(itemId);
            if (opinion) {
                discovery.setDescriptionOpinion(value);
            } else {
                String oldValue = discovery.getDescription();
                modifyRecordService.onDiscoveryValueChanged(report, discovery, ModifyRecord.FIELD_NAME_DESCRIPTION, oldValue, value, userId);
                discovery.setDescription(value);
            }
            discoveryService.updateDiscvoery(discovery);
        } else if (fieldId.equals("reference")) {
            if (!opinion) {
                String oldValue = report.getReferenceMap().get(itemId);
                modifyRecordService.onCenterReportReferenceChanged(report, oldValue, value, userId);
                report.getReferenceMap().put(itemId, value);
            }
        }
        updateReport(report);
        if (opinion)
            onReportCheckModified(reportId);
        else
            onReportModified(reportId);
    }

    public void updateReport(ReportBase report) {
        report.list2Content();
        dao.update(report);
    }

    //更新报告的“建议已修改”的值
    public void saveReportOpinionAccepted(String reportId, String fieldId, String itemId, boolean opinionAccepted, String userId) {
        ReportBase report = loadReport(reportId);
        if (fieldId.equals("description")) {
            Discovery discovery = discoveryService.loadDiscovery(itemId);
            modifyRecordService.onCenterReportOpinionAcceptedValueChanged(report, discovery, ModifyRecord.FIELD_NAME_DESCRIPTION,
                    discovery.getDescriptionOpinionAccepted() == 1 ? "建议已处理" : "建议未处理",
                    opinionAccepted ? "建议已处理" : "建议未处理",
                    userId);

            discovery.setDescriptionOpinionAccepted(opinionAccepted ? 1 : 0);
            discoveryService.updateDiscvoery(discovery);
        } else {
            String oldValue = report.getOpinionAcceptedMap().get(itemId);
            if (oldValue == null)
                oldValue = "false";
            String newValue = String.valueOf(opinionAccepted);
            String fieldName;
            if (fieldId.equals("overview"))
                fieldName = ModifyRecord.FIELD_NAME_OVERVIEW;
            else if(fieldId.equals("problem"))
                fieldName = ModifyRecord.FIELD_NAME_PROBLEM;
            else
                fieldName = ModifyRecord.FIELD_NAME_REFERENCE;
            modifyRecordService.onCenterReportOpinionAcceptedValueChanged(report, fieldName,
                    oldValue.equals("true") ? "建议已处理" : "建议未处理",
                    newValue.equals("true") ? "建议已处理" : "建议未处理",
                    userId);

            report.getOpinionAcceptedMap().put(itemId, String.valueOf(opinionAccepted));
            updateReport(report);
        }
        onReportModified(reportId);
    }

    public void saveReferences(String reportId, Map referenceMap, String userId) {
        ReportBase report = loadReport(reportId);

        modifyRecordService.onCenterReportReferenceChanged(report, referenceMap, userId);
        report.setReferenceMap(referenceMap);
        updateReport(report);
        onReportModified(reportId);
    }

    //评审提交
    public void checkSubmitReport(String id) {
        String sql = "update " + currentReportClassName + " set checkSubmittedTime=?,checkStatus=? where id=?";
        Timestamp now = new Timestamp(System.currentTimeMillis());
        dao.executeSql(sql, new Object[]{now, ReportBase.CHECK_STATUS_SUBMITTED, id});
        if (isCenterReport)
            onCheckOrClassifySubmitted(id);
        else {
            sql = "update StageReport set status=" + ReportBase.STATUS_CORRECTING + " where id=?";
            dao.executeSql(sql, new Object[]{id});
        }
    }

    //分级提交
    public boolean classifySubmitCenterReport(String id) {
        List discoveries = discoveryService.loadDiscoveriesInReport(id, "created", null, null);
        for (int i = 0; i < discoveries.size(); i ++) {
            Discovery discovery = (Discovery)discoveries.get(i);
            if (isValueEmpty(discovery.getLevel2())) {
                errorMessage = "您还有发现没有分级，请完成分级后再进行提交";
                return false;
            }
        };
        String sql = "update CenterReport set classifySubmittedTime=?,classifyStatus=? where id=?";
        Timestamp now = new Timestamp(System.currentTimeMillis());
        dao.executeSql(sql, new Object[]{now, CenterReport.CLASSIFY_STATUS_SUBMITTED, id});
        onCheckOrClassifySubmitted(id);
        return true;
    }

    //当评审或分级提交以后要做的事情
    public void onCheckOrClassifySubmitted(String id) {
        //如果评审和分级都已经提交了，则修改报告状态为“审阅后修改”
        String sql = "update CenterReport set status=" + ReportBase.STATUS_CORRECTING +
                " where id=? and classifyStatus=" + CenterReport.CLASSIFY_STATUS_SUBMITTED +
                " and checkStatus=" + ReportBase.CHECK_STATUS_SUBMITTED;
        dao.executeSql(sql, new Object[]{id});
        taskService.updateTaskStatus(id);
    }

    public void updateReportStatus(String id, int status) {
        String sql = "update " + currentReportClassName + " set status=? where id=?";
        dao.executeSql(sql, new Object[]{status, id});        
        if (isCenterReport) {
            taskService.updateTaskStatus(id);
        }
    }

    //是否所以的依据都填写了
    private boolean areAllReferencesFilled(ReportBase report) {
        List discoveries = discoveryService.loadDiscoveriesInReport(report.getId(), "created", null, null);
        Project project = projectService.loadProject(report.getProjectId());
        ReportView reportView = renderReportView(report, project, discoveries);
        for (DiscoveryLevelView levelView : reportView.getLevelViews()) {
            for (DiscoveryProblemView problemView : levelView.getProblemViews()) {
                if (problemView.getReferences().size() == 0) {
                    errorMessage = "请填写完依据后再提交";
                    return false;
                }
            }
        }

        return true;
    }

    //提交报告到评审
    public boolean submitReportToCheck(String id) {
        ReportBase report = loadReport(id);
        if (!areAllReferencesFilled(report))
            return false;
        if (isCenterReport) {
            String sql = "update CenterReport set status=?,submittedToCheckTime=?,checkStatus=?,classifyStatus=? where id=?";
            Timestamp now = new Timestamp(System.currentTimeMillis());
            dao.executeSql(sql, new Object[]{
                    ReportBase.STATUS_CHECKING, now, ReportBase.CHECK_STATUS_UNASSIGNED, CenterReport.CLASSIFY_STATUS_UNASSIGNED, id
            });
            taskService.updateTaskStatus(id);
        } else {
            String sql = "update StageReport set status=?,submittedToCheckTime=?,checkStatus=? where id=?";
            Timestamp now = new Timestamp(System.currentTimeMillis());
            dao.executeSql(sql, new Object[]{ReportBase.STATUS_CHECKING, now, ReportBase.CHECK_STATUS_UNASSIGNED, id});
        }
        return true;
    }

    //是否所以的建议都已处理
    private boolean areAllOpinionAccepted(ReportBase report, List discoveries) {
        String opinion = report.getOverviewOpinion();
        String opinionAccepted = report.getOpinionAcceptedMap().get(report.getId());
        if (!isValueEmpty(opinion) && (opinionAccepted == null || !opinionAccepted.equals("true"))) {
            errorMessage = "稽查概述的评审建议没有处理";
            return false;
        }

        for (Iterator iterator = report.getProblemOpinionMap().keySet().iterator(); iterator.hasNext();) {
            String id = (String)iterator.next();
            opinion = report.getProblemOpinionMap().get(id);
            opinionAccepted = report.getOpinionAcceptedMap().get(id);
            if (!isValueEmpty(opinion) && (opinionAccepted == null || !opinionAccepted.equals("true"))) {
                //Is this discovery still in report?
                boolean find = false;
                for (int i = 0; i < discoveries.size(); i ++) {
                    Discovery discovery = (Discovery)discoveries.get(i);
                    String itemId = DiscoveryProblemView.formatId(discovery.getLevel(), discovery.getProblemId());
                    if (itemId.equals(id)) {
                        find = true;
                        break;
                    }
                }
                if (!find)
                    continue;//该条问题描述没有在任何一个发现里面，意味着对应的发现已经不在报告里了

                errorMessage = "问题归类的评审建议没有处理";
                return false;
            }
        }

        for (Iterator iterator = report.getDescriptionOpinionMap().keySet().iterator(); iterator.hasNext();) {
            String id = (String)iterator.next();
            opinion = report.getDescriptionOpinionMap().get(id);
            opinionAccepted = report.getOpinionAcceptedMap().get(id);
            if (!isValueEmpty(opinion) && (opinionAccepted == null || !opinionAccepted.equals("true"))) {
                errorMessage = "问题描述的评审建议没有处理";
                return false;
            }
        }

        String sql = "select count(*) from Discovery where taskId=? and inReport=1 and level!=level2 and level2 >'0' and level2Accepted=0";
        int count = dao.queryNativeForInt(sql, new Object[]{report.getId()});
        if (count > 0) {
            errorMessage = "稽查发现的分级建议没有处理";
            return false;
        }
        return true;
    }

    //提交报告
    public boolean submitReport(String id, List discoveries) {
        ReportBase report = loadReport(id);
        if (!areAllOpinionAccepted(report, discoveries))
            return false;
        if (!areAllReferencesFilled(report))
            return false;

        String sql = "update " + currentReportClassName + " set status=?,submitTime=? where id=?";
        Timestamp now = new Timestamp(System.currentTimeMillis());
        dao.executeSql(sql, new Object[]{ReportBase.STATUS_SUBMITTED, now, id});
        taskService.updateTaskStatus(id);
        if (isCenterReport) {
            //检查是否该阶段的所有中心报告都提交了
            sql = "select count(*) from Task where projectId=? and stageId=?";
            int stageCenterCount = dao.queryNativeForInt(sql, new Object[]{report.getProjectId(), report.getStageId()});
            sql = "select count(*) from CenterReport where projectId=? and stageId=? and status>=" + ReportBase.STATUS_SUBMITTED;
            int submittedCenterReportCount = dao.queryNativeForInt(sql, new Object[]{report.getProjectId(), report.getStageId()});
            if (stageCenterCount == submittedCenterReportCount) {
                //所有的单中心报告已经提交，则将项目状态置为项目追踪
                projectService.updateProjectStatus(report.getProjectId(), Project.STATUS_TRACING);
            }
        }
        return true;
    }

    //评审领用
    public void receiveCheckReport(String id, String userId) {
        String sql = "update " + currentReportClassName + " set checkAssignedTime=?,checkStatus=?,checkUserId=? where id=?";
        Timestamp now = new Timestamp(System.currentTimeMillis());
        dao.executeSql(sql, new Object[]{now, ReportBase.CHECK_STATUS_ASSIGNED, userId, id});
    }

    //评审退领
    public void sendbackCheckReport(String id, String userId) {
        String sql = "update " + currentReportClassName + " set checkStatus=?,checkUserId=? where id=?";
        dao.executeSql(sql, new Object[]{ReportBase.CHECK_STATUS_UNASSIGNED, ObjectBase.EMPTY_OBJECT, id});
    }

    //分级领用
    public void receiveClassifyCenterReport(String id, String userId) {
        String sql = "update CenterReport set classifyAssignedTime=?,classifyStatus=?,classifyUserId=? where id=?";
        Timestamp now = new Timestamp(System.currentTimeMillis());
        dao.executeSql(sql, new Object[]{now, CenterReport.CLASSIFY_STATUS_ASSIGNED, userId, id});
    }

    //分级退领
    public void sendbackClassifyCenterReport(String id, String userId) {
        String sql = "update CenterReport set classifyStatus=?,checkUserId=? where id=?";
        Timestamp now = new Timestamp(System.currentTimeMillis());
        dao.executeSql(sql, new Object[]{CenterReport.CLASSIFY_STATUS_UNASSIGNED, ObjectBase.EMPTY_OBJECT, id});
    }

    public boolean closeReport(String id, String userId) {
        ReportBase report = loadReport(id);
        if (report == null) {
            errorMessage = "报告尚未生成";
            return false;
        }
        if (report.getStatus() != ReportBase.STATUS_SUBMITTED) {
            errorMessage = "报告尚未提交";
            return false;
        }
        if (isCenterReport) {
            OriginalReport originalReport = originalReportService.loadOriginalReport(id);
            if (originalReport.getScoreStatus() != OriginalReport.SCORE_STATUS_SCORED) {
                errorMessage = "请先提交评价表，再关闭报告";
                return false;
            }
        }
        updateReportStatus(id, ReportBase.STATUS_CLOSED);
        if (isCenterReport) {
            originalReportService.closeOriginalReport(id);
            //检查是否该阶段的所有中心报告都关闭了
            String sql = "select count(*) from Task where projectId=? and stageId=?";
            int stageCenterCount = dao.queryNativeForInt(sql, new Object[]{report.getProjectId(), report.getStageId()});
            sql = "select count(*) from CenterReport where projectId=? and stageId=? and status=" + ReportBase.STATUS_CLOSED;
            int closedCenterReportCount = dao.queryNativeForInt(sql, new Object[]{report.getProjectId(), report.getStageId()});
            if (stageCenterCount == closedCenterReportCount) {
                //所有的单中心报告已经生成并且关闭，这时候开始生成阶段报告
                createStageReport(report.getProjectId(), report.getStageId(), userId);
            }
        }
        return true;
    }

    //更新报告的最后更新时间
    public void updateReportLastModify(String id) {
        String sql = "update " + currentReportClassName + " set lastModify=? where id=?";
        Timestamp currentTime = new Timestamp(System.currentTimeMillis());
        dao.executeNativeSql(sql, new Object[]{currentTime, id});
    }

    //更新报告的最后评审更新时间
    public void updateReportLastCheckModify(String id) {
        String sql = "update " + currentReportClassName + " set lastCheckModify=? where id=?";
        Timestamp currentTime = new Timestamp(System.currentTimeMillis());
        dao.executeNativeSql(sql, new Object[]{currentTime, id});
    }

    //更新报告的最后分级更新时间
    public void updateCenterReportLastClassifyModify(String id) {
        String sql = "update CenterReport set lastClassifyModify=? where id=?";
        Timestamp currentTime = new Timestamp(System.currentTimeMillis());
        dao.executeNativeSql(sql, new Object[]{currentTime, id});
    }

    public void onReportModified(String id) {
        updateReportLastModify(id);
    }

    public void onReportCheckModified(String id) {
        updateReportLastCheckModify(id);
    }

    public void onCenterClassifyModified(String id) {
        updateCenterReportLastClassifyModify(id);
    }

    public int getReportStatus(ReportBase report) {
        if (report.getStatus() != ReportBase.STATUS_SUBMITTED)
            return report.getStatus();
//        int hours = (int)((System.currentTimeMillis() - report.getSubmitTime().getTime()) / 3600000);
//        if (hours >= 48)
//            return ReportBase.STATUS_SUBMITTED_MORE_THAN_48HOURS;
        return ReportBase.STATUS_SUBMITTED;
    }

    //重置问题归类
    public String resetProblem(String reportId, String itemId, String userId) {
        ReportBase report = loadReport(reportId);
        String problemId = DiscoveryProblemView.parseProblemId(itemId);
        Problem problem = (Problem)MemoryCache.getObject(Problem.class, problemId);
        String oldValue = report.getProblemMap().get(itemId);
        String newValue = problem.getName();
        modifyRecordService.onCenterReportValueChanged(report, ModifyRecord.FIELD_NAME_PROBLEM, oldValue, newValue, userId);
        report.getProblemMap().put(itemId, problem.getName());
        updateReport(report);
        return newValue;
    }

    //取消中心报告
    public void cancelCenterReport(String id) {
        String sql = "update CenterReport set canceled=1 where id=?";
        dao.executeNativeSql(sql, new Object[]{id});
    }

    //由取消项目触发的取消中心报告
    public void cancelCenterReportByProject(String projectId) {
        String sql = "update CenterReport set canceled=1 where projectId=?";
        dao.executeNativeSql(sql, new Object[]{projectId});
    }

    //由取消阶段触发的取消中心报告
    public void cancelCenterReportByProjectStage(String projectId, String stageId) {
        String sql = "update CenterReport set canceled=1 where projectId=? and stageId=?";
        dao.executeNativeSql(sql, new Object[]{projectId, stageId});
    }

    //启动中心报告
    public void startCenterReport(String id) {
        String sql = "update CenterReport set canceled=0 where id=?";
        dao.executeNativeSql(sql, new Object[]{id});
    }

    //取消中心报告
    public void cancelStageReport(String id) {
        String sql = "update StageReport set canceled=1 where id=?";
        dao.executeNativeSql(sql, new Object[]{id});
    }

    //由取消项目触发的取消阶段报告
    public void cancelStageReportByProject(String projectId) {
        String sql = "update StageReport set canceled=1 where projectId=?";
        dao.executeNativeSql(sql, new Object[]{projectId});
    }

    //启动阶段报告
    public void startStageReport(String id) {
        String sql = "update StageReport set canceled=0 where id=?";
        dao.executeNativeSql(sql, new Object[]{id});
    }

    //开始编辑报告
    public boolean startEditReport(String reportId, String  userId, String sessionId) {
        String locker = LockManager.getResourceLocker(reportId);
        if (locker != null) {
            if (!locker.equals(userId)) {
                String lockerName = MemoryCache.getUserName(locker);
                errorMessage = String.format("该报告正在被[%s]编辑，您只能浏览该模块的内容", lockerName);
                return false;
            }
        }
        LockManager.addLock(reportId, isCenterReport ? ResourceLock.RESOURCE_TYPE_CENTER_REPORT : ResourceLock.RESOURCE_TYPE_STAGE_REPORT, userId, sessionId);
        return true;
    }

    //结束编辑报告
    public boolean endEditReport(String reportId, String  userId) {
        LockManager.releaseLock(reportId, userId);
        return true;
    }

}
