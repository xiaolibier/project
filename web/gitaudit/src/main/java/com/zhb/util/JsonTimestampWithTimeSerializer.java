package com.zhb.util;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;

/**
 * Created by zhouhaibin on 2016/9/23.
 * 用于下行的数据中包含Timestamp（含时间）的，自动转换为json数据里的字符串数据
 */
public class JsonTimestampWithTimeSerializer extends JsonSerializer<Timestamp> {
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    @Override
    public void serialize(Timestamp timestamp, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException, JsonProcessingException {
        String formattedDate = dateFormat.format(timestamp);
        jsonGenerator.writeString(formattedDate);
    }
}
