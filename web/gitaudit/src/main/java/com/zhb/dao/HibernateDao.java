package com.zhb.dao;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.transform.Transformers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate4.SessionFactoryUtils;
import org.springframework.stereotype.Repository;

import java.io.Serializable;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

@Repository("HibernateDao")
@SuppressWarnings("all")
public class HibernateDao<T> {
    /** 未知 */
    public static final int DATABASE_TYPE_UNKNOWN = -1;
    /** sql server */
    public static final int DATABASE_TYPE_SQLSERVER = 0;
    /** oracle */
    public static final int DATABASE_TYPE_ORACLE = 1;
    /** db2 */
    public static final int DATABASE_TYPE_DB2 = 2;

    Logger logger = Logger.getLogger(HibernateDao.class);
    private SessionFactory sessionFactory;
//    private DaoPara daoPara;


    public SessionFactory getSessionFactory() {
        return sessionFactory;
    }

    @Autowired
    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    protected Session getCurrentSession() {
        Session session = sessionFactory.getCurrentSession();
        return session;
    }

    /**
     * 新增
     *
     * @param objectBase
     * @return
     */
    public Serializable save(T objectBase) {
        Serializable serializable = null;
        DaoOperation daoOperation = new DaoOperation("save", objectBase);
        try {
            this.getCurrentSession().clear();
            serializable = this.getCurrentSession().save(objectBase);
            this.getCurrentSession().flush();
        } catch (Exception e) {
            throw new DaoException(daoOperation, e);
        }
        return serializable;
    }

    /**
     * 删除
     *
     * @param objectBase
     * @return
     */
    public void delete(T objectBase) {
        DaoOperation daoOperation = new DaoOperation("delete", objectBase);
        try {
            Session session = this.getCurrentSession();
            session.clear();
            session.delete(objectBase);
            session.flush();
        } catch (Exception e) {
            throw new DaoException(daoOperation, e);
        }
    }

    /**
     * 条件删除
     *
     * @param daoPara
     */
    public void delete(DaoPara daoPara) {
//        this.daoPara = daoPara;
        final StringBuffer hql = new StringBuffer();
        final List<Object> paramValues = new ArrayList<Object>();
        hql.append("delete " + getFullClassName(daoPara.getClazz()) + " where 1=1");
        String where = buildQueryCondition(paramValues, daoPara);
        hql.append(where);
        executeSql(hql.toString(), paramValues.toArray());
//        Session session = this.getCurrentSession();
//        Query query  = session.createQuery(hql.toString());
//        if(paramValues != null && paramValues.size() > 0){
//            setParameters(query, paramValues.toArray());
//        }
//        query.executeUpdate();
    }

    public void executeSql(String sql, Object[] params) {
        DaoOperation daoOperation = new DaoOperation();
        try {
            daoOperation.addAction("execute", sql, params);
            Session session = this.getCurrentSession();
            Query query = session.createQuery(sql);
            if (params != null && params.length > 0) {
                setParameters(query, params);
            }
            query.executeUpdate();
            daoOperation.printActionTimeUsed();
        } catch (Exception e) {
            throw new DaoException(daoOperation, e);
        }
    }

    public void executeNativeSql(String sql, Object[] params) {
        DaoOperation daoOperation = new DaoOperation();
        try {
            daoOperation.addAction("execute", sql, params);
            Session session = this.getCurrentSession();
            Query query = session.createSQLQuery(sql);
            if (params != null && params.length > 0) {
                setParameters(query, params);
            }
            query.executeUpdate();
            daoOperation.printActionTimeUsed();
        } catch (Exception e) {
            throw new DaoException(daoOperation, e);
        }
    }

    /**
     * 批量删除
     *
     * @param objectBaseList
     */
    public void deleteBatch(List<T> objectBaseList) {
        logger.info("deleteBatch start!");
        if (objectBaseList != null && objectBaseList.size() > 0) {
            for (int i = 0; i < objectBaseList.size(); i++) {
                T objectBase = objectBaseList.get(i);
                delete(objectBase);
            }
        }
        logger.info("deleteBatch end!");
    }

    /**
     * 原生sql 删除
     *
     * @param sql
     * @param params
     */
    public void delete(String sql, Object[] params) {
        DaoOperation daoOperation = new DaoOperation();
        try {
            daoOperation.addAction("execute", sql, params);
            Session session = this.getCurrentSession();
            Query query = session.createSQLQuery(sql);
            if (params != null && params.length > 0) {
                setParameters(query, params);
            }
            query.executeUpdate();
            daoOperation.printActionTimeUsed();
        } catch (Exception e) {
            throw new DaoException(daoOperation, e);
        }
    }

