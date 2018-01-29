package com.zhb.controller;

import com.zhb.bean.Role;
import com.zhb.bean.User;
import com.zhb.manager.LockManager;
import com.zhb.manager.MemoryCache;
import com.zhb.manager.OnlineUser;
import com.zhb.manager.OnlineUserManager;
import com.zhb.query.QueryResult;
import com.zhb.service.DepartmentService;
import com.zhb.service.ProjectService;
import com.zhb.service.UserService;
import com.zhb.util.PageUtil;
import com.zhb.core.ObjectView;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by zhouhaibin on 2016/7/20.
 */
@Controller
public class UserController extends ControllerBase {
    @javax.annotation.Resource(name="UserService")
    private UserService userService;

    @javax.annotation.Resource(name="DepartmentService")
    private DepartmentService departmentService;

    @javax.annotation.Resource(name="ProjectService")
    private ProjectService projectService;

    @RequestMapping("/toUserManager")//跳转到用户管理页面
    public String toUserManager(HttpServletRequest request) {
        Map globalValues = new HashMap();
        List allDepartments = departmentService.loadAllDepartments(false);
        globalValues.put("allDepartments", allDepartments);
        List allUsers = userService.loadAllUsers();
        globalValues.put("allUsers", allUsers);
        List allRoles = MemoryCache.getObjectList(Role.class);
        List roleViewList = new ArrayList();
        for (int i = 0; i < allRoles.size(); i ++) {
            Role role = (Role)allRoles.get(i);
            ObjectView view = new ObjectView(role);
            roleViewList.add(view);
        }
        globalValues.put("allRoles", roleViewList);
        request.setAttribute(PageUtil.GLOBAL_VALUES, globalValues);
        return "/jsp/user-manager";
    }

    @RequestMapping("/login")//跳转到登陆页面
    public String login(HttpServletRequest request) {
        return "/jsp/login";
    }

    @RequestMapping("/toModifyPassword")//跳转到修改密码页面
    public String toModifyPassword(HttpServletRequest request) {
        return "/jsp/modify-password";
    }

    @RequestMapping("/logout")//注销
    public String logout(HttpServletRequest request) {
        String userId = loadUserId(request);
        request.getSession().removeAttribute(USER_ID);
        request.getSession().removeAttribute(USER_NAME);
        request.getSession().removeAttribute(USER_PRIVILEGES);
        OnlineUserManager.removeUser(userId);
        LockManager.releaseUserAllLocks(userId);
        return "/jsp/login";
    }

    @RequestMapping("/loadUsers")
    @ResponseBody
    public Map loadUsers(HttpServletRequest request) {
        int start = getIntParameter(request, "start");
        int limit = getIntParameter(request, "limit");
        String keywords = getStringParameter(request, "keywords");
        QueryResult queryResult = userService.loadUsers(start, limit, keywords);
        Map result = new HashMap();
        result.put("result", queryResult);
        return result;
    }

    @RequestMapping("/addUser")
    @ResponseBody
    public Map addUser(HttpServletRequest request) throws Exception {
        User user = (User)getObjectParameter(request, "user", User.class);
        if (userService.getUser(user.getId()) != null) {
            return errorResult("该用户编号已经存在");
        }
        userService.addUser(user);
        String successMessage = String.format("用户[%s]已添加成功，系统默认密码[%s]", user.getName(), UserService.DEFAULT_PASSWORD);
        Map result = new HashMap();
        result.put("successMessage", successMessage);
        return result;
    }

    @RequestMapping("/updateUser")
    @ResponseBody
    public Map updateUser(HttpServletRequest request) {
        User user = (User)getObjectParameter(request, "user", User.class);
        userService.updateUser(user);
        return successResult();
    }

    @RequestMapping("/deleteUser")
    @ResponseBody
    public Map deleteUser(HttpServletRequest request) {
        String id = getStringParameter(request, "id");
        userService.deleteUser(id);
        return successResult();
    }

    @RequestMapping("/stopUser")//挂起用户
    @ResponseBody
    public Map stopUser(HttpServletRequest request) {
        String id = getStringParameter(request, "id");
        userService.stopUser(id);
        return successResult();
    }

