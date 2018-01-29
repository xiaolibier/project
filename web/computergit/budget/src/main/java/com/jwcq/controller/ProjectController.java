package com.jwcq.controller;

import com.aliyuncs.exceptions.ClientException;
import com.jwcq.config.Config;
import com.jwcq.entity.Project;
import com.jwcq.entity.Sponsor;
import com.jwcq.entity.User;
import com.jwcq.service.ProjectService;
import com.jwcq.service.SponsorService;
import com.jwcq.service.UserService;
import com.jwcq.utils.ShortMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.*;

/**
 * Created by liuma on 2017/5/19.
 */
@Controller
public class ProjectController {


    @Autowired
    ProjectService projectService;

    @Autowired
    SponsorService sponsorService;

    @Autowired
    UserService userService;

    @RequestMapping("/")
    public String home() {
        return "redirect:/view/home.html";
    }

    @RequestMapping("/logout")
    public String logout(){
        return "redirect:/logout";
    }

    @RequestMapping("/login")
    public String login(){
        return "redirect:/view/home.html";
    }





    //获取项目列表
    @RequestMapping(value = "/projectList")
    @ResponseBody
    Map getAllList() {//获取所有列表
        List<Project> result = projectService.findAll();
        Map results = new HashMap();
        results.put("result", result);
        results.put("message", "succeed");
        results.put("success", 1);
        return results;
    }

    //获取项目列表
    @RequestMapping(value = "/projectListPage")
    @ResponseBody
    Map getAllListPage(@RequestParam(value = "page", required = false) String page,
                       @RequestParam(value = "number", required = false) String number){//获取分页
        if(page==null)page="0";
        if(number==null)number="20";
        PageRequest pageRequest = new PageRequest(Integer.valueOf(page), Integer.valueOf(number));
        Iterable<Project> result = projectService.findAll(pageRequest);
        Map results = new HashMap();
        results.put("result", result);
        results.put("message", "succeed");
        results.put("success", 1);
        return results;
    }


