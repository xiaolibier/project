package com.zhb.controller;

import com.zhb.bean.*;
import com.zhb.manager.MemoryCache;
import com.zhb.query.QueryResult;
import com.zhb.service.*;
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
public class ProjectController extends ControllerBase {
    @javax.annotation.Resource(name="DepartmentService")
    private DepartmentService departmentService;

    @javax.annotation.Resource(name="ProjectService")
    private ProjectService projectService;

    @javax.annotation.Resource(name="TaskService")
    private TaskService taskService;

    @javax.annotation.Resource(name="UserService")
    private UserService userService;

    @RequestMapping("/toProjectManager")//跳转到项目管理页面
    public String toProjectManager(HttpServletRequest request) {
        Map globalValues = new HashMap();
        List allUsers = userService.loadAllUsers();
        globalValues.put("allUsers", allUsers);
        globalValues.put("allFilters", MemoryCache.filters);
        List allDepartments = departmentService.loadAllDepartments(false);
        globalValues.put("allDepartments", allDepartments);

        request.setAttribute(PageUtil.GLOBAL_VALUES, globalValues);
        return "/jsp/project-manager";
    }

    @RequestMapping("/loadProjects")
    @ResponseBody
    public Map loadProjects(HttpServletRequest request) {
        int start = getIntParameter(request, "start");
        int limit = getIntParameter(request, "limit");
        String keywords = getStringParameter(request, "keywords");
        String userId = loadUserId(request);
        QueryResult queryResult = projectService.loadProjects(start, limit, keywords, userId);
        Map allDataTemplates = MemoryCache.getObjectMap(DataTemplate.class);
        Map result = new HashMap();
        result.put("result", queryResult);
        result.put("allDataTemplates", allDataTemplates);
        return result;
    }

    //构建JSON转换时需要的class map
    private Map buildClassMap() {
        Map classMap = new HashMap();
        classMap.put("centers", ProjectCenter.class);
        classMap.put("stageCenters", StageCenter.class);
        classMap.put("stages", ProjectStage.class);
        return classMap;
    }

    @RequestMapping("/addProject")
    @ResponseBody
    public Map addProject(HttpServletRequest request) throws Exception {
        Project project = (Project)getObjectParameter(request, "project", Project.class, buildClassMap());
        if (projectService.objectExist(project.getId(), "Project"))
            return popupMessage("项目编号已经存在");
        project.setCreated(new Timestamp(System.currentTimeMillis()));
        for (ProjectStage projectStage : project.getStages()) {
            for (StageCenter stageCenter : projectStage.getStageCenters()) {
                stageCenter.setId(IDGenerator.createStageCenterId(stageCenter, project, projectStage));
            }
        }
        project.list2Content();
        if (!projectService.verifyProject(project)) {
            return popupMessage(projectService.getErrorMessage());
        }
        projectService.addProject(project);
        return successResult();
    }

    @RequestMapping("/updateProject")
    @ResponseBody
    public Map updateProject(HttpServletRequest request) throws Exception {
        Project project = (Project)getObjectParameter(request, "project", Project.class, buildClassMap());
        for (ProjectStage projectStage : project.getStages()) {
            for (StageCenter stageCenter : projectStage.getStageCenters()) {
                stageCenter.setId(IDGenerator.createStageCenterId(stageCenter, project, projectStage));
            }
        }
        if (!projectService.verifyProject(project)) {
            return popupMessage(projectService.getErrorMessage());
        }
        if (!projectService.saveProject(project))
            return errorResult(projectService.getErrorMessage());
        return successResult();
    }

    @RequestMapping("/deleteProject")
    @ResponseBody
    public Map deleteProject(HttpServletRequest request) {
        String id = getStringParameter(request, "id");
        if (!projectService.deleteProject(id))
            return errorResult(projectService.getErrorMessage());
        return successResult();
    }

    @RequestMapping("/loadProject")
    @ResponseBody
    public Map loadProject(HttpServletRequest request) {
        String id = getStringParameter(request, "id");
        Project project = projectService.loadProject(id);
        Map result = new HashMap();
        result.put("item", project);
        return result;
    }

    @RequestMapping("/closeProject")
    @ResponseBody
    public Map closeProject(HttpServletRequest request) {
        String id = getStringParameter(request, "id");
        projectService.closeProject(id);
        return successResult();
    }

    @RequestMapping("/cancelProject")
    @ResponseBody
    public Map cancelProject(HttpServletRequest request) {
        String id = getStringParameter(request, "id");
        projectService.cancelProject(id);
        return successResult();
    }

    @RequestMapping("/startProject")
    @ResponseBody
    public Map startProject(HttpServletRequest request) {
        String id = getStringParameter(request, "id");
        projectService.startProject(id);
        return successResult();
    }

    @RequestMapping("/loadProjectStages")
    @ResponseBody
    public Map loadProjectStages(HttpServletRequest request) {
        String id = getStringParameter(request, "id");
        List list = projectService.loadProjectStages(id);
        Map result = new HashMap();
        result.put("list", list);
        return result;
    }

    @RequestMapping("/cancelProjectStage")
    @ResponseBody
    public Map cancelProjectStage(HttpServletRequest request) {
        String projectId = getStringParameter(request, "projectId");
        String stageId = getStringParameter(request, "stageId");
        projectService.cancelProjectStage(projectId, stageId);
        return successResult();
    }

    @RequestMapping("/startProjectStage")
    @ResponseBody
    public Map startProjectStage(HttpServletRequest request) {
        String projectId = getStringParameter(request, "projectId");
        String stageId = getStringParameter(request, "stageId");
        projectService.startProjectStage(projectId, stageId);
        return successResult();
    }

    @RequestMapping("/loadStageCenters")
    @ResponseBody
    public Map loadStageCenters(HttpServletRequest request) {
        String projectId = getStringParameter(request, "projectId");
        String stageId = getStringParameter(request, "stageId");
        List list = projectService.loadStageCenters(projectId, stageId);
        Map result = new HashMap();
        result.put("list", list);
        return result;
    }

    @RequestMapping("/cancelStageCenter")
    @ResponseBody
    public Map cancelStageCenter(HttpServletRequest request) {
        String projectId = getStringParameter(request, "projectId");
        String stageId = getStringParameter(request, "stageId");
        String centerId = getStringParameter(request, "centerId");
        projectService.cancelStageCenter(projectId, stageId, centerId);
        return successResult();
    }

    @RequestMapping("/startStageCenter")
    @ResponseBody
    public Map startStageCenter(HttpServletRequest request) {
        String projectId = getStringParameter(request, "projectId");
        String stageId = getStringParameter(request, "stageId");
        String centerId = getStringParameter(request, "centerId");
        projectService.startStageCenter(projectId, stageId, centerId);
        return successResult();
    }

    @RequestMapping("/createTask")
    @ResponseBody
    public Map createTask(HttpServletRequest request) {
        String projectId = getStringParameter(request, "projectId");
        Project project = projectService.loadProject(projectId);
        taskService.createTaskByProject(project);
        return successResult();
    }
}
