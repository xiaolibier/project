package com.zhb.service;

import com.zhb.bean.*;
import com.zhb.core.ObjectBase;
import com.zhb.dao.Condition;
import com.zhb.dao.DaoPara;
import com.zhb.manager.MemoryCache;
import com.zhb.query.QueryResult;
import com.zhb.core.ObjectView;
import net.sf.json.JSONArray;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Created by zhouhaibin on 2016/7/20.
 */

@Service("ProjectService")
public class ProjectService extends AuditServiceBase {
    Map<String, Project> projectMap;

    @javax.annotation.Resource(name="TaskService")
    private TaskService taskService;

    @javax.annotation.Resource(name="OriginalReportService")
    private OriginalReportService originalReportService;

    @javax.annotation.Resource(name="ReportService")
    private ReportService reportService;

    @javax.annotation.Resource(name="UserService")
    private UserService userService;

    @javax.annotation.Resource(name="ModuleRecordService")
    private ModuleRecordService moduleRecordService;

    public QueryResult loadProjects(int start, int limit, String keywords, String userId) {
        DaoPara daoPara = new DaoPara();
        daoPara.setClazz(Project.class);
        daoPara.setStart(start);
        daoPara.setLimit(limit);
        Condition condition = buildKeywordsCondition(keywords, "name");
        if (condition != null)
            daoPara.addCondition(condition);
        if (!userService.isUserAdminOrBusinessAdmin(userId)) {
            daoPara.addCondition(Condition.EQUAL("leaderId", userId));
        }
        daoPara.addCondition(Condition.EQUAL("deleted", 0));
        daoPara.addOrder("id", "desc");
        int totalCount = dao.getTotalCount(daoPara);
        List list = dao.loadList(daoPara);

        for (int i = 0; i < list.size(); i ++) {
            Project project = (Project)list.get(i);
            project.content2List();
        }
        QueryResult queryResult = new QueryResult();
        queryResult.setList(list);
        queryResult.setStart(start);
        queryResult.setLimit(limit);
        queryResult.setTotalCount(totalCount);
        queryResult.refreshPage();
        return queryResult;
    }

    public void addProject(Project project) {
        dao.save(project);
        updateUserResource(project);
    }

    public void updateProject(Project project) {
        project.list2Content();
        dao.update(project);
        updateUserResource(project);
    }

    public boolean deleteProject(String id) {
        //检查项目是否有数据
        String sql = "select count(*) from Task where projectId=?";
        int count = dao.queryNativeForInt(sql, new Object[]{id});
        if (count > 0) {
            errorMessage = "该项目已经存在稽查任务数据，不能删除";
            return false;
        }

        String deletedProjectId = ObjectBase.generateID().substring(0, 14);
        sql = "update Project set deleted=1,id=? where id=?";
        dao.executeNativeSql(sql, new Object[]{deletedProjectId, id});
        return true;
    }

    public Project loadProject(String id) {
        DaoPara daoPara = buildDaoPara(new String[]{"id"}, new Object[]{id});
        daoPara.setClazz(Project.class);
        Project project = (Project) dao.loadOne(daoPara);
        if (project == null)
            return null;
        project.content2List();
        return project;
    }

    public void updateProjectStatusToRunning(String id) {
        String sql = "update Project set status=" + Project.STATUS_RUNNING + " where id=? and status=" + Project.STATUS_PLANNING;
        dao.executeNativeSql(sql, new Object[]{id});
    }

    public void updateProjectStatus(String id, int status) {
        String sql = "update Project set status=? where id=?";
        dao.executeNativeSql(sql, new Object[]{status, id});
    }

    public void closeProject(String id) {
        updateProjectStatus(id, Project.STATUS_CLOSED);
        originalReportService.closeOriginalReportByProject(id);
    }

    public void cancelProject(String id) {
        Project project = loadProject(id);
        project.setCanceled(1);
        for (ProjectStage projectStage : project.getStages()) {
            projectStage.setCanceled(1);
            for (StageCenter stageCenter : projectStage.getStageCenters()) {
                stageCenter.setCanceled(1);
            }
        }
        project.list2Content();
        dao.update(project);
        taskService.cancelTaskByProject(id);
        originalReportService.cancelOriginalReportByProject(id);
        reportService.cancelCenterReportByProject(id);
        reportService.cancelStageReportByProject(id);
    }

    public void startProject(String id) {
        String sql = "update Project set canceled=0 where id=?";
        dao.executeNativeSql(sql, new Object[]{id});
    }

