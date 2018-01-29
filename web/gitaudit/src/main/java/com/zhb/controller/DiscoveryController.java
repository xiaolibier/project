package com.zhb.controller;

import com.zhb.bean.*;
import com.zhb.core.ObjectBase;
import com.zhb.manager.MemoryCache;
import com.zhb.service.DiscoveryService;
import com.zhb.service.ReportService;
import com.zhb.service.TaskService;
import com.zhb.util.PageUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by zhouhaibin on 2016/7/20.
 */
@Controller
public class DiscoveryController extends ControllerBase {
    @javax.annotation.Resource(name="DiscoveryService")
    private DiscoveryService discoveryService;

    @javax.annotation.Resource(name="TaskService")
    private TaskService taskService;

    @javax.annotation.Resource(name="ReportService")
    private ReportService reportService;

    @RequestMapping("/discovery-manager")
    public String toDiscoveryManager(HttpServletRequest request) {
        return "discovery-manager";
    }

    @RequestMapping("/toDiscoveryList")//跳转到发现列表页（未入报告的稽查发现列表）
    public String toDiscoveryList(HttpServletRequest request) {
        String taskId = request.getParameter("taskId");
        String type = request.getParameter("type");
        Map globalValues = new HashMap();
        globalValues.put("taskId", taskId);
        globalValues.put("type", type);
        request.setAttribute(PageUtil.GLOBAL_VALUES, globalValues);
        return "/jsp/discovery-list";
    }

    @RequestMapping("/loadDiscoveries")
    @ResponseBody
    public Map loadDiscoveries(HttpServletRequest request) {
        String taskId = getStringParameter(request, "taskId");
        String orderBy = getStringParameter(request, "orderBy");
        boolean onlyMine = getBooleanParameter(request, "onlyMine");
        String creatorId = onlyMine ? loadUserId(request) : ObjectBase.EMPTY_OBJECT;
        String patientNo = getStringParameter(request, "patientNo");
        String categoryId = getStringParameter(request, "categoryId");
        List list = discoveryService.loadDiscoveries(taskId, orderBy, creatorId, patientNo, categoryId);
        Map result = new HashMap();
        result.put("list", list);
        return result;
    }

    @RequestMapping("/loadDiscoveriesNoInReport")
    @ResponseBody
    public Map loadDiscoveriesNoInReport(HttpServletRequest request) {
        String taskId = getStringParameter(request, "taskId");
        List list = discoveryService.loadDiscoveriesNoInReport(taskId);
        Map result = new HashMap();
        result.put("list", list);
        result.put("categoryMap", MemoryCache.getObjectMap(Category.class));
        result.put("problemMap", MemoryCache.getObjectMap(Problem.class));
        return result;
    }

    @RequestMapping("/loadDiscoveriesInReport")
    @ResponseBody
    public Map loadDiscoveriesInReport(HttpServletRequest request) {
        String taskId = getStringParameter(request, "taskId");
        String orderBy = getStringParameter(request, "orderBy");
        String patientNo = getStringParameter(request, "patientNo");
        String categoryId = getStringParameter(request, "categoryId");
        List list = discoveryService.loadDiscoveriesInReport(taskId, orderBy, patientNo, categoryId);
        Map result = new HashMap();
        result.put("list", list);
        result.put("categoryMap", MemoryCache.getObjectMap(Category.class));
        result.put("problemMap", MemoryCache.getObjectMap(Problem.class));
        return result;
    }

    @RequestMapping("/addDiscovery")
    @ResponseBody
    public Map addDiscovery(HttpServletRequest request) throws Exception {
        String userId = loadUserId(request);
        Discovery discovery = (Discovery)getObjectParameter(request, "discovery", Discovery.class);
        Discovery existingDiscovery = discoveryService.loadDiscovery(discovery.getId());
        if (existingDiscovery != null) {
            logger.debug("发现已经存在");
            Map result = new HashMap();
            result.put("discoveryCode", existingDiscovery.getCode());
            return result;
        }
        discovery.setCreated(new Timestamp(System.currentTimeMillis()));
        discovery.setCreatorId(userId);
        discovery.setEditorId(userId);
        discovery.setEditTime(new Timestamp(System.currentTimeMillis()));
        Task task = taskService.loadTask(discovery.getTaskId());
        discovery.setCenterId(task.getCenterId());
        discovery.setCenterName(task.getCenterName());
        discoveryService.createDiscoveryCode(discovery);
        if (!discoveryService.verifyDiscovery(discovery)) {
            return popupMessage(discoveryService.getErrorMessage());
        }
        discoveryService.addDiscovery(discovery, userId, task);
        taskService.updateTaskLastModify(discovery.getTaskId());
        Map result = new HashMap();
        result.put("discoveryCode", discovery.getCode());
        return result;
    }

