package com.zhb.controller;

import com.zhb.query.QueryModifyRecordCondition;
import com.zhb.query.QueryResult;
import com.zhb.service.ModifyRecordService;
import com.zhb.util.PageUtil;
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
public class ModifyRecordController extends ControllerBase {
    @javax.annotation.Resource(name="ModifyRecordService")
    private ModifyRecordService modifyRecordService;

    @RequestMapping("/toModifyRecordManager")
    public String toModifyRecordManager(HttpServletRequest request) {
        String object = request.getParameter("object");
        Map globalValues = new HashMap();
        globalValues.put("object", object);
        request.setAttribute(PageUtil.GLOBAL_VALUES, globalValues);
        request.setAttribute("object", object);
        return "/jsp/modify-record-manager";
    }

    @RequestMapping("/loadModifyRecords")
    @ResponseBody
    public Map loadModifyRecords(HttpServletRequest request) {
        int start = getIntParameter(request, "start");
        int limit = getIntParameter(request, "limit");
        QueryModifyRecordCondition condition = (QueryModifyRecordCondition)getObjectParameter(request, "condition", QueryModifyRecordCondition.class);
        QueryResult queryResult = modifyRecordService.loadModifyRecords(start, limit, condition);
        Map result = new HashMap();
        result.put("result", queryResult);
        return result;
    }
}
