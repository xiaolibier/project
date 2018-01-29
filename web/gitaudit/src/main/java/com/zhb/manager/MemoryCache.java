package com.zhb.manager;

import com.zhb.bean.*;
import com.zhb.core.ObjectBase;
import com.zhb.query.Filter;
import com.zhb.service.*;
import org.hibernate.cfg.Configuration;
import org.springframework.context.ApplicationContext;
import org.springframework.orm.hibernate4.LocalSessionFactoryBean;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by zhouhaibin on 2016/9/19.
 * 内存缓存管理
 */
public class MemoryCache {
    public static Map<String, Map> allObjectMap = new HashMap<>();
    public static ApplicationContext applicationContext;
    public static List filters;
    public static List mainCategories;
    public static Map userMap;
    public static int sessionTimeout = 1800;//session超时时间，默认是30分钟

    public static Configuration hibernateConfig;

    public static void initialize(ApplicationContext applicationContext) {
        //通过各个Service从数据库中初始化数据到内存
        applicationContext.getBean(CenterService.class).init();
        applicationContext.getBean(DepartmentService.class).init();
        applicationContext.getBean(UserService.class).init();
        applicationContext.getBean(RoleService.class).init();
        applicationContext.getBean(CategoryService.class).init();
        applicationContext.getBean(ProblemService.class).init();
        applicationContext.getBean(ReferenceService.class).init();
        applicationContext.getBean(DataTemplateService.class).init();

        //通过xml数据，初始化到内存
        MemoryCache.applicationContext = applicationContext;
        initObjectMap(Module.class);
        initObjectMap(Stage.class);
        initObjectMap(Table.class);
        initObjectMap(Field.class);
        initObjectMap(LimitedWord.class);
        initObjectMap(ScoreItem.class);
        initObjectMap(Privilege.class);
        initObjectMap(MainCategory.class);

        //初始化中心首字母的过滤
        initFilters();
        initMainCategory();

        LocalSessionFactoryBean factory = (LocalSessionFactoryBean)applicationContext.getBean("&sessionFactory");
        hibernateConfig = factory.getConfiguration();

        DataTemplate dataTemplate = (DataTemplate) getObject(DataTemplate.class, "SessionTimeout");
        if (dataTemplate != null && dataTemplate.getContent() != null && !dataTemplate.getContent().isEmpty())
            sessionTimeout = Integer.valueOf(dataTemplate.getContent()) * 60;
    }

    public static void initFilters() {
        filters = new ArrayList();
        filters.add(new Filter("all", "全部"));
        for (char c = 'A'; c <= 'Z'; c ++) {
            filters.add(new Filter(String.valueOf(c), String.valueOf(c)));
        }
        filters.add(new Filter("selected", "已选"));
    }

    private static <T> void initObjectMap(Class<T> clazz) {
        Map<String, T> objectMap = applicationContext.getBeansOfType(clazz);
        for (String id : objectMap.keySet()) {
            Object o = objectMap.get(id);
            ObjectBase object = (ObjectBase)o;
            object.setId(id);
        }
        allObjectMap.put(clazz.getName(), objectMap);
    }

    public static List getObjectList(Class clazz) {
        Map<String, ObjectBase> objectMap = allObjectMap.get(clazz.getName());
        List list = new ArrayList<>();
        for (String id : objectMap.keySet()) {
            ObjectBase object = objectMap.get(id);
            list.add(object);
        }
        return list;
    }

    public static Map getObjectMap(Class clazz) {
        return allObjectMap.get(clazz.getName());
    }

    public static void setObjectMap(Class clazz, Map map) {
        allObjectMap.put(clazz.getName(), map);
    }

    public static ObjectBase getObject(Class clazz, String id) {
        Map objectMap = allObjectMap.get(clazz.getName());
        if (objectMap == null)
            return null;
        return (ObjectBase)objectMap.get(id);
    }

    public static void addObject(ObjectBase object) {
        Map objectMap = allObjectMap.get(object.getClass().getName());
        if (objectMap == null)
            return;
        objectMap.put(object.getId(), object);
    }

    public static void deleteObject(Class clazz, String id) {
        Map objectMap = allObjectMap.get(clazz.getName());
        if (objectMap == null)
            return;
        objectMap.remove(id);
    }

    public static String getUserName(String id) {
        User user = (User)userMap.get(id);
        if (user == null)
            return "";
        return user.getName();
    }

    public static String getUserNameList(List<String> userIdList) {
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

    public static List getMainCategories() {
        return mainCategories;
    }

    private static void initMainCategory() {
        mainCategories = getObjectList(MainCategory.class);
        sortMainCategoryList(mainCategories);
        Map categoryMap = getObjectMap(Category.class);
        for (int i = 0; i < mainCategories.size(); i ++) {
            MainCategory mainCategory = (MainCategory)mainCategories.get(i);
            List<String> categoryNames = new ArrayList();
            for (int j = 0; j < mainCategory.getCategoryIds().size(); j ++) {
                String categoryId = mainCategory.getCategoryIds().get(j);
                Category category = (Category)categoryMap.get(categoryId);
                String categoryName = categoryId;
                if (category != null) {
                    categoryName = getCategoryName(category);
                }
                if (categoryId.equals("TOTAL")) {
                    categoryName = "总数";
                }
                categoryNames.add(categoryName);
            }
            mainCategory.setCategoryNames(categoryNames);
        }
    }

    private static String getCategoryName(Category category) {
        //去掉括号后面的部分
        String name = category.getName();
        int pos = name.indexOf("（");
        if (pos >= 0)
            return name.substring(0, pos);
        pos = name.indexOf("(");
        if (pos >= 0)
            return name.substring(0, pos);
        return name;
    }


    private static void sortMainCategoryList(java.util.List mainCategories) {
        for (int i = 0; i < mainCategories.size(); i ++) {
            MainCategory mainCategory1 = (MainCategory)mainCategories.get(i);
            for (int j = i + 1; j < mainCategories.size(); j ++) {
                MainCategory mainCategory2 = (MainCategory)mainCategories.get(i);
                if (mainCategory1.getId().compareTo(mainCategory2.getId()) > 0) {
                    mainCategories.set(i, mainCategory2);
                    mainCategories.set(j, mainCategory1);
                    mainCategory1 = mainCategory2;
                }
            }
        }
    }

    public static String getObjectName(Class clazz, String id) {
        if (id == null)
            return "";
        ObjectBase object = getObject(clazz, id);
        if (object == null)
            return "";
        return object.getName();
    }
}

