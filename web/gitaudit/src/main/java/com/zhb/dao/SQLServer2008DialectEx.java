package com.zhb.dao;

import org.hibernate.dialect.SQLServer2008Dialect;
import org.hibernate.type.StandardBasicTypes;

import java.sql.Types;

/**
 * Created by zhouhaibin on 2016/8/21.
 */
public class SQLServer2008DialectEx extends SQLServer2008Dialect {
    public SQLServer2008DialectEx() {
        super();
        registerHibernateType(Types.NVARCHAR, StandardBasicTypes.STRING.getName());
        registerHibernateType(Types.LONGNVARCHAR, StandardBasicTypes.STRING.getName());
    }
}
