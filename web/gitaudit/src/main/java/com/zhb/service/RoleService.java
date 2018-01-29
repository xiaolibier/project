package com.zhb.service;

import com.zhb.bean.Role;
import com.zhb.manager.MemoryCache;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by zhouhaibin on 2016/7/20.
 */

@Service("RoleService")
public class RoleService extends AuditServiceBase {
    public List loadRoles() {
        List list = MemoryCache.getObjectList(Role.class);
        return list;
    }

    public void addRole(Role role) throws Exception {
        dao.save(role);
        MemoryCache.addObject(role);
        init();
    }

    public void updateRole(Role role) {
        Role roleInMemory = getRole(role.getId());
        roleInMemory.copyForUpdate(role);
        dao.update(roleInMemory);
        init();
    }

    public void deleteRole(String id) {
        Role role = getRole(id);
        dao.delete(role);
        MemoryCache.deleteObject(Role.class, id);
    }

    public Role getRole(String id) {
        return (Role)MemoryCache.getObject(Role.class, id);
    }

    public void init() {
        String sql = "from Role";
        List list = dao.loadList(sql, 0, 10000);
        Map map = MemoryCache.getObjectMap(Role.class);
        if (map == null) {
            map = new HashMap();
            MemoryCache.setObjectMap(Role.class, map);
        }
        for (int i = 0; i < list.size(); i ++) {
            Role role = (Role)list.get(i);
            map.put(role.getId(), role);
        }
    }
}
