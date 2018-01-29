package com.zhb.listener;

import com.zhb.controller.ControllerBase;
import com.zhb.manager.LockManager;
import com.zhb.manager.OnlineUserManager;
import org.apache.log4j.Logger;

import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

/**
 * Created by zhouhaibin on 2016/11/30.
 * 监控Session变化的监听器
 */
public class SessionListener implements HttpSessionListener {
    protected Logger logger = Logger.getLogger(SessionListener.class);
    @Override
    public void sessionCreated(HttpSessionEvent httpSessionEvent) {

    }

    @Override
    public void sessionDestroyed(HttpSessionEvent httpSessionEvent) {
        HttpSession session = httpSessionEvent.getSession();
        String sessionId = session.getId();
        String userId = (String)session.getAttribute(ControllerBase.USER_ID);
        if (userId != null)
            LockManager.releaseUserAllLocks(userId);
        LockManager.releaseSessionAllLocks(sessionId);
        if (userId != null)
            OnlineUserManager.removeUser(userId);
        else
            OnlineUserManager.removeUserBySessionId(sessionId);
        logger.info(String.format("User[%s] session destroyed", userId));
    }
}
