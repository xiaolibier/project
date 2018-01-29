package com.zhb.service;

import com.zhb.bean.*;
import com.zhb.core.ObjectBase;
import com.zhb.manager.LockManager;
import com.zhb.manager.MemoryCache;
import net.sf.json.JSONObject;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by zhouhaibin on 2016/7/20.
 */

@Service("ModuleRecordService")
public class ModuleRecordService extends AuditServiceBase {
    @javax.annotation.Resource(name="ModifyRecordService")
    private ModifyRecordService modifyRecordService;

    @javax.annotation.Resource(name="TaskService")
    private TaskService taskService;

    @javax.annotation.Resource(name="ProjectService")
    private ProjectService projectService;

    @javax.annotation.Resource(name="UserService")
    private UserService userService;

    public List loadModuleRecords(String taskModuleId) {
        String sql = "from ModuleRecord where taskModuleId=? order by created";
        List list = dao.loadList(sql, 0, 10000, new Object[]{taskModuleId});
        return list;
    }

    public List loadModuleRecordsByTaskId(String taskId) {
        String sql = "from ModuleRecord where taskId=? order by moduleId, created";
        List list = dao.loadList(sql, 0, 10000, new Object[]{taskId});
        return list;
    }

    public List loadModuleRecordsByTaskIdAndModuleId(String taskId, String moduleId) {
        String sql = "from ModuleRecord where taskId=? and moduleId=?";
        List list = dao.loadList(sql, 0, 10000, new Object[]{taskId, moduleId});
        return list;
    }

    private String getMaxModuleRecordId(ModuleRecord moduleRecord) {
        String sql = "select max(id) from ModuleRecord where taskModuleId=?";
        List list = dao.loadNative(sql, new Object[]{moduleRecord.getTaskModuleId()}, null);
        if (list.size() > 0)
            return (String)list.get(0);
        return null;
    }

    private void createModuleRecordId(ModuleRecord moduleRecord) {
        String idPrefix = moduleRecord.getTaskModuleId();
        String maxCode = getMaxModuleRecordId(moduleRecord);
        int index = 1;
        if (maxCode != null) {
            index = Integer.valueOf(maxCode.substring(idPrefix.length())) + 1;
        }
        String id = idPrefix + String.format("%02d", index);
        moduleRecord.setId(id);
    }

    public void addModuleRecord(ModuleRecord moduleRecord, String userId, Task task) {
        createModuleRecordId(moduleRecord);
        dao.save(moduleRecord);
        modifyRecordService.onAddModuleRecord(moduleRecord, userId, task);
    }

    public void saveModuleRecord(ModuleRecord moduleRecord, String userId, Task task) {
        ModuleRecord oldModuleRecord = loadModuleRecord(moduleRecord.getId());
        modifyRecordService.onUpdateModuleRecord(oldModuleRecord, moduleRecord, userId, task);
        oldModuleRecord.copyForUpdate(moduleRecord);
        dao.update(oldModuleRecord);
    }

    public boolean deleteModuleRecord(ModuleRecord moduleRecord, String userId, Task task) {
        String locker = LockManager.getResourceLocker(moduleRecord.getTaskModuleId());
        if (locker != null) {
            if (!locker.equals(userId)) {
                String lockerName = MemoryCache.getUserName(locker);
                errorMessage = String.format("该任务模块正在被[%s]编辑，您不能删除该模块的内容", lockerName);
                return false;
            }
        }
        dao.delete(moduleRecord);
        modifyRecordService.onDeleteModuleRecord(moduleRecord, userId, task);
        return true;
    }

    public ModuleRecord loadModuleRecord(String id) {
        ModuleRecord moduleRecord = (ModuleRecord)loadObjectById(id, ModuleRecord.class);
        return moduleRecord;
    }

    //根据JSON字符串生成模块记录
    public ModuleRecord createModuleRecordFromJsonObject(JSONObject jsonObject) {
        ModuleRecord moduleRecord = new ModuleRecord();
        moduleRecord.setId(jsonObject.getString("id"));
        moduleRecord.setTaskId(jsonObject.getString("taskId"));
        moduleRecord.setModuleId(jsonObject.getString("moduleId"));
        moduleRecord.setTaskModuleId(jsonObject.getString("taskModuleId"));
        moduleRecord.setContent(jsonObject.getJSONObject("content").toString());
        return moduleRecord;
    }

