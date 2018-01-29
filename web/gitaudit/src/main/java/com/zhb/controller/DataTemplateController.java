package com.zhb.controller;

import com.zhb.service.DataTemplateService;
import com.zhb.util.PageUtil;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
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
public class DataTemplateController extends ControllerBase {
    @javax.annotation.Resource(name="DataTemplateService")
    private DataTemplateService dataTemplateService;

    @RequestMapping("/toDataTemplateManager")//跳转到数据模板管理页
    public String toDataTemplateManager(HttpServletRequest request) {
        String type = request.getParameter("type");
        Map globalValues = new HashMap();
        globalValues.put("type", type);
        request.setAttribute(PageUtil.GLOBAL_VALUES, globalValues);
        request.setAttribute("type", type);
        return "/jsp/dataTemplate-manager";
    }

    @RequestMapping("/loadDataTemplates")
    @ResponseBody
    public Map loadDataTemplates(HttpServletRequest request) {
        Map dataTemplates = dataTemplateService.loadDataTemplateMap();
        Map result = new HashMap();
        result.put("dataTemplates", dataTemplates);
        return result;
    }

    @RequestMapping("/updateDataTemplates")
    @ResponseBody
    public Map updateDataTemplates(HttpServletRequest request) {
        JSONArray jsonArray = getJSONArrayParameter(request, "dataTemplates");
        for (int i = 0; i < jsonArray.size(); i ++) {
            JSONObject jsonObject = jsonArray.getJSONObject(i);
            String id = jsonObject.optString("id");
            String content = jsonObject.optString("content");
            dataTemplateService.updateDataTemplate(id, content);
        }
        return successResult();
    }
}
