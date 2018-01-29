package com.zhb.service;

import com.zhb.bean.Department;
import com.zhb.bean.Discovery;
import com.zhb.bean.Role;
import com.zhb.bean.User;
import com.zhb.core.ServiceBase;
import com.zhb.manager.LockManager;
import com.zhb.manager.MemoryCache;
import com.zhb.manager.PageManager;
import com.zhb.manager.ResourceLock;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * Created by zhouhaibin on 2016/11/3.
 * 测试用Service
 */
@Service("TestService")
public class TestService extends ServiceBase {
    @javax.annotation.Resource(name="UserService")
    private UserService userService;

    //for test
    public void saveDiscoveriesToDB() {
        String sql = "select count(*) from Discovery";
        int count = dao.queryNativeForInt(sql, new Object[] {});
        if (count > 0)
            return;
        List list = MemoryCache.getObjectList(Discovery.class);
        for (int i = 0; i < list.size(); i ++) {
            Discovery discovery = (Discovery)list.get(i);
            discovery.setCode(discovery.getId());
            discovery.setCreatorId("U002");
            discovery.setEditorId("U003");
            discovery.setCenterId("H001");
            discovery.setCreated(new Timestamp(System.currentTimeMillis()));
            discovery.setEditTime(new Timestamp(System.currentTimeMillis()));
            dao.save(discovery);
        }
    }

    public void saveDepartmentsToDB() {
        String sql = "select count(*) from Department";
        int count = dao.queryNativeForInt(sql, new Object[] {});
        if (count > 0)
            return;
        List list = MemoryCache.getObjectList(Department.class);
        for (int i = 0; i < list.size(); i ++) {
            Department department = (Department)list.get(i);
            dao.save(department);
        }
    }

    public void saveUsersToDB() throws Exception {
        String sql = "select count(*) from AuditUser";
        int count = dao.queryNativeForInt(sql, new Object[] {});
        if (count > 0)
            return;
        List list = MemoryCache.getObjectList(User.class);
        for (int i = 0; i < list.size(); i ++) {
            User user = (User)list.get(i);
            user.setPassword(userService.getMD5(UserService.DEFAULT_PASSWORD));
            dao.save(user);
        }
    }

    public void saveRolesToDB() throws Exception {
        String sql = "select count(*) from Role";
        int count = dao.queryNativeForInt(sql, new Object[] {});
        if (count > 0)
            return;
        List list = MemoryCache.getObjectList(Role.class);
        for (int i = 0; i < list.size(); i ++) {
            Role role = (Role)list.get(i);
            dao.save(role);
        }
    }

    public void saveObjectsToDB(Class clazz, String tableName) throws Exception {
        String sql = "select count(*) from " + tableName;
        int count = dao.queryNativeForInt(sql, new Object[] {});
        if (count > 0)
            return;
        List list = MemoryCache.getObjectList(clazz);
        for (int i = 0; i < list.size(); i ++) {
            dao.save(list.get(i));
        }
    }

    public void reloadPageConfig() {
        PageManager.reloadConfig();;
    }

    public static void main(String args[]) throws Exception {
    }

    public List loadLocks() {
        Map<String, ResourceLock> locks = LockManager.getLocks();
        List list = new ArrayList();
        for (Iterator iterator = locks.keySet().iterator(); iterator.hasNext(); ) {
            String id = (String)iterator.next();
            ResourceLock resourceLock = locks.get(id);
            list.add(resourceLock);
        }
        return list;
    }

    public void unlockResource(String resourceId) {
        LockManager.releaseByAdmin(resourceId);
    }
}
