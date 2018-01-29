package com.zhb.service;

import com.zhb.bean.*;
import com.zhb.dao.DaoPara;
import com.zhb.manager.LockManager;
import com.zhb.manager.MemoryCache;
import com.zhb.manager.ResourceLock;
import com.zhb.query.QueryResult;
import com.zhb.util.ObjectVerifyUtil;
import net.sf.json.JSONArray;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by zhouhaibin on 2016/7/20.
 */

@Service("TaskService")
public class TaskService extends AuditServiceBase {
    static Map<String, String> taskLock = new HashMap<>();
    @javax.annotation.Resource(name="ProjectService")
    private ProjectService projectService;

    @javax.annotation.Resource(name="ReportService")
    private ReportService reportService;

    public QueryResult loadTasks(int start, int limit, String userId, String projectId, String stageId, String centerId, String keywords) {
        DaoPara daoPara = buildDaoPara(start, limit, userId, projectId, stageId, centerId, keywords);
        daoPara.setClazz(Task.class);
        daoPara.addOrder("lastModify", "desc");
        int totalCount = dao.getTotalCount(daoPara);
        List list = dao.loadList(daoPara);
        QueryResult queryResult = QueryResult.buildResult(start, limit, totalCount, list);
        return queryResult;
    }

    public boolean verifyTask(Task task) throws Exception {
        errorMessage = ObjectVerifyUtil.verify(task);
        if (errorMessage != null)
            return false;
        return true;
    }

    public Task loadTask(String id) {
        Task task = (Task)loadObjectById(id, Task.class);
        if (task == null)
            return null;
        task.content2List();
        return task;
    }

    public List createTaskByProject(Project project) {
        List list = new ArrayList();
        for (ProjectStage projectStage : project.getStages()) {
            for (StageCenter stageCenter : projectStage.getStageCenters()) {
                Task task = loadTask(stageCenter.getId());
                if (task != null)
                    continue;
                //如果任务不存在，证明此中心属于新添加的中心，需要新建一个稽查任务与之对应
                task = addTask(project, projectStage, stageCenter);
                list.add(task);
            }
        }
        return list;
    }

    public Task addTask(Project project, ProjectStage projectStage, StageCenter stageCenter) {
        Task task = new Task();
        task.setId(stageCenter.getId());
        System.out.println(task.getId());
        task.setProjectId(project.getId());
        task.setStageId(projectStage.getId());
        task.setCenterId(stageCenter.getCenterId());
        task.setCreated(new Timestamp(System.currentTimeMillis()));
        task.setLastModify(task.getCreated());
        task.setProjectName(project.getName());
        task.setProjectCreated(project.getCreated());
        task.setStageName(projectStage.getName());
        Center center = (Center)MemoryCache.getObject(Center.class, stageCenter.getCenterId());
        task.setCenterName(center.getName());
        task.setLeaderId(project.getLeaderId());
        JSONArray jsonArray = JSONArray.fromObject(stageCenter.getMemberIdList());
        jsonArray.add(stageCenter.getLeaderId());
        String memberIds = jsonArray.toString();//任务的项目成员，包括了中心的组长和组员
        task.setMemberIds(memberIds);
        task.buildFulltext();
        List<TaskModule> taskModules = new ArrayList<>();
        for (int i = 0; i < projectStage.getModuleIdList().size(); i ++) {
            String moduleId = projectStage.getModuleIdList().get(i);//jsonArray.getString(i);
            Module module = (Module)MemoryCache.getObject(Module.class, moduleId);
            TaskModule taskModule = new TaskModule();
            taskModule.setId(IDGenerator.createTaskModuleId(moduleId, task));
            taskModule.setName(module.getName());
            taskModule.setModuleId(moduleId);
            taskModules.add(taskModule);
        }
        task.setTaskModules(taskModules);
        task.list2Content();
        dao.save(task);
        return task;
    }

    public void updateTaskLastModify(String id) {
        String sql = "update Task set lastModify=? where id=?";
        Timestamp currentTime = new Timestamp(System.currentTimeMillis());
        dao.executeNativeSql(sql, new Object[]{currentTime, id});
    }

    public boolean startEditTaskModule(String taskModuleId, String  userId, String sessionId) {
        String locker = LockManager.getResourceLocker(taskModuleId);
        if (locker != null) {
            if (!locker.equals(userId)) {
                String lockerName = MemoryCache.getUserName(locker);
                errorMessage = String.format("该任务模块正在被[%s]编辑，您只能浏览该模块的内容", lockerName);
                return false;
            }
        }
        LockManager.addLock(taskModuleId, ResourceLock.RESOURCE_TYPE_TASK_MODULE, userId, sessionId);
        return true;
    }

    public boolean endEditTaskModule(String taskModuleId, String  userId) {
        LockManager.releaseLock(taskModuleId, userId);
        return true;
    }

    public void updateTaskStatus(String id) {
        String sql = "update Task set status=(select status from CenterReport where id=?) where id=?";
        dao.executeNativeSql(sql, new Object[]{id, id});
    }

    public boolean isTaskReadonly(Task task) {
        if (task.getCanceled() == 1 || task.getStatus() == Task.STATUS_CLOSED)
            return true;
        CenterReport centerReport = (CenterReport)reportService.loadReport(CenterReport.class, task.getId());
        if (centerReport != null) {
            int status = reportService.getReportStatus(centerReport);
            //正在审阅不能修改,报告已提交，48小时内不能修改
            if (status == ReportBase.STATUS_CHECKING || status == ReportBase.STATUS_SUBMITTED)
                return true;
        }
        return false;
    }

    public void cancelTask(String id) {
        String sql = "update Task set canceled=1 where id=?";
        dao.executeNativeSql(sql, new Object[]{id});
    }

    public void cancelTaskByProject(String projectId) {
        String sql = "update Task set canceled=1 where projectId=?";
        dao.executeNativeSql(sql, new Object[]{projectId});
    }

    public void cancelTaskByProjectStage(String projectId, String stageId) {
        String sql = "update Task set canceled=1 where projectId=? and stageId=?";
        dao.executeNativeSql(sql, new Object[]{projectId, stageId});
    }

    public void startTask(String id) {
        String sql = "update Task set canceled=0 where id=?";
        dao.executeNativeSql(sql, new Object[]{id});
    }
}
