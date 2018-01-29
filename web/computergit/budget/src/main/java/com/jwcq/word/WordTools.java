package com.jwcq.word;

import com.jwcq.entity.Confident;
import com.jwcq.utils.Format;
import org.springframework.util.ResourceUtils;

import java.io.*;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by liuma on 2017/10/11.
 */
public class WordTools {
    final private String sourceFile= "baomixieyi.docx";
    private static Map<String,String> map = new HashMap<String, String>();

    public WordTools(){

    }


    public void createWord(Confident confident, OutputStream outputStream) throws Exception {
        WordTemplate template;
        //新建word
        //File file = ResourceUtils.getFile("classpath:doc/"+sourceFile);
        InputStream inputStream = getClass().getClassLoader().getResourceAsStream("doc/"+sourceFile);
        template=new WordTemplate(inputStream);
        map.put("code", confident.getCode());//
        map.put("sponsorName", confident.getSponsor());
        map.put("projectName", confident.getProject_name());
        map.put("time", Format.getNowDayString());//当前时间
        template.replaceTag(map);//替换
        BufferedOutputStream bos = new BufferedOutputStream(outputStream);
        template.write(bos);
    }

    public static void main(String []arg){
        Confident confident = new Confident();
        confident.setCode("x-xxxx");
        confident.setProject_name("test");
        confident.setSponsor("test");
        WordTools wordTools= new WordTools();
        File file = new File("D:\\test.docx");
        FileOutputStream out;
        try {
            out = new FileOutputStream(file);
            wordTools.createWord(confident,out);

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e){
            e.printStackTrace();
        }
    }

}
