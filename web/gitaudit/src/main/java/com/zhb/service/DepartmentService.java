package com.zhb.service;

import com.zhb.bean.Department;
import com.zhb.core.ObjectBase;
import com.zhb.manager.MemoryCache;
import com.zhb.core.ObjectView;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Created by zhouhaibin on 2016/7/20.
 */

@Service("DepartmentService")
public class DepartmentService extends AuditServiceBase {
    private static Department departmentRoot = null;
    public void init() {
        departmentRoot = new Department();
        departmentRoot.setId(ObjectBase.EMPTY_OBJECT);
        departmentRoot.setName("所有部门");

        String sql = "from Department";
        List list = dao.loadList(sql, 0, 10000);
        Map departmentMap = MemoryCache.getObjectMap(Department.class);
        if (departmentMap == null) {
            departmentMap = new HashMap();
            MemoryCache.setObjectMap(Department.class, departmentMap);
        }
        departmentMap.clear();

        for (int i = 0; i < list.size(); i ++) {
            Department department = (Department)list.get(i);
            departmentMap.put(department.getId(), department);
        }

        for (int i = 0; i < list.size(); i ++) {
            Department department = (Department)list.get(i);
            Department parent = (Department)departmentMap.get(department.getParentId());
            if (parent == null)
                parent = departmentRoot;
            parent.addChild(department);
        }

        for (int i = 0; i < list.size(); i ++) {
            Department department = (Department)list.get(i);
            department.sortChildren();
        }
        buildDepartmentFullPathName(null, departmentRoot);
    }

    private static void buildDepartmentFullPathName(Department parent, Department department) {
        if (department != departmentRoot) {
            if (parent == departmentRoot) {
                department.setFullPathName(department.getName());
            } else {
                department.setFullPathName(parent.getFullPathName() + "/" + department.getName());
            }
        }
        for (Department child : department.getChildren()) {
            buildDepartmentFullPathName(department, child);
        }
    }

    public List loadAllDepartments(boolean includeRoot) {
        List viewList = new ArrayList();
        convertDepartmentToView(departmentRoot, viewList, 0);
        if (!includeRoot)
            viewList.remove(0);
        return viewList;
    }

    private void convertDepartmentToView(Department department, List viewList, int margin) {
        ObjectView view = new ObjectView(department);
        viewList.add(view);
        view.put("margin", margin);
        view.put("fullPathName", department.getFullPathName());
        if (department.getChildren() != null) {
            for (Department child : department.getChildren()) {
                convertDepartmentToView(child, viewList, margin + 20);
            }
        }
    }

    public void addDepartment(Department department) {
        department.setId(ObjectBase.generateID());
        dao.save(department);
        init();
    }

    public void updateDepartment(String id, String name) {
        Department department = getDepartment(id);
        department.setName(name);
        dao.update(department);
        init();
    }

    public String deleteDepartment(String id) {
        Department department = getDepartment(id);
        if (department.getChildren().size() > 0)
            return "你需要先删除该部门下面的子部门";
        dao.delete(department);
        init();
        return null;
    }

    public Department getDepartment(String id) {
        return (Department)MemoryCache.getObject(Department.class, id);
    }
}
