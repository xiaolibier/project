package com.zhb.util;

import com.zhb.bean.*;
import com.zhb.controller.ControllerBase;
import com.zhb.manager.MemoryCache;
import com.zhb.manager.PageManager;
import com.zhb.service.UserService;
import net.sf.json.JSONObject;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * Created by zhouhaibin on 2016/9/21.
 */
public class PageUtil {
    public static final String GLOBAL_VALUES = "GLOBAL_VALUES";
    public static boolean debugMode = false;
    static {
        String debug = System.getenv().get("AUDIT_DEBUG_MODE");
        if (debug != null && debug.equals("true")) {
            debugMode = true;
        }
    }

    public static String buildAttributes(HttpServletRequest request) {
        ApplicationContext applicationContext = WebApplicationContextUtils.getWebApplicationContext(request.getSession().getServletContext());
        UserService userService = applicationContext.getBean(UserService.class);

        JSONObject jo = new JSONObject();

        // 将各页面自定义的信息传递给Global
        Map globalValues = (Map) request.getAttribute(GLOBAL_VALUES);
        if (globalValues != null && globalValues instanceof Map) {
            jo.putAll(globalValues);
        }

        jo.put("allUserMap", userService.getAllUserMap());
        jo.put("allModules", MemoryCache.getObjectList(Module.class));
        jo.put("allCenters", MemoryCache.getObjectList(Center.class));
        jo.put("allStages", MemoryCache.getObjectList(Stage.class));
        jo.put("allLimitedWords", MemoryCache.getObjectMap(LimitedWord.class));
        jo.put("allCategories", MemoryCache.getObjectList(Category.class));
        jo.put("allProblems", MemoryCache.getObjectList(Problem.class));

        Map pageTableConfig = PageManager.pageConfig.getTables();
        jo.put("pageTableConfig", pageTableConfig);
        long autoSaveInterval = getAutoSaveInterval();
        if (debugMode)
            autoSaveInterval = 30 * 1000;//10second
        jo.put("autoSaveInterval", autoSaveInterval);
        jo.put("userPrivileges", request.getSession().getAttribute(ControllerBase.USER_PRIVILEGES));
        jo.put("userId", request.getSession().getAttribute(ControllerBase.USER_ID));
        jo.put("userName", request.getSession().getAttribute(ControllerBase.USER_NAME));
        jo.put("debugMode", debugMode);

        return jo.toString();
    }

    private static long getAutoSaveInterval() {
        DataTemplate dataTemplate = (DataTemplate)MemoryCache.getObject(DataTemplate.class, DataTemplate.ID_AUTO_SAVE_INTERVAL);
        long autoSaveInterval = 5 * 60 * 1000;
        if (dataTemplate != null && dataTemplate.getContent() != null) {
            autoSaveInterval = Long.valueOf(dataTemplate.getContent()) * 60 *1000;
            if (autoSaveInterval == 0)
                autoSaveInterval = 5 * 60 * 1000;
        }
        return autoSaveInterval;
    }
}
