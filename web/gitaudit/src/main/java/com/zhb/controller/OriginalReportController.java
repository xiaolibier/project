package com.zhb.controller;

import com.zhb.bean.*;
import com.zhb.manager.MemoryCache;
import com.zhb.query.QueryResult;
import com.zhb.service.*;
import com.zhb.util.PageUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by zhouhaibin on 2016/7/20.
 */
@Controller
public class OriginalReportController extends ControllerBase {
    @javax.annotation.Resource(name="OriginalReportService")
    private OriginalReportService reportService;

    @javax.annotation.Resource(name="TaskService")
    private TaskService taskService;

    @RequestMapping("/toOriginalReportManager")//进入原始版稽查记录表管理页面
    public String toOriginalReportManager(HttpServletRequest request) {
        return "/jsp/original-report-manager";
    }

    @RequestMapping("/originalReportDetail")//进入原始版稽查记录表详情页面
    public String originalReportDetail(HttpServletRequest request) {
        String id = request.getParameter("id");
        Map globalValues = new HashMap();
        globalValues.put("reportId", id);
        request.setAttribute(PageUtil.GLOBAL_VALUES, globalValues);
        return "/jsp/original-report-detail";
    }

    @RequestMapping("/loadOriginalReport")
    @ResponseBody
    public Map loadOriginalReport(HttpServletRequest request) {
        String id = getStringParameter(request, "id");
        OriginalReport report = reportService.loadOriginalReport(id);
        Task task = taskService.loadTask(report.getTaskId());
        Map result = new HashMap();
        result.put("report", report);
        result.put("task", task);
        result.put("tableMap", MemoryCache.getObjectMap(Table.class));
        result.put("moduleMap", MemoryCache.getObjectMap(Module.class));
        result.put("categoryMap", MemoryCache.getObjectMap(Category.class));
        result.put("problemMap", MemoryCache.getObjectMap(Problem.class));
        return result;
    }

    @RequestMapping("/toReportScoreManager")//进入研究中心评价表管理页面
    public String toReportScoreManager(HttpServletRequest request) {
        return "/jsp/report-score-manager";
    }

    @RequestMapping("/toReportScoreDetail")//进入研究中心评价表详情页面
    public String toReportScoreDetail(HttpServletRequest request) {
        String id = request.getParameter("id");
        Map globalValues = new HashMap();
        globalValues.put("reportId", id);
        request.setAttribute(PageUtil.GLOBAL_VALUES, globalValues);
        return "/jsp/report-score-detail";
    }

    //更新报告的评价分数
    @RequestMapping("/updateReportScore")
    @ResponseBody
    public Map updateReportScore(HttpServletRequest request) {
        String reportId = getStringParameter(request, "id");
        String itemScore = getStringParameter(request, "itemScore");
        int score = getIntParameter(request, "score");
        String userId = loadUserId(request);
        reportService.updateOriginalReportScore(reportId, score, itemScore, userId);
        return successResult();
    }

    //在评价表详情页面加载单个原始稽查记录表
    @RequestMapping("/loadOriginalReportForScoring")
    @ResponseBody
    public Map loadOriginalReportForScoring(HttpServletRequest request) {
        String id = getStringParameter(request, "id");
        OriginalReport report = reportService.loadOriginalReport(id);
        List scoreItems = MemoryCache.getObjectList(ScoreItem.class);
        Map result = new HashMap();
        result.put("report", report);
        result.put("scoreItems", scoreItems);
        return result;
    }

    //提交评价分数
    @RequestMapping("/submitReportScore")
    @ResponseBody
    public Map submitReportScore(HttpServletRequest request) {
        String reportId = getStringParameter(request, "id");
        String itemScore = getStringParameter(request, "itemScore");
        int score = getIntParameter(request, "score");
        String userId = loadUserId(request);
        reportService.updateOriginalReportScore(reportId, score, itemScore, userId);
        reportService.updateOriginalReportScoreStatus(reportId, OriginalReport.SCORE_STATUS_SCORED);
        return successResult();
    }

    //在评价表管理页面加载原始稽查记录表列表
    @RequestMapping("/loadOriginalReportsForScoring")
    @ResponseBody
    public Map loadOriginalReportsForScoring(HttpServletRequest request) {
        String keywords = getStringParameter(request, "keywords");
        int scoreStatus = getIntParameter(request, "scoreStatus");
        int start = getIntParameter(request, "start");
        int limit = getIntParameter(request, "limit");
        String userId = loadUserId(request);
        QueryResult queryResult = reportService.loadOriginalReportsForScoring(start, limit, userId, scoreStatus, keywords);
        Map result = new HashMap();
        result.put("result", queryResult);
        return result;
    }

    @RequestMapping("/loadOriginalReports")
    @ResponseBody
    public Map loadOriginalReports(HttpServletRequest request) {
        String keywords = getStringParameter(request, "keywords");
        int start = getIntParameter(request, "start");
        int limit = getIntParameter(request, "limit");
        String userId = loadUserId(request);
        QueryResult queryResult = reportService.loadOriginalReports(start, limit, userId, keywords);
        Map result = new HashMap();
        result.put("result", queryResult);
        return result;
    }
}

