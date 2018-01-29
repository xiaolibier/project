package com.zhb.service;

import com.zhb.bean.*;
import com.zhb.dao.Condition;
import com.zhb.dao.DaoPara;
import com.zhb.manager.MemoryCache;
import com.zhb.query.QueryResult;
import com.zhb.core.ObjectView;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.util.*;

/**
 * Created by zhouhaibin on 2016/7/20.
 */

@Service("UserService")
public class UserService extends AuditServiceBase {
    public static final String DEFAULT_PASSWORD = "123456";

    @javax.annotation.Resource(name="ProjectService")
    private ProjectService projectService;

    @javax.annotation.Resource(name="TaskService")
    private TaskService taskService;

    @javax.annotation.Resource(name="ModuleRecordService")
    private ModuleRecordService moduleRecordService;

    public QueryResult loadUsers(int start, int limit, String keywords) {
        DaoPara daoPara = new DaoPara();
        daoPara.setClazz(User.class);
        daoPara.setStart(start);
        daoPara.setLimit(limit);
        Condition condition = buildKeywordsCondition(keywords, "name");
        if (condition != null)
            daoPara.addCondition(condition);
        daoPara.addOrder("id");
        int totalCount = dao.getTotalCount(daoPara);
        List list = dao.loadList(daoPara);

        List viewList = new ArrayList();
        for (int i = 0; i < list.size(); i ++) {
            User user = (User)list.get(i);
            ObjectView view = convertUser(user);
            viewList.add(view);
        }

        QueryResult queryResult = new QueryResult();
        queryResult.setList(viewList);
        queryResult.setStart(start);
        queryResult.setLimit(limit);
        queryResult.setTotalCount(totalCount);
        queryResult.refreshPage();
        return queryResult;
    }

    private ObjectView convertUser(User user) {
        ObjectView view = new ObjectView(user);
        view.put("status", user.getStatus());
        view.put("departmentId", user.getDepartmentId());
        view.put("contact", user.getContact());
        String sql = "select count(*) from UserResource where userId=? and resourceType=0 and status=0";
        int projectCount = dao.queryNativeForInt(sql, new Object[]{user.getId()});
        view.put("projectCount", projectCount);
        sql = "select count(*) from UserResource where userId=? and resourceType=1 and status=0";
        int centerCount = dao.queryNativeForInt(sql, new Object[]{user.getId()});
        view.put("centerCount", centerCount);
        view.put("roleIds", user.getRoleIds());
        return view;
    }

    public void addUser(User user) throws Exception {
        String password = getMD5(DEFAULT_PASSWORD);
        user.setPassword(password);
        dao.save(user);
        MemoryCache.addObject(user);
        init();
    }

    public void updateUser(User user) {
        User userInMemory = getUser(user.getId());
        userInMemory.copyForUpdate(user);
        dao.update(userInMemory);
        init();
    }

    public void deleteUser(String id) {
        User user = getUser(id);
        dao.delete(user);
        MemoryCache.deleteObject(User.class, id);
    }

    public User getUser(String id) {
        return (User)MemoryCache.getObject(User.class, id);
    }

    public void init() {
        String sql = "from User";
        List list = dao.loadList(sql, 0, 10000);
        Map map = MemoryCache.getObjectMap(User.class);
        if (map == null) {
            map = new HashMap();
            MemoryCache.setObjectMap(User.class, map);
        }
        for (int i = 0; i < list.size(); i ++) {
            User user = (User)list.get(i);
            map.put(user.getId(), user);
        }
        MemoryCache.userMap = MemoryCache.getObjectMap(User.class);
    }

    public boolean isUserAdmin(String userId) {
        User user = getUser(userId);
        if (userHasPrivilege(user, Privilege.PRIVILEGE_ID_SYSTEM_ADMIN))
            return true;
        return false;
    }

