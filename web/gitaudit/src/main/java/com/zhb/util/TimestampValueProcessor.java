package com.zhb.util;

import net.sf.json.JsonConfig;
import net.sf.json.processors.JsonValueProcessor;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;

/**
 * Created by zhouhaibin on 2016/10/18.
 * 用于转换Timestamp数据为json字符串
 */
public class TimestampValueProcessor implements JsonValueProcessor {
    private final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    @Override
    public Object processArrayValue(Object o, JsonConfig jsonConfig) {
        return processObjectValue(null, o, jsonConfig);
    }

    @Override
    public Object processObjectValue(String s, Object o, JsonConfig jsonConfig) {
        return dateFormat.format((Timestamp)o);
    }
}
