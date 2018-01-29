package com.zhb.dao;

import com.zhb.core.ObjectBase;
import org.apache.log4j.Logger;
import org.hibernate.JDBCException;

import java.lang.reflect.InvocationTargetException;

public class DaoException extends RuntimeException{
	private static final long serialVersionUID = 8844602256614491188L;
    private static Logger logger = Logger.getLogger(DaoException.class);
    private DaoOperation daoOperation;

    public DaoException(DaoOperation daoOperation, Throwable cause) {
        super(cause);
        this.daoOperation = daoOperation;
        handle(cause);
    }

    public DaoOperation getDaoOperation() {
        return daoOperation;
    }

    public String handle(Throwable e) {
        if (e instanceof InvocationTargetException) {
            return handle(((InvocationTargetException) e).getTargetException());
        }
		if (e instanceof JDBCException) {
            //hsql会转换为原生sql输出
            JDBCException jdbcException = (JDBCException)e;
			logger.debug("EXCEPTION_SQL:" + jdbcException.getSQL());
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
        sb.append("EXCEPTION_ID:").append(exceptionId);
        sb.append("\r\n").append(e.toString());
        for (int i = 0; i < e.getStackTrace().length; i ++) {
            StackTraceElement stackTraceElement = e.getStackTrace()[i];
            //第0行不管是什么都需要输出
            if (i > 0) {
                if (!stackTraceElement.getClassName().contains("dayangit") && !stackTraceElement.getClassName().contains("lucene"))
                    continue;
                if (stackTraceElement.toString().indexOf("$$") > 0)
                    continue;
                sb.append("\r\n");
            }
            sb.append("\t").append(stackTraceElement.toString());
        }
        logger.debug(sb.toString());
    }

}