    public boolean isUserPrinter(String userId) {
        User user = getUser(userId);
        if (userHasPrivilege(user, Privilege.PRIVILEGE_ID_PRINT))
            return true;
        return false;
    }

    //用户是否是管理员或打印员
    public boolean isUserAdminOrPrinter(String userId) {
        User user = getUser(userId);
        if (userHasPrivilege(user, Privilege.PRIVILEGE_ID_SYSTEM_ADMIN))
            return true;
//        if (userHasPrivilege(user, Privilege.PRIVILEGE_ID_PRINT))
//            return true;
        return false;
    }

    //用户是否是系统管理员或业务管理员
    public boolean isUserAdminOrBusinessAdmin(String userId) {
        User user = getUser(userId);
        if (user.getUserPrivileges() == null) {
            Map privilegeIdMap = getUserPrivilegeIdMap(userId);
            user.setUserPrivileges(privilegeIdMap);
        }
        if (userHasPrivilege(user, Privilege.PRIVILEGE_ID_SYSTEM_ADMIN))
            return true;
        if (userHasPrivilege(user, Privilege.PRIVILEGE_ID_BUSINESS_ADMIN))
            return true;
        return false;
    }

    public boolean userHasPrivilege(User user, String privilegeId) {
        if (user.getUserPrivileges() == null) {
            Map privilegeIdMap = getUserPrivilegeIdMap(user.getId());
            user.setUserPrivileges(privilegeIdMap);
        }
        return user.hasPrivilege(privilegeId);
    }

    public Map getUserPrivilegeIdMap(String userId) {
        User user = (User)MemoryCache.getObject(User.class, userId);
        Map roleMap = MemoryCache.getObjectMap(Role.class);
        String[] roleIdList = user.getRoleIds().split(",");
        Map privilegeMap = new HashMap();
        for (String roleId : roleIdList) {
            if (roleId.isEmpty())
                continue;
            Role role = (Role)roleMap.get(roleId);
            String [] privilegeIdList = role.getPrivilegeIds().split(",");
            for (String id : privilegeIdList) {
                privilegeMap.put(id, 1);
            }
        }
        return privilegeMap;
    }

    public String userLogin(String userId, String pw) {
        User user = (User)MemoryCache.getObject(User.class, userId);
        if (user == null)
            return "用户不存在";
        //TODO check password and status
        if (!user.getPassword().equals(pw)) {
            return "您输入的用户名和密码不匹配";
        }
        if (user.getStatus() == User.STATUS_HANGUP) {
            return "该用户已被停用";
        }
        Map privilegeIdMap = getUserPrivilegeIdMap(userId);
        user.setUserPrivileges(privilegeIdMap);
        return null;
    }

    public String getUserNameList(List<String> userIdList) {
        Map userMap = MemoryCache.getObjectMap(User.class);
        String userNameList = "";
        for (String id : userIdList) {
            User user = (User)userMap.get(id);
            if (user == null)
                continue;
            if (!userNameList.isEmpty()) {
                userNameList += ",";
            }
            userNameList += user.getName();
        }
        return userNameList;
    }

    public static String getMD5(String source) throws Exception {
        byte []bytesOfMessage = source.getBytes("UTF-8");
        MessageDigest md = MessageDigest.getInstance("MD5");
        byte[] thedigest = md.digest(bytesOfMessage);
        StringBuffer sb = new StringBuffer();
        for (byte b : thedigest) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }

    public void updateUserStatus(String id, int status) {
        User user = getUser(id);
        user.setStatus(status);
        updateUser(user);
    }

    public void stopUser(String id) {
        updateUserStatus(id, User.STATUS_HANGUP);
    }

    public void startUser(String id) {
        updateUserStatus(id, User.STATUS_NORMAL);
    }

