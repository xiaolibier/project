package com.zhb.controller;

import com.zhb.bean.*;
import com.zhb.manager.MemoryCache;
import com.zhb.service.ModifyRecordService;
import com.zhb.service.ModuleRecordService;
import com.zhb.service.ProjectService;
import com.zhb.service.TaskService;
import com.zhb.util.PageUtil;
import net.sf.json.JSONObject;
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
public class ModuleRecordController extends ControllerBase {
    @javax.annotation.Resource(name="ModuleRecordService")
    private ModuleRecordService moduleRecordService;

    @javax.annotation.Resource(name="TaskService")
    private TaskService taskService;

    @javax.annotation.Resource(name="ModifyRecordService")
    private ModifyRecordService modifyRecordService;

    @javax.annotation.Resource(name="ProjectService")
    private ProjectService projectService;

    @RequestMapping("/toTaskModuleDetail")
    public String toTaskModuleDetail(HttpServletRequest request) {
        String id = request.getParameter("id");
        String taskId = request.getParameter("taskId");
        Map globalValues = new HashMap();
        globalValues.put("taskModuleId", id);
        globalValues.put("taskId", taskId);
        Task task = taskService.loadTask(taskId);
        TaskModule taskModule = task.findTaskModule(id);
        boolean readonly = taskService.isTaskReadonly(task);
        globalValues.put("readonly", readonly);
        globalValues.put("centerId", task.getCenterId());
        globalValues.put("moduleId", taskModule.getModuleId());
        globalValues.put("moduleName", MemoryCache.getObject(Module.class, taskModule.getModuleId()).getName());
        globalValues.put("taskMemberCount", task.findTotalMemberCount());
        request.setAttribute(PageUtil.GLOBAL_VALUES, globalValues);
        request.setAttribute("taskId", taskId);
        return "/jsp/task-module-detail";
    }

    @RequestMapping("/loadModuleRecords")
    @ResponseBody
    public Map loadModuleRecords(HttpServletRequest request) {
        String taskModuleId = getStringParameter(request, "taskModuleId");
        List list = moduleRecordService.loadModuleRecords(taskModuleId);
        Map result = new HashMap();
        result.put("list", list);
        return result;
    }

    @RequestMapping("/addModuleRecord")
    @ResponseBody
    public Map addModuleRecord(HttpServletRequest request) {
        JSONObject jsonObject = getJsonObjectParameter(request);
        JSONObject jsonParameter = jsonObject.getJSONObject("moduleRecord");
        ModuleRecord moduleRecord = moduleRecordService.createModuleRecordFromJsonObject(jsonParameter);
        String userId = loadUserId(request);
        moduleRecord.setCreatorId(userId);
        moduleRecord.setCreated(new Timestamp(System.currentTimeMillis()));
        Task task = taskService.loadTask(moduleRecord.getTaskId());
        moduleRecordService.addModuleRecord(moduleRecord, userId, task);
        taskService.updateTaskLastModify(moduleRecord.getTaskId());
        projectService.updateProjectStatusToRunning(task.getProjectId());
        Map result = new HashMap();
        result.put("moduleRecordId", moduleRecord.getId());
        return result;
    }

    @RequestMapping("/saveModuleRecord")
    @ResponseBody
    public Map saveModuleRecord(HttpServletRequest request) {
        JSONObject jsonObject = getJsonObjectParameter(request);
        JSONObject jsonParameter = jsonObject.getJSONObject("moduleRecord");
        String userId = loadUserId(request);
        ModuleRecord moduleRecord = moduleRecordService.createModuleRecordFromJsonObject(jsonParameter);
        Task task = taskService.loadTask(moduleRecord.getTaskId());
        moduleRecordService.saveModuleRecord(moduleRecord, userId, task);
        taskService.updateTaskLastModify(moduleRecord.getTaskId());
        return successResult();
    }

    @RequestMapping("/deleteModuleRecord")
    @ResponseBody
    public Map deleteModuleRecord(HttpServletRequest request) {
        String id = getStringParameter(request, "id");
        String userId = loadUserId(request);
        ModuleRecord moduleRecord = moduleRecordService.loadModuleRecord(id);
        Task task = taskService.loadTask(moduleRecord.getTaskId());
        if (!moduleRecordService.deleteModuleRecord(moduleRecord, userId, task))
            return errorResult(moduleRecordService.getErrorMessage());
        taskService.updateTaskLastModify(moduleRecord.getTaskId());
        return successResult();
    }

    //加载需要被继承的元数据，用于新建一个模块记录而此模块记录的字段需要从项目信息里继承的时候使用
    @RequestMapping("/loadInheritMetadata")
    @ResponseBody
    public Map loadInheritMetadata(HttpServletRequest request) {
        String taskId = getStringParameter(request, "taskId");
        String moduleId = getStringParameter(request, "moduleId");
        JSONObject jsonObject = moduleRecordService.createModuleRecordWithInherit(taskId, moduleId);
        Map result = new HashMap();
        result.put("content", jsonObject);
        return result;
    }

    @RequestMapping("/loadModuleTable")
    @ResponseBody
    public Map loadModuleTable(HttpServletRequest request) {
        String moduleId = getStringParameter(request, "moduleId");
        Module module = (Module)MemoryCache.getObject(Module.class, moduleId);
        Table table = moduleRecordService.getModuleTable(moduleId);
        Map result = new HashMap();
        result.put("table", table);
        result.put("module", module);
        return result;
    }
}
