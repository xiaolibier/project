package com.zhb.util;

import com.zhb.bean.Discovery;
import com.zhb.bean.Project;
import com.zhb.core.ObjectBase;
import com.zhb.manager.MemoryCache;
import org.hibernate.mapping.Column;
import org.hibernate.mapping.PersistentClass;
import org.hibernate.mapping.Property;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

/**
 * Created by zhouhaibin on 2016/11/14.
 * 字段校验工具
 */
public class ObjectVerifyUtil {
    static Map objectDisplayNames;
    static {
        objectDisplayNames = new HashMap();
        Map displayNames = new HashMap();
        displayNames.put("id", "项目编号");
        displayNames.put("name", "项目名称");
        displayNames.put("leaderId", "项目经理");
        displayNames.put("principal", "委托方");
        displayNames.put("description", "项目简介");
        displayNames.put("title", "题目");
        displayNames.put("assignee", "受托方");
        displayNames.put("address", "地址");

        displayNames.put("telephone", "联系方式");
        displayNames.put("mobilephone", "手机");
        displayNames.put("wechat", "微信公众号");
        displayNames.put("url", "网址");
        displayNames.put("purpose", "稽查目的");
        displayNames.put("range", "稽查范围");
        displayNames.put("foundation", "稽查依据");
        displayNames.put("versionno", "《试验方案》版本号");

        displayNames.put("versiondate", "《试验方案》版本日期");
        displayNames.put("sopno", "项目SOP版本号");
        displayNames.put("sopdate", "项目SOP版本日期");
        displayNames.put("medicine", "药物名称");
        displayNames.put("disease", "适应症");
        displayNames.put("registerCategory", "注册分类");
        displayNames.put("foundation", "项目名称");
        displayNames.put("auditType", "稽查类型");

        objectDisplayNames.put(Project.class, displayNames);


        displayNames = new HashMap();
        displayNames.put("description", "问题描述");
        objectDisplayNames.put(Discovery.class, displayNames);
    }

    public static String verify(ObjectBase object) throws Exception {
        VerifyError verifyError = verifyObject(object);
        if (verifyError == null)
            return null;
        return format(object.getClass(), verifyError);
    }

    private static String getDisplayName(Class clazz, String fieldName) {
        Map displayNames = (Map)objectDisplayNames.get(clazz);
        if (displayNames == null)
            return fieldName;
        String displayName = (String)displayNames.get(fieldName);
        if (displayName == null)
            return fieldName;
        return displayName;
    }

    private static String format(Class clazz, VerifyError verifyError) {
        String errorDescription = "";
        String fieldDisplayName = getDisplayName(clazz, verifyError.getFieldName());
        switch(verifyError.getType()) {
            case VerifyError.TYPE_IS_NULL:
                errorDescription = String.format("[%s]不能为空", fieldDisplayName);
                break;
            case VerifyError.TYPE_EXCEED_MAX_LENGTH:
                errorDescription = String.format("[%s]长度超过了最大长度[%d]", fieldDisplayName, verifyError.getMaxLength());
                break;
        }
        return errorDescription;
    }

    private static VerifyError verifyObject(ObjectBase object) throws Exception {
        Class clazz = object.getClass();
        PersistentClass pc = MemoryCache.hibernateConfig.getClassMapping(clazz.getName());
        VerifyError verifyError = verifyProperty(object, clazz, pc.getIdentifierProperty());
        if (verifyError != null)
            return verifyError;
        for (Iterator iterator = pc.getPropertyIterator(); iterator.hasNext(); ) {
            Property property = (Property)iterator.next();
            verifyError = verifyProperty(object, clazz, property);
            if (verifyError != null)
                return verifyError;
        }
        return null;
    }

    private static VerifyError verifyProperty(ObjectBase object, Class clazz, Property property) throws IllegalAccessException, InvocationTargetException {
        String fieldName = property.getName();
        String methodName = "get" + fieldName.replaceFirst(fieldName.substring(0, 1), fieldName.substring(0, 1).toUpperCase());
        Column column = (Column)property.getColumnIterator().next();
        Method method = getClassMethod(clazz, methodName);
        Object value = method.invoke(object);
        if (!column.isNullable()) {
            if (value == null)
                return VerifyError.isNull(fieldName);
            if (value instanceof String) {
                String stringValue = (String)value;
                stringValue = stringValue.trim();
                if (stringValue.isEmpty())
                    return VerifyError.isNull(fieldName);
            }
        }
        if (value != null && value instanceof String) {
            if (column.getLength() < 65535 && ((String) value).length() > column.getLength()) {
                return VerifyError.exceedMaxLength(fieldName, column.getLength());
            }
        }
        return null;
    }

    private static Method getClassMethod(Class clazz, String methodName) {
        for (Method method : clazz.getMethods()) {
            // 注意：这里判断的方式，是用字符串的比较。很傻瓜，但能跑。要直接返回Field。我试验中，尝试返回Class，然后用getDeclaredField(String fieldName)，但是，失败了
            if (method.getName().equals(methodName)) {
                return method;// define in this class
            }
        }
        return null;
    }


}
