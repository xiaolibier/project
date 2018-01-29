package com.zhb.util;

import net.sf.ezmorph.object.AbstractObjectMorpher;
import org.apache.log4j.Logger;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;

/**
 * Created by zhouhaibin on 2016/7/21.
 * 用于上行数据中包含日期时间字符串的，自动转换为Timestamp
 */
public class TimestampMorpher extends AbstractObjectMorpher {

    private Logger LOG = Logger.getLogger(TimestampMorpher.class);

    private String[] formats = new String[]{"yyyy-MM-dd HH:mm:ss","yyyy-MM-dd"};
    public void setFormats(String[] formats) {
        this.formats = formats;
    }

    public TimestampMorpher() {
        // TODO Auto-generated constructor stub
    }

    public TimestampMorpher(String[] formats) {
        this.formats = formats;
    }

    @Override
    public Object morph(Object dateStr) {
        // TODO Auto-generated method stub
        if(null == dateStr){
            return null;
        }
        if(Timestamp.class.isAssignableFrom(dateStr.getClass())){
            return (Timestamp)dateStr;
        }
        if(!supports(dateStr.getClass())){
//            throw new Exception(dateStr.getClass()+"不是支持的类型！");
        }
        String strValue = (String)dateStr;
        SimpleDateFormat dateParser = null;
        for(int i=0,k=formats.length;i<k;i++){
            if(null == dateParser){
                dateParser = new SimpleDateFormat(formats[i]);
            }else{
                dateParser.applyPattern(formats[i]);
            }
            try{
                return new Timestamp(dateParser.parse(strValue.toLowerCase()).getTime());
            }catch(Exception e){
//                e.printStackTrace();
            }
        }
        return new  java.sql.Timestamp(System.currentTimeMillis());//返回默认日期
    }

    @Override
    public Class morphsTo() {
        // TODO Auto-generated method stub
        return Timestamp.class;
    }
    public boolean supports(Class claszz){
        return String.class.isAssignableFrom(claszz);
    }
}