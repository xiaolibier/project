package com.jwcq.controller;

import com.jwcq.entity.result.Response;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;

/**
 * Created by liuma on 2017/9/19.
 */
@Controller
public class BaseController {
    Sort sort = new Sort(Sort.Direction.DESC, "id");
    public PageRequest pageRequest = new PageRequest(0, 20, sort);


    //获取正确
    public Response successResponse(String message, Object result) {
        if (message == null) message = "处理成功";
        Response response = new Response();
        response.setSuccess(Response.SUCCEED);
        response.setMessage(message);
        if (result == null)
            result = 1;
        response.setResult(result);
        return response;
    }

    //出现错误
    public Response errorResponse(String message, Object result) {
        if (message == null) message = "处理失败";
        Response response = new Response();
        response.setSuccess(Response.ERROR);
        response.setMessage(message);
        if (result == null)
            result = 0;
        response.setResult(result);
        return response;
    }

    /**
     * 根据输入的值进行排序分页
     *
     * @param page      第几页从0开始
     * @param number    一页几条
     * @param direction 排序方向，0 表示逆序，1表示顺序
     * @param key       排序关键字
     */
    public PageRequest getPageRequest(String page, String number, String direction, String key) {
        PageRequest mpageRequest;
        try {
            Sort.Direction direc = Sort.Direction.DESC;//0 表示逆序，1表示顺序
            if (Integer.valueOf(direction) == 1) direc = Sort.Direction.ASC;
            Sort sort = new Sort(direc, key);
            mpageRequest = new PageRequest(Integer.valueOf(page), Integer.valueOf(number), sort);

        } catch (Exception e) {
            System.out.println("用户输入page或者number有问题");
            return pageRequest;
        }
        return mpageRequest;
    }

    /**
     * 根据输入的值进行排序分页,默认按照id排序
     *
     * @param page      第几页从0开始
     * @param number    一页几条
     * @param direction 排序方向，0 表示逆序，1表示顺序     *
     */
    public PageRequest getPageRequest(String page, String number, String direction) {
        return getPageRequest(page, number, direction, "id");
    }
}
