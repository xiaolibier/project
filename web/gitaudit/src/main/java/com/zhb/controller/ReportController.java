package com.zhb.controller;

import com.zhb.bean.*;
import com.zhb.manager.LockManager;
import com.zhb.manager.MemoryCache;
import com.zhb.manager.ResourceLock;
import com.zhb.pdf.ReportPdf;
import com.zhb.query.QueryResult;
import com.zhb.service.*;
import com.zhb.util.PageUtil;
import com.zhb.view.DiscoveryLevelView;
import com.zhb.view.DiscoveryProblemView;
import com.zhb.view.ReportView;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by zhouhaibin on 2016/7/20.
 */
@Controller
public class ReportController extends ControllerBase {
    public static final String MODE_DETAIL = "detail";
    public static final String MODE_EDIT = "edit";
    public static final String MODE_CHECK = "check";
    public static final String MODE_EDIT_AFTER_CHECK = "editAfterCheck";

    @javax.annotation.Resource(name="ReportService")
    private ReportService reportService;

    @javax.annotation.Resource(name="TaskService")
    private TaskService taskService;

    @javax.annotation.Resource(name="DiscoveryService")
    private DiscoveryService discoveryService;

    @javax.annotation.Resource(name="ProjectService")
    private ProjectService projectService;

    @javax.annotation.Resource(name="ModuleRecordService")
    private ModuleRecordService moduleRecordService;

    @RequestMapping("/toReportManager")//进入单中心报告管理页面
    public String toReportManager(HttpServletRequest request) {
        String type = request.getParameter("type");
        Map globalValues = new HashMap();
        globalValues.put("type", type);
        request.setAttribute(PageUtil.GLOBAL_VALUES, globalValues);
        request.setAttribute("type", type);
        if (type.equals("CenterReport"))
            return "/jsp/center-report-manager";
        else
            return "/jsp/stage-report-manager";
    }

    @RequestMapping("/toReportCheckManager")//进入单中心报告审阅管理页面
    public String toReportCheckManager(HttpServletRequest request) {
        String type = request.getParameter("type");
        Map globalValues = new HashMap();
        globalValues.put("mode", "all");
        globalValues.put("type", type);
        request.setAttribute(PageUtil.GLOBAL_VALUES, globalValues);
        request.setAttribute("mode", "all");
        request.setAttribute("type", type);
        if (type.equals("CenterReport"))
            return "/jsp/center-report-check-manager";
        else
            return "/jsp/stage-report-check-manager";
    }

    @RequestMapping("/toMyReportCheckManager")//进入我的单中心报告审阅管理页面
    public String toMyReportCheckManager(HttpServletRequest request) {
        String type = request.getParameter("type");
        Map globalValues = new HashMap();
        globalValues.put("mode", "onlyMine");
        globalValues.put("type", type);
        request.setAttribute(PageUtil.GLOBAL_VALUES, globalValues);
        request.setAttribute("mode", "onlyMine");
        request.setAttribute("type", type);
        if (type.equals("CenterReport"))
            return "/jsp/center-report-check-manager";
        else
            return "/jsp/stage-report-check-manager";
    }

    @RequestMapping("/toCenterReportClassifyManager")//进入单中心报告分级管理页面
    public String toCenterReportClassifyManager(HttpServletRequest request) {
        String type = request.getParameter("type");
        Map globalValues = new HashMap();
        globalValues.put("mode", "all");
        globalValues.put("type", type);
        request.setAttribute(PageUtil.GLOBAL_VALUES, globalValues);
        request.setAttribute("mode", "all");
        request.setAttribute("type", type);
        return "/jsp/center-report-classify-manager";
    }

