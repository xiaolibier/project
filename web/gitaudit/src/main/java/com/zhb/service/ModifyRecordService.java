package com.zhb.service;

import com.zhb.bean.*;
import com.zhb.core.ObjectBase;
import com.zhb.dao.DaoPara;
import com.zhb.manager.MemoryCache;
import com.zhb.query.QueryModifyRecordCondition;
import com.zhb.query.QueryResult;
import net.sf.json.JSONObject;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * Created by zhouhaibin on 2016/7/20.
 */

@Service("ModifyRecordService")
public class ModifyRecordService extends AuditServiceBase {
    static String [] OPERATION = {"增加", "修改", "删除", "建议已处理", "分级已处理"};
    public QueryResult loadModifyRecords(int start, int limit, QueryModifyRecordCondition condition) {
        DaoPara daoPara = condition.buildDaoPara();
        daoPara.setClazz(ModifyRecord.class);
        daoPara.addOrder("created", "desc");
        daoPara.setStart(start);
        daoPara.setLimit(limit);
        int totalCount = dao.getTotalCount(daoPara);
        List list = dao.loadList(daoPara);
        renderModifyRecords(list, start);
        QueryResult queryResult = QueryResult.buildResult(start, limit, totalCount, list);
        return queryResult;
    }

    private void renderModifyRecords(List list, int start) {
        Map userMap = MemoryCache.getObjectMap(User.class);
        for (int i = 0; i < list.size(); i ++) {
            ModifyRecord modifyRecord = (ModifyRecord)list.get(i);
            modifyRecord.setIndex(i + start + 1);
            StringBuffer sb = new StringBuffer();
            User user = (User)userMap.get(modifyRecord.getUserId());
            if (user != null)
                sb.append(user.getName());
            else
                sb.append(modifyRecord.getUserId());
            sb.append(OPERATION[modifyRecord.getOperation()]);
            sb.append("了一条记录");
            modifyRecord.setName(sb.toString());
        }
    }

    public void onAddModuleRecord(ModuleRecord moduleRecord, String userId, Task task) {
        ModifyRecord modifyRecord = new ModifyRecord();
        modifyRecord.updateMetadata(moduleRecord, task);
        modifyRecord.setOperation(ModifyRecord.OPERATION_ADD);
        modifyRecord.setUserId(userId);
        updateModifyRecord(modifyRecord);
    }

    public void onDeleteModuleRecord(ModuleRecord moduleRecord, String userId, Task task) {
        ModifyRecord modifyRecord = new ModifyRecord();
        modifyRecord.updateMetadata(moduleRecord, task);
        modifyRecord.setOperation(ModifyRecord.OPERATION_DELETE);
        modifyRecord.updateValueByModuleRecord(moduleRecord);
        modifyRecord.setUserId(userId);
        updateModifyRecord(modifyRecord);
    }

    public void onUpdateModuleRecord(ModuleRecord oldModuleRecord, ModuleRecord newModuleRecord, String userId, Task task) {
        List list = getFieldChanged(oldModuleRecord, newModuleRecord);
        for (int i = 0; i < list.size(); i ++) {
            ModifyRecord modifyRecord = (ModifyRecord)list.get(i);
            modifyRecord.updateMetadata(oldModuleRecord, task);
            modifyRecord.setOperation(ModifyRecord.OPERATION_UPDATE);
            modifyRecord.setUserId(userId);
            updateModifyRecord(modifyRecord);
        }
    }

    //获得模块记录里发生变化的字段列表
    private List getFieldChanged(ModuleRecord oldModuleRecord, ModuleRecord newModuleRecord) {
        List list = new ArrayList();
        JSONObject oldObject = JSONObject.fromObject(oldModuleRecord.getContent());
        JSONObject newObject = JSONObject.fromObject(newModuleRecord.getContent());
        for (Iterator iterator = oldObject.keys(); iterator.hasNext(); ) {
            String key = (String)iterator.next();
            Object oldValue = oldObject.get(key);
            Object newValue = newObject.get(key);
            if (!equal(oldValue, newValue)) {
                ModifyRecord modifyRecord = new ModifyRecord();
                modifyRecord.setFieldName(key);
                modifyRecord.setOldValue(oldValue == null ? "" : oldValue.toString());
                modifyRecord.setNewValue(newValue == null ? "" : newValue.toString());
                list.add(modifyRecord);
            }
        }
        return list;
    }

