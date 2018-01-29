package com.zhb.controller;

import com.zhb.bean.*;
import com.zhb.manager.MemoryCache;
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
 * Created by zhouhaibin on 2016/10/28.
 * 稽查记录表
 */
@Controller
public class TaskReportController extends ControllerBase {
    @javax.annotation.Resource(name="TaskService")
    private TaskService taskService;

    @javax.annotation.Resource(name="ModuleRecordService")
    private ModuleRecordService moduleRecordService;

    @javax.annotation.Resource(name="DiscoveryService")
    private DiscoveryService discoveryService;

    @RequestMapping("/toTaskReportManager")//进入稽查记录表列表页面
    public String toTaskReportManager(HttpServletRequest request) {
        return "/jsp/task-report-manager";
    }

    @RequestMapping("/loadTaskReport")
    @ResponseBody
    public Map loadTaskReport(HttpServletRequest request) {
        String id = getStringParameter(request, "id");
        Task task = taskService.loadTask(id);
        List moduleRecords = moduleRecordService.loadModuleRecordsByTaskId(id);
        List discoveries = discoveryService.loadDiscoveries(id, "created", null, null, null);
        Map result = new HashMap();
        result.put("task", task);
        result.put("moduleRecords", moduleRecords);
        result.put("discoveries", discoveries);
        result.put("tableMap", MemoryCache.getObjectMap(Table.class));
        result.put("moduleMap", MemoryCache.getObjectMap(Module.class));
        result.put("categoryMap", MemoryCache.getObjectMap(Category.class));
        result.put("problemMap", MemoryCache.getObjectMap(Problem.class));
        return result;
    }

    @RequestMapping("/taskReportDetail")//进入稽查记录表详情页面
    public String taskReportDetail(HttpServletRequest request) {
        String id = request.getParameter("id");
        Map globalValues = new HashMap();
        globalValues.put("reportId", id);
        request.setAttribute(PageUtil.GLOBAL_VALUES, globalValues);
        return "/jsp/task-report-detail";
    }

}