    @RequestMapping("/toMyCenterReportClassifyManager")//进入单中心报告分级管理页面
    public String toMyCenterReportClassifyManager(HttpServletRequest request) {
        String type = request.getParameter("type");
        Map globalValues = new HashMap();
        globalValues.put("mode", "onlyMine");
        globalValues.put("type", type);
        request.setAttribute(PageUtil.GLOBAL_VALUES, globalValues);
        request.setAttribute("mode", "onlyMine");
        request.setAttribute("type", type);
        return "/jsp/center-report-classify-manager";
    }

    @RequestMapping("/reportDetail")//进入单中心报告修改页面
    public String reportDetail(HttpServletRequest request) {
        String id = request.getParameter("id");
        String type = request.getParameter("type");
        Map globalValues = new HashMap();
        globalValues.put("reportId", id);
        globalValues.put("mode", MODE_DETAIL);
        globalValues.put("type", type);

        request.setAttribute(PageUtil.GLOBAL_VALUES, globalValues);
        request.setAttribute("mode", MODE_DETAIL);
        request.setAttribute("type", type);
        return "/jsp/report-detail";
    }

    @RequestMapping("/checkReport")//进入报告评审页面
    public String checkReport(HttpServletRequest request) {
        reportService.setErrorMessage(null);
        String type = request.getParameter("type");
        String id = request.getParameter("id");
        String userId = loadUserId(request);
        boolean canEditReport = true;
        reportService.setReportClassByType(type);
        ReportBase report = reportService.loadReport(id);
        if (report.getCheckStatus() != ReportBase.CHECK_STATUS_ASSIGNED) {
            canEditReport = false;
        } else {
            if (!report.getCheckUserId().equals(userId)) {
                canEditReport = false;
            } else {
                if (!reportService.startEditReport(id, userId, request.getSession().getId())) {
                    canEditReport = false;
                }
            }
        }
        Map globalValues = new HashMap();
        globalValues.put("reportId", id);
        globalValues.put("mode", MODE_CHECK);
        globalValues.put("type", type);
        globalValues.put("canEditReport", canEditReport);
        globalValues.put("message", reportService.getErrorMessage());

        request.setAttribute(PageUtil.GLOBAL_VALUES, globalValues);
        request.setAttribute("mode", MODE_CHECK);
        request.setAttribute("type", type);
        return "/jsp/report-detail";
    }

    @RequestMapping("/checkDetailReport")//进入报告评审的详情页面
    public String checkDetailReport(HttpServletRequest request) {
        reportService.setErrorMessage(null);
        String type = request.getParameter("type");
        String id = request.getParameter("id");
        boolean canEditReport = false;
        reportService.setReportClassByType(type);
        Map globalValues = new HashMap();
        globalValues.put("reportId", id);
        globalValues.put("mode", MODE_CHECK);
        globalValues.put("type", type);
        globalValues.put("canEditReport", canEditReport);
        globalValues.put("message", reportService.getErrorMessage());

        request.setAttribute(PageUtil.GLOBAL_VALUES, globalValues);
        request.setAttribute("mode", MODE_CHECK);
        request.setAttribute("type", type);
        return "/jsp/report-detail";
    }

    @RequestMapping("/editReport")//进入单中心报告修改页面
    public String editReport(HttpServletRequest request) {
        reportService.setErrorMessage(null);
        String type = request.getParameter("type");
        String id = request.getParameter("id");
        String userId = loadUserId(request);
        reportService.setReportClassByType(type);
        ReportBase report = reportService.loadReport(id);
        String mode = MODE_EDIT_AFTER_CHECK;
        if (report.getStatus() == ReportBase.STATUS_EDITING) {
            mode = MODE_EDIT;
        }
        boolean canEditReport = false;
        if (report.getCanceled() == 1)
            mode = MODE_DETAIL;
        else {
            if (!reportService.startEditReport(id, userId, request.getSession().getId())) {
                //已经有别人正在编辑此报告，只能以只读方式打开
                mode = MODE_DETAIL;
            } else
                canEditReport = true;
        }
        Map globalValues = new HashMap();
        globalValues.put("reportId", id);
        globalValues.put("mode", mode);
        globalValues.put("canEditReport", canEditReport);
        globalValues.put("message", reportService.getErrorMessage());
        globalValues.put("type", type);
        globalValues.put("allReferences", MemoryCache.getObjectList(Reference.class));

        request.setAttribute(PageUtil.GLOBAL_VALUES, globalValues);
        request.setAttribute("mode", mode);
        request.setAttribute("type", type);
        return "/jsp/report-detail";
    }

