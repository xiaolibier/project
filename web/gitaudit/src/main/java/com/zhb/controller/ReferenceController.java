package com.zhb.controller;

import com.zhb.bean.Reference;
import com.zhb.query.QueryResult;
import com.zhb.service.ReferenceService;
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
public class ReferenceController extends ControllerBase {
    @javax.annotation.Resource(name="ReferenceService")
    private ReferenceService referenceService;

    @RequestMapping("/toReferenceManager")//跳转到依据管理页面
    public String toReferenceManager(HttpServletRequest request) {
        return "/jsp/reference-manager";
    }

    @RequestMapping("/loadReferences")
    @ResponseBody
    public Map loadReferences(HttpServletRequest request) {
        String moduleId = getStringParameter(request, "moduleId");
        String categoryId = getStringParameter(request, "categoryId");
        String problemId = getStringParameter(request, "problemId");
        int start = getIntParameter(request, "start");
        int limit = getIntParameter(request, "limit");
        String keywords = getStringParameter(request, "keywords");
        QueryResult queryResult = referenceService.loadReferences(start, limit, moduleId, categoryId, problemId, keywords);
        Map result = new HashMap();
        result.put("result", queryResult);
        return result;
    }

    @RequestMapping("/addReference")
    @ResponseBody
    public Map addReference(HttpServletRequest request) {
        Reference reference = (Reference)getObjectParameter(request, "reference", Reference.class);
        referenceService.addReference(reference);
        return successResult();
    }

    @RequestMapping("/updateReference")
    @ResponseBody
    public Map editReference(HttpServletRequest request) {
        Reference reference = (Reference)getObjectParameter(request, "reference", Reference.class);
        referenceService.updateReference(reference);
        return successResult();
    }

    @RequestMapping("/deleteReference")
    @ResponseBody
    public Map deleteReference(HttpServletRequest request) {
        String id = getStringParameter(request, "id");
        referenceService.deleteReference(id);
        return successResult();
    }
}