    public List loadProjectStages(String projectId) {
        Project project = loadProject(projectId);
        List viewList = new ArrayList();
        User leader = (User)MemoryCache.getObject(User.class, project.getLeaderId());
        String leaderName = leader != null ? leader.getName() : "";
        Map centerMap = MemoryCache.getObjectMap(Center.class);
        for (ProjectStage projectStage : project.getStages()) {
            ObjectView view = new ObjectView(projectStage);
            view.put("centerCount", projectStage.getCenterCount());
            view.put("leaderName", leaderName);
            view.putDate("projectCreated", project.getCreated());
            String centerNames = "";
            for (StageCenter stageCenter : projectStage.getStageCenters()) {
                if (!centerNames.isEmpty())
                    centerNames += ",";
                Center center = (Center)centerMap.get(stageCenter.getCenterId());
                centerNames += center.getName();
            }
            view.put("centerNames", centerNames);
            int status = getStageStatus(project, projectStage);
            view.put("status", status);
            viewList.add(view);
        }
        return viewList;
    }

    private int getStageStatus(Project project, ProjectStage projectStage) {
        if (project.getStatus() == Project.STATUS_CLOSED)
            return ProjectStage.STATUS_CLOSED;
        if (project.getCanceled() == 1)
            return ProjectStage.STATUS_CANCELED;
        if (projectStage.getCanceled() == 1)
            return ProjectStage.STATUS_CANCELED;
        String stageReportId = project.getId() + projectStage.getId();

        //是否已经生成阶段报告？
        ReportBase report = reportService.loadReport(StageReport.class, stageReportId);
        if (report != null && report.getStatus() == ReportBase.STATUS_CLOSED)
            return ProjectStage.STATUS_CLOSED;

        //检查是否所有单中心报告，都已经提交？
        String sql = "select count(*) from CenterReport where projectId=? and stageId=? and status=" + ReportBase.STATUS_SUBMITTED;
        int count = dao.queryNativeForInt(sql, new Object[]{project.getId(), projectStage.getId()});
        if (count == projectStage.getCenterCount()) {
            //所有单中心报告，都已经提交，阶段状态变为“阶段跟踪”
            return ProjectStage.STATUS_TRACING;
        }
        //检查是否开始写任务模块记录
        sql = "select count(*) from ModuleRecord where taskId in (select id from Task where projectId=? and stageId=?)";
        count = dao.queryNativeForInt(sql, new Object[]{project.getId(), projectStage.getId()});
        if (count > 0) {
            //用户开始填写一个稽查模块后，阶段状态变为“阶段实施”
            return ProjectStage.STATUS_RUNNING;
        }
        return ProjectStage.STATUS_PLANNING;
    }

    public void cancelProjectStage(String projectId, String stageId) {
        Project project = loadProject(projectId);
        ProjectStage projectStage = project.findStage(stageId);
        for (StageCenter stageCenter : projectStage.getStageCenters()) {
            stageCenter.setCanceled(1);
        }
        projectStage.setCanceled(1);
        updateProject(project);
        taskService.cancelTaskByProjectStage(projectId, stageId);
        originalReportService.cancelOriginalReportByProjectStage(projectId, stageId);
        reportService.cancelCenterReportByProjectStage(projectId, stageId);
        String stageReportId = projectId + stageId;
        reportService.cancelStageReport(stageReportId);
    }

    public void startProjectStage(String projectId, String stageId) {
        Project project = loadProject(projectId);
        ProjectStage projectStage = project.findStage(stageId);
        projectStage.setCanceled(0);
        updateProject(project);
        String stageReportId = projectId + stageId;
        reportService.startStageReport(stageReportId);
    }

    public List loadStageCenters(String projectId, String stageId) {
        Project project = loadProject(projectId);
        ProjectStage projectStage = project.findStage(stageId);
        List viewList = new ArrayList();
        Map centerMap = MemoryCache.getObjectMap(Center.class);
        if (projectStage.getStageCenters() == null)
            return viewList;
        for (StageCenter stageCenter : projectStage.getStageCenters()) {
            Center center = (Center)centerMap.get(stageCenter.getCenterId());
            String centerCode = project.findCenterCode(stageCenter.getCenterId());
            ObjectView view = new ObjectView(stageCenter);
            User leader = (User)MemoryCache.getObject(User.class, stageCenter.getLeaderId());
            String leaderName = leader != null ? leader.getName() : "";
            view.put("name", center.getName());
            view.put("centerId", stageCenter.getCenterId());
            view.put("code", centerCode);
            view.put("stageName", projectStage.getName());
            view.put("leaderName", leaderName);
            view.putDate("projectCreated", project.getCreated());
            int status = getCenterStatus(project, projectStage, stageCenter);
            view.put("status", status);
            viewList.add(view);
        }

        //排序
        for (int i = 0; i < viewList.size(); i ++) {
            ObjectView view1 = (ObjectView)viewList.get(i);
            String centerId1 = (String)view1.get("centerId");
            Center center1 = (Center)centerMap.get(centerId1);
            for (int j = i + 1; j < viewList.size(); j ++) {
                ObjectView view2 = (ObjectView)viewList.get(j);
                String centerId2 = (String)view2.get("centerId");
                Center center2 = (Center)centerMap.get(centerId2);
                if (center1.getFirstChar().compareTo(center2.getFirstChar()) > 0) {
                    //交换位置
                    viewList.set(i, view2);
                    viewList.set(j, view1);
                    center1 = center2;
                    view1 = view2;
                }
            }
        }
        return viewList;
    }

