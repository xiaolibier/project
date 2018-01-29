package com.zhb.core;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.HashMap;

/**
 * Created by zhouhaibin on 2016/10/25.
 * 通用对象视图，用于Ajax请求的返回数据
 */
public class ObjectView extends HashMap {
    private final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

    public ObjectView() {
    }

    public ObjectView(String id, String name) {
        put("id", id);
        put("name", name);
    }

    public ObjectView(ObjectBase object) {
        put("id", object.getId());
        put("name", object.getName());
    }

    public void putDate(String key, Timestamp value) {
        put(key, dateFormat.format(value));
    }

    public String getId() {
        return (String)get("id");
    }
}
