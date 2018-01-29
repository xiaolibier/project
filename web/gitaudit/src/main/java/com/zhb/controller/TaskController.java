package com.zhb.controller;

import com.zhb.bean.*;
import com.zhb.query.QueryResult;
import com.zhb.service.*;
import com.zhb.util.PageUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by zhouhaibin on 2016/7/20.
 */
@Controller
public class TaskController extends ControllerBase {
    @javax.annotation.Resource(name="TaskService")
    private TaskService taskService;

    @javax.annotation.Resource(name="ReportService")
    private ReportService reportService;

    @javax.annotation.Resource(name="OriginalReportService")
    private OriginalReportService originalReportService;

    @javax.annotation.Resource(name="ModuleRecordService")
    private ModuleRecordService moduleRecordService;

    @javax.annotation.Resource(name="DiscoveryService")
    private DiscoveryService discoveryService;

    @RequestMapping("/toTaskManager")//进入稽查任务列表页面
    public String toTaskManager(HttpServletRequest request) {
        return "/jsp/task-manager";
    }

    @RequestMapping("/toTaskDetail")//进入稽查任务详情页面
    public String toTaskeDetail(HttpServletRequest request) {
        String id = request.getParameter("id");
        Map globalValues = new HashMap();
        globalValues.put("taskId", id);

        request.setAttribute(PageUtil.GLOBAL_VALUES, globalValues);
        return "/jsp/task-detail";
    }

    @RequestMapping("/toTaskModules")//进入任务模块页面
    public String toTaskModules(HttpServletRequest request) {
        return "task-modules";
    }

    @RequestMapping("/loadTasks")
    @ResponseBody
    public Map loadTasks(HttpServletRequest request) {
        String projectId = getStringParameter(request, "projectId");
        String stageId = getStringParameter(request, "stageId");
        String centerId = getStringParameter(request, "centerId");
        String keywords = getStringParameter(request, "keywords");
        int start = getIntParameter(request, "start");
        int limit = getIntParameter(request, "limit");
        String userId = loadUserId(request);
        QueryResult queryResult = taskService.loadTasks(start, limit, userId, projectId, stageId, centerId, keywords);
        Map result = new HashMap();
        result.put("result", queryResult);
        return result;
    }

    @RequestMapping("/loadTask")
    @ResponseBody
    public Map loadTask(HttpServletRequest request) {
        String id = getStringParameter(request, "id");
        Task task = taskService.loadTask(id);
        Map result = new HashMap();
        result.put("item", task);
        return result;
    }

    @RequestMapping("/createOriginalReport")
    @ResponseBody
    public Map createOriginalReport(HttpServletRequest request) {
        String userId = loadUserId(request);
        String id = getStringParameter(request, "id");
        OriginalReport originalReport = originalReportService.loadOriginalReport(id);
        if (originalReport != null) {
            return errorResult("原始版稽查记录表已经存在");
        }
        Task task = taskService.loadTask(id);
        List moduleRecords = moduleRecordService.loadModuleRecordsByTaskId(id);
        List discoveries = discoveryService.loadDiscoveries(id, "created", null, null, null);
        if (!originalReportService.createOriginalReport(task, userId, moduleRecords, discoveries))
            return errorResult(originalReportService.getErrorMessage());
        return successResult();
    }

    @RequestMapping("/createCenterReport")
    @ResponseBody
    public Map createCenterReport(HttpServletRequest request) {
        String userId = loadUserId(request);
        String id = getStringParameter(request, "id");
        if (!originalReportService.reportExist(id)) {
            return errorResult("请先生成原始版稽查记录表");
        }
        if (reportService.reportExist(id, CenterReport.class)) {
            return errorResult("单中心报告已经存在");
        }
        if (!discoveryService.discoveryMetadataNotNull(id)) {
            return errorResult(discoveryService.getErrorMessage());
        }
        Task task = taskService.loadTask(id);
        reportService.createCenterReport(task, userId);
        return successResult();
    }

    //检查能否编辑此任务的记录
    @RequestMapping("/startEditTaskModule")
    @ResponseBody
    public Map startEditTaskModule(HttpServletRequest request) {
        taskService.setErrorMessage(null);
        String taskModuleId = getStringParameter(request, "taskModuleId");
        String userId = loadUserId(request);
        boolean success = taskService.startEditTaskModule(taskModuleId, userId, request.getSession().getId());
        Map result = new HashMap();
        result.put("success", success);
        result.put("message", taskService.getErrorMessage());
        return result;
    }

    @RequestMapping("/endEditTaskModule")
    @ResponseBody
    public Map endEditTaskModule(HttpServletRequest request) {
        String taskModuleId = getStringParameter(request, "taskModuleId");
        String userId = loadUserId(request);
        if (!taskService.endEditTaskModule(taskModuleId, userId))
            return errorResult(taskService.getErrorMessage());
        return successResult();
    }
}