    //项目搜索
    @RequestMapping(value = "/search")
    @ResponseBody
    Map search(@RequestParam(value = "serial", required = false) String serial_number,
               @RequestParam(value = "name", required = false) String name,
               @RequestParam(value = "sponsor", required = false) String sponsor,
               @RequestParam(value = "user",required = false)String user,
               @RequestParam(value = "state",required = false)String state,
               @RequestParam(value = "start", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date start,
               @RequestParam(value = "end", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date end) {//搜索功能

        if (start == null) {
            start = new Date();
            start.setTime(0);
        }
        if (end == null) end = new Date();
        if(serial_number==null)serial_number="";
        if(sponsor==null)sponsor="";
        if(user==null)user="";
        if(state==null)state="";

        if(userService.getRole().equals(Config.ADMIN)){
            //当前用户是超级管理员
            System.out.println("超级管理员"+"start time " + start + " end time" + end);
        }else if(userService.getRole().equals(Config.REVIEWER)){
            //商务部审核人员
            System.out.println("商务部人员"+"start time " + start + " end time" + end);
        }else if(userService.getRole().equals(Config.USER)){
            //普通用户人员
            System.out.println("普通用户人员"+"start time " + start + " end time" + end);
            user=userService.getUserInfo().getName();
        }

        List<Project> result = projectService.findByProjectLike(serial_number, name, sponsor,user,state,start, end);
        Map results = new HashMap();
        if (result == null || result.size() == 0) {
            results.put("message", "查询为空，请更新查询条件");
            results.put("success", 0);
        } else {
            results.put("result", result);
            results.put("message", "succeed");
            results.put("success", 1);
        }
        return results;
    }


    //项目搜索
    @RequestMapping(value = "/searchPage")
    @ResponseBody
    Map searchPage(@RequestParam(value = "serial", required = false) String serial_number,
                   @RequestParam(value = "name", required = false) String name,
                   @RequestParam(value = "sponsor", required = false) String sponsor,
                   @RequestParam(value = "user",required = false)String user,
                   @RequestParam(value = "state",required = false)String state,
                   @RequestParam(value = "audit",required = false)String audit,
                   @RequestParam(value = "start", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date start,
                   @RequestParam(value = "end", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date end,
                   @RequestParam(value = "page", required = false) String page,
                   @RequestParam(value = "number", required = false) String number) {//搜索功能

        if (start == null) {
            start = new Date();
            start.setTime(0);
        }
        if (end == null) end = new Date();
        if(name==null)name="";
        if(serial_number==null)serial_number="";
        if(sponsor==null)sponsor="";
        if(user==null)user="";
        if(page==null)page="0";
        if(number==null)number="20";
        if(state==null)state="";
        if(userService.getRole().equals(Config.ADMIN)){
            //当前用户是超级管理员
            System.out.println("超级管理员"+"start time " + start + " end time" + end);
        }else if(userService.getRole().equals(Config.REVIEWER)){
            //商务部审核人员
            System.out.println("商务部人员"+"start time " + start + " end time" + end);
        }else if(userService.getRole().equals(Config.USER)){
            //普通用户人员
            System.out.println("普通用户人员"+"start time " + start + " end time" + end);
            user=userService.getUserInfo().getName();

        }
        System.out.println(
                        "serial"+serial_number
                        + "name="+name
                        + " name "+name
                        + " sponsor"+sponsor
                        + " user"+user
                        +" state"+state
                        +" start" + start
                        + " end" + end
                        +" number="+number
                        +" page="+page);
        Sort sort = new Sort(Sort.Direction.DESC, "id");
        PageRequest pageRequest = new PageRequest(Integer.valueOf(page), Integer.valueOf(number), sort);

        Iterable<Project> result;
        if(audit==null){
            result = projectService.findByProjectLike(serial_number, name, sponsor, user,state,start, end, pageRequest);
        }else{
            result = projectService.findByAuditProjectLike(serial_number, name, sponsor, user,state,start, end, pageRequest);
        }
        Map results = new HashMap();
        if (result == null || (!result.iterator().hasNext())) {
            results.put("message", "查询为空，请更新查询条件");
            results.put("success", 0);
        } else {
            results.put("result", result);
            results.put("message", "succeed");
            results.put("success", 1);
        }
        return results;
    }


    //项目编辑
    @RequestMapping(value = "/edit")
    @ResponseBody
    Map search(@RequestParam("id") String id) {
        Project result = projectService.findProjectById(Integer.valueOf(id));
        Map results = new HashMap();
        if (result != null) {
            results.put("result", result);
            results.put("message", "succeed");
            results.put("success", 1);
        } else {
            results.put("message", "项目id出现问题，请联系管理员");
            results.put("success", 0);
        }
        return results;
    }

    //更新备注
    @RequestMapping(value = "/updateRemark")
    @ResponseBody
    Map updateRemark(@RequestParam("id") String id, @RequestParam("remark") String remark) {
        Map results = new HashMap();
        Project project = projectService.findProjectById(Integer.valueOf(id));

        if (project == null) {
            results.put("message", "项目id出现问题，请联系管理员");
            results.put("success", 0);
        } else {
            projectService.updateRemarks(project.getId(),remark);
            results.put("message", "备注更新成功");
            results.put("success", 1);
        }
        return results;
    }

    //新建项目信息，返回新建项目的project信息
    @RequestMapping(value = "/create")
    @ResponseBody
    Map create(@RequestParam(value = "serial_number") String serial_number,
               @RequestParam(value = "version") String version,
               @RequestParam(value = "name", required = false) String name,
               @RequestParam(value = "center_number", required = false) String center_number,
               @RequestParam(value = "budget_price", required = false) String budget_price,
               @RequestParam(value = "sponsor", required = false) String sponsor,
               @RequestParam(value = "type", required = false) String type,
               @RequestParam(value = "json1", required = false) String json1,
               @RequestParam(value = "json2", required = false) String json2,
               @RequestParam(value = "json3", required = false) String json3,
               @RequestParam(value = "json4", required = false) String json4,
               @RequestParam(value = "json5", required = false) String json5

    ) {
        Project project = new Project();
        project.setSerial_number(serial_number);
        project.setVersion(version);
        project.setName(name);
        project.setCenter_number(center_number);
        project.setBudget_price(budget_price);
        project.setSponsor(sponsor);
        project.setSponsor_code(sponsorService.findSponsorsByName(sponsor).getCode());
        project.setSponsor(type);
        project.setJson1(json1);
        project.setJson2(json2);
        project.setJson3(json3);
        project.setJson4(json4);
        project.setJson4(json5);
        project.setState(Config.TEMP);
        project.setUser(userService.getUserInfo().getName());
        project.setUser_phone(userService.getUserInfo().getContact());
        Map results = new HashMap();
        Project result = projectService.createProject(project);
        if (result == null) {
            results.put("message", "项目编号和版本号重复，请更新");
            results.put("success", 0);
        } else {
            results.put("result", result);
            results.put("message", "添加成功");
            results.put("success", 1);
        }
        return results;
    }

    //更新信息 都返回项目id信息
    @RequestMapping(value = "/update")
    @ResponseBody
    Map update(@RequestParam(value = "id") String id,
               @RequestParam(value = "serial_number", required = false) String serial_number,
               @RequestParam(value = "version", required = false) String version,
               @RequestParam(value = "name", required = false) String name,
               @RequestParam(value = "center_number", required = false) String center_number,
               @RequestParam(value = "budget_price", required = false) String budget_price,
               @RequestParam(value = "sponsor", required = false) String sponsor,
               @RequestParam(value = "type", required = false) String type,
               @RequestParam(value = "json1", required = false) String json1,
               @RequestParam(value = "json2", required = false) String json2,
               @RequestParam(value = "json3", required = false) String json3,
               @RequestParam(value = "json4", required = false) String json4,
               @RequestParam(value = "json5", required = false) String json5
    ) {
        Project project = projectService.findProjectById(Integer.valueOf(id));
        Map results = new HashMap();
        if (project == null) {
            results.put("message", "项目id出现问题，请联系管理员");
            results.put("success", 0);
        } else {
            project.setName(name);
            project.setCenter_number(center_number);
            project.setBudget_price(budget_price);
            project.setSponsor(sponsor);
            project.setSponsor_code(sponsorService.findSponsorsByName(sponsor).getCode());
            project.setSponsor(type);
            project.setJson1(json1);
            project.setJson2(json2);
            project.setJson3(json3);
            project.setJson4(json4);
            project.setJson4(json5);
            projectService.updateProject(project);
        }
        results.put("message", "保存成功");
        results.put("success", 1);
        return results;
    }

    //保存或者新建
    @RequestMapping(value = "/save")
    @ResponseBody
    Map save(@RequestParam(value = "id", required = false) String id,
             @RequestParam(value = "serial_number", required = true) String serial_number,
             @RequestParam(value = "version", required = true) String version,
             @RequestParam(value = "name", required = false) String name,
             @RequestParam(value = "center_number", required = false) String center_number,
             @RequestParam(value = "budget_price", required = false) String budget_price,
             @RequestParam(value = "sponsor", required = false) String sponsor,
             @RequestParam(value = "type", required = false) String type,
             @RequestParam(value = "json1", required = false) String json1,
             @RequestParam(value = "json2", required = false) String json2,
             @RequestParam(value = "json3", required = false) String json3,
             @RequestParam(value = "json4", required = false) String json4,
             @RequestParam(value = "json5", required = false) String json5
    ) {
        Map results = new HashMap();
        if(id==null){
            results.put("message", "项目id为空，请联系前台开发工程师~");
            results.put("success", 0);
            return results;
        }
        if(name==null)name="";
        if(center_number==null)center_number="";
        if(budget_price==null)budget_price="";
        if(type==null)type="";
        if(json1==null)json1="";
        if(json2==null)json2="";
        if(json3==null)json3="";
        if(json4==null)json4="";
        if(json5==null)json5="";
        serial_number = serial_number.trim();
        version = version.trim();
        Project project;
        project = new Project();
        project.setSerial_number(serial_number);//新建的时候可以修改项目编号
        project.setVersion(version);//新建的时候可以修改项目版本号
        project.setName(name);
        project.setCenter_number(center_number);
        project.setBudget_price(budget_price);
        project.setSponsor(sponsor);
        project.setSponsor_code(sponsorService.findSponsorsByName(sponsor).getCode());
        project.setType(type);
        project.setJson1(json1);
        project.setJson2(json2);
        project.setJson3(json3);
        project.setJson4(json4);
        project.setJson5(json5);
        //新建或者复制
        if (Integer.valueOf(id) <= 0) {
            //新建一个项目
            if (Integer.valueOf(id) == 0) {
                //新建的时候，编号+maxid
                if(serial_number!=null)serial_number=serial_number.replace("3A","3ABJ");
                project.setSerial_number(serial_number+"-"+com.jwcq.utils.Format.formatCode(projectService.findMaxId(),4));
                project.setVersion("V1.0");
                project.setVersion_num(0);
                project.setState(Config.TEMP);
                project.setUser(userService.getUserInfo().getName());
                project.setUser_phone(userService.getUserInfo().getContact());
                if (projectService.findMaxProjectId(project.getSerial_number()) > 0) {
                    results.put("message", "项目编号已存在，请修改项目编号或者进行复制项目操作！");
                    results.put("success", 0);
                    return results;
                }
            }
            //复制一个项目
            else if (Integer.valueOf(id) < 0) {
                int version_num = 1 + projectService.findMaxProjectId(project.getSerial_number());
                project.setVersion_num(version_num);
                project.setVersion("V1." + version_num);
                project.setState(Config.TEMP);//复制一个项目的状态还是暂存状态
                project.setUser(userService.getUserInfo().getName());
                project.setUser_phone(userService.getUserInfo().getContact());
            }
            if (projectService.createProject(project) == null) {
                results.put("message", "项目编号与版本号已存在，请查明修改！");
                results.put("success", 0);
                return results;
            } else {
                results.put("result", project);
                results.put("message", "保存成功");
                results.put("success", 1);
                return results;
            }

        } else {
            //保存一个项目
            project = projectService.findProjectById(Integer.valueOf(id));
            if (project == null) {
                results.put("message", "项目id出现问题，请联系管理员");
                results.put("success", 0);
                return results;
            }
        }
        project.setName(name);
        project.setSerial_number(serial_number);//保存也可以修改项目编号
        project.setCenter_number(center_number);
        project.setBudget_price(budget_price);
        project.setSponsor(sponsor);
        project.setSponsor_code(sponsorService.findSponsorsByName(sponsor).getCode());
        project.setType(type);
        project.setJson1(json1);
        project.setJson2(json2);
        project.setJson3(json3);
        project.setJson4(json4);
        project.setJson5(json5);
        projectService.updateProject(project);
        results.put("result", project);
        results.put("message", "保存成功");
        results.put("success", 1);
        return results;
    }


    //复制
    @RequestMapping(value = "/copy")
    @ResponseBody
    Map copy(@RequestParam("id") String id) {
        Project project = projectService.findProjectById(Integer.valueOf(id));
        Map results = new HashMap();
        if (project == null) {
            results.put("message", "项目id出现问题，请联系管理员");
            results.put("success", 0);
        } else {
            project.setId(-1);
            project.setPversion(project.getVersion());
            int version_num = 1 + projectService.findMaxProjectId(project.getSerial_number());
            project.setVersion_num(version_num);
            project.setVersion("V1." + version_num);
            project.setState(Config.TEMP);//复制一个项目的状态时，返回的暂存状态
            project.setUser(userService.getUserInfo().getName());
            project.setUser_phone(userService.getUserInfo().getContact());
            results.put("result", project);
            results.put("message", "复制成功");
            results.put("success", 1);
        }
        return results;
    }

    //删除
    @RequestMapping(value = "/delete")
    @ResponseBody
    Map delete(@RequestParam("id") String id) {
        Map results = new HashMap();
        if (projectService.deleteProjectById(Integer.valueOf(id))) {
            results.put("message", "删除成功");
            results.put("success", 1);
        } else {
            results.put("message", "删除成功");
            results.put("success", 0);
        }
        return results;
    }

    //提交项目审核
    @RequestMapping(value = "/submit")
    @ResponseBody
    Map submit(@RequestParam("id") String id) {
        Map results = new HashMap();
        if(id==null||id.equals("")||Integer.valueOf(id)<0){
            results.put("message", "项目未保存成功，请先保存项目！");
            results.put("success", 0);
        }
        else if (projectService.submitProjectById(Integer.valueOf(id))) {
            results.put("message", "提交审核成功");
            results.put("success", 1);
            try {
                List<User>notifiers=userService.getNotifier();
                String sponsor=projectService.findProjectById(Integer.valueOf(id)).getSponsor();
                if(sponsor.length()>10)sponsor=sponsor.substring(0,8)+"...";
                String name=userService.getUserInfo().getName();
                for(int i=0;i<notifiers.size();i++){
                    String notifier=notifiers.get(i).getName();
                    String phone=notifiers.get(i).getContact();
//                    sendMessage(notifier,name,sponsor,phone);
                    ShortMessage.sendMessage(notifier,name,sponsor,phone);
                }
            } catch (ClientException e) {
                System.out.println(" sendMessage erro ");
                e.printStackTrace();
            }

        } else {
            results.put("message", "提交审核失败");
            results.put("success", 0);
        }
        return results;
    }

    //审核通过
    @RequestMapping(value = "/passaudit")
    @ResponseBody
    Map pass(@RequestParam("id") String id) {
        Project project=projectService.findProjectById(Integer.valueOf(id));
        String serial_number=project.getSerial_number();//项目编号
        String auditor=userService.getUserInfo().getName();//评审员名称
        String result="通过";
        String phone=project.getUser_phone();
        Map results = new HashMap();
        if (projectService.passProjectById(Integer.valueOf(id))) {
            results.put("message", "通过审核");
            results.put("success", 1);
            try {
                ShortMessage.resultMessage(auditor,serial_number,result,phone);
            } catch (ClientException e) {
                System.out.println(" send result Message erro ");
                e.printStackTrace();
            }
        } else {
            results.put("message", "审核出现问题");
            results.put("success", 0);
        }
        return results;
    }
    //审核驳回
    @RequestMapping(value = "/reject")
    @ResponseBody
    Map reject(@RequestParam("id") String id) {
        Project project=projectService.findProjectById(Integer.valueOf(id));
        String serial_number=project.getSerial_number();//项目编号
        String auditor=userService.getUserInfo().getName();//评审员名称
        String result="驳回";
        String phone=project.getUser_phone();

        Map results = new HashMap();
        if (projectService.rejectProjectById(Integer.valueOf(id))) {
            results.put("message", "审核驳回");
            results.put("success", 1);
            try {
                ShortMessage.resultMessage(auditor,serial_number,result,phone);
            } catch (ClientException e) {
                System.out.println(" send result Message erro ");
                e.printStackTrace();
            }
        } else {
            results.put("message", "审核出现问题出现问题");
            results.put("success", 0);
        }
        return results;
    }


    /**
     * 获取所有申办方/委托方列表
     * */
    @RequestMapping(value = "/getSponsors")
    @ResponseBody
    Map getSponsors() {
        Map results = new HashMap();
        List<Sponsor> sponsors=sponsorService.findAllSponsor();

        if (sponsorService==null || sponsors.size()==0) {

            results.put("message", "申办方列表为空");
            results.put("success", 0);
        } else {
            results.put("result",sponsors);
            results.put("message", "申办方列表获取成功");
            results.put("success", 1);
        }
        return results;
    }

    /**
     * 新建委托方或者申办方
     * */
    @RequestMapping(value = "/saveSponsor")
    @ResponseBody
    Map saveSponsor(@RequestParam(value = "name", required = false) String name,
                    @RequestParam(value = "code", required = false) String code
                    ) {
        Map results = new HashMap();

        if (sponsorService.saveSponsor(name,code)) {

            results.put("message", "申办方添加成功");
            results.put("success", 1);
        } else {
            results.put("message", "申办方添加失败，名称或者编号重复");
            results.put("success", 0);
        }
        return results;
    }

    /**
     * 获取当前用户信息
     * */
    @RequestMapping(value = "/getUserInfo")
    @ResponseBody
    Map getUserInfo() {
        Map results = new HashMap();
            //TODO sso之后更换为当天用户信息
            results.put("result", userService.getUserInfo());
            results.put("message", "用户信息");
            results.put("success", 1);
        return results;
    }





}

