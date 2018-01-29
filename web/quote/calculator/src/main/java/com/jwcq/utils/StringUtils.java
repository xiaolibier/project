package com.jwcq.utils;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by liuma on 2017/7/20.
 */
public class StringUtils {

    public static Long[] parseLongArray(String input) {
        if (input == null || input.length() == 0) return null;
        input = input.trim();
        input = input.replace("\"", "");
        input = input.replace("'", "");
        input = input.replace("，", ",");
        String[] idstr = input.split(",");
        Long[] idlongs = new Long[idstr.length];
        for (int i = 0; i < idlongs.length; i++) {
            idlongs[i] = Long.parseLong(idstr[i]);
        }
        return idlongs;
    }

    public static List<Long> StringToLongList(String inputs) {
        if(isBlank(inputs))return new ArrayList<>();
        inputs = inputs.trim();
        inputs = inputs.replace("\"", "");
        inputs = inputs.replace("'", "");
        String[] idstr = inputs.split(",");
        List<Long> LongList = new ArrayList<>();
        for (int i = 0; i < idstr.length; i++) {
            LongList.add(Long.parseLong(idstr[i]));
        }
        return LongList;
    }

    //字符串
    public static boolean isNotBlank(String input) {
        if (input == null) return false;
        return (!input.isEmpty());
    }

    public static boolean isBlank(String input) {
        if (input == null) return true;
        return input.isEmpty();
    }


    public static String join(List<String> input, char port) {
        return org.apache.tomcat.util.buf.StringUtils.join(input, port);
    }

    public static String joinLong(List<Long> inputs, char port) {
        if(inputs==null||inputs.size()==0)return "";
        List<String>newInput=new ArrayList<>();
        for(Long input:inputs)newInput.add(""+input);
        return org.apache.tomcat.util.buf.StringUtils.join(newInput, port);
    }



    public static Long StringToLong(String id){
        try{
            return Long.valueOf(id);
        }catch (Exception e){
            e.printStackTrace();
            return 0L;
        }

    }

    //替换标签，<br>换行
    public static String stripHtml(String input){
        if(isBlank(input))return null;
        // <p>段落替换为换行
        input = input.replaceAll("<p .*?>", "\r\n");
        // <br><br/>替换为换行
        input = input.replaceAll("<br\\s*/?>", "\r\n");
        // 去掉其它的<>之间的东西
        input = input.replaceAll("\\<.*?>", "");
        // 还原HTML
        // content = HTMLDecoder.decode(content);
        return input;
    }

}
