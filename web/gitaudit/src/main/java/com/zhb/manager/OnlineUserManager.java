package com.zhb.manager;

import org.apache.log4j.Logger;

import java.sql.Timestamp;
import java.util.*;

/**
 * Created by zhouhaibin on 2017/1/12.
 */
public class OnlineUserManager {
    static Logger logger = Logger.getLogger(OnlineUserManager.class);
    static Map<String, OnlineUser> onlineUsers = new HashMap<>();

    public static void addOnlineUser(String userId, String userName, String ip, String sessionId, String token) {
        OnlineUser onlineUser = new OnlineUser(userId, userName, ip, sessionId);
        onlineUser.setToken(token);
        onlineUsers.put(userId, onlineUser);
    }

    public static OnlineUser findUser(String userId) {
        OnlineUser onlineUser = onlineUsers.get(userId);
        if (onlineUser != null) {
            Timestamp now = new Timestamp(System.currentTimeMillis());
            Long timeDiff = (now.getTime() - onlineUser.getLoginTime().getTime()) / 1000; // Unit: second
            if (timeDiff > 1800) {
                removeUser(userId);
                return null;
            }
        }
        return onlineUser;
    }

    public static void removeUser(String userId) {
        if (onlineUsers.containsKey(userId)) {
            int size = onlineUsers.size();
            onlineUsers.remove(userId);
            logger.debug(String.format("User[%s] is removed from onlineUsers, size from[%d] to [%d]", userId, size, onlineUsers.size()));
        }
    }

    public static void removeUserBySessionId(String sessionId) {
        int size = onlineUsers.size();
        for (Iterator iterator = onlineUsers.keySet().iterator(); iterator.hasNext(); ) {
            String userId = (String)iterator.next();
            OnlineUser onlineUser = onlineUsers.get(userId);
            if (onlineUser.getSessionId().equals(sessionId)) {
                onlineUsers.remove(userId);
                logger.debug(String.format("Session[%s] is removed from onlineUsers, size from[%d] to [%d]", sessionId, size, onlineUsers.size()));
                break;
            }
        }
    }

    public static List getOnlineUserList() {
        List list = new ArrayList();
        for (Iterator iterator = onlineUsers.keySet().iterator(); iterator.hasNext(); ) {
            String userId = (String)iterator.next();
            OnlineUser onlineUser = onlineUsers.get(userId);
            list.add(onlineUser);
        }
        return list;
    }
}