    @RequestMapping("/startUser")//取消挂起用户
    @ResponseBody
    public Map startUser(HttpServletRequest request) {
        String id = getStringParameter(request, "id");
        userService.startUser(id);
        return successResult();
    }

    @RequestMapping("/loadUser")
    @ResponseBody
    public Map loadUser(HttpServletRequest request) {
        String id = ServletRequestUtils.getStringParameter(request, "id", null);
        User user = userService.getUser(id);
        Map result = new HashMap();
        result.put("item", user);
        return result;
    }

    @RequestMapping("/userLogin")//用户登陆
    @ResponseBody
    public Map userLogin(HttpServletRequest request) {
        String userId = getStringParameter(request, "userId");
        String pw = getStringParameter(request, "pw");
        String token = getStringParameter(request, "token");
        String message = userService.userLogin(userId, pw);
        Map result = new HashMap();
        if (message != null) {
            result.put("loginMessage", message);
            result.put("result", false);
            return result;
        }
        String ip = getIpAddr(request);
        OnlineUser existingUser = OnlineUserManager.findUser(userId);
        if (existingUser != null) {//已经有该用户在在线用户列表里了
            if (existingUser.getIp() != null && !existingUser.getIp().equals(ip)) {//已有用户IP和此用户IP不一致
                if (token == null || !token.equals(existingUser.getToken())) {
                    result.put("loginMessage", String.format("用户已经在其他电脑登陆[%s]", existingUser.getIp()));
                    result.put("result", false);
                    return result;
                }
            }
        }
        //login success
        request.getSession().setAttribute(USER_ID, userId);
        User user = userService.getUser(userId);
        request.getSession().setAttribute(USER_NAME, user.getName());
        request.getSession().setAttribute(USER_PRIVILEGES, user.getUserPrivileges());
        if (existingUser == null)
            OnlineUserManager.addOnlineUser(userId, user.getName(), ip, request.getSession().getId(), token);
        result.put("result", true);
        return result;
    }

    @RequestMapping("/loadUserResources")//加载用户所包含的资源内容，其实就是用户参与的项目和中心信息
    @ResponseBody
    public Map loadUserResources(HttpServletRequest request) {
        String id = getStringParameter(request, "id");
        List projects = userService.loadUserProjects(id);
        List centers = userService.loadUserCenters(id);
        Map result = new HashMap();
        result.put("projects", projects);
        result.put("centers", centers);
        return result;
    }

    @RequestMapping("/handoverProject")//移交项目
    @ResponseBody
    public Map handoverProject(HttpServletRequest request) {
        String projectId = getStringParameter(request, "projectId");
        String fromUserId = getStringParameter(request, "fromUserId");
        String toUserId = getStringParameter(request, "toUserId");
        userService.handoverProject(projectId, fromUserId, toUserId);
        return successResult();
    }

    @RequestMapping("/handoverProjectCenter")//移交中心
    @ResponseBody
    public Map handoverProjectCenter(HttpServletRequest request) {
        String projectId = getStringParameter(request, "projectId");
        String stageId = getStringParameter(request, "stageId");
        String taskId = getStringParameter(request, "taskId");
        String fromUserId = getStringParameter(request, "fromUserId");
        String toUserId = getStringParameter(request, "toUserId");
        userService.handoverProjectCenter(projectId, stageId, taskId, fromUserId, toUserId);
        return successResult();
    }

    @RequestMapping("/modifyPassword")//修改密码
    @ResponseBody
    public Map modifyPassword(HttpServletRequest request) throws Exception {
        String oldPw = getStringParameter(request, "oldPw");
        String newPw = getStringParameter(request, "newPw");
        String newPw2 = getStringParameter(request, "newPw2");
        String userId = loadUserId(request);
        String errorMessage = userService.modifyPassword(userId, oldPw, newPw, newPw2);
        if (errorMessage != null)
            return errorResult(errorMessage);
        return successResult();
    }

    @RequestMapping("/resetPassword")//重置密码
    @ResponseBody
    public Map resetPassword(HttpServletRequest request) throws Exception {
        String id = getStringParameter(request, "id");
        String userId = loadUserId(request);
        userService.resetPassword(id);
        return successResult();
    }
}