    @RequestMapping("/classifyCenterReport")//进入单中心报告分级页面
    public String classifyCenterReport(HttpServletRequest request) {
        String type = request.getParameter("type");
        String id = request.getParameter("id");
        String userId = loadUserId(request);
        reportService.setReportClassByType(type);
        CenterReport report = (CenterReport)reportService.loadReport(id);
        boolean canEditReport = true;
        if (report.getClassifyStatus() != CenterReport.CLASSIFY_STATUS_ASSIGNED) {
            canEditReport = false;
        } else {
            if (!report.getClassifyUserId().equals(userId)) {
                canEditReport = false;
            }
        }
        Map globalValues = new HashMap();
        globalValues.put("reportId", id);
        globalValues.put("taskId", report.getId());
        globalValues.put("type", type);
        globalValues.put("classifyStatus", ((CenterReport)report).getClassifyStatus());
        globalValues.put("canEditReport", canEditReport);
        request.setAttribute(PageUtil.GLOBAL_VALUES, globalValues);
        request.setAttribute("type", type);
        return "/jsp/classify-center-report";
    }

    @RequestMapping("/classifyDetailCenterReport")//进入单中心报告分级的详情页面
    public String classifyDetailCenterReport(HttpServletRequest request) {
        String type = request.getParameter("type");
        String id = request.getParameter("id");
        reportService.setReportClassByType(type);
        ReportBase report = reportService.loadReport(id);
        boolean canEditReport = false;
        Map globalValues = new HashMap();
        globalValues.put("reportId", id);
        globalValues.put("taskId", report.getId());
        globalValues.put("type", type);
        globalValues.put("classifyStatus", ((CenterReport)report).getClassifyStatus());
        globalValues.put("canEditReport", canEditReport);
        request.setAttribute(PageUtil.GLOBAL_VALUES, globalValues);
        request.setAttribute("type", type);
        return "/jsp/classify-center-report";
    }

    @RequestMapping("/loadReports")
    @ResponseBody
    public Map loadReports(HttpServletRequest request) {
        String type = getStringParameter(request, "type");
        String keywords = getStringParameter(request, "keywords");
        int start = getIntParameter(request, "start");
        int limit = getIntParameter(request, "limit");
        String userId = loadUserId(request);
        reportService.setReportClassByType(type);
        QueryResult queryResult = reportService.loadReports(start, limit, userId, keywords);
        Map result = new HashMap();
        result.put("result", queryResult);
        return result;
    }

    @RequestMapping("/loadReportsToCheck")
    @ResponseBody
    public Map loadReportsToCheck(HttpServletRequest request) {
        String type = getStringParameter(request, "type");
        String keywords = getStringParameter(request, "keywords");
        int start = getIntParameter(request, "start");
        int limit = getIntParameter(request, "limit");
        int checkStatus = getIntParameter(request, "checkStatus");
        String mode = getStringParameter(request, "mode");
        String userId = loadUserId(request);
        reportService.setReportClassByType(type);
        QueryResult queryResult = reportService.loadReportsToCheck(start, limit, checkStatus, userId, keywords, mode);
        Map result = new HashMap();
        result.put("result", queryResult);
        return result;
    }