    //创建一个模块记录，并填充其中需要继承的字段信息
    public JSONObject createModuleRecordWithInherit(String taskId, String moduleId) {
        JSONObject jsonObject = new JSONObject();
        Task task = taskService.loadTask(taskId);
        Project project = projectService.loadProject(task.getProjectId());
        Table table = getModuleTable(moduleId);
        ProjectStage projectStage = project.findStage(task.getStageId());
        StageCenter stageCenter = projectStage.findCenter(task.getCenterId());
        ProjectCenter projectCenter = project.findCenter(task.getCenterId());
        for (Field field : table.getFields()) {
            if (field.getInheritFrom() == null)
                continue;
            Object value;
            if (field.getInheritFrom().equals("centerName")) {
                value = projectCenter.getName();
            } else if (field.getInheritFrom().equals("centerPrincipal")) {
                value = projectCenter.getPrincipal();
            } else if (field.getInheritFrom().equals("centerOperateDepartment")) {
                value = projectCenter.getOperateDepartment();
            } else if (field.getInheritFrom().equals("centerResearcher")) {
                value = projectCenter.getResearcher();
            } else if (field.getInheritFrom().equals("projectTitle")) {
                value = project.getTitle();
            } else if (field.getInheritFrom().equals("projectMedicine")) {
                value = project.getMedicine();
            } else if (field.getInheritFrom().equals("projectDisease")) {
                value = project.getDisease();
            } else if (field.getInheritFrom().equals("projectPrincipal")) {
                value = project.getPrincipal();
            } else if (field.getInheritFrom().equals("projectRegisterCategory")) {
                value = project.getRegisterCategory();
            } else if (field.getInheritFrom().equals("projectAuditType")) {
                value = project.getAuditType();
            } else if (field.getInheritFrom().equals("centerLeader")) {
                String leaderId = stageCenter.getLeaderId();
                User user = userService.getUser(leaderId);
                value = user != null ? user.getName() : "";
            } else if (field.getInheritFrom().equals("centerMembers")) {
                List<String> memberIdList = stageCenter.getMemberIdList();
                value = userService.getUserNameList(memberIdList);
            } else if (field.getInheritFrom().equals("projectPurpose")) {
                value = project.getPurpose();
            } else if (field.getInheritFrom().equals("projectRange")) {
                value = project.getRange();
            } else if (field.getInheritFrom().equals("projectFoundation")) {
                value = project.getFoundation();
            } else if (field.getInheritFrom().equals("stageName")) {
                value = projectStage.getName();
            } else
                continue;
            jsonObject.put(field.getId(), value);
        }

        return jsonObject;
    }

    //当项目里配置的组长或组员信息发生变化时，更新“项目简介”模块的元数据信息
    public void updateModuleRecordAfterProjectMemberChanged(StageCenter stageCenter) {
        String moduleId = "90";//项目简介
        List list = loadModuleRecordsByTaskIdAndModuleId(stageCenter.getId(), moduleId);
        if (list.size() == 0)
            return;
        ModuleRecord moduleRecord = (ModuleRecord)list.get(0);
        JSONObject jsonObject = JSONObject.fromObject(moduleRecord.getContent());
        Table table = getModuleTable(moduleId);
        for (Field field : table.getFields()) {
            if (field.getInheritFrom() == null)
                continue;
            Object value;
            if (field.getInheritFrom().equals("centerLeader")) {
                String leaderId = stageCenter.getLeaderId();
                User user = userService.getUser(leaderId);
                value = user != null ? user.getName() : "";
                jsonObject.put(field.getId(), value);
            } else if (field.getInheritFrom().equals("centerMembers")) {
                List<String> memberIdList = stageCenter.getMemberIdList();
                value = userService.getUserNameList(memberIdList);
                jsonObject.put(field.getId(), value);
            }
        }
        moduleRecord.setContent(jsonObject.toString());
        dao.update(moduleRecord);
    }

    //当项目里配置的组长或组员信息发生变化时，更新“项目简介”模块的元数据信息
    public void updateModuleRecordAfterProjectMemberChanged(String taskId, String fromUserName, String toUserName) {
        String moduleId = Module.MODULE_ID_PROJECT_DESCRIPTION;//项目简介
        List list = loadModuleRecordsByTaskIdAndModuleId(taskId, moduleId);
        if (list.size() == 0)
            return;
        ModuleRecord moduleRecord = (ModuleRecord)list.get(0);
        JSONObject jsonObject = JSONObject.fromObject(moduleRecord.getContent());
        Table table = getModuleTable(moduleId);
        for (Field field : table.getFields()) {
            if (field.getInheritFrom() == null)
                continue;
            if (field.getInheritFrom().equals("centerLeader")) {
                String value = jsonObject.getString(field.getId());
                value = value.replace(fromUserName, toUserName);
                jsonObject.put(field.getId(), value);
            } else if (field.getInheritFrom().equals("centerMembers")) {
                String value = jsonObject.getString(field.getId());
                value = value.replace(fromUserName, toUserName);
                jsonObject.put(field.getId(), value);
            }
        }
        moduleRecord.setContent(jsonObject.toString());
        dao.update(moduleRecord);
    }

    //得到模块对应的表结构
    public Table getModuleTable(String moduleId) {
        Module module = (Module)MemoryCache.getObject(Module.class, moduleId);
        if (module.getTableId().equals(ObjectBase.EMPTY_OBJECT))
            return null;
        Table table = (Table)MemoryCache.getObject(Table.class, module.getTableId());
        return table;
    }
}
