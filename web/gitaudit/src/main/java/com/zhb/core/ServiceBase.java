package com.zhb.core;

import com.zhb.dao.Condition;
import com.zhb.dao.DaoPara;
import com.zhb.dao.HibernateDao;
import com.zhb.util.ObjectVerifyUtil;

import java.util.List;

/**
 * Created by zhouhaibin on 2016/7/19.
 * 通用的服务基类
 */
public abstract class ServiceBase {
    @javax.annotation.Resource(name="HibernateDao")
    protected HibernateDao dao;
    protected String errorMessage;
    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public List loadList(String objectClassName, String orderBy, Integer start, Integer limit) {
        String sql = "from " + objectClassName + " orderBy " + orderBy;
        return dao.loadList(sql, start, limit);
    }

    public ObjectBase loadObjectById(String id, Class clazz) {
        DaoPara daoPara = buildDaoPara(new String[]{"id"}, new Object[]{id});
        daoPara.setClazz(clazz);
        ObjectBase object = (ObjectBase)dao.loadOne(daoPara);
        return object;
    }

    public void saveObject(ObjectBase object, Class clazz) {
        ObjectBase objectFromDB = (ObjectBase) loadObjectById(object.getId(), clazz);
        if (objectFromDB == null) {
            insertObject(object);
        } else {
            objectFromDB.copyForUpdate(object);
            updateObject(objectFromDB);
        }
    }

    public void updateObject(ObjectBase object) {
        dao.update(object);
    }

    public void insertObject(ObjectBase object) {
        dao.save(object);
    }

    public void deleteObject(String id, Class clazz) {
        ObjectBase object = (ObjectBase) loadObjectById(id, clazz);
        dao.delete(object);
    }

    protected DaoPara buildDaoPara(String[] paramNames, Object[] paramValues) {
        DaoPara daoPara = new DaoPara();
        if(paramNames != null && paramValues != null){
            for(int i= 0;i< paramNames.length;i++){
                String paramName = paramNames[i];
                Object paramValue = paramValues[i];
                daoPara.addCondition(Condition.EQUAL(paramName,paramValue));
            }
        }
        return daoPara;
    }

    public boolean verifyObject(ObjectBase object) throws Exception {
        errorMessage = ObjectVerifyUtil.verify(object);
        if (errorMessage != null)
            return false;
        return true;
    }

    public boolean objectExist(String id, String tableName) {
        String sql = "select count(*) from " + tableName + " where id=?";
        int count = dao.queryNativeForInt(sql, new Object[]{id});
        return count > 0;
    }

}