    @RequestMapping("/loadCenterReportsToClassify")
    @ResponseBody
    public Map loadCenterReportsToClassify(HttpServletRequest request) {
        String type = getStringParameter(request, "type");
        String keywords = getStringParameter(request, "keywords");
        int start = getIntParameter(request, "start");
        int limit = getIntParameter(request, "limit");
        int classifyStatus = getIntParameter(request, "classifyStatus");
        String mode = getStringParameter(request, "mode");
        String userId = loadUserId(request);
        reportService.setReportClassByType(type);
        QueryResult queryResult = reportService.loadCenterReportsToClassify(start, limit, classifyStatus, userId, keywords, mode);
        Map result = new HashMap();
        result.put("result", queryResult);
        return result;
    }

    @RequestMapping("/loadReport")
    @ResponseBody
    public Map loadReport(HttpServletRequest request) {
        String type = getStringParameter(request, "type");
        String id = getStringParameter(request, "id");
        reportService.setReportClassByType(type);
        ReportBase report = reportService.loadReport(id);
        List discoveries = discoveryService.loadDiscoveriesInReport(report.getId(), "patientNo", null, null);
        Project project = projectService.loadProject(report.getProjectId());
        List mainCategories = MemoryCache.getMainCategories();

        ReportView reportView = reportService.renderReportView(report, project, discoveries);

        Map result = new HashMap();
        int status = reportService.getReportStatus(report);
        boolean readonly = report.getCanceled() == 1;
        result.put("readonly", readonly);
        result.put("status", status);
        result.put("checkStatus", report.getCheckStatus());
        result.put("taskId", report.getId());
        result.put("opinionAcceptedMap", report.getOpinionAcceptedMap());
        result.put("view", reportView);
        result.put("mainCategories", mainCategories);
        return result;
    }

    @RequestMapping("/saveReportValue")
    @ResponseBody
    public Map saveReportValue(HttpServletRequest request) {
        String type = getStringParameter(request, "type");
        String reportId = getStringParameter(request, "reportId");
        String itemId = getStringParameter(request, "itemId");
        String fieldId = getStringParameter(request, "fieldId");
        String value = getStringParameter(request, "value");
        boolean opinion = getBooleanParameter(request, "opinion");
        String userId = loadUserId(request);
        String sessionId = request.getSession().getId();
        reportService.setReportClassByType(type);
        boolean res = reportService.startEditReport(reportId, userId, sessionId);
        if (!res) {
            return errorResult("资源被占用！");
        }

        ReportBase report = reportService.loadReport(reportId);
        List discoveries = discoveryService.loadDiscoveriesInReport(report.getId(), "patientNo", null, null);
        Project project = projectService.loadProject(report.getProjectId());

        String []itemIds = itemId.split("_");
        if (itemIds.length <= 1) {
            if (fieldId.equals("problem")) {
                ReportView reportView = new ReportView();
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



                //如果报告里保存了被修改过的问题归类描述，则用此替换原有的问题归类描述
                Map<String, String> problemMap = report.getProblemMap();
                boolean find = false;
                for (DiscoveryLevelView levelView : reportView.getLevelViews()) {
                    for (DiscoveryProblemView problemView : levelView.getProblemViews()) {
                        String problem = problemView.getId();
                        if (problemMap.containsKey(problem)) {
                            itemId = problem;
                            find = true;
                            break;
                        }
                    }
                    if (find)
                        break;
                }
            }
        }

        //reportService.setReportClassByType(type);
        reportService.saveReportValue(reportId, fieldId, itemId, value, opinion, userId);
        return successResult();
    }

    @RequestMapping("/saveReferences")
    @ResponseBody
    public Map saveReferences(HttpServletRequest request) {
        String type = getStringParameter(request, "type");
        String reportId = getStringParameter(request, "reportId");
        String referencesString = getStringParameter(request, "references");
        String userId = loadUserId(request);
        reportService.setReportClassByType(type);
        String sessionId = request.getSession().getId();

        boolean res = reportService.startEditReport(reportId, userId, sessionId);
        if (!res) {
            return errorResult("资源被占用！");
        }
        Map referenceMap = new HashMap();
        JSONArray jsonArray = JSONArray.fromObject(referencesString);
        for (int i = 0; i < jsonArray.size(); i ++) {
            JSONObject jsonObject = (JSONObject)jsonArray.get(i);
            Reference reference = (Reference)JSONObject.toBean(jsonObject, Reference.class);
            referenceMap.put(reference.getId(), reference.getName());
        }
        //reportService.setReportClassByType(type);
        reportService.saveReferences(reportId, referenceMap, userId);
        return successResult();
    }

