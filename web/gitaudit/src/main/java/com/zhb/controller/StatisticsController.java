package com.zhb.controller;

import com.zhb.service.StatisticsService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by zhouhaibin on 2016/11/2.
 */
@Controller
public class StatisticsController extends ControllerBase {
    @javax.annotation.Resource(name="StatisticsService")
    private StatisticsService statisticsService;

    @RequestMapping("/toStatisticsManager")//进入报表统计页面
    public String toStatisticsManager(HttpServletRequest request) {
        return "/jsp/statistics-manager";
    }

    //加载项目成员详细报表的数据
    @RequestMapping("/loadMemberReport")
    @ResponseBody
    public Map loadMemberReport(HttpServletRequest request) {
        String dateFrom = getStringParameter(request, "dateFrom");
        String dateTo = getStringParameter(request, "dateTo");
        String userId = loadUserId(request);
        List list = statisticsService.buildMemberReport(dateFrom, dateTo);
        Map result = new HashMap();
        result.put("list", list);
        return result;
    }

    //加载评审员详细报表的数据
    @RequestMapping("/loadCheckerReport")
    @ResponseBody
    public Map loadCheckerReport(HttpServletRequest request) {
        String dateFrom = getStringParameter(request, "dateFrom");
        String dateTo = getStringParameter(request, "dateTo");
        String userId = loadUserId(request);
        List list = statisticsService.buildCheckerReport(dateFrom, dateTo);
        Map result = new HashMap();
        result.put("list", list);
        return result;
    }
}
