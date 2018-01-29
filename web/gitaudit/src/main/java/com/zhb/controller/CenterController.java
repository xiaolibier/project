package com.zhb.controller;

import com.zhb.bean.Center;
import com.zhb.query.QueryResult;
import com.zhb.service.CenterService;
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
public class CenterController extends ControllerBase {
    @javax.annotation.Resource(name="CenterService")
    private CenterService centerService;

    @RequestMapping("/toCenterManager")//跳转到中心管理页
    public String toCenterManager(HttpServletRequest request) {
        return "/jsp/center-manager";
    }

    @RequestMapping("/loadCenters")
    @ResponseBody
    public Map loadCenters(HttpServletRequest request) {
        String province = getStringParameter(request, "province");
        String city = getStringParameter(request, "city");
        String town = getStringParameter(request, "town");
        int start = getIntParameter(request, "start");
        int limit = getIntParameter(request, "limit");
        String keywords = getStringParameter(request, "keywords");
        QueryResult queryResult = centerService.loadCenters(start, limit, province, city, town, keywords);
        Map result = new HashMap();
        result.put("result", queryResult);
        return result;
    }

    @RequestMapping("/addCenter")
    @ResponseBody
    public Map addCenter(HttpServletRequest request) {
        Center center = (Center)getObjectParameter(request, "center", Center.class);
        if (!centerService.addCenter(center))
            return errorResult(centerService.getErrorMessage());
        return successResult();
    }

    @RequestMapping("/updateCenter")
    @ResponseBody
    public Map editCenter(HttpServletRequest request) {
        Center center = (Center)getObjectParameter(request, "center", Center.class);
        centerService.updateCenter(center);
        return successResult();
    }

    @RequestMapping("/deleteCenter")
    @ResponseBody
    public Map deleteCenter(HttpServletRequest request) {
        String id = getStringParameter(request, "id");
        centerService.deleteCenter(id);
        return successResult();
    }

    @RequestMapping("/loadProvince")
    @ResponseBody
    public Map loadProvince(HttpServletRequest request) {
        List list = centerService.loadProvince();
        Map result = new HashMap();
        result.put("list", list);
        return result;
    }

    @RequestMapping("/loadCity")
    @ResponseBody
    public Map loadCity(HttpServletRequest request) {
        String province = getStringParameter(request, "province");
        List list = centerService.loadCity(province);
        Map result = new HashMap();
        result.put("list", list);
        return result;
    }

    @RequestMapping("/loadTown")
    @ResponseBody
    public Map loadTown(HttpServletRequest request) {
        String province = getStringParameter(request, "province");
        String city = getStringParameter(request, "city");
        List list = centerService.loadTown(province, city);
        Map result = new HashMap();
        result.put("list", list);
        return result;
    }
}
