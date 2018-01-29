package com.zhb.service;

import com.zhb.bean.Discovery;
import com.zhb.bean.ReportBase;
import com.zhb.bean.Task;
import com.zhb.manager.LockManager;
import com.zhb.manager.MemoryCache;
import com.zhb.manager.ResourceLock;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by zhouhaibin on 2016/7/20.
 */

@Service("DiscoveryService")
public class DiscoveryService extends AuditServiceBase {
    @javax.annotation.Resource(name="ModifyRecordService")
    private ModifyRecordService modifyRecordService;

    public List loadDiscoveries(String taskId, String orderBy, String creatorId, String patientNoOrCode, String categoryId) {
        List parameters = new ArrayList();
        String sql = "from Discovery where taskId=?";
        parameters.add(taskId);

        if (!isValueEmpty(creatorId)) {
            //如果有此参数，则只列出自己创建的
            sql += " and creatorId=?";
            parameters.add(creatorId);
        }
        if (!isValueEmpty(categoryId)) {
            sql += " and categoryId=?";
            parameters.add(categoryId);
        }

        if (!isValueEmpty(patientNoOrCode)) {
            sql += " and (patientNo like ? or code like ?)";
            parameters.add("%" + patientNoOrCode + "%");
            parameters.add("%" + patientNoOrCode + "%");
        }

        sql += (" order by " + orderBy);

        List list = dao.loadList(sql, 0, 10000, parameters.toArray());
        return list;
    }

    public List loadDiscoveriesNoInReport(String taskId) {
        List parameters = new ArrayList();
        String sql = "from Discovery where taskId=? and inReport=0 order by created asc";
        parameters.add(taskId);
        List list = dao.loadList(sql, 0, 10000, parameters.toArray());
        return list;
    }

    public List loadDiscoveriesInReport(String taskId, String orderBy, String patientNoOrCode, String categoryId) {
        List parameters = new ArrayList();
        String sql = "from Discovery where taskId=? and inReport=1";
        parameters.add(taskId);
        if (!isValueEmpty(categoryId)) {
            sql += " and categoryId=?";
            parameters.add(categoryId);
        }

        if (!isValueEmpty(patientNoOrCode)) {
            sql += " and (patientNo like ? or code like ?)";
            parameters.add("%" + patientNoOrCode + "%");
            parameters.add("%" + patientNoOrCode + "%");
        }
        sql += (" order by " + orderBy);
        List list = dao.loadList(sql, 0, 10000, parameters.toArray());
        return list;
    }

    private String getMaxDiscoveryCode(Discovery discovery) {
        String sql = "select max(code) from Discovery where taskId=?";
        List list = dao.loadNative(sql, new Object[]{discovery.getTaskId()}, null);
        if (list.size() > 0)
            return (String)list.get(0);
        return null;
    }

    public void createDiscoveryCode(Discovery discovery) {
        String codePrefix = discovery.getTaskId() + "F";
        String maxCode = getMaxDiscoveryCode(discovery);
        int index = 1;
        if (maxCode != null) {
            index = Integer.valueOf(maxCode.substring(codePrefix.length())) + 1;
        }
        String code = codePrefix + String.format("%04d", index);
        discovery.setCode(code);
    }

    public void addDiscovery(Discovery discovery, String userId, Task task) {
        dao.save(discovery);
        modifyRecordService.onAddDiscovery(discovery, userId, task);
    }

    public void saveDiscovery(Discovery discovery, String userId, Task task, ReportBase report) {
        Discovery oldDiscovery = loadDiscovery(discovery.getId());
        modifyRecordService.onUpdateDiscovery(oldDiscovery, discovery, userId, task, report);
        oldDiscovery.copyForUpdate(discovery);
        dao.update(oldDiscovery);
    }

    public void updateDiscvoery(Discovery discovery) {
        dao.update(discovery);
    }

    public boolean deleteDiscovery(Discovery discovery, String userId, Task task) {
        String locker = LockManager.getResourceLocker(discovery.getCode());
        if (locker != null) {
            if (!locker.equals(userId)) {
                String lockerName = MemoryCache.getUserName(locker);
                errorMessage = String.format("该发现正在被[%s]编辑，您不能删除浏览该发现", lockerName);
                return false;
            }
        }
        dao.delete(discovery);
        modifyRecordService.onDeleteDiscovery(discovery, userId, task);
        return true;
    }

    public Discovery loadDiscovery(String id) {
        Discovery discovery = (Discovery)loadObjectById(id, Discovery.class);
        return discovery;
    }

//    public boolean canEditDiscovery(String id, String userId) {
//        return true;
//    }

    public boolean updateDiscoveryInReport(String id, int inReport) {
        Discovery discovery = loadDiscovery(id);
        if (inReport == 1) {
            if (isValueEmpty(discovery.getLevel())) {
                errorMessage = "[分级]不能为空";
                return false;
            }
            if (isValueEmpty(discovery.getCategoryId())) {
                errorMessage = "[分类]不能为空";
                return false;
            }
            if (isValueEmpty(discovery.getProblemId())) {
                errorMessage = "[问题归类]不能为空";
                return false;
            }
        }
        discovery.setInReport(inReport);
        updateObject(discovery);
        return true;
    }

    public void updateClassifyResult(JSONArray classifyResult) {
        for (int i = 0; i < classifyResult.size(); i ++) {
            JSONObject jsonObject = classifyResult.getJSONObject(i);
            String discoveryId = jsonObject.getString("discoveryId");
            String level2 = jsonObject.getString("level2");
            String sql = "update Discovery set level2=? where id=?";
            dao.executeNativeSql(sql, new Object[]{level2, discoveryId});
        }
    }

    public boolean verifyDiscovery(Discovery discovery) throws Exception {
        if (!super.verifyObject(discovery))
            return false;

        return true;
    }

    public boolean discoveryMetadataNotNull(String taskId) {
        String sql = "from Discovery where taskId=? and inReport=1";
        List list = dao.loadList(sql, 0, 10000, new Object[]{taskId});
        for (int i = 0; i < list.size(); i ++) {
            Discovery discovery = (Discovery)list.get(i);
            if (isValueEmpty(discovery.getLevel())) {
                errorMessage = String.format("稽查发现[%s]的[分级]不能为空", discovery.getCode());
                return false;
            }
            if (isValueEmpty(discovery.getCategoryId())) {
                errorMessage = String.format("稽查发现[%s]的[分类]不能为空", discovery.getCode());
                return false;
            }
            if (isValueEmpty(discovery.getProblemId())) {
                errorMessage = String.format("稽查发现[%s]的[问题归类]不能为空", discovery.getCode());
                return false;
            }
        }
        return true;
    }

    public boolean startEditDiscovery(String discoveryId, String  userId, String sessionId) {
        Discovery discovery = loadDiscovery(discoveryId);
        String locker = LockManager.getResourceLocker(discovery.getCode());
        if (locker != null) {
            if (!locker.equals(userId)) {
                String lockerName = MemoryCache.getUserName(locker);
                errorMessage = String.format("该发现正在被[%s]编辑，您只能浏览该发现", lockerName);
                return false;
            }
        }
        LockManager.addLock(discovery.getCode(), ResourceLock.RESOURCE_TYPE_DISCOVERY, userId, sessionId);
        return true;
    }

    public boolean endEditDiscovery(String discoveryId, String  userId) {
        Discovery discovery = loadDiscovery(discoveryId);
        if (discovery == null)
            return true;
        LockManager.releaseLock(discovery.getCode(), userId);
        return true;
    }

}