    public List loadUserProjects(String userId) {
        String sql = "select resourceId, status, handoverTo from UserResource where userId=? and resourceType=0";
        List list = dao.loadNative(sql, new Object[]{userId}, null);
        List viewList = new ArrayList();
        for (int i = 0; i < list.size(); i ++) {
            Object[] row = (Object[])list.get(i);
            String projectId = (String)row[0];
            int status = (Integer)row[1];
            String handoverTo = (String)row[2];
            Project project = projectService.loadProject(projectId);
            ObjectView view = new ObjectView(project);
            view.put("created", formatDate(project.getCreated()));
            view.put("status", project.getStatus());
            view.put("inChargeStatus", status);
            view.put("handoverTo", handoverTo);
            viewList.add(view);
        }
        return viewList;
    }

    public List loadUserCenters(String userId) {
        String sql = "select resourceId, status, handoverTo from UserResource where userId=? and resourceType=1";
        List list = dao.loadNative(sql, new Object[]{userId}, null);
        List viewList = new ArrayList();
        for (int i = 0; i < list.size(); i ++) {
            Object[] row = (Object[])list.get(i);
            String taskId = (String)row[0];
            int status = (Integer)row[1];
            String handoverTo = (String)row[2];
            Task task = taskService.loadTask(taskId);
            ObjectView view = new ObjectView(task);
            view.put("projectCreated", formatDate(task.getProjectCreated()));
            view.put("projectId", task.getProjectId());
            view.put("stageId", task.getStageId());
            view.put("centerName", task.getCenterName());
            view.put("projectName", task.getProjectName());
            view.put("stageName", task.getStageName());
            view.put("inChargeStatus", status);
            view.put("handoverTo", handoverTo);
            viewList.add(view);
        }
        return viewList;
    }

    public void handoverProject(String projectId, String fromUserId, String toUserId) {
        String sql = "update Project set leaderId=? where id=?";
        dao.executeNativeSql(sql, new Object[]{toUserId, projectId});

        sql = "update CenterReport set leaderId=? where projectId=?";
        dao.executeNativeSql(sql, new Object[]{toUserId, projectId});

        sql = "update StageReport set leaderId=? where projectId=?";
        dao.executeNativeSql(sql, new Object[]{toUserId, projectId});

        sql = "update OriginalReport set leaderId=? where projectId=?";
        dao.executeNativeSql(sql, new Object[]{toUserId, projectId});

        sql = "update Task set leaderId=? where projectId=?";
        dao.executeNativeSql(sql, new Object[]{toUserId, projectId});

        sql = "update UserResource set status=1,handoverTo=? where userId=? and resourceId=?";
        dao.executeNativeSql(sql, new Object[]{toUserId, fromUserId, projectId});

        sql = "select count(*) from UserResource where userId=? and resourceId=?";
        int count = dao.queryNativeForInt(sql, new Object[]{toUserId, projectId});
        if (count > 0) {
            sql = "update UserResource set status=0,handoverTo='-' where userId=? and resourceId=?";
            dao.executeNativeSql(sql, new Object[]{toUserId, projectId});
        } else {
            sql = "insert into UserResource(userId, resourceId, resourceType,status) values(?,?,0,0)";
            dao.executeNativeSql(sql, new Object[]{toUserId, projectId});
        }
    }

    protected String loadStringFromDB(String sql, Object[] parameters) {
        List list = dao.loadNative(sql, parameters, null);
        if (list.size() == 0)
            return null;
        return (String)list.get(0);
    }

