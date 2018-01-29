package com.zhb.core;

import com.zhb.dao.DaoException;
import com.zhb.dao.DaoOperation;
import org.apache.log4j.Logger;
import org.hibernate.JDBCException;

import java.lang.reflect.InvocationTargetException;

/**
 * Created with IntelliJ IDEA.
 * User: zhouhaibin
 * Date: 15-3-16
 * Time: 下午9:15
 * 异常处理类
 */
public class ExceptionHandle {
    protected static Logger logger = Logger.getLogger(ExceptionHandle.class);

    private String stackInfo;
    public String handle(Throwable e) {
        if (e instanceof InvocationTargetException) {
            return handle(((InvocationTargetException) e).getTargetException());
        }
        if (e instanceof DaoException) {
            //打印sql语句相关参数
            DaoException daoException = (DaoException) e;
            handleDaoException(daoException);
        }
		if (e instanceof JDBCException) {
            //hsql会转换为原生sql输出
            JDBCException jdbcException = (JDBCException)e;
			logger.error("EXCEPTION_SQL:" + jdbcException.getSQL());
        }

        String exceptionId;
        if (e.getCause() != null)
            exceptionId = handle(e.getCause());
        else {
            exceptionId = ObjectBase.generateID();
            printStackTrace(exceptionId, e);
        }
        return exceptionId;
    }

    protected void printStackTrace(String exceptionId, Throwable e) {
        StringBuffer sb = new StringBuffer();
//        sb.append("EID:").append(exceptionId);
        sb.append(e.toString()).append("\r\n");
        for (int i = 0; i < e.getStackTrace().length; i ++) {
            StackTraceElement stackTraceElement = e.getStackTrace()[i];
            //第0行不管是什么都需要输出
            if (i > 0) {
                if (!stackTraceElement.getClassName().contains("com.zhb") && !stackTraceElement.getClassName().contains("lucene"))
                    continue;
                if (stackTraceElement.toString().indexOf("$$") > 0)
                    continue;
                sb.append("\r\n");
            }
            sb.append("\t").append(stackTraceElement.toString());
        }
        stackInfo = sb.toString();
        logger.error(stackInfo);
    }

    public String getStackInfo() {
        return stackInfo;
    }

    public void handleDaoException(DaoException e) {
        DaoOperation daoOperation = e.getDaoOperation();
		if (daoOperation != null) {
            daoOperation.print(logger);
        }
    }

}
