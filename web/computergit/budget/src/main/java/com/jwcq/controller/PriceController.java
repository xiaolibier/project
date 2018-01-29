package com.jwcq.controller;

import com.jwcq.entity.Price;
import com.jwcq.service.PriceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by luotuo on 17-5-19.
 */

@Controller
@RequestMapping("/")
@EnableAutoConfiguration
public class PriceController {

    @Autowired
    private PriceService priceService;



    @RequestMapping(value = "/getAll")
    @ResponseBody
    public Map getPrice() {
        Map results = new HashMap();
        Iterable<Price> result =priceService.getAll();
        if (result == null || (!result.iterator().hasNext())) {
            results.put("message", "获取价格表为空，请更新后台数据库");
            results.put("success", 0);
        } else {
            results.put("result", result);
            results.put("message", "获取成功");
            results.put("success", 1);
        }
        return results;
    }


}