    public void handoverProjectCenter(String projectId, String stageId, String taskId, String fromUserId, String toUserId) {
        Project project = projectService.loadProject(projectId);
        ProjectStage projectStage = project.findStage(stageId);
        StageCenter stageCenter = projectStage.findCenterByStageCenterId(taskId);
        for (int i = 0; i < stageCenter.getMemberIdList().size(); i ++) {
            String memberId = stageCenter.getMemberIdList().get(i);
            if (memberId.equals(fromUserId))
                stageCenter.getMemberIdList().set(i, toUserId);
        }
        if (stageCenter.getLeaderId().equals(fromUserId)) {
            stageCenter.setLeaderId(toUserId);
        }
        projectService.updateProject(project);

        String sql = "select memberIds from Task where id=?";
        String value = loadStringFromDB(sql, new Object[]{taskId});
        if (value != null) {
            value = value.replace(fromUserId, toUserId);
            sql = "update Task set memberIds=? where id=?";
            dao.executeNativeSql(sql, new Object[]{value, taskId});
        }

        sql = "select memberIds from CenterReport where id=?";
        value = loadStringFromDB(sql, new Object[]{taskId});
        if (value != null) {
            value = value.replace(fromUserId, toUserId);
            sql = "update CenterReport set memberIds=? where id=?";
            dao.executeNativeSql(sql, new Object[]{value, taskId});
        }

        sql = "select memberIds from OriginalReport where id=?";
        value = loadStringFromDB(sql, new Object[]{taskId});
        if (value != null) {
            value = value.replace(fromUserId, toUserId);
            sql = "update OriginalReport set memberIds=? where id=?";
            dao.executeNativeSql(sql, new Object[]{value, taskId});
        }

        sql = "update UserResource set status=1,handoverTo=? where userId=? and resourceId=?";
        dao.executeNativeSql(sql, new Object[]{toUserId, fromUserId, taskId});

        sql = "select count(*) from UserResource where userId=? and resourceId=?";
        int count = dao.queryNativeForInt(sql, new Object[]{toUserId, taskId});
        if (count > 0) {
            sql = "update UserResource set status=0,handoverTo='-' where userId=? and resourceId=?";
            dao.executeNativeSql(sql, new Object[]{toUserId, taskId});
        } else {
            sql = "insert into UserResource(userId, resourceId, resourceType,status) values(?,?,1,0)";
            dao.executeNativeSql(sql, new Object[]{toUserId, taskId});
        }

        User fromUser = userService.getUser(fromUserId);
        User toUser = userService.getUser(toUserId);
        moduleRecordService.updateModuleRecordAfterProjectMemberChanged(taskId, fromUser.getName(), toUser.getName());
    }

    public String modifyPassword(String userId, String oldPw, String newPw, String newPw2) throws Exception {
        User user = getUser(userId);
        String oldMd5 = getMD5(oldPw);
        if (!oldMd5.equals(user.getPassword()))
            return "旧密码不对，请重新输入";
        if (isValueEmpty(newPw) || isValueEmpty(newPw2))
            return "新密码不能为空";
        if (!newPw.equals(newPw2))
            return "您输入的密码不一致，请重新输入";
        String newMD5 = getMD5(newPw);
        user.setPassword(newMD5);
        dao.update(user);
        init();
        return null;
    }

    public static boolean passwordIsDefault(String userId) throws Exception {
        User user = (User)MemoryCache.getObject(User.class, userId);
        if (user.getPassword().equals(getMD5(DEFAULT_PASSWORD)))
            return true;
        return false;
    }

    public Map getAllUserMap() {
        Map allUserMap = new HashMap();
        Map userMap = MemoryCache.getObjectMap(User.class);
        for (Iterator iterator = userMap.keySet().iterator(); iterator.hasNext();) {
            String id = (String)iterator.next();
            User user = (User)userMap.get(id);
            allUserMap.put(id, user.getName());
        }
        return allUserMap;
    }

    public static List loadAllUsers() {
        List list = MemoryCache.getObjectList(User.class);
        List viewList = new ArrayList();
        for (int i = 0; i < list.size(); i ++) {
            User user = (User)list.get(i);
            ObjectView view = new ObjectView(user);
            view.put("departmentId", user.getDepartmentId());
            viewList.add(view);
        }
        return viewList;
    }

    public void resetPassword(String id) throws Exception {
        User user = getUser(id);
        String password = getMD5(DEFAULT_PASSWORD);
        user.setPassword(password);
        updateUser(user);
    }
}