    @RequestMapping("/saveDiscovery")
    @ResponseBody
    public Map saveDiscovery(HttpServletRequest request) throws Exception {
        String userId = loadUserId(request);
        Discovery discovery = (Discovery)getObjectParameter(request, "discovery", Discovery.class);
        discovery.setEditTime(new Timestamp(System.currentTimeMillis()));
        discovery.setEditorId(userId);
        Discovery oldDiscovery = discoveryService.loadDiscovery(discovery.getId());
        discovery.setCreated(oldDiscovery.getCreated());
        discovery.setCreatorId(oldDiscovery.getCreatorId());
        Task task = taskService.loadTask(discovery.getTaskId());
        if (!discoveryService.verifyDiscovery(discovery)) {
            return popupMessage(discoveryService.getErrorMessage());
        }
        discoveryService.saveDiscovery(discovery, userId, task, null);
        taskService.updateTaskLastModify(discovery.getTaskId());
        return successResult();
    }

    @RequestMapping("/saveDiscoveryFromReport")
    @ResponseBody
    public Map saveDiscoveryFromReport(HttpServletRequest request) {
        String userId = loadUserId(request);
        Discovery discovery = (Discovery)getObjectParameter(request, "discovery", Discovery.class);
        String reportId = getStringParameter(request, "reportId");
        String reportType = getStringParameter(request, "reportType");
        discovery.setEditTime(new Timestamp(System.currentTimeMillis()));
        discovery.setEditorId(userId);
        reportService.setReportClassByType(reportType);
        ReportBase report = reportService.loadReport(reportId);
        discoveryService.saveDiscovery(discovery, userId, null, report);
        taskService.updateTaskLastModify(discovery.getTaskId());
        return successResult();
    }

    @RequestMapping("/deleteDiscovery")
    @ResponseBody
    public Map deleteDiscovery(HttpServletRequest request) {
        String id = getStringParameter(request, "id");
        String userId = loadUserId(request);
        Discovery discovery = discoveryService.loadDiscovery(id);
        Task task = taskService.loadTask(discovery.getTaskId());
        if (!discoveryService.deleteDiscovery(discovery, userId, task))
            return errorResult(discoveryService.getErrorMessage());
        taskService.updateTaskLastModify(discovery.getTaskId());
        return successResult();
    }

    @RequestMapping("/loadDiscovery")
    @ResponseBody
    public Map loadDiscovery(HttpServletRequest request) {
        String id = getStringParameter(request, "id");
        Discovery discovery = discoveryService.loadDiscovery(id);
        Map result = new HashMap();
        result.put("item", discovery);
        return result;
    }

    @RequestMapping("/updateDiscoveryInReport")
    @ResponseBody
    public Map updateDiscoveryInReport(HttpServletRequest request) {
        String id = getStringParameter(request, "id");
        Discovery discovery = discoveryService.loadDiscovery(id);
        int inReport = getIntParameter(request, "inReport");
        if (!discoveryService.updateDiscoveryInReport(id, inReport)) {
            return popupMessage(discoveryService.getErrorMessage());
        }
        taskService.updateTaskLastModify(discovery.getTaskId());
        return successResult();
    }

    //检查能否编辑此任务的记录
    @RequestMapping("/startEditDiscovery")
    @ResponseBody
    public Map startEditDiscovery(HttpServletRequest request) {
        discoveryService.setErrorMessage(null);
        String id = getStringParameter(request, "id");
        String userId = loadUserId(request);
        boolean success = discoveryService.startEditDiscovery(id, userId, request.getSession().getId());
        Map result = new HashMap();
        result.put("success", success);
        result.put("message", discoveryService.getErrorMessage());
        return result;
    }

    @RequestMapping("/endEditDiscovery")
    @ResponseBody
    public Map endEditDiscovery(HttpServletRequest request) {
        String id = getStringParameter(request, "id");
        String userId = loadUserId(request);
        if (!discoveryService.endEditDiscovery(id, userId))
            return errorResult(taskService.getErrorMessage());
        return successResult();
    }
}
