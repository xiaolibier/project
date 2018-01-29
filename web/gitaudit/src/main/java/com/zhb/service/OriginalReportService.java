package com.zhb.service;

import com.zhb.bean.*;
import com.zhb.dao.Condition;
import com.zhb.dao.DaoPara;
import com.zhb.manager.MemoryCache;
import com.zhb.query.QueryResult;
import net.sf.json.JSONObject;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

/**
 * Created by zhouhaibin on 2016/7/20.
 */

@Service("OriginalReportService")
public class OriginalReportService extends AuditServiceBase {
    @javax.annotation.Resource(name="ProjectService")
    private ProjectService projectService;

    @javax.annotation.Resource(name="DiscoveryService")
    private DiscoveryService discoveryService;

    @javax.annotation.Resource(name="TaskService")
    private TaskService taskService;

    @javax.annotation.Resource(name="ModifyRecordService")
    private ModifyRecordService modifyRecordService;

    public boolean createOriginalReport(Task task, String creatorId, List moduleRecords, List discoveries) {
        if (!checkModuleRecords(moduleRecords))
            return false;
        OriginalReport originalReport = new OriginalReport(task);
        originalReport.setCreatorId(creatorId);
        originalReport.setCreated(new Timestamp(System.currentTimeMillis()));
        originalReport.setModuleRecords(moduleRecords);
        originalReport.setDiscoveries(discoveries);
        originalReport.list2Content();
        dao.save(originalReport);
        return true;
    }

    //检查模块记录，是否非空字段都填写了
    private boolean checkModuleRecords(List moduleRecords) {
        Map moduleMap = MemoryCache.getObjectMap(Module.class);
        Map tableMap = MemoryCache.getObjectMap(Table.class);
        for (int i = 0; i < moduleRecords.size(); i ++) {
            ModuleRecord moduleRecord = (ModuleRecord)moduleRecords.get(i);
            Module module = (Module)moduleMap.get(moduleRecord.getModuleId());
            Table table = (Table)tableMap.get(module.getTableId());
            JSONObject jsonObject = JSONObject.fromObject(moduleRecord.getContent());
            for (Field field : table.getFields()) {
                if (field.isNullable())
                    continue;
                Object value = jsonObject.get(field.getId());
                if (value == null || ((String)value).isEmpty()) {
                    errorMessage = String.format("模块记录[%s]的字段[%s]不能为空", moduleRecord.getId(), field.getName());
                    return false;
                }
            }
        }
        return true;
    }

    public OriginalReport loadOriginalReport(String id) {
        OriginalReport report = (OriginalReport)loadObjectById(id, OriginalReport.class);
        if (report == null)
            return null;
        report.content2List();
        return report;
    }

    public boolean reportExist(String id) {
        OriginalReport report = (OriginalReport)loadObjectById(id, OriginalReport.class);
        if (report == null)
            return false;
        return true;
    }

    public void updateOriginalReportScore(String reportId, int score, String itemScore, String userId) {
        String sql = "update OriginalReport set score=?,itemScore=?,scoreUserId=?,scoreTime=? where id=?";
        Timestamp now = new Timestamp(System.currentTimeMillis());
        dao.executeNativeSql(sql, new Object[] {
                score, itemScore, userId, now, reportId
        });
    }

    public void updateOriginalReportScoreStatus(String reportId, int scoreStatus) {
        String sql = "update OriginalReport set scoreStatus=? where id=?";
        dao.executeNativeSql(sql, new Object[] {scoreStatus, reportId});
    }

    public QueryResult loadOriginalReportsForScoring(int start, int limit, String userId, int scoreStatus, String keywords) {
        DaoPara daoPara = buildDaoPara(start, limit, userId, null, null, null, keywords);
        if (scoreStatus != -1) {
            daoPara.addCondition(Condition.EQUAL("scoreStatus", scoreStatus));
            if (scoreStatus == OriginalReport.SCORE_STATUS_UNSCORED)
                daoPara.addOrder("scoreTime", "desc");
            else
                daoPara.addOrder("created");
        } else {
            daoPara.addOrder("scoreStatus");
            daoPara.addOrder("created");
        }
        daoPara.setClazz(OriginalReport.class);
        int totalCount = dao.getTotalCount(daoPara);
        List list = dao.loadList(daoPara);
        QueryResult queryResult = QueryResult.buildResult(start, limit, totalCount, list);
        return queryResult;
    }

    public QueryResult loadOriginalReports(int start, int limit, String userId, String keywords) {
        DaoPara daoPara = buildDaoPara(start, limit, userId, null, null, null, keywords);
        daoPara.addOrder("created", "desc");
        daoPara.setClazz(OriginalReport.class);
        int totalCount = dao.getTotalCount(daoPara);
        List list = dao.loadList(daoPara);
        QueryResult queryResult = QueryResult.buildResult(start, limit, totalCount, list);
        return queryResult;
    }

    public void cancelOriginalReport(String id) {
        String sql = "update OriginalReport set canceled=1 where id=?";
        dao.executeNativeSql(sql, new Object[]{id});
    }

    public void cancelOriginalReportByProject(String projectId) {
        String sql = "update OriginalReport set canceled=1 where projectId=?";
        dao.executeNativeSql(sql, new Object[]{projectId});
    }

    public void cancelOriginalReportByProjectStage(String projectId, String stageId) {
        String sql = "update OriginalReport set canceled=1 where projectId=? and stageId=?";
        dao.executeNativeSql(sql, new Object[]{projectId, stageId});
    }

    public void startOriginalReport(String id) {
        String sql = "update OriginalReport set canceled=0 where id=?";
        dao.executeNativeSql(sql, new Object[]{id});
    }

    public void closeOriginalReport(String id) {
        String sql = "update OriginalReport set closed=1 where id=?";
        dao.executeNativeSql(sql, new Object[]{id});
    }

    public void closeOriginalReportByProject(String projectId) {
        String sql = "update OriginalReport set closed=1 where projectId=?";
        dao.executeNativeSql(sql, new Object[]{projectId});
    }
}
