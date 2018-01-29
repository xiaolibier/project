package com.jwcq.controller;

import com.jwcq.config.Config;
import com.jwcq.entity.BudgetCalculator;

import com.jwcq.entity.User;
import com.jwcq.entity.result.Response;
import com.jwcq.repository.CalculatorRepository;
import com.jwcq.service.UserService;
import com.jwcq.utils.Format;
import com.jwcq.utils.SpecificationFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * Created by liuma on 2017/9/28.
 * 对外接口
 */
@Controller
@RequestMapping(method = {RequestMethod.GET, RequestMethod.POST}, value = "/open/calculator")
public class OpenCalculatorController extends BaseController {

    @Autowired
    UserService userService;

    @Autowired
    CalculatorRepository calculatorRepository;

    @RequestMapping("/")
    public String home() {
        return "redirect:/view/home.html";
    }

    //添加新的一条数据
    @RequestMapping(value = "/login")
    @ResponseBody
    public Response login(
            @RequestParam(value = "username", required = false) String username,
            @RequestParam(value = "password", required = false) String password
    ) {
        try{
        if (userService.isUser(username, password)) return successResponse("登录成功", username);
        else return errorResponse("登录失败", "null");
        }catch (Exception e){
            return errorResponse("登录失败","登录失败");
        }
    }


    //添加新的一条数据
    @RequestMapping(value = "/add")
    @ResponseBody
    public Response add(@RequestParam(value = "type", required = false) String type,
                        @RequestParam(value = "name", required = false) String name,
                        @RequestParam(value = "audit_num", required = false) String audit_num,
                        @RequestParam(value = "patient_num", required = false) String patient_num,
                        @RequestParam(value = "center_num", required = false) String center_num,
                        @RequestParam(value = "audit_time", required = false) String audit_time,
                        @RequestParam(value = "travell_cost", required = false) String travell_cost,
                        @RequestParam(value = "tech_serve_cost", required = false) String tech_serve_cost,
                        @RequestParam(value = "tax", required = false) String tax,
                        @RequestParam(value = "average_cost", required = false) String average_cost,
                        @RequestParam(value = "total_cost", required = false) String total_cost,
                        @RequestParam(value = "phone", required = false) String phone,
                        HttpServletRequest request
    ) {
        if(phone==null)return errorResponse("未登录，请登录后再试","");
        User user = userService.getUserByPhone(phone);
        try {
            BudgetCalculator budgetCalculator = new BudgetCalculator(type, name, audit_num, patient_num, center_num, audit_time, travell_cost, tech_serve_cost, average_cost, tax, total_cost);
            budgetCalculator.setCreate_time(Format.getNowDate());
            budgetCalculator.setIp(request.getRemoteHost());//ip地址
            budgetCalculator.setUser_id(Long.valueOf(user.getId()));//设置id
            calculatorRepository.save(budgetCalculator);
        } catch (Exception e) {
            return errorResponse("存储失败", e.getMessage());
        }
        return successResponse("存储成功", "");
    }

    //删除一条数据
    @RequestMapping(value = "/delete")
    @ResponseBody
    public Response delete(
            @RequestParam("id") Long id,
            @RequestParam(value = "phone", required = false) String phone
    ) {
        if(phone==null)return errorResponse("未登录，请登录后再试","");
        User user = userService.getUserByPhone(phone);
        try {
            BudgetCalculator budgetCalculator = calculatorRepository.getOne(id);
            if (budgetCalculator == null) return errorResponse("id输入错误", "id输入错误");
            if (!Config.ADMIN.equals(user.getRole())) {//非管理员
                if (user.getId() != budgetCalculator.getUser_id()) return errorResponse("没有权限删除", "没有权限删除");
            }
            calculatorRepository.delete(id);
        } catch (Exception e) {
            return errorResponse("删除失败", "删除失败");
        }
        return successResponse("删除成功", "删除成功");

    }

    //查找
    @RequestMapping(value = "/search")
    @ResponseBody
    public Response search(
            @RequestParam(value = "phone", required = false) String phone
    ) {
        if(phone==null)return errorResponse("未登录，请登录后再试","");
        User user = userService.getUserByPhone(phone);
        if (Config.ADMIN.equals(user.getRole())) {//管理员
            List<BudgetCalculator> result = calculatorRepository.findAll();
            return successResponse("message", result);
        } else {//非管理员
            Specification<BudgetCalculator> specifications = SpecificationFactory.equal("user_id", user.getId());
            List<BudgetCalculator> result = calculatorRepository.findAll(specifications);
            return successResponse("message", result);
        }
    }


}