    private int getCenterStatus(Project project, ProjectStage projectStage, StageCenter stageCenter) {
        if (project.getStatus() == Project.STATUS_CLOSED)
            return ReportBase.STATUS_CLOSED;
        if (project.getCanceled() == 1)
            return ReportBase.STATUS_CANCELED;
        if (projectStage.getCanceled() == 1)
            return ReportBase.STATUS_CANCELED;
        if (stageCenter.getCanceled() == 1)
            return ReportBase.STATUS_CANCELED;

        //是否已经生成阶段报告？
        ReportBase report = reportService.loadReport(CenterReport.class, stageCenter.getId());
        if (report != null)
            return reportService.getReportStatus(report);
        return ReportBase.STATUS_UNREADY;
    }

    public void cancelStageCenter(String projectId, String stageId, String centerId) {
        Project project = loadProject(projectId);
        ProjectStage projectStage = project.findStage(stageId);
        StageCenter stageCenter = projectStage.findCenter(centerId);
        stageCenter.setCanceled(1);
        updateProject(project);
        taskService.cancelTask(stageCenter.getId());
        originalReportService.cancelOriginalReport(stageCenter.getId());
        reportService.cancelCenterReport(stageCenter.getId());
    }

    public void startStageCenter(String projectId, String stageId, String centerId) {
        Project project = loadProject(projectId);
        ProjectStage projectStage = project.findStage(stageId);
        StageCenter stageCenter = projectStage.findCenter(centerId);
        stageCenter.setCanceled(0);
        updateProject(project);
        taskService.startTask(stageCenter.getId());
        originalReportService.startOriginalReport(stageCenter.getId());
        reportService.startCenterReport(stageCenter.getId());
    }

    public void updateUserResource(Project project) {
        String deleteSql = "delete from UserResource where resourceType=0 and resourceId=?";
        dao.executeNativeSql(deleteSql, new Object[]{project.getId()});
        String insertSql = "insert into UserResource(userId, resourceId,resourceType,status) values(?,?,0,0)";
        dao.executeNativeSql(insertSql, new Object[]{project.getLeaderId(), project.getId()});
        deleteSql = "delete from UserResource where resourceType=1 and resourceId=?";
        insertSql = "insert into UserResource(userId, resourceId,resourceType,status) values(?,?,1,0)";
        for (ProjectStage projectStage : project.getStages()) {
            for (StageCenter stageCenter : projectStage.getStageCenters()) {
                dao.executeNativeSql(deleteSql, new Object[]{stageCenter.getId()});
                dao.executeNativeSql(insertSql, new Object[]{stageCenter.getLeaderId(), stageCenter.getId()});
                for (String memberId: stageCenter.getMemberIdList()) {
                    dao.executeNativeSql(insertSql, new Object[]{memberId, stageCenter.getId()});
                }
            }
        }
    }

    public void updateUserResource(StageCenter stageCenter) {
        String deleteSql = "delete from UserResource where resourceType=1 and resourceId=?";
        dao.executeNativeSql(deleteSql, new Object[]{stageCenter.getId()});
        String insertSql = "insert into UserResource(userId, resourceId,resourceType,status) values(?,?,1,0)";
        dao.executeNativeSql(insertSql, new Object[]{stageCenter.getLeaderId(), stageCenter.getId()});
        for (String memberId: stageCenter.getMemberIdList()) {
            dao.executeNativeSql(insertSql, new Object[]{memberId, stageCenter.getId()});
        }
    }

    public boolean saveProject(Project project) {
        Project oldProject = loadProject(project.getId());
        ProjectCompareResult projectCompareResult = new ProjectCompareResult();
        projectCompareResult.compareProject(oldProject, project);

        if (!canDeleteAnything(project, projectCompareResult))
            return false;

        if (!canChangeMember(projectCompareResult))
            return false;

        updateProject(project);

        updateOtherObjectAfterProjectChanged(project, projectCompareResult);
        return true;
    }

