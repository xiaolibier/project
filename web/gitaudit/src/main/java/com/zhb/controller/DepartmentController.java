package com.zhb.controller;

import com.zhb.bean.Department;
import com.zhb.service.DepartmentService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by zhouhaibin on 2016/7/20.
 */
@Controller
public class DepartmentController extends ControllerBase {
    @javax.annotation.Resource(name="DepartmentService")
    private DepartmentService departmentService;

    @RequestMapping("/toDepartmentManager")//跳转到部门管理页
    public String toDepartmentManager(HttpServletRequest request) {
        return "/jsp/department-manager";
    }

    @RequestMapping("/loadDepartments")
    @ResponseBody
    public Map loadDepartments(HttpServletRequest request) {
        List list = departmentService.loadAllDepartments(true);
        Map result = new HashMap();
        result.put("list", list);
        return result;
    }

    @RequestMapping("/addDepartment")
    @ResponseBody
    public Map addDepartment(HttpServletRequest request) {
        String parentId = getStringParameter(request, "parentId");
        String name = getStringParameter(request, "name");
        Department department = new Department();
        department.setName(name);
        department.setParentId(parentId);
        departmentService.addDepartment(department);
        return successResult();
    }

    @RequestMapping("/updateDepartment")
    @ResponseBody
    public Map updateDepartment(HttpServletRequest request) {
        String id = getStringParameter(request, "id");
        String name = getStringParameter(request, "name");
        departmentService.updateDepartment(id, name);
        return successResult();
    }

    @RequestMapping("/deleteDepartment")
    @ResponseBody
    public Map deleteDepartment(HttpServletRequest request) {
        String id = getStringParameter(request, "id");
        departmentService.deleteDepartment(id);
        return successResult();
    }

}
