package com.zhb.controller;

import com.zhb.bean.*;
import com.zhb.manager.MemoryCache;
import com.zhb.manager.OnlineUserManager;
import com.zhb.service.TestService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by zhouhaibin on 2016/11/3.
 * 用于测试的类
 */
@Controller
public class TestController extends ControllerBase {
    @javax.annotation.Resource(name="TestService")
    private TestService testService;

    //测试用
    @RequestMapping("/saveDiscoveryToDB")
    @ResponseBody
    public Map saveDiscoveryToDB(HttpServletRequest request) {
        testService.saveDiscoveriesToDB();
        return successResult();
    }

    @RequestMapping("/saveDepartmentsToDB")
    @ResponseBody
    public Map saveDepartmentsToDB(HttpServletRequest request) {
        testService.saveDepartmentsToDB();
        return successResult();
    }

    @RequestMapping("/saveUsersToDB")
    @ResponseBody
    public Map saveUsersToDB(HttpServletRequest request) throws Exception {
        testService.saveUsersToDB();
        return successResult();
    }

    @RequestMapping("/saveRolesToDB")
    @ResponseBody
    public Map saveRolesToDB(HttpServletRequest request) throws Exception {
        testService.saveRolesToDB();
        return successResult();
    }

    @RequestMapping("/saveCategoriesToDB")
    @ResponseBody
    public Map saveCategoriesToDB(HttpServletRequest request) throws Exception {
        testService.saveObjectsToDB(Category.class, "Category");
        return successResult();
    }

    @RequestMapping("/saveProblemToDB")
    @ResponseBody
    public Map saveProblemToDB(HttpServletRequest request) throws Exception {
        testService.saveObjectsToDB(Problem.class, "Problem");
        return successResult();
    }

    @RequestMapping("/saveReferenceToDB")
    @ResponseBody
    public Map saveReferenceToDB(HttpServletRequest request) throws Exception {
        testService.saveObjectsToDB(Reference.class, "Reference");
        return successResult();
    }

    @RequestMapping("/saveCentersToDB")
    @ResponseBody
    public Map saveCentersToDB(HttpServletRequest request) throws Exception {
        testService.saveObjectsToDB(Center.class, "Center");
        return successResult();
    }

    @RequestMapping("/saveDataTemplatesToDB")
    @ResponseBody
    public Map saveDataTemplatesToDB(HttpServletRequest request) throws Exception {
        List list = MemoryCache.getObjectList(DataTemplate.class);
        for (int i = 0; i < list.size(); i ++) {
            DataTemplate dataTemplate = (DataTemplate)list.get(i);
            String content = dataTemplate.getContent();
            int pos1 = 0;
            int pos2 = content.indexOf("\\n", pos1);
            StringBuffer sb = new StringBuffer();
            while(pos2 >= 0) {
                if (sb.length() > 0)
                    sb.append("\n");
                sb.append(content.substring(pos1, pos2));
                pos1 = pos2 + 2;
                pos2 = content.indexOf("\\n", pos1);
            }
            String content1 = sb.toString();
            System.out.println(content1);
            dataTemplate.setContent(content1);
        }
        testService.saveObjectsToDB(DataTemplate.class, "DataTemplate");
        return successResult();
    }

    @RequestMapping("/reloadPageConfig")
    @ResponseBody
    public Map reloadPageConfig(HttpServletRequest request) {
        testService.reloadPageConfig();
        return successResult();
    }

    @RequestMapping("/toLockManager")
    public String toLockManager(HttpServletRequest request) {
        return "/jsp/lock-manager";
    }

    @RequestMapping("/loadLocks")
    @ResponseBody
    public Map loadLocks(HttpServletRequest request) throws Exception {
        List list = testService.loadLocks();
        Map result = new HashMap();
        result.put("list", list);
        return result;
    }

    @RequestMapping("/loadOnlineUsers")
    @ResponseBody
    public Map loadOnlineUsers(HttpServletRequest request) throws Exception {
        List list = OnlineUserManager.getOnlineUserList();
        Map result = new HashMap();
        result.put("list", list);
        return result;
    }

    @RequestMapping("/unlockResource")
    @ResponseBody
    public Map unlockResource(HttpServletRequest request) throws Exception {
        String id = getStringParameter(request, "id");
        testService.unlockResource(id);
        return successResult();
    }

    @RequestMapping("/unlockOnlineUser")
    @ResponseBody
    public Map unlockOnlineUser(HttpServletRequest request) throws Exception {
        String id = getStringParameter(request, "id");
        OnlineUserManager.removeUser(id);
        return successResult();
    }
}