    //判断两个值是否相等
    private boolean equal(Object value1, Object value2) {
        if (value1 == null && value2 != null)
            return false;
        if (value2 == null && value1 != null)
            return false;
        if (value1 == null && value2 == null)
            return true;
        String string1 = value1.toString();
        String string2 = value2.toString();
        return string1.equals(string2);
    }


    public void onAddDiscovery(Discovery discovery, String userId, Task task) {
        ModifyRecord modifyRecord = new ModifyRecord();
        modifyRecord.updateMetadata(discovery, task);
        modifyRecord.setModuleId(findDiscoveryModuleId(discovery));
        modifyRecord.setOperation(ModifyRecord.OPERATION_ADD);
        modifyRecord.setUserId(userId);
        modifyRecord.setPatientNo(discovery.getPatientNo());
        updateModifyRecord(modifyRecord);
    }

    public void onDeleteDiscovery(Discovery discovery, String userId, Task task) {
        ModifyRecord modifyRecord = new ModifyRecord();
        modifyRecord.updateMetadata(discovery, task);
        modifyRecord.setModuleId(findDiscoveryModuleId(discovery));
        modifyRecord.setOperation(ModifyRecord.OPERATION_DELETE);
        modifyRecord.updateValueByDicovery(discovery);
        modifyRecord.setUserId(userId);
        modifyRecord.setPatientNo(discovery.getPatientNo());
        updateModifyRecord(modifyRecord);
    }

    public void onUpdateDiscovery(Discovery oldDiscovery, Discovery newDiscovery, String userId, Task task, ReportBase report) {
        List list = getFieldChanged(oldDiscovery, newDiscovery);
        for (int i = 0; i < list.size(); i ++) {
            ModifyRecord modifyRecord = (ModifyRecord)list.get(i);
            if (task != null) {
                modifyRecord.updateMetadata(oldDiscovery, task);
                modifyRecord.setModuleId(findDiscoveryModuleId(oldDiscovery));
            } else
                modifyRecord.updateMetadata(oldDiscovery, report);
            if (modifyRecord.getOperation() == ModifyRecord.OPERATION_UNKNOWN)
                modifyRecord.setOperation(ModifyRecord.OPERATION_UPDATE);
            modifyRecord.setUserId(userId);
            modifyRecord.setPatientNo(oldDiscovery.getPatientNo());
            updateModifyRecord(modifyRecord);
        }
    }

    //获得发现里发生变化的字段列表
    private List getFieldChanged(Discovery oldDiscovery, Discovery newDiscovery) {
        List list = new ArrayList();
        if (!equal(oldDiscovery.getLevel(), newDiscovery.getLevel()))
            list.add(new ModifyRecord(ModifyRecord.FIELD_NAME_LEVEL, oldDiscovery.getLevel(), newDiscovery.getLevel()));
        if (!equal(oldDiscovery.getPatientNo(), newDiscovery.getPatientNo()))
            list.add(new ModifyRecord(ModifyRecord.FIELD_NAME_PATIENTNO, oldDiscovery.getPatientNo(), newDiscovery.getPatientNo()));
        if (!equal(oldDiscovery.getCategoryId(), newDiscovery.getCategoryId()))
            list.add(new ModifyRecord(ModifyRecord.FIELD_NAME_CATEGORY, oldDiscovery.getCategoryId(), newDiscovery.getCategoryId()));
        if (!equal(oldDiscovery.getProblemId(), newDiscovery.getProblemId()))
            list.add(new ModifyRecord(ModifyRecord.FIELD_NAME_PROBLEM, oldDiscovery.getProblemId(), newDiscovery.getProblemId()));
        if (!equal(oldDiscovery.getDescription(), newDiscovery.getDescription()))
            list.add(new ModifyRecord(ModifyRecord.FIELD_NAME_DESCRIPTION, oldDiscovery.getDescription(), newDiscovery.getDescription()));
        if (!equal(oldDiscovery.getMemo(), newDiscovery.getMemo()))
            list.add(new ModifyRecord(ModifyRecord.FIELD_NAME_MEMO, oldDiscovery.getMemo(), newDiscovery.getMemo()));
        if (oldDiscovery.getInReport() != newDiscovery.getInReport())
            list.add(new ModifyRecord(ModifyRecord.FIELD_NAME_INREPORT, oldDiscovery.getInReport() == 1 ? "入报告" : "不入报告",
                    newDiscovery.getInReport() == 1 ? "入报告" : "不入报告"));
        if (oldDiscovery.getDescriptionOpinionAccepted() != newDiscovery.getDescriptionOpinionAccepted()) {
            ModifyRecord modifyRecord = new ModifyRecord(ModifyRecord.FIELD_NAME_DESCRIPTION, oldDiscovery.getDescriptionOpinionAccepted() == 1 ? "建议已处理" : "建议未处理",
                    newDiscovery.getDescriptionOpinionAccepted() == 1 ? "建议已处理" : "建议未处理");
            modifyRecord.setOperation(ModifyRecord.OPERATION_OPINION_ACCEPTED);
            list.add(modifyRecord);
        }
        if (oldDiscovery.getLevel2Accepted() != newDiscovery.getLevel2Accepted()) {
            ModifyRecord modifyRecord = new ModifyRecord(ModifyRecord.FIELD_NAME_LEVEL, oldDiscovery.getLevel2Accepted() == 1 ? "分级已处理" : "分级未处理",
                    newDiscovery.getLevel2Accepted() == 1 ? "分级已处理" : "分级未处理");
            modifyRecord.setOperation(ModifyRecord.OPERATION_LEVEL_ACCEPTED);
            list.add(modifyRecord);
        }
        return list;
    }