    //是否可以修改成员信息
    private boolean canChangeMember(ProjectCompareResult projectCompareResult) {
        for (Iterator iterator = projectCompareResult.getStageCenterMemberChanged().keySet().iterator(); iterator.hasNext();) {
            String stageId = (String) iterator.next();
            List<StageCenter> centerChanged = projectCompareResult.getStageCenterMemberChanged().get(stageId);
            for (StageCenter stageCenter : centerChanged) {
                CenterReport centerReport = (CenterReport)reportService.loadReport(CenterReport.class, stageCenter.getId());
                if (centerReport != null && centerReport.getStatus() == ReportBase.STATUS_CLOSED) {
                    errorMessage = "报告已关闭，不能修改成员信息";
                    return false;
                }
            }
        }
        return true;
    }

    //当项目内容改变时，其他相应的对象也同步做更新
    private void updateOtherObjectAfterProjectChanged(Project project, ProjectCompareResult projectCompareResult) {
        if (projectCompareResult.isProjectNameChanged()) {
            updateOtherObjectAfterProjectNameChanged(project);
        }

        //如果有中心被删除，则删除对应的稽查任务
        for (Iterator iterator = projectCompareResult.getStageCenterDeleted().keySet().iterator(); iterator.hasNext();) {
            String stageId = (String)iterator.next();
            List<StageCenter> centerDeleted = projectCompareResult.getStageCenterDeleted().get(stageId);
            for (StageCenter stageCenter : centerDeleted) {
                String taskId = stageCenter.getId();
                String sql = "delete from Task where id=?";
                dao.executeNativeSql(sql,  new Object[]{taskId});
            }
        }

        //如果有阶段被删除，则删除对应的稽查任务
        for (ProjectStage projectStage : projectCompareResult.getProjectStageDeleted()) {
            String sql = "delete from Task where projectId=? and stageId=?";
            dao.executeNativeSql(sql,  new Object[]{project.getId(), projectStage.getId()});
        }

        //如果有中心的成员被修改，则更新对应的稽查任务，单中心报告，原始版稽查记录表，阶段报告，UserResource和稽查模块中的项目简介模块
        for (Iterator iterator = projectCompareResult.getStageCenterMemberChanged().keySet().iterator(); iterator.hasNext();) {
            String stageId = (String)iterator.next();
            List<StageCenter> centerChanged = projectCompareResult.getStageCenterMemberChanged().get(stageId);
            for (StageCenter stageCenter : centerChanged) {
                JSONArray jsonArray = JSONArray.fromObject(stageCenter.getMemberIdList());
                jsonArray.add(stageCenter.getLeaderId());
                String memberIds = jsonArray.toString();
                String taskId = stageCenter.getId();
                Object[] parameters = new Object[]{memberIds, taskId};
                String sql = "update Task set memberIds=? where id=?";
                dao.executeNativeSql(sql, parameters);

                sql = "update CenterReport set memberIds=? where id=?";
                dao.executeNativeSql(sql, parameters);

                sql = "update OriginalReport set memberIds=? where id=?";
                dao.executeNativeSql(sql, parameters);

                updateUserResource(stageCenter);

                moduleRecordService.updateModuleRecordAfterProjectMemberChanged(stageCenter);
            }
        }
    }

    //当项目名称改变时，需要同步更新其他表的字段
    private void updateOtherObjectAfterProjectNameChanged(Project project) {
        Object[] parameters = new Object[]{project.getName(), project.getId()};
        String sql = "update Task set projectName=? where projectId=?";
        dao.executeNativeSql(sql, parameters);
        sql = "update CenterReport set projectName=? where projectId=?";
        dao.executeNativeSql(sql, parameters);
        sql = "update OriginalReport set projectName=? where projectId=?";
        dao.executeNativeSql(sql, parameters);
        sql = "update StageReport set projectName=? where projectId=?";
        dao.executeNativeSql(sql, parameters);
    }

