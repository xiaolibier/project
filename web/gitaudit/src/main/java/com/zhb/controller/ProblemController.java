package com.zhb.controller;

import com.zhb.bean.Problem;
import com.zhb.query.QueryResult;
import com.zhb.service.ProblemService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by zhouhaibin on 2016/7/20.
 */
@Controller
public class ProblemController extends ControllerBase {
    @javax.annotation.Resource(name="ProblemService")
    private ProblemService problemService;

    @RequestMapping("/toProblemManager")
    public String toProblemManager(HttpServletRequest request) {
        return "/jsp/problem-manager";
    }

    @RequestMapping("/loadProblems")
    @ResponseBody
    public Map loadProblems(HttpServletRequest request) {
        String moduleId = getStringParameter(request, "moduleId");
        String categoryId = getStringParameter(request, "categoryId");
        int start = getIntParameter(request, "start");
        int limit = getIntParameter(request, "limit");
        String keywords = getStringParameter(request, "keywords");
        QueryResult queryResult = problemService.loadProblems(start, limit, moduleId, categoryId, keywords);
        Map result = new HashMap();
        result.put("result", queryResult);
        return result;
    }

    @RequestMapping("/addProblem")
    @ResponseBody
    public Map addProblem(HttpServletRequest request) {
        Problem problem = (Problem)getObjectParameter(request, "problem", Problem.class);
        problemService.addProblem(problem);
        return successResult();
    }

    @RequestMapping("/updateProblem")
    @ResponseBody
    public Map editProblem(HttpServletRequest request) {
        Problem problem = (Problem)getObjectParameter(request, "problem", Problem.class);
        problemService.updateProblem(problem);
        return successResult();
    }

    @RequestMapping("/deleteProblem")
    @ResponseBody
    public Map deleteProblem(HttpServletRequest request) {
        String id = getStringParameter(request, "id");
        problemService.deleteProblem(id);
        return successResult();
    }
}
