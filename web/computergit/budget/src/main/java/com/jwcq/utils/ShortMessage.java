package com.jwcq.utils;

import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.dysmsapi.model.v20170525.SendSmsRequest;
import com.aliyuncs.dysmsapi.model.v20170525.SendSmsResponse;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.profile.DefaultProfile;
import com.aliyuncs.profile.IClientProfile;
import com.jwcq.config.Config;

public class ShortMessage {

    /**
     * 内部报价审核通知
     * 通知给审核员
     * */
    public static String sendMessage(String notifier,String name,String sponsor,String phone) throws ClientException{
        if (StringUtils.isNotPhoneNum(phone))
            throw new ClientException("电话号码输入错误");
        String templateCode="SMS_105780062";//报价审核通知
        String params = "{\"notifier\": \""+notifier+"\",\"name\": \""+name+"\",\"sponsor\": \""+sponsor+"\"}";
        return send(templateCode,phone,params);
    }

    /**
     * @param auditor 审核员
     * @param serial_number 项目编号
     * @param result 审核通过或者驳回
     * @param phone 电话
     * */
    public static String resultMessage(String auditor,String serial_number,String result,String phone) throws ClientException{
        if (StringUtils.isNotPhoneNum(phone))
        throw new ClientException("电话号码输入错误");
        String params="{\"code\": \""+serial_number+"\",\"name\": \""+auditor+"\",\"result\": \""+result+"\"}";
        String templateCode="SMS_105810069";//
        return send(templateCode,phone,params);

    }
    private static String  send(String templateCode,String phone,String params) throws ClientException{
        if (StringUtils.isNotPhoneNum(phone))
            throw new ClientException("电话号码输入错误");
        System.setProperty("sun.net.client.defaultConnectTimeout", "10000");
        System.setProperty("sun.net.client.defaultReadTimeout", "10000");
        //初始化acsClient,暂不支持region化
        IClientProfile profile = DefaultProfile.getProfile("cn-hangzhou", Config.accessKeyId, Config.accessKeySecret);
        DefaultProfile.addEndpoint("cn-hangzhou", "cn-hangzhou", Config.product, Config.domain);
        IAcsClient acsClient = new DefaultAcsClient(profile);
        //组装请求对象-具体描述见控制台-文档部分内容
        SendSmsRequest request = new SendSmsRequest();
        //必填:待发送手机号
        request.setPhoneNumbers(phone);
        //必填:短信签名-可在短信控制台中找到
        request.setSignName("内部报价系统");
        //必填:短信模板-可在短信控制台中找到
        request.setTemplateCode(templateCode);
        //可选:模板中的变量替换JSON串,如模板内容为"亲爱的${name},您的验证码为${code}"时,此处的值为
        request.setTemplateParam(params);
        //选填-上行短信扩展码(无特殊需求用户请忽略此字段)
        //可选:outId为提供给业务方扩展字段,最终在短信回执消息中将此值带回给调用者
        request.setOutId("yourOutId");
        try {
            System.out.println("短信接口请求的数据----------------"+request.getPhoneNumbers());
            SendSmsResponse sendSmsResponse = acsClient.getAcsResponse(request);
            System.out.println("短信接口返回的数据----------------");
            System.out.println("Code=" + sendSmsResponse.getCode());
            System.out.println("Message=" + sendSmsResponse.getMessage());
            System.out.println("RequestId=" + sendSmsResponse.getRequestId());
            System.out.println("BizId=" + sendSmsResponse.getBizId());
        } catch (Exception e) {
            return "发送过程中出现问题"+e.getMessage();
        }
        return "发送成功";
    }

    public static void main(String[] args){
        try{
            sendMessage("邓习海","张三","XXX1","15011488150");
            resultMessage("稽查員","2010010","評審通過","15011488150");
        }catch (Exception e){

        }

    }
}
