package com.zhb.controller;

import com.zhb.bean.Category;
import com.zhb.query.QueryResult;
import com.zhb.service.CategoryService;
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
public class CategoryController extends ControllerBase {
    @javax.annotation.Resource(name="CategoryService")
    private CategoryService categoryService;

    @RequestMapping("/toCategoryManager")//跳转到分类管理页
    public String toCategoryManager(HttpServletRequest request) {
        return "/jsp/category-manager";
    }

    @RequestMapping("/loadCategories")
    @ResponseBody
    public Map loadCategories(HttpServletRequest request) {
        String moduleId = getStringParameter(request, "moduleId");
        int start = getIntParameter(request, "start");
        int limit = getIntParameter(request, "limit");
        String keywords = getStringParameter(request, "keywords");
        QueryResult queryResult = categoryService.loadCategories(start, limit, moduleId, keywords);
        Map result = new HashMap();
        result.put("result", queryResult);
        return result;
    }

    @RequestMapping("/addCategory")
    @ResponseBody
    public Map addCategory(HttpServletRequest request) {
        Category category = (Category)getObjectParameter(request, "category", Category.class);
        categoryService.addCategory(category);
        return successResult();
    }

    @RequestMapping("/updateCategory")
    @ResponseBody
    public Map editCategory(HttpServletRequest request) {
        Category category = (Category)getObjectParameter(request, "category", Category.class);
        categoryService.updateCategory(category);
        return successResult();
    }

    @RequestMapping("/deleteCategory")
    @ResponseBody
    public Map deleteCategory(HttpServletRequest request) {
        String id = getStringParameter(request, "id");
        categoryService.deleteCategory(id);
        return successResult();
    }
}