    @RequestMapping("/saveOpinionAccepted")
    @ResponseBody
    public Map saveOpinionAccepted(HttpServletRequest request) {
        String type = getStringParameter(request, "type");
        String reportId = getStringParameter(request, "reportId");
        String itemId = getStringParameter(request, "itemId");
        String fieldId = getStringParameter(request, "fieldId");
        boolean opinionAccepted = getBooleanParameter(request, "opinionAccepted");
        String userId = loadUserId(request);
        String sessionId = request.getSession().getId();
        reportService.setReportClassByType(type);
        boolean res = reportService.startEditReport(reportId, userId, sessionId);
        if (!res) {
            return errorResult("资源被占用！");
        }
        //reportService.setReportClassByType(type);
        reportService.saveReportOpinionAccepted(reportId, fieldId, itemId, opinionAccepted, userId);
        return successResult();
    }

    @RequestMapping("/checkSubmitReport")
    @ResponseBody
    public Map checkSubmitReport(HttpServletRequest request) {
        String type = getStringParameter(request, "type");
        String id = getStringParameter(request, "id");
        String userId = loadUserId(request);
        reportService.setReportClassByType(type);
        reportService.checkSubmitReport(id);
        reportService.endEditReport(id, userId);
        return successResult();
    }

    @RequestMapping("/classifySubmitCenterReport")
    @ResponseBody
    public Map classifySubmitCenterReport(HttpServletRequest request) {
        String id = getStringParameter(request, "id");
        String userId = loadUserId(request);
        if (!reportService.classifySubmitCenterReport(id))
            return errorResult(reportService.getErrorMessage());
        //reportService.endEditReport(id, userId);
        return successResult();
    }

    @RequestMapping("/submitReportToCheck")
    @ResponseBody
    public Map submitReportToCheck(HttpServletRequest request) {
        String type = getStringParameter(request, "type");
        String id = getStringParameter(request, "id");
        String userId = loadUserId(request);
        reportService.setReportClassByType(type);
        if (!reportService.submitReportToCheck(id))
            return errorResult(reportService.getErrorMessage());
        reportService.endEditReport(id, userId);
        return successResult();
    }

    @RequestMapping("/submitReport")
    @ResponseBody
    public Map submitReport(HttpServletRequest request) {
        String type = getStringParameter(request, "type");
        String id = getStringParameter(request, "id");
        String userId = loadUserId(request);
        reportService.setReportClassByType(type);
        List discoveries = discoveryService.loadDiscoveriesInReport(id, "patientNo", null, null);
        if (!reportService.submitReport(id, discoveries))
            return errorResult(reportService.getErrorMessage());
        reportService.endEditReport(id, userId);
        return successResult();
    }

    @RequestMapping("/revokeReport")
    @ResponseBody
    public Map revokeReport(HttpServletRequest request) {
        String type = getStringParameter(request, "type");
        String id = getStringParameter(request, "id");
        String userId = loadUserId(request);
        reportService.updateReportStatus(id, 3);
        return successResult();
    }

    @RequestMapping("/receiveCheckReport")
    @ResponseBody
    public Map receiveCheckReport(HttpServletRequest request) {
        String type = getStringParameter(request, "type");
        String id = getStringParameter(request, "id");
        String userId = loadUserId(request);
        reportService.setReportClassByType(type);
        reportService.receiveCheckReport(id, userId);
        return successResult();
    }