    //获得发生变化的依据
    private List getReferenceChanged(Map<String, String> oldReferences, Map newReferenceMap) {
        List list = new ArrayList();
        for (Iterator iterator = newReferenceMap.keySet().iterator(); iterator.hasNext(); ) {
            String id = (String)iterator.next();
            String oldName = oldReferences.get(id);
            String newName = (String)newReferenceMap.get(id);
            if (oldName == null) {//add
                ModifyRecord modifyRecord = new ModifyRecord();
                modifyRecord.setOperation(ModifyRecord.OPERATION_ADD);
                modifyRecord.setNewValue(newName);
                list.add(modifyRecord);
            } else {
                if (equal(oldName, newName)) {//update
                    ModifyRecord modifyRecord = new ModifyRecord();
                    modifyRecord.setOperation(ModifyRecord.OPERATION_UPDATE);
                    modifyRecord.setFieldName(ModifyRecord.FIELD_NAME_REFERENCE);
                    modifyRecord.setOldValue(oldName);
                    modifyRecord.setNewValue(newName);
                    list.add(modifyRecord);
                }
            }
        }
        for (Iterator iterator = oldReferences.keySet().iterator(); iterator.hasNext(); ) {
            String id = (String)iterator.next();
            if (!newReferenceMap.containsKey(id)) {//deleted
                String referenceName = oldReferences.get(id);
                ModifyRecord modifyRecord = new ModifyRecord();
                modifyRecord.setOperation(ModifyRecord.OPERATION_DELETE);
                modifyRecord.updateValueByReference(referenceName);
                list.add(modifyRecord);
            }
        }
        return list;
    }

    //当单中心报告的依据发生变化时
    public void onCenterReportReferenceChanged(ReportBase report, Map newReferenceMap, String userId) {
        List list = getReferenceChanged(report.getReferenceMap(), newReferenceMap);
        for (int i = 0; i < list.size(); i ++) {
            ModifyRecord modifyRecord = (ModifyRecord)list.get(i);
            modifyRecord.updateMetadata(report);
            modifyRecord.setTargetId(ModifyRecord.TARGET_ID_REFERENCE);
            modifyRecord.setUserId(userId);
            updateModifyRecord(modifyRecord);
        }
    }

    //当单中心报告的依据发生变化时
    public void onCenterReportReferenceChanged(ReportBase report, String oldReference, String newReference, String userId) {
        if (equal(oldReference, newReference))
            return;
        ModifyRecord modifyRecord = new ModifyRecord();
        modifyRecord.setOperation(ModifyRecord.OPERATION_UPDATE);
        modifyRecord.setOldValue(oldReference);
        modifyRecord.setNewValue(newReference);
        modifyRecord.setFieldName(ModifyRecord.FIELD_NAME_REFERENCE);
        modifyRecord.updateMetadata(report);
        modifyRecord.setTargetId(ModifyRecord.TARGET_ID_REFERENCE);
        modifyRecord.setUserId(userId);
        updateModifyRecord(modifyRecord);
    }