    /**
     * 保存或更新
     *
     * @param objectBase
     */
    public void update(T objectBase) {
        DaoOperation daoOperation = new DaoOperation("update", objectBase);
        try {
            Session session = this.getCurrentSession();
            session.clear();
            session.saveOrUpdate(objectBase);
            session.flush();
        } catch (Exception e) {
            throw new DaoException(daoOperation, e);
        }
    }

    /**
     * 保存或更新
     *
     * @param objectBase
     */
//    public void updateDB(T objectBase) {
//        String logInfo = "";
//        Session session = sessionFactory.openSession();
//        Transaction transaction = session.beginTransaction();
//        try {
//            logInfo = "update " + getFullClassName(objectBase.getClass());
//            session.saveOrUpdate(objectBase);
//            if (transaction != null) {
//                transaction.commit();
//            }
//            logger.info(logInfo);
//        } catch (Exception e) {
//            transaction.rollback();
//            logger.info(logInfo);
//            throw new DaoException(logInfo, e);
//        } finally {
//            transaction = null;
//            session.clear();
//            if (session != null)
//                session.close();
//        }
//    }

    /**
     * 条件更新
     *
     * @param daoPara
     */
    public Boolean update(DaoPara daoPara) {
        DaoOperation daoOperation = new DaoOperation();
        try {
//            this.daoPara = daoPara;
            final StringBuffer hql = new StringBuffer();
            final List<Object> paramValues = new ArrayList<Object>();
            String set = buildSetCondition(paramValues, daoPara);
            if (set.isEmpty()) {
                return false;
            }
            hql.append("update " + getFullClassName(daoPara.getClazz()) + " set " + set + " where 1=1");
            String where = buildQueryCondition(paramValues, daoPara);
            hql.append(where);
            daoOperation.addAction("execute", hql.toString(), paramValues);
            Session session = this.getCurrentSession();
            Query query = session.createQuery(hql.toString());
            if (paramValues != null && paramValues.size() > 0) {
                setParameters(query, paramValues.toArray());
            }
            query.executeUpdate();
            daoOperation.printActionTimeUsed();
        } catch (Exception e) {
            throw new DaoException(daoOperation, e);
        }

        return true;
    }

    /**
     * 批量更新
     *
     * @param objectBaseList
     */
    public void updateBatch(List<T> objectBaseList) {
        logger.info("updateBatch start!");
        if (objectBaseList != null && objectBaseList.size() > 0) {
            for (int i = 0; i < objectBaseList.size(); i++) {
                update(objectBaseList.get(i));
            }
        }
        logger.info("updateBatch end!");
    }

    /**
     * 获取一个对象
     *
     * @param daoPara
     * @return
     */
    public T loadOne(DaoPara daoPara) {
        List<T> objectList = loadList(daoPara);
        if (objectList == null) {
            objectList = new ArrayList<T>();
        }
        if (objectList.size() == 0) {
            return null;
        }
        T obj = objectList.get(0);
        return obj;
    }

    /**
     * 返回符合条件的记录总数
     *
     * @param daoPara
     * @return
     */
    public Integer getTotalCount(DaoPara daoPara) {
        DaoOperation daoOperation = new DaoOperation();
        int total = 0;
        try {
            StringBuffer hql = new StringBuffer();
//            this.daoPara = daoPara;
            List<Object> paramValues = new ArrayList<Object>();

            hql.append("select count(*) from " + getFullClassName(daoPara.getClazz()) + " where 1=1");
            hql.append(buildQueryCondition(paramValues, daoPara));

            daoOperation.addAction("query", hql.toString(), paramValues);
            Session session = this.getCurrentSession();
            Query query = session.createQuery(hql.toString());
            if (paramValues != null && paramValues.size() > 0) {
                setParameters(query, paramValues.toArray());
            }
            Object result = query.uniqueResult();
            daoOperation.printActionTimeUsed();
            if (result == null) {
                return new Integer(0);
            }
            total = ((Long) result).intValue();
            logger.info("totalCount : " + total);
        } catch (Exception e) {
            throw new DaoException(daoOperation, e);
        }
        return total;
    }

