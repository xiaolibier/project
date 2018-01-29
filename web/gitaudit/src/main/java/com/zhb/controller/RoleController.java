package com.zhb.controller;

import com.zhb.bean.Privilege;
import com.zhb.bean.Role;
import com.zhb.manager.MemoryCache;
import com.zhb.service.RoleService;
import com.zhb.util.PageUtil;
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
public class RoleController extends ControllerBase {
    @javax.annotation.Resource(name="RoleService")
    private RoleService roleService;

    @RequestMapping("/toRoleManager")
    public String toRoleManager(HttpServletRequest request) {
        Map globalValues = new HashMap();
        List allPrivileges = MemoryCache.getObjectList(Privilege.class);
        globalValues.put("allPrivileges", allPrivileges);
        request.setAttribute(PageUtil.GLOBAL_VALUES, globalValues);
        return "/jsp/role-manager";
    }

    @RequestMapping("/loadRoles")
    @ResponseBody
    public Map loadRoles(HttpServletRequest request) {
        List list = roleService.loadRoles();
        Map result = new HashMap();
        result.put("list", list);
        return result;
    }

    @RequestMapping("/addRole")
    @ResponseBody
    public Map addRole(HttpServletRequest request) throws Exception {
        Role role = (Role)getObjectParameter(request, "role", Role.class);
        if (roleService.getRole(role.getId()) != null) {
            return errorResult("该角色编号已经存在");
        }
        roleService.addRole(role);
        return successResult();
    }

    @RequestMapping("/updateRole")
    @ResponseBody
    public Map updateRole(HttpServletRequest request) {
        Role role = (Role)getObjectParameter(request, "role", Role.class);
        roleService.updateRole(role);
        return successResult();
    }

    @RequestMapping("/deleteRole")
    @ResponseBody
    public Map deleteRole(HttpServletRequest request) {
        String id = getStringParameter(request, "id");
        roleService.deleteRole(id);
        return successResult();
    }
}