    //当单中心报告的其他值发生变化时
    public void onCenterReportValueChanged(ReportBase report, String fieldName, String oldValue, String newValue, String userId) {
        if (equal(oldValue, newValue))
            return;
        ModifyRecord modifyRecord = new ModifyRecord();
        modifyRecord.setOperation(ModifyRecord.OPERATION_UPDATE);
        modifyRecord.setOldValue(oldValue);
        modifyRecord.setNewValue(newValue);
        modifyRecord.setFieldName(fieldName);
        modifyRecord.updateMetadata(report);
        if (fieldName.equals(ModifyRecord.FIELD_NAME_OVERVIEW))
            modifyRecord.setTargetId(ModifyRecord.TARGET_ID_OVERVIEW);
        if (fieldName.equals(ModifyRecord.FIELD_NAME_PROBLEM))
            modifyRecord.setTargetId(ModifyRecord.TARGET_ID_PROBLEM_TYPE);
        modifyRecord.setUserId(userId);
        updateModifyRecord(modifyRecord);
    }

    public void onCenterReportOpinionAcceptedValueChanged(ReportBase report, String fieldName, String oldValue, String newValue, String userId) {
        if (equal(oldValue, newValue))
            return;
        ModifyRecord modifyRecord = new ModifyRecord();
        modifyRecord.setOperation(ModifyRecord.OPERATION_OPINION_ACCEPTED);
        modifyRecord.setOldValue(oldValue);
        modifyRecord.setNewValue(newValue);
        modifyRecord.setFieldName(fieldName);
        modifyRecord.updateMetadata(report);
        if (fieldName.equals(ModifyRecord.FIELD_NAME_OVERVIEW))
            modifyRecord.setTargetId(ModifyRecord.TARGET_ID_OVERVIEW);
        if (fieldName.equals(ModifyRecord.FIELD_NAME_PROBLEM))
            modifyRecord.setTargetId(ModifyRecord.TARGET_ID_PROBLEM_TYPE);
        modifyRecord.setUserId(userId);
        updateModifyRecord(modifyRecord);
    }

    //当单中心报告的"建议已处理"发生变化时
    public void onCenterReportOpinionAcceptedValueChanged(ReportBase report, Discovery discovery, String fieldName, String oldValue, String newValue, String userId) {
        if (equal(oldValue, newValue))
            return;
        ModifyRecord modifyRecord = new ModifyRecord();
        modifyRecord.setOperation(ModifyRecord.OPERATION_OPINION_ACCEPTED);
        modifyRecord.setOldValue(oldValue);
        modifyRecord.setNewValue(newValue);
        modifyRecord.setFieldName(fieldName);
        modifyRecord.updateMetadata(discovery, report);
        modifyRecord.setUserId(userId);
        updateModifyRecord(modifyRecord);
    }

    //当发现的值发生变化时
    public void onDiscoveryValueChanged(ReportBase report, Discovery discovery, String fieldName, String oldValue, String newValue, String userId) {
        if (equal(oldValue, newValue))
            return;
        ModifyRecord modifyRecord = new ModifyRecord();
        modifyRecord.setOperation(ModifyRecord.OPERATION_UPDATE);
        modifyRecord.setOldValue(oldValue);
        modifyRecord.setNewValue(newValue);
        modifyRecord.setFieldName(fieldName);
        modifyRecord.updateMetadata(discovery, report);
        modifyRecord.setUserId(userId);
        updateModifyRecord(modifyRecord);
    }

    private void updateModifyRecord(ModifyRecord modifyRecord) {
        modifyRecord.buildFulltext();
        dao.update(modifyRecord);
    }

    private String findDiscoveryModuleId(Discovery discovery) {
        Category category = (Category)MemoryCache.getObject(Category.class, discovery.getCategoryId());
        if (category == null)
            return ObjectBase.EMPTY_OBJECT;
        return category.getModuleId();
    }

}
