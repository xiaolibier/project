package com.jwcq.controller;

import com.jwcq.config.Config;
import com.jwcq.entity.Confident;
import com.jwcq.entity.Price;
import com.jwcq.entity.User;
import com.jwcq.entity.result.Response;
import com.jwcq.service.ConfidentService;
import com.jwcq.service.PriceService;
import com.jwcq.service.UserService;
import com.jwcq.utils.Format;
import com.jwcq.utils.HttpUtils;
import com.jwcq.word.WordTools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayOutputStream;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by luotuo on 17-5-19.
 */

@RestController
@RequestMapping(method = {RequestMethod.GET, RequestMethod.POST}, value = "/confident")
@EnableAutoConfiguration
public class ConfidentController extends BaseController {

    @Autowired
    private ConfidentService confidentService;

    @Autowired
    UserService userService;


    @RequestMapping(value = "/search")
    @ResponseBody
    public Response search(
            @RequestParam(value = "code", required = false) String code,
            @RequestParam(value = "project_name", required = false) String project_name,
            @RequestParam(value = "sponsor", required = false) String sponsor,
            @RequestParam(value = "member", required = false) String username,
            @RequestParam(value = "create_head", required = false, defaultValue = "1970-01-01") String str_create_head,
            @RequestParam(value = "create_tail", required = false, defaultValue = "2070-01-01") String str_create_tail,
            @RequestParam(value = "page", required = false, defaultValue = "0") String page,
            @RequestParam(value = "number", required = false, defaultValue = "20") String number,
            @RequestParam(value = "direction", required = false, defaultValue = "0") String direction

    ) {
        PageRequest request = getPageRequest(page, number, direction);
        Date create_head = Format.formatDate(str_create_head);
        Date create_tail = Format.formatDate(str_create_tail);
        User user=userService.getUserInfo();
        Page<Confident> confidentList=null;
        if((Config.ADMIN).equals(user.getRole())||Config.REVIEWER.equals(user.getRole())){
            //商务部或者管理员
            confidentList=confidentService.findByparams(null,code,project_name,sponsor,username,create_head,create_tail,request);
        }else {//普通人员
            confidentList=confidentService.findByparams(Long.valueOf(user.getId()),code,project_name,sponsor,username,create_head,create_tail,request);
        }
        if(confidentList==null)return successResponse("查找结果为空","");
        else return successResponse("查找成功",confidentList);
    }

    /**
     * members
     * */
    @RequestMapping(value = "/members")
    @ResponseBody
    public Response member() {
        User user = userService.getUserInfo();
        List<String>members=new ArrayList<>();
        if(Config.ADMIN.equals(user.getRole())||Config.REVIEWER.equals(user.getRole()))
        members=confidentService.findMembers();
        else members.add(user.getName());
        return successResponse("查询成功",members);
    }
    /**
     * 新建
     */
    @RequestMapping(value = "/create")
    @ResponseBody
    public Response create(HttpServletRequest request) {
        User user = userService.getUserInfo();
        Confident confident = (Confident) HttpUtils.FormatRequest(request, Confident.class);
        confident.setUser_id(Long.valueOf(user.getId()));
        confident.setUser_name(user.getName());
        try {
            confident = confidentService.create(confident);
        } catch (Exception e) {
            return errorResponse("新建失败", "详情:" + e.getStackTrace());
        }
        confident.setCode("3A-"+Format.formatCode(confident.getId(),4));
        try {
            confident = confidentService.save(confident);
        } catch (Exception e) {
            return errorResponse("更新保密协议编号失败,协议编号有重复", "详情:" + e.getStackTrace());
        }
        return  successResponse("新建成功",confident);

    }

    /**
     * 获取某一条
     */
    @RequestMapping(value = "/edit")
    @ResponseBody
    public Response edit(
            @RequestParam(value = "id") Long id
    ) {
        Confident confident = confidentService.findById(id);
        if (confident == null) return errorResponse("更新失败，输入id有误", "查询失败");
        else return successResponse("获取成功", confident);
    }


    /**
     * 更新数据
     */
    @RequestMapping(value = "/update")
    @ResponseBody
    public Response update(
            @RequestParam(value = "id") Long id,
            HttpServletRequest request
    ) {
        Confident confident = confidentService.findById(id);
        if (confident == null) return errorResponse("更新失败，输入id有误", "查询失败");
        else confident = (Confident) HttpUtils.FormatRequest(request, confident);
        try {
            confident = confidentService.save(confident);
            return successResponse("保存成功", confident);
        } catch (Exception e) {
            return errorResponse("保存失败，协议编号有冲突，请重试填写", e.getStackTrace());
        }
    }

    /**
     * 删除
     */
    @RequestMapping(value = "/delete")
    @ResponseBody
    public Response update(
            @RequestParam(value = "id") Long id
    ) {
        Confident confident = confidentService.findById(id);
        if (confident == null) return errorResponse("删除失败，输入id有误", "查询失败");
        User user=userService.getUserInfo();
        if(Config.ADMIN.equals(user.getRole())||Config.REVIEWER.equals(user.getRole())){
            confidentService.delete(id);
        }else{
            if(user.getId()!=confident.getUser_id())return errorResponse("删除失败，没有权限","");
            confidentService.delete(id);
        }
        return successResponse("删除成功","");
    }
    /**
     * word 文档操作测试
     */
    @RequestMapping(value = "/word")
    @ResponseBody
    public void print(
            @RequestParam(value = "id",required = true)Long confident_id,
            HttpServletRequest request, HttpServletResponse response) {
        try {
            Confident confident=confidentService.findById(confident_id);
            if(confident==null)errorResponse("内部错误,请联系管理员", "输入错误");;
            response.reset();
            response.setContentType("application/file");
            response.setHeader("Expires", "0");
            response.setHeader("Cache-Control", "must-revalidate, post-check=0, pre-check=0");
            response.setHeader("Pragma", "public");
            String filename=confident.getSponsor()+"-"+confident.getProject_name()+"-"+confident.getCode()+"-";
            Date currentTime = new Date();
            SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMdd");
            filename+= formatter.format(currentTime)+".docx";
            response.setHeader("content-disposition", "attachment;filename="
                    + URLEncoder.encode(filename, "UTF-8"));
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ServletOutputStream out = response.getOutputStream();
            WordTools word = new WordTools();
            word.createWord(confident,baos);
            baos.writeTo(out);
            out.flush();
        } catch (Exception e) {
            errorResponse("内部错误,请联系管理员", e.toString());
        }


    }


}
