package com.zhb.controller;

import com.zhb.core.ExceptionHandle;
import com.zhb.util.TimestampMorpher;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.util.JSONUtils;
import org.apache.log4j.Logger;
import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by zhouhaibin on 2016/7/18.
 */
public class ControllerBase {
    public Logger logger = Logger.getLogger(ControllerBase.class);
    public static final String SUCCESS = "success";
    public static final String USER_ID = "userid";
    public static final String USER_NAME = "userName";
    public static final String USER_PRIVILEGES = "userPrivileges";

    public ControllerBase() {
        JSONUtils.getMorpherRegistry().registerMorpher(new TimestampMorpher());
    }

    public JSONObject getJsonObjectParameter(HttpServletRequest request) {
        String para = ServletRequestUtils.getStringParameter(request, "para", null);
        if (para == null)
            return null;
        return JSONObject.fromObject(para);
    }

    public String getStringParameter(HttpServletRequest request, String name) {
        JSONObject jsonObject = getJsonObjectParameter(request);
        if (!jsonObject.containsKey(name))
            return null;
        return jsonObject.getString(name);
    }

    public int getIntParameter(HttpServletRequest request, String name) {
        JSONObject jsonObject = getJsonObjectParameter(request);
        if (!jsonObject.containsKey(name))
            return 0;
        return jsonObject.getInt(name);
    }

    public boolean getBooleanParameter(HttpServletRequest request, String name) {
        JSONObject jsonObject = getJsonObjectParameter(request);
        if (!jsonObject.containsKey(name))
            return false;
        return jsonObject.getBoolean(name);
    }

    public Object getObjectParameter(HttpServletRequest request, String name, Class clazz) {
        JSONObject jsonObject = getJsonObjectParameter(request);
        JSONObject jsonParameter = jsonObject.getJSONObject(name);
        if (jsonObject == null)
            return null;
        return JSONObject.toBean(jsonParameter, clazz);
    }

    public JSONArray getJSONArrayParameter(HttpServletRequest request, String name) {
        JSONObject jsonObject = getJsonObjectParameter(request);
        JSONArray jsonArray = jsonObject.getJSONArray(name);
        return jsonArray;
    }

    public Object getObjectParameter(HttpServletRequest request, String name, Class clazz, Map classMap) {
        JSONObject jsonObject = getJsonObjectParameter(request);
        JSONObject jsonParameter = jsonObject.getJSONObject(name);
        if (jsonObject == null)
            return null;
        return JSONObject.toBean(jsonParameter, clazz, classMap);
    }

    //统一的Ajax请求的异常处理，如果发生异常，可以把有异常的堆栈和id，返回到客户端，可以在firebug中直接看到
    @ExceptionHandler
    @ResponseBody
    public Map exceptionHandler(HttpServletRequest request, Exception ex) throws Exception{
        Enumeration paraNamesEnum = request.getParameterNames();
        while (paraNamesEnum.hasMoreElements()) {
            String paraName = (String) paraNamesEnum.nextElement();
            String paraValue = request.getParameter(paraName);
            logger.debug("Parameter:[" + paraName + "],[" + paraValue + "]");
        }
        ExceptionHandle eh = new ExceptionHandle();
        String exceptionId = eh.handle(ex);

        if ( request instanceof MultipartHttpServletRequest)
            throw new Exception(eh.getStackInfo());

        Map result = new HashMap();
        result.put("exceptionId",exceptionId);
        result.put("stack", eh.getStackInfo());
        return result;
    }

    public Map successResult() {
        Map result = new HashMap();
        result.put("result", SUCCESS);
        return result;
    }

    public Map errorResult(String errorMessage) {
        Map result = new HashMap();
        result.put("errorMessage", errorMessage);
        return result;
    }

    public Map popupMessage(String errorMessage) {
        Map result = new HashMap();
        result.put("popupMessage", errorMessage);
        return result;
    }

    public String loadUserId(HttpServletRequest request){
        String userId = (String) request.getSession().getAttribute(USER_ID);
        return userId;
    }

    public static String getIpAddr(HttpServletRequest request) {
        String ip = request.getHeader("x-forwarded-for");
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}