    @RequestMapping("/sendbackCheckReport")
    @ResponseBody
    public Map sendbackCheckReport(HttpServletRequest request) {
        String type = getStringParameter(request, "type");
        String id = getStringParameter(request, "id");
        String userId = loadUserId(request);
        reportService.setReportClassByType(type);
        reportService.sendbackCheckReport(id, userId);
        return successResult();
    }

    @RequestMapping("/receiveClassifyCenterReport")
    @ResponseBody
    public Map receiveClassifyCenterReport(HttpServletRequest request) {
        String id = getStringParameter(request, "id");
        String userId = loadUserId(request);
        reportService.receiveClassifyCenterReport(id, userId);
        return successResult();
    }

    @RequestMapping("/sendbackClassifyCenterReport")
    @ResponseBody
    public Map sendbackClassifyCenterReport(HttpServletRequest request) {
        String id = getStringParameter(request, "id");
        String userId = loadUserId(request);
        reportService.sendbackClassifyCenterReport(id, userId);
        return successResult();
    }

    @RequestMapping("/closeReport")
    @ResponseBody
    public Map closeReport(HttpServletRequest request) {
        String type = getStringParameter(request, "type");
        String id = getStringParameter(request, "id");
        String userId = loadUserId(request);
        reportService.setReportClassByType(type);
        if (!reportService.closeReport(id, userId))
            return errorResult(reportService.getErrorMessage());
        return successResult();
    }

    @RequestMapping("/saveClassifyResult")
    @ResponseBody
    public Map saveClassifyResult(HttpServletRequest request) {
        String reportId = getStringParameter(request, "reportId");
        String userId = loadUserId(request);
        String sessionId = request.getSession().getId();
//        boolean res = reportService.startEditReport(reportId, userId, sessionId);
//        if (!res) {
//            return errorResult("资源被占用！");
//        }
        String id = getStringParameter(request, "id");
        JSONArray classifyResult = getJSONArrayParameter(request, "classifyResult");
        discoveryService.updateClassifyResult(classifyResult);
        reportService.onCenterClassifyModified(id);
        return successResult();
    }

    @RequestMapping("/resetProblem")
    @ResponseBody
    public Map resetProblem(HttpServletRequest request) {
        String type = getStringParameter(request, "type");
        String reportId = getStringParameter(request, "reportId");
        String itemId = getStringParameter(request, "itemId");
        String userId = loadUserId(request);
        reportService.setReportClassByType(type);
        String problemName = reportService.resetProblem(reportId, itemId, userId);
        Map result = new HashMap();
        result.put("problemName", problemName);
        return result;
    }

    @RequestMapping("/printReport/{type}/{id}")
    public @ResponseBody void printReport(HttpServletRequest request , HttpServletResponse response, @PathVariable("id") String id, @PathVariable("type") String type) throws Exception {
        reportService.setReportClassByType(type);
        ReportBase report = reportService.loadReport(id);
        List discoveries = discoveryService.loadDiscoveriesInReport(report.getId(), "created", null, null);
        Project project = projectService.loadProject(report.getProjectId());

        ReportView reportView = reportService.renderReportView(report, project, discoveries);

        response.reset();
        response.setContentType("application/pdf");
        response.setHeader("Expires", "0");
        response.setHeader("Cache-Control","must-revalidate, post-check=0, pre-check=0");
        response.setHeader("Pragma", "public");

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ReportPdf reportPdf = new ReportPdf();
        reportPdf.createReportPdf(reportView, baos);

        ServletOutputStream out = response.getOutputStream();
        baos.writeTo(out);
        out.flush();
    }

    @RequestMapping("/endEditReport")
    @ResponseBody
    public Map endEditReport(HttpServletRequest request) {
        String id = getStringParameter(request, "id");
        String userId = loadUserId(request);
        if (!reportService.endEditReport(id, userId))
            return errorResult(reportService.getErrorMessage());
        return successResult();
    }
}