    /**
     * 返回符合条件的记录总数
     *
     * @param daoPara
     * @return
     */
    public int getNativeTotalCount(DaoPara daoPara) {
        StringBuffer sql = new StringBuffer();
//        this.daoPara = daoPara;
        List<Object> paramValues = new ArrayList<Object>();

        sql.append("SELECT COUNT(*) FROM " + daoPara.getTableName() + " where 1=1");
        sql.append(buildQueryCondition(paramValues, daoPara));
        List list = loadNative(sql.toString(), paramValues.toArray(), null, null, null, null, true);
        Map record = (Map)list.get(0);
        Object object = record.values().toArray()[0];
        return Integer.valueOf(String.valueOf(object));
    }

    /**
     * 返回符合条件的记录
     *
     * @param daoPara
     * @return
     */
    public List<T> loadList(DaoPara daoPara) {
//        this.daoPara = daoPara;
        List<Object> paramValues = new ArrayList<Object>();
        StringBuffer hql = new StringBuffer();
        hql.append("from " + getFullClassName(daoPara.getClazz()) + " where 1=1");
        hql.append(buildQueryCondition(paramValues, daoPara));
        hql.append(buildOrderCondition(daoPara));

        return loadList(hql.toString(), daoPara.getStart(), daoPara.getLimit(), paramValues.toArray());
    }

    /**
     * 返回符合条件的记录
     *
     * @param hql
     * @param start
     * @param limit
     * @return
     */
    public List<T> loadList(String hql, Integer start, Integer limit) {
        return loadList(hql, start, limit, null);
    }

    /**
     * 返回符合条件的记录
     *
     * @param hql
     * @param start
     * @param limit
     * @return
     */
    public List<T> loadList(String hql, Integer start, Integer limit, Object[] params) {
        DaoOperation daoOperation = new DaoOperation();
        daoOperation.addAction("query", hql, params, start, limit);
        List list = null;
        try {
            Session session = this.getCurrentSession();
            Query query = session.createQuery(hql.toString());
            setParameters(query, params);
            if (limit != null) {
                query.setFirstResult(start);
                query.setMaxResults(limit);
            }
            list = query.list();
            daoOperation.printActionTimeUsed();
        } catch (Exception e) {
            throw new DaoException(daoOperation, e);
        }
        if (list == null) {
            return new ArrayList<T>();
        }
        return list;
    }

    /**
     * 原生sql 新增
     *
     * @param sql
     * @param params
     */
    public void saveNative(String sql, Object[] params) {
        DaoOperation daoOperation = new DaoOperation();
        try {
            daoOperation.addAction("execute", sql, params);
            Session session = this.getCurrentSession();
            Query query = session.createSQLQuery(sql);
            if (params != null && params.length > 0) {
                setParameters(query, params);
            }
            query.executeUpdate();
            daoOperation.printActionTimeUsed();
        } catch (Exception e) {
            throw new DaoException(daoOperation, e);
        }
    }

    /**
     * 原生sql 修改
     *
     * @param sql
     * @param params
     */
    public void updateNative(String sql, Object[] params) {
        DaoOperation daoOperation = new DaoOperation();
        try {
            daoOperation.addAction("execute", sql, params);
            Session session = this.getCurrentSession();
            Query query = session.createSQLQuery(sql);
            if (params != null && params.length > 0) {
                setParameters(query, params);
            }
            query.executeUpdate();
            daoOperation.printActionTimeUsed();
        } catch (Exception e) {
            throw new DaoException(daoOperation, e);
        }

    }

    /**
     * 原生sql 删除
     *
     * @param sql
     * @param params
     */
    public void deleteNative(String sql, Object[] params) {
        DaoOperation daoOperation = new DaoOperation();
        daoOperation.addAction("execute", sql, params);
        try {
            Session session = this.getCurrentSession();
            Query query = session.createSQLQuery(sql);
            if (params != null && params.length > 0) {
                setParameters(query, params);
            }
            query.executeUpdate();
            daoOperation.printActionTimeUsed();
        } catch (Exception e) {
            throw new DaoException(daoOperation, e);
        }

    }

    /**
     * 原生sql获取记录总数
     *
     * @param sql
     * @param parameters
     * @return
     */
    public int getNativeTotalCount(String sql, Object[] parameters) {
        DaoOperation daoOperation = new DaoOperation();
        daoOperation.addAction("query", sql, parameters);
        int totalCount = 0;
        try {
            Session session = this.getCurrentSession();
            Integer result = new Integer(0);
            Query query = session.createSQLQuery(sql);
            setParameters(query, parameters);
            if (query.uniqueResult() == null) {
                return 0;
            }
            result = ((Number) query.uniqueResult()).intValue();
            totalCount = result.intValue();
            logger.info("totalCount : " + totalCount);
        } catch (Exception e) {
            throw new DaoException(daoOperation, e);
        }
        return totalCount;
    }