    //检查是否可以在修改项目的时候，删除中心，模块或阶段
    private boolean canDeleteAnything(Project project, ProjectCompareResult projectCompareResult) {
        for (Iterator iterator = projectCompareResult.getStageCenterDeleted().keySet().iterator(); iterator.hasNext();) {
            String stageId = (String)iterator.next();
            List<StageCenter> centerDeleted = projectCompareResult.getStageCenterDeleted().get(stageId);
            for (StageCenter stageCenter : centerDeleted) {
                //检查是否已经有中心相关的数据
                if (centerExistAnyData(stageCenter.getId())) {
                    errorMessage = String.format("不能删除[%s]中心，该中心已存在数据", stageCenter.getName());
                    return false;
                }
            }
        }

        for (Iterator iterator = projectCompareResult.getStageModuleIdDeleted().keySet().iterator(); iterator.hasNext();) {
            String stageId = (String)iterator.next();
            List<String> moduleIdDeleted = projectCompareResult.getStageModuleIdDeleted().get(stageId);
            for (String moduleId : moduleIdDeleted) {
                //检查是否已经有模块相关的数据
                if (moduleExistAnyData(project.getId(), stageId, moduleId)) {
                    Module module = (Module) MemoryCache.getObject(Module.class, moduleId);
                    errorMessage = String.format("不能删除[%s]模块，该模块已存在数据", module.getName());
                    return false;
                }
            }
        }

        for (ProjectStage projectStage : projectCompareResult.getProjectStageDeleted()) {
            //检查是否已经有阶段相关的数据
            if (stageExistAnyData(project.getId(), projectStage.getId())) {
                errorMessage = String.format("不能删除[%s]阶段，该阶段已存在数据", projectStage.getName());
                return false;
            }
        }
        return true;
    }

    //检查阶段是否已经存在数据
    private boolean stageExistAnyData(String projectId, String stageId) {
        String sql = "select count(*) from ModuleRecord where taskId in(select id from Task where projectId=? and stageId=?)";
        int count = dao.queryNativeForInt(sql, new Object[]{projectId, stageId});
        if (count > 0)
            return true;

        sql = "select count(*) from Discovery where id in(select id from Task where projectId=? and stageId=?)";
        count = dao.queryNativeForInt(sql, new Object[]{projectId, stageId});
        if (count > 0)
            return true;
        return false;
    }

    //检查中心是否已经存在数据
    private boolean centerExistAnyData(String stageCenterId) {
        String taskId = stageCenterId;
        String sql = "select count(*) from ModuleRecord where taskId=?";
        int count = dao.queryNativeForInt(sql, new Object[]{taskId});
        if (count > 0)
            return true;

        sql = "select count(*) from Discovery where taskId=?";
        count = dao.queryNativeForInt(sql, new Object[]{taskId});
        if (count > 0)
            return true;

        return false;
    }

    //检查模块是否已经存在任何数据
    private boolean moduleExistAnyData(String projectId, String stageId, String moduleId) {
        String sql = "select * from ModuleRecord where taskId in(select id from Task where projectId=? and stageId=?) and moduleId=?";
        int count = dao.queryNativeForInt(sql, new Object[]{projectId, stageId, moduleId});
        if (count > 0)
            return true;

        sql = "select * from Discovery where taskId in(select id from Task where projectId=? and stageId=?) and categoryId in(select id from Category where moduleId=?)";
        count = dao.queryNativeForInt(sql, new Object[]{projectId, stageId, moduleId});
        if (count > 0)
            return true;

        return false;
    }

    public boolean verifyProject(Project project) throws Exception {
        if (!super.verifyObject(project))
            return false;

        for (ProjectStage projectStage : project.getStages()) {
            for (StageCenter stageCenter : projectStage.getStageCenters()) {
                if (ObjectBase.isEmpty(stageCenter.getLeaderId())) {
                    Center center = (Center)MemoryCache.getObject(Center.class, stageCenter.getCenterId());
                    errorMessage = String.format("[%s]中心没有选择组长", center.getName());
                    return false;
                }
//                if (stageCenter.getMemberIdList().size() == 0) {
//                    Center center = (Center)MemoryCache.getObject(Center.class, stageCenter.getCenterId());
//                    errorMessage = String.format("[%s]中心没有选择组员", center.getName());
//                    return false;
//                }
//                for (String memberId : stageCenter.getMemberIdList()) {
//                    if (memberId.equals(stageCenter.getLeaderId())) {
//                        Center center = (Center)MemoryCache.getObject(Center.class, stageCenter.getCenterId());
//                        errorMessage = String.format("[%s]中心组员和组长重复", center.getName());
//                        return false;
//                    }
//                }
            }
            if (projectStage.getStageCenters().size() == 0) {
                Stage stage = (Stage)MemoryCache.getObject(Stage.class, projectStage.getId());
                errorMessage = String.format("[%s]阶段没有选择中心", stage.getName());
                return false;
            }

            if (projectStage.getModuleIdList().size() == 0) {
                Stage stage = (Stage)MemoryCache.getObject(Center.class, projectStage.getId());
                errorMessage = String.format("[%s]阶段没有选择模块", stage.getName());
                return false;
            }
        }
        return true;
    }
}

