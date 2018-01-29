package com.zhb.dao;

import org.apache.log4j.Logger;

import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhouhaibin
 * Date: 15-6-25
 * Time: 下午7:33
 * To change this template use File | Settings | File Templates.
 */
public class DaoOperation {
    protected static Logger logger = Logger.getLogger(DaoOperation.class);
    boolean logit = true;
    long startTime = System.currentTimeMillis();
	ArrayList<String> actions = new ArrayList();
	List objects = new ArrayList();

    public DaoOperation() {

    }

	public DaoOperation(boolean logit) {
        this.logit = logit;
	}

    public DaoOperation(String action, Object object) {
        addAction(action, object);
    }

    public DaoOperation(String action, String sql) {
        addAction(action, sql);
    }

	public void addAction(String action, Object object) {
        actions.add(action);
		objects.add(object);
        if (logit) {
            StringBuffer sb = new StringBuffer();
            sb.append("[").append(action).append("][");
            sb.append(object).append("]");
            logger.debug(sb.toString());
        }
	}

    public void addAction(String action, String sql, Object[] parameters) {
        actions.add(action);
   		objects.add(sql);
        if (logit) {
            StringBuffer sb = new StringBuffer();
            sb.append("[").append(action).append("][");
            sb.append(sql);
            if (parameters != null && parameters.length > 0) {
                sb.append("][");
                for (int i = 0; i < parameters.length; i++) {
                    if (parameters[i] == null)
                        sb.append("NULL");
                    else
                        sb.append(parameters[i]);
                    if (i < parameters.length - 1)
                        sb.append(";");
                }
            }
            sb.append("]");
            logger.debug(sb.toString());
        }
   	}

    public void addAction(String action, String sql, List<Object> parameters) {
        addAction(action, sql, parameters.toArray());
   	}

    public void addAction(String action, String sql, Object[] parameters, Integer start, Integer limit) {
        actions.add(action);
        objects.add(sql);
        if (logit) {
            StringBuffer sb = new StringBuffer();
            sb.append("[").append(action).append("][");
            sb.append(sql);
            if (parameters != null) {
                sb.append("][");
                for (int i = 0; i < parameters.length; i++) {
                    if (parameters[i] == null)
                        sb.append("NULL");
                    else
                        sb.append(parameters[i]);
                    if (i < parameters.length - 1)
                        sb.append(";");
                }
            }
            sb.append("]");
            if (start != null)
                sb.append("[start:").append(start).append("]");
            if (limit != null)
                sb.append("[limit:").append(limit).append("]");
            logger.debug(sb.toString());
        }
    }

    public void printActionTimeUsed() {
        long timeEclipsed = System.currentTimeMillis() - startTime;
        if (timeEclipsed <= 16)
            return;
        if (logit) {
            String sql = "";
            if (objects.size() > 0 && objects.get(0) instanceof String)
                sql = (String)objects.get(0);
            if (timeEclipsed < 1000) {
                logger.debug("[" + sql + "] end, time used=[" + timeEclipsed + "]ms");
            } else {
                logger.warn("[" + sql + "] end, time used=[" + timeEclipsed + "]ms");
            }
        }
    }

    public void print(Logger logger) {
        if (logger == null)
            logger = DaoOperation.logger;
        if (actions.size() == 0)
            return;
        StringBuffer sb = new StringBuffer();
        sb.append("[DAO_OPERATION]:");
        if (actions.size() == 1) {
           sb.append("[").append(actions.get(0)).append("][");
           sb.append(getObjects().get(0)).append("]");
        } else {
            for (int i = 0; i < actions.size(); i ++) {
               sb.append("[").append(actions.get(0)).append("][");
               sb.append(getObjects().get(0)).append("]");
                if (i != actions.size() - 1)
                    sb.append("\r\n");
            }
        }
        logger.debug(sb.toString());
    }

    public void clear() {
		actions.clear();
		objects.clear();
	}

    public List getObjects() {
        return objects;
    }

    public ArrayList<String> getActions() {
        return actions;
    }

}