    /**
     * 原生sql获取整型值
     *
     * @param sql
     * @param parameters
     * @return
     */
    public int queryNativeForInt(String sql, Object[] parameters) {
        DaoOperation daoOperation = new DaoOperation();
        daoOperation.addAction("query", sql, parameters);
        int value = 0;
        try {
            Session session = this.getCurrentSession();
            Integer result = new Integer(0);
            Query query = session.createSQLQuery(sql);
            setParameters(query, parameters);
            if (query.uniqueResult() == null) {
                return 0;
            }
            result = ((Number) query.uniqueResult()).intValue();
            value = result.intValue();
            logger.info("Int Value : " + value);
        } catch (Exception e) {
            throw new DaoException(daoOperation, e);
        }
        return value;
    }


    /**
     * 返回符合条件的记录
     *
     * @param daoPara
     * @return
     */
    public List<Object> loadNative(DaoPara daoPara) {
//        this.daoPara = daoPara;
        List<Object> paramValues = new ArrayList<Object>();
        StringBuffer sql = new StringBuffer();
        sql.append("SELECT * FROM " + daoPara.getTableName() + " where 1=1");
        sql.append(buildQueryCondition(paramValues, daoPara));
        sql.append(buildOrderCondition(daoPara));

        return loadNative(sql.toString(), paramValues.toArray(), daoPara.getStart(), daoPara.getLimit(), null, null, true);
    }

