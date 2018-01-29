package com.zhb.manager;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.zhb.util.JsonTimestampWithTimeSerializer;

import java.sql.Timestamp;

/**
 * Created by zhouhaibin on 2017/1/17.
 */
public class OnlineUser {
    String userId;
    String userName;
    String ip;
    String sessionId;
    Timestamp loginTime;
    String token;

    public OnlineUser(String userId, String userName, String ip, String sessionId) {
        this.userId = userId;
        this.userName = userName;
        this.ip = ip;
        this.sessionId = sessionId;
        loginTime = new Timestamp(System.currentTimeMillis());
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    @JsonSerialize(using=JsonTimestampWithTimeSerializer.class)
    public Timestamp getLoginTime() {
        return loginTime;
    }

    public void setLoginTime(Timestamp loginTime) {
        this.loginTime = loginTime;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