    /**
     * 原声sql分页查询指定排序规则
     *
     * @param sql
     * @param parameters
     * @param start
     * @param limit
     * @param orderBy
     * @param clazz
     * @return
     */
    public List<Object> loadNative(String sql, Object[] parameters, Integer start, Integer limit, String orderBy, Class clazz, boolean elementAsMap) {
        DaoOperation daoOperation = new DaoOperation();
        List list = null;
        try {
            if (orderBy != null) {
                sql = sql + orderBy;
            }
            daoOperation.addAction("query", sql, parameters, start, limit);
            Session session = this.getCurrentSession();
            Query query = null;
            if (clazz == null) {
                query = session.createSQLQuery(sql);
                if (elementAsMap) {
                    query.setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP);
                }
            } else {
                query = session.createSQLQuery(sql).addEntity(clazz);
            }

            if (limit != null && limit.intValue() != 0) {
                query.setFirstResult(start);
                query.setMaxResults(limit);
            }
            setParameters(query, parameters);
            list = query.list();
            daoOperation.printActionTimeUsed();
        } catch (Exception e) {
            throw new DaoException(daoOperation, e);
        }
        return list;
    }

    /**
     * 原声sql分页查询指定排序规则
     *
     * @param sql
     * @param parameters
     * @param start
     * @param limit
     * @param orderBy
     * @param clazz
     * @return
     */
    public List<Object> loadNative(String sql, Object[] parameters, Integer start, Integer limit, String orderBy, Class clazz) {
        return loadNative(sql, parameters, start, limit, orderBy, clazz, false);
    }

    /**
     * 原生sql分页查询不指定排序规则
     *
     * @param sql
     * @param params
     * @param start
     * @param limit
     * @param clazz
     * @return
     */
    public List<Object> loadNative(String sql, Object[] params, int start, int limit, Class clazz) {
        return loadNative(sql, params, start, limit, null, clazz);
    }

    /**
     * 原生sql参数带参数查询
     *
     * @param sql
     * @param params
     * @param clazz
     * @return
     */
    public List<Object> loadNative(String sql, Object[] params, Class clazz) {
        return loadNative(sql, params, null, null, null, clazz);
    }

    /**
     * 原声sql查询
     *
     * @param sql
     * @param clazz
     * @return
     */
    public List<Object> loadNative(String sql, Class clazz) {
        return loadNative(sql, null, null, null, null, clazz);
    }

    /**
     * 构建更新Set条件
     *
     * @param paramValues
     * @return
     */
    private String buildSetCondition(List<Object> paramValues, DaoPara daoPara) {
        if (daoPara == null) {
            return "";
        }
        Map<String, Object> values = daoPara.getValues();

        if (values == null) {
            return "";
        }
        if (values.size() == 0) {
            return "";
        }
        StringBuffer set = new StringBuffer();

        String questionMark = "?";
        for (Entry<String, Object> entry : values.entrySet()) {

            String key = entry.getKey();
            Object value = entry.getValue();
            paramValues.add(value);
            set.append(" ").append(key).append("=").append(questionMark).append(",");

        }
        if (set.length() > 0)
            set.delete(set.length() - 1, set.length());

        return set.toString();
    }


    /**
     * 根据clazz获取全类名
     *
     * @param clazz
     * @return
     */
    private String getFullClassName(Class clazz) {
        return clazz.getName();
    }

    /**
     * 设置参数
     *
     * @param query
     * @param parameters
     */
    protected void setParameters(Query query, Object[] parameters) {
        if (parameters == null || query == null)
            return;
        for (int i = 0; i < parameters.length; i++) {
            if (parameters[i] == null) {
                query.setString(i, null);
                continue;
            }
            if (parameters[i] instanceof String) {
                query.setString(i, (String) parameters[i]);
            } else if (parameters[i] instanceof Integer) {
                query.setInteger(i, (Integer) parameters[i]);
            } else if (parameters[i] instanceof Timestamp) {
                query.setTimestamp(i, (Timestamp) parameters[i]);
            } else if (parameters[i] instanceof Float) {
                query.setFloat(i, (Float) parameters[i]);
            } else if (parameters[i] instanceof java.util.Date) {
                query.setTimestamp(i, new Timestamp(((java.util.Date) parameters[i]).getTime()));
            }
        }
    }

    /**
     * 构建查询条件
     *
     * @param paramValues
     * @return
     */
    private String buildQueryCondition(List<Object> paramValues, DaoPara daoPara) {
        if (daoPara == null) {
            return "";
        }
        List<Condition> conditions = daoPara.getConditions();
        if (conditions.size() == 0) {
            return "";
        }
        StringBuffer where = new StringBuffer();
        for (Condition condition : conditions) {
            where.append(condition.buildLogicWhere());
            where.append(condition.buildCondition(paramValues));
        }
        return where.toString();
    }


    /**
     * 构建order条件
     *
     * @return
     */
    private String buildOrderCondition(DaoPara daoPara) {
        if (daoPara == null) {
            return "";
        }
        List<Order> orders = daoPara.getOrders();
        if (orders.size() == 0) {
            return "";
        }

        StringBuffer orderBuf = new StringBuffer();
        for (int i = 0; i < orders.size(); i++) {
            Order order = orders.get(i);
            String fieldName = order.getFieldName();
            String orderRule = order.getOrderRule();
            if (i == 0) {
                orderBuf.append(" " + fieldName + " " + orderRule);
            } else {
                orderBuf.append("," + fieldName + " " + orderRule);
            }
        }
        return " order by" + orderBuf.toString();
    }

    /**
     * 构建打印参数串
     *
     * @param paramValues
     * @return
     */
    private String paramLog(List<Object> paramValues) {
        String paramStr = "";
        if (paramValues != null)
            for (int i = 0; i < paramValues.size(); i++) {
                Object value = paramValues.get(i);
                if (i == 0) {
                    paramStr = paramStr + value;
                } else {
                    paramStr = paramStr + "," + value;
                }
            }
        return paramStr;

    }

    /**
     * 构建打印参数串
     *
     * @param paramValues
     * @return
     */
    private String paramLog(Object[] paramValues) {
        String paramStr = "";
        if (paramValues != null)
            for (int i = 0; i < paramValues.length; i++) {
                Object value = paramValues[i];
                if (i == 0) {
                    paramStr = paramStr + value;
                } else {
                    paramStr = paramStr + "," + value;
                }
            }
        return paramStr;

    }

    /**
     * 获取数据库类型
     *
     * @return
     */
    public int getDbType() {
        int dbType = DATABASE_TYPE_UNKNOWN;
        try {
            Connection c = getConnection();
            String company = c.getMetaData().getDatabaseProductName();
            c.close();

            if (company != null) {
                company = company.toLowerCase();

                if (company.startsWith("microsoft")) {
                    dbType = DATABASE_TYPE_SQLSERVER;
                }
                if (company.startsWith("oracle")) {
                    dbType = DATABASE_TYPE_ORACLE;
                }
                if (company.startsWith("db2")) {
                    dbType = DATABASE_TYPE_DB2;
                }
            }

        } catch (SQLException e) {
            logger.error("error: ", e);
        }
        return dbType;
    }

    public Connection getConnection() {
        Connection c = null;
        try {
            c = SessionFactoryUtils.getDataSource(sessionFactory).getConnection();
        } catch (SQLException e) {
            logger.error("connection get error: ", e);
        }
        return c;
    }
}